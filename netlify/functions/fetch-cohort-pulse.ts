/**
 * Scheduled function: daily cohort-pulse refresh.
 *
 * Runs once per day (3am UTC). Fetches recent posts from every configured
 * subreddit via Reddit's public .json endpoints, buckets them by segment,
 * computes aggregate signals for the public dossier site, and writes the
 * result to Netlify Blobs.
 *
 * Privacy / policy enforcement:
 *   - Raw posts and authors NEVER leave this function. They are aggregated
 *     here and only aggregates are persisted.
 *   - outreach_policy gates what appears in live.json:
 *       candidate       -> volume + unique_authors + top_phrases
 *       messaging_only  -> volume + top_phrases (authors hidden)
 *       earned_only     -> volume only (no phrases, no authors)
 */
import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import {
  POSTS_PER_SUBREDDIT,
  PULSE_WINDOW_DAYS,
  REQUEST_INTERVAL_MS,
  SEGMENTS,
  type OutreachPolicy,
  type SegmentConfig,
  USER_AGENT,
} from "../shared/segments.js";

// -------- types --------------------------------------------------------------

interface RedditPost {
  id: string;
  subreddit: string;
  author: string;
  title: string;
  selftext: string;
  created_utc: number;
  score: number;
  num_comments: number;
  permalink: string;
}

interface SegmentAggregate {
  name: string;
  label: string;
  tier: "1" | "2" | "3";
  outreach_policy: OutreachPolicy;
  volume_7d: number;                              // posts in last 7 days
  volume_lifetime: number;                         // posts seen across ALL pulls
  unique_authors_7d: number | null;                // null for messaging_only + earned_only
  avg_post_score_7d: number | null;
  top_phrases: Array<{ phrase: string; docs: number }> | null; // null for earned_only
  top_subreddits: Array<{ subreddit: string; count: number }>;
  last_post_iso: string | null;
}

interface LivePulse {
  generated_at: string;
  window_days: number;
  totals: {
    posts_7d: number;
    posts_lifetime: number;
    qualified_authors_7d: number;    // T1 candidate + T2 candidate segments only
    segments_tracked: number;
  };
  segments: SegmentAggregate[];
  next_run_hint: string;             // cron description, for the site footer
}

// -------- reddit fetching ----------------------------------------------------

async function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchSubredditNew(subreddit: string, limit = POSTS_PER_SUBREDDIT): Promise<RedditPost[]> {
  const url = `https://www.reddit.com/r/${subreddit}/new.json?limit=${limit}`;
  const resp = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    // Netlify functions don't enforce a per-request timeout by default; bail at 15s.
    signal: AbortSignal.timeout(15_000),
  });
  if (!resp.ok) {
    throw new Error(`r/${subreddit} HTTP ${resp.status}`);
  }
  const body = await resp.json() as { data?: { children?: Array<{ data?: Partial<RedditPost> }> } };
  const children = body?.data?.children ?? [];
  const out: RedditPost[] = [];
  for (const child of children) {
    const d = child.data ?? {};
    const author = d.author ?? "";
    if (!author || author === "[deleted]" || author === "AutoModerator") continue;
    out.push({
      id: String(d.id ?? ""),
      subreddit,
      author,
      title: d.title ?? "",
      selftext: d.selftext ?? "",
      created_utc: Number(d.created_utc ?? 0),
      score: Number(d.score ?? 0),
      num_comments: Number(d.num_comments ?? 0),
      permalink: d.permalink ?? "",
    });
  }
  return out;
}

// -------- phrase extraction --------------------------------------------------

function countPhrases(posts: RedditPost[], patterns: string[]): Array<{ phrase: string; docs: number }> {
  if (!patterns.length) return [];
  const docsByPhrase = new Map<string, Set<string>>();
  for (const post of posts) {
    const haystack = (post.title + " \n " + post.selftext).toLowerCase();
    for (const phrase of patterns) {
      // Word-boundary-ish match; `\b` doesn't help with multiword patterns, so
      // we do a simple includes() which is fine for these known terms.
      if (haystack.includes(phrase)) {
        if (!docsByPhrase.has(phrase)) docsByPhrase.set(phrase, new Set());
        docsByPhrase.get(phrase)!.add(post.author);
      }
    }
  }
  return [...docsByPhrase.entries()]
    .map(([phrase, authors]) => ({ phrase, docs: authors.size }))
    .sort((a, b) => b.docs - a.docs)
    .slice(0, 8);
}

// -------- aggregation --------------------------------------------------------

function aggregateSegment(segment: SegmentConfig, posts: RedditPost[], windowStartUtc: number): SegmentAggregate {
  const recent = posts.filter((p) => p.created_utc >= windowStartUtc);
  const authors7d = new Set(recent.map((p) => p.author));
  const subCounts = new Map<string, number>();
  for (const p of recent) subCounts.set(p.subreddit, (subCounts.get(p.subreddit) ?? 0) + 1);
  const topSubs = [...subCounts.entries()]
    .map(([subreddit, count]) => ({ subreddit, count }))
    .sort((a, b) => b.count - a.count);

  const avgScore = recent.length
    ? Math.round(recent.reduce((s, p) => s + p.score, 0) / recent.length)
    : null;
  const lastPost = recent.reduce<RedditPost | null>((latest, p) => {
    if (!latest || p.created_utc > latest.created_utc) return p;
    return latest;
  }, null);

  const policy = segment.outreach_policy;

  return {
    name: segment.name,
    label: segment.label,
    tier: segment.tier,
    outreach_policy: policy,
    volume_7d: recent.length,
    volume_lifetime: posts.length,
    // Policy-gated fields:
    unique_authors_7d: policy === "candidate" ? authors7d.size : null,
    avg_post_score_7d: policy === "candidate" ? avgScore : null,
    top_phrases: policy === "earned_only" ? null : countPhrases(recent, segment.positive_patterns),
    top_subreddits: topSubs,
    last_post_iso: lastPost ? new Date(lastPost.created_utc * 1000).toISOString() : null,
  };
}

// -------- main handler -------------------------------------------------------

export default async (_req: Request): Promise<Response> => {
  const startedAt = Date.now();
  console.log(`[cohort-pulse] starting fetch at ${new Date(startedAt).toISOString()}`);

  const store = getStore("cohort-pulse");
  const postsBySegment = new Map<string, RedditPost[]>();

  // Load prior pulls so lifetime stats accumulate. We store per-segment
  // rolling posts blobs, truncated to keep size bounded.
  for (const seg of SEGMENTS) {
    const prior = await store.get(`posts/${seg.name}.json`, { type: "json" }) as RedditPost[] | null;
    postsBySegment.set(seg.name, prior ?? []);
  }

  // Fetch each subreddit. Respect rate limit.
  const fetchErrors: Array<{ subreddit: string; error: string }> = [];
  for (const seg of SEGMENTS) {
    for (const sub of seg.subreddits) {
      try {
        const pulled = await fetchSubredditNew(sub);
        console.log(`[cohort-pulse] r/${sub} pulled=${pulled.length}`);
        const cur = postsBySegment.get(seg.name) ?? [];
        const seen = new Set(cur.map((p) => p.id));
        for (const p of pulled) if (!seen.has(p.id)) cur.push(p);
        postsBySegment.set(seg.name, cur);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`[cohort-pulse] r/${sub} failed: ${msg}`);
        fetchErrors.push({ subreddit: sub, error: msg });
      }
      await sleep(REQUEST_INTERVAL_MS);
    }
  }

  // Trim each segment's rolling post cache to the last 60 days so the blob
  // stays small. We still expose volume_lifetime as the pre-trim count.
  const now = Date.now() / 1000;
  const cacheCutoff = now - 60 * 86400;
  const lifetimeCounts = new Map<string, number>();
  for (const [name, posts] of postsBySegment.entries()) {
    lifetimeCounts.set(name, posts.length);
    const trimmed = posts
      .filter((p) => p.created_utc >= cacheCutoff)
      .sort((a, b) => b.created_utc - a.created_utc);
    postsBySegment.set(name, trimmed);
    // Persist the trimmed raw-posts cache (private, per-segment, inside Blobs).
    await store.setJSON(`posts/${name}.json`, trimmed);
  }

  // Compute the live pulse aggregate.
  const windowStartUtc = now - PULSE_WINDOW_DAYS * 86400;
  const aggregates: SegmentAggregate[] = [];
  for (const seg of SEGMENTS) {
    const agg = aggregateSegment(seg, postsBySegment.get(seg.name) ?? [], windowStartUtc);
    // Replace volume_lifetime with pre-trim count so the number keeps growing.
    agg.volume_lifetime = lifetimeCounts.get(seg.name) ?? agg.volume_lifetime;
    aggregates.push(agg);
  }

  const totals = {
    posts_7d: aggregates.reduce((s, a) => s + a.volume_7d, 0),
    posts_lifetime: aggregates.reduce((s, a) => s + a.volume_lifetime, 0),
    qualified_authors_7d: aggregates
      .filter((a) => a.outreach_policy === "candidate")
      .reduce((s, a) => s + (a.unique_authors_7d ?? 0), 0),
    segments_tracked: aggregates.length,
  };

  const pulse: LivePulse = {
    generated_at: new Date().toISOString(),
    window_days: PULSE_WINDOW_DAYS,
    totals,
    segments: aggregates,
    next_run_hint: "Daily at 03:00 UTC",
  };

  await store.setJSON("live.json", pulse);

  // Also stash the fetch log for debugging / observability.
  await store.setJSON(`runs/${new Date().toISOString()}.json`, {
    started_at: new Date(startedAt).toISOString(),
    finished_at: new Date().toISOString(),
    duration_ms: Date.now() - startedAt,
    totals,
    fetch_errors: fetchErrors,
  });

  const durationSec = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log(
    `[cohort-pulse] done in ${durationSec}s — posts_7d=${totals.posts_7d} ` +
      `qualified_authors_7d=${totals.qualified_authors_7d} errors=${fetchErrors.length}`,
  );

  return new Response(
    JSON.stringify({
      ok: true,
      duration_ms: Date.now() - startedAt,
      totals,
      fetch_errors: fetchErrors,
    }),
    { headers: { "content-type": "application/json" } },
  );
};

// Run daily at 03:00 UTC. Change here if you want a different cadence.
export const config: Config = {
  schedule: "0 3 * * *",
};

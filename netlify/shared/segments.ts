/**
 * DUST cohort segments — Netlify-side config.
 *
 * This is a deliberately SLIMMED port of cohort_pipeline/segments.py and
 * cohort_pipeline/config.py. It contains ONLY what the public-facing pulse
 * needs: subreddit -> segment mapping, outreach_policy per segment, and
 * positive_patterns for top-phrase extraction.
 *
 * The full sophistication (versioned definitions, Claude-based author scoring,
 * reflection diffs) stays in the Python pipeline on the laptop / GitHub
 * Actions. This file must stay in sync with the Python side for segment
 * NAMES, TIER, and OUTREACH_POLICY. Patterns can be a subset.
 *
 * Outreach policy governs what ships to the public JSON:
 *   candidate       -> volume + authors + phrases  (still aggregated, never handles)
 *   messaging_only  -> volume + phrases            (no author counts)
 *   earned_only     -> volume only                 (no phrases, no authors)
 */

export type OutreachPolicy = "candidate" | "messaging_only" | "earned_only";

export interface SegmentConfig {
  name: string;
  label: string;               // Human-readable label for the site
  tier: "1" | "2" | "3";
  outreach_policy: OutreachPolicy;
  subreddits: string[];
  positive_patterns: string[]; // Lowercased for matching
}

export const SEGMENTS: SegmentConfig[] = [
  {
    name: "lucid",
    label: "Lucid dreamers",
    tier: "1",
    outreach_policy: "candidate",
    subreddits: ["LucidDreaming", "Dreams", "DreamInterpretation"],
    positive_patterns: [
      "lucid dream", "dild", "wild", "mild", "ssild",
      "reality check", "dream sign", "dream journal",
      "sleep paralysis", "false awakening", "dream recall",
      "dream control", "galantamine", "mugwort", "shape app",
      "astral projection", "wbtb", "wake back to bed",
      "stabilization", "lucidity",
    ],
  },
  {
    name: "biohackers",
    label: "Biohackers / sleep optimizers",
    tier: "1",
    outreach_policy: "candidate",
    subreddits: ["Biohackers", "Nootropics", "QuantifiedSelf", "OuraRing", "whoop", "Eightsleep"],
    positive_patterns: [
      "hrv", "heart rate variability", "sleep architecture",
      "rem", "deep sleep", "recovery score", "readiness",
      "oura", "oura ring", "whoop", "whoop strain", "eight sleep", "pod",
      "sleepmaxxing", "sleep maxing", "sleep stack",
      "magnesium glycinate", "apigenin", "theanine",
      "apollo neuro", "cgm", "continuous glucose",
      "sleep optimization", "cold plunge", "sauna",
      "huberman", "rhonda patrick", "peter attia",
    ],
  },
  {
    name: "pregnancy",
    label: "Pregnant & new mothers",
    tier: "1",
    outreach_policy: "messaging_only",
    subreddits: ["BabyBumps", "pregnant", "Mommit"],
    positive_patterns: [
      "vivid dreams", "pregnancy dreams",
      "third trimester", "second trimester", "first trimester",
      "baby dreams", "pregnancy brain", "mom brain",
      "due date", "my ob", "my midwife", "ultrasound",
      "pregnancy nightmares", "weird dreams pregnancy",
    ],
  },
  {
    name: "perimenopause",
    label: "Perimenopausal women",
    tier: "1",
    outreach_policy: "messaging_only",
    subreddits: ["Menopause", "Perimenopause"],
    positive_patterns: [
      "perimenopause", "peri", "menopause", "menopausal",
      "hrt", "hormone replacement", "estrogen", "progesterone",
      "hot flashes", "night sweats", "brain fog",
      "hormonal", "vasomotor", "mirena", "oestrogel",
    ],
  },
  {
    name: "creatives",
    label: "Creative professionals",
    tier: "2",
    outreach_policy: "candidate",
    subreddits: ["writing", "ArtistLounge", "Songwriting"],
    positive_patterns: [
      "writing prompt", "creative block", "inspiration from dreams",
      "dream journal for writing", "subconscious", "muse",
      "songwriting", "worldbuilding",
    ],
  },
  {
    name: "consciousness",
    label: "Consciousness / psychedelic-curious",
    tier: "2",
    outreach_policy: "candidate",
    subreddits: ["meditation", "Psychonaut", "microdosing"],
    positive_patterns: [
      "integration", "ego death", "neural plasticity",
      "microdose", "microdosing", "psilocybin", "ayahuasca",
      "dmt", "set and setting", "trip report",
      "meditation practice", "non-dual", "vipassana",
    ],
  },
  {
    name: "sleep_general",
    label: "Sleep-curious (general)",
    tier: "2",
    outreach_policy: "candidate",
    subreddits: ["sleep", "insomnia"],
    positive_patterns: [
      "can't sleep", "trouble falling asleep", "sleep anxiety",
      "racing thoughts at night", "sleep routine",
    ],
  },
  {
    name: "clinical",
    label: "Clinical (PTSD / grief)",
    tier: "3",
    outreach_policy: "earned_only",
    subreddits: ["PTSD", "CPTSD", "Nightmares", "GriefSupport"],
    positive_patterns: [],  // Not used — earned_only segments don't ship phrases
  },
];

// Reddit public API requires a descriptive User-Agent.
export const USER_AGENT =
  "dust-cohort-listener/0.1 (research tool for Dust Dream Sciences; +https://dust-demographic-analysis.netlify.app)";

// Unauthenticated Reddit asks for <60 req/min. We target <50.
export const REQUEST_INTERVAL_MS = 1300;

// Number of posts to pull per subreddit per run.
export const POSTS_PER_SUBREDDIT = 100;

// Rolling window used for the "live" aggregates shown on the public site.
export const PULSE_WINDOW_DAYS = 7;

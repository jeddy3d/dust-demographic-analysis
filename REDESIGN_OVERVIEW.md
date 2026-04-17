# DUST Demographic Site — Redesign Overview

_Status: for your review before rebuild. No site code has changed yet._
_Last updated: April 17, 2026_

---

## 1. The listener — what's actually available to the site

Pulled from the inaugural-run brief (`cohort_pipeline/data/briefs/2026-04-17.json`).

**Top-level shape**
```
{ date, generated_at, segments: { <name>: … }, version_changes: [] }
```

**Per-segment shape that the site can consume**
```
segments.<name> = {
  definition: { name, tier, version, outreach_policy, definition_md,
                positive_patterns[], negative_patterns[], psychographic_signals {} },
  snapshot:   { unique_authors, qualified_authors, avg_signal_density,
                avg_representativeness, avg_composite,
                top_phrases_json: [{phrase, docs}, …],
                top_subreddits_json: { sub: count, … } },
  safety_flagged_count,
  candidates: [ { author, composite_score, rationale,
                  suggested_opener, top_permalink, top_title, … } ]
}
```

**Numbers from the inaugural run (per segment)**

| Segment | Policy | Authors | Qualified (≥3.5) | Candidates in brief | Avg composite |
|---|---|---:|---:|---:|---:|
| biohackers | candidate | **553** | 1 | 2 | 3.36 |
| clinical | earned_only | 378 | 0 | 0 | — |
| pregnancy | messaging_only | 295 | 0 | 0 | — |
| creatives | candidate | 283 | 0 | 0 | — |
| lucid | candidate | 276 | 0 | 3 | 1.76 |
| consciousness | candidate | 276 | 0 | 5 | 2.94 |
| perimenopause | messaging_only | 196 | 0 | 0 | — |
| sleep_general | candidate | 189 | 0 | 0 | — |

Three important observations:

1. **The hypothesis segments have real crowd** — 2,446 unique authors across Tier 1 & 2 in one pull. That validates that these communities exist and are addressable.
2. **Qualified authors are scarce on day one** (1 across all segments). That's the scorer doing its job — strict about safety flags, representativeness, commitment. Expect this to grow week-over-week as the language library catches up.
3. **Top-phrase extraction is signal-rich for women's-health segments** (HRT, estrogen, progesterone, baby, pregnant) and noisier for creatives/biohackers (tokens like "back," "did," "i'm" bleed through). This is a language-library tuning problem the listener will fix itself through reflection.

---

## 2. The data contract between listener and site

**Laptop side (listener runs here)**
- Daily: `listen fetch → listen score → listen rollup → listen brief`
- Weekly: `listen reflect`
- The daily brief `data/briefs/YYYY-MM-DD.json` is the source of truth.

**Site side (Netlify static)**
- Needs a **public-safe aggregate** — never author handles, never permalinks, never suggested openers, never rationales.
- Proposal: a small post-brief script on the laptop (`export_public_pulse.py`) that reads the brief JSON and emits `site-pulse-YYYY-MM-DD.json` containing ONLY:
  - `generated_at`, `window_days`, `totals`
  - Per-segment: `name, label, tier, outreach_policy, version, unique_authors (candidate only), qualified_authors (candidate only), avg_composite (candidate only), top_phrases (candidate & messaging_only only — filtered against stopword list), top_subreddits, last_reflection_diff`
  - Clinical segments: **volume only**, no phrases, no authors — matches the outreach_policy promise we already published.
- That public JSON commits to the `Demographic Analysis/data/pulse.json` path and deploys via the same CLI flow we're already using. No Netlify Functions required for v1 — the laptop is the cron.

This keeps all PII and all API credentials on the laptop, ships only aggregates, and means the site can go live with listener data the same afternoon you decide it's ready.

---

## 3. Proposed page structure

Three pages, shared nav, shared footer validation pill.

```
/           HOME — The Hypothesis (being validated)
/tam        TAM — Market sizing & converging pillars
/targets    TARGETS & RISKS — Playbooks, benchmarks, risks
/method     METHODOLOGY — Validation loop + privacy policy  [small page, optional]
```

**Navigation** — a single header nav shared across all three pages. The current page gets a subtle highlight; the footer validation-pill lives on all three.

---

## 4. HOME — "The hypothesis"

**Purpose:** Articulate what we think the customer looks like and watch the listener prove or refute it. Every section here is something the listener can measure.

**Order**

1. **Hero** (revised)
   - Keeps the two tag pills: `DEMOGRAPHIC HYPOTHESIS · v1.0` and a now-active `VALIDATION MECHANISM · LISTENING` (blue dot pulsing).
   - Hero stats become live-capable: "Segments being validated: 7", "Authors observed: 2,446", "Qualified candidates to date: 1", "Last listener run: Apr 17, 9:31 UTC".
   - Scroll cue: "See the hypothesis under test."

2. **Methodology strip** (compact version of the current 3-card flow)
   - Unchanged content. Status on card 2 flips from "In development" to "Live — listening" once pulse.json exists.

3. **§1 Segments & clusters** (current §2)
   - Each segment card gains a **live-signal row** directly under the segment description:
     - `candidate` policy: `LIVE · 276 authors · 3 candidates · composite 2.94 · validated via r/LucidDreaming r/Dreams`
     - `messaging_only`: `LIVE · 196 authors · top phrases: hrt, estrogen, progesterone · validated via r/Menopause`
     - `earned_only`: `LIVE · 378 authors · language-only (no outreach)`
   - Cards not yet in the listener config (e.g. the rarer Tier-3 clusters) stay marked `HYPOTHESIS · unlistened`.
   - A small "Language drift" dot appears when a segment's pattern library was updated by reflection that week — hover reveals the diff summary.

4. **§2 Scoring matrix / heatmap** (current §3)
   - Adds an optional "Measured" toggle in the upper right: when on, each row shows a slim bar next to each criterion indicating how the listener's per-criterion averages compare to the hypothesis score. `avg_signal_density`, `avg_representativeness`, `qualified_authors/unique_authors` ratio all map onto existing criteria.
   - When data is missing (segments we score = candidate only), cells gray out honestly rather than faking data.

5. **§3 GTM tier flow** (current §4)
   - Each segment chip gains a tiny status dot — amber (listening, still hypothesis), green (qualified candidates surfaced), gray (not in listener).
   - Below the tier flow, a new "Cohort-viability read" sentence: "After 1 listener run, 1 segment (biohackers) produced a qualified candidate; 4 segments produced near-miss candidates (composite ≥ 2.5)."
   - Nothing about the plan changes from listener output — GTM stays human-decided — but the tiers become live-annotated.

6. **§4 Cohort composition** (current §7)
   - Reframed: **"Hypothesized cohort composition (200 Founding Dreamers)."**
   - The doughnut stays as the **hypothesis**, rendered with a clear `HYPOTHESIS · TO BE VALIDATED` chip.
   - Side-by-side, a second doughnut (or slim table) shows the **measured candidate-pipeline distribution**: of the candidates scored ≥ 3.0 this week, what % per segment. When the two diverge meaningfully, that's the moment to revise the cohort.
   - Below: a small "What the listener is telling us" note auto-populated from segment-level deltas — e.g., "Biohackers producing candidates 2× the hypothesized rate; lucid dreamers producing below hypothesis — likely scorer threshold issue, revisit in v1.1."

7. **Footer + validation pill** (unchanged content; pill now says "Validation status: hypothesis v1.0 · listening").

**Why this order:** hypothesis → signal → framework → picked cohort. Each section is something a careful reader would want to ask "is this true?" about, and the listener now starts answering that on the same page.

---

## 5. TAM — "Market sizing"

**Purpose:** The market-context page. Nothing here comes from the listener (subreddit chatter doesn't validate market sizing), so this page stays as a pure research dossier.

**Content**

1. **Intro paragraph** — why the four-pillar view is the right way to size this market.
2. **§1 Four converging pillars** (current §1 — sleep tech, mental health apps, mental wellness economy, ancillary) with the pillar cards intact.
3. **Fractured-market chart** (stays).
4. **"Defensible TAM" callout** — the $430B aggregate with the category list.
5. **A note at the bottom**: "TAM is sized independently of the demographic hypothesis; validate demographic fit on the home page."

No listener data on this page. No chips other than `MARKET RESEARCH · v1.0`.

---

## 6. TARGETS & RISKS — "Comparables, benchmarks, and what could invalidate the plan"

**Purpose:** Reference material — the companies we're modeling after and the numbers we're aiming for — plus the risks page.

**Content**

1. **§1 Comparable playbooks** (current §5 — Oura, WHOOP, Function, AG1, Eight Sleep, Calm/Headspace, Shape/Prophetic, Waking Up). Kept as cards.
2. **§2 Benchmarks** (current §6 — CAC by channel, retention curves, pricing/LTV bubble). Kept as charts.
3. **§3 Risks** (current §9 — the 8 risk cards). Kept.
4. Optional: at the top, a small "What these targets are for" paragraph — "These are the yardsticks the listener's signal is measured against; if the hypothesis validates, these are the unit economics we'll be held to."

Nothing on this page is listener-driven. Chip language: `REFERENCE · v1.0`. Risks keeps its existing chip.

---

## 7. METHODOLOGY (optional 4th page)

If we want the validation-loop and privacy-policy content (current §8) to live somewhere dedicated rather than on the home page, a small `/method` page makes sense. It would contain:

- The 3-card Hypothesis / Listener / Revision strip (fuller version)
- The 5-step validation loop (Listen → Match → Score → Aggregate → Revise)
- The outreach_policy table (candidate / messaging_only / earned_only)
- Version history (rendered from `version_changes` in the brief; currently empty but will grow)

Or we leave those components on the home page as the "methodology strip" + a "privacy & validation" collapsed block near the footer. **My recommendation:** put the long-form version on `/method`, keep a compact 3-card strip on Home under the hero.

---

## 8. Visual language for hypothesis → validated

Shared component vocabulary across all pages:

| Status | Chip | Where it appears | When it applies |
|---|---|---|---|
| `HYPOTHESIS` | parchment outline | Home sections 1-4 | Default for any claim we haven't measured yet |
| `LISTENING` | blue pulsing dot | Per-segment & hero | Listener is producing daily signal for this segment |
| `VALIDATED` | sage (`#9cbab0`) | Per-segment | ≥1 week of signal consistent with hypothesis |
| `REVISED → vX.Y` | terra (`#d4a88c`) | Per-segment | Reflection emitted a version change; hover shows diff |
| `REFERENCE` | mono text | TAM, Targets & Risks | Non-empirical content |
| `EARNED-ONLY` | muted outline | Clinical segment | Language-only, never sourced for outreach |

The hero validation-pill phrasing ladders through the phases:
- Day 0: "Hypothesis v1.0 complete. Live validation pending listener deployment." (current)
- Listener running: "Hypothesis v1.0 under test. Listener running daily."
- First revision: "Hypothesis v1.1. Revised from live signal."

---

## 9. Privacy boundary — what never leaves the laptop

Strict list. The public pulse JSON **never** contains:

- Any Reddit author handle
- Any post body, title, or permalink
- Any suggested opener text
- Any score rationale
- Any candidate list as individuals
- Any phrase below a doc-count threshold (min 3 distinct authors)

The public pulse **can** contain, per segment, per policy:

| Policy | Volume | Qualified count | Avg composite | Top phrases | Top subreddits |
|---|---|---|---|---|---|
| candidate | ✅ | ✅ | ✅ | ✅ | ✅ |
| messaging_only | ✅ | — | — | ✅ | ✅ |
| earned_only | ✅ | — | — | — | ✅ |

The site already documents this policy — this redesign just wires the enforcement into the export script.

---

## 10. Implementation order (when you green-light)

1. **Write `export_public_pulse.py`** in `cohort_pipeline/` that reads the latest brief, applies the privacy filter above, and writes `pulse.json` into the site repo. ~1 hour of work.
2. **Split `index.html` into three pages** (`index.html`, `tam.html`, `targets.html`) + shared nav + shared footer. `styles.css` already carries everything needed.
3. **Add the live-signal component to segment cards** in `charts.js` — reads pulse.json, renders the policy-appropriate row per segment, no-ops if pulse is missing.
4. **Add the heatmap "Measured" toggle** — off by default until pulse.json has ≥ 5 scored segments with real avg_composite.
5. **Add the cohort side-by-side (hypothesized vs measured) block** — renders the second doughnut only when pulse has ≥ 5 candidates across ≥ 3 segments.
6. **Ship:** one Netlify CLI deploy, all three pages.

Everything after that is Phase 2 — version-history view, language-drift widget, cross-segment author view — and can wait until the listener's data is dense enough to warrant them.

---

## 11. Open questions for you

These are the decisions I need before I build.

1. **Section 8 placement.** You said sections 5 & 8 go under "Targets & Risks." In the current live site §5 is Playbooks, §8 is the Validation Loop, and §9 is Risks. Did you mean **Playbooks + Risks** (my assumption above)? Or did you actually want Playbooks + the Validation Loop section grouped together?
2. **Benchmarks (current §6 — CAC, retention, pricing/LTV).** You didn't name a home for this. My proposal: keep it on `/targets` alongside playbooks. Alternative: move it to `/tam` as the "market + unit economics" page. Preference?
3. **Methodology as its own page?** My lean: yes, a small `/method` page, with a compact 3-card methodology strip on Home. Alternative: keep everything on Home and drop the dedicated page.
4. **Cohort second doughnut.** Two options for the "measured" comparison: (a) second doughnut side-by-side, visually parallel; (b) a single doughnut with a radial overlay showing measured drift. (a) is more honest, (b) is tighter. Preference?
5. **Nav treatment.** Preference for tab-style nav (Home / TAM / Targets & Risks) with the current page underlined, or a simple left-aligned links block? I'll match the existing mono type treatment either way.
6. **When to flip "VALIDATION MECHANISM · IN DEVELOPMENT" to "LISTENING."** As soon as the first `pulse.json` lands in the site repo? Or only after a chosen number of days of data (e.g., one full week)?

Once these are settled I'll rebuild against the plan.

/**
 * GET /.netlify/functions/pulse
 *
 * Returns the latest cohort pulse aggregate from Netlify Blobs.
 * Cached at the CDN for 5 minutes so we don't hammer Blobs on every page load.
 * CORS is open to anonymous GETs because the response contains only aggregate
 * data gated by outreach_policy — no author handles, no raw content.
 */
import { getStore } from "@netlify/blobs";

export default async (_req: Request): Promise<Response> => {
  const store = getStore("cohort-pulse");
  const pulse = await store.get("live.json", { type: "json" });

  if (!pulse) {
    return new Response(
      JSON.stringify({
        ok: false,
        reason: "pulse_not_yet_generated",
        hint: "Scheduled fetch has not run yet. Trigger manually: `netlify functions:invoke fetch-cohort-pulse`.",
      }),
      {
        status: 404,
        headers: {
          "content-type": "application/json",
          "cache-control": "no-store",
          "access-control-allow-origin": "*",
        },
      },
    );
  }

  return new Response(JSON.stringify(pulse), {
    status: 200,
    headers: {
      "content-type": "application/json",
      // Browsers cache 60s; the CDN caches 5 min. Scheduled function runs
      // daily anyway, so anything shorter is wasted work.
      "cache-control": "public, max-age=60, s-maxage=300",
      "access-control-allow-origin": "*",
    },
  });
};

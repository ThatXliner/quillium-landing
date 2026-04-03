# Social Proof: "Join X+ writers" Download Count

## Overview

Add a social proof line ("Join X+ writers") above the CTA buttons in both the Hero and Download sections. The count comes from PostHog's `download_clicked` event total, fetched server-side with a 1-month in-memory cache, rounded to 1 significant figure.

## Data Flow

1. **Client mount**: Hero and Download components fetch `/api/download-count` on mount
2. **Server route**: `/api/download-count/+server.ts` queries PostHog, caches result in-memory for 1 month
3. **Rounding**: Round to 1 significant figure (e.g. 1,234 -> 1,000; 567 -> 600; 8,901 -> 9,000)
4. **Display**: Components render "Join X+ writers" when count > 0

## PostHog Query

Use the PostHog query API (`/api/projects/:id/query`) with a `TrendsQuery` to get the total count of `download_clicked` events across all time. Requires a **personal API key** (not the project token) stored as `POSTHOG_API_KEY` env var.

The project ID and host are derived from existing env vars (`PUBLIC_POSTHOG_HOST`). A new `POSTHOG_API_KEY` (private, server-side only) and `POSTHOG_PROJECT_ID` env var are needed.

## Rounding Function

```ts
function roundTo1SigFig(n: number): number {
  if (n === 0) return 0;
  const d = Math.ceil(Math.log10(Math.abs(n)));
  const power = Math.pow(10, d - 1);
  return Math.round(n / power) * power;
}
```

Examples: 0 -> 0, 5 -> 5, 47 -> 50, 123 -> 100, 999 -> 1000, 8901 -> 9000

## Files to Create/Modify

### `src/routes/api/download-count/+server.ts` (new)
- Query PostHog for total `download_clicked` count
- Cache result in a module-level variable with a 1-month TTL
- Return JSON `{ count: number }` (rounded to 1 sig fig)
- Return `{ count: 0 }` on error

### `src/lib/components/Hero.svelte`
- Fetch `/api/download-count` on mount
- Render "Join {formatted count}+ writers" above the CTA buttons div, before the buttons
- Style: `text-[0.85rem] text-black/40 font-medium`
- Only render if count > 0

### `src/lib/components/Download.svelte`
- Fetch `/api/download-count` on mount
- Render "Join {formatted count}+ writers" above the primary download button
- Same styling as Hero
- Only render if count > 0

## Caching

In-memory module-level cache in the server route:
- Store `{ count, fetchedAt }` 
- If `Date.now() - fetchedAt < 30 * 24 * 60 * 60 * 1000`, return cached value
- Otherwise re-fetch from PostHog

## Fallback Behavior

If the PostHog query fails (network error, bad key, etc.), return `{ count: 0 }`. The social proof line is hidden. No error is shown to the user.

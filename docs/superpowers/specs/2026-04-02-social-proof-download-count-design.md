# Social Proof: "Join X+ writers" Download Count

## Overview

Add a social proof line ("Join X+ writers") above the CTA buttons in both the Hero and Download sections. The count comes from PostHog's `download_clicked` event total, fetched at build time, rounded to 1 significant figure.

## Data Flow

1. **Build time**: `+page.server.ts` queries the PostHog API for total `download_clicked` event count
2. **Rounding**: Round to 1 significant figure (e.g. 1,234 -> 1,000; 567 -> 600; 8,901 -> 9,000)
3. **Page data**: Passed as `data.downloadCount` (number) alongside existing `data.release`
4. **Display**: Hero and Download components render "Join X+ writers" when count > 0

## PostHog Query

Use the PostHog query API (`/api/projects/:id/query`) with a `TrendsQuery` to get the total count of `download_clicked` events across all time. Requires a **personal API key** (not the project token) stored as `POSTHOG_API_KEY` env var.

Endpoint: `${PUBLIC_POSTHOG_HOST}/api/projects/${PROJECT_ID}/query`

The project ID and host are derived from existing env vars. A new `POSTHOG_API_KEY` (private, server-side only) env var is needed for the API query.

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

## Files to Modify

### `src/routes/+page.server.ts`
- Add PostHog API query for `download_clicked` total count
- Add `roundTo1SigFig` helper
- Return `downloadCount` in page data (0 as fallback on error)

### `src/lib/components/Hero.svelte`
- Accept `downloadCount` prop
- Render "Join {formatted count}+ writers" above the CTA buttons div (inside the `reveal reveal-delay-3` container, before the buttons)
- Style: `text-[0.85rem] text-black/40 font-medium`
- Only render if `downloadCount > 0`

### `src/lib/components/Download.svelte`
- Accept `downloadCount` prop
- Render "Join {formatted count}+ writers" above the primary download button
- Same styling as Hero
- Only render if `downloadCount > 0`

### `src/routes/+page.svelte`
- Pass `data.downloadCount` to Hero and Download components

## Deployment

A monthly GitHub Actions cron triggers a Vercel redeploy to refresh the count. This is set up separately (not part of this spec).

## Fallback Behavior

If the PostHog query fails (network error, bad key, etc.), `downloadCount` defaults to `0` and the social proof line is hidden. No error is shown to the user.

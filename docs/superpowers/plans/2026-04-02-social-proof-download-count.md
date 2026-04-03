# Social Proof Download Count Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show "Join X+ writers" above CTA buttons in Hero and Download sections, with count sourced from PostHog `download_clicked` events.

**Architecture:** A SvelteKit server route (`/api/download-count`) queries the PostHog Query API for total `download_clicked` events, caches the result in-memory for 1 month, and returns a rounded count. Hero and Download components fetch this on mount and conditionally display the social proof line.

**Tech Stack:** SvelteKit, PostHog Query API, Tailwind CSS

---

## File Structure

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/routes/api/download-count/+server.ts` | PostHog query, caching, rounding, JSON response |
| Modify | `src/lib/components/Hero.svelte` | Fetch + display social proof above CTA |
| Modify | `src/lib/components/Download.svelte` | Fetch + display social proof above download button |

---

### Task 1: Server Route — PostHog Query with Cache

**Files:**
- Create: `src/routes/api/download-count/+server.ts`

- [ ] **Step 1: Create the server route**

```ts
// src/routes/api/download-count/+server.ts
import { json } from '@sveltejs/kit';
import { POSTHOG_PERSONAL_API_KEY } from '$env/static/private';
import { PUBLIC_POSTHOG_HOST } from '$env/static/public';
import type { RequestHandler } from './$types';

const PROJECT_ID = '334824';
const CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // 1 month

let cache: { count: number; fetchedAt: number } | null = null;

function roundTo1SigFig(n: number): number {
	if (n === 0) return 0;
	const d = Math.ceil(Math.log10(Math.abs(n)));
	const power = Math.pow(10, d - 1);
	return Math.round(n / power) * power;
}

export const GET: RequestHandler = async ({ fetch }) => {
	if (cache && Date.now() - cache.fetchedAt < CACHE_TTL) {
		return json({ count: cache.count });
	}

	try {
		const res = await fetch(`${PUBLIC_POSTHOG_HOST}/api/projects/${PROJECT_ID}/query`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${POSTHOG_PERSONAL_API_KEY}`
			},
			body: JSON.stringify({
				query: {
					kind: 'TrendsQuery',
					series: [{ kind: 'EventsNode', event: 'download_clicked', math: 'total' }],
					dateRange: { date_from: 'all' }
				}
			})
		});

		if (!res.ok) {
			console.error('[download-count] PostHog query failed:', res.status);
			return json({ count: 0 });
		}

		const data = await res.json();
		const total = data.results?.[0]?.aggregated_value ?? 0;
		const rounded = roundTo1SigFig(total);

		cache = { count: rounded, fetchedAt: Date.now() };
		return json({ count: rounded });
	} catch (e) {
		console.error('[download-count] PostHog query error:', e);
		return json({ count: 0 });
	}
};
```

- [ ] **Step 2: Test the route locally**

Run: `bun run dev`

Then in another terminal:
```bash
curl http://localhost:5173/api/download-count
```

Expected: `{"count":<some number>}` (or `{"count":0}` if no events yet)

- [ ] **Step 3: Commit**

```bash
git add src/routes/api/download-count/+server.ts
git commit -m "feat: add /api/download-count server route with PostHog query and 1-month cache"
```

---

### Task 2: Hero Component — Display Social Proof

**Files:**
- Modify: `src/lib/components/Hero.svelte`

- [ ] **Step 1: Add fetch and state**

At the top of the `<script>` block, after the existing state declarations, add:

```ts
let downloadCount = $state(0);

onMount(() => {
	// ... existing typing animation code ...

	fetch('/api/download-count')
		.then((r) => r.json())
		.then((d) => {
			downloadCount = d.count;
		})
		.catch(() => {});
});
```

Note: The existing `onMount` already has a return (cleanup for the interval). The fetch should be added inside the existing `onMount` callback, after the interval setup but before the return statement.

- [ ] **Step 2: Add the social proof line**

In the template, directly above the `<div class="reveal reveal-delay-3 flex flex-wrap justify-center items-center gap-4">` containing the CTA buttons, add:

```svelte
{#if downloadCount > 0}
	<p class="reveal reveal-delay-2 mb-4 text-[0.85rem] font-medium text-black/40">
		Join {downloadCount.toLocaleString()}+ writers
	</p>
{/if}
```

- [ ] **Step 3: Verify visually**

Run: `bun run dev` and check the Hero section. The "Join X+ writers" line should appear above the buttons. If count is 0, nothing should show.

- [ ] **Step 4: Commit**

```bash
git add src/lib/components/Hero.svelte
git commit -m "feat: show social proof download count in Hero section"
```

---

### Task 3: Download Component — Display Social Proof

**Files:**
- Modify: `src/lib/components/Download.svelte`

- [ ] **Step 1: Add fetch and state**

Add `onMount` import and download count fetch at the top of the `<script>` block:

```ts
import { onMount } from 'svelte';

let downloadCount = $state(0);

onMount(() => {
	fetch('/api/download-count')
		.then((r) => r.json())
		.then((d) => {
			downloadCount = d.count;
		})
		.catch(() => {});
});
```

Note: `onMount` is not currently imported in Download.svelte — it needs to be added.

- [ ] **Step 2: Add the social proof line**

In the template, directly above the `<!-- Primary download button -->` comment, add:

```svelte
{#if downloadCount > 0}
	<p class="mb-4 text-[0.85rem] font-medium text-black/40">
		Join {downloadCount.toLocaleString()}+ writers
	</p>
{/if}
```

- [ ] **Step 3: Verify visually**

Run: `bun run dev` and scroll to the Download section. The "Join X+ writers" line should appear above the download button.

- [ ] **Step 4: Commit**

```bash
git add src/lib/components/Download.svelte
git commit -m "feat: show social proof download count in Download section"
```

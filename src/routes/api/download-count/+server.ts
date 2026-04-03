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
					dateRange: { date_from: 'all' },
					trendsFilter: { display: 'BoldNumber' }
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

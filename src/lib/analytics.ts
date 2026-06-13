// analytics.ts — tiny helpers for marketing attribution on key events.
//
// PostHog already captures first-touch attribution as PERSON properties
// (`$initial_utm_source`, `$initial_referring_domain`, etc.). The problem is those
// live on the person, not on the event, so a `$pageview → download_clicked` funnel
// can't be broken down by source without person-on-events gymnastics.
//
// `trackDownload` copies the first-touch source ONTO the download_clicked event so
// the conversion funnel can break down by channel directly. Tag inbound links with
// UTM params (e.g. ?utm_source=reddit&utm_campaign=r-writing-drafts) and the source
// flows all the way through to the download.

import posthog from 'posthog-js';

/** First-touch attribution PostHog stored for this person, read at capture time. */
function attribution(): Record<string, unknown> {
	// getPersonPropertiesValue isn't typed in older posthog-js; read defensively.
	const get = (key: string): unknown => {
		try {
			return (posthog as unknown as { get_property?: (k: string) => unknown }).get_property?.(key);
		} catch {
			return undefined;
		}
	};
	return {
		utm_source: get('$initial_utm_source'),
		utm_medium: get('$initial_utm_medium'),
		utm_campaign: get('$initial_utm_campaign'),
		referring_domain: get('$initial_referring_domain'),
	};
}

/**
 * Fire the `download_clicked` funnel event with first-touch source attached.
 * `location` is the on-page origin of the click (e.g. 'hero-video', 'download-section').
 */
export function trackDownload(
	url: string,
	platform: string,
	location?: string,
): void {
	posthog.capture('download_clicked', {
		url,
		platform,
		...(location ? { location } : {}),
		page_path: window.location.pathname,
		...attribution(),
	});
}

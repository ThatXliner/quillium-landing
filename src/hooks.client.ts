import posthog from 'posthog-js';
import { PUBLIC_POSTHOG_PROJECT_TOKEN, PUBLIC_POSTHOG_HOST } from '$env/static/public';
import { dev } from '$app/environment';
import type { HandleClientError } from '@sveltejs/kit';

export async function init() {
	if (dev) return;
	posthog.init(PUBLIC_POSTHOG_PROJECT_TOKEN, {
		api_host: PUBLIC_POSTHOG_HOST,
		defaults: '2026-01-30',
		opt_out_capturing_by_default: false,
		capture_exceptions: true,
		persistence: 'localStorage+cookie'
	});
	posthog.register({ app: 'landing' });
}

export const handleError: HandleClientError = async ({ error, status, message }) => {
	posthog.captureException(error);
	return { message, status };
};

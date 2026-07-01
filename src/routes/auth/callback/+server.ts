import { authStatusPath, safeReturnPath } from '$lib/server/authRedirect';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const prerender = false;

export const GET: RequestHandler = async ({ locals, url }) => {
	const errorDescription =
		url.searchParams.get('error_description') || url.searchParams.get('error');
	if (errorDescription) {
		redirect(303, authStatusPath('error', errorDescription));
	}

	const code = url.searchParams.get('code');
	if (!code) {
		redirect(303, authStatusPath('error', 'No authorization code was provided.'));
	}

	const { error } = await locals.supabase.auth.exchangeCodeForSession(code);
	if (error) {
		redirect(303, authStatusPath('error', error.message));
	}

	const next = safeReturnPath(url.searchParams.get('next'), authStatusPath('signed-in'));
	redirect(303, next);
};

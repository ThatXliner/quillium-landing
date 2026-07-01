import { authStatusPath, safeReturnPath } from '$lib/server/authRedirect';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const OTP_TYPES = ['signup', 'invite', 'magiclink', 'recovery', 'email_change', 'email'] as const;

type EmailOtpType = (typeof OTP_TYPES)[number];

function isEmailOtpType(value: string | null): value is EmailOtpType {
	return OTP_TYPES.includes(value as EmailOtpType);
}

export const prerender = false;

export const GET: RequestHandler = async ({ locals, url }) => {
	const tokenHash = url.searchParams.get('token_hash');
	const type = url.searchParams.get('type');

	if (!tokenHash || !isEmailOtpType(type)) {
		redirect(303, authStatusPath('error', 'That confirmation link is missing required data.'));
	}

	const { error } = await locals.supabase.auth.verifyOtp({
		token_hash: tokenHash,
		type
	});

	if (error) {
		redirect(303, authStatusPath('error', error.message));
	}

	const fallback =
		type === 'recovery' ? '/auth/reset-password' : authStatusPath('confirmed', undefined, { type });
	const next = safeReturnPath(url.searchParams.get('next'), fallback);
	redirect(303, next);
};

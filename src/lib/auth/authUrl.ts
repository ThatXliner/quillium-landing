import type { Session, SupabaseClient } from '@supabase/supabase-js';

const PASSWORD_RESET_PATH = '/auth/reset-password';
const OTP_TYPES = ['signup', 'invite', 'magiclink', 'recovery', 'email_change', 'email'] as const;

type EmailOtpType = (typeof OTP_TYPES)[number];

type AuthUrlError = {
	message: string;
};

export type AuthUrlSessionResult = {
	error: AuthUrlError | null;
	hadAuthParams: boolean;
	session: Session | null;
	type: string;
	wantsPasswordReset: boolean;
};

type ParsedAuthUrl = {
	hadAuthParams: boolean;
	params: URLSearchParams;
	type: string;
	url: URL;
	wantsPasswordReset: boolean;
};

function currentHref(): string {
	if (typeof window === 'undefined') return 'http://localhost/auth';
	return window.location.href;
}

function hashParamsFor(url: URL): URLSearchParams {
	const hash = url.hash.replace(/^#/, '');
	if (!hash) return new URLSearchParams();

	const queryStart = hash.indexOf('?');
	const paramString = queryStart >= 0 ? hash.slice(queryStart + 1) : hash;
	return new URLSearchParams(paramString);
}

function hashPathFor(url: URL): string {
	const hash = url.hash.replace(/^#/, '');
	if (!hash.startsWith('/')) return '';

	const queryStart = hash.indexOf('?');
	return queryStart >= 0 ? hash.slice(0, queryStart) : hash;
}

function mergeHashParams(url: URL): URLSearchParams {
	const params = new URLSearchParams(url.search);
	const hashParams = hashParamsFor(url);

	for (const [key, value] of hashParams) {
		if (!params.has(key)) {
			params.set(key, value);
		}
	}

	return params;
}

function isEmailOtpType(value: string): value is EmailOtpType {
	return OTP_TYPES.includes(value as EmailOtpType);
}

function valueTargetsPasswordReset(value: string | null, origin: string): boolean {
	if (!value) return false;

	try {
		return new URL(value, origin).pathname.includes(PASSWORD_RESET_PATH);
	} catch {
		return value.includes(PASSWORD_RESET_PATH);
	}
}

export function readAuthUrl(href = currentHref()): ParsedAuthUrl {
	const url = new URL(href, 'http://localhost');
	const params = mergeHashParams(url);
	const type = params.get('type') ?? '';
	const resetTarget =
		valueTargetsPasswordReset(params.get('next'), url.origin) ||
		valueTargetsPasswordReset(params.get('redirect_to'), url.origin);
	const wantsPasswordReset =
		url.pathname.includes(PASSWORD_RESET_PATH) ||
		hashPathFor(url).includes(PASSWORD_RESET_PATH) ||
		type === 'recovery' ||
		resetTarget;
	const hadAuthParams = [
		'access_token',
		'code',
		'error',
		'error_description',
		'refresh_token',
		'token_hash',
		'type'
	].some((key) => params.has(key));

	return { hadAuthParams, params, type, url, wantsPasswordReset };
}

function stripAuthParamsFromUrl(url: URL) {
	if (typeof window === 'undefined') return;

	window.history.replaceState(window.history.state, '', url.pathname);
}

export async function resolveAuthUrlSession(
	supabase: SupabaseClient
): Promise<AuthUrlSessionResult> {
	const parsed = readAuthUrl();
	const errorDescription = parsed.params.get('error_description') || parsed.params.get('error');

	if (errorDescription) {
		return {
			error: { message: errorDescription },
			hadAuthParams: parsed.hadAuthParams,
			session: null,
			type: parsed.type,
			wantsPasswordReset: parsed.wantsPasswordReset
		};
	}

	const tokenHash = parsed.params.get('token_hash');
	if (tokenHash && isEmailOtpType(parsed.type)) {
		const { data, error } = await supabase.auth.verifyOtp({
			token_hash: tokenHash,
			type: parsed.type
		});

		if (!error && data.session) {
			stripAuthParamsFromUrl(parsed.url);
		}

		return {
			error,
			hadAuthParams: parsed.hadAuthParams,
			session: data.session ?? null,
			type: parsed.type,
			wantsPasswordReset: parsed.wantsPasswordReset
		};
	}

	const code = parsed.params.get('code');
	if (code) {
		const { data, error } = await supabase.auth.exchangeCodeForSession(code);

		if (!error && data.session) {
			stripAuthParamsFromUrl(parsed.url);
		}

		return {
			error,
			hadAuthParams: parsed.hadAuthParams,
			session: data.session ?? null,
			type: parsed.type,
			wantsPasswordReset: parsed.wantsPasswordReset
		};
	}

	const accessToken = parsed.params.get('access_token');
	const refreshToken = parsed.params.get('refresh_token');
	if (accessToken && refreshToken) {
		const { data, error } = await supabase.auth.setSession({
			access_token: accessToken,
			refresh_token: refreshToken
		});

		if (!error && data.session) {
			stripAuthParamsFromUrl(parsed.url);
		}

		return {
			error,
			hadAuthParams: parsed.hadAuthParams,
			session: data.session ?? null,
			type: parsed.type,
			wantsPasswordReset: parsed.wantsPasswordReset
		};
	}

	const { data, error } = await supabase.auth.getSession();

	return {
		error,
		hadAuthParams: parsed.hadAuthParams,
		session: data.session,
		type: parsed.type,
		wantsPasswordReset: parsed.wantsPasswordReset
	};
}

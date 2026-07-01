const AUTH_BASE = 'https://quillium.bryanhu.com';
const DEFAULT_AUTH_PATH = '/auth';

type AuthStatus = 'confirmed' | 'error' | 'password-updated' | 'signed-in' | 'success';

export function safeReturnPath(value: string | null, fallback = DEFAULT_AUTH_PATH): string {
	if (!value || !value.startsWith('/') || value.startsWith('//')) {
		return fallback;
	}

	return value;
}

export function authStatusPath(
	status: AuthStatus,
	message?: string,
	extra?: Record<string, string | undefined>
): string {
	const url = new URL(DEFAULT_AUTH_PATH, AUTH_BASE);
	url.searchParams.set('status', status);

	if (message) {
		url.searchParams.set('message', message);
	}

	for (const [key, value] of Object.entries(extra ?? {})) {
		if (value) {
			url.searchParams.set(key, value);
		}
	}

	return `${url.pathname}${url.search}`;
}

import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
	const status = url.searchParams.get('status') ?? '';
	const message = url.searchParams.get('message') ?? '';
	const type = url.searchParams.get('type') ?? '';

	return { status, message, type };
};

import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const prerender = false;

export const load: PageServerLoad = () => {
	throw redirect(301, '/blog/quillium-is-not-an-ai-app');
};

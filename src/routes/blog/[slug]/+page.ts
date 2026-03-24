import { error } from '@sveltejs/kit';

export const prerender = true;

export async function entries() {
	const modules = import.meta.glob('../../../lib/posts/*.md');
	return Object.keys(modules).map((path) => ({
		slug: path.replace('../../../lib/posts/', '').replace('.md', '')
	}));
}

export async function load({ params }) {
	try {
		const post = await import(`../../../lib/posts/${params.slug}.md`);
		return {
			content: post.default,
			meta: post.metadata as { title: string; description: string; date: string }
		};
	} catch {
		error(404, 'Post not found');
	}
}

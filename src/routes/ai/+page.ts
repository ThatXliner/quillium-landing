export const prerender = true;

export async function load() {
	const post = await import('./content.md');
	return {
		content: post.default,
		meta: post.metadata as { title: string; description: string; date: string; author?: string }
	};
}

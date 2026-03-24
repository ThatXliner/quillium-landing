export const prerender = true;

interface PostMeta {
	title: string;
	description: string;
	date: string;
	slug: string;
}

export async function load() {
	const modules = import.meta.glob('../../lib/posts/*.md', { eager: true });

	const posts: PostMeta[] = Object.entries(modules)
		.map(([path, mod]) => {
			const slug = path.replace('../../lib/posts/', '').replace('.md', '');
			const { metadata } = mod as { metadata: Omit<PostMeta, 'slug'> };
			return { ...metadata, slug };
		})
		.sort((a, b) => (a.date < b.date ? 1 : -1));

	return { posts };
}

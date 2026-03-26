import type { RequestHandler } from './$types';

export const prerender = true;

interface PostMeta {
	title: string;
	description: string;
	date: string;
	slug: string;
}

function getPosts(): PostMeta[] {
	const modules = import.meta.glob('../../lib/posts/*.md', { eager: true });
	return Object.entries(modules)
		.map(([path, mod]) => {
			const slug = path.replace('../../lib/posts/', '').replace('.md', '');
			const { metadata } = mod as { metadata: Omit<PostMeta, 'slug'> };
			return { ...metadata, slug };
		})
		.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const GET: RequestHandler = () => {
	const posts = getPosts();
	const site = 'https://quillium.bryanhu.com';

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>Quillium Blog</title>
		<description>Thoughts on writing, revision, and building tools that respect the craft.</description>
		<link>${site}/blog</link>
		<atom:link href="${site}/rss.xml" rel="self" type="application/rss+xml"/>
		<language>en</language>
		<lastBuildDate>${new Date(posts[0]?.date ?? Date.now()).toUTCString()}</lastBuildDate>
${posts.map((post) => `		<item>
			<title>${escapeXml(post.title)}</title>
			<description>${escapeXml(post.description)}</description>
			<link>${site}/blog/${post.slug}</link>
			<guid isPermaLink="true">${site}/blog/${post.slug}</guid>
			<pubDate>${new Date(post.date).toUTCString()}</pubDate>
		</item>`).join('\n')}
	</channel>
</rss>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/rss+xml'
		}
	});
};

function escapeXml(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

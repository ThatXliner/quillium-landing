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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>${site}/</loc>
		<changefreq>weekly</changefreq>
		<priority>1.0</priority>
	</url>
	<url>
		<loc>${site}/blog</loc>
		<changefreq>weekly</changefreq>
		<priority>0.8</priority>
	</url>
	<url>
		<loc>${site}/privacy</loc>
		<changefreq>monthly</changefreq>
		<priority>0.3</priority>
	</url>
	<url>
		<loc>${site}/terms</loc>
		<changefreq>monthly</changefreq>
		<priority>0.3</priority>
	</url>
${posts.map((post) => `	<url>
		<loc>${site}/blog/${post.slug}</loc>
		<lastmod>${post.date}</lastmod>
		<priority>0.7</priority>
	</url>`).join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};

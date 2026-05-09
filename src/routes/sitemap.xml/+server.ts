import type { RequestHandler } from './$types';

export const prerender = true;

interface PostMeta {
	title: string;
	description: string;
	date: string;
	updated?: string;
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
	const pages = [
		{ path: '/', lastmod: '2026-05-06', changefreq: 'weekly', priority: '1.0' },
		{ path: '/blog', lastmod: '2026-05-06', changefreq: 'weekly', priority: '0.8' },
		{ path: '/omni', lastmod: '2026-05-06', changefreq: 'monthly', priority: '0.6' },
		{ path: '/pricing', lastmod: '2026-05-06', changefreq: 'monthly', priority: '0.5' },
		{ path: '/manifesto', lastmod: '2026-05-06', changefreq: 'monthly', priority: '0.5' },
		{
			path: '/cant-think-straight',
			lastmod: '2026-05-06',
			changefreq: 'monthly',
			priority: '0.5'
		},
		{ path: '/support', lastmod: '2026-05-06', changefreq: 'monthly', priority: '0.4' },
		{ path: '/ai', lastmod: '2026-05-06', changefreq: 'monthly', priority: '0.5' },
		{ path: '/privacy', lastmod: '2026-05-06', changefreq: 'monthly', priority: '0.3' },
		{ path: '/terms', lastmod: '2026-05-06', changefreq: 'monthly', priority: '0.3' }
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((page) => `	<url>
		<loc>${site}${page.path}</loc>
		<lastmod>${page.lastmod}</lastmod>
		<changefreq>${page.changefreq}</changefreq>
		<priority>${page.priority}</priority>
	</url>`).join('\n')}
${posts.map((post) => `	<url>
		<loc>${site}/blog/${post.slug}</loc>
		<lastmod>${post.updated ?? post.date}</lastmod>
		<changefreq>monthly</changefreq>
		<priority>0.7</priority>
	</url>`).join('\n')}
	<url>
		<loc>${site}/rss.xml</loc>
		<changefreq>weekly</changefreq>
		<priority>0.3</priority>
	</url>
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};

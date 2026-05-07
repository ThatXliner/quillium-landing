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
	const pages = [
		{ path: '/', changefreq: 'weekly', priority: '1.0' },
		{ path: '/blog', changefreq: 'weekly', priority: '0.8' },
		{ path: '/omni', changefreq: 'monthly', priority: '0.6' },
		{ path: '/pricing', changefreq: 'monthly', priority: '0.5' },
		{ path: '/manifesto', changefreq: 'monthly', priority: '0.5' },
		{ path: '/cant-think-straight', changefreq: 'monthly', priority: '0.5' },
		{ path: '/support', changefreq: 'monthly', priority: '0.4' },
		{ path: '/ai', changefreq: 'monthly', priority: '0.5' },
		{ path: '/privacy', changefreq: 'monthly', priority: '0.3' },
		{ path: '/terms', changefreq: 'monthly', priority: '0.3' }
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((page) => `	<url>
		<loc>${site}${page.path}</loc>
		<changefreq>${page.changefreq}</changefreq>
		<priority>${page.priority}</priority>
	</url>`).join('\n')}
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

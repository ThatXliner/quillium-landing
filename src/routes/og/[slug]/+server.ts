import { ImageResponse } from '@vercel/og';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';

const fontsDir = resolve('static/fonts');
const newsreaderFont = readFileSync(resolve(fontsDir, 'newsreader-italic-400.ttf'));
const interFont = readFileSync(resolve(fontsDir, 'inter-500.ttf'));

export const prerender = true;

export async function entries() {
	const posts = import.meta.glob('../../../lib/posts/*.md');
	return Object.keys(posts).map((path) => ({
		slug: path.split('/').pop()!.replace('.md', ''),
	}));
}

export const GET: RequestHandler = async ({ params }) => {
	let meta: { title: string; date: string; author?: string };

	try {
		const post = await import(`../../../lib/posts/${params.slug}.md`);
		meta = post.metadata;
	} catch {
		error(404, 'Post not found');
	}

	const title = meta.title ?? params.slug;
	const date = meta.date ?? '';
	const author = meta.author;

	const html = {
		type: 'div',
		props: {
			style: {
				width: '1200px',
				height: '630px',
				background: '#f5f4f1',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				padding: '72px 80px',
				fontFamily: 'Inter',
			},
			children: [
				{
					type: 'div',
					props: {
						style: {
							fontSize: '18px',
							fontWeight: 500,
							color: 'rgba(0,0,0,0.4)',
							letterSpacing: '0.02em',
							fontFamily: 'Inter',
						},
						children: 'Quillium',
					},
				},
				{
					type: 'div',
					props: {
						style: {
							fontSize: title.length > 50 ? '52px' : '64px',
							fontFamily: 'Newsreader',
							fontStyle: 'italic',
							fontWeight: 400,
							color: 'rgba(0,0,0,0.88)',
							lineHeight: 1.1,
							letterSpacing: '-0.02em',
							maxWidth: '900px',
						},
						children: title,
					},
				},
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							alignItems: 'center',
							gap: '16px',
							fontSize: '16px',
							color: 'rgba(0,0,0,0.4)',
							fontFamily: 'Inter',
							fontWeight: 500,
						},
						children: [
							...(author
								? [
										{ type: 'span', props: { children: author } },
										{
											type: 'span',
											props: {
												style: { color: 'rgba(0,0,0,0.2)' },
												children: '·',
											},
										},
									]
								: []),
							{ type: 'span', props: { children: date } },
						],
					},
				},
			],
		},
	};

	return new ImageResponse(html, {
		width: 1200,
		height: 630,
		fonts: [
			{
				name: 'Newsreader',
				data: newsreaderFont,
				weight: 400,
				style: 'italic',
			},
			{
				name: 'Inter',
				data: interFont,
				weight: 500,
				style: 'normal',
			},
		],
	});
};

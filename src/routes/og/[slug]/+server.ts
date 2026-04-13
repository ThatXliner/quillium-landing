import { ImageResponse } from '@vercel/og';
import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';

const fontsPromise = Promise.all([
	fetch(
		'https://fonts.gstatic.com/s/newsreader/v26/cY9kfjOCX1hbuyalUrK439vogqC9yFZCYg7oRZaLP4obnf7fTXglsMwoT-ZA.ttf'
	).then((r) => r.arrayBuffer()),
	fetch(
		'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fMZg.ttf'
	).then((r) => r.arrayBuffer()),
]);

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

	const [newsreaderFont, interFont] = await fontsPromise;

	return new ImageResponse(html, {
		width: 1200,
		height: 630,
		headers: {
			'Cache-Control': 'public, s-maxage=31536000, immutable',
		},
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

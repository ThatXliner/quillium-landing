import { ImageResponse } from '@vercel/og';
import type { RequestHandler } from './$types';

const fontsPromise = Promise.all([
	fetch(
		'https://fonts.gstatic.com/s/newsreader/v26/cY9kfjOCX1hbuyalUrK439vogqC9yFZCYg7oRZaLP4obnf7fTXglsMwoT-ZA.ttf'
	).then((r) => r.arrayBuffer()),
	fetch(
		'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fMZg.ttf'
	).then((r) => r.arrayBuffer()),
]);

export const GET: RequestHandler = async ({ url }) => {
	const logoUrl = `${url.origin}/logo.png`;

	const html = {
		type: 'div',
		props: {
			style: {
				width: '1200px',
				height: '630px',
				background: '#f5f4f1',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				padding: '80px 100px',
				fontFamily: 'Inter',
			},
			children: [
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							flex: '1',
						},
						children: [
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										gap: '8px',
										marginBottom: '48px',
									},
									children: [
										{ type: 'div', props: { style: { width: '14px', height: '14px', borderRadius: '50%', background: '#3b82f6' } } },
										{ type: 'div', props: { style: { width: '14px', height: '14px', borderRadius: '50%', background: '#a855f7' } } },
										{ type: 'div', props: { style: { width: '14px', height: '14px', borderRadius: '50%', background: '#22c55e' } } },
										{ type: 'div', props: { style: { width: '14px', height: '14px', borderRadius: '50%', background: '#fcbc05' } } },
									],
								},
							},
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										fontSize: '72px',
										fontFamily: 'Newsreader',
										fontStyle: 'italic',
										fontWeight: 400,
										lineHeight: 1.1,
										letterSpacing: '-0.03em',
									},
									children: [
										{
											type: 'span',
											props: {
												style: { color: 'rgba(0,0,0,0.88)' },
												children: "Can't think\u00a0",
											},
										},
										{
											type: 'span',
											props: {
												style: { color: '#3b82f6' },
												children: 'straight?',
											},
										},
									],
								},
							},
							{
								type: 'div',
								props: {
									style: {
										fontSize: '28px',
										color: 'rgba(0,0,0,0.5)',
										lineHeight: 1.6,
										marginTop: '20px',
										fontFamily: 'Inter',
									},
									children: 'Quillium works with that. Branch any sentence.',
								},
							},
							{
								type: 'div',
								props: {
									style: {
										display: 'flex',
										alignItems: 'center',
										gap: '8px',
										marginTop: '48px',
										fontFamily: 'Newsreader',
										fontStyle: 'italic',
										fontSize: '24px',
										fontWeight: 500,
										color: 'rgba(0,0,0,0.5)',
									},
									children: 'quillium.bryanhu.com',
								},
							},
						],
					},
				},
				{
					type: 'img',
					props: {
						src: logoUrl,
						width: 200,
						height: 200,
						style: {
							marginLeft: '60px',
						},
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

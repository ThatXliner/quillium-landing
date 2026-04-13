import { ImageResponse } from '@vercel/og';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const html = {
		type: 'div',
		props: {
			style: {
				width: '1200px',
				height: '630px',
				background: '#f5f4f1',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				padding: '80px 100px',
				fontFamily: 'Inter',
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
						children: 'Quillium works with that. Branch any sentence. Keep every version.',
					},
				},
				{
					type: 'div',
					props: {
						style: {
							display: 'flex',
							alignItems: 'center',
							gap: '12px',
							marginTop: '48px',
							fontFamily: 'Inter',
							fontSize: '22px',
							fontWeight: 500,
							color: 'rgba(0,0,0,0.6)',
						},
						children: [
							{
								type: 'span',
								props: {
									style: {
										fontFamily: 'Newsreader',
										fontStyle: 'italic',
										fontSize: '26px',
										color: 'rgba(0,0,0,0.7)',
									},
									children: 'Quillium',
								},
							},
							{
								type: 'span',
								props: {
									style: { color: 'rgba(0,0,0,0.25)', margin: '0 8px' },
									children: '·',
								},
							},
							{ type: 'span', props: { children: 'quillium.bryanhu.com' } },
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
				data: await fetch(
					'https://fonts.gstatic.com/s/newsreader/v26/cY9kfjOCX1hbuyalUrK439vogqC9yFZCYg7oRZaLP4obnf7fTXglsMwoT-ZA.ttf'
				).then((r) => r.arrayBuffer()),
				weight: 400,
				style: 'italic',
			},
			{
				name: 'Inter',
				data: await fetch(
					'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fMZg.ttf'
				).then((r) => r.arrayBuffer()),
				weight: 500,
				style: 'normal',
			},
		],
	});
};

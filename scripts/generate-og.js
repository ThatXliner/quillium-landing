import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const postsDir = join(root, 'src/lib/posts');
const outDir = join(root, 'static/og');

// Parse YAML frontmatter manually (avoid adding a dep)
function parseFrontmatter(content) {
	const match = content.match(/^---\n([\s\S]*?)\n---/);
	if (!match) return {};
	const result = {};
	for (const line of match[1].split('\n')) {
		const [key, ...rest] = line.split(':');
		if (key && rest.length) {
			result[key.trim()] = rest.join(':').trim().replace(/^["']|["']$/g, '');
		}
	}
	return result;
}

async function fetchFont(family, weight, style = 'normal') {
	const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:ital,wght@${style === 'italic' ? 1 : 0},${weight}&display=swap`;
	const css = await fetch(url, {
		headers: { 'User-Agent': 'Mozilla/5.0' }
	}).then((r) => r.text());
	const fontUrl = css.match(/src: url\((.+?)\) format\('(opentype|truetype|woff2)'\)/)?.[1];
	if (!fontUrl) throw new Error(`Could not find font URL for ${family} ${weight}`);
	const buf = await fetch(fontUrl).then((r) => r.arrayBuffer());
	return Buffer.from(buf);
}

async function generateOgImage({ title, date, author, slug }) {
	const [newsreader, inter] = await Promise.all([
		fetchFont('Newsreader', 400, 'italic'),
		fetchFont('Inter', 500),
	]);

	const svg = await satori(
		{
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
					// Top: Quillium wordmark
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
					// Middle: title
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
					// Bottom: author + date
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
								author
									? { type: 'span', props: { children: author } }
									: null,
								author
									? {
											type: 'span',
											props: {
												style: { color: 'rgba(0,0,0,0.2)' },
												children: '·',
											},
										}
									: null,
								{
									type: 'span',
									props: { children: date },
								},
							].filter(Boolean),
						},
					},
				],
			},
		},
		{
			width: 1200,
			height: 630,
			fonts: [
				{ name: 'Newsreader', data: newsreader, weight: 400, style: 'italic' },
				{ name: 'Inter', data: inter, weight: 500, style: 'normal' },
			],
		}
	);

	const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
	return resvg.render().asPng();
}

async function main() {
	if (!existsSync(outDir)) await mkdir(outDir, { recursive: true });

	const files = (await readdir(postsDir)).filter((f) => f.endsWith('.md'));
	console.log(`Generating OG images for ${files.length} post(s)...`);

	await Promise.all(
		files.map(async (file) => {
			const slug = file.replace('.md', '');
			const content = await readFile(join(postsDir, file), 'utf-8');
			const meta = parseFrontmatter(content);
			const png = await generateOgImage({
				title: meta.title ?? slug,
				date: meta.date ?? '',
				author: meta.author,
				slug,
			});
			await writeFile(join(outDir, `${slug}.png`), png);
			console.log(`  ✓ static/og/${slug}.png`);
		})
	);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});

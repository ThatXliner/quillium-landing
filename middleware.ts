import { next } from '@vercel/edge';
import { NodeHtmlMarkdown } from 'node-html-markdown';

const nhm = new NodeHtmlMarkdown();

export const config = {
	matcher: ['/', '/blog', '/blog/:path*', '/privacy', '/terms', '/ai', '/manifesto', '/pricing']
};

export default async function middleware(request: Request) {
	const accept = request.headers.get('accept') || '';
	if (!accept.includes('text/markdown')) {
		return next();
	}

	const response = await fetch(request.url, {
		headers: {
			accept: 'text/html'
		}
	});

	const contentType = response.headers.get('content-type') || '';
	if (!contentType.includes('text/html')) {
		return response;
	}

	const html = await response.text();
	const markdown = nhm.translate(html);
	const tokens = Math.ceil(markdown.length / 4);

	return new Response(markdown, {
		status: response.status,
		headers: {
			'content-type': 'text/markdown; charset=utf-8',
			'x-markdown-tokens': tokens.toString(),
			'content-signal': 'ai-train=yes, search=yes, ai-input=yes'
		}
	});
}

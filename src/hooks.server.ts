import type { Handle } from '@sveltejs/kit';
import { NodeHtmlMarkdown } from 'node-html-markdown';

const nhm = new NodeHtmlMarkdown();

function countTokens(text: string): number {
	return Math.ceil(text.length / 4);
}

export const handle: Handle = async ({ event, resolve }) => {
	const accept = event.request.headers.get('accept') || '';
	const wantsMarkdown = accept.includes('text/markdown');

	const response = await resolve(event);

	const isHomepage = event.url.pathname === '/';
	const contentType = response.headers.get('content-type') || '';
	const isHtml = contentType.includes('text/html');

	if (wantsMarkdown && isHtml) {
		const html = await response.text();
		const markdown = nhm.translate(html);
		const tokens = countTokens(markdown);

		return new Response(markdown, {
			status: response.status,
			headers: {
				'content-type': 'text/markdown; charset=utf-8',
				'x-markdown-tokens': tokens.toString(),
				'content-signal': 'ai-train=yes, search=yes, ai-input=yes'
			}
		});
	}

	if (isHomepage && isHtml) {
		const headers = new Headers(response.headers);
		headers.set('link', '</sitemap.xml>; rel="describedby"');
		headers.set('content-signal', 'ai-train=yes, search=yes, ai-input=yes');

		return new Response(response.body, {
			status: response.status,
			headers
		});
	}

	return response;
};

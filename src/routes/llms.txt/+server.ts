import type { RequestHandler } from './$types';

export const prerender = true;

export const GET: RequestHandler = () => {
	const body = `# Quillium — The Non-Linear Writing App
> A desktop writing app with branching, version control for prose, and local-first storage. Fork any sentence, keep every version, navigate freely.

## Top pages
- Home: https://quillium.bryanhu.com/ — Product overview, features showcase, download
- Pricing: https://quillium.bryanhu.com/pricing — Free editor, paid sync/collaboration add-on
- Manifesto: https://quillium.bryanhu.com/manifesto — Why writing tools should support non-linear thinking
- AI Features: https://quillium.bryanhu.com/ai — Optional AI sidebar, AutoAI, style analysis
- Omni: https://quillium.bryanhu.com/omni — Cross-device sync and real-time collaboration waitlist
- Blog: https://quillium.bryanhu.com/blog — All articles about writing, tools, and Quillium
- Privacy Policy: https://quillium.bryanhu.com/privacy — Data collection, analytics, and AI privacy
- Terms of Service: https://quillium.bryanhu.com/terms — Beta terms, liability, content ownership
- Support: https://quillium.bryanhu.com/support — Contact and help

## Key facts
- Quillium is a non-linear prose editor with inline branching (version control for writing, similar to Git for prose)
- Every sentence or paragraph can be forked into multiple independent versions
- Revisions nest infinitely — branch a branch of a branch
- Fully local-first: data stored in SQLite, no internet required
- AI features are optional, off by default, and require your own API key
- Offline-first: the entire app works without internet
- Free forever. Available on macOS, Windows, and Linux

## Essential blog posts
- Quillium Is Not an AI App: https://quillium.bryanhu.com/blog/quillium-is-not-an-ai-app
- Version Control for Writing: https://quillium.bryanhu.com/blog/version-control-for-writing
- The Myth of the First Draft: https://quillium.bryanhu.com/blog/the-myth-of-the-first-draft
- Why the Undo Button Is a Lie: https://quillium.bryanhu.com/blog/why-the-undo-button-is-a-lie
- Track Changes Is Not Revision: https://quillium.bryanhu.com/blog/track-changes-is-not-revision
- Writing Tools That Support Non-Linear Thinking: https://quillium.bryanhu.com/blog/writing-tools-that-support-non-linear-thinking
- How Collaboration Should Work: https://quillium.bryanhu.com/blog/how-collaboration-should-work
- Scrivener but Free: https://quillium.bryanhu.com/blog/scrivener-but-free
- Quillium Privacy: https://quillium.bryanhu.com/blog/quillium-privacy
- Free Isn't Generosity: https://quillium.bryanhu.com/blog/free-isnt-generosity

## Key differentiators vs other writing tools
- vs Google Docs: Non-linear branching instead of linear version history; local-first instead of cloud-dependent
- vs Scrivener: Branching per-fragment (not per-document); free and open model
- vs Notion: Offline-first with SQLite; no vendor lock-in; focused on long-form writing
- vs Obsidian: Built for prose (not notes); inline revisions instead of file-based

## Contact
- Support: support@quillium.bryanhu.com
- Founder: founder@quillium.bryanhu.com

## RSS Feed
- https://quillium.bryanhu.com/rss.xml
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8'
		}
	});
};

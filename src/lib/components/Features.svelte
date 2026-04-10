<script lang="ts">
	import { onMount } from 'svelte';
	import posthog from 'posthog-js';
	import revisionsImg from '$lib/assets/screenshots/revisions.png';
	import aiAnnotationsImg from '$lib/assets/screenshots/ai-annotations.png';
	import annotationsBelongImg from '$lib/assets/screenshots/annotations-belong.png';

	let showAiSection = $state(true);
	let showRevisionsDemo = $state(false);
	let revisionsGif = $state('');

	onMount(() => {
		posthog.onFeatureFlags(() => {
			const variant = posthog.getFeatureFlag('hide-ai-feature-section');
			showAiSection = variant !== 'hide-ai';
		});
	});
</script>

<!-- ==================== FEATURES ==================== -->
<section id="features" class="features-section">
	<div class="features-header reveal">
		<p class="section-eyebrow">What makes it different</p>
		<h2 class="section-heading">The tools your writing actually needs.</h2>
	</div>

	<!-- Feature 1: Branches / Revisions -->
	<div class="reveal feature-row">
		<div class="feature-media">
			{#if showRevisionsDemo && revisionsGif}
				<img
					src={revisionsGif}
					alt="Quillium revision branches demo showing inline version control in action"
					class="feature-screenshot"
				/>
			{:else}
				<img
					src={revisionsImg}
					alt="Quillium revision branches UI showing inline version control for prose"
					class="feature-screenshot"
					loading="lazy"
				/>
			{/if}
			<button
				class="demo-toggle"
				onclick={async () => {
					if (!revisionsGif) {
						const mod = await import('$lib/assets/QuilliumShortDemo.gif');
						revisionsGif = mod.default;
					}
					showRevisionsDemo = !showRevisionsDemo;
					posthog.capture('demo_toggle_clicked', {
						feature: 'revisions',
						showing_demo: showRevisionsDemo
					});
				}}
			>
				{#if showRevisionsDemo}
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<rect x="3" y="3" width="18" height="18" rx="2" />
						<rect x="8" y="8" width="8" height="8" rx="1" />
					</svg>
					Show screenshot
				{:else}
					<svg
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polygon points="6,3 20,12 6,21" />
					</svg>
					See it in action
				{/if}
			</button>
		</div>

		<div class="feature-text">
			<div class="feature-icon-wrap" style="background:rgba(168,85,247,0.08);">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
					<circle cx="5" cy="5" r="2.5" stroke="#a855f7" stroke-width="1.5" />
					<circle cx="5" cy="19" r="2.5" stroke="#a855f7" stroke-width="1.5" />
					<circle cx="19" cy="12" r="2.5" stroke="#a855f7" stroke-width="1.5" />
					<path d="M5 7.5V16.5" stroke="#a855f7" stroke-width="1.5" stroke-linecap="round" />
					<path
						d="M5 10C5 10 5 12 8.5 12H16.5"
						stroke="#a855f7"
						stroke-width="1.5"
						stroke-linecap="round"
					/>
				</svg>
			</div>
			<h3 class="feature-heading">Write in Branches</h3>
			<p class="feature-lead">
				Fork any sentence. Keep every version. Navigate your creative decisions freely and try what
				might work.
			</p>
		</div>
	</div>

	<!-- Feature 2: Annotations -->
	<div class="reveal feature-row feature-row--reversed">
		<div class="feature-text">
			<div class="feature-icon-wrap" style="background:rgba(252,188,5,0.1);">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
					<path
						d="M4 5C4 4.45 4.45 4 5 4H19C19.55 4 20 4.45 20 5V15C20 15.55 19.55 16 19 16H14L10 20.5V16H5C4.45 16 4 15.55 4 15V5Z"
						stroke="#d97706"
						stroke-width="1.5"
						stroke-linejoin="round"
					/>
					<line
						x1="8"
						y1="9"
						x2="16"
						y2="9"
						stroke="#d97706"
						stroke-width="1.3"
						stroke-linecap="round"
					/>
					<line
						x1="8"
						y1="12"
						x2="14"
						y2="12"
						stroke="#d97706"
						stroke-width="1.3"
						stroke-linecap="round"
					/>
				</svg>
			</div>
			<h3 class="feature-heading">Great Minds Think Together</h3>
			<p class="feature-lead">
				Comments, revisions, and suggestions float beside the text they're about.
				<a href="/pricing" class="text-black/40 underline underline-offset-2 hover:text-black/55">Collaboration and sync in the future</a>.
			</p>
		</div>

		<img
			src={annotationsBelongImg}
			alt="Quillium annotations and comments anchored beside the text they reference"
			class="feature-screenshot"
			loading="lazy"
		/>
	</div>

	<!-- Feature 3: A Second Voice -->
	{#if showAiSection}
		<div class="reveal feature-row">
			<img
				src={aiAnnotationsImg}
				alt="Quillium AI annotation panel providing inline writing feedback"
				class="feature-screenshot"
				loading="lazy"
			/>

			<div class="feature-text">
				<div class="feature-icon-wrap" style="background:rgba(34,197,94,0.08);">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
						<path
							d="M12 3L13.8 8.1L19.2 8.1L14.7 11.4L16.2 16.5L12 13.4L7.8 16.5L9.3 11.4L4.8 8.1L10.2 8.1L12 3Z"
							stroke="#22c55e"
							stroke-width="1.5"
							stroke-linejoin="round"
						/>
					</svg>
				</div>
				<h3 class="feature-heading">A Second Set of Eyes</h3>
				<p class="feature-lead">
					Not everyone is free to review your work. Now, you don't have to wait. Ask for feedback,
					find the right word, get clarity — all without leaving your flow.
				</p>
				<div class="tag-list">
					<span class="tag tag--green">Review &amp; revise</span>
					<span class="tag tag--green">Find the right word</span>
					<span class="tag tag--green">Tone feedback</span>
					<span class="tag tag--green">Clarity &amp; conciseness</span>
				</div>
			</div>
		</div>
	{/if}

	<!-- Feature 4: Offline-First -->
	<div class="reveal feature-row feature-row--full">
		<div class="feature-text">
			<div class="feature-icon-wrap" style="background:rgba(59,130,246,0.08);">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
					<path
						d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Z"
						stroke="#3b82f6"
						stroke-width="1.5"
					/>
					<path
						d="M8 12l3 3 5-6"
						stroke="#3b82f6"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</div>
			<h3 class="feature-heading">Never Lose Your Work</h3>
			<p class="feature-lead">
				Your work is saved locally. It's durable, reliable, instant, and no internet connection is
				required. A database with 25+ years of experience means even if your computer crashes
				mid-sentence, nothing is lost.
			</p>
			<div class="tag-list">
				<span class="tag tag--blue">Offline-first</span>
				<span class="tag tag--blue">SQLite-backed</span>
				<span class="tag tag--blue">Crash-resistant</span>
			</div>
		</div>
	</div>
</section>

<style>
	/* ── Features ── */
	.features-section {
		padding: 56px 24px;
		max-width: 72rem;
		margin: 0 auto;
	}
	@media (min-width: 768px) {
		.features-section {
			padding: 80px 24px;
		}
	}
	.features-header {
		margin-bottom: 64px;
		max-width: 32rem;
	}
	.feature-row {
		display: grid;
		grid-template-columns: 1fr;
		gap: 48px;
		margin-bottom: 80px;
		align-items: center;
	}
	@media (min-width: 768px) {
		.feature-row {
			grid-template-columns: 3fr 2fr;
			gap: 80px;
		}
		.feature-row--reversed {
			grid-template-columns: 2fr 3fr;
		}
		.feature-row--reversed .feature-text {
			order: -1;
		}
	}
	.feature-icon-wrap {
		width: 48px;
		height: 48px;
		border-radius: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 20px;
	}
	.feature-heading {
		font-family: 'Newsreader', Georgia, serif;
		font-size: 1.65rem;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.88);
		margin: 0 0 12px 0;
		line-height: 1.2;
		letter-spacing: -0.01em;
	}
	.feature-lead {
		font-size: 15.5px;
		color: rgba(0, 0, 0, 0.6);
		line-height: 1.8;
		margin: 0 0 16px 0;
	}
	.tag-list {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 20px;
	}
	.tag {
		border-radius: 9999px;
		padding: 3px 11px;
		font-size: 12px;
		font-family: 'Inter', sans-serif;
		font-weight: 500;
	}
	.tag--purple {
		background: rgba(168, 85, 247, 0.08);
		border: 1px solid rgba(168, 85, 247, 0.2);
		color: #7c3aed;
	}
	.tag--green {
		background: rgba(34, 197, 94, 0.08);
		border: 1px solid rgba(34, 197, 94, 0.2);
		color: #16a34a;
	}
	.tag--blue {
		background: rgba(59, 130, 246, 0.08);
		border: 1px solid rgba(59, 130, 246, 0.2);
		color: #2563eb;
	}
	.feature-row--full {
		grid-template-columns: 1fr;
		max-width: 36rem;
	}

	/* ── Demo toggle ── */
	.feature-media {
		position: relative;
	}
	.demo-toggle {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		margin-top: 12px;
		padding: 6px 14px;
		font-size: 13px;
		font-family: 'Inter', sans-serif;
		font-weight: 500;
		color: #7c3aed;
		background: rgba(168, 85, 247, 0.08);
		border: 1px solid rgba(168, 85, 247, 0.2);
		border-radius: 9999px;
		cursor: pointer;
		transition:
			background 0.2s,
			border-color 0.2s;
	}
	.demo-toggle:hover {
		background: rgba(168, 85, 247, 0.14);
		border-color: rgba(168, 85, 247, 0.35);
	}

	/* ── Screenshot images ── */
	.feature-screenshot {
		width: 100%;
		height: auto;
		border-radius: 10px;
		box-shadow:
			0 8px 32px rgba(44, 42, 39, 0.1),
			0 2px 8px rgba(44, 42, 39, 0.06);
	}
</style>

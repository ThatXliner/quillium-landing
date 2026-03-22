<script lang="ts">
	import revisionsImg from '$lib/assets/screenshots/revisions.png';
	import aiAnnotationsImg from '$lib/assets/screenshots/ai-annotations.png';
	import annotationsBelongImg from '$lib/assets/screenshots/annotations-belong.png';

</script>

<!-- ==================== FEATURES ==================== -->
<section id="features" class="features-section">
	<div class="features-header reveal">
		<p class="section-eyebrow">What makes it different</p>
		<h2 class="section-heading">The tools your writing actually needs.</h2>
	</div>

	<!-- Feature 1: Branches / Revisions -->
	<div class="reveal feature-row">
		<img
			src={revisionsImg}
			alt="Quillium revision branches UI showing inline version control for prose"
			class="feature-screenshot"
		/>

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
				Fork any sentence. Keep every version. Navigate your creative decisions like chapters, not
				mistakes.
			</p>
			<p class="feature-body">
				No more "draft 1," "draft 2," "draft FINAL." Your branches live in the document itself —
				visible, selectable, alive. Switch between them instantly. The one you didn't choose is
				still there when you need it.
			</p>
		</div>
	</div>
	<!-- Feature 2: A Second Voice -->
	<div class="reveal feature-row feature-row--reversed">
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
			<h3 class="feature-heading">A Second Voice</h3>
			<p class="feature-lead">
				AI that annotates, not interrupts. Ask for feedback, find the right word, get clarity — all
				without leaving your flow.
			</p>
			<p class="feature-body">
				It isn't a chatbot in the corner. It responds to your text right where you are — flagging a
				passive construction, offering a sharper phrasing, or just confirming that the sentence you
				struggled over is, actually, right.
			</p>
			<div class="tag-list">
				<span class="tag tag--green">Review &amp; revise</span>
				<span class="tag tag--green">Find the right word</span>
				<span class="tag tag--green">Tone feedback</span>
				<span class="tag tag--green">Clarity &amp; conciseness</span>
			</div>
		</div>

		<img
			src={aiAnnotationsImg}
			alt="Quillium AI annotation panel providing inline writing feedback"
			class="feature-screenshot"
		/>
	</div>

	<!-- Feature 3: Annotations -->
	<div class="reveal feature-row">
		<img
			src={annotationsBelongImg}
			alt="Quillium annotations and comments anchored beside the text they reference"
			class="feature-screenshot"
		/>

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
			<h3 class="feature-heading">Annotations That Belong</h3>
			<p class="feature-lead">
				Comments, revisions, and suggestions float beside the text they're about. Not buried in a
				sidebar. Not lost in a thread.
			</p>
			<p class="feature-body">
				Every note is anchored to the exact phrase it concerns — spatial and immediate. Scroll past
				it, and it moves with the text. Resolve it, and it disappears cleanly. The document stays
				the document.
			</p>
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
		color: rgba(0, 0, 0, 0.5);
		line-height: 1.8;
		margin: 0 0 16px 0;
	}
	.feature-body {
		font-size: 14px;
		color: rgba(0, 0, 0, 0.35);
		line-height: 1.75;
		margin: 0;
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

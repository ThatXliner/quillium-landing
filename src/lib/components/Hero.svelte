<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		// Branch version toggle in hero mockup
		document.querySelectorAll('.branch-version').forEach((el) => {
			el.addEventListener('click', () => {
				const parent = el.closest('.branch-row');
				const versions = parent?.querySelectorAll('.branch-version');
				versions?.forEach((v) => {
					v.classList.toggle('active', v === el);
					v.classList.toggle('alternate', v !== el);
				});
			});
		});
	});
</script>

<!-- ==================== HERO ==================== -->
<section class="hero-section">
	<div class="hero-text">
		<div class="reveal eyebrow-row">
			<span class="status-dot"></span>
			<span class="eyebrow-text">Now accepting early access</span>
		</div>

		<h1 class="reveal reveal-delay-1 hero-headline">
			Writing isn't<br />a straight&nbsp;line.
		</h1>

		<p class="reveal reveal-delay-2 hero-sub">
			For the novelist who writes the same chapter four different ways. For the essayist who can't
			commit to a thesis until they've argued three. Quillium is the editor that treats
			non-linearity as a feature — not a problem to manage.
		</p>

		<div class="reveal reveal-delay-3 cta-row">
			<a href="#waitlist" class="btn-primary btn-large">Join the Waitlist</a>
			<a href="#features" class="btn-ghost">
				Learn more
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="arrow-icon">
					<path
						d="M3 8H13M13 8L9 4M13 8L9 12"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</a>
		</div>
	</div>

	<!-- EDITOR MOCKUP -->
	<div class="reveal reveal-delay-4 hero-mockup-container">
		<div class="mockup-wrap">
			<div class="editor-mockup float-anim">
				<!-- Window chrome -->
				<div class="window-chrome">
					<div class="traffic-lights">
						<div class="tl-red"></div>
						<div class="tl-yellow"></div>
						<div class="tl-green"></div>
					</div>
					<div class="window-tab">Chapter Three — Draft</div>
					<div class="word-count-badge">
						<span class="status-dot"></span>
						<span>842 words</span>
					</div>
				</div>

				<div class="editor-body">
					<!-- Sidebar gutter -->
					<div class="line-gutter">
						<span class="line-number">1</span>
						<span class="line-number">2</span>
						<span class="line-number">3</span>
						<span class="line-number">4</span>
						<span class="line-number">5</span>
						<span class="line-number">6</span>
					</div>

					<div class="editor-main">
						<!-- Toolbar -->
						<div class="toolbar">
							<button class="toolbar-btn" title="Bold" aria-label="Bold">
								<svg width="13" height="14" viewBox="0 0 13 14" fill="none"
									><path
										d="M3.5 7H8C9.1 7 10 6.1 10 5C10 3.9 9.1 3 8 3H3.5V7Z"
										stroke="currentColor"
										stroke-width="1.4"
										stroke-linejoin="round"
									/><path
										d="M3.5 7H8.5C9.88 7 11 8.12 11 9.5C11 10.88 9.88 12 8.5 12H3.5V7Z"
										stroke="currentColor"
										stroke-width="1.4"
										stroke-linejoin="round"
									/></svg
								>
							</button>
							<button class="toolbar-btn" title="Italic" aria-label="Italic">
								<svg width="13" height="14" viewBox="0 0 13 14" fill="none"
									><path
										d="M8 3H5M9 12H6M7 3L5.5 12"
										stroke="currentColor"
										stroke-width="1.4"
										stroke-linecap="round"
									/></svg
								>
							</button>
							<div class="toolbar-divider"></div>
							<button class="toolbar-btn active" title="Branch" aria-label="Create branch">
								<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
									<circle cx="3" cy="3" r="1.5" stroke="currentColor" stroke-width="1.3" />
									<circle cx="3" cy="11" r="1.5" stroke="currentColor" stroke-width="1.3" />
									<circle cx="11" cy="7" r="1.5" stroke="currentColor" stroke-width="1.3" />
									<path d="M3 4.5V9.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" />
									<path
										d="M3 5.5C3 5.5 3 7 5.5 7H9.5"
										stroke="currentColor"
										stroke-width="1.3"
										stroke-linecap="round"
									/>
								</svg>
							</button>
							<button class="toolbar-btn" title="Comment" aria-label="Add comment">
								<svg width="14" height="14" viewBox="0 0 14 14" fill="none"
									><path
										d="M2 3C2 2.45 2.45 2 3 2H11C11.55 2 12 2.45 12 3V9C12 9.55 11.55 10 11 10H8L5 12.5V10H3C2.45 10 2 9.55 2 9V3Z"
										stroke="currentColor"
										stroke-width="1.3"
										stroke-linejoin="round"
									/></svg
								>
							</button>
							<button class="toolbar-btn toolbar-btn--ai" title="AI Assist" aria-label="AI assistance">
								<svg width="14" height="14" viewBox="0 0 14 14" fill="none"
									><path
										d="M7 2L8.2 5.3L11.5 5.3L8.9 7.3L9.8 10.7L7 8.8L4.2 10.7L5.1 7.3L2.5 5.3L5.8 5.3L7 2Z"
										stroke="currentColor"
										stroke-width="1.2"
										stroke-linejoin="round"
									/></svg
								>
							</button>
							<div class="flex-1"></div>
							<div class="branch-pill">
								<svg width="10" height="10" viewBox="0 0 10 10" fill="none">
									<circle cx="2" cy="2" r="1.3" stroke="#3b82f6" stroke-width="1" />
									<circle cx="2" cy="8" r="1.3" stroke="#3b82f6" stroke-width="1" />
									<circle cx="8" cy="5" r="1.3" stroke="#3b82f6" stroke-width="1" />
									<path d="M2 3.3V6.7" stroke="#3b82f6" stroke-width="1" stroke-linecap="round" />
									<path
										d="M2 4.3C2 4.3 2 5 3.5 5H6.7"
										stroke="#3b82f6"
										stroke-width="1"
										stroke-linecap="round"
									/>
								</svg>
								<span>2 branches</span>
							</div>
						</div>

						<!-- Document content -->
						<div class="doc-content">
							<p class="prose-line">The café had emptied out by the time she noticed the letter.</p>
							<p class="prose-line">
								She had been walking for <span class="comment-highlight active"
									>three hours</span
								> when the
							</p>

							<!-- Branch row -->
							<div class="branch-row">
								<div class="branch-version active">
									<div class="branch-label">
										<span class="branch-dot" style="background:#3b82f6;"></span>
										<span class="branch-label-text" style="color:#3b82f6;">VERSION A</span>
									</div>
									rain began — gently at first, then all at once, the way grief arrives.
								</div>
								<div class="branch-fork-icon">
									<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
										<path
											d="M6 4V14M6 4L4 6M6 4L8 6"
											stroke="#c9c2b8"
											stroke-width="1.3"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
										<path
											d="M6 9H12M12 9L10 7M12 9L10 11"
											stroke="#3b82f6"
											stroke-width="1.3"
											stroke-linecap="round"
											stroke-linejoin="round"
										/>
									</svg>
								</div>
								<div class="branch-version alternate">
									<div class="branch-label">
										<span class="branch-dot" style="background:#c9c2b8;"></span>
										<span class="branch-label-text" style="color:#a89e94;">VERSION B</span>
									</div>
									city had already swallowed the last light of afternoon without ceremony.
								</div>
							</div>

							<p class="prose-line">
								She <span class="suggestion-highlight">paused at the intersection</span>, unsure
								which direction led home anymore, or whether home was the word she still meant.
							</p>
							<p class="prose-line">
								The letter was addressed to someone who no longer lived at her address.<span
									class="cursor-blink"
								></span>
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Comment bubble -->
			<div class="comment-bubble float-anim float-delay-1">
				<div class="comment-avatar">E</div>
				<div>
					<div class="comment-author">Elena</div>
					<p class="comment-text">"three hours" feels imprecise — how long <em>is</em> grief?</p>
					<div class="comment-actions">
						<span class="comment-action-reply">Reply</span>
						<span class="comment-action-resolve">Resolve</span>
					</div>
				</div>
			</div>

			<!-- AI revision panel -->
			<div class="ai-panel float-anim float-delay-2">
				<div class="ai-panel-header">
					<div class="ai-panel-icon">
						<svg width="12" height="12" viewBox="0 0 12 12" fill="none"
							><path
								d="M6 1L7.1 4.1L10.2 4.1L7.8 5.9L8.6 9.1L6 7.4L3.4 9.1L4.2 5.9L1.8 4.1L4.9 4.1L6 1Z"
								stroke="#a855f7"
								stroke-width="1"
								stroke-linejoin="round"
								fill="rgba(168,85,247,0.15)"
							/></svg
						>
					</div>
					<span class="ai-panel-title">AI Revision</span>
				</div>
				<p class="ai-suggestion-text">
					"She walked for hours, losing track of time — until the rain arrived the way grief does,
					all at once."
				</p>
				<div class="ai-panel-actions">
					<button class="btn-accept">Accept</button>
					<button class="btn-dismiss">Dismiss</button>
				</div>
			</div>

			<!-- Clarity badge -->
			<div class="clarity-badge float-anim float-delay-3">
				<svg width="11" height="11" viewBox="0 0 11 11" fill="none">
					<circle cx="5.5" cy="5.5" r="4.5" stroke="#22c55e" stroke-width="1" />
					<path
						d="M3.5 5.5L5 7L7.5 4"
						stroke="#22c55e"
						stroke-width="1.2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				<span>Clarity improved</span>
			</div>
		</div>
	</div>

	<!-- Mobile hint -->
	<div class="mobile-hint">
		<p>
			<span class="mobile-hint-accent">Non-linear editing.</span> Multiple versions of every sentence.
			AI that annotates, not interrupts.
		</p>
	</div>
</section>

<style>
	/* ── Hero ── */
	.hero-section {
		padding-top: 112px;
		padding-bottom: 64px;
		padding-left: 24px;
		padding-right: 24px;
		max-width: 72rem;
		margin: 0 auto;
	}
	@media (min-width: 768px) {
		.hero-section {
			padding-top: 144px;
			padding-bottom: 96px;
		}
	}
	.hero-text {
		max-width: 42rem;
	}
	.eyebrow-row {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 28px;
	}
	.eyebrow-text {
		font-size: 13px;
		font-weight: 500;
		color: #6b6560;
		letter-spacing: 0.025em;
	}
	.hero-headline {
		font-family: 'Lora', Georgia, serif;
		font-size: clamp(2.6rem, 6vw, 4.2rem);
		font-weight: 700;
		line-height: 1.12;
		letter-spacing: -0.02em;
		color: #1e1c1a;
		margin: 0 0 24px 0;
	}
	.hero-sub {
		font-size: clamp(1rem, 2vw, 1.175rem);
		color: #5a554f;
		line-height: 1.8;
		max-width: 36rem;
		margin: 0 0 36px 0;
	}
	.cta-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 16px;
		margin-bottom: 56px;
	}

	/* ── Editor mockup ── */
	.hero-mockup-container {
		display: none;
		position: relative;
	}
	@media (min-width: 768px) {
		.hero-mockup-container {
			display: block;
		}
	}
	.mockup-wrap {
		position: relative;
		max-width: 80rem;
		margin: 0 auto;
	}
	.editor-mockup {
		background: #fefefe;
		border-radius: 12px;
		box-shadow:
			0 20px 60px rgba(44, 42, 39, 0.14),
			0 4px 16px rgba(44, 42, 39, 0.08);
		overflow: visible;
		position: relative;
		z-index: 2;
	}
	.float-anim {
		animation: float 6s ease-in-out infinite;
	}
	.float-delay-1 {
		animation-delay: 1s;
	}
	.float-delay-2 {
		animation-delay: 2.5s;
	}
	.float-delay-3 {
		animation-delay: 4s;
	}
	@keyframes float {
		0%,
		100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-6px);
		}
	}
	.window-chrome {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 14px 20px;
		border-bottom: 1px solid #f0ede8;
	}
	.traffic-lights {
		display: flex;
		gap: 6px;
	}
	.tl-red {
		width: 11px;
		height: 11px;
		border-radius: 50%;
		background: #ff5f57;
	}
	.tl-yellow {
		width: 11px;
		height: 11px;
		border-radius: 50%;
		background: #ffbd2e;
	}
	.tl-green {
		width: 11px;
		height: 11px;
		border-radius: 50%;
		background: #28ca41;
	}
	.window-tab {
		flex: 1;
		background: #f7f5f2;
		border-radius: 5px;
		height: 20px;
		width: 180px;
		max-width: 180px;
		margin: 0 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 11px;
		color: #9c968e;
		font-family: 'Inter', sans-serif;
	}
	.word-count-badge {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 11px;
		color: #a89e94;
		font-family: 'Inter', sans-serif;
	}
	.editor-body {
		display: flex;
		min-height: 380px;
	}
	.line-gutter {
		display: none;
		flex-direction: column;
		align-items: flex-end;
		padding-top: 24px;
		padding-left: 12px;
		padding-right: 12px;
		width: 44px;
		border-right: 1px solid #f0ede8;
		background: #faf9f7;
		flex-shrink: 0;
		gap: 12.4px;
	}
	@media (min-width: 640px) {
		.line-gutter {
			display: flex;
		}
	}
	.line-number {
		font-size: 11px;
		color: #c9c2b8;
		font-family: 'Inter', monospace;
		text-align: right;
		user-select: none;
	}
	.editor-main {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
	.toolbar {
		display: flex;
		align-items: center;
		gap: 4px;
		padding: 10px 20px;
		border-bottom: 1px solid #f0ede8;
	}
	.toolbar-btn {
		width: 28px;
		height: 28px;
		border-radius: 6px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #6b6560;
		cursor: pointer;
		transition:
			background 0.15s,
			color 0.15s;
		background: transparent;
		border: none;
		flex-shrink: 0;
	}
	.toolbar-btn:hover {
		background: #f0ede8;
		color: #2c2a27;
	}
	.toolbar-btn.active {
		background: #f0ede8;
		color: #3b82f6;
	}
	.toolbar-btn--ai {
		color: #a855f7;
	}
	.toolbar-divider {
		width: 1px;
		height: 18px;
		background: #e8e3db;
		margin: 0 4px;
	}
	.branch-pill {
		background: rgba(59, 130, 246, 0.08);
		border: 1px solid rgba(59, 130, 246, 0.2);
		border-radius: 9999px;
		padding: 2px 10px;
		display: flex;
		align-items: center;
		gap: 5px;
	}
	.branch-pill span {
		font-size: 11px;
		font-weight: 500;
		color: #2563eb;
		font-family: 'Inter', sans-serif;
	}
	.doc-content {
		flex: 1;
		padding: 24px 28px 16px;
	}
	.prose-line {
		font-family: 'Lora', Georgia, serif;
		font-size: 14.5px;
		line-height: 1.85;
		color: #2c2a27;
		margin: 0;
	}
	.comment-highlight {
		background: #fef2cd;
		border-bottom: 2px solid #fcbc05;
		cursor: pointer;
		transition: background 0.2s;
	}
	.comment-highlight.active {
		background: #fde89b;
	}
	.suggestion-highlight {
		background: #f0fdf4;
		border-bottom: 2px solid #22c55e;
	}
	.branch-row {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: 8px;
		padding: 6px 0;
	}
	.branch-version {
		display: inline-block;
		padding: 4px 8px;
		border-radius: 4px;
		font-size: 13px;
		line-height: 1.6;
		font-family: 'Lora', Georgia, serif;
		cursor: pointer;
		transition: all 0.2s;
	}
	.branch-version.active {
		background: rgba(59, 130, 246, 0.1);
		color: #1e40af;
		border: 1px solid rgba(59, 130, 246, 0.25);
	}
	.branch-version.alternate {
		background: #f7f5f2;
		color: #9c968e;
		border: 1px dashed #d6cfc5;
		text-decoration: line-through;
		text-decoration-color: #c9c2b8;
	}
	.branch-label {
		display: flex;
		align-items: center;
		gap: 4px;
		margin-bottom: 2px;
	}
	.branch-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		display: inline-block;
		flex-shrink: 0;
	}
	.branch-label-text {
		font-size: 10px;
		font-weight: 600;
		font-family: 'Inter', sans-serif;
		letter-spacing: 0.03em;
	}
	.branch-fork-icon {
		align-self: center;
		flex-shrink: 0;
		color: #c9c2b8;
	}
	.cursor-blink {
		display: inline-block;
		width: 2px;
		height: 15px;
		background: #3b82f6;
		border-radius: 1px;
		vertical-align: text-bottom;
		animation: blink 1.1s step-end infinite;
		margin-left: 1px;
	}
	@keyframes blink {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
	}

	/* Floating panels */
	.comment-bubble {
		position: absolute;
		top: 168px;
		left: -190px;
		width: 172px;
		padding: 10px 12px;
		z-index: 5;
		background: #fffbeb;
		border: 1px solid rgba(252, 188, 5, 0.35);
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(44, 42, 39, 0.07);
		display: none;
	}
	@media (min-width: 1024px) {
		.comment-bubble {
			display: block;
		}
	}
	.comment-bubble > div {
		display: flex;
		gap: 6px;
		margin-bottom: 5px;
	}
	.comment-avatar {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: #fde89b;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 10px;
		font-weight: 700;
		color: #92660a;
		flex-shrink: 0;
	}
	.comment-author {
		font-size: 11px;
		font-weight: 600;
		color: #5a554f;
		font-family: 'Inter', sans-serif;
		display: flex;
		align-items: center;
	}
	.comment-text {
		font-size: 12px;
		color: #5a554f;
		line-height: 1.6;
		margin: 0;
		font-family: 'Inter', sans-serif;
	}
	.comment-actions {
		display: flex;
		gap: 8px;
		margin-top: 8px;
	}
	.comment-action-reply {
		font-size: 11px;
		color: #3b82f6;
		font-weight: 500;
		cursor: pointer;
		font-family: 'Inter', sans-serif;
	}
	.comment-action-resolve {
		font-size: 11px;
		color: #a89e94;
		cursor: pointer;
		font-family: 'Inter', sans-serif;
	}
	.ai-panel {
		position: absolute;
		top: 72px;
		right: -256px;
		width: 240px;
		padding: 14px 16px;
		z-index: 5;
		background: rgba(253, 250, 255, 0.92);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		border: 1px solid rgba(168, 85, 247, 0.2);
		border-radius: 10px;
		box-shadow:
			0 8px 32px rgba(168, 85, 247, 0.1),
			0 2px 8px rgba(44, 42, 39, 0.06);
		display: none;
	}
	@media (min-width: 1100px) {
		.ai-panel {
			display: block;
		}
	}
	.ai-panel-header {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-bottom: 10px;
	}
	.ai-panel-icon {
		width: 22px;
		height: 22px;
		border-radius: 6px;
		background: rgba(168, 85, 247, 0.12);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.ai-panel-title {
		font-size: 11px;
		font-weight: 600;
		color: #7c3aed;
		font-family: 'Inter', sans-serif;
	}
	.ai-suggestion-text {
		font-size: 12px;
		color: #5a554f;
		line-height: 1.65;
		margin: 0 0 10px 0;
		font-family: 'Lora', Georgia, serif;
		font-style: italic;
	}
	.ai-panel-actions {
		display: flex;
		gap: 6px;
	}
	.clarity-badge {
		position: absolute;
		bottom: 62px;
		right: -188px;
		background: #f0fdf4;
		border: 1px solid rgba(34, 197, 94, 0.3);
		border-radius: 7px;
		padding: 6px 10px;
		z-index: 5;
		display: none;
		align-items: center;
		gap: 5px;
	}
	@media (min-width: 1100px) {
		.clarity-badge {
			display: flex;
		}
	}
	.clarity-badge span {
		font-size: 11px;
		color: #15803d;
		font-weight: 500;
		font-family: 'Inter', sans-serif;
	}

	/* Mobile hint */
	.mobile-hint {
		margin-top: 32px;
		padding: 20px;
		border-radius: 12px;
		background: #f7f5f2;
		border: 1px solid #e8e3db;
	}
	@media (min-width: 768px) {
		.mobile-hint {
			display: none;
		}
	}
	.mobile-hint p {
		text-align: center;
		font-size: 14px;
		color: #6b6560;
		font-family: 'Inter', sans-serif;
		margin: 0;
	}
	.mobile-hint-accent {
		font-weight: 600;
		color: #3b82f6;
	}
</style>

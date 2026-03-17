<!-- ==================== HERO ==================== -->
<section class="hero-section">
	<div class="hero-text">
		<div class="reveal eyebrow-row">
			<span class="status-dot"></span>
			<span class="eyebrow-text">Now in public beta</span>
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

	<!-- HERO APP MOCK -->
	<div class="reveal reveal-delay-4 hero-mockup-container">
		<div class="mockup-wrap">
			<div class="app-window">
				<!-- macOS chrome -->
				<div class="app-titlebar">
					<div class="traffic-lights">
						<div class="tl tl-red"></div>
						<div class="tl tl-yellow"></div>
						<div class="tl tl-green"></div>
					</div>
					<span class="app-title">quillium</span>
				</div>

				<!-- Top status bar -->
				<div class="app-statusbar">
					<div class="status-pill">
						<span class="status-dot-green"></span>
						<span class="status-label">Saved</span>
						<div class="status-divider"></div>
						<div class="status-stat">
							<span class="stat-main">Words: 842</span>
							<span class="stat-sub">3291 total</span>
						</div>
						<div class="status-divider"></div>
						<div class="status-stat">
							<span class="stat-main">Characters: 4,819</span>
							<span class="stat-sub">21,403 total</span>
						</div>
						<button class="export-btn" aria-label="Export">
							<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
								<rect
									x="2"
									y="2"
									width="10"
									height="10"
									rx="2"
									stroke="#6b6560"
									stroke-width="1.2"
								/>
								<path
									d="M5 6L7 4L9 6"
									stroke="#6b6560"
									stroke-width="1.2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path d="M7 4V9" stroke="#6b6560" stroke-width="1.2" stroke-linecap="round" />
							</svg>
						</button>
					</div>
				</div>

				<!-- Main layout -->
				<div class="app-body">
					<!-- AI Chat panel (left, partially visible) -->
					<div class="ai-drawer">
						<div class="ai-drawer-tabs">
							<button class="drawer-tab drawer-tab--active" aria-label="Chat">
								<svg width="14" height="14" viewBox="0 0 14 14" fill="none"
									><path
										d="M2 3C2 2.45 2.45 2 3 2H11C11.55 2 12 2.45 12 3V8C12 8.55 11.55 9 11 9H8L5.5 11.5V9H3C2.45 9 2 8.55 2 8V3Z"
										stroke="#3b82f6"
										stroke-width="1.2"
										stroke-linejoin="round"
									/></svg
								>
							</button>
							<button class="drawer-tab" aria-label="Suggest">
								<svg width="14" height="14" viewBox="0 0 14 14" fill="none"
									><path
										d="M7 1.5L8.2 4.7L11.5 4.7L8.9 6.7L9.8 9.9L7 8L4.2 9.9L5.1 6.7L2.5 4.7L5.8 4.7L7 1.5Z"
										stroke="#6b6560"
										stroke-width="1.1"
										stroke-linejoin="round"
									/></svg
								>
							</button>
							<button class="drawer-tab" aria-label="Edit">
								<svg width="14" height="14" viewBox="0 0 14 14" fill="none"
									><path
										d="M9 2.5L11.5 5L5 11.5H2.5V9L9 2.5Z"
										stroke="#6b6560"
										stroke-width="1.2"
										stroke-linejoin="round"
									/></svg
								>
							</button>
							<span class="drawer-label">Chat with AI</span>
							<div class="drawer-spacer"></div>
							<button class="drawer-close" aria-label="Close">
								<svg width="10" height="10" viewBox="0 0 10 10" fill="none"
									><path
										d="M2 2L8 8M8 2L2 8"
										stroke="#9c968e"
										stroke-width="1.2"
										stroke-linecap="round"
									/></svg
								>
							</button>
						</div>
						<div class="ai-drawer-body">
							<p class="ai-placeholder">Start a conversation about your document</p>
						</div>
						<div class="ai-drawer-footer">
							<div class="ai-context-quote">
								<span class="ai-context-label">Context:</span>
								<span class="ai-context-text"
									>"the rain began — gently at first, then all at once, the way grief arrives..."</span
								>
							</div>
							<input class="ai-input" type="text" placeholder="Ask about selection..." readonly />
							<button class="ai-send-btn">Send</button>
						</div>
					</div>

					<!-- Document editor -->
					<div class="doc-editor">
						<div class="doc-prose">
							<p class="prose-p">
								The café had <span class="highlight-comment">emptied out</span> by the time she noticed
								the letter. It was propped against the salt shaker, her name written in handwriting she
								didn't recognise — careful, unhurried, like someone who had practiced saying something
								difficult.
							</p>
							<p class="prose-p">
								She had been walking for hours when <span class="highlight-yellow"
									>the rain began — gently at first, then all at once, the way grief arrives without
									warning or ceremony.</span
								> By the time she reached the corner of Elm and Fifth, her coat was soaked through and
								she had stopped noticing. The city kept moving around her the way it always did, indifferent
								and bright.
							</p>
							<p class="prose-p">
								She ordered another coffee she wouldn't finish. <span class="highlight-underline"
									>The letter stayed where it was.</span
								>
							</p>
							<p class="prose-p">
								Outside, a man walked his dog in the rain. The dog did not seem to mind.
							</p>
						</div>
					</div>

					<!-- Right sidebar -->
					<div class="right-sidebar">
						<!-- Comment 1 -->
						<div class="sidebar-card">
							<div class="sidebar-card-header">
								<span class="sidebar-card-label">COMMENT</span>
								<button class="sidebar-card-delete" aria-label="Delete">
									<svg width="11" height="11" viewBox="0 0 11 11" fill="none"
										><path
											d="M2 2.5H9M4.5 2.5V2C4.5 1.72 4.72 1.5 5 1.5H6C6.28 1.5 6.5 1.72 6.5 2V2.5M3 2.5L3.5 9H7.5L8 2.5"
											stroke="#c9c2b8"
											stroke-width="1"
											stroke-linecap="round"
											stroke-linejoin="round"
										/></svg
									>
								</button>
							</div>
							<div class="sidebar-anchor">emptied out</div>
							<div class="sidebar-comment-row">
								<div class="comment-avatar">E</div>
								<div>
									<div class="comment-meta">
										<span class="comment-author">Elena</span><span class="comment-time"
											>just now</span
										>
									</div>
									<p class="comment-body">Too casual? "grown quiet" might land better.</p>
								</div>
							</div>
						</div>

						<!-- Revision card -->
						<div class="sidebar-card">
							<div class="sidebar-card-header">
								<span class="sidebar-card-label">REVISION</span>
								<button class="sidebar-card-delete" aria-label="Delete">
									<svg width="11" height="11" viewBox="0 0 11 11" fill="none"
										><path
											d="M2 2.5H9M4.5 2.5V2C4.5 1.72 4.72 1.5 5 1.5H6C6.28 1.5 6.5 1.72 6.5 2V2.5M3 2.5L3.5 9H7.5L8 2.5"
											stroke="#c9c2b8"
											stroke-width="1"
											stroke-linecap="round"
											stroke-linejoin="round"
										/></svg
									>
								</button>
							</div>
							<div class="revision-pills">
								<div class="revision-pill revision-pill--grey">
									<span>gently at first...</span>
									<button class="pill-x" aria-label="Remove">×</button>
								</div>
								<div class="revision-pill revision-pill--purple">
									<span>then all at once...</span>
									<button class="pill-x" aria-label="Remove">×</button>
								</div>
							</div>
							<div class="revision-actions">
								<button class="revision-btn-new">
									<svg width="10" height="10" viewBox="0 0 10 10" fill="none"
										><path
											d="M5 2V8M2 5H8"
											stroke="#3b82f6"
											stroke-width="1.3"
											stroke-linecap="round"
										/></svg
									>
									New version
								</button>
								<button class="revision-btn-nested">
									<svg width="10" height="10" viewBox="0 0 10 10" fill="none"
										><path
											d="M2 4L5 7L8 4"
											stroke="#6b6560"
											stroke-width="1.2"
											stroke-linecap="round"
											stroke-linejoin="round"
										/></svg
									>
									Nested editor
								</button>
							</div>
						</div>

						<!-- Comment 2 -->
						<div class="sidebar-card">
							<div class="sidebar-card-header">
								<span class="sidebar-card-label">COMMENT</span>
								<button class="sidebar-card-delete" aria-label="Delete">
									<svg width="11" height="11" viewBox="0 0 11 11" fill="none"
										><path
											d="M2 2.5H9M4.5 2.5V2C4.5 1.72 4.72 1.5 5 1.5H6C6.28 1.5 6.5 1.72 6.5 2V2.5M3 2.5L3.5 9H7.5L8 2.5"
											stroke="#c9c2b8"
											stroke-width="1"
											stroke-linecap="round"
											stroke-linejoin="round"
										/></svg
									>
								</button>
							</div>
							<div class="sidebar-anchor">The letter stayed where it was.</div>
							<div class="sidebar-comment-row">
								<div class="comment-avatar">E</div>
								<div>
									<div class="comment-meta">
										<span class="comment-author">Elena</span><span class="comment-time"
											>just now</span
										>
									</div>
									<p class="comment-body">This is the best line in the chapter.</p>
								</div>
							</div>
							<div class="comment-reply-row">
								<input
									class="comment-reply-input"
									type="text"
									value="Agreed, keeping it."
									readonly
								/>
								<button class="comment-reply-send">Send</button>
							</div>
							<button class="comment-suggest-btn">
								<svg width="10" height="10" viewBox="0 0 10 10" fill="none"
									><path
										d="M5 1L6 3.5H8.5L6.5 5L7.2 7.5L5 6L2.8 7.5L3.5 5L1.5 3.5H4L5 1Z"
										stroke="#a855f7"
										stroke-width="0.9"
										stroke-linejoin="round"
									/></svg
								>
								Suggest
							</button>
						</div>
					</div>
				</div>
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

	/* ── App window mock ── */
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
	.app-window {
		background: #e8e8e8;
		border-radius: 12px;
		box-shadow:
			0 24px 80px rgba(44, 42, 39, 0.18),
			0 4px 16px rgba(44, 42, 39, 0.1);
		overflow: hidden;
		font-family: 'Inter', system-ui, sans-serif;
		-webkit-font-smoothing: antialiased;
	}

	/* Title bar */
	.app-titlebar {
		background: #d8d8d8;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 10px 16px;
		position: relative;
		border-bottom: 1px solid #c8c8c8;
	}
	.traffic-lights {
		position: absolute;
		left: 14px;
		display: flex;
		gap: 6px;
		align-items: center;
	}
	.tl {
		width: 12px;
		height: 12px;
		border-radius: 50%;
	}
	.tl-red {
		background: #ff5f57;
	}
	.tl-yellow {
		background: #ffbd2e;
	}
	.tl-green {
		background: #28ca41;
	}
	.app-title {
		font-size: 12px;
		font-weight: 500;
		color: #5a5a5a;
		letter-spacing: 0.01em;
	}

	/* Status bar */
	.app-statusbar {
		background: #e8e8e8;
		display: flex;
		justify-content: center;
		padding: 10px 16px;
	}
	.status-pill {
		background: #d4d4d4;
		border-radius: 9999px;
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 6px 14px;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.08);
	}
	.status-dot-green {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #22c55e;
		flex-shrink: 0;
	}
	.status-label {
		font-size: 11.5px;
		font-weight: 500;
		color: #4a4a4a;
	}
	.status-divider {
		width: 1px;
		height: 14px;
		background: #b8b8b8;
	}
	.status-stat {
		display: flex;
		flex-direction: column;
		gap: 1px;
	}
	.stat-main {
		font-size: 11px;
		font-weight: 500;
		color: #3a3a3a;
	}
	.stat-sub {
		font-size: 9.5px;
		color: #888;
	}
	.export-btn {
		width: 28px;
		height: 28px;
		border-radius: 50%;
		background: #c8c8c8;
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		flex-shrink: 0;
	}

	/* Main layout */
	.app-body {
		display: grid;
		grid-template-columns: 220px 1fr 200px;
		min-height: 480px;
		background: #e8e8e8;
		gap: 0;
	}

	/* AI drawer */
	.ai-drawer {
		background: #f2f2f2;
		border-right: 1px solid #d0d0d0;
		display: flex;
		flex-direction: column;
		font-size: 12px;
	}
	.ai-drawer-tabs {
		display: flex;
		align-items: center;
		gap: 2px;
		padding: 8px 10px;
		border-bottom: 1px solid #d8d8d8;
	}
	.drawer-tab {
		width: 26px;
		height: 26px;
		border: none;
		background: transparent;
		border-radius: 6px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		color: #6b6560;
	}
	.drawer-tab--active {
		background: rgba(59, 130, 246, 0.1);
	}
	.drawer-label {
		font-size: 11.5px;
		font-weight: 500;
		color: #4a4a4a;
		margin-left: 4px;
	}
	.drawer-spacer {
		flex: 1;
	}
	.drawer-close {
		width: 20px;
		height: 20px;
		border: none;
		background: transparent;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.ai-drawer-body {
		flex: 1;
		padding: 12px;
	}
	.ai-placeholder {
		font-size: 11.5px;
		color: #9c968e;
		margin: 0;
	}
	.ai-drawer-footer {
		padding: 10px;
		border-top: 1px solid #d8d8d8;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.ai-context-quote {
		background: #fef9e7;
		border: 1px solid rgba(252, 188, 5, 0.4);
		border-radius: 6px;
		padding: 7px 9px;
		font-size: 10.5px;
		color: #7a6500;
		line-height: 1.55;
	}
	.ai-context-label {
		font-weight: 600;
		display: block;
		margin-bottom: 2px;
	}
	.ai-context-text {
		font-style: italic;
	}
	.ai-input {
		background: #fff;
		border: 1px solid #d0d0d0;
		border-radius: 6px;
		padding: 6px 9px;
		font-size: 11px;
		color: #9c968e;
		font-family: 'Inter', sans-serif;
		width: 100%;
		outline: none;
	}
	.ai-send-btn {
		background: #3b82f6;
		color: white;
		border: none;
		border-radius: 6px;
		padding: 7px;
		font-size: 12px;
		font-weight: 500;
		cursor: pointer;
		font-family: 'Inter', sans-serif;
	}

	/* Document editor */
	.doc-editor {
		background: white;
		overflow: hidden;
	}
	.doc-prose {
		padding: 28px 36px;
		max-width: 680px;
		margin: 0 auto;
	}
	.prose-p {
		font-family: 'Georgia', serif;
		font-size: 13.5px;
		line-height: 1.85;
		color: #1e1c1a;
		margin: 0 0 18px 0;
		text-align: left;
	}
	.highlight-comment {
		background: rgba(251, 191, 36, 0.25);
		border-bottom: 2px solid #f59e0b;
	}
	.highlight-underline {
		border-bottom: 2px solid #6366f1;
	}
	.highlight-yellow {
		background: #fde68a;
	}

	/* Right sidebar */
	.right-sidebar {
		background: #f2f2f2;
		border-left: 1px solid #d0d0d0;
		display: flex;
		flex-direction: column;
		gap: 0;
		overflow-y: auto;
		padding: 8px;
		gap: 6px;
	}
	.sidebar-card {
		background: white;
		border: 1px solid #e4e4e4;
		border-radius: 8px;
		padding: 9px 10px;
		font-size: 11px;
	}
	.sidebar-card-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 6px;
	}
	.sidebar-card-label {
		font-size: 9px;
		font-weight: 700;
		letter-spacing: 0.08em;
		color: #a89e94;
	}
	.sidebar-card-delete {
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		display: flex;
	}
	.sidebar-anchor {
		font-size: 10.5px;
		font-weight: 500;
		color: #d97706;
		border-left: 2px solid #f59e0b;
		padding-left: 6px;
		margin-bottom: 7px;
		font-style: italic;
		line-height: 1.4;
	}
	.sidebar-comment-row {
		display: flex;
		gap: 6px;
		align-items: flex-start;
	}
	.comment-avatar {
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: #e8e3db;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 10px;
		font-weight: 700;
		color: #6b6560;
		flex-shrink: 0;
	}
	.comment-meta {
		display: flex;
		gap: 5px;
		align-items: baseline;
		margin-bottom: 2px;
	}
	.comment-author {
		font-size: 10.5px;
		font-weight: 600;
		color: #3a3a3a;
	}
	.comment-time {
		font-size: 9.5px;
		color: #a89e94;
	}
	.comment-body {
		font-size: 11px;
		color: #5a554f;
		margin: 0;
		line-height: 1.5;
	}
	.comment-reply-row {
		display: flex;
		gap: 5px;
		margin-top: 7px;
	}
	.comment-reply-input {
		flex: 1;
		background: #f7f5f2;
		border: 1px solid #e0dbd4;
		border-radius: 5px;
		padding: 4px 7px;
		font-size: 11px;
		font-family: 'Inter', sans-serif;
		color: #5a554f;
		outline: none;
	}
	.comment-reply-send {
		background: transparent;
		border: none;
		font-size: 11px;
		font-weight: 500;
		color: #3b82f6;
		cursor: pointer;
		font-family: 'Inter', sans-serif;
		padding: 0 2px;
	}
	.comment-suggest-btn {
		display: flex;
		align-items: center;
		gap: 4px;
		background: transparent;
		border: none;
		font-size: 10.5px;
		color: #a89e94;
		cursor: pointer;
		font-family: 'Inter', sans-serif;
		margin-top: 5px;
		padding: 0;
	}

	/* Revision card */
	.revision-pills {
		display: flex;
		flex-direction: column;
		gap: 4px;
		margin-bottom: 8px;
	}
	.revision-pill {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-radius: 5px;
		padding: 4px 8px;
		font-size: 10.5px;
		font-weight: 500;
	}
	.revision-pill--grey {
		background: #f0ede8;
		color: #6b6560;
		border: 1px solid #d6cfc5;
	}
	.revision-pill--purple {
		background: #a855f7;
		color: white;
	}
	.pill-x {
		background: transparent;
		border: none;
		cursor: pointer;
		font-size: 13px;
		line-height: 1;
		color: inherit;
		opacity: 0.7;
		padding: 0 0 0 4px;
	}
	.revision-actions {
		display: flex;
		gap: 6px;
	}
	.revision-btn-new,
	.revision-btn-nested {
		display: flex;
		align-items: center;
		gap: 3px;
		background: transparent;
		border: none;
		font-size: 10.5px;
		cursor: pointer;
		font-family: 'Inter', sans-serif;
		padding: 0;
	}
	.revision-btn-new {
		color: #3b82f6;
	}
	.revision-btn-nested {
		color: #6b6560;
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

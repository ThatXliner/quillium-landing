<svelte:head>
	<title>Quillium — Next Generation Prose</title>
	<meta
		name="description"
		content="The world's first non-linear editor for prose. Write in branches, get contextual AI assistance, and keep every version alive."
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Inter:wght@300;400;500;600&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		// Nav scroll effect
		const nav = document.getElementById('main-nav');
		let scrolled = false;
		window.addEventListener(
			'scroll',
			() => {
				const shouldBeScrolled = window.scrollY > 20;
				if (shouldBeScrolled !== scrolled) {
					scrolled = shouldBeScrolled;
					nav?.classList.toggle('scrolled', scrolled);
				}
			},
			{ passive: true }
		);

		// Scroll reveal with Intersection Observer
		const revealEls = document.querySelectorAll('.reveal');
		const revealObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('visible');
						revealObserver.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
		);
		revealEls.forEach((el) => revealObserver.observe(el));

		// Make elements already in viewport visible immediately
		document.querySelectorAll('.reveal').forEach((el) => {
			const rect = el.getBoundingClientRect();
			if (rect.top < window.innerHeight) el.classList.add('visible');
		});

		// Smooth scroll for anchor links
		document.querySelectorAll('a[href^="#"]').forEach((link) => {
			link.addEventListener('click', (e) => {
				const href = (link as HTMLAnchorElement).getAttribute('href');
				if (!href) return;
				const target = document.querySelector(href);
				if (target) {
					e.preventDefault();
					target.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}
			});
		});

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

	function handleWaitlistSubmit(e: Event) {
		e.preventDefault();
		const email = (document.getElementById('waitlist-email') as HTMLInputElement)?.value;
		const form = document.getElementById('waitlist-form');
		const success = document.getElementById('waitlist-success');
		if (email && email.includes('@') && form && success) {
			form.style.opacity = '0';
			form.style.transition = 'opacity 0.3s';
			setTimeout(() => {
				form.style.display = 'none';
				success.classList.remove('hidden');
				success.classList.add('visible');
			}, 300);
		}
	}
</script>

<!-- ==================== NAV ==================== -->
<nav id="main-nav" class="nav-fixed">
	<div class="nav-inner">
		<div class="logo-group">
			<svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
				<path
					d="M20.5 3C20.5 3 16 5.5 12 10.5C9 14.5 7.5 19 7.5 19L10 16.5C10 16.5 12 20 9 22C9 22 14 21.5 17 17.5C17 17.5 18.5 15.5 18 13C18 13 22 8.5 22.5 4.5L20.5 3Z"
					fill="#3b82f6"
					opacity="0.15"
				/>
				<path
					d="M21 3.5C21 3.5 16.5 6 12.5 11C9.5 15 8 19.5 8 19.5"
					stroke="#3b82f6"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M8 19.5L10.5 17"
					stroke="#3b82f6"
					stroke-width="1.5"
					stroke-linecap="round"
				/>
				<path
					d="M10.5 17C10.5 17 12.5 20.5 9.5 22.5"
					stroke="#2563eb"
					stroke-width="1.3"
					stroke-linecap="round"
				/>
				<path d="M8 19.5C8 19.5 6.5 20.5 5.5 22C5.5 22 7 21 8 19.5Z" fill="#3b82f6" opacity="0.4" />
			</svg>
			<span class="logo-name">Quillium</span>
			<span class="tagline-pill">Next Generation Prose</span>
		</div>
		<div class="nav-right">
			<a href="#features" class="nav-link">Features</a>
			<a href="#manifesto" class="nav-link">Manifesto</a>
			<a href="#waitlist" class="btn-primary">Join Waitlist</a>
		</div>
	</div>
</nav>

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

<div class="warm-divider section-divider"></div>

<!-- ==================== FEATURES ==================== -->
<section id="features" class="features-section">
	<div class="features-header reveal">
		<p class="section-eyebrow">What makes it different</p>
		<h2 class="section-heading">The tools your writing actually needs.</h2>
	</div>

	<!-- Feature 1: Branches -->
	<div class="reveal feature-row">
		<div class="feature-visual">
			<svg viewBox="0 0 360 220" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:220px;">
				<line x1="60" y1="30" x2="60" y2="190" stroke="#d6cfc5" stroke-width="2" stroke-linecap="round" />
				<circle cx="60" cy="30" r="6" fill="#3b82f6" opacity="0.9" />
				<circle cx="60" cy="80" r="4.5" fill="#3b82f6" opacity="0.6" />
				<circle cx="60" cy="130" r="4.5" fill="#3b82f6" opacity="0.4" />
				<circle cx="60" cy="180" r="4" fill="#c9c2b8" />
				<path d="M60 80 Q120 80 160 55" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.8" />
				<circle cx="160" cy="55" r="4" fill="#3b82f6" opacity="0.7" />
				<rect x="168" y="38" width="170" height="34" rx="6" fill="white" stroke="#e8e3db" stroke-width="1" />
				<text x="178" y="52" font-family="Lora, Georgia, serif" font-size="11" fill="#2c2a27" font-style="italic">rain began — gently at first,</text>
				<text x="178" y="66" font-family="Lora, Georgia, serif" font-size="11" fill="#2c2a27" font-style="italic">then all at once...</text>
				<rect x="168" y="38" width="170" height="34" rx="6" fill="rgba(59,130,246,0.04)" stroke="#3b82f6" stroke-width="1" opacity="0.5" />
				<rect x="168" y="26" width="42" height="14" rx="7" fill="#3b82f6" />
				<text x="178" y="37" font-family="Inter, sans-serif" font-size="9" font-weight="600" fill="white">ACTIVE</text>
				<path d="M60 130 Q120 130 160 160" stroke="#c9c2b8" stroke-width="1.5" stroke-linecap="round" fill="none" />
				<circle cx="160" cy="160" r="4" fill="#c9c2b8" />
				<rect x="168" y="143" width="170" height="34" rx="6" fill="white" stroke="#e8e3db" stroke-width="1" />
				<text x="178" y="157" font-family="Lora, Georgia, serif" font-size="11" fill="#9c968e" font-style="italic">city had swallowed the last</text>
				<text x="178" y="171" font-family="Lora, Georgia, serif" font-size="11" fill="#9c968e" font-style="italic">light of afternoon...</text>
				<rect x="168" y="130" width="56" height="14" rx="7" fill="#f0ede8" stroke="#d6cfc5" stroke-width="1" />
				<text x="178" y="141" font-family="Inter, sans-serif" font-size="9" font-weight="500" fill="#9c968e">ALTERNATE</text>
				<circle cx="60" cy="80" r="10" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.2)" stroke-width="1" />
				<text x="56.5" y="84" font-family="Inter, sans-serif" font-size="10" fill="#3b82f6" font-weight="600">⌥</text>
			</svg>
		</div>
		<div class="feature-text">
			<div class="feature-icon-wrap" style="background:rgba(59,130,246,0.08);">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
					<circle cx="5" cy="5" r="2.5" stroke="#3b82f6" stroke-width="1.5" />
					<circle cx="5" cy="19" r="2.5" stroke="#3b82f6" stroke-width="1.5" />
					<circle cx="19" cy="12" r="2.5" stroke="#3b82f6" stroke-width="1.5" />
					<path d="M5 7.5V16.5" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" />
					<path d="M5 10C5 10 5 12 8.5 12H16.5" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" />
				</svg>
			</div>
			<h3 class="feature-heading">Write in Branches</h3>
			<p class="feature-lead">Fork any sentence. Keep every version. Navigate your creative decisions like chapters, not mistakes.</p>
			<p class="feature-body">No more "draft 1," "draft 2," "draft FINAL." Your branches live in the document itself — visible, selectable, alive. Switch between them instantly. The one you didn't choose is still there when you need it.</p>
		</div>
	</div>

	<!-- Feature 2: A Second Voice -->
	<div class="reveal feature-row feature-row--reversed">
		<div class="feature-text">
			<div class="feature-icon-wrap" style="background:rgba(168,85,247,0.08);">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
					<path d="M12 3L13.8 8.1L19.2 8.1L14.7 11.4L16.2 16.5L12 13.4L7.8 16.5L9.3 11.4L4.8 8.1L10.2 8.1L12 3Z" stroke="#a855f7" stroke-width="1.5" stroke-linejoin="round" />
				</svg>
			</div>
			<h3 class="feature-heading">A Second Voice</h3>
			<p class="feature-lead">AI that annotates, not interrupts. Ask for feedback, find the right word, get clarity — all without leaving your flow.</p>
			<p class="feature-body">It isn't a chatbot in the corner. It responds to your text right where you are — flagging a passive construction, offering a sharper phrasing, or just confirming that the sentence you struggled over is, actually, right.</p>
			<div class="tag-list">
				<span class="tag tag--purple">Review &amp; revise</span>
				<span class="tag tag--purple">Find the right word</span>
				<span class="tag tag--purple">Tone feedback</span>
				<span class="tag tag--purple">Clarity &amp; conciseness</span>
			</div>
		</div>
		<div class="feature-visual">
			<div class="ai-card">
				<div class="ai-card-header">
					<div class="ai-card-icon">
						<svg width="14" height="14" viewBox="0 0 14 14" fill="none"
							><path
								d="M7 1.5L8.3 4.9L12 4.9L9.1 7L10.2 10.5L7 8.5L3.8 10.5L4.9 7L2 4.9L5.7 4.9L7 1.5Z"
								stroke="#a855f7"
								stroke-width="1.1"
								stroke-linejoin="round"
								fill="rgba(168,85,247,0.15)"
							/></svg
						>
					</div>
					<div>
						<div class="ai-card-name">Quillium AI</div>
						<div class="ai-card-type">Conciseness suggestion</div>
					</div>
				</div>
				<div class="ai-card-original">
					<div class="ai-card-label ai-card-label--muted">ORIGINAL</div>
					<p class="ai-card-text ai-card-text--struck">
						"She had been walking for three hours when the rain began to fall on her."
					</p>
				</div>
				<div class="ai-card-suggested">
					<div class="ai-card-label ai-card-label--purple">SUGGESTED</div>
					<p class="ai-card-text">"She walked for hours before the rain found her."</p>
				</div>
				<div class="ai-card-actions">
					<button class="btn-accept">Accept</button>
					<button class="btn-dismiss">Dismiss</button>
					<span class="btn-branch-instead">→ Branch instead</span>
				</div>
			</div>
		</div>
	</div>

	<!-- Feature 3: Annotations -->
	<div class="reveal feature-row">
		<div class="feature-visual">
			<div class="annotation-demo">
				<div class="annotation-prose">
					<p>
						The <span class="comment-highlight active">envelope</span> sat on the counter for three
						days before she—
					</p>
					<p>"I know what it says," she told him. <span class="suggestion-highlight">She didn't open it.</span></p>
				</div>
				<div class="annotation-comment">
					<div class="annotation-comment-header">
						<span class="annotation-avatar">M</span>
						Maya
					</div>
					<p>Is "envelope" doing enough work here? It feels—generic.</p>
				</div>
				<div class="annotation-suggestion">
					<div class="annotation-suggestion-header">
						<svg width="11" height="11" viewBox="0 0 11 11" fill="none"
							><circle cx="5.5" cy="5.5" r="4.5" stroke="#22c55e" stroke-width="1" /><path
								d="M3.5 5.5L5 7L7.5 4"
								stroke="#22c55e"
								stroke-width="1.2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/></svg
						>
						Strong ending
					</div>
					<p>This line lands well — the restraint is intentional.</p>
				</div>
			</div>
		</div>
		<div class="feature-text">
			<div class="feature-icon-wrap" style="background:rgba(252,188,5,0.1);">
				<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
					<path d="M4 5C4 4.45 4.45 4 5 4H19C19.55 4 20 4.45 20 5V15C20 15.55 19.55 16 19 16H14L10 20.5V16H5C4.45 16 4 15.55 4 15V5Z" stroke="#d97706" stroke-width="1.5" stroke-linejoin="round" />
					<line x1="8" y1="9" x2="16" y2="9" stroke="#d97706" stroke-width="1.3" stroke-linecap="round" />
					<line x1="8" y1="12" x2="14" y2="12" stroke="#d97706" stroke-width="1.3" stroke-linecap="round" />
				</svg>
			</div>
			<h3 class="feature-heading">Annotations That Belong</h3>
			<p class="feature-lead">Comments, revisions, and suggestions float beside the text they're about. Not buried in a sidebar. Not lost in a thread.</p>
			<p class="feature-body">Every note is anchored to the exact phrase it concerns — spatial and immediate. Scroll past it, and it moves with the text. Resolve it, and it disappears cleanly. The document stays the document.</p>
		</div>
	</div>
</section>

<div class="warm-divider section-divider"></div>

<!-- ==================== MANIFESTO ==================== -->
<section id="manifesto" class="manifesto-section">
	<div class="manifesto-inner">
		<div class="reveal manifesto-eyebrow">
			<p class="section-eyebrow section-eyebrow--centered">The Manifesto</p>
		</div>

		<div class="reveal manifesto-quote-1">
			<p class="pull-quote">
				"Writing tools have always assumed you know where you're going. They give you a blank page
				and expect a straight line from start to finish."
			</p>
		</div>

		<div class="reveal manifesto-body-1">
			<p class="manifesto-prose">
				But writing isn't a straight line — it's a web of attempts, a tangle of better and worse,
				a conversation between drafts.
			</p>
			<p class="manifesto-prose">
				We built this for the writers who know the first version is never the only version. For the
				novelist who writes the same chapter four different ways, hoping one of them is right. For
				the essayist who can't commit to a thesis until they've argued three of them. For the
				memoirist who rewrites sentences until 2am and still isn't sure they've gotten it.
			</p>
		</div>

		<div class="reveal manifesto-quote-2">
			<p class="pull-quote pull-quote--accent">
				"Quillium was built for the tangle. We built an editor that treats non-linearity as a
				feature, not a problem to manage."
			</p>
		</div>

		<div class="reveal manifesto-body-2">
			<p class="manifesto-prose">
				Where AI isn't a distraction but a second voice in the room — one that annotates rather
				than interrupts, that responds to your text rather than pulling you away from it.
			</p>
			<p class="manifesto-prose">
				We kept it warm because writing is personal. We kept it calm because flow is fragile. We
				kept it focused because the writing is the product — everything else is scaffolding.
			</p>
		</div>

		<div class="reveal manifesto-closing">
			<p class="pull-quote pull-quote--closing">
				"You have something to say. We built a tool worthy of the work."
			</p>
			<p class="manifesto-attribution">— From the Quillium Manifesto</p>
		</div>
	</div>
</section>

<div class="warm-divider"></div>

<!-- ==================== WHO IT'S FOR ==================== -->
<section id="for-writers" class="writers-section">
	<div class="writers-inner">
		<div class="reveal writers-header">
			<p class="section-eyebrow">Who it's for</p>
			<h2 class="section-heading">Built for serious writers.</h2>
			<p class="writers-subhead">Not project managers. Not "content creators." Writers who live inside their sentences.</p>
		</div>

		<div class="writers-list">
			<div class="reveal writer-card">
				<div class="writer-icon-wrap">
					<svg width="22" height="22" viewBox="0 0 22 22" fill="none">
						<path d="M11 5C11 5 8 4 4 4.5V17C8 16.5 11 17.5 11 17.5" stroke="#5a554f" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
						<path d="M11 5C11 5 14 4 18 4.5V17C14 16.5 11 17.5 11 17.5" stroke="#5a554f" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" />
						<line x1="11" y1="5" x2="11" y2="17.5" stroke="#5a554f" stroke-width="1.2" stroke-linecap="round" />
					</svg>
				</div>
				<div class="writer-content">
					<h3 class="writer-name">The Novelist</h3>
					<p class="writer-bio">You've written the same chapter four different ways. One in the morning, one at night. One with the character knowing, one without. Each version is different — not better or worse, just differently weighted. Quillium keeps them all. You decide which path the story takes — later, when you know more.</p>
				</div>
			</div>

			<div class="writer-divider"></div>

			<div class="reveal reveal-delay-1 writer-card">
				<div class="writer-icon-wrap">
					<svg width="22" height="22" viewBox="0 0 22 22" fill="none">
						<path d="M14 4L18 8L8 18L4 18L4 14L14 4Z" stroke="#5a554f" stroke-width="1.4" stroke-linejoin="round" />
						<line x1="11" y1="7" x2="15" y2="11" stroke="#5a554f" stroke-width="1.2" stroke-linecap="round" />
						<line x1="4" y1="21" x2="18" y2="21" stroke="#5a554f" stroke-width="1.3" stroke-linecap="round" />
					</svg>
				</div>
				<div class="writer-content">
					<h3 class="writer-name">The Essayist</h3>
					<p class="writer-bio">You can't commit to a thesis until you've argued three of them. The essay isn't the argument you planned — it's the argument you discovered. Quillium lets you pursue three theses at once, branch at the point of divergence, and see which argument earns its conclusion. No overwriting. No backtracking. Just three threads, alive at once.</p>
				</div>
			</div>

			<div class="writer-divider"></div>

			<div class="reveal reveal-delay-2 writer-card">
				<div class="writer-icon-wrap">
					<svg width="22" height="22" viewBox="0 0 22 22" fill="none">
						<circle cx="11" cy="11" r="7.5" stroke="#5a554f" stroke-width="1.4" />
						<path d="M11 7V11L13.5 13.5" stroke="#5a554f" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" />
						<line x1="8" y1="3" x2="14" y2="3" stroke="#5a554f" stroke-width="1.3" stroke-linecap="round" />
					</svg>
				</div>
				<div class="writer-content">
					<h3 class="writer-name">The Memoirist</h3>
					<p class="writer-bio">You rewrite sentences until 2am and still aren't sure you've gotten it. Memory is approximate, and the sentence has to hold the approximation without collapsing it. Quillium's AI doesn't correct you — it works alongside you, noting a verb that's too hard, a clause that's closing too soon. The words remain yours.</p>
				</div>
			</div>
		</div>
	</div>
</section>

<div class="warm-divider"></div>

<!-- ==================== WAITLIST CTA ==================== -->
<section id="waitlist" class="waitlist-section">
	<div class="waitlist-inner">
		<div class="reveal">
			<div class="waitlist-icon">
				<svg width="26" height="26" viewBox="0 0 26 26" fill="none">
					<path d="M21 3.5C21 3.5 16.5 6 12.5 11C9.5 15 8 19.5 8 19.5" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
					<path d="M8 19.5L10.5 17" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" />
					<path d="M10.5 17C10.5 17 12.5 20.5 9.5 22.5" stroke="#2563eb" stroke-width="1.3" stroke-linecap="round" />
				</svg>
			</div>
			<h2 class="waitlist-heading">Be among the first<br />writers in.</h2>
			<p class="waitlist-sub">Quillium is in private early access. Leave your email and we'll reach out when we're ready for you.</p>
		</div>

		<div class="reveal reveal-delay-1">
			<form id="waitlist-form" onsubmit={handleWaitlistSubmit} class="waitlist-form">
				<input
					type="email"
					id="waitlist-email"
					class="waitlist-input"
					placeholder="your@email.com"
					required
					aria-label="Email address"
				/>
				<button type="submit" class="btn-primary btn-large">Join Waitlist</button>
			</form>
			<p class="waitlist-privacy">No spam. No marketing cadences. Just a quiet note when the doors open.</p>
		</div>

		<div id="waitlist-success" class="hidden waitlist-success reveal">
			<p>You're on the list. We'll be in touch soon.</p>
		</div>
	</div>
</section>

<!-- ==================== FOOTER ==================== -->
<footer class="site-footer">
	<div class="footer-inner">
		<div class="footer-brand">
			<div class="footer-logo">
				<svg width="20" height="20" viewBox="0 0 26 26" fill="none">
					<path d="M21 3.5C21 3.5 16.5 6 12.5 11C9.5 15 8 19.5 8 19.5" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
					<path d="M8 19.5L10.5 17" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" />
					<path d="M10.5 17C10.5 17 12.5 20.5 9.5 22.5" stroke="#2563eb" stroke-width="1.3" stroke-linecap="round" />
				</svg>
				<span>Quillium</span>
			</div>
			<p class="footer-tagline">Next Generation Prose</p>
		</div>
		<div class="footer-links">
			<a href="#features" class="footer-link">Product</a>
			<a href="#manifesto" class="footer-link">Manifesto</a>
			<a href="#waitlist" class="footer-link">Early Access</a>
			<a href="mailto:hello@quillium.io" class="footer-link">Contact</a>
		</div>
		<p class="footer-copy">&copy; 2026 Quillium</p>
	</div>
</footer>

<style>
	/* ── Fonts ── */
	:global(body) {
		background-color: #faf9f7;
		color: #2c2a27;
		font-family: 'Inter', system-ui, sans-serif;
		-webkit-font-smoothing: antialiased;
	}
	:global(html) {
		scroll-behavior: smooth;
	}
	:global(*, *::before, *::after) {
		box-sizing: border-box;
	}

	/* ── Shared ── */
	.warm-divider {
		height: 1px;
		background: linear-gradient(to right, transparent, #d6cfc5, transparent);
	}
	.section-divider {
		max-width: 80rem;
		margin: 0 auto;
	}
	.section-eyebrow {
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #a89e94;
		margin: 0 0 12px 0;
	}
	.section-eyebrow--centered {
		text-align: center;
	}
	.section-heading {
		font-family: 'Lora', Georgia, serif;
		font-size: clamp(1.75rem, 4vw, 2.75rem);
		font-weight: 700;
		line-height: 1.15;
		color: #1e1c1a;
		margin: 0;
	}
	.status-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #22c55e;
		display: inline-block;
		flex-shrink: 0;
	}

	/* ── Scroll reveal ── */
	:global(.reveal) {
		opacity: 0;
		transform: translateY(24px);
		transition:
			opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
			transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
	}
	:global(.reveal.visible) {
		opacity: 1;
		transform: translateY(0);
	}
	:global(.reveal-delay-1) {
		transition-delay: 0.1s;
	}
	:global(.reveal-delay-2) {
		transition-delay: 0.2s;
	}
	:global(.reveal-delay-3) {
		transition-delay: 0.3s;
	}
	:global(.reveal-delay-4) {
		transition-delay: 0.45s;
	}

	/* ── Buttons ── */
	.btn-primary {
		background: #3b82f6;
		color: white;
		font-weight: 500;
		padding: 10px 22px;
		border-radius: 9999px;
		font-size: 14px;
		text-decoration: none;
		transition: all 0.2s;
		border: none;
		cursor: pointer;
		display: inline-block;
		white-space: nowrap;
		box-shadow: 0 1px 4px rgba(59, 130, 246, 0.2);
	}
	.btn-primary:hover {
		background: #2563eb;
		box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
	}
	.btn-large {
		padding: 14px 28px;
		font-size: 15px;
	}
	.btn-ghost {
		color: #3b82f6;
		font-weight: 500;
		font-size: 15px;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		transition: color 0.2s;
	}
	.btn-ghost:hover {
		color: #2563eb;
	}
	.btn-ghost:hover .arrow-icon {
		transform: translateX(4px);
	}
	.arrow-icon {
		transition: transform 0.2s;
	}
	.btn-accept {
		background: #a855f7;
		color: white;
		border: none;
		border-radius: 9999px;
		padding: 4px 12px;
		font-size: 11px;
		font-weight: 500;
		cursor: pointer;
		font-family: 'Inter', sans-serif;
		transition: background 0.15s;
	}
	.btn-accept:hover {
		background: #9333ea;
	}
	.btn-dismiss {
		background: transparent;
		color: #a89e94;
		border: 1px solid #d6cfc5;
		border-radius: 9999px;
		padding: 4px 10px;
		font-size: 11px;
		cursor: pointer;
		font-family: 'Inter', sans-serif;
		transition: all 0.15s;
	}
	.btn-dismiss:hover {
		border-color: #a89e94;
		color: #5a554f;
	}
	.btn-branch-instead {
		font-size: 11px;
		color: #a89e94;
		font-family: 'Inter', sans-serif;
		margin-left: auto;
		cursor: pointer;
	}

	/* ── Nav ── */
	.nav-fixed {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 50;
		padding: 16px 0;
		transition: all 0.3s;
	}
	:global(#main-nav.scrolled) {
		background: rgba(250, 249, 247, 0.82);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border-bottom: 1px solid rgba(220, 210, 195, 0.4);
		box-shadow: 0 1px 20px rgba(44, 42, 39, 0.06);
	}
	.nav-inner {
		max-width: 72rem;
		margin: 0 auto;
		padding: 0 24px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.logo-group {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.logo-name {
		font-family: 'Lora', Georgia, serif;
		font-weight: 600;
		font-size: 19px;
		color: #2c2a27;
		letter-spacing: -0.01em;
	}
	.tagline-pill {
		background: rgba(59, 130, 246, 0.08);
		border: 1px solid rgba(59, 130, 246, 0.2);
		color: #2563eb;
		border-radius: 9999px;
		padding: 3px 12px;
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.025em;
		display: none;
	}
	@media (min-width: 640px) {
		.tagline-pill {
			display: inline-block;
		}
	}
	.nav-right {
		display: flex;
		align-items: center;
		gap: 24px;
	}
	.nav-link {
		color: #5a554f;
		font-size: 14px;
		font-weight: 500;
		text-decoration: none;
		transition: color 0.2s;
		display: none;
	}
	.nav-link:hover {
		color: #2c2a27;
	}
	@media (min-width: 768px) {
		.nav-link {
			display: inline;
		}
	}

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
		0%, 100% { transform: translateY(0px); }
		50% { transform: translateY(-6px); }
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
		0%, 100% { opacity: 1; }
		50% { opacity: 0; }
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
	.comment-bubble > div {
		display: flex;
		gap: 6px;
		margin-bottom: 5px;
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

	/* ── Features ── */
	.features-section {
		padding: 80px 24px;
		max-width: 72rem;
		margin: 0 auto;
	}
	@media (min-width: 768px) {
		.features-section {
			padding: 112px 24px;
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
			grid-template-columns: 1fr 1fr;
			gap: 80px;
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
		font-family: 'Lora', Georgia, serif;
		font-size: 1.65rem;
		font-weight: 700;
		color: #1e1c1a;
		margin: 0 0 12px 0;
		line-height: 1.2;
	}
	.feature-lead {
		font-size: 15.5px;
		color: #5a554f;
		line-height: 1.8;
		margin: 0 0 16px 0;
	}
	.feature-body {
		font-size: 14px;
		color: #7c756d;
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

	/* AI card in features */
	.ai-card {
		background: rgba(253, 250, 255, 0.95);
		border: 1px solid rgba(168, 85, 247, 0.2);
		border-radius: 12px;
		padding: 18px;
		box-shadow: 0 8px 32px rgba(168, 85, 247, 0.1);
		max-width: 340px;
	}
	.ai-card-header {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 12px;
	}
	.ai-card-icon {
		width: 28px;
		height: 28px;
		border-radius: 8px;
		background: rgba(168, 85, 247, 0.1);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	.ai-card-name {
		font-size: 12px;
		font-weight: 600;
		color: #7c3aed;
		font-family: 'Inter', sans-serif;
	}
	.ai-card-type {
		font-size: 11px;
		color: #a89e94;
		font-family: 'Inter', sans-serif;
	}
	.ai-card-original {
		background: #faf9f7;
		border-radius: 8px;
		padding: 12px;
		margin-bottom: 12px;
	}
	.ai-card-suggested {
		background: rgba(168, 85, 247, 0.05);
		border: 1px solid rgba(168, 85, 247, 0.15);
		border-radius: 8px;
		padding: 12px;
		margin-bottom: 14px;
	}
	.ai-card-label {
		font-size: 11px;
		font-weight: 500;
		font-family: 'Inter', sans-serif;
		margin-bottom: 6px;
	}
	.ai-card-label--muted {
		color: #a89e94;
	}
	.ai-card-label--purple {
		color: #7c3aed;
	}
	.ai-card-text {
		font-size: 13px;
		color: #2c2a27;
		line-height: 1.7;
		font-family: 'Lora', Georgia, serif;
		font-style: italic;
		margin: 0;
	}
	.ai-card-text--struck {
		color: #5a554f;
		text-decoration: line-through;
		text-decoration-color: #c9c2b8;
	}
	.ai-card-actions {
		display: flex;
		gap: 8px;
		align-items: center;
	}

	/* Annotation demo */
	.annotation-demo {
		position: relative;
		padding: 20px 0;
	}
	.annotation-prose {
		font-family: 'Lora', Georgia, serif;
		font-size: 14px;
		line-height: 1.85;
		color: #2c2a27;
	}
	.annotation-prose p {
		margin: 0 0 8px 0;
	}
	.annotation-comment {
		position: absolute;
		top: -8px;
		right: -16px;
		width: 158px;
		background: #fffbeb;
		border: 1px solid rgba(252, 188, 5, 0.3);
		border-radius: 8px;
		padding: 9px 11px;
		box-shadow: 0 2px 8px rgba(44, 42, 39, 0.07);
	}
	.annotation-comment-header {
		font-size: 11px;
		font-weight: 600;
		color: #92660a;
		font-family: 'Inter', sans-serif;
		margin-bottom: 4px;
		display: flex;
		align-items: center;
		gap: 5px;
	}
	.annotation-avatar {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: #fde89b;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 8px;
		font-weight: 700;
		color: #92660a;
	}
	.annotation-comment p {
		font-size: 11.5px;
		color: #5a554f;
		line-height: 1.55;
		margin: 0;
		font-family: 'Inter', sans-serif;
	}
	.annotation-suggestion {
		position: absolute;
		bottom: -4px;
		right: -16px;
		width: 158px;
		background: #f0fdf4;
		border: 1px solid rgba(34, 197, 94, 0.25);
		border-radius: 8px;
		padding: 9px 11px;
		box-shadow: 0 2px 8px rgba(44, 42, 39, 0.07);
	}
	.annotation-suggestion-header {
		font-size: 11px;
		font-weight: 600;
		color: #15803d;
		font-family: 'Inter', sans-serif;
		margin-bottom: 4px;
		display: flex;
		align-items: center;
		gap: 4px;
	}
	.annotation-suggestion p {
		font-size: 11.5px;
		color: #166534;
		line-height: 1.55;
		margin: 0;
		font-family: 'Inter', sans-serif;
	}

	/* ── Manifesto ── */
	.manifesto-section {
		background: #f0ede8;
		background-image:
			radial-gradient(circle at 20% 80%, rgba(252, 188, 5, 0.04) 0%, transparent 50%),
			radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.04) 0%, transparent 50%);
		padding: 96px 24px;
	}
	@media (min-width: 768px) {
		.manifesto-section {
			padding: 144px 24px;
		}
	}
	.manifesto-inner {
		max-width: 56rem;
		margin: 0 auto;
	}
	.manifesto-eyebrow {
		margin-bottom: 48px;
	}
	.pull-quote {
		font-family: 'Lora', Georgia, serif;
		font-style: italic;
		line-height: 1.75;
		color: #3d3830;
		margin: 0;
		font-size: clamp(1.25rem, 3.5vw, 1.9rem);
	}
	.pull-quote--accent {
		border-left: 3px solid #fcbc05;
		padding-left: 2rem;
		font-size: clamp(1.15rem, 3vw, 1.65rem);
		color: #2c2a27;
	}
	.pull-quote--closing {
		text-align: center;
		font-size: clamp(1.1rem, 2.5vw, 1.45rem);
		color: #3d3830;
	}
	.manifesto-quote-1 {
		margin-bottom: 64px;
		padding-left: 0;
	}
	@media (min-width: 768px) {
		.manifesto-quote-1 {
			padding-left: 48px;
		}
	}
	.manifesto-body-1 {
		margin-bottom: 64px;
	}
	.manifesto-quote-2 {
		margin-bottom: 64px;
	}
	.manifesto-body-2 {
		margin-bottom: 64px;
		display: grid;
		grid-template-columns: 1fr;
		gap: 40px;
	}
	@media (min-width: 768px) {
		.manifesto-body-2 {
			grid-template-columns: 1fr 1fr;
		}
	}
	.manifesto-prose {
		font-family: 'Lora', Georgia, serif;
		font-size: 17px;
		line-height: 1.9;
		color: #4d4742;
		margin: 0 0 1.2em 0;
	}
	.manifesto-prose:last-child {
		margin-bottom: 0;
	}
	.manifesto-closing {
		text-align: center;
	}
	.manifesto-attribution {
		font-size: 13px;
		color: #a89e94;
		font-family: 'Inter', sans-serif;
		letter-spacing: 0.04em;
		margin-top: 20px;
	}

	/* ── Writers ── */
	.writers-section {
		background: #faf9f7;
		padding: 80px 24px;
	}
	@media (min-width: 768px) {
		.writers-section {
			padding: 112px 24px;
		}
	}
	.writers-inner {
		max-width: 64rem;
		margin: 0 auto;
	}
	.writers-header {
		margin-bottom: 64px;
		max-width: 32rem;
	}
	.writers-subhead {
		margin-top: 16px;
		font-size: 15.5px;
		color: #5a554f;
		line-height: 1.75;
	}
	.writers-list {
		display: flex;
		flex-direction: column;
	}
	.writer-card {
		display: flex;
		align-items: flex-start;
		gap: 32px;
		padding: 32px 0 32px 24px;
		border-left: 2px solid transparent;
		transition:
			border-color 0.3s,
			background 0.3s;
		border-radius: 0 8px 8px 0;
		max-width: 48rem;
	}
	.writer-card:hover {
		border-left-color: #3b82f6;
		background: rgba(59, 130, 246, 0.03);
	}
	.writer-icon-wrap {
		width: 44px;
		height: 44px;
		border-radius: 10px;
		background: #f7f5f2;
		border: 1px solid #e8e3db;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}
	.writer-name {
		font-family: 'Lora', Georgia, serif;
		font-size: 1.35rem;
		font-weight: 600;
		color: #1e1c1a;
		margin: 0 0 8px 0;
	}
	.writer-bio {
		font-size: 15px;
		color: #5a554f;
		line-height: 1.8;
		margin: 0;
		font-family: 'Inter', sans-serif;
	}
	.writer-divider {
		height: 1px;
		background: #f0ede8;
		max-width: 33rem;
		margin-left: 68px;
	}

	/* ── Waitlist ── */
	.waitlist-section {
		background: #f7f4ef;
		background-image: radial-gradient(circle at 50% 0%, rgba(252, 188, 5, 0.07) 0%, transparent 60%);
		padding: 96px 24px;
	}
	@media (min-width: 768px) {
		.waitlist-section {
			padding: 128px 24px;
		}
	}
	.waitlist-inner {
		max-width: 36rem;
		margin: 0 auto;
		text-align: center;
	}
	.waitlist-icon {
		width: 52px;
		height: 52px;
		border-radius: 14px;
		background: rgba(59, 130, 246, 0.08);
		border: 1px solid rgba(59, 130, 246, 0.18);
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto 24px auto;
	}
	.waitlist-heading {
		font-family: 'Lora', Georgia, serif;
		font-size: clamp(1.9rem, 5vw, 3rem);
		font-weight: 700;
		line-height: 1.2;
		color: #1e1c1a;
		margin: 0 0 16px 0;
	}
	.waitlist-sub {
		font-size: 16px;
		color: #5a554f;
		line-height: 1.75;
		margin: 0 0 32px 0;
		max-width: 28rem;
		margin-left: auto;
		margin-right: auto;
	}
	.waitlist-form {
		display: flex;
		flex-direction: column;
		gap: 12px;
		margin-bottom: 16px;
	}
	@media (min-width: 640px) {
		.waitlist-form {
			flex-direction: row;
		}
	}
	.waitlist-input {
		background: #fefefe;
		border: 1px solid #d6cfc5;
		border-radius: 9999px;
		padding: 12px 20px;
		font-family: 'Inter', sans-serif;
		font-size: 15px;
		color: #2c2a27;
		outline: none;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
		flex: 1;
	}
	.waitlist-input:focus {
		border-color: #3b82f6;
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12);
	}
	.waitlist-input::placeholder {
		color: #a89e94;
	}
	.waitlist-privacy {
		font-size: 12.5px;
		color: #a89e94;
		font-family: 'Inter', sans-serif;
		margin: 0;
	}
	.waitlist-success {
		background: rgba(34, 197, 94, 0.08);
		border: 1px solid rgba(34, 197, 94, 0.25);
		border-radius: 12px;
		padding: 18px 24px;
		margin-top: 16px;
	}
	.waitlist-success p {
		font-family: 'Lora', Georgia, serif;
		font-style: italic;
		font-size: 16px;
		color: #15803d;
		margin: 0;
	}
	:global(.hidden) {
		display: none;
	}

	/* ── Footer ── */
	.site-footer {
		background: #f7f5f2;
		border-top: 1px solid #e8e3db;
		padding: 48px 24px;
	}
	.footer-inner {
		max-width: 72rem;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 32px;
	}
	@media (min-width: 768px) {
		.footer-inner {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}
	}
	.footer-logo {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 8px;
	}
	.footer-logo span {
		font-family: 'Lora', Georgia, serif;
		font-weight: 600;
		font-size: 16px;
		color: #2c2a27;
	}
	.footer-tagline {
		font-size: 13px;
		color: #a89e94;
		font-family: 'Inter', sans-serif;
		margin: 0;
	}
	.footer-links {
		display: flex;
		flex-wrap: wrap;
		gap: 32px 24px;
	}
	.footer-link {
		font-size: 13.5px;
		color: #6b6560;
		font-family: 'Inter', sans-serif;
		text-decoration: none;
		transition: color 0.2s;
	}
	.footer-link:hover {
		color: #2c2a27;
	}
	.footer-copy {
		font-size: 12px;
		color: #c9c2b8;
		font-family: 'Inter', sans-serif;
		margin: 0;
	}

	/* Flex utility */
	.flex-1 {
		flex: 1;
	}
</style>

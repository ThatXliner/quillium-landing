<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import {
		GitBranch,
		MessageSquare,
		BookOpen,
		Download,
		CircleCheck,
		Users,
		Library
	} from '@lucide/svelte';
	import revisionsImg from '$lib/assets/screenshots/revisions.png';
	import annotationsImg from '$lib/assets/screenshots/03b-annotations-no-ai.png';
	import suggestionActiveImg from '$lib/assets/screenshots/24-suggestion-active.png';
	import libraryImg from '$lib/assets/screenshots/06-library.png';
	import versionHistoryImg from '$lib/assets/screenshots/21-version-history.png';
	import dictionaryImg from '$lib/assets/screenshots/10-dictionary.png';
	import statsImg from '$lib/assets/screenshots/15-stats.png';
	import exportImg from '$lib/assets/screenshots/28-export-menu.png';
	import errorBannerImg from '$lib/assets/screenshots/30-error-banner.png';
	import settingsImg from '$lib/assets/screenshots/14-settings.png';
	import harperLogo from '$lib/assets/harper.svg';

	let grammarAnim = $state<HTMLElement | null>(null);
	let offlineAnim = $state<HTMLElement | null>(null);
	let collabAnim = $state<HTMLElement | null>(null);
	let keyboardAnim = $state<HTMLElement | null>(null);

	onMount(() => {
		if (grammarAnim) setupAnimation(grammarAnim, animateGrammar);
		if (offlineAnim) setupAnimation(offlineAnim, animateOffline);
		if (collabAnim) setupAnimation(collabAnim, animateCollab);
		if (keyboardAnim) setupAnimation(keyboardAnim, animateKeyboard);
	});

	function setupAnimation(ref: HTMLElement, fn: (el: HTMLElement) => void) {
		let started = false;
		const obs = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !started) {
					started = true;
					fn(ref);
					obs.disconnect();
				}
			},
			{ threshold: 0.4 }
		);
		obs.observe(ref);
	}

	function animateGrammar(el: HTMLElement) {
		const logo = el.querySelector('#harper-logo-card');
		const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
		tl.fromTo(logo, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.5 })
			.to(logo, { y: -3, duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
	}

	function animateOffline(el: HTMLElement) {
		const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
		tl.fromTo(el.querySelector('#db-body'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 })
			.fromTo(el.querySelector('#db-check'), { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.3 }, '-=0.1')
			.fromTo(el.querySelector('#pulse-ring'), { opacity: 0, scale: 0.5 }, { opacity: 0.25, scale: 1.8, duration: 0.8 })
			.to(el.querySelector('#pulse-ring'), { opacity: 0, scale: 2.2, duration: 0.6 })
			.fromTo(el.querySelector('#wifi-off'), { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.3 }, '-=0.4')
			.to(el.querySelector('#pulse-ring'), { scale: 2.5, opacity: 0, duration: 1.2, repeat: -1, ease: 'sine.out' });
	}

	function animateCollab(el: HTMLElement) {
		const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
		tl.fromTo(el.querySelector('#collab-bg'), { opacity: 0 }, { opacity: 1, duration: 0.3 })
			.fromTo(el.querySelector('#cursor-a'), { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3 })
			.fromTo(el.querySelector('#cursor-a-ring'), { scale: 0 }, { scale: 1, duration: 0.2 }, '-=0.2')
			.to(el.querySelector('#cursor-a'), { x: 70, duration: 1.2, ease: 'power1.inOut' })
			.to(el.querySelector('#hl-a'), { scaleX: 1, duration: 0.3, transformOrigin: 'left center' }, '-=0.8')
			.fromTo(el.querySelector('#cursor-b'), { x: 80, opacity: 0 }, { x: 40, opacity: 1, duration: 0.3 })
			.fromTo(el.querySelector('#cursor-b-ring'), { scale: 0 }, { scale: 1, duration: 0.2 }, '-=0.2')
			.to(el.querySelector('#cursor-b'), { x: 0, duration: 1.0, ease: 'power1.inOut' })
			.to(el.querySelector('#hl-b'), { scaleX: 1, duration: 0.3, transformOrigin: 'right center' }, '-=0.6')
			.to(el.querySelector('#cursor-a'), { opacity: 0.5, duration: 0.2 })
			.to(el.querySelector('#cursor-b'), { opacity: 0.5, duration: 0.2 }, '-=0.1');
	}

	function animateKeyboard(el: HTMLElement) {
		const keys = el.querySelectorAll('.anim-key');
		const tl = gsap.timeline({ defaults: { ease: 'back.out(2)', duration: 0.35 } });
		tl.fromTo(keys, { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.08 })
			.to(keys[0], { fill: 'rgba(168,85,247,0.2)', duration: 0.2 })
			.to(keys[0], { fill: 'rgba(0,0,0,0.04)', duration: 0.3 }, '+=0.15')
			.to(keys[1], { fill: 'rgba(59,130,246,0.2)', duration: 0.2 }, '-=0.15')
			.to(keys[1], { fill: 'rgba(0,0,0,0.04)', duration: 0.3 }, '+=0.15')
			.to(keys[2], { fill: 'rgba(252,188,5,0.25)', duration: 0.2 }, '-=0.15')
			.to(keys[2], { fill: 'rgba(0,0,0,0.04)', duration: 0.3 }, '+=0.15')
			.to(keys[3], { fill: 'rgba(34,197,94,0.2)', duration: 0.2 }, '-=0.15')
			.to(keys[3], { fill: 'rgba(0,0,0,0.04)', duration: 0.3 }, '+=0.15')
			.to(keys[4], { fill: 'rgba(168,85,247,0.2)', duration: 0.2 }, '-=0.15')
			.to(keys[4], { fill: 'rgba(0,0,0,0.04)', duration: 0.3 }, '+=0.4')
			.to(keys, { y: 0, opacity: 1, duration: 0.2 });
	}
</script>

<svelte:head>
	<title>Features – Quillium</title>
	<meta
		name="description"
		content="Every feature in Quillium, explained. Non-linear editing, document management, writing tools, offline-first durability, and more."
	/>
	<link rel="canonical" href="https://quillium.bryanhu.com/features" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://quillium.bryanhu.com/features" />
	<meta property="og:title" content="Features – Quillium" />
	<meta
		property="og:description"
		content="Every feature in Quillium, explained. Non-linear editing, document management, writing tools, offline-first durability, and more."
	/>
	<meta property="og:site_name" content="Quillium" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Features – Quillium" />
	<meta
		name="twitter:description"
		content="Every feature in Quillium, explained. Non-linear editing, document management, writing tools, offline-first durability, and more."
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Newsreader:ital,wght@0,400;0,500;1,400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<Nav />

<main class="min-h-screen px-6 pt-32 pb-24">
	<div class="mx-auto max-w-3xl">
		<!-- Header -->
		<header class="mb-20">
			<p class="mb-4 text-[0.7rem] font-semibold tracking-[0.1em] text-black/30 uppercase">Features</p>
			<h1
				class="mb-5 font-[Newsreader,Georgia,serif] text-[clamp(2.2rem,5.5vw,3.25rem)] leading-[1.08] font-normal tracking-[-0.02em] text-black/90"
			>
				A writing app that works the way <span class="italic">writing</span> works.
			</h1>
			<p class="max-w-2xl text-[0.95rem] leading-relaxed text-black/45">
				The full list of features, because we don't gatekeep what we have.
			</p>
		</header>

		<!-- ── 1. Non-Linear Writing ── -->
		<section class="mb-24">
			<div class="mb-2 flex items-center gap-3">
				<span class="feature-section-marker" style="background:rgba(168,85,247,0.12);color:#a855f7;">
					<GitBranch size={14} strokeWidth={2} />
				</span>
				<h2 class="feature-section-title">Non-Linear Writing</h2>
			</div>
			<p class="mb-12 text-[0.85rem] leading-relaxed text-black/40">
				The core idea: you should not have to delete a sentence to try a different one. Keep every version alive, side by side, and navigate between them freely.
			</p>

			<!-- Revisions -->
			<div class="feature-card">
				<div class="feature-card-body">
					<h3 class="feature-card-heading">Revisions</h3>
					<p class="feature-card-why">
						Why: Every writer knows the feeling — you cut a paragraph, then realize you needed it. Or you spend hours reconstructing a draft you should have saved. Revisions let you keep every version of a passage, not as a separate file, but right there in your document.
					</p>
					<p class="feature-card-desc">
						Select any text and press <kbd>Cmd+Alt+K</kbd> to create a revision. Each revision can hold multiple named versions — flip between them with <kbd>Ctrl+[</kbd> and <kbd>Ctrl+]</kbd>. Revisions nest infinitely: open a revision, revise inside it, create another revision within that. Unlike git branches, this works on sentences and paragraphs, not whole files.
					</p>
					<div class="feature-card-tags">
						<span class="tag tag--purple">Infinite nesting</span>
						<span class="tag tag--purple">Inline editor</span>
						<span class="tag tag--purple">Full-screen modal</span>
						<span class="tag tag--purple">Undo-aware</span>
					</div>
				</div>
				<img
					src={revisionsImg}
					alt="Revision branches UI showing multiple versions of a passage"
					class="feature-screenshot"
					loading="lazy"
				/>
			</div>

			<!-- Comments -->
			<div class="feature-card">
				<div class="feature-card-body">
					<h3 class="feature-card-heading">Comments &amp; Threads</h3>
					<p class="feature-card-why">
						Why: Margin notes are how writers think on the page. But in a digital editor, comments usually get shoved into a sidebar disconnected from the text. Quillium anchors each comment beside the text it references, so context is never lost.
					</p>
					<p class="feature-card-desc">
						Select text and press <kbd>Cmd+Alt+M</kbd> to start a threaded discussion. Every comment highlights its referenced text in the editor. Active comments get brighter highlighting. Threads support multiple messages, inline editing, and can be expanded to a full-screen modal for focused review.
					</p>
					<div class="feature-card-tags">
						<span class="tag tag--purple">Threaded discussions</span>
						<span class="tag tag--purple">Anchored to text</span>
						<span class="tag tag--purple">Inline editing</span>
					</div>
				</div>
				<img
					src={annotationsImg}
					alt="Comment threads anchored beside highlighted text in the editor"
					class="feature-screenshot"
					loading="lazy"
				/>
			</div>

			<!-- Suggestions -->
			<div class="feature-card">
				<div class="feature-card-body">
					<h3 class="feature-card-heading">Suggestions</h3>
					<p class="feature-card-why">
						Why: A suggested edit should show you what changed and why — not just a block of replacement text. Suggestions in Quillium are structured annotations with diff preview, multiple alternatives, and rationale.
					</p>
					<p class="feature-card-desc">
						Each suggestion can offer multiple alternative replacements with inline diff preview so you can see exactly what would change. Color-coded persona dots mark who made each suggestion, letting you weigh multiple perspectives at a glance.
					</p>
					<div class="feature-card-tags">
						<span class="tag tag--purple">Diff preview</span>
						<span class="tag tag--purple">Multiple alternatives</span>
						<span class="tag tag--purple">Persona markers</span>
					</div>
				</div>
				<img
					src={suggestionActiveImg}
					alt="Suggestion annotation with diff preview showing proposed changes"
					class="feature-screenshot"
					loading="lazy"
				/>
			</div>
		</section>

		<!-- ── 2. Document Lifecycle ── -->
		<section class="mb-24">
			<div class="mb-2 flex items-center gap-3">
				<span class="feature-section-marker" style="background:rgba(59,130,246,0.1);color:#3b82f6;">
					<Library size={14} strokeWidth={2} />
				</span>
				<h2 class="feature-section-title">Document Lifecycle</h2>
			</div>
			<p class="mb-12 text-[0.85rem] leading-relaxed text-black/40">
				Writing produces multiple documents, not just one. Quillium treats document management as a first-class concern.
			</p>

			<!-- Library -->
			<div class="feature-card">
				<div class="feature-card-body">
					<h3 class="feature-card-heading">Library</h3>
					<p class="feature-card-why">
						Why: A real writing app should let you see all your work at once — not force you through a file picker. The Library is your home base.
					</p>
					<p class="feature-card-desc">
						Full-screen document gallery with grid and list views. Search by title or preview text. Multi-select with Shift and Cmd/Ctrl modifiers. Quick-create new documents with <kbd>N</kbd>, rename with <kbd>R</kbd>, trash with <kbd>Cmd+Backspace</kbd>. Arrow keys navigate, <kbd>/</kbd> jumps to search. A "Continue Writing" pill returns you to your last open document.
					</p>
					<div class="feature-card-tags">
						<span class="tag tag--blue">Search &amp; filter</span>
						<span class="tag tag--blue">Grid / list views</span>
						<span class="tag tag--blue">Keyboard-first</span>
						<span class="tag tag--blue">Quick return</span>
					</div>
				</div>
				<img
					src={libraryImg}
					alt="Document library with grid view showing document cards and preview panel"
					class="feature-screenshot"
					loading="lazy"
				/>
			</div>

			<!-- Version History -->
			<div class="feature-card">
				<div class="feature-card-body">
					<h3 class="feature-card-heading">Version History</h3>
					<p class="feature-card-why">
						Why: Auto-save is table stakes. But when you realize you deleted something important three hours ago, you need more than "it is saved somewhere." Version history gives you a browsable timeline of every state your document has been in.
					</p>
					<p class="feature-card-desc">
						Automatic snapshots every 50 edits or 2 minutes. Manual checkpoints let you label a moment in time ("Submission draft", "After feedback"). Browse history grouped by Today, Yesterday, This Month. Preview any snapshot in a read-only editor, restore with one click, or manage retention (30 to 365 days, or never auto-delete). Storage usage is visible and manageable.
					</p>
					<div class="feature-card-tags">
						<span class="tag tag--blue">Auto-snapshots</span>
						<span class="tag tag--blue">Named checkpoints</span>
						<span class="tag tag--blue">Timeline browsing</span>
						<span class="tag tag--blue">Configurable retention</span>
					</div>
				</div>
				<img
					src={versionHistoryImg}
					alt="Version history timeline with snapshot preview"
					class="feature-screenshot"
					loading="lazy"
				/>
			</div>
		</section>

		<!-- ── 3. Writing Tools ── -->
		<section class="mb-24">
			<div class="mb-2 flex items-center gap-3">
				<span class="feature-section-marker" style="background:rgba(252,188,5,0.12);color:#d97706;">
					<BookOpen size={14} strokeWidth={2} />
				</span>
				<h2 class="feature-section-title">Writing Tools</h2>
			</div>
			<p class="mb-12 text-[0.85rem] leading-relaxed text-black/40">
				The tools a writer reaches for — dictionary, grammar check, statistics, export — built directly into the editor so you never have to switch contexts.
			</p>

			<!-- Dictionary -->
			<div class="feature-card">
				<div class="feature-card-body">
					<h3 class="feature-card-heading">Dictionary &amp; Thesaurus</h3>
					<p class="feature-card-why">
						Why: Finding the right word means looking it up. A dictionary popover that opens on your selection is faster than any website or drawer-opening.
					</p>
					<p class="feature-card-desc">
						Select a word and press <kbd>Cmd+D</kbd>. A floating popover appears near your selection with definitions, without leaving the editor.
					</p>
					<div class="feature-card-tags">
						<span class="tag tag--amber">Instant lookup</span>
						<span class="tag tag--amber">Cmd+D</span>
					</div>
				</div>
				<img
					src={dictionaryImg}
					alt="Dictionary popover showing word definition in the editor"
					class="feature-screenshot"
					loading="lazy"
				/>
			</div>

			<!-- Grammar -->
			<div class="feature-card">
				<div class="feature-card-body">
					<h3 class="feature-card-heading">Grammar &amp; Spell Check</h3>
					<p class="feature-card-why">
						Why: Grammar checking should not require an internet connection or sending your text to a server. Harper runs entirely offline, on your machine.
					</p>
					<p class="feature-card-desc">
						Powered by <a href="https://github.com/elijah-potter/harper" class="external-link">Harper</a>, an open-source grammar checker. Red squiggles for spelling, blue squiggles for grammar. Click any underlined word to see suggestions and apply fixes. Supports American, British, Australian, and Canadian English dialects. Add custom words to your personal dictionary.
					</p>
					<div class="feature-card-tags">
						<span class="tag tag--amber">Offline &amp; private</span>
						<span class="tag tag--amber">Spelling + grammar</span>
						<span class="tag tag--amber">Dialect support</span>
						<span class="tag tag--amber">Personal dictionary</span>
					</div>
				</div>
				<div class="anim-col" bind:this={grammarAnim}>
					<img src={harperLogo} alt="Harper" id="harper-logo-card" class="h-24 w-auto opacity-0" />
				</div>
			</div>

			<!-- Statistics -->
			<div class="feature-card">
				<div class="feature-card-body">
					<h3 class="feature-card-heading">Writing Statistics</h3>
					<p class="feature-card-why">
						Why: Word count alone tells you very little. Readability, sentence length, vocabulary diversity — these numbers help you see patterns in your writing that your eyes miss.
					</p>
					<p class="feature-card-desc">
						Word count, character count, sentence and paragraph counts, reading time (at 238 WPM), average sentence length, average word length, vocabulary diversity percentage, and Flesch-Kincaid readability grade level. The status bar shows a live word count overlay; click to cycle display mode.
					</p>
					<div class="feature-card-tags">
						<span class="tag tag--amber">Flesch-Kincaid grade</span>
						<span class="tag tag--amber">Vocabulary diversity</span>
						<span class="tag tag--amber">Live word count</span>
					</div>
				</div>
				<img
					src={statsImg}
					alt="Writing statistics modal showing readability score and word counts"
					class="feature-screenshot"
					loading="lazy"
				/>
			</div>

			<!-- Export -->
			<div class="feature-card">
				<div class="feature-card-body">
					<h3 class="feature-card-heading">Export</h3>
					<p class="feature-card-why">
						Why: Your writing should never be trapped in a file format. Export to any format you need, including annotated formats that preserve your revisions and comments.
					</p>
					<p class="feature-card-desc">
						Export as Plain Text, Text + Annotations, JSON, Markdown (with annotations as footnotes), PDF, or PDF + Annotations. Quick export with <kbd>Cmd+Shift+E</kbd> saves as plain text. Annotations in PDF exports are rendered as styled cards, including nested revision versions.
					</p>
					<div class="feature-card-tags">
						<span class="tag tag--amber">TXT &middot; JSON &middot; MD &middot; PDF</span>
						<span class="tag tag--amber">Annotation-aware</span>
						<span class="tag tag--amber">Quick export</span>
					</div>
				</div>
				<img
					src={exportImg}
					alt="Export menu showing available file formats"
					class="feature-screenshot"
					loading="lazy"
				/>
			</div>
		</section>

		<!-- ── 4. Safety & Durability ── -->
		<section class="mb-24">
			<div class="mb-2 flex items-center gap-3">
				<span class="feature-section-marker" style="background:rgba(34,197,94,0.1);color:#16a34a;">
					<CircleCheck size={14} strokeWidth={2} />
				</span>
				<h2 class="feature-section-title">Safety &amp; Durability</h2>
			</div>
			<p class="mb-12 text-[0.85rem] leading-relaxed text-black/40">
				Writing is work. Quillium treats your work like infrastructure: offline-first, crash-proof, and built on a database that predates most writing apps.
			</p>

			<!-- Offline-First -->
			<div class="feature-card">
				<div class="feature-card-body">
					<h3 class="feature-card-heading">Offline-First Local Storage</h3>
					<p class="feature-card-why">
						Why: Your internet connection should not determine whether you can write. Every document, every revision, every comment lives on your machine in a local SQLite database. There is no "save" button because there is no server to save to.
					</p>
					<p class="feature-card-desc">
						Powered by SQLite, the most battle-tested database engine in existence (25+ years of field use). Your data is stored at <code>{'{app-data}'}/Quillium/quillium.db</code>. No internet required, no cloud dependency, no subscription needed for any core functionality.
					</p>
					<div class="feature-card-tags">
						<span class="tag tag--green">No internet needed</span>
						<span class="tag tag--green">SQLite-backed</span>
						<span class="tag tag--green">No save button</span>
						<span class="tag tag--green">Your data, your machine</span>
					</div>
				</div>
				<div class="anim-col" bind:this={offlineAnim}>
					<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="anim-svg">
						<circle id="pulse-ring" cx="100" cy="55" r="24" stroke="#16a34a" stroke-width="1.5" opacity="0"/>
						<path id="db-body" d="M72,42 L72,68 Q72,74 100,74 Q128,74 128,68 L128,42" fill="rgba(34,197,94,0.08)" stroke="#16a34a" stroke-width="1.5" stroke-linecap="round"/>
						<ellipse cx="100" cy="42" rx="28" ry="7" fill="rgba(34,197,94,0.12)" stroke="#16a34a" stroke-width="1.5"/>
						<path d="M72,55 Q72,61 100,61 Q128,61 128,55" stroke="#16a34a" stroke-width="1.2" stroke-linecap="round" opacity="0.3"/>
						<path id="db-check" d="M90,55 L97,62 L111,48" stroke="#16a34a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						<g id="wifi-off">
							<circle cx="148" cy="26" r="10" fill="rgba(0,0,0,0.04)" stroke="rgba(0,0,0,0.15)" stroke-width="0.8"/>
							<path d="M144,26 Q148,21 152,26" stroke="rgba(100,116,139,0.4)" stroke-width="1.2" stroke-linecap="round" fill="none"/>
							<path d="M150,26 L146,26" stroke="rgba(100,116,139,0.4)" stroke-width="1.5" stroke-linecap="round"/>
						</g>
					</svg>
				</div>
			</div>

			<!-- Crash Recovery -->
			<div class="feature-card">
				<div class="feature-card-body">
					<h3 class="feature-card-heading">Crash Recovery</h3>
					<p class="feature-card-why">
						Why: Apps crash. Power goes out. A writing app that can lose your last hour of work is not a writing app you can trust.
					</p>
					<p class="feature-card-desc">
						Every edit is recorded as an event in the database. Periodic snapshots capture full editor state. On startup, Quillium loads the latest snapshot and replays any events since then. Suspicious changes trigger automatic crash backups. If something goes wrong, a restore banner appears with the option to recover from backup.
					</p>
					<div class="feature-card-tags">
						<span class="tag tag--green">Event log</span>
						<span class="tag tag--green">Snapshot restore</span>
						<span class="tag tag--green">Auto-backup</span>
					</div>
				</div>
				<img
					src={errorBannerImg}
					alt="Crash recovery banner showing restore from backup option"
					class="feature-screenshot"
					loading="lazy"
				/>
			</div>
		</section>

		<!-- ── 5. Collaboration ── -->
		<section class="mb-24">
			<div class="mb-2 flex items-center gap-3">
				<span class="feature-section-marker" style="background:rgba(252,188,5,0.1);color:#d97706;">
					<Users size={14} strokeWidth={2} />
				</span>
				<h2 class="feature-section-title">Collaboration</h2>
			</div>
			<p class="mb-12 text-[0.85rem] leading-relaxed text-black/40">
				Writing with others should not mean emailing files back and forth. Quillium Omni adds live collaboration and sync — only if you need it.
			</p>

			<!-- Real-Time Collaboration -->
			<div class="feature-card">
				<div class="feature-card-body">
					<h3 class="feature-card-heading">Real-Time Collaboration</h3>
					<p class="feature-card-why">
						Why: When two people need to work on the same document, the options are usually "take turns" or "merge conflicts later." Quillium lets multiple people write in the same document at the same time, with each person's changes appearing instantly.
					</p>
					<p class="feature-card-desc">
						Powered by Yjs (CRDT-based sync). Host a room, share the link, and collaborators join directly in the editor. Cursor presence shows where everyone is working. Each person has their own undo stack. A snapshot is taken before going live so you always have a pre-collab checkpoint. Read-only web previews let you share a document publicly without giving edit access.
					</p>
					<div class="feature-card-tags">
						<span class="tag tag--amber">Real-time sync</span>
						<span class="tag tag--amber">Cursor presence</span>
						<span class="tag tag--amber">Per-user undo</span>
						<span class="tag tag--amber">Web previews</span>
					</div>
					<a
						href="/omni"
						class="mt-4 inline-flex items-center gap-1 text-[0.8rem] font-medium text-[#3b82f6] no-underline hover:underline"
					>
						Learn about Quillium Omni <span aria-hidden="true">→</span>
					</a>
				</div>
				<div class="anim-col" bind:this={collabAnim}>
					<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="anim-svg">
						<rect id="collab-bg" x="20" y="20" width="160" height="80" rx="6" fill="rgba(0,0,0,0.02)" stroke="rgba(0,0,0,0.06)" stroke-width="0.8"/>
						<text x="36" y="44" font-family="Inter,sans-serif" font-size="8" fill="rgba(0,0,0,0.3)">Writing is</text>
						<text x="36" y="58" font-family="Inter,sans-serif" font-size="8" fill="rgba(0,0,0,0.3)">collaborative work.</text>
						<rect id="hl-a" x="80" y="49" width="0" height="10" rx="1.5" fill="rgba(59,130,246,0.15)" transform-origin="left center"/>
						<rect id="hl-b" x="36" y="64" width="0" height="10" rx="1.5" fill="rgba(252,188,5,0.15)" transform-origin="right center"/>
						<g id="cursor-a">
							<circle id="cursor-a-ring" cx="36" cy="64" r="16" fill="rgba(59,130,246,0.08)" stroke="rgba(59,130,246,0.2)" stroke-width="1"/>
							<circle cx="36" cy="64" r="4" fill="#3b82f6"/>
						</g>
						<g id="cursor-b">
							<circle id="cursor-b-ring" cx="164" cy="78" r="16" fill="rgba(252,188,5,0.08)" stroke="rgba(252,188,5,0.2)" stroke-width="1"/>
							<circle cx="164" cy="78" r="4" fill="#d97706"/>
						</g>
					</svg>
				</div>
			</div>
		</section>

		<!-- ── 6. Customization ── -->
		<section class="mb-24">
			<div class="mb-2 flex items-center gap-3">
				<span class="feature-section-marker" style="background:rgba(0,0,0,0.05);color:rgba(0,0,0,0.35);">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
				</span>
				<h2 class="feature-section-title">Appearance &amp; Customization</h2>
			</div>
			<p class="mb-12 text-[0.85rem] leading-relaxed text-black/40">
				Your writing environment should feel like yours. Fonts, layout, behavior — everything is adjustable.
			</p>

			<!-- Fonts -->
			<div class="feature-card">
				<div class="feature-card-body">
					<h3 class="feature-card-heading">Fonts &amp; Display</h3>
					<p class="feature-card-why">
						Why: The right font changes how you write. Quillium gives you 16 carefully chosen fonts with detailed descriptions so you can pick what works for you.
					</p>
					<p class="feature-card-desc">
						Choose from 16 fonts across serif, sans-serif, typewriter, handwriting, and accessibility categories — including Georgia, Inter, EB Garamond, iA Writer Quattro, and OpenDyslexic. Adjust document font size (14–24px), UI zoom (50–200%), and choose between Markdown rich text mode and plain text mode.
					</p>
					<div class="feature-card-tags">
						<span class="tag" style="border-color:rgba(0,0,0,0.1);color:rgba(0,0,0,0.5);">16 fonts</span>
						<span class="tag" style="border-color:rgba(0,0,0,0.1);color:rgba(0,0,0,0.5);">Markdown / plain text</span>
						<span class="tag" style="border-color:rgba(0,0,0,0.1);color:rgba(0,0,0,0.5);">Adjustable zoom</span>
						<span class="tag" style="border-color:rgba(0,0,0,0.1);color:rgba(0,0,0,0.5);">Font Guide</span>
					</div>
				</div>
				<img
					src={settingsImg}
					alt="Settings panel showing font selection and appearance options"
					class="feature-screenshot"
					loading="lazy"
				/>
			</div>

			<!-- Keyboard-First -->
			<div class="feature-card">
				<div class="feature-card-body">
					<h3 class="feature-card-heading">Keyboard-First Design</h3>
					<p class="feature-card-why">
						Why: Every action in Quillium has a keyboard shortcut. Not because shortcuts are "power user" features — because taking your hands off the keyboard interrupts your thinking.
					</p>
					<p class="feature-card-desc">
						Dozens of shortcuts covering editing, navigation, annotations, library management, AI panels, zoom, and export. The status bar includes a shortcut reference guide. Focus follows keyboard: the editor, library, and modals all respond to key presses without clicking.
					</p>
				</div>
				<div class="anim-col" bind:this={keyboardAnim}>
					<svg viewBox="0 0 200 90" fill="none" xmlns="http://www.w3.org/2000/svg" class="anim-svg">
						<rect x="20" y="20" width="160" height="50" rx="8" fill="rgba(0,0,0,0.02)" stroke="rgba(0,0,0,0.06)" stroke-width="0.8"/>
						<g class="anim-key"><rect x="30" y="30" width="24" height="24" rx="4" fill="rgba(0,0,0,0.04)" stroke="rgba(0,0,0,0.08)" stroke-width="0.6"/><text x="42" y="46" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="rgba(0,0,0,0.35)" font-weight="500">⌘</text></g>
						<g class="anim-key"><rect x="58" y="30" width="28" height="24" rx="4" fill="rgba(0,0,0,0.04)" stroke="rgba(0,0,0,0.08)" stroke-width="0.6"/><text x="72" y="46" text-anchor="middle" font-family="Inter,sans-serif" font-size="7" fill="rgba(0,0,0,0.35)" font-weight="500">Shift</text></g>
						<g class="anim-key"><rect x="90" y="30" width="22" height="24" rx="4" fill="rgba(0,0,0,0.04)" stroke="rgba(0,0,0,0.08)" stroke-width="0.6"/><text x="101" y="46" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="rgba(0,0,0,0.35)" font-weight="500">H</text></g>
						<g class="anim-key"><rect x="116" y="30" width="22" height="24" rx="4" fill="rgba(0,0,0,0.04)" stroke="rgba(0,0,0,0.08)" stroke-width="0.6"/><text x="127" y="46" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="rgba(0,0,0,0.35)" font-weight="500">D</text></g>
						<g class="anim-key"><rect x="142" y="30" width="28" height="24" rx="4" fill="rgba(0,0,0,0.04)" stroke="rgba(0,0,0,0.08)" stroke-width="0.6"/><text x="156" y="46" text-anchor="middle" font-family="Inter,sans-serif" font-size="9" fill="rgba(0,0,0,0.35)" font-weight="500">K</text></g>
					</svg>
				</div>
			</div>
		</section>

		<!-- ── 7. Optional AI Assistance ── -->
		<section class="mb-24">
			<div class="mb-2 flex items-center gap-3">
				<span class="feature-section-marker" style="background:rgba(0,0,0,0.04);color:rgba(0,0,0,0.3);">
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 1 4 4c0 2-2 3-4 5-2-2-4-3-4-5a4 4 0 0 1 4-4z"/><path d="M4 22v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2"/></svg>
				</span>
				<h2 class="feature-section-title">Optional Assistance</h2>
			</div>
			<p class="mb-6 text-[0.85rem] leading-relaxed text-black/40">
				Quillium includes AI-powered writing assistance — but unlike most apps in 2025, it is <strong class="text-black/60">off by default</strong>. You have to explicitly enable it and bring your own API key. No data is ever sent to a server you did not configure.
			</p>

			<div class="feature-card compact">
				<div class="feature-card-body">
					<div class="feature-card-grid">
						<div>
							<h4 class="text-[0.85rem] font-semibold text-black/70">AI Sidebar</h4>
							<p class="text-[0.8rem] leading-relaxed text-black/40">Chat, feedback, and revision tools in a resizable panel. Works with the text you select.</p>
						</div>
						<div>
							<h4 class="text-[0.85rem] font-semibold text-black/70">Reader Personas</h4>
							<p class="text-[0.8rem] leading-relaxed text-black/40">Get feedback from 8 distinct perspectives — Skeptical Editor, Clarity Coach, First-Time Reader — plus custom personas you create.</p>
						</div>
						<div>
							<h4 class="text-[0.85rem] font-semibold text-black/70">Bring Your Own Key</h4>
							<p class="text-[0.8rem] leading-relaxed text-black/40">Supports OpenAI, Anthropic Claude, and Google Gemini. All processing is client-side. API keys are stored in your system keychain, not in Quillium.</p>
						</div>
						<div>
							<h4 class="text-[0.85rem] font-semibold text-black/70">AutoAI</h4>
							<p class="text-[0.8rem] leading-relaxed text-black/40">An optional continuous reviewer that watches your document and provides real-time feedback. Configurable conservativeness, annotation types, and persona.</p>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- CTA -->
		<div class="border-t border-black/6 pt-10 text-center">
			<p class="mb-4 font-[Newsreader,Georgia,serif] text-[1.5rem] text-black/70 italic">
				Ready to write?
			</p>
			<a href="/#download" class="btn-primary inline-flex items-center gap-2">
				<Download size={18} strokeWidth={1.5} class="shrink-0" />
				Download Quillium
			</a>
		</div>
	</div>
</main>

<Footer />

<style>
	.feature-section-marker {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		border-radius: 8px;
		flex-shrink: 0;
	}
	.feature-section-title {
		font-family: 'Newsreader', Georgia, serif;
		font-size: 1.5rem;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.8);
		letter-spacing: -0.01em;
		margin: 0;
	}
	.feature-card {
		display: grid;
		grid-template-columns: 1fr;
		gap: 24px;
		margin-bottom: 32px;
		padding: 24px;
		border-radius: 14px;
		border: 1px solid rgba(0, 0, 0, 0.06);
		background: rgba(255, 255, 255, 0.45);
	}
	.feature-card.compact {
		padding: 20px 24px;
	}
	@media (min-width: 768px) {
		.feature-card {
			grid-template-columns: 1fr 1fr;
			gap: 32px;
			padding: 28px 32px;
		}
		.feature-card.compact {
			grid-template-columns: 1fr;
			padding: 20px 24px;
		}
	}
	.feature-card-body {
		display: flex;
		flex-direction: column;
	}
	.feature-card-heading {
		font-family: 'Newsreader', Georgia, serif;
		font-size: 1.25rem;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.8);
		margin: 0 0 12px 0;
		letter-spacing: -0.01em;
	}
	.feature-card-why {
		font-size: 0.8rem;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.55);
		line-height: 1.7;
		margin: 0 0 8px 0;
		padding: 8px 12px;
		border-radius: 6px;
		background: rgba(0, 0, 0, 0.03);
		border-left: 2px solid rgba(0, 0, 0, 0.08);
	}
	.feature-card-desc {
		font-size: 0.8rem;
		color: rgba(0, 0, 0, 0.45);
		line-height: 1.7;
		margin: 0 0 12px 0;
	}
	.feature-card-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: auto;
	}
	.tag {
		border-radius: 9999px;
		padding: 2px 10px;
		font-size: 11px;
		font-family: 'Inter', sans-serif;
		font-weight: 500;
	}
	.tag--purple {
		background: rgba(168, 85, 247, 0.08);
		border: 1px solid rgba(168, 85, 247, 0.2);
		color: #7c3aed;
	}
	.tag--blue {
		background: rgba(59, 130, 246, 0.08);
		border: 1px solid rgba(59, 130, 246, 0.2);
		color: #2563eb;
	}
	.tag--amber {
		background: rgba(252, 188, 5, 0.1);
		border: 1px solid rgba(252, 188, 5, 0.2);
		color: #b45309;
	}
	.tag--green {
		background: rgba(34, 197, 94, 0.08);
		border: 1px solid rgba(34, 197, 94, 0.2);
		color: #16a34a;
	}
	.feature-card-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 16px;
	}
	@media (min-width: 640px) {
		.feature-card-grid {
			grid-template-columns: 1fr 1fr;
		}
	}
	.feature-screenshot {
		width: 100%;
		height: auto;
		border-radius: 8px;
		box-shadow:
			0 4px 16px rgba(44, 42, 39, 0.08),
			0 1px 4px rgba(44, 42, 39, 0.04);
		align-self: center;
	}

	.anim-col {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 8px;
		min-height: 120px;
	}
	.anim-svg {
		width: 100%;
		max-width: 200px;
		height: auto;
	}

	.external-link {
		color: #3b82f6;
		text-decoration: none;
	}
	.external-link:hover {
		text-decoration: underline;
	}
	kbd {
		display: inline-block;
		padding: 1px 5px;
		font-size: 11px;
		font-family: 'Inter', monospace;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.55);
		background: rgba(0, 0, 0, 0.04);
		border: 1px solid rgba(0, 0, 0, 0.1);
		border-radius: 4px;
		line-height: 1.4;
	}
	code {
		font-size: 0.75rem;
		padding: 1px 5px;
		background: rgba(0, 0, 0, 0.04);
		border-radius: 4px;
		color: rgba(0, 0, 0, 0.55);
	}
</style>

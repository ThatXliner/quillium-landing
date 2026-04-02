<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let activeTab: 'plain' | 'legal' = $state('plain');
</script>

<svelte:head>
	<title>Terms of Service – Quillium</title>
	<meta
		name="description"
		content="Terms of Service for Quillium — what you agree to when using the app."
	/>
	<link rel="canonical" href="https://quillium.bryanhu.com/terms" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://quillium.bryanhu.com/terms" />
	<meta property="og:title" content="Terms of Service – Quillium" />
	<meta
		property="og:description"
		content="Terms of Service for Quillium — what you agree to when using the app."
	/>
	<meta property="og:site_name" content="Quillium" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Terms of Service – Quillium" />
	<meta
		name="twitter:description"
		content="Terms of Service for Quillium — what you agree to when using the app."
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Newsreader:ital,wght@0,400;0,500;1,400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<Nav />

<main class="min-h-screen px-6 pt-32 pb-20">
	<div class="mx-auto max-w-[720px]">
		<header class="mb-12">
			<p class="section-eyebrow">Legal</p>
			<h1
				class="mb-2 font-[Newsreader,Georgia,serif] text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.15] font-normal tracking-[-0.02em] text-black/88 italic"
			>
				Terms of Service
			</h1>
			<p class="mb-8 text-[0.8rem] text-black/28">Last updated: March 26, 2026</p>

			<div class="inline-flex gap-0.5 rounded-full bg-white/50 p-1 shadow-sm backdrop-blur-md">
				<button
					role="tab"
					aria-selected={activeTab === 'plain'}
					class="tab-btn"
					class:active={activeTab === 'plain'}
					onclick={() => (activeTab = 'plain')}
				>
					Plain English
				</button>
				<button
					role="tab"
					aria-selected={activeTab === 'legal'}
					class="tab-btn"
					class:active={activeTab === 'legal'}
					onclick={() => (activeTab = 'legal')}
				>
					Full Legal
				</button>
			</div>
		</header>

		{#if activeTab === 'plain'}
			<div role="tabpanel">
				<div
					class="mb-8 flex items-start gap-3 rounded-xl border border-[#3b82f6]/15 bg-[#3b82f6]/5 px-5 py-4"
				>
					<span
						class="shrink-0 rounded bg-[#3b82f6]/10 px-2 py-0.5 text-[0.65rem] font-bold tracking-[0.08em] text-[#3b82f6] uppercase"
						>TL;DR</span
					>
					<p class="m-0 text-[0.875rem] leading-relaxed text-black/88">
						This is an early beta. Things may break. Back up your work. Your writing is yours.
					</p>
				</div>

				<div class="grid gap-3">
					<div
						class="flex gap-4 rounded-xl bg-white/50 p-5 shadow-md inset-shadow-sm inset-shadow-white backdrop-blur-md"
					>
						<div
							class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400/10"
						>
							<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
								<path d="M9 2a7 7 0 100 14A7 7 0 009 2z" stroke="#f59e0b" stroke-width="1.4" />
								<path
									d="M9 6v4M9 12v.5"
									stroke="#f59e0b"
									stroke-width="1.4"
									stroke-linecap="round"
								/>
							</svg>
						</div>
						<div>
							<h3 class="mb-1 text-[0.875rem] font-semibold text-black/88">Beta Status</h3>
							<p class="m-0 text-[0.8rem] leading-relaxed text-black/50">
								This is an unstable beta. Features may change or be removed at any time. Not
								intended for production or critical work. We collect anonymous analytics but you may
								opt out anytime.
							</p>
						</div>
					</div>

					<div
						class="flex gap-4 rounded-xl bg-white/50 p-5 shadow-md inset-shadow-sm inset-shadow-white backdrop-blur-md"
					>
						<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-400/10">
							<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
								<path d="M3 9a6 6 0 1012 0A6 6 0 003 9z" stroke="#ef4444" stroke-width="1.4" />
								<path
									d="M9 6v3.5M11.5 12L9 9.5"
									stroke="#ef4444"
									stroke-width="1.4"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</div>
						<div>
							<h3 class="mb-1 text-[0.875rem] font-semibold text-black/88">No Liability</h3>
							<p class="m-0 text-[0.8rem] leading-relaxed text-black/50">
								The Service is provided "as-is" with no warranties. Data loss is possible — back up
								important content. We are not liable for any damages arising from use.
							</p>
						</div>
					</div>

					<div
						class="flex gap-4 rounded-xl bg-white/50 p-5 shadow-md inset-shadow-sm inset-shadow-white backdrop-blur-md"
					>
						<div
							class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#3b82f6]/8"
						>
							<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
								<path
									d="M9 2C5.134 2 2 5.134 2 9s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7z"
									stroke="#3b82f6"
									stroke-width="1.4"
								/>
								<path
									d="M6 9l2 2 4-4"
									stroke="#3b82f6"
									stroke-width="1.4"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</div>
						<div>
							<h3 class="mb-1 text-[0.875rem] font-semibold text-black/88">Feedback</h3>
							<p class="m-0 text-[0.8rem] leading-relaxed text-black/50">
								Any feedback you share may be used to improve the Service without compensation.
								Using the beta does not grant any ownership rights over the app or its features.
							</p>
						</div>
					</div>

					<div
						class="flex gap-4 rounded-xl bg-white/50 p-5 shadow-md inset-shadow-sm inset-shadow-white backdrop-blur-md"
					>
						<div
							class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10"
						>
							<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
								<path
									d="M9 2v5M6.5 4.5L9 7l2.5-2.5"
									stroke="#10b981"
									stroke-width="1.4"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
								<path
									d="M3 9a6 6 0 1012 0"
									stroke="#10b981"
									stroke-width="1.4"
									stroke-linecap="round"
								/>
							</svg>
						</div>
						<div>
							<h3 class="mb-1 text-[0.875rem] font-semibold text-black/88">Privacy & Updates</h3>
							<p class="m-0 text-[0.8rem] leading-relaxed text-black/50">
								We collect minimal analytics to improve the product. Terms may be updated during
								beta; continued use means you accept changes.
							</p>
						</div>
					</div>

					<div
						class="flex gap-4 rounded-xl bg-white/50 p-5 shadow-md inset-shadow-sm inset-shadow-white backdrop-blur-md"
					>
						<div
							class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#3b82f6]/8"
						>
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
								<rect
									x="3"
									y="8"
									width="14"
									height="10"
									rx="2"
									stroke="#3b82f6"
									stroke-width="1.5"
								/>
								<path
									d="M7 8V6a3 3 0 016 0v2"
									stroke="#3b82f6"
									stroke-width="1.5"
									stroke-linecap="round"
								/>
							</svg>
						</div>
						<div>
							<h3 class="mb-1 text-[0.875rem] font-semibold text-black/88">
								Your content is yours
							</h3>
							<p class="m-0 text-[0.8rem] leading-relaxed text-black/50">
								Quillium is local-first. Your writing stays on your machine. We never access,
								collect, or store your documents. See our
								<a href="/privacy" class="text-[#3b82f6] no-underline hover:underline"
									>Privacy Policy</a
								> for details on what we do collect.
							</p>
						</div>
					</div>
				</div>

				<p class="mt-8 text-center text-[0.8rem] text-black/28">
					Want the full legal text?
					<button class="inline-tab-switch" onclick={() => (activeTab = 'legal')}
						>Switch to Full Legal view</button
					>
				</p>
			</div>
		{:else}
			<div class="legal-content" role="tabpanel">
				<section>
					<h2>1. Acceptance of Terms</h2>
					<p>
						By downloading, installing, or using Quillium ("the Service"), you agree to be bound by
						these Terms of Service. If you do not agree, do not use the Service.
					</p>
				</section>

				<section>
					<h2>2. Beta Status</h2>
					<p>
						Quillium is currently in <strong>public beta</strong>. This means:
					</p>
					<ul>
						<li>Features may change, break, or be removed at any time without notice</li>
						<li>The Service is not intended for production or critical work</li>
						<li>Data loss is possible — you are responsible for backing up your content</li>
						<li>
							We collect anonymous usage analytics through PostHog. You may opt out at any time via
							the Cookie Settings link in the footer or the app's settings
						</li>
					</ul>
				</section>

				<section>
					<h2>3. No Warranty / Limitation of Liability</h2>
					<p>
						The Service is provided <strong>"as-is"</strong> and <strong>"as-available"</strong>
						without warranties of any kind, whether express or implied, including but not limited to implied
						warranties of merchantability, fitness for a particular purpose, and non-infringement.
					</p>
					<p>
						To the maximum extent permitted by applicable law, Quillium and its creators shall not
						be liable for any indirect, incidental, special, consequential, or punitive damages, or
						any loss of profits or revenues, whether incurred directly or indirectly, or any loss of
						data, use, goodwill, or other intangible losses resulting from:
					</p>
					<ul>
						<li>Your use of or inability to use the Service</li>
						<li>Any data loss, corruption, or unauthorized access</li>
						<li>Any bugs, errors, or interruptions in the Service</li>
						<li>Any content or conduct of any third party on the Service</li>
					</ul>
				</section>

				<section>
					<h2>4. Feedback</h2>
					<p>
						Any feedback, suggestions, ideas, or other information you provide about the Service may
						be used by us to improve the Service without any obligation or compensation to you.
					</p>
					<p>
						Using the Service does not grant you any ownership rights over the app, its features,
						design, or intellectual property.
					</p>
				</section>

				<section>
					<h2>5. Restrictions</h2>
					<p>You agree not to:</p>
					<ul>
						<li>Reverse-engineer, decompile, or disassemble the Service</li>
						<li>Remove or alter any proprietary notices or labels on the Service</li>
						<li>Use the Service for any purpose that is unlawful or prohibited by these Terms</li>
					</ul>
				</section>

				<section>
					<h2>6. Your Content</h2>
					<p>
						Quillium is local-first. Your writing stays on your machine. We do not access, collect,
						or store your documents. You retain full ownership of everything you create.
					</p>
				</section>

				<section>
					<h2>7. Privacy</h2>
					<p>
						Your use of the Service is also governed by our
						<a href="/privacy">Privacy Policy</a>, which describes what data we collect and how we
						use it.
					</p>
				</section>

				<section>
					<h2>8. Changes to These Terms</h2>
					<p>
						We may update these Terms from time to time. Material changes will be indicated by
						updating the "Last Updated" date at the top. Continued use of the Service after changes
						constitutes acceptance of the revised Terms.
					</p>
				</section>

				<section>
					<h2>9. Termination</h2>
					<p>
						We reserve the right to suspend or terminate your access to the Service at any time, for
						any reason, without notice. Upon termination, your right to use the Service ceases
						immediately. Since the app is local-first, your data remains on your machine regardless.
					</p>
				</section>

				<section>
					<h2>10. Contact</h2>
					<p>
						Questions about these Terms? Email us at
						<a href="mailto:thatxliner@gmail.com">thatxliner@gmail.com</a>.
					</p>
				</section>

				<p class="mt-8 text-center text-[0.8rem] text-black/28">
					Prefer a simpler summary?
					<button class="inline-tab-switch" onclick={() => (activeTab = 'plain')}
						>Switch to Plain English view</button
					>
				</p>
			</div>
		{/if}
	</div>
</main>

<Footer />

<style>
	/* ── Tabs ── */
	.tab-btn {
		padding: 7px 20px;
		border-radius: 9999px;
		border: none;
		background: transparent;
		font-size: 0.8rem;
		font-weight: 500;
		font-family: 'Inter', sans-serif;
		color: rgba(0, 0, 0, 0.6);
		cursor: pointer;
		transition: all 0.2s;
	}
	.tab-btn.active {
		background: white;
		color: rgba(0, 0, 0, 0.88);
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
	}
	.tab-btn:not(.active):hover {
		color: rgba(0, 0, 0, 0.88);
	}

	/* ── Legal content ── */
	.legal-content section {
		margin-bottom: 40px;
	}
	.legal-content h2 {
		font-family: 'Newsreader', Georgia, serif;
		font-size: 1.2rem;
		font-weight: 400;
		font-style: italic;
		color: rgba(0, 0, 0, 0.88);
		margin: 0 0 12px 0;
		padding-bottom: 8px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.06);
	}
	.legal-content h3 {
		font-size: 0.875rem;
		font-weight: 600;
		color: rgba(0, 0, 0, 0.88);
		margin: 20px 0 8px 0;
	}
	.legal-content p {
		font-size: 0.875rem;
		color: rgba(0, 0, 0, 0.6);
		line-height: 1.75;
		margin: 0 0 12px 0;
	}
	.legal-content ul {
		margin: 8px 0 12px 0;
		padding-left: 20px;
	}
	.legal-content li {
		font-size: 0.875rem;
		color: rgba(0, 0, 0, 0.6);
		line-height: 1.75;
		margin-bottom: 4px;
	}
	.legal-content a {
		color: #3b82f6;
		text-decoration: none;
	}
	.legal-content a:hover {
		text-decoration: underline;
	}
	.legal-content strong {
		color: rgba(0, 0, 0, 0.88);
	}

	/* ── Tab switch link ── */
	.inline-tab-switch {
		background: none;
		border: none;
		color: #3b82f6;
		font-size: 0.8rem;
		font-family: 'Inter', sans-serif;
		cursor: pointer;
		padding: 0;
		text-decoration: underline;
		text-underline-offset: 2px;
	}
	.inline-tab-switch:hover {
		color: #2563eb;
	}
</style>

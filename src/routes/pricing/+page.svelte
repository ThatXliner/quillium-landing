<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { PenLine, WifiOff, ExternalLink, CircleDollarSign, Download } from '@lucide/svelte';
</script>

<svelte:head>
	<title>Pricing – Quillium</title>
	<meta
		name="description"
		content="Quillium is free. With no tiers and no paywalls, here's how we plan to sustain this."
	/>
	<link rel="canonical" href="https://quillium.bryanhu.com/pricing" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://quillium.bryanhu.com/pricing" />
	<meta property="og:title" content="Pricing – Quillium" />
	<meta
		property="og:description"
		content="Quillium is free. With no tiers and no paywalls, here's how we plan to sustain this."
	/>
	<meta property="og:site_name" content="Quillium" />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Pricing – Quillium" />
	<meta
		name="twitter:description"
		content="Quillium is free. With no tiers and no paywalls, here's how we plan to sustain this."
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
	<div class="mx-auto max-w-2xl">
		<!-- Header -->
		<header class="mb-16">
			<h1
				class="mb-4 font-[Newsreader,Georgia,serif] text-[clamp(2.5rem,6vw,3.75rem)] leading-[1.05] font-normal tracking-[-0.03em] text-black/90"
			>
				Quillium is <span class="italic">free</span>.
			</h1>
			<p class="max-w-xl text-[0.95rem] leading-relaxed text-black/45">
				No tiers. No locked features. One optional add-on, someday, if you want it.
			</p>
		</header>

		<!-- Promises: 2×2 grid -->
		<section class="mb-20">
			<p class="mb-6 text-[0.7rem] font-semibold tracking-[0.1em] text-black/30 uppercase">
				What will always be free
			</p>
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div class="promise-cell">
					<PenLine class="promise-icon" size={24} strokeWidth={1.5} color="rgba(0,0,0,0.25)" />
					<div>
						<p class="promise-title">The full editor</p>
						<p class="promise-body">Branches, annotations—everything. We don't gate features.</p>
					</div>
				</div>
				<div class="promise-cell">
					<WifiOff class="promise-icon" size={24} strokeWidth={1.5} color="rgba(0,0,0,0.25)" />
					<div>
						<p class="promise-title">Local-first &amp; offline</p>
						<p class="promise-body">
							Your writing lives on your machine. No internet required; <a
								href="/blog/quillium-privacy"
								class="text-[#3b82f6] no-underline hover:underline">fully private</a
							>.
						</p>
					</div>
				</div>
				<div class="promise-cell">
					<ExternalLink class="promise-icon" size={24} strokeWidth={1.5} color="rgba(0,0,0,0.25)" />
					<div>
						<p class="promise-title">Your data, your exit</p>
						<p class="promise-body">
							Text export, anytime. Switching costs are how bad software traps you.
						</p>
					</div>
				</div>
				<div class="promise-cell">
					<CircleDollarSign
						class="promise-icon"
						size={24}
						strokeWidth={1.5}
						color="rgba(0,0,0,0.25)"
					/>
					<div>
						<p class="promise-title">Everything that matters</p>
						<p class="promise-body">
							Never pay us a cent and the app works the same. <a
								href="/blog/free-isnt-generosity"
								class="text-[#3b82f6] no-underline hover:underline">That's the point</a
							>
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Paid options -->
		<section id="paid" class="scroll-mt-28">
			<!-- Notice -->
			<div
				class="mb-8 flex items-center gap-3 rounded-lg border border-amber-400/20 bg-amber-400/6 px-4 py-3"
			>
				<span
					class="shrink-0 rounded bg-amber-400/15 px-2 py-0.5 text-[0.6rem] font-bold tracking-[0.08em] text-amber-600 uppercase"
					>Note</span
				>
				<p class="m-0 text-[0.8rem] text-black/55">
					These are <strong class="text-black/75">future plans</strong>. Right now everything is
					simply free, no strings attached.
				</p>
			</div>

			<div class="mb-6 flex items-baseline gap-2">
				<p class="text-[0.7rem] font-semibold tracking-[0.1em] text-black/30 uppercase">
					What you can pay for, eventually
				</p>
				<span
					class="rounded-full border border-black/8 px-2 py-0.5 text-[0.6rem] font-medium text-black/30"
					>Coming later</span
				>
			</div>

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-start">
				<!-- Omni card -->
				<div
					class="flex h-full flex-col overflow-hidden rounded-xl border border-black/6 bg-white/60"
				>
					<div class="border-b border-black/5 px-5 py-4">
						<p class="mb-1 text-[0.65rem] font-semibold tracking-[0.08em] text-black/30 uppercase">
							Quillium Omni
						</p>
						<p
							class="font-[Newsreader,Georgia,serif] text-[1.4rem] leading-none text-black/65 italic"
						>
							~$20<span class="text-[0.85rem] text-black/30">/month</span>
						</p>
						<p class="mt-1 text-[0.7rem] text-black/28">
							Price TBD. The more users, the cheaper it gets.
						</p>
					</div>
					<div class="flex flex-1 flex-col px-5 py-4">
						<ul class="space-y-2">
							<li class="check-item">Sync your documents everywhere, including mobile</li>
							<li class="check-item">
								Real-time collaboration. Invite anyone, even non-paying users
							</li>
							<li class="check-item">Cancel anytime; local data unaffected</li>
						</ul>
						<p class="mt-auto pt-3 text-[0.7rem] text-black/28">
							Mobile is free for everyone: sync just works better with a plan.
						</p>
					</div>
				</div>

				<!-- Custom build card -->
				<div
					class="flex h-full flex-col overflow-hidden rounded-xl border border-black/6 bg-white/60"
				>
					<div class="border-b border-black/5 px-5 py-4">
						<p class="mb-1 text-[0.65rem] font-semibold tracking-[0.08em] text-black/30 uppercase">
							Custom Build
						</p>
						<p
							class="font-[Newsreader,Georgia,serif] text-[1.4rem] leading-none text-black/65 italic"
						>
							~$1k <span class="text-[0.85rem] text-black/30"> one-time</span>
						</p>
						<p class="mt-1 text-[0.7rem] text-black/28">Rough estimate. Depends on scope.</p>
					</div>
					<div class="flex flex-1 flex-col px-5 py-4">
						<ul class="space-y-2">
							<li class="check-item">Quillium tuned to your exact workflow</li>
							<li class="check-item">For studios, publishers, writing programs</li>
							<li class="check-item">Custom features, branding, integrations</li>
							<li class="check-item">
								<a
									href="mailto:support@quillium.bryanhu.com"
									class="text-[#3b82f6] no-underline hover:underline">Email us</a
								> to discuss
							</li>
						</ul>
						<p class="mt-auto pt-3 text-[0.7rem] text-black/28">
							Not sure if this fits? Just ask — we'll tell you honestly.
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Why this model -->
		<section class="mt-20 mb-16">
			<p class="mb-5 text-[0.7rem] font-semibold tracking-[0.1em] text-black/30 uppercase">
				Why this model
			</p>
			<div class="space-y-5">
				<div class="why-row">
					<p class="why-label">No VC pressure</p>
					<p class="why-text">
						We're not funded. No one can pressure us to add paywalls or sell your data.
					</p>
				</div>
				<div class="why-row">
					<p class="why-label">Survives us shutting down</p>
					<p class="why-text">
						The app works whether or not we exist. Your writing doesn't depend on our servers.
					</p>
				</div>
				<div class="why-row">
					<p class="why-label">Omni is the right trade</p>
					<p class="why-text">
						It's an extra service, not a toll on things you already have. Skip it entirely if you
						want.
					</p>
				</div>
				<div class="why-row">
					<p class="why-label">Have a better idea?</p>
					<p class="why-text">
						Genuinely, <a
							href="mailto:support@quillium.bryanhu.com"
							class="text-[#3b82f6] no-underline hover:underline">email us</a
						>.
					</p>
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
	/* Promise grid */
	.promise-cell {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 16px 18px;
		border-radius: 12px;
		border: 1px solid rgba(0, 0, 0, 0.06);
		background: rgba(255, 255, 255, 0.5);
	}
	.promise-icon {
		color: rgba(0, 0, 0, 0.25);
		margin-top: 1px;
		flex-shrink: 0;
	}
	.promise-title {
		font-size: 0.875rem;
		font-weight: 600;
		color: rgba(0, 0, 0, 0.78);
		margin: 0 0 4px 0;
	}
	.promise-body {
		font-size: 0.8rem;
		color: rgba(0, 0, 0, 0.4);
		line-height: 1.6;
		margin: 0;
	}

	/* Check items */
	.check-item {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		font-size: 0.8rem;
		color: rgba(0, 0, 0, 0.55);
	}
	.check-item::before {
		content: '';
		display: block;
		width: 12px;
		height: 12px;
		margin-top: 3px;
		flex-shrink: 0;
		background: url("data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M2.5 7l3 3 6-6' stroke='%2316a34a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")
			no-repeat center;
		background-size: contain;
	}

	/* Why rows */
	.why-row {
		display: grid;
		grid-template-columns: 160px 1fr;
		gap: 16px;
		align-items: baseline;
	}
	@media (max-width: 480px) {
		.why-row {
			grid-template-columns: 1fr;
			gap: 2px;
		}
	}
	.why-label {
		font-size: 0.8rem;
		font-weight: 600;
		color: rgba(0, 0, 0, 0.65);
		margin: 0;
	}
	.why-text {
		font-size: 0.825rem;
		color: rgba(0, 0, 0, 0.42);
		line-height: 1.65;
		margin: 0;
	}
	.why-text a {
		color: #3b82f6;
	}
</style>

<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
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

<main class="min-h-screen px-6 pt-32 pb-24">
	<div class="mx-auto max-w-170">
		<!-- Header -->
		<header>
			<p class="section-eyebrow">Pricing</p>
			<h1
				class="mb-3 font-[Newsreader,Georgia,serif] text-[clamp(2rem,5vw,3rem)] leading-[1.1] font-normal tracking-[-0.02em] text-black/88"
			>
				Quillium is <span class="italic">free</span>.
			</h1>
			<p class="max-w-lg text-[0.9rem] leading-relaxed text-black/45">
				No tiers. No locked features. One optional add-on, someday, if you want it.
			</p>
		</header>

		<!-- Promises: 2×2 grid -->
		<section>
			<p class="mb-4 text-[0.7rem] font-semibold tracking-[0.1em] text-black/30 uppercase">
				What will always be free
			</p>
			<div
				class="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-black/6 sm:grid-cols-2"
			>
				<div class="promise-cell">
					<span class="promise-glyph">✦</span>
					<div>
						<p class="promise-title">The full editor</p>
						<p class="promise-body">Branches, annotations—everything. We don't gate features.</p>
					</div>
				</div>
				<div class="promise-cell">
					<span class="promise-glyph">✦</span>
					<div>
						<p class="promise-title">Local-first &amp; offline</p>
						<p class="promise-body">
							Your writing lives on your machine. No internet required; fully private.
						</p>
					</div>
				</div>
				<div class="promise-cell">
					<span class="promise-glyph">✦</span>
					<div>
						<p class="promise-title">Your data, your exit</p>
						<p class="promise-body">
							Text export, anytime. Switching costs are how bad software traps you.
						</p>
					</div>
				</div>
				<div class="promise-cell">
					<span class="promise-glyph">✦</span>
					<div>
						<p class="promise-title">No forced payments</p>
						<p class="promise-body">
							Never pay us a cent and the app works the same. That's the point.
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Divider -->
		<div class="my-12 border-t border-black/6"></div>
		<!-- Notice -->
		<div
			class="mb-6 flex items-center gap-3 rounded-lg border border-amber-400/20 bg-amber-400/6 px-4 py-3"
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
		<!-- Cards: Sync + Custom -->
		<section class="mb-12">
			<div class="mb-5 flex items-baseline gap-2">
				<p class="text-[0.7rem] font-semibold tracking-[0.1em] text-black/30 uppercase">
					What you can pay for, eventually
				</p>
				<span
					class="rounded-full border border-black/8 px-2 py-0.5 text-[0.6rem] font-medium text-black/30"
					>Coming later</span
				>
			</div>

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-start">
				<!-- Sync card -->
				<div
					class="flex h-full flex-col overflow-hidden rounded-xl border border-black/6 bg-white/50 shadow-sm backdrop-blur-md"
				>
					<div class="border-b border-black/5 px-5 py-4">
						<p class="mb-1 text-[0.65rem] font-semibold tracking-[0.08em] text-black/30 uppercase">
							Quillium Sync
						</p>
						<p
							class="font-[Newsreader,Georgia,serif] text-[1.4rem] leading-none text-black/70 italic"
						>
							~$20<span class="text-[0.85rem] text-black/35">/month</span>
						</p>
						<p class="mt-1 text-[0.7rem] text-black/30">
							Price TBD. The more users, the cheaper it gets.
						</p>
					</div>
					<div class="flex flex-1 flex-col px-5 py-4">
						<ul class="space-y-2">
							<li class="flex items-start gap-2 text-[0.8rem] text-black/55">
								<svg
									class="mt-0.5 shrink-0 text-black/25"
									width="12"
									height="12"
									viewBox="0 0 14 14"
									fill="none"
									><path
										d="M2.5 7l3 3 6-6"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/></svg
								>
								Sync your documents everywhere, including mobile
							</li>
							<li class="flex items-start gap-2 text-[0.8rem] text-black/55">
								<svg
									class="mt-0.5 shrink-0 text-black/25"
									width="12"
									height="12"
									viewBox="0 0 14 14"
									fill="none"
									><path
										d="M2.5 7l3 3 6-6"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/></svg
								>
								Real-time collaboration. Invite anyone, even non-paying users
							</li>
							<li class="flex items-start gap-2 text-[0.8rem] text-black/55">
								<svg
									class="mt-0.5 shrink-0 text-black/25"
									width="12"
									height="12"
									viewBox="0 0 14 14"
									fill="none"
									><path
										d="M2.5 7l3 3 6-6"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/></svg
								>
								Cancel anytime; local data unaffected
							</li>
						</ul>
						<p class="mt-auto pt-3 text-[0.7rem] text-black/28">
							Mobile is free for everyone: sync just works better with a plan.
						</p>
					</div>
				</div>

				<!-- Custom build card -->
				<div
					class="flex h-full flex-col overflow-hidden rounded-xl border border-black/6 bg-white/50 shadow-sm backdrop-blur-md"
				>
					<div class="border-b border-black/5 px-5 py-4">
						<p class="mb-1 text-[0.65rem] font-semibold tracking-[0.08em] text-black/30 uppercase">
							Custom Build
						</p>
						<p
							class="font-[Newsreader,Georgia,serif] text-[1.4rem] leading-none text-black/70 italic"
						>
							~$1k <span class="text-[0.85rem] text-black/35"> one-time</span>
						</p>
						<p class="mt-1 text-[0.7rem] text-black/30">Rough estimate. Depends on scope.</p>
					</div>
					<div class="flex flex-1 flex-col px-5 py-4">
						<ul class="space-y-2">
							<li class="flex items-start gap-2 text-[0.8rem] text-black/55">
								<svg
									class="mt-0.5 shrink-0 text-black/25"
									width="12"
									height="12"
									viewBox="0 0 14 14"
									fill="none"
									><path
										d="M2.5 7l3 3 6-6"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/></svg
								>
								Quillium tuned to your exact workflow
							</li>
							<li class="flex items-start gap-2 text-[0.8rem] text-black/55">
								<svg
									class="mt-0.5 shrink-0 text-black/25"
									width="12"
									height="12"
									viewBox="0 0 14 14"
									fill="none"
									><path
										d="M2.5 7l3 3 6-6"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/></svg
								>
								For studios, publishers, writing programs
							</li>
							<li class="flex items-start gap-2 text-[0.8rem] text-black/55">
								<svg
									class="mt-0.5 shrink-0 text-black/25"
									width="12"
									height="12"
									viewBox="0 0 14 14"
									fill="none"
									><path
										d="M2.5 7l3 3 6-6"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/></svg
								>
								Custom features, branding, integrations
							</li>
							<li class="flex items-start gap-2 text-[0.8rem] text-black/55">
								<svg
									class="mt-0.5 shrink-0 text-black/25"
									width="12"
									height="12"
									viewBox="0 0 14 14"
									fill="none"
									><path
										d="M2.5 7l3 3 6-6"
										stroke="currentColor"
										stroke-width="1.5"
										stroke-linecap="round"
										stroke-linejoin="round"
									/></svg
								>
								<span
									><a
										href="mailto:thatxliner@gmail.com"
										class="text-[#3b82f6] no-underline hover:underline">Email us</a
									> to discuss</span
								>
							</li>
						</ul>
						<p class="mt-auto pt-3 text-[0.7rem] text-black/28">
							Not sure if this fits? Just ask — we'll tell you honestly.
						</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Why this model: scannable -->
		<section class="mb-14">
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
					<p class="why-label">Sync is the right trade</p>
					<p class="why-text">
						It's an extra service, not a toll on things you already have. Skip it entirely if you
						want.
					</p>
				</div>
				<div class="why-row">
					<p class="why-label">Have a better idea?</p>
					<p class="why-text">
						Genuinely, <a
							href="mailto:thatxliner@gmail.com"
							class="text-[#3b82f6] no-underline hover:underline">email us</a
						>.
					</p>
				</div>
			</div>
		</section>
	</div>
</main>

<Footer />

<style>
	/* Promise grid */
	.promise-cell {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: 18px 20px;
		background: rgba(255, 255, 255, 0.5);
		backdrop-filter: blur(8px);
	}
	.promise-glyph {
		font-size: 0.55rem;
		color: rgba(0, 0, 0, 0.2);
		margin-top: 4px;
		flex-shrink: 0;
		letter-spacing: 0;
	}
	.promise-title {
		font-size: 0.825rem;
		font-weight: 600;
		color: rgba(0, 0, 0, 0.8);
		margin: 0 0 3px 0;
	}
	.promise-body {
		font-size: 0.775rem;
		color: rgba(0, 0, 0, 0.42);
		line-height: 1.6;
		margin: 0;
	}

	/* Why rows */
	.why-row {
		display: grid;
		grid-template-columns: 140px 1fr;
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
		font-size: 0.775rem;
		font-weight: 600;
		color: rgba(0, 0, 0, 0.65);
		margin: 0;
	}
	.why-text {
		font-size: 0.8rem;
		color: rgba(0, 0, 0, 0.45);
		line-height: 1.65;
		margin: 0;
	}
	.why-text a {
		color: #3b82f6;
	}
</style>

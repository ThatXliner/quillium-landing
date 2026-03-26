<svelte:head>
	<title>Pricing – Quillium</title>
	<meta name="description" content="Quillium is free. No tiers, no paywalls. Here's how we plan to sustain this." />
	<link rel="canonical" href="https://quillium.bryanhu.com/pricing" />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://quillium.bryanhu.com/pricing" />
	<meta property="og:title" content="Pricing – Quillium" />
	<meta property="og:description" content="Quillium is free. No tiers, no paywalls. Here's how we plan to sustain this." />
	<meta property="og:site_name" content="Quillium" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Pricing – Quillium" />
	<meta name="twitter:description" content="Quillium is free. No tiers, no paywalls. Here's how we plan to sustain this." />

	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Newsreader:ital,wght@0,400;0,500;1,400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<Nav />

<main class="min-h-screen px-6 pt-32 pb-24">
	<div class="mx-auto max-w-[720px]">

		<!-- Header -->
		<header class="mb-16">
			<p class="section-eyebrow">Pricing</p>
			<h1 class="mb-4 font-[Newsreader,Georgia,serif] text-[clamp(1.75rem,4vw,2.75rem)] font-normal leading-[1.15] tracking-[-0.02em] text-black/88 italic">
				Quillium is free.
			</h1>
			<p class="text-[1rem] leading-relaxed text-black/50 max-w-[520px]">
				No tiers. No paywalls. No features locked behind a subscription. Here's what that means in practice, and how we plan to keep the lights on.
			</p>
		</header>

		<!-- Beta notice -->
		<div class="mb-12 flex items-start gap-3 rounded-xl border border-amber-400/20 bg-amber-400/6 px-5 py-4">
			<span class="shrink-0 rounded bg-amber-400/15 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-amber-600">Public Beta</span>
			<p class="m-0 text-[0.875rem] leading-relaxed text-black/70">
				We're still in public beta. Everything below describes our <strong class="text-black/88">future plans</strong>, not current offerings. Right now, Quillium is simply free with no strings attached.
			</p>
		</div>

		<!-- What's always free -->
		<section class="mb-14">
			<h2 class="mb-1 font-[Newsreader,Georgia,serif] text-[1.35rem] font-normal italic text-black/88">What will always be free</h2>
			<p class="mb-6 text-[0.8rem] text-black/35">Not "free tier" free. Just free.</p>

			<div class="grid gap-3">
				<div class="promise-card">
					<div class="promise-icon" style="background:rgba(59,130,246,0.08);">
						<svg width="18" height="18" viewBox="0 0 20 20" fill="none">
							<path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8Z" stroke="#3b82f6" stroke-width="1.5" />
							<path d="M7 10l2 2 4-4" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</div>
					<div>
						<h3 class="promise-title">The full editor</h3>
						<p class="promise-body">Branches, annotations, the AI assistant — everything. We don't believe in crippling the core product to push upgrades.</p>
					</div>
				</div>

				<div class="promise-card">
					<div class="promise-icon" style="background:rgba(59,130,246,0.08);">
						<svg width="18" height="18" viewBox="0 0 20 20" fill="none">
							<rect x="3" y="3" width="14" height="14" rx="3" stroke="#3b82f6" stroke-width="1.5" />
							<path d="M7 10h6M10 7v6" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" />
						</svg>
					</div>
					<div>
						<h3 class="promise-title">Local-first, offline, and private</h3>
						<p class="promise-body">Your writing lives on your machine. Not on our servers. Not in the cloud unless you choose it. No internet required to open, edit, or save.</p>
					</div>
				</div>

				<div class="promise-card">
					<div class="promise-icon" style="background:rgba(59,130,246,0.08);">
						<svg width="18" height="18" viewBox="0 0 20 20" fill="none">
							<path d="M4 4h12v9H4z" stroke="#3b82f6" stroke-width="1.5" stroke-linejoin="round" />
							<path d="M8 17h4M10 13v4" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" />
						</svg>
					</div>
					<div>
						<h3 class="promise-title">Your data is yours to leave with</h3>
						<p class="promise-body">Text export, anytime. We will never make it hard to leave. Switching costs are how bad software keeps users — we'd rather earn yours.</p>
					</div>
				</div>

				<div class="promise-card">
					<div class="promise-icon" style="background:rgba(59,130,246,0.08);">
						<svg width="18" height="18" viewBox="0 0 20 20" fill="none">
							<circle cx="10" cy="10" r="7.5" stroke="#3b82f6" stroke-width="1.5" />
							<path d="M10 6v4l2.5 2.5" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" />
						</svg>
					</div>
					<div>
						<h3 class="promise-title">No forced payments, ever</h3>
						<p class="promise-body">We will never put a gate between you and your own writing. If you never pay us, the app still works completely.</p>
					</div>
				</div>
			</div>
		</section>

		<!-- Divider -->
		<div class="my-12 border-t border-black/6"></div>

		<!-- Coming: Sync -->
		<section class="mb-14">
			<div class="mb-1 flex items-center gap-2">
				<h2 class="font-[Newsreader,Georgia,serif] text-[1.35rem] font-normal italic text-black/88">Optional cloud sync</h2>
				<span class="rounded-full bg-black/5 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-black/35">Coming later</span>
			</div>
			<p class="mb-6 text-[0.8rem] text-black/35">Not a tier. Just an add-on service, if you want it.</p>

			<div class="rounded-xl border border-black/6 bg-white/50 p-6 shadow-md inset-shadow-sm inset-shadow-white backdrop-blur-md">
				<p class="mb-4 text-[0.875rem] leading-relaxed text-black/60">
					The only reasonable way to fund an app like this — without ads, without selling your data, without VC pressure to monetize everything — is to offer an optional service on top of the free product. That's cloud sync.
				</p>
				<p class="mb-5 text-[0.875rem] leading-relaxed text-black/60">
					If you write across multiple devices and want them to stay in sync seamlessly, that will eventually be available as a paid add-on. It will be the same app — just with your documents following you everywhere.
				</p>

				<div class="mb-5 rounded-lg bg-black/3 px-4 py-3">
					<p class="m-0 text-[0.8rem] leading-relaxed text-black/50">
						<strong class="text-black/70">Price TBD.</strong> Probably around $20/month — but the more users Quillium has, the cheaper it can get. We'd rather have a small margin on a large number of happy users than squeeze individuals.
					</p>
				</div>

				<div class="grid gap-2.5 sm:grid-cols-2">
					<div class="flex items-start gap-2.5">
						<span class="mt-0.5 shrink-0 text-[#3b82f6]">
							<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
								<path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
						</span>
						<span class="text-[0.8rem] text-black/55">Seamless multi-device sync</span>
					</div>
					<div class="flex items-start gap-2.5">
						<span class="mt-0.5 shrink-0 text-[#3b82f6]">
							<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
								<path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
						</span>
						<span class="text-[0.8rem] text-black/55">Encrypted in transit and at rest</span>
					</div>
					<div class="flex items-start gap-2.5">
						<span class="mt-0.5 shrink-0 text-[#3b82f6]">
							<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
								<path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
						</span>
						<span class="text-[0.8rem] text-black/55">Cancel anytime — your local copy is unaffected</span>
					</div>
					<div class="flex items-start gap-2.5">
						<span class="mt-0.5 shrink-0 text-[#3b82f6]">
							<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
								<path d="M3 8l3.5 3.5L13 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
							</svg>
						</span>
						<span class="text-[0.8rem] text-black/55">Foundation for future collaboration features</span>
					</div>
				</div>
			</div>
		</section>

		<!-- Why section -->
		<section class="mb-14">
			<h2 class="mb-6 font-[Newsreader,Georgia,serif] text-[1.35rem] font-normal italic text-black/88">Why this model</h2>
			<div class="space-y-4 text-[0.875rem] leading-[1.8] text-black/55">
				<p>
					The writing tool market is full of apps that start free, build a following, then slowly lock features behind subscriptions until the free version is barely usable. We think that's a bad deal, and we refuse to do it.
				</p>
				<p>
					Local-first software solves a real problem: your writing doesn't disappear if we shut down, raise prices, or get acquired. The app works whether or not we exist. We think that's the only honest way to build a tool people trust with years of their work.
				</p>
				<p>
					The sync service is the only monetization option that doesn't compromise this. It's an additional service, not a tax on existing functionality. You can skip it entirely — or even roll your own sync if you're technically inclined (though fair warning: SQLite binary files and conflict resolution make that genuinely tricky).
				</p>
				<p class="text-black/40 text-[0.8rem]">
					Have a suggestion or think there's a better model? We'd genuinely like to hear it — <a href="mailto:thatxliner@gmail.com" class="text-[#3b82f6] no-underline hover:underline">email us</a>.
				</p>
			</div>
		</section>

		<!-- Custom build callout -->
		<section class="rounded-xl border border-black/6 bg-white/40 px-6 py-5 backdrop-blur-md">
			<p class="mb-1 text-[0.75rem] font-semibold uppercase tracking-[0.08em] text-black/30">Something else?</p>
			<p class="mb-0 text-[0.875rem] leading-relaxed text-black/55">
				If you're a studio, publisher, or just someone with very specific workflow needs, we're open to building a custom version of Quillium tuned exactly to how you work. <a href="mailto:thatxliner@gmail.com" class="text-[#3b82f6] no-underline hover:underline">Reach out</a> and we can talk.
			</p>
		</section>

	</div>
</main>

<Footer />

<style>
	.promise-card {
		display: flex;
		gap: 16px;
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.5);
		padding: 18px 20px;
		box-shadow: 0 2px 8px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.8);
		backdrop-filter: blur(8px);
	}
	.promise-icon {
		flex-shrink: 0;
		width: 36px;
		height: 36px;
		border-radius: 9px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.promise-title {
		font-size: 0.875rem;
		font-weight: 600;
		color: rgba(0,0,0,0.88);
		margin: 0 0 4px 0;
	}
	.promise-body {
		font-size: 0.8rem;
		color: rgba(0,0,0,0.5);
		line-height: 1.7;
		margin: 0;
	}
</style>

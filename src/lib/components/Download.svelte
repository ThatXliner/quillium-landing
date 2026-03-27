<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabase';
	import posthog from 'posthog-js';

	const REPO = 'ThatXliner/quillium-releases';

	type Platform = 'mac' | 'windows' | 'linux' | 'unknown';

	interface ReleaseAsset {
		name: string;
		url: string;
	}

	interface ReleaseData {
		version: string;
		assets: ReleaseAsset[];
	}

	let { release }: { release: ReleaseData } = $props();

	function findAsset(pattern: string): string {
		const match = release.assets.find((a) => a.url.includes(pattern));
		if (match) return match.url;
		return `https://github.com/${REPO}/releases/download/v${release.version}/${pattern}`;
	}

	const downloads = $derived({
		mac: {
			label: 'macOS',
			primary: { cta: 'Download for Mac', name: '.dmg', url: findAsset('_aarch64.dmg') },
			alt: [{ name: '.app.tar.gz', url: findAsset('_aarch64.app.tar.gz') }]
		},
		windows: {
			label: 'Windows',
			primary: { cta: 'Download for Windows', name: '.exe', url: findAsset('_x64-setup.exe') },
			alt: [{ name: '.msi', url: findAsset('_x64_en-US.msi') }]
		},
		linux: {
			label: 'Linux',
			primary: { cta: 'Download for Linux', name: '.deb', url: findAsset('_amd64.deb') },
			alt: [
				{ name: '.rpm', url: findAsset('.x86_64.rpm') },
				{ name: '.AppImage', url: findAsset('_amd64.AppImage') }
			]
		}
	});

	let detected: Platform = $state('unknown');
	let showAllPlatforms = $state(false);

	// Optional email signup
	let email = $state('');
	let hasAgreedToTerms = $state(false);
	let submitting = $state(false);
	let submitted = $state(false);
	let error = $state('');

	onMount(() => {
		const ua = navigator.userAgent.toLowerCase();
		if (ua.includes('mac')) detected = 'mac';
		else if (ua.includes('win')) detected = 'windows';
		else if (ua.includes('linux')) detected = 'linux';
	});

	function trackDownload(url: string) {
		posthog.capture('download_clicked', { url, version: release.version, platform: detected });
	}

	async function handleEmailSubmit(e: Event) {
		e.preventDefault();
		if (!hasAgreedToTerms || !email || submitting) return;

		submitting = true;
		error = '';

		posthog.capture('updates_signup_submitted', { email });

		try {
			const { error: dbError } = await supabase.from('waitlist').insert({ email });

			if (dbError) {
				if (dbError.code === '23505') {
					error = "You're already signed up!";
				} else {
					error = 'Something went wrong. Please try again.';
				}
				posthog.capture('updates_signup_failed', { email, error_code: dbError.code });
			} else {
				posthog.capture('updates_signup_succeeded');
				submitted = true;
			}
		} catch (err) {
			error = 'Something went wrong. Please try again.';
			posthog.captureException(err);
		}

		submitting = false;
	}

	const platformOrder: ('mac' | 'windows' | 'linux')[] = ['mac', 'windows', 'linux'];
</script>

<!-- ==================== DOWNLOAD ==================== -->
<section id="download" class="px-8 py-16 text-center">
	<div class="reveal mx-auto max-w-[36rem]">
		<h2
			class="mb-3 font-[Newsreader,Georgia,serif] text-[clamp(1.9rem,5vw,3rem)] font-normal tracking-[-0.01em] text-black/88"
		>
			Start writing sideways.
		</h2>
		<p class="mb-2 text-[0.95rem] leading-[1.7] text-black/50">
			Download Quillium and start writing. Free, offline, yours.
		</p>
		<!-- Beta warning -->
		<div
			class="mb-2 flex w-fit items-center justify-center gap-2.5 rounded-lg border border-amber-400/20 bg-amber-400/6 px-6 py-3"
		>
			<span
				class="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[0.6rem] font-bold tracking-[0.08em] text-amber-600 uppercase"
				>Public Beta</span
			>
			<p class="m-0 text-[0.8rem] text-black/55">
				v{release.version} &middot; Features may change. Not yet recommended for critical work.
			</p>
		</div>
		<p class="mb-8 text-[0.7rem] text-black/30">
			By downloading, you agree to our <a href="/terms" class="text-[#3b82f6] no-underline hover:underline">Terms of Service</a>.
		</p>

		<!-- Primary download button -->
		{#if detected !== 'unknown'}
			{@const platform = downloads[detected]}
			<a
				href={platform.primary.url}
				class="btn-primary mb-3 inline-flex items-center gap-2"
				onclick={() => trackDownload(platform.primary.url)}
			>
				<svg width="18" height="18" viewBox="0 0 18 18" fill="none" class="shrink-0">
					<path
						d="M9 2v10M9 12L5 8M9 12l4-4"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
					<path d="M3 14h12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
				</svg>
				{platform.primary.cta}
			</a>

			{#if platform.alt.length > 0}
				<p class="mb-1 text-[0.7rem] text-black/30">
					Also available:
					{#each platform.alt as alt, i}
						<a
							href={alt.url}
							class="text-[#3b82f6] no-underline hover:underline"
							onclick={() => trackDownload(alt.url)}>{alt.name}</a
						>{#if i < platform.alt.length - 1},{/if}
					{/each}
				</p>
			{/if}

			{#if detected === 'windows'}
				<p class="mb-4 text-[0.65rem] leading-relaxed text-amber-600/70">
					Windows may show a security warning because this app isn't code-signed yet. It's safe to
					proceed.
				</p>
			{/if}
		{/if}

		<!-- All platforms toggle -->
		<button
			class="mb-6 text-[0.75rem] text-black/35 underline decoration-black/15 underline-offset-2 transition-colors hover:text-black/55"
			class:mt-4={detected !== 'unknown'}
			onclick={() => (showAllPlatforms = !showAllPlatforms)}
		>
			{showAllPlatforms ? 'Hide' : 'Show'} all platforms
		</button>

		{#if showAllPlatforms}
			<div class="mb-8 grid grid-cols-1 gap-3 text-left min-[480px]:grid-cols-3">
				{#each platformOrder as key}
					{@const platform = downloads[key]}
					<div
						class="rounded-xl border border-black/6 bg-white/50 p-4 shadow-sm backdrop-blur-md {detected ===
						key
							? 'ring-2 ring-blue-400/20'
							: ''}"
					>
						<p
							class="m-0 mb-2 text-[0.7rem] font-semibold tracking-[0.08em] text-black/50 uppercase"
						>
							{platform.label}
							{#if detected === key}
								<span
									class="ml-1 text-[0.6rem] font-normal tracking-normal text-[#3b82f6] normal-case"
									>(detected)</span
								>
							{/if}
						</p>
						<a
							href={platform.primary.url}
							class="mb-1 block text-[0.8rem] font-medium text-[#3b82f6] no-underline hover:underline"
							onclick={() => trackDownload(platform.primary.url)}
						>
							{platform.primary.name}
						</a>
						{#each platform.alt as alt}
							<a
								href={alt.url}
								class="block text-[0.72rem] text-black/35 no-underline hover:text-black/55"
								onclick={() => trackDownload(alt.url)}
							>
								{alt.name}
							</a>
						{/each}
						{#if key === 'windows'}
							<p class="m-0 mt-2 text-[0.6rem] leading-relaxed text-amber-600/60">
								Not code-signed. Windows may show a warning.
							</p>
						{/if}
					</div>
				{/each}
			</div>
		{/if}

		<!-- Optional email signup -->
		<div class="mx-auto max-w-[28rem]">
			<p class="mb-1 text-[0.8rem] font-medium text-black/60">Want updates?</p>
			<p class="mb-4 text-[0.75rem] leading-relaxed text-black/35">
				Optionally leave your email. We'll only send release notes and major updates.
			</p>

			{#if !submitted}
				<form onsubmit={handleEmailSubmit} class="mb-3 grid gap-3">
					<div class="grid grid-cols-[1fr_auto] gap-3 max-[480px]:grid-cols-1">
						<input
							type="email"
							placeholder="your@email.com"
							bind:value={email}
							required
							class="rounded-lg border border-black/10 bg-white px-3.5 py-2.5 font-[Inter,sans-serif] text-sm text-black/88 transition-[border-color] duration-200 placeholder:text-black/28 focus:border-[#3b82f6] focus:ring-[3px] focus:ring-[rgba(59,130,246,0.1)] focus:outline-none"
							aria-label="Email address"
						/>
						<button
							type="submit"
							class="btn-primary"
							disabled={!hasAgreedToTerms || !email || submitting}
						>
							{submitting ? 'Signing up…' : 'Notify me'}
						</button>
					</div>
					<label
						class="flex items-start gap-2.5 text-left font-[Inter,sans-serif] text-[13px] leading-normal text-black/50"
					>
						<input
							type="checkbox"
							required
							bind:checked={hasAgreedToTerms}
							class="mt-0.5 accent-[#3b82f6]"
							aria-label="I agree to receive updates"
						/>
						<span>I agree to receive email updates. No spam, unsubscribe anytime.</span>
					</label>
				</form>
				{#if error}
					<p class="m-0 font-[Inter,sans-serif] text-[12.5px] text-[#ef4444]">{error}</p>
				{/if}
			{:else}
				<div
					class="rounded-xl border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.08)] px-6 py-4.5"
				>
					<p class="m-0 font-[Newsreader,Georgia,serif] text-base text-[#15803d] italic">
						You're signed up. We'll email you when something big ships.
					</p>
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
	.btn-primary:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}
</style>

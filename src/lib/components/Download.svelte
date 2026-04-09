<script lang="ts">
	import { onMount } from 'svelte';
	import posthog from 'posthog-js';

	const REPO = 'ThatXliner/quillium-releases';

	type Platform = 'mac' | 'windows' | 'linux' | 'unknown';

	interface ReleaseAsset {
		name: string;
		url: string;
	}

	let { release }: { release: { assets: ReleaseAsset[] } } = $props();

	function findAsset(pattern: string): string {
		const match = release.assets.find((a) => a.url.includes(pattern));
		if (match) return match.url;
		return `https://github.com/${REPO}/releases/latest`;
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
	onMount(() => {
		const ua = navigator.userAgent.toLowerCase();
		if (ua.includes('mac')) detected = 'mac';
		else if (ua.includes('win')) detected = 'windows';
		else if (ua.includes('linux')) detected = 'linux';
	});

	function trackDownload(url: string) {
		posthog.capture('download_clicked', { url, platform: detected });
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
		<p class="mb-8 text-[0.95rem] leading-[1.7] text-black/60">
			Download Quillium and start writing. Free, offline, yours.
		</p>

		<!-- Primary download button -->
		{#if detected !== 'unknown'}
			{@const platform = downloads[detected]}
			<a
				href={platform.primary.url}
				class="btn-primary mb-4 inline-flex items-center gap-2"
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

			{#if detected === 'windows'}
				<p class="mb-3 text-[0.65rem] leading-relaxed text-amber-600/70">
					Windows may show a security warning because this app isn't code-signed yet. It's safe to
					proceed.
				</p>
			{/if}
		{/if}

		<p class="mb-4 text-[0.7rem] text-black/50">
			By downloading, you agree to the
			<a href="/terms" class="text-black/55 underline underline-offset-2 hover:text-black/70"
				>Terms of Service</a
			>
		</p>

		<!-- Fine print -->
		<p class="mb-0 text-[0.7rem] leading-relaxed text-black/30">
			<span class="inline-flex items-center gap-1.5 align-middle">
				<span
					class="rounded-full border border-amber-400/30 bg-amber-400/10 px-1.5 py-px text-[0.55rem] font-bold tracking-[0.06em] text-amber-600 uppercase"
					>Beta</span
				>
			</span>
			&middot; Features may change. Back up your work.
		</p>

		<!-- All platforms toggle -->
		<button
			class="mt-6 text-[0.75rem] text-black/50 underline decoration-black/25 underline-offset-2 transition-colors hover:text-black/70"
			onclick={() => (showAllPlatforms = !showAllPlatforms)}
		>
			{showAllPlatforms ? 'Hide' : 'Show'} all platforms
		</button>

		{#if showAllPlatforms}
			<div class="mt-4 grid grid-cols-1 gap-3 text-left min-[480px]:grid-cols-3">
				{#each platformOrder as key}
					{@const platform = downloads[key]}
					<div
						class="rounded-xl border border-black/6 bg-white/50 p-4 shadow-sm backdrop-blur-md {detected ===
						key
							? 'ring-2 ring-blue-400/20'
							: ''}"
					>
						<p
							class="m-0 mb-2 text-[0.7rem] font-semibold tracking-[0.08em] text-black/60 uppercase"
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
								class="block text-[0.72rem] text-black/50 no-underline hover:text-black/70"
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
	</div>
</section>

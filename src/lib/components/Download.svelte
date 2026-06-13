<script lang="ts">
	import { onMount } from 'svelte';
	import posthog from 'posthog-js';

	const REPO = 'ThatXliner/quillium-releases';

	type Platform = 'mac' | 'windows' | 'linux' | 'unknown';

	interface ReleaseAsset {
		name: string;
		url: string;
	}

	let { release }: { release: { version: string | null; assets: ReleaseAsset[] } } = $props();

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
	let dropdownOpen = $state(false);
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
	<div class="mx-auto max-w-[36rem]">
		<h2
			class="mb-6 font-[Newsreader,Georgia,serif] text-[clamp(1.9rem,5vw,3rem)] font-normal tracking-[-0.01em] text-[color:var(--text-strong)]"
		>
			Start writing sideways.
		</h2>

		<!-- Primary download button -->
		{#if detected !== 'unknown'}
			{@const platform = downloads[detected]}
			<div class="mb-4">
				<a
					href={platform.primary.url}
					class="btn-primary inline-flex items-center gap-2 px-10 py-4 text-lg"
					onclick={() => trackDownload(platform.primary.url)}
				>
					{platform.primary.cta}
				</a>
			</div>

			{#if detected === 'windows'}
				<p class="mb-3 text-[0.65rem] leading-relaxed text-amber-600/70">
					Windows may show a security warning because this app isn't code-signed yet. It's safe to
					proceed.
				</p>
			{/if}
		{/if}

		<button
			class="mt-2 text-xs text-[color:var(--text-faint)] underline decoration-[color:var(--border-strong)] underline-offset-2 transition-colors hover:text-[color:var(--text-soft)] contrast-more:text-[color:var(--text-soft)] contrast-more:decoration-[color:var(--border-strong)] contrast-more:hover:text-[color:var(--text)]"
			onclick={() => (dropdownOpen = !dropdownOpen)}
		>
			{dropdownOpen ? 'Hide' : 'Show'} all platforms
		</button>

		{#if dropdownOpen}
			<div class="mt-4 grid grid-cols-1 gap-3 text-left min-[480px]:grid-cols-3">
				{#each platformOrder as key}
					{@const p = downloads[key]}
					<div
						class="rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 shadow-sm backdrop-blur-md {detected ===
						key
							? 'ring-2 ring-blue-400/20'
							: ''}"
					>
						<p
							class="m-0 mb-2 text-[0.7rem] font-semibold tracking-[0.08em] text-[color:var(--text-soft)] uppercase contrast-more:text-[color:var(--text-soft)]"
						>
							{p.label}
							{#if detected === key}
								<span
									class="ml-1 text-[0.6rem] font-normal tracking-normal text-[color:var(--accent-blue)] normal-case"
									>(detected)</span
								>
							{/if}
						</p>
						<a
							href={p.primary.url}
							class="mb-1 block text-[0.8rem] font-medium text-[color:var(--accent-blue)] no-underline hover:underline"
							onclick={() => trackDownload(p.primary.url)}
						>
							{p.primary.name}
						</a>
						{#each p.alt as alt}
							<a
								href={alt.url}
								class="block text-[0.72rem] text-[color:var(--text-faint)] no-underline hover:text-[color:var(--text-soft)] contrast-more:text-[color:var(--text-soft)] contrast-more:hover:text-[color:var(--text)]"
								onclick={() => trackDownload(alt.url)}
							>
								{alt.name}
							</a>
						{/each}
						<!-- {#if key === 'mac'}
							<a
								href="#"
								class="mt-2 block transition-opacity hover:opacity-80"
								onclick={() => trackDownload('mac-app-store')}
							>
								<img
									src="/download-on-mas-black.svg"
									alt="Download on the Mac App Store"
									width="120"
									height="30"
								/>
							</a>
						{/if} -->
						{#if key === 'windows'}
							<p class="m-0 mt-2 text-[0.6rem] leading-relaxed text-amber-600/60">
								Not code-signed. Windows may show a warning.
							</p>
						{/if}
					</div>
				{/each}
			</div>
		{/if}

		<p class="mt-8 text-xs text-[color:var(--text-faint)] contrast-more:text-[color:var(--text-soft)]">
			By downloading, you agree to the
			<a
				href="/terms"
				class="text-[color:var(--text-faint)] underline underline-offset-2 hover:text-[color:var(--text-soft)] contrast-more:text-[color:var(--text-soft)] contrast-more:hover:text-[color:var(--text)]"
				>Terms of Service</a
			>
		</p>
	</div>
</section>

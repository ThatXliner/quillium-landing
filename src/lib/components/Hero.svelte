<script lang="ts">
	import { onMount } from 'svelte';
	import posthog from 'posthog-js';

	const REPO = 'ThatXliner/quillium-releases';

	let { release }: { release: { assets: { name: string; url: string }[] } } = $props();

	function findAsset(pattern: string): string {
		const match = release.assets.find((a: { url: string }) => a.url.includes(pattern));
		if (match) return match.url;
		return `https://github.com/${REPO}/releases/latest`;
	}

	let detected = $state('unknown');
	let downloadUrl = $derived.by(() => {
		if (detected === 'mac') return findAsset('_aarch64.dmg');
		if (detected === 'windows') return findAsset('_x64-setup.exe');
		if (detected === 'linux') return findAsset('_amd64.deb');
		return '#download';
	});

	let displayedText = $state('');
	const fullText = 'Prose for ';
	const typingSpeed = 100;
	let showPros = $state(false);
	let showPeriod = $state(false);
	let showCursor = $state(true);
	let downloadCount = $state(0);

	onMount(() => {
		const ua = navigator.userAgent.toLowerCase();
		if (ua.includes('mac')) detected = 'mac';
		else if (ua.includes('win')) detected = 'windows';
		else if (ua.includes('linux')) detected = 'linux';
		let i = 0;
		const interval = setInterval(() => {
			if (i < fullText.length) {
				displayedText = fullText.slice(0, i + 1);
				i++;
			} else {
				showPros = true;
				clearInterval(interval);
				setTimeout(() => {
					showPeriod = true;
					setTimeout(() => {
						showCursor = false;
					}, 600);
				}, typingSpeed);
			}
		}, typingSpeed);

		fetch('/api/download-count')
			.then((res) => res.json())
			.then((data) => {
				downloadCount = data.count ?? 0;
			})
			.catch(() => {});

		return () => clearInterval(interval);
	});
</script>

<!-- ==================== HERO ==================== -->
<section
	class="flex min-h-screen flex-col items-center justify-center px-8 pt-32 pb-24 text-center"
>
	<div
		class="mb-4 flex h-[120px] w-[120px] items-center justify-center rounded-[32px] border-[1.5px] border-white/35 bg-radial-[at_40%_35%] from-[#eceef2] to-[#cdd1d9] transition-transform duration-400 hover:scale-105 hover:-rotate-2"
	>
		<img src="/logo.svg" alt="Quillium mark" width="96" height="96" />
	</div>

	<p class="reveal mb-4 text-[0.75rem] font-semibold tracking-[0.15em] text-black/35 uppercase">
		The Non-Linear Writing App
	</p>

	<h1
		class="reveal reveal-delay-1 mb-6 max-w-[700px] font-[Newsreader,Georgia,serif] text-[clamp(2.8rem,6vw,4.5rem)] leading-[1.15] font-normal tracking-[-0.03em] text-black/88"
	>
		{displayedText}{#if showPros}<span class="italic">Pros</span>{/if}{#if showPeriod}.{/if}<span
			class="typing-cursor"
			class:hidden={!showCursor}>|</span
		>
	</h1>

	<p class="reveal reveal-delay-2 mb-12 max-w-[520px] text-[1.1rem] leading-[1.7] text-black/50">
		For the novelist who writes the same chapter four different ways. For the essayist who doesn't
		know the thesis until page three. Quillium keeps every version, so nothing is ever lost.
	</p>

	{#if downloadCount > 0}
		<p class="mb-4 text-[0.85rem] font-medium text-black/40">
			{#if downloadCount < 50}
				Be one of the first to try it
			{:else}
				Join {downloadCount.toLocaleString()}+ writers
			{/if}
		</p>
	{/if}

	<div class="reveal reveal-delay-3 flex flex-col items-center gap-3">
		<div class="flex flex-wrap justify-center items-center gap-4">
			<a
				href={downloadUrl}
				class="btn-primary inline-flex items-center gap-2"
				onclick={() => posthog.capture('cta_clicked', { cta: 'download', location: 'hero' })}
			>
				Download Now
				<span class="rounded-full border border-white/25 bg-white/15 px-1.5 py-px text-[0.55rem] font-bold tracking-[0.06em] uppercase">Beta</span>
			</a>
			<a
				href="#features"
				class="inline-flex items-center gap-2 rounded-[10px] bg-white/50 px-6 py-3 text-[0.95rem] font-medium text-black/88 no-underline shadow-md inset-shadow-sm inset-shadow-white backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-50/30"
			>
				See how it works
			</a>
		</div>
		<p class="text-[0.7rem] text-black/30">
			By downloading, you agree to the <a href="/terms" class="text-black/40 underline underline-offset-2 hover:text-black/55">Terms of Service</a>
		</p>
	</div>

	<div
		class="reveal reveal-delay-4 mt-16 flex flex-col items-center gap-4 border-t border-black/4 pt-12 max-md:gap-3"
	>
		<a href="/blog/quillium-is-not-an-ai-app" class="text-[0.75rem] tracking-wide text-black/25 underline hover:text-black/40 transition-colors duration-300 m-0">
			No AI ghostwriting. No autocomplete. Just a better place to write.
		</a>
		<div class="flex gap-2">
			<span class="h-2 w-2 rounded-full bg-[#3b82f6]"></span>
			<span class="h-2 w-2 rounded-full bg-[#a855f7]"></span>
			<span class="h-2 w-2 rounded-full bg-[#22c55e]"></span>
			<span class="h-2 w-2 rounded-full bg-[#fcbc05]"></span>
		</div>
	</div>
</section>

<style>
	.typing-cursor {
		font-weight: 300;
		animation: blink 0.6s step-end infinite;
	}
	.typing-cursor.hidden {
		display: none;
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
</style>

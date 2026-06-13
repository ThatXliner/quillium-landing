<script lang="ts">
	import { onMount } from 'svelte';
	import posthog from 'posthog-js';

	const REPO = 'ThatXliner/quillium-releases';

	type Platform = 'mac' | 'windows' | 'linux' | 'unknown';

	interface ReleaseAsset {
		name: string;
		url: string;
	}

	let {
		release,
		location = 'download'
	}: {
		release: { version: string | null; assets: ReleaseAsset[] };
		/** where the click originated, for analytics */
		location?: string;
	} = $props();

	function findAsset(pattern: string): string {
		const match = release.assets.find((a) => a.url.includes(pattern));
		if (match) return match.url;
		return `https://github.com/${REPO}/releases/latest`;
	}

	const primary = $derived({
		mac: { cta: 'Download for Mac', url: findAsset('_aarch64.dmg') },
		windows: { cta: 'Download for Windows', url: findAsset('_x64-setup.exe') },
		linux: { cta: 'Download for Linux', url: findAsset('_amd64.deb') }
	});

	let detected: Platform = $state('unknown');
	onMount(() => {
		const ua = navigator.userAgent.toLowerCase();
		if (ua.includes('mac')) detected = 'mac';
		else if (ua.includes('win')) detected = 'windows';
		else if (ua.includes('linux')) detected = 'linux';
	});

	function trackDownload(url: string) {
		posthog.capture('download_clicked', { url, platform: detected, location });
	}
</script>

{#if detected !== 'unknown'}
	{@const p = primary[detected]}
	<a
		href={p.url}
		class="btn-primary inline-flex items-center gap-2 px-10 py-4 text-lg"
		onclick={() => trackDownload(p.url)}
	>
		{p.cta}
	</a>

	{#if detected === 'windows'}
		<p class="mt-3 text-[0.65rem] leading-relaxed text-amber-600/70">
			Windows may show a security warning because this app isn't code-signed yet. It's safe to
			proceed.
		</p>
	{/if}
{/if}

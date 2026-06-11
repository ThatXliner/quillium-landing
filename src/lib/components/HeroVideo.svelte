<script lang="ts">
	import { onMount } from 'svelte';
	import { Pen, Lock, ShieldCheck } from '@lucide/svelte';
	import posthog from 'posthog-js';
	import VideoEmbed from './VideoEmbed.svelte';

	let {
		release,
		videoId
	}: {
		release: { assets: { name: string; url: string }[] };
		videoId: string;
	} = $props();

	function findAsset(pattern: string): string {
		const match = release.assets.find((a: { url: string }) => a.url.includes(pattern));
		if (match) return match.url;
		return `https://github.com/ThatXliner/quillium-releases/releases/latest`;
	}

	let detected = $state('unknown');
	let downloadUrl = $derived.by(() => {
		if (detected === 'mac') return findAsset('_aarch64.dmg');
		if (detected === 'windows') return findAsset('_x64-setup.exe');
		if (detected === 'linux') return findAsset('_amd64.deb');
		return '#download';
	});

	onMount(() => {
		const ua = navigator.userAgent.toLowerCase();
		if (ua.includes('mac')) detected = 'mac';
		else if (ua.includes('win')) detected = 'windows';
		else if (ua.includes('linux')) detected = 'linux';
	});
</script>

<section class="hero-video-section">
	<div class="hero-video-inner">
		<div class="hero-copy">
			<div class="logo-tile">
				<img src="/logo.svg" alt="Quillium mark" width="56" height="56" />
			</div>
			<p class="eyebrow">The Non-Linear Writing App</p>
			<h1 class="headline" style="font-family: 'Newsreader', Georgia, serif;">
				Prose for <span class="italic">Pros</span>.
			</h1>
			<p class="subhead">
				Write a sentence three different ways, and decide which to pick later. Branch any phrase
				without losing a single word.
			</p>
		</div>

		<div class="hero-media">
			<VideoEmbed {videoId} location="hero-video" />
		</div>

		<div class="hero-actions">
			<a
				href={downloadUrl}
				class="btn-primary"
				onclick={() => posthog.capture('cta_clicked', { cta: 'download', location: 'hero-video' })}
				>Download Now</a
			>
			<div
				class="trust-row"
				style="border-image: linear-gradient(90deg, transparent, #3b82f6, #a855f7, #22c55e, #fcbc05, transparent) 1;"
			>
				<a href="/blog/quillium-is-not-an-ai-app" class="trust-link"
					><Pen size={14} strokeWidth={2} class="opacity-60" /> Write every word (No AI bs).</a
				>
				<a href="/blog/quillium-privacy" class="trust-link"
					><Lock size={14} strokeWidth={2} class="opacity-60" /> Fully private.</a
				>
				<a href="/blog/how-quillium-keeps-your-writing-safe" class="trust-link"
					><ShieldCheck size={14} strokeWidth={2} class="opacity-60" /> Safe and secure.</a
				>
			</div>
		</div>
	</div>
</section>

<style>
	.hero-video-section {
		width: 100%;
		background: #f5f4f1;
		padding: clamp(2.5rem, 6vw, 5rem) 1.25rem clamp(2rem, 4vw, 3.5rem);
	}
	.hero-video-inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: clamp(1.75rem, 3.5vw, 2.75rem);
		width: min(94vw, 980px);
		margin: 0 auto;
	}
	.hero-copy {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}
	.logo-tile {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 72px;
		height: 72px;
		margin-bottom: 1rem;
		border-radius: 22px;
		border: 1px solid rgba(255, 255, 255, 0.35);
		background: radial-gradient(at 40% 35%, #eceef2, #cdd1d9);
	}
	.eyebrow {
		margin: 0 0 0.75rem;
		font-size: 0.7rem;
		font-weight: 600;
		letter-spacing: 0.13em;
		text-transform: uppercase;
		color: rgba(0, 0, 0, 0.35);
	}
	.headline {
		margin: 0 0 1rem;
		font-size: clamp(2.2rem, 4.5vw, 3.4rem);
		line-height: 1.12;
		letter-spacing: -0.03em;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.88);
	}
	.headline .italic {
		font-style: italic;
	}
	.subhead {
		margin: 0;
		max-width: 600px;
		font-size: 1.1rem;
		line-height: 1.6;
		color: rgba(0, 0, 0, 0.5);
	}
	.hero-media {
		width: 100%;
	}
	.hero-actions {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
	}
	.trust-row {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.85rem;
		padding-top: 1rem;
		border-top: 2px solid;
	}
	.trust-link {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.9rem;
		color: rgba(0, 0, 0, 0.5);
		text-decoration: underline;
		text-underline-offset: 3px;
		transition: color 0.3s;
	}
	.trust-link:hover {
		color: rgba(0, 0, 0, 0.7);
	}
</style>

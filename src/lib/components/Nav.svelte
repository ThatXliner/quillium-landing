<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		const nav = document.getElementById('main-nav');
		let scrolled = false;
		window.addEventListener(
			'scroll',
			() => {
				const shouldBeScrolled = window.scrollY > 20;
				if (shouldBeScrolled !== scrolled) {
					scrolled = shouldBeScrolled;
					nav?.classList.toggle('scrolled', scrolled);
				}
			},
			{ passive: true }
		);
	});
</script>

<nav id="main-nav" class="nav-fixed">
	<div class="max-w-[72rem] mx-auto px-6 flex items-center justify-between">
		<a href="#" class="flex items-center gap-3 no-underline text-black/88">
			<img src="/logo.svg" alt="Quillium" width="32" height="32" class="rounded-lg" />
			<span class="font-semibold text-[0.95rem] tracking-[-0.01em]">Quillium</span>
		</a>
		<div class="flex items-center gap-8">
			<a href="#features" class="hidden md:inline text-[0.8rem] font-medium text-black/50 no-underline transition-colors duration-300 hover:text-black/88">Features</a>
			<a href="#manifesto" class="hidden md:inline text-[0.8rem] font-medium text-black/50 no-underline transition-colors duration-300 hover:text-black/88">Manifesto</a>
			<a href="#waitlist" class="hidden md:inline text-[0.8rem] font-medium text-black/50 no-underline transition-colors duration-300 hover:text-black/88">Waitlist</a>
			<span class="hidden md:inline text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-[#22c55e]/70">Public Beta</span>
		</div>
	</div>
</nav>

<style>
	:global(#main-nav.scrolled) {
		background: rgba(229, 231, 235, 0.75);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-bottom: 1px solid rgba(255, 255, 255, 0.3);
	}
	.nav-fixed {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		padding: 1rem 2rem;
		transition: all 0.3s;
	}
</style>

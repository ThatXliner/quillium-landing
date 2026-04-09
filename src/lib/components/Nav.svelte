<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	let menuOpen = $state(false);

	function closeMenu() {
		setTimeout(() => {
			menuOpen = false;
		}, 0);
	}

	function handleClickOutside(e: MouseEvent) {
		const nav = document.getElementById('main-nav');
		if (menuOpen && nav && !nav.contains(e.target as Node)) {
			menuOpen = false;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	});
</script>

<nav id="main-nav" class="nav-fixed">
	<div class="mx-auto flex max-w-[72rem] items-center justify-between px-6">
		<a href="/" class="flex items-center gap-3 text-black/88 no-underline">
			<img src="/logo.svg" alt="Quillium" width="32" height="32" class="rounded-lg" />
			<span class="text-[0.95rem] font-semibold tracking-[-0.01em]">Quillium</span>
		</a>

		<!-- Desktop links -->
		<div class="hidden items-center gap-8 md:flex">
			<a
				href="/#features"
				class="text-[0.8rem] font-medium text-black/60 no-underline transition-colors duration-300 hover:text-black/88"
				>Features</a
			>
			<a
				href="/#manifesto"
				class="text-[0.8rem] font-medium text-black/60 no-underline transition-colors duration-300 hover:text-black/88"
				>Manifesto</a
			>
			<a
				href="/#download"
				class="text-[0.8rem] font-medium text-black/60 no-underline transition-colors duration-300 hover:text-black/88"
				>Download</a
			>
			<a
				href="/blog"
				class="text-[0.8rem] font-medium text-black/60 no-underline transition-colors duration-300 hover:text-black/88"
				>Blog</a
			>
			<a
				href="/pricing"
				class="text-[0.8rem] font-medium text-black/60 no-underline transition-colors duration-300 hover:text-black/88"
				>Pricing</a
			>
			<a
				href="/#download"
				class="text-[0.6rem] font-bold tracking-[0.1em] text-[#22c55e]/70 uppercase no-underline hover:text-[#22c55e]"
				>Public Beta</a
			>
		</div>

		<!-- Mobile hamburger -->
		<button
			class="mobile-menu-btn flex items-center justify-center md:hidden"
			onclick={() => (menuOpen = !menuOpen)}
			aria-label="Toggle menu"
			aria-expanded={menuOpen}
		>
			<svg width="22" height="22" viewBox="0 0 22 22" fill="none">
				{#if menuOpen}
					<path
						d="M6 6l10 10M16 6L6 16"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
					/>
				{:else}
					<path
						d="M4 6h14M4 11h14M4 16h14"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
					/>
				{/if}
			</svg>
		</button>
	</div>

	<!-- Mobile dropdown -->
	{#if menuOpen}
		<div class="mobile-menu flex flex-col gap-1 md:hidden" transition:slide={{ duration: 250 }}>
			<a href="/#features" class="mobile-link" onclick={closeMenu}>Features</a>
			<a href="/#manifesto" class="mobile-link" onclick={closeMenu}>Manifesto</a>
			<a href="/#download" class="mobile-link" onclick={closeMenu}>Download</a>
			<a href="/blog" class="mobile-link" onclick={closeMenu}>Blog</a>
			<a href="/pricing" class="mobile-link" onclick={closeMenu}>Pricing</a>
			<a href="/#download" class="mobile-link mobile-link--beta" onclick={closeMenu}>Public Beta</a>
		</div>
	{/if}
</nav>

<style>
	.nav-fixed {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		padding: 1rem 2rem;
		background: rgba(245, 244, 241, 0.75);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-bottom: 1px solid rgba(255, 255, 255, 0.3);
	}
	.mobile-menu-btn {
		background: none;
		border: none;
		cursor: pointer;
		color: rgba(0, 0, 0, 0.7);
		padding: 4px;
	}
	.mobile-menu {
		padding: 12px 24px 16px;
		margin-top: 8px;
		background: rgba(245, 244, 241, 0.95);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-radius: 12px;
		margin-left: 16px;
		margin-right: 16px;
		border: 1px solid rgba(0, 0, 0, 0.06);
	}
	.mobile-link {
		display: block;
		padding: 8px 0;
		font-size: 0.85rem;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.6);
		text-decoration: none;
		transition: color 0.2s;
	}
	.mobile-link:hover {
		color: rgba(0, 0, 0, 0.88);
	}
	.mobile-link--beta {
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(34, 197, 94, 1);
	}
	.mobile-link--beta:hover {
		color: #22c55e;
	}
</style>

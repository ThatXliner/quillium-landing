<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { Menu, X } from '@lucide/svelte';

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
		<a href="/" class="flex items-center gap-3 text-[color:var(--text-strong)] no-underline">
			<img src="/logo.svg" alt="Quillium" width="32" height="32" class="rounded-lg" />
			<span class="text-[0.95rem] font-semibold tracking-[-0.01em]">Quillium</span>
		</a>

		<!-- Desktop links -->
		<div class="hidden items-center gap-8 md:flex">
			<a
				href="/#features"
				class="text-[0.8rem] font-medium text-[color:var(--text-faint)] no-underline transition-colors duration-300 hover:text-[color:var(--text-strong)]"
				>Features</a
			>
			<a
				href="/omni"
				class="text-[0.8rem] font-medium text-[color:var(--text-faint)] no-underline transition-colors duration-300 hover:text-[color:var(--text-strong)]"
				>Omni</a
			>
			<a
				href="/manifesto"
				class="text-[0.8rem] font-medium text-[color:var(--text-faint)] no-underline transition-colors duration-300 hover:text-[color:var(--text-strong)]"
				>Manifesto</a
			>
			<a
				href="/#download"
				class="text-[0.8rem] font-medium text-[color:var(--text-faint)] no-underline transition-colors duration-300 hover:text-[color:var(--text-strong)]"
				>Download</a
			>
			<a
				href="/blog"
				class="text-[0.8rem] font-medium text-[color:var(--text-faint)] no-underline transition-colors duration-300 hover:text-[color:var(--text-strong)]"
				>Blog</a
			>
			<a
				href="/pricing"
				class="text-[0.8rem] font-medium text-[color:var(--text-faint)] no-underline transition-colors duration-300 hover:text-[color:var(--text-strong)]"
				>Pricing</a
			>
			<a
				href="/#download"
				class="text-[0.6rem] font-semibold tracking-[0.1em] text-[#22c55e]/70 uppercase no-underline hover:text-[#22c55e]"
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
			{#if menuOpen}
				<X size={22} strokeWidth={1.5} />
			{:else}
				<Menu size={22} strokeWidth={1.5} />
			{/if}
		</button>
	</div>

	<!-- Mobile dropdown -->
	{#if menuOpen}
		<div class="mobile-menu flex flex-col gap-1 md:hidden" transition:slide={{ duration: 250 }}>
			<a href="/#features" class="mobile-link" onclick={closeMenu}>Features</a>
			<a href="/manifesto" class="mobile-link" onclick={closeMenu}>Manifesto</a>
			<a href="/#download" class="mobile-link" onclick={closeMenu}>Download</a>
			<a href="/blog" class="mobile-link" onclick={closeMenu}>Blog</a>
			<a href="/pricing" class="mobile-link" onclick={closeMenu}>Pricing</a>
			<a href="/#download" class="mobile-link mobile-link--beta" onclick={closeMenu}>Public Beta</a>
		</div>
	{/if}
</nav>

<style>
	/* The nav's glass tracks the global theme via tokens — light glass in light
	   mode, dark glass in dark mode — so it reads correctly over any hero in
	   either theme. (This replaces the old [data-nav-dark] override, now retired.) */
	.nav-fixed {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		padding: 1rem 2rem;
		background: var(--nav-glass);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-bottom: 1px solid var(--nav-glass-border);
		transition:
			background 300ms ease,
			border-color 300ms ease;
	}
	.mobile-menu-btn {
		background: none;
		border: none;
		cursor: pointer;
		color: var(--text-soft);
		padding: 4px;
	}
	.mobile-menu {
		padding: 12px 24px 16px;
		margin-top: 8px;
		background: var(--nav-glass-solid);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		border-radius: 12px;
		margin-left: 16px;
		margin-right: 16px;
		border: 1px solid var(--border);
	}
	.mobile-link {
		display: block;
		padding: 8px 0;
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--text-faint);
		text-decoration: none;
		transition: color 0.2s;
	}
	.mobile-link:hover {
		color: var(--text-strong);
	}
	.mobile-link--beta {
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: rgba(34, 197, 94, 0.7);
	}
	.mobile-link--beta:hover {
		color: var(--accent-green);
	}
	@media (prefers-contrast: more) {
		.mobile-menu-btn {
			color: var(--text);
		}
		.mobile-link {
			color: var(--text-soft);
		}
		.mobile-link--beta {
			color: rgba(34, 197, 94, 1);
		}
	}
</style>

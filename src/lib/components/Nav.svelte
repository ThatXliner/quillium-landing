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
	<div class="nav-inner">
		<a href="#" class="nav-logo">
			<img src="/logo.svg" alt="Quillium" width="32" height="32" />
			<span class="logo-name">Quillium</span>
		</a>
		<div class="nav-right">
			<a href="#features" class="nav-link">Features</a>
			<a href="#manifesto" class="nav-link">Manifesto</a>
			<a href="#waitlist" class="nav-link">Waitlist</a>
			<span class="nav-badge">Public Beta</span>
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
	.nav-inner {
		max-width: 72rem;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.nav-logo {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		text-decoration: none;
		color: rgba(0, 0, 0, 0.88);
	}
	.nav-logo img {
		width: 32px;
		height: 32px;
		border-radius: 8px;
	}
	.logo-name {
		font-weight: 600;
		font-size: 0.95rem;
		letter-spacing: -0.01em;
	}
	.nav-right {
		display: flex;
		align-items: center;
		gap: 2rem;
	}
	.nav-link {
		font-size: 0.8rem;
		font-weight: 500;
		color: rgba(0, 0, 0, 0.5);
		text-decoration: none;
		transition: color 300ms;
		display: none;
	}
	.nav-link:hover {
		color: rgba(0, 0, 0, 0.88);
	}
	@media (min-width: 768px) {
		.nav-link {
			display: inline;
		}
	}
	.nav-badge {
		font-size: 0.65rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: #22c55e;
		background: rgba(34, 197, 94, 0.08);
		padding: 0.3rem 0.75rem;
		border-radius: 100px;
		border: 1px solid rgba(34, 197, 94, 0.15);
	}
	@media (max-width: 768px) {
		.nav-badge {
			display: none;
		}
	}
</style>

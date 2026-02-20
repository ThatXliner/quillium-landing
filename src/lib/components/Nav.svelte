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
		<div class="logo-group">
			<svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
				<path
					d="M20.5 3C20.5 3 16 5.5 12 10.5C9 14.5 7.5 19 7.5 19L10 16.5C10 16.5 12 20 9 22C9 22 14 21.5 17 17.5C17 17.5 18.5 15.5 18 13C18 13 22 8.5 22.5 4.5L20.5 3Z"
					fill="#3b82f6"
					opacity="0.15"
				/>
				<path
					d="M21 3.5C21 3.5 16.5 6 12.5 11C9.5 15 8 19.5 8 19.5"
					stroke="#3b82f6"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M8 19.5L10.5 17"
					stroke="#3b82f6"
					stroke-width="1.5"
					stroke-linecap="round"
				/>
				<path
					d="M10.5 17C10.5 17 12.5 20.5 9.5 22.5"
					stroke="#2563eb"
					stroke-width="1.3"
					stroke-linecap="round"
				/>
				<path d="M8 19.5C8 19.5 6.5 20.5 5.5 22C5.5 22 7 21 8 19.5Z" fill="#3b82f6" opacity="0.4" />
			</svg>
			<span class="logo-name">Quillium</span>
			<span class="tagline-pill">Next Generation Prose</span>
		</div>
		<div class="nav-right">
			<a href="#features" class="nav-link">Features</a>
			<a href="#manifesto" class="nav-link">Manifesto</a>
			<a href="#waitlist" class="btn-primary">Join Waitlist</a>
		</div>
	</div>
</nav>

<style>
	/* ── Nav ── */
	:global(#main-nav.scrolled) {
		background: rgba(250, 249, 247, 0.82);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border-bottom: 1px solid rgba(220, 210, 195, 0.4);
		box-shadow: 0 1px 20px rgba(44, 42, 39, 0.06);
	}
	.nav-fixed {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 50;
		padding: 16px 0;
		transition: all 0.3s;
	}
	.nav-inner {
		max-width: 72rem;
		margin: 0 auto;
		padding: 0 24px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.logo-group {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.logo-name {
		font-family: 'Lora', Georgia, serif;
		font-weight: 600;
		font-size: 19px;
		color: #2c2a27;
		letter-spacing: -0.01em;
	}
	.tagline-pill {
		background: rgba(59, 130, 246, 0.08);
		border: 1px solid rgba(59, 130, 246, 0.2);
		color: #2563eb;
		border-radius: 9999px;
		padding: 3px 12px;
		font-size: 12px;
		font-weight: 500;
		letter-spacing: 0.025em;
		display: none;
	}
	@media (min-width: 640px) {
		.tagline-pill {
			display: inline-block;
		}
	}
	.nav-right {
		display: flex;
		align-items: center;
		gap: 24px;
	}
	.nav-link {
		color: #5a554f;
		font-size: 14px;
		font-weight: 500;
		text-decoration: none;
		transition: color 0.2s;
		display: none;
	}
	.nav-link:hover {
		color: #2c2a27;
	}
	@media (min-width: 768px) {
		.nav-link {
			display: inline;
		}
	}
</style>

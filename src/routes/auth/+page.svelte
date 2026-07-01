<script lang="ts">
	import { goto } from '$app/navigation';
	import Footer from '$lib/components/Footer.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import { createSupabaseBrowserClient } from '$lib/auth/supabaseBrowser';
	import { AlertCircle, CheckCircle2, Download, KeyRound } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let { data } = $props();

	type AuthState = 'confirmed' | 'error' | 'password-updated' | 'ready' | 'signed-in' | 'success';

	function stateFromStatus(status: string): AuthState {
		if (status === 'error') return 'error';
		if (status === 'confirmed') return 'confirmed';
		if (status === 'password-updated') return 'password-updated';
		if (status === 'signed-in' || status === 'success') return 'signed-in';
		return 'ready';
	}

	function getInitialAuthData() {
		return {
			status: data.status,
			message: data.message,
			type: data.type
		};
	}

	const initialAuthData = getInitialAuthData();

	let authState: AuthState = $state(stateFromStatus(initialAuthData.status));
	let detail = $state(initialAuthData.message);
	let processing = $state(true);

	const title = $derived.by(() => {
		if (authState === 'error') return 'That link could not be used';
		if (authState === 'confirmed') return 'Email confirmed';
		if (authState === 'password-updated') return 'Password updated';
		if (authState === 'signed-in') return 'You are signed in';
		if (authState === 'success') return 'Done';
		return 'Quillium auth';
	});

	const body = $derived.by(() => {
		if (authState === 'error') {
			return detail || 'The link may have expired or already been used.';
		}

		if (authState === 'confirmed') {
			return 'Your email is confirmed. You can return to Quillium and sign in.';
		}

		if (authState === 'password-updated') {
			return 'Your password has been updated. You can return to Quillium and sign in.';
		}

		if (authState === 'signed-in') {
			return 'You can return to Quillium and continue from the app.';
		}

		return 'This page handles Quillium account links from Supabase.';
	});

	onMount(async () => {
		const params = new URLSearchParams(window.location.search);
		const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
		const errorDescription =
			params.get('error_description') ||
			params.get('error') ||
			hashParams.get('error_description') ||
			hashParams.get('error');

		if (errorDescription) {
			authState = 'error';
			detail = errorDescription;
			processing = false;
			return;
		}

		const supabase = createSupabaseBrowserClient();
		const { data: sessionData, error } = await supabase.auth.getSession();

		if (error) {
			authState = 'error';
			detail = error.message;
			processing = false;
			return;
		}

		const authType = params.get('type') || hashParams.get('type') || initialAuthData.type;
		if (sessionData.session && authType === 'recovery') {
			await goto('/auth/reset-password');
			return;
		}

		if (sessionData.session && authState === 'ready') {
			authState = 'confirmed';
		}

		processing = false;
	});
</script>

<svelte:head>
	<title>{title} · Quillium</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<Nav />

<main class="min-h-screen px-6 pt-32 pb-20">
	<section
		class="mx-auto max-w-2xl border border-[color:var(--border)] bg-[color:var(--surface)] px-7 py-10 shadow-[0_24px_80px_rgba(var(--shadow-color),0.08)] sm:px-10"
	>
		<div
			class="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--surface-2)]"
		>
			{#if authState === 'error'}
				<AlertCircle size={24} strokeWidth={1.8} color="var(--accent-red)" />
			{:else}
				<CheckCircle2 size={24} strokeWidth={1.8} color="var(--accent-green)" />
			{/if}
		</div>

		<p class="section-eyebrow">Account link</p>
		<h1
			class="mt-3 font-[Newsreader,Georgia,serif] text-[clamp(2.4rem,6vw,3.8rem)] leading-[1.05] font-normal text-[color:var(--text-strong)]"
		>
			{title}
		</h1>
		<p class="mt-5 max-w-xl text-[0.98rem] leading-8 text-[color:var(--text-soft)]">
			{processing ? 'Checking your link...' : body}
		</p>

		<div class="mt-8 flex flex-wrap gap-3">
			{#if authState !== 'error'}
				<a href="/#download" class="btn-primary inline-flex items-center gap-2">
					<Download size={18} strokeWidth={1.8} />
					Download Quillium
				</a>
			{/if}
			<a
				href="/auth/reset-password"
				class="inline-flex items-center gap-2 rounded-[10px] border border-[color:var(--border)] bg-[color:var(--surface-2)] px-5 py-3 text-[0.95rem] font-medium text-[color:var(--text)] no-underline transition-all duration-200 hover:-translate-y-0.5 hover:text-[color:var(--text-strong)]"
			>
				<KeyRound size={18} strokeWidth={1.8} />
				Reset password
			</a>
			<a
				href="/"
				class="inline-flex items-center rounded-[10px] px-5 py-3 text-[0.95rem] font-medium text-[color:var(--text-soft)] no-underline transition-colors duration-200 hover:text-[color:var(--text-strong)]"
			>
				Home
			</a>
		</div>
	</section>
</main>

<Footer />

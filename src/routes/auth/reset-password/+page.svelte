<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolveAuthUrlSession } from '$lib/auth/authUrl';
	import { createSupabaseBrowserClient } from '$lib/auth/supabaseBrowser';
	import Footer from '$lib/components/Footer.svelte';
	import Nav from '$lib/components/Nav.svelte';
	import { AlertCircle, CheckCircle2, KeyRound } from '@lucide/svelte';
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { onMount } from 'svelte';

	let supabase: SupabaseClient | undefined;
	let ready = $state(false);
	let canReset = $state(false);
	let saving = $state(false);
	let password = $state('');
	let confirmPassword = $state('');
	let errorMessage = $state('');

	onMount(async () => {
		supabase = createSupabaseBrowserClient();
		const authResult = await resolveAuthUrlSession(supabase);

		if (authResult.error) {
			errorMessage = authResult.error.message;
		} else {
			canReset = !!authResult.session;
			if (!authResult.session) {
				errorMessage = 'This reset link is expired or invalid. Request a new password reset link.';
			}
		}

		ready = true;
	});

	async function updatePassword() {
		if (!supabase || saving) return;

		errorMessage = '';

		if (password.length < 8) {
			errorMessage = 'Use at least 8 characters.';
			return;
		}

		if (password !== confirmPassword) {
			errorMessage = 'The passwords do not match.';
			return;
		}

		saving = true;
		const { error } = await supabase.auth.updateUser({ password });
		saving = false;

		if (error) {
			errorMessage = error.message;
			return;
		}

		await supabase.auth.signOut();
		await goto('/auth?status=password-updated');
	}
</script>

<svelte:head>
	<title>Reset Password · Quillium</title>
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
			{#if errorMessage && ready}
				<AlertCircle size={24} strokeWidth={1.8} color="var(--accent-red)" />
			{:else}
				<KeyRound size={24} strokeWidth={1.8} color="var(--accent-blue)" />
			{/if}
		</div>

		<p class="section-eyebrow">Account security</p>
		<h1
			class="mt-3 font-[Newsreader,Georgia,serif] text-[clamp(2.4rem,6vw,3.8rem)] leading-[1.05] font-normal text-[color:var(--text-strong)]"
		>
			Reset your password
		</h1>
		<p class="mt-5 max-w-xl text-[0.98rem] leading-8 text-[color:var(--text-soft)]">
			{#if !ready}
				Checking your reset link...
			{:else if canReset}
				Choose a new password for your Quillium account.
			{:else}
				{errorMessage}
			{/if}
		</p>

		{#if canReset}
			<form
				class="mt-8 grid gap-4"
				onsubmit={(event) => {
					event.preventDefault();
					updatePassword();
				}}
			>
				<label class="grid gap-2 text-[0.85rem] font-medium text-[color:var(--text)]">
					New password
					<input
						bind:value={password}
						type="password"
						autocomplete="new-password"
						class="rounded-[10px] border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-[1rem] text-[color:var(--text-strong)] transition-colors outline-none focus:border-[color:var(--accent-blue)]"
					/>
				</label>
				<label class="grid gap-2 text-[0.85rem] font-medium text-[color:var(--text)]">
					Confirm password
					<input
						bind:value={confirmPassword}
						type="password"
						autocomplete="new-password"
						class="rounded-[10px] border border-[color:var(--border)] bg-[color:var(--surface-2)] px-4 py-3 text-[1rem] text-[color:var(--text-strong)] transition-colors outline-none focus:border-[color:var(--accent-blue)]"
					/>
				</label>

				{#if errorMessage}
					<p class="text-[0.9rem] leading-7 text-[color:var(--accent-red)]">{errorMessage}</p>
				{/if}

				<div class="mt-2 flex flex-wrap gap-3">
					<button
						type="submit"
						class="btn-primary inline-flex items-center gap-2"
						disabled={saving}
					>
						<CheckCircle2 size={18} strokeWidth={1.8} />
						{saving ? 'Saving...' : 'Save password'}
					</button>
					<a
						href="/auth"
						class="inline-flex items-center rounded-[10px] px-5 py-3 text-[0.95rem] font-medium text-[color:var(--text-soft)] no-underline transition-colors duration-200 hover:text-[color:var(--text-strong)]"
					>
						Cancel
					</a>
				</div>
			</form>
		{:else if ready}
			<div class="mt-8 flex flex-wrap gap-3">
				<a href="/support" class="btn-primary">Contact support</a>
				<a
					href="/"
					class="inline-flex items-center rounded-[10px] px-5 py-3 text-[0.95rem] font-medium text-[color:var(--text-soft)] no-underline transition-colors duration-200 hover:text-[color:var(--text-strong)]"
				>
					Home
				</a>
			</div>
		{/if}
	</section>
</main>

<Footer />

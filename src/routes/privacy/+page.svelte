<svelte:head>
	<title>Privacy Policy – Quillium</title>
	<meta name="description" content="Quillium's privacy policy — what data we collect, how we use it, and your rights." />
	<link rel="canonical" href="https://quillium.bryanhu.com/privacy" />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://quillium.bryanhu.com/privacy" />
	<meta property="og:title" content="Privacy Policy – Quillium" />
	<meta property="og:description" content="Quillium's privacy policy — what data we collect, how we use it, and your rights." />
	<meta property="og:site_name" content="Quillium" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content="Privacy Policy – Quillium" />
	<meta name="twitter:description" content="Quillium's privacy policy — what data we collect, how we use it, and your rights." />

	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Newsreader:ital,wght@0,400;0,500;1,400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let activeTab: 'plain' | 'legal' = $state('plain');
</script>

<Nav />

<main class="min-h-screen px-6 pt-32 pb-20">
	<div class="mx-auto max-w-[720px]">
		<header class="mb-12">
			<p class="section-eyebrow">Legal</p>
			<h1 class="mb-2 font-[Newsreader,Georgia,serif] text-[clamp(1.75rem,4vw,2.5rem)] font-normal leading-[1.15] tracking-[-0.02em] text-black/88 italic">
				Privacy Policy
			</h1>
			<p class="mb-8 text-[0.8rem] text-black/28">Last updated: March 23, 2026 · Quillium Beta</p>

			<div class="inline-flex gap-0.5 rounded-full bg-white/50 p-1 shadow-sm backdrop-blur-md">
				<button
					role="tab"
					aria-selected={activeTab === 'plain'}
					class="tab-btn"
					class:active={activeTab === 'plain'}
					onclick={() => (activeTab = 'plain')}
				>
					Plain English
				</button>
				<button
					role="tab"
					aria-selected={activeTab === 'legal'}
					class="tab-btn"
					class:active={activeTab === 'legal'}
					onclick={() => (activeTab = 'legal')}
				>
					Full Legal
				</button>
			</div>
		</header>

		{#if activeTab === 'plain'}
			<div role="tabpanel">
				<div class="mb-8 flex items-start gap-3 rounded-xl border border-[#3b82f6]/15 bg-[#3b82f6]/5 px-5 py-4">
					<span class="shrink-0 rounded bg-[#3b82f6]/10 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[#3b82f6]">TL;DR</span>
					<p class="m-0 text-[0.875rem] leading-relaxed text-black/88">We only collect anonymous usage analytics. We don't know who you are, and we never sell your data.</p>
				</div>

				<div class="grid gap-3">
					<div class="flex gap-4 rounded-xl bg-white/50 p-5 shadow-md inset-shadow-sm inset-shadow-white backdrop-blur-md">
						<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#3b82f6]/8">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
								<circle cx="10" cy="10" r="8" stroke="#3b82f6" stroke-width="1.5" />
								<path d="M10 6v4l3 2" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" />
							</svg>
						</div>
						<div>
							<h3 class="mb-1 text-[0.875rem] font-semibold text-black/88">What we collect</h3>
							<p class="m-0 text-[0.8rem] leading-relaxed text-black/50">Anonymous usage analytics only — things like which features you use, session length, and device type. We use PostHog for this. <strong class="text-black/88">No names, emails, or login info.</strong></p>
						</div>
					</div>

					<div class="flex gap-4 rounded-xl bg-white/50 p-5 shadow-md inset-shadow-sm inset-shadow-white backdrop-blur-md">
						<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#3b82f6]/8">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
								<path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z" stroke="#3b82f6" stroke-width="1.5" stroke-linejoin="round" />
							</svg>
						</div>
						<div>
							<h3 class="mb-1 text-[0.875rem] font-semibold text-black/88">Why we collect it</h3>
							<p class="m-0 text-[0.8rem] leading-relaxed text-black/50">Analytics help us understand usage, fix bugs, and improve the app. Email is used only to send you beta access, updates, and respond to feedback. No ads or profiling.</p>
						</div>
					</div>

					<div class="flex gap-4 rounded-xl bg-white/50 p-5 shadow-md inset-shadow-sm inset-shadow-white backdrop-blur-md">
						<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#3b82f6]/8">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
								<rect x="3" y="8" width="14" height="10" rx="2" stroke="#3b82f6" stroke-width="1.5" />
								<path d="M7 8V6a3 3 0 016 0v2" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" />
							</svg>
						</div>
						<div>
							<h3 class="mb-1 text-[0.875rem] font-semibold text-black/88">Who can see it</h3>
							<p class="m-0 text-[0.8rem] leading-relaxed text-black/50">Only us, via PostHog. The data is anonymized and cannot be linked back to you. We don't sell or share it with third parties for their own use.</p>
						</div>
					</div>

					<div class="flex gap-4 rounded-xl bg-white/50 p-5 shadow-md inset-shadow-sm inset-shadow-white backdrop-blur-md">
						<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#3b82f6]/8">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
								<path d="M10 17C13.866 17 17 13.866 17 10C17 6.134 13.866 3 10 3C6.134 3 3 6.134 3 10C3 13.866 6.134 17 10 17Z" stroke="#3b82f6" stroke-width="1.5" />
								<path d="M10 7v3l2 2" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" />
							</svg>
						</div>
						<div>
							<h3 class="mb-1 text-[0.875rem] font-semibold text-black/88">Your rights</h3>
							<p class="m-0 text-[0.8rem] leading-relaxed text-black/50">Since we don't collect personal data, there's no profile to delete. You can opt out of analytics at any time using the <strong class="text-black/88">Cookie Settings</strong> link in the footer. California residents have additional rights under the CCPA.</p>
						</div>
					</div>

					<div class="flex gap-4 rounded-xl bg-white/50 p-5 shadow-md inset-shadow-sm inset-shadow-white backdrop-blur-md">
						<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#3b82f6]/8">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
								<path d="M3 5h14M3 10h14M3 15h8" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" />
							</svg>
						</div>
						<div>
							<h3 class="mb-1 text-[0.875rem] font-semibold text-black/88">Cookies</h3>
							<p class="m-0 text-[0.8rem] leading-relaxed text-black/50">PostHog may set a cookie to distinguish sessions. It contains no personal info. No marketing or tracking cookies are used.</p>
						</div>
					</div>

					<div class="flex gap-4 rounded-xl bg-white/50 p-5 shadow-md inset-shadow-sm inset-shadow-white backdrop-blur-md">
						<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#3b82f6]/8">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
								<path d="M16 4H4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2z" stroke="#3b82f6" stroke-width="1.5" />
								<path d="M8 10h4M10 8v4" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" />
							</svg>
						</div>
						<div>
							<h3 class="mb-1 text-[0.875rem] font-semibold text-black/88">Questions?</h3>
							<p class="m-0 text-[0.8rem] leading-relaxed text-black/50">Email us at <a href="mailto:thatxliner@gmail.com" class="text-[#3b82f6] no-underline hover:underline">thatxliner@gmail.com</a> — we're a small team and we'll respond personally.</p>
						</div>
					</div>
				</div>

				<p class="mt-8 text-center text-[0.8rem] text-black/28">
					Want the full legal text?
					<button class="inline-tab-switch" onclick={() => (activeTab = 'legal')}>Switch to Full Legal view</button>
				</p>
			</div>
		{:else}
			<div class="legal-content" role="tabpanel">
				<section>
					<h2>1. Introduction</h2>
					<p>Quillium ("we," "us," or "our") operates quillium.bryanhu.com (the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use the beta version of the Service. Please read this policy carefully. By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.</p>
					<p>This policy is designed to comply with applicable data protection laws, including the California Consumer Privacy Act (CCPA) for California residents.</p>
				</section>

				<section>
					<h2>2. Information We Collect</h2>
					<h3>2.1 Analytics Data (Collected Automatically)</h3>
					<p>We collect anonymous, aggregated usage analytics through PostHog, including:</p>
					<ul>
						<li>Feature interactions and click events</li>
						<li>Session duration and frequency</li>
						<li>Device type, operating system, and browser type</li>
						<li>General geographic region (country/region level only, not precise location)</li>
						<li>Referral source and page navigation paths</li>
					</ul>
					<p>This data is collected in a manner that does not allow us to identify you personally. No IP addresses are stored in identifiable form beyond what PostHog uses for session deduplication (which is anonymized).</p>

					<h3>2.2 Email for Beta Signups</h3>
					<p>When you join the beta, we collect your email address. We use it solely to:</p>
					<ul>
						<li>Send you the app link and access instructions</li>
						<li>Notify you of beta updates and releases</li>
						<li>Respond to feedback or support requests</li>
					</ul>
					<p>We do not sell your email or use it for marketing beyond beta-related communications. You can unsubscribe from non-critical emails at any time.</p>

					<h3>2.3 Information We Do Not Collect</h3>
					<p>At this beta stage, we do not collect:</p>
					<ul>
						<li>Account credentials or social login data</li>
						<li>Payment or financial information</li>
						<li>User-generated content from within the editor</li>
						<li>Precise geolocation data</li>
					</ul>
				</section>

				<section>
					<h2>3. How We Use Your Information</h2>
					<p>We use the analytics data we collect solely to:</p>
					<ul>
						<li>Understand how users interact with the Service</li>
						<li>Identify and fix bugs and performance issues</li>
						<li>Improve and prioritize product features</li>
						<li>Measure the general reach of the Service</li>
					</ul>
					<p>We use beta signup emails to send you access instructions, beta updates, release notes, and respond to your feedback. We do not use your email for marketing unrelated to the beta.</p>
					<p>We do not use any data for targeted advertising, behavioral profiling, or any purpose unrelated to improving the Service.</p>
				</section>

				<section>
					<h2>4. Disclosure of Information</h2>
					<p>We do not sell, trade, rent, or otherwise transfer your information to third parties for their own commercial purposes.</p>
					<p>We share anonymous analytics data with <strong>PostHog, Inc.</strong> solely for the purpose of providing analytics services to us. For more information, see <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer">PostHog's Privacy Policy</a>.</p>
					<p>We may disclose information if required to do so by law or in response to valid requests by public authorities.</p>
				</section>

				<section>
					<h2>5. Cookies and Tracking Technologies</h2>
					<p>PostHog may set a first-party cookie on your device to distinguish between sessions and avoid counting the same visit multiple times. This cookie:</p>
					<ul>
						<li>Contains a randomly generated, non-personal identifier</li>
						<li>Does not contain personally identifiable information</li>
						<li>Is used solely for analytics session management</li>
					</ul>
					<p>We do not use marketing, advertising, or cross-site tracking cookies. You can manage your cookie preferences at any time using the "Cookie Settings" link in the footer.</p>
				</section>

				<section>
					<h2>6. Data Retention</h2>
					<p>Anonymous analytics data is retained for up to <strong>24 months</strong>, after which it is aggregated or deleted. Because the data is anonymous, retention periods under CCPA for personal data do not apply; however, we apply the same standards as a matter of good practice.</p>
				</section>

				<section>
					<h2>7. Your Rights</h2>
					<h3>7.1 All Users — Opt-Out</h3>
					<p>You may opt out of analytics data collection at any time using the "Cookie Settings" link in the footer. Once opted out, no new analytics events will be sent from your device.</p>

					<h3>7.2 California Residents (CCPA / CPRA)</h3>
					<p>Under the California Consumer Privacy Act, California residents have the right to:</p>
					<ul>
						<li>Know what personal information is collected, used, shared, or sold</li>
						<li>Delete personal information held by us</li>
						<li>Opt out of the sale or sharing of personal information</li>
						<li>Non-discrimination for exercising CCPA rights</li>
					</ul>
					<p>We do not sell or share personal information as defined under the CCPA. The analytics data we collect is anonymous and does not constitute "personal information" under California law. To submit a CCPA request, contact us at <a href="mailto:thatxliner@gmail.com">thatxliner@gmail.com</a>.</p>
				</section>

				<section>
					<h2>8. Data Security</h2>
					<p>We implement reasonable administrative, technical, and physical safeguards to protect the data we process. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
				</section>

				<section>
					<h2>9. Children's Privacy</h2>
					<p>The Service is not directed to individuals under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us personal information, please contact us and we will take steps to delete it.</p>
				</section>

				<section>
					<h2>10. Changes to This Policy</h2>
					<p>We may update this Privacy Policy from time to time. Material changes will be indicated by updating the "Last Updated" date at the top of this policy. We encourage you to review this policy periodically. Continued use of the Service after changes constitutes acceptance of the revised policy.</p>
				</section>

				<section>
					<h2>11. Contact Us</h2>
					<p>If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
					<p><strong>Quillium</strong><br />
					Email: <a href="mailto:thatxliner@gmail.com">thatxliner@gmail.com</a></p>
					<p>We aim to respond to all inquiries within 30 days.</p>
				</section>

				<p class="mt-8 text-center text-[0.8rem] text-black/28">
					Prefer a simpler summary?
					<button class="inline-tab-switch" onclick={() => (activeTab = 'plain')}>Switch to Plain English view</button>
				</p>
			</div>
		{/if}
	</div>
</main>

<Footer />

<style>
	/* ── Tabs ── */
	.tab-btn {
		padding: 7px 20px;
		border-radius: 9999px;
		border: none;
		background: transparent;
		font-size: 0.8rem;
		font-weight: 500;
		font-family: 'Inter', sans-serif;
		color: rgba(0, 0, 0, 0.6);
		cursor: pointer;
		transition: all 0.2s;
	}
	.tab-btn.active {
		background: white;
		color: rgba(0, 0, 0, 0.88);
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
	}
	.tab-btn:not(.active):hover {
		color: rgba(0, 0, 0, 0.88);
	}

	/* ── Legal content ── */
	.legal-content section {
		margin-bottom: 40px;
	}
	.legal-content h2 {
		font-family: 'Newsreader', Georgia, serif;
		font-size: 1.2rem;
		font-weight: 400;
		font-style: italic;
		color: rgba(0, 0, 0, 0.88);
		margin: 0 0 12px 0;
		padding-bottom: 8px;
		border-bottom: 1px solid rgba(0, 0, 0, 0.06);
	}
	.legal-content h3 {
		font-size: 0.875rem;
		font-weight: 600;
		color: rgba(0, 0, 0, 0.88);
		margin: 20px 0 8px 0;
	}
	.legal-content p {
		font-size: 0.875rem;
		color: rgba(0, 0, 0, 0.6);
		line-height: 1.75;
		margin: 0 0 12px 0;
	}
	.legal-content ul {
		margin: 8px 0 12px 0;
		padding-left: 20px;
	}
	.legal-content li {
		font-size: 0.875rem;
		color: rgba(0, 0, 0, 0.6);
		line-height: 1.75;
		margin-bottom: 4px;
	}
	.legal-content a {
		color: #3b82f6;
		text-decoration: none;
	}
	.legal-content a:hover {
		text-decoration: underline;
	}
	.legal-content strong {
		color: rgba(0, 0, 0, 0.88);
	}

	/* ── Tab switch link ── */
	.inline-tab-switch {
		background: none;
		border: none;
		color: #3b82f6;
		font-size: 0.8rem;
		font-family: 'Inter', sans-serif;
		cursor: pointer;
		padding: 0;
		text-decoration: underline;
		text-underline-offset: 2px;
	}
	.inline-tab-switch:hover {
		color: #2563eb;
	}
</style>

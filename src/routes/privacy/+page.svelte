<svelte:head>
	<title>Privacy Policy – Quillium</title>
	<meta name="description" content="Quillium's privacy policy — what data we collect, how we use it, and your rights." />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Inter:wght@300;400;500;600&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<script lang="ts">
	let activeTab: 'plain' | 'legal' = $state('plain');
</script>

<nav class="nav-fixed" id="privacy-nav">
	<div class="nav-inner">
		<a href="/" class="logo-group">
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
				<path d="M8 19.5L10.5 17" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" />
				<path
					d="M10.5 17C10.5 17 12.5 20.5 9.5 22.5"
					stroke="#2563eb"
					stroke-width="1.3"
					stroke-linecap="round"
				/>
				<path d="M8 19.5C8 19.5 6.5 20.5 5.5 22C5.5 22 7 21 8 19.5Z" fill="#3b82f6" opacity="0.4" />
			</svg>
			<span class="logo-name">Quillium</span>
		</a>
		<a href="/" class="back-link">
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
				<path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
			Back to home
		</a>
	</div>
</nav>

<main class="privacy-page">
	<div class="privacy-inner">
		<header class="privacy-header">
			<p class="eyebrow">Legal</p>
			<h1 class="privacy-title">Privacy Policy</h1>
			<p class="privacy-meta">Last updated: March 16, 2026 · Quillium Beta</p>

			<div class="tab-switcher" role="tablist" aria-label="View mode">
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
			<div class="content plain-content" role="tabpanel">
				<div class="tldr-banner">
					<span class="tldr-label">TL;DR</span>
					<p>We only collect anonymous usage analytics. We don't know who you are, and we never sell your data.</p>
				</div>

				<div class="plain-cards">
					<div class="plain-card">
						<div class="card-icon">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
								<circle cx="10" cy="10" r="8" stroke="#3b82f6" stroke-width="1.5" />
								<path d="M10 6v4l3 2" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" />
							</svg>
						</div>
						<div>
							<h3>What we collect</h3>
							<p>Anonymous usage analytics only — things like which features you use, session length, and device type. We use PostHog for this. <strong>No names, emails, or login info.</strong></p>
						</div>
					</div>

					<div class="plain-card">
						<div class="card-icon">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
								<path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z" stroke="#3b82f6" stroke-width="1.5" stroke-linejoin="round" />
							</svg>
						</div>
						<div>
							<h3>Why we collect it</h3>
							<p>To understand what's working, fix bugs, and improve the app. That's it. We don't use it for ads or profiling.</p>
						</div>
					</div>

					<div class="plain-card">
						<div class="card-icon">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
								<rect x="3" y="8" width="14" height="10" rx="2" stroke="#3b82f6" stroke-width="1.5" />
								<path d="M7 8V6a3 3 0 016 0v2" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" />
							</svg>
						</div>
						<div>
							<h3>Who can see it</h3>
							<p>Only us, via PostHog. The data is anonymized and cannot be linked back to you. We don't sell or share it with third parties for their own use.</p>
						</div>
					</div>

					<div class="plain-card">
						<div class="card-icon">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
								<path d="M10 17C13.866 17 17 13.866 17 10C17 6.134 13.866 3 10 3C6.134 3 3 6.134 3 10C3 13.866 6.134 17 10 17Z" stroke="#3b82f6" stroke-width="1.5" />
								<path d="M10 7v3l2 2" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" />
							</svg>
						</div>
						<div>
							<h3>Your rights</h3>
							<p>Since we don't collect personal data, there's no profile to delete. You can opt out of analytics entirely in the app settings. If you're in the EU/UK, GDPR applies. In California, CCPA applies.</p>
						</div>
					</div>

					<div class="plain-card">
						<div class="card-icon">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
								<path d="M3 5h14M3 10h14M3 15h8" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" />
							</svg>
						</div>
						<div>
							<h3>Cookies</h3>
							<p>PostHog may set a cookie to distinguish sessions. It contains no personal info. No marketing or tracking cookies are used.</p>
						</div>
					</div>

					<div class="plain-card">
						<div class="card-icon">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
								<path d="M16 4H4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2z" stroke="#3b82f6" stroke-width="1.5" />
								<path d="M8 10h4M10 8v4" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" />
							</svg>
						</div>
						<div>
							<h3>Questions?</h3>
							<p>Email us at <a href="mailto:thatxliner@gmail.com">thatxliner@gmail.com</a> — we're a small team and we'll respond personally.</p>
						</div>
					</div>
				</div>

				<p class="plain-footer-note">
					Want the full legal text?
					<button class="inline-tab-switch" onclick={() => (activeTab = 'legal')}>Switch to Full Legal view</button>
				</p>
			</div>
		{:else}
			<div class="content legal-content" role="tabpanel">
				<section>
					<h2>1. Introduction</h2>
					<p>Quillium ("we," "us," or "our") operates quillium.bryanhu.com (the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use the beta version of the Service. Please read this policy carefully. By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.</p>
					<p>This policy is designed to comply with applicable data protection laws, including the General Data Protection Regulation (GDPR) for users in the European Economic Area and United Kingdom, and the California Consumer Privacy Act (CCPA) for California residents.</p>
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

					<h3>2.2 Information We Do Not Collect</h3>
					<p>At this beta stage, we do not collect:</p>
					<ul>
						<li>Names, email addresses, or contact information</li>
						<li>Account credentials or social login data</li>
						<li>Payment or financial information</li>
						<li>User-generated content from within the editor</li>
						<li>Precise geolocation data</li>
					</ul>
				</section>

				<section>
					<h2>3. Legal Basis for Processing (GDPR)</h2>
					<p>For users in the EEA or UK, our legal basis for processing analytics data is our <strong>legitimate interest</strong> (Article 6(1)(f) GDPR) in understanding usage patterns to improve the Service. This interest is not overridden by your fundamental rights, given that the data is anonymous and cannot be used to identify you.</p>
					<p>Where required by law or where legitimate interest does not apply, we will seek your consent before processing.</p>
				</section>

				<section>
					<h2>4. How We Use Your Information</h2>
					<p>We use the analytics data we collect solely to:</p>
					<ul>
						<li>Understand how users interact with the Service</li>
						<li>Identify and fix bugs and performance issues</li>
						<li>Improve and prioritize product features</li>
						<li>Measure the general reach of the Service</li>
					</ul>
					<p>We do not use your data for targeted advertising, behavioral profiling, or any purpose unrelated to improving the Service.</p>
				</section>

				<section>
					<h2>5. Disclosure of Information</h2>
					<p>We do not sell, trade, rent, or otherwise transfer your information to third parties for their own commercial purposes.</p>
					<p>We share anonymous analytics data with <strong>PostHog, Inc.</strong> solely for the purpose of providing analytics services to us. PostHog processes data under a Data Processing Agreement consistent with GDPR requirements. For more information, see <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer">PostHog's Privacy Policy</a>.</p>
					<p>We may disclose information if required to do so by law or in response to valid requests by public authorities.</p>
				</section>

				<section>
					<h2>6. Cookies and Tracking Technologies</h2>
					<p>PostHog may set a first-party cookie on your device to distinguish between sessions and avoid counting the same visit multiple times. This cookie:</p>
					<ul>
						<li>Contains a randomly generated, non-personal identifier</li>
						<li>Does not contain personally identifiable information</li>
						<li>Is used solely for analytics session management</li>
					</ul>
					<p>We do not use marketing, advertising, or cross-site tracking cookies.</p>
				</section>

				<section>
					<h2>7. Data Retention</h2>
					<p>Anonymous analytics data is retained for up to <strong>24 months</strong>, after which it is aggregated or deleted. Because the data is anonymous, retention periods under GDPR/CCPA for personal data do not apply; however, we apply the same standards as a matter of good practice.</p>
				</section>

				<section>
					<h2>8. Your Rights</h2>
					<h3>8.1 All Users — Opt-Out</h3>
					<p>You may opt out of analytics data collection at any time via the app settings. Once opted out, no new analytics events will be sent from your device.</p>

					<h3>8.2 EEA and UK Users (GDPR)</h3>
					<p>Under the GDPR, you have the right to:</p>
					<ul>
						<li><strong>Access</strong> — request a copy of personal data we hold about you</li>
						<li><strong>Rectification</strong> — correct inaccurate personal data</li>
						<li><strong>Erasure</strong> — request deletion of your personal data</li>
						<li><strong>Restriction</strong> — restrict processing of your personal data</li>
						<li><strong>Portability</strong> — receive your data in a structured, machine-readable format</li>
						<li><strong>Objection</strong> — object to processing based on legitimate interests</li>
						<li><strong>Withdraw consent</strong> — where processing is based on consent</li>
					</ul>
					<p>Because we only collect anonymous data at this stage, many of these rights may not be applicable in practice, as we are unable to link analytics data to a specific individual. To exercise any of these rights, contact us at <a href="mailto:thatxliner@gmail.com">thatxliner@gmail.com</a>.</p>
					<p>You also have the right to lodge a complaint with your local supervisory authority (e.g., the ICO in the UK, or your national DPA in the EU).</p>

					<h3>8.3 California Residents (CCPA / CPRA)</h3>
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
					<h2>9. Data Security</h2>
					<p>We implement reasonable administrative, technical, and physical safeguards to protect the data we process. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
				</section>

				<section>
					<h2>10. Children's Privacy</h2>
					<p>The Service is not directed to individuals under the age of 13 (or 16 in the EEA). We do not knowingly collect personal information from children. If you believe a child has provided us personal information, please contact us and we will take steps to delete it.</p>
				</section>

				<section>
					<h2>11. International Data Transfers</h2>
					<p>PostHog may process analytics data on servers located outside your country of residence, including in the United States. PostHog provides appropriate safeguards for such transfers, including Standard Contractual Clauses where required by GDPR.</p>
				</section>

				<section>
					<h2>12. Changes to This Policy</h2>
					<p>We may update this Privacy Policy from time to time. Material changes will be indicated by updating the "Last Updated" date at the top of this policy. We encourage you to review this policy periodically. Continued use of the Service after changes constitutes acceptance of the revised policy.</p>
				</section>

				<section>
					<h2>13. Contact Us</h2>
					<p>If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
					<p><strong>Quillium</strong><br />
					Email: <a href="mailto:thatxliner@gmail.com">thatxliner@gmail.com</a></p>
					<p>We aim to respond to all inquiries within 30 days.</p>
				</section>

				<p class="plain-footer-note">
					Prefer a simpler summary?
					<button class="inline-tab-switch" onclick={() => (activeTab = 'plain')}>Switch to Plain English view</button>
				</p>
			</div>
		{/if}
	</div>
</main>

<footer class="privacy-footer">
	<div class="privacy-footer-inner">
		<p>&copy; 2026 Quillium</p>
		<a href="/" class="footer-home-link">Back to home</a>
	</div>
</footer>

<style>
	/* ── Nav ── */
	.nav-fixed {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 50;
		padding: 16px 0;
		background: rgba(250, 249, 247, 0.9);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border-bottom: 1px solid rgba(220, 210, 195, 0.4);
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
		text-decoration: none;
	}
	.logo-name {
		font-family: 'Lora', Georgia, serif;
		font-weight: 600;
		font-size: 19px;
		color: #2c2a27;
		letter-spacing: -0.01em;
	}
	.back-link {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 13.5px;
		color: #6b6560;
		text-decoration: none;
		font-family: 'Inter', sans-serif;
		transition: color 0.2s;
	}
	.back-link:hover {
		color: #2c2a27;
	}

	/* ── Page ── */
	.privacy-page {
		min-height: 100vh;
		background: #faf9f7;
		padding-top: 100px;
		padding-bottom: 80px;
		font-family: 'Inter', sans-serif;
	}
	.privacy-inner {
		max-width: 720px;
		margin: 0 auto;
		padding: 0 24px;
	}

	/* ── Header ── */
	.privacy-header {
		margin-bottom: 48px;
	}
	.eyebrow {
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #a89e94;
		margin: 0 0 12px 0;
	}
	.privacy-title {
		font-family: 'Lora', Georgia, serif;
		font-size: clamp(1.75rem, 4vw, 2.5rem);
		font-weight: 700;
		color: #1e1c1a;
		margin: 0 0 8px 0;
		line-height: 1.15;
	}
	.privacy-meta {
		font-size: 13px;
		color: #a89e94;
		margin: 0 0 32px 0;
	}

	/* ── Tabs ── */
	.tab-switcher {
		display: inline-flex;
		background: #f0ede8;
		border-radius: 9999px;
		padding: 4px;
		gap: 2px;
	}
	.tab-btn {
		padding: 7px 20px;
		border-radius: 9999px;
		border: none;
		background: transparent;
		font-size: 13.5px;
		font-weight: 500;
		font-family: 'Inter', sans-serif;
		color: #6b6560;
		cursor: pointer;
		transition: all 0.2s;
	}
	.tab-btn.active {
		background: white;
		color: #2c2a27;
		box-shadow: 0 1px 4px rgba(44, 42, 39, 0.1);
	}
	.tab-btn:not(.active):hover {
		color: #2c2a27;
	}

	/* ── Plain English ── */
	.tldr-banner {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		background: rgba(59, 130, 246, 0.06);
		border: 1px solid rgba(59, 130, 246, 0.15);
		border-radius: 12px;
		padding: 16px 20px;
		margin-bottom: 32px;
	}
	.tldr-label {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: #3b82f6;
		background: rgba(59, 130, 246, 0.1);
		border-radius: 4px;
		padding: 2px 8px;
		white-space: nowrap;
		margin-top: 1px;
	}
	.tldr-banner p {
		font-size: 14px;
		color: #2c2a27;
		margin: 0;
		line-height: 1.6;
	}
	.plain-cards {
		display: grid;
		gap: 12px;
	}
	.plain-card {
		display: flex;
		gap: 16px;
		background: white;
		border: 1px solid #e8e3db;
		border-radius: 12px;
		padding: 20px;
	}
	.card-icon {
		flex-shrink: 0;
		width: 36px;
		height: 36px;
		background: rgba(59, 130, 246, 0.06);
		border-radius: 8px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.plain-card h3 {
		font-size: 14px;
		font-weight: 600;
		color: #1e1c1a;
		margin: 0 0 6px 0;
	}
	.plain-card p {
		font-size: 13.5px;
		color: #5a554f;
		line-height: 1.6;
		margin: 0;
	}
	.plain-card a {
		color: #3b82f6;
		text-decoration: none;
	}
	.plain-card a:hover {
		text-decoration: underline;
	}

	/* ── Legal ── */
	.legal-content section {
		margin-bottom: 40px;
	}
	.legal-content h2 {
		font-family: 'Lora', Georgia, serif;
		font-size: 1.2rem;
		font-weight: 600;
		color: #1e1c1a;
		margin: 0 0 12px 0;
		padding-bottom: 8px;
		border-bottom: 1px solid #e8e3db;
	}
	.legal-content h3 {
		font-size: 14px;
		font-weight: 600;
		color: #2c2a27;
		margin: 20px 0 8px 0;
	}
	.legal-content p {
		font-size: 14px;
		color: #4a4540;
		line-height: 1.75;
		margin: 0 0 12px 0;
	}
	.legal-content ul {
		margin: 8px 0 12px 0;
		padding-left: 20px;
	}
	.legal-content li {
		font-size: 14px;
		color: #4a4540;
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

	/* ── Shared ── */
	.plain-footer-note {
		margin-top: 32px;
		font-size: 13px;
		color: #a89e94;
		text-align: center;
	}
	.inline-tab-switch {
		background: none;
		border: none;
		color: #3b82f6;
		font-size: 13px;
		font-family: 'Inter', sans-serif;
		cursor: pointer;
		padding: 0;
		text-decoration: underline;
		text-underline-offset: 2px;
	}
	.inline-tab-switch:hover {
		color: #2563eb;
	}

	/* ── Footer ── */
	.privacy-footer {
		background: #f7f5f2;
		border-top: 1px solid #e8e3db;
		padding: 24px;
	}
	.privacy-footer-inner {
		max-width: 720px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.privacy-footer p {
		font-size: 12px;
		color: #c9c2b8;
		font-family: 'Inter', sans-serif;
		margin: 0;
	}
	.footer-home-link {
		font-size: 13px;
		color: #6b6560;
		font-family: 'Inter', sans-serif;
		text-decoration: none;
		transition: color 0.2s;
	}
	.footer-home-link:hover {
		color: #2c2a27;
	}
</style>

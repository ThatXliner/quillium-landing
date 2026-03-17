<!-- ==================== FOOTER ==================== -->
<footer class="site-footer">
	<div class="footer-inner">
		<div class="footer-brand">
			<div class="footer-logo">
				<svg width="20" height="20" viewBox="0 0 26 26" fill="none">
					<path d="M21 3.5C21 3.5 16.5 6 12.5 11C9.5 15 8 19.5 8 19.5" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
					<path d="M8 19.5L10.5 17" stroke="#3b82f6" stroke-width="1.5" stroke-linecap="round" />
					<path d="M10.5 17C10.5 17 12.5 20.5 9.5 22.5" stroke="#2563eb" stroke-width="1.3" stroke-linecap="round" />
				</svg>
				<span>Quillium</span>
			</div>
			<p class="footer-tagline">Next Generation Prose</p>
		</div>
		<div class="footer-links">
			<a href="#features" class="footer-link">Product</a>
			<a href="#manifesto" class="footer-link">Manifesto</a>
			<a href="#waitlist" class="footer-link">Public Beta</a>
			<a href="mailto:thatxliner@gmail.com" class="footer-link">Contact</a>
			<a href="/privacy" class="footer-link">Privacy</a>
		</div>
		<div class="footer-bottom">
			<p class="footer-copy">&copy; 2026 Quillium</p>
			<p class="footer-privacy">We collect anonymous usage data to improve the app. No personal information is stored. <a href="/privacy" class="footer-privacy-link">Privacy Policy</a></p>
		</div>
	</div>
</footer>

<style>
	/* ── Footer ── */
	.site-footer {
		background: #f7f5f2;
		border-top: 1px solid #e8e3db;
		padding: 32px 24px;
	}
	.footer-inner {
		max-width: 72rem;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 32px;
	}
	@media (min-width: 768px) {
		.footer-inner {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}
	}
	.footer-logo {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 8px;
	}
	.footer-logo span {
		font-family: 'Lora', Georgia, serif;
		font-weight: 600;
		font-size: 16px;
		color: #2c2a27;
	}
	.footer-tagline {
		font-size: 13px;
		color: #a89e94;
		font-family: 'Inter', sans-serif;
		margin: 0;
	}
	.footer-links {
		display: flex;
		flex-wrap: wrap;
		gap: 32px 24px;
	}
	.footer-link {
		font-size: 13.5px;
		color: #6b6560;
		font-family: 'Inter', sans-serif;
		text-decoration: none;
		transition: color 0.2s;
	}
	.footer-link:hover {
		color: #2c2a27;
	}
	.footer-bottom {
		display: flex;
		flex-direction: column;
		gap: 4px;
		text-align: right;
	}
	.footer-copy {
		font-size: 12px;
		color: #c9c2b8;
		font-family: 'Inter', sans-serif;
		margin: 0;
	}
	.footer-privacy {
		font-size: 11px;
		color: #c9c2b8;
		font-family: 'Inter', sans-serif;
		margin: 0;
	}
	.footer-privacy-link {
		color: #a89e94;
		text-decoration: none;
		transition: color 0.2s;
	}
	.footer-privacy-link:hover {
		color: #6b6560;
	}
</style>

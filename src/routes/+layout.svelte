<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import CookieConsent from '$lib/components/CookieConsent.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />

	<!-- Global Structured Data: Organization + WebSite -->
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "Organization",
		"name": "Quillium",
		"url": "https://quillium.bryanhu.com",
		"description": "The non-linear writing app. Fork any sentence, keep every version.",
		"contactPoint": {
			"@type": "ContactPoint",
			"email": "support@quillium.bryanhu.com",
			"contactType": "customer service"
		}
	})}</script>`}
	{@html `<script type="application/ld+json">${JSON.stringify({
		"@context": "https://schema.org",
		"@type": "WebSite",
		"name": "Quillium",
		"url": "https://quillium.bryanhu.com",
		"description": "The non-linear writing app. Fork any sentence, keep every version.",
		"potentialAction": {
			"@type": "SearchAction",
			"target": {
				"@type": "EntryPoint",
				"urlTemplate": "https://quillium.bryanhu.com/blog?q={search_term_string}"
			},
			"query-input": "required name=search_term_string"
		}
	})}</script>`}

	<meta name="twitter:site" content="@quillium" />
</svelte:head>

{@render children()}
<CookieConsent />

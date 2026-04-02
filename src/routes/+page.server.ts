const REPO = 'ThatXliner/quillium-releases';
const FALLBACK_VERSION = '0.10.0';

interface GitHubAsset {
	name: string;
	browser_download_url: string;
}

interface ReleaseData {
	version: string;
	assets: { name: string; url: string }[];
}

export async function load({ fetch }): Promise<{ release: ReleaseData }> {
	try {
		const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`);
		if (res.ok) {
			const data = await res.json();
			const tag: string = data.tag_name ?? '';
			const version = tag.startsWith('v') ? tag.slice(1) : tag;
			const assets = (data.assets as GitHubAsset[]).map((a) => ({
				name: a.name,
				url: a.browser_download_url
			}));
			if (version) {
				return { release: { version, assets } };
			}
		}
	} catch {
		// Fall through to fallback
	}

	return {
		release: {
			version: FALLBACK_VERSION,
			assets: []
		}
	};
}

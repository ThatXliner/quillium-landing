const REPO = 'ThatXliner/quillium-releases';

interface GitHubAsset {
	name: string;
	browser_download_url: string;
}

export interface ReleaseData {
	version: string | null;
	assets: { name: string; url: string }[];
}

export async function load({ fetch }): Promise<{ release: ReleaseData }> {
	try {
		const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`);
		if (res.ok) {
			const data = await res.json();
			const assets = (data.assets as GitHubAsset[]).map((a) => ({
				name: a.name,
				url: a.browser_download_url
			}));
			if (assets.length) {
				return { release: { version: data.tag_name ?? null, assets } };
			}
		}
	} catch {
		// Fall through to fallback
	}

	return {
		release: {
			version: null,
			assets: []
		}
	};
}

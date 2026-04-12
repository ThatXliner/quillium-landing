import { env } from '$env/dynamic/private';

const REPO = 'ThatXliner/quillium-releases';

interface GitHubAsset {
	name: string;
	browser_download_url: string;
}

interface GitHubRelease {
	tag_name: string;
	assets: GitHubAsset[];
}

export interface ReleaseData {
	version: string | null;
	assets: { name: string; url: string }[];
}

// Patterns that identify each OS's assets
const OS_PATTERNS = [
	'_aarch64.dmg',
	'_aarch64.app.tar.gz',
	'_x64-setup.exe',
	'_x64_en-US.msi',
	'_amd64.deb',
	'.x86_64.rpm',
	'_amd64.AppImage'
];

export async function load({ fetch }): Promise<{ release: ReleaseData }> {
	try {
		const headers: Record<string, string> = { Accept: 'application/vnd.github+json' };
		const token = env.GITHUB_PAT;
		if (token) headers['Authorization'] = `Bearer ${token}`;

		const latestRes = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
			headers
		});
		if (!latestRes.ok) throw new Error('Failed to fetch latest release');

		const latest: GitHubRelease = await latestRes.json();
		const latestAssets = latest.assets.map((a) => ({ name: a.name, url: a.browser_download_url }));

		// Check if all OS patterns are covered by the latest release
		const missingPatterns = OS_PATTERNS.filter(
			(p) => !latest.assets.some((a) => a.name.includes(p))
		);

		if (!missingPatterns.length) {
			// Latest release has everything — fast path
			return { release: { version: latest.tag_name ?? null, assets: latestAssets } };
		}

		// Some OS assets are missing — fetch older releases to fill gaps
		const listRes = await fetch(`https://api.github.com/repos/${REPO}/releases?per_page=3`, {
			headers
		});
		if (!listRes.ok) throw new Error('Failed to fetch releases list');

		const releases: GitHubRelease[] = await listRes.json();
		const bestAssets = [...latestAssets];

		for (const pattern of missingPatterns) {
			// Skip the first (latest) since we already know it's missing this pattern
			for (const release of releases.slice(1)) {
				const match = release.assets.find((a) => a.name.includes(pattern));
				if (match) {
					bestAssets.push({ name: match.name, url: match.browser_download_url });
					break;
				}
			}
		}

		if (bestAssets.length) {
			return { release: { version: latest.tag_name ?? null, assets: bestAssets } };
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

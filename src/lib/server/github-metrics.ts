import { env } from '$env/dynamic/private';
import type {
	Project,
	ProjectDownloadMetricSource,
	ProjectMetricSettings,
	ProjectMetricValues
} from '$lib/data';

const githubApiBaseUrl = 'https://api.github.com';
const githubBaseUrl = 'https://github.com';
const metricsCacheTtlMs = 1000 * 60 * 30;

type Fetcher = typeof fetch;
type RepoRef = {
	owner: string;
	repo: string;
};

type MetricsCacheEntry<T> = {
	expiresAt: number;
	promise: Promise<T>;
};

type GithubRepoMetrics = {
	stars: number | null;
};

const repoMetricsCache = new Map<string, MetricsCacheEntry<GithubRepoMetrics>>();
const releaseDownloadsCache = new Map<string, MetricsCacheEntry<number | null>>();
const ghcrDownloadsCache = new Map<string, MetricsCacheEntry<number | null>>();

const emptyRepoMetrics: GithubRepoMetrics = {
	stars: null
};

export async function getProjectsWithGithubMetrics(
	projects: readonly Project[],
	fetcher: Fetcher
): Promise<Project[]> {
	return Promise.all(projects.map((project) => getProjectWithMetrics(project, fetcher)));
}

async function getProjectWithMetrics(project: Project, fetcher: Fetcher): Promise<Project> {
	const repoRef = parseGithubUrl(project.githubUrl);
	const shouldFetchStars = project.metrics?.stars === true;
	const repoMetrics =
		shouldFetchStars && repoRef ? await getGithubRepoMetrics(repoRef, fetcher) : emptyRepoMetrics;
	const metricValues = await getVisibleMetricValues(project.metrics, repoRef, repoMetrics, fetcher);

	return metricValues ? { ...project, metricValues } : project;
}

function getGithubRepoMetrics(repoRef: RepoRef, fetcher: Fetcher): Promise<GithubRepoMetrics> {
	const cacheKey = `${repoRef.owner}/${repoRef.repo}`.toLowerCase();

	return getCachedMetric(
		repoMetricsCache,
		cacheKey,
		() => fetchGithubRepoMetrics(repoRef, fetcher),
		emptyRepoMetrics
	);
}

async function getVisibleMetricValues(
	settings: ProjectMetricSettings | undefined,
	repoRef: RepoRef | null,
	repoMetrics: GithubRepoMetrics,
	fetcher: Fetcher
): Promise<ProjectMetricValues | undefined> {
	if (!settings) {
		return undefined;
	}

	const stars = settings.stars ? repoMetrics.stars : null;
	const downloads = await getDownloadsMetric(settings.downloads, repoRef, fetcher);

	return {
		stars,
		downloads
	};
}

async function getDownloadsMetric(
	source: ProjectDownloadMetricSource | undefined,
	repoRef: RepoRef | null,
	fetcher: Fetcher
): Promise<number | null> {
	if (!source || !repoRef) {
		return null;
	}

	if (source === 'github-releases') {
		return getGithubReleaseDownloads(repoRef, fetcher);
	}

	if (source.source === 'ghcr') {
		return getGhcrDownloads(source, repoRef, fetcher);
	}

	return null;
}

function getGithubReleaseDownloads(repoRef: RepoRef, fetcher: Fetcher): Promise<number | null> {
	const cacheKey = `${repoRef.owner}/${repoRef.repo}`.toLowerCase();

	return getCachedMetric(
		releaseDownloadsCache,
		cacheKey,
		() => fetchGithubReleaseDownloads(repoRef, fetcher),
		null
	);
}

function getGhcrDownloads(
	source: Extract<ProjectDownloadMetricSource, { source: 'ghcr' }>,
	repoRef: RepoRef,
	fetcher: Fetcher
): Promise<number | null> {
	const owner = source.owner ?? repoRef.owner;
	const cacheKey = `${source.ownerType ?? 'auto'}/${owner}/${source.package}`.toLowerCase();

	return getCachedMetric(
		ghcrDownloadsCache,
		cacheKey,
		() => fetchGhcrDownloads(owner, source.package, source.ownerType, fetcher),
		null
	);
}

function getCachedMetric<T>(
	cache: Map<string, MetricsCacheEntry<T>>,
	key: string,
	loader: () => Promise<T>,
	fallback: T
): Promise<T> {
	const cached = cache.get(key);
	const now = Date.now();

	if (cached && cached.expiresAt > now) {
		return cached.promise;
	}

	const promise = loader().catch(() => fallback);
	cache.set(key, {
		expiresAt: now + metricsCacheTtlMs,
		promise
	});

	return promise;
}

function parseGithubUrl(githubUrl: string): RepoRef | null {
	try {
		const url = new URL(githubUrl);

		if (url.hostname !== 'github.com') {
			return null;
		}

		const [owner, repo] = url.pathname.split('/').filter(Boolean);

		if (!owner || !repo) {
			return null;
		}

		return {
			owner,
			repo: repo.replace(/\.git$/, '')
		};
	} catch {
		return null;
	}
}

async function fetchGithubRepoMetrics(
	repoRef: RepoRef,
	fetcher: Fetcher
): Promise<GithubRepoMetrics> {
	const repoData = await fetchGithubJson(
		`/repos/${encodeURIComponent(repoRef.owner)}/${encodeURIComponent(repoRef.repo)}`,
		fetcher
	);

	return {
		stars: readNumber(repoData, 'stargazers_count')
	};
}

async function fetchGithubReleaseDownloads(
	repoRef: RepoRef,
	fetcher: Fetcher
): Promise<number | null> {
	const releasesData = await fetchGithubJson(
		`/repos/${encodeURIComponent(repoRef.owner)}/${encodeURIComponent(repoRef.repo)}/releases?per_page=100`,
		fetcher
	);

	return readReleaseDownloads(releasesData);
}

async function fetchGhcrDownloads(
	owner: string,
	packageName: string,
	ownerType: 'user' | 'org' | undefined,
	fetcher: Fetcher
): Promise<number | null> {
	const pages = getGhcrPackagePages(owner, packageName, ownerType);

	for (const page of pages) {
		const response = await fetcher(page, {
			headers: {
				'User-Agent': 'portfolio-wm'
			}
		});

		if (!response.ok) {
			continue;
		}

		const downloads = readGhcrTotalDownloads(await response.text());

		if (downloads !== null) {
			return downloads;
		}
	}

	return null;
}

function getGhcrPackagePages(
	owner: string,
	packageName: string,
	ownerType: 'user' | 'org' | undefined
): string[] {
	const encodedOwner = encodeURIComponent(owner);
	const encodedPackage = encodeURIComponent(packageName);

	if (ownerType === 'user') {
		return [`${githubBaseUrl}/users/${encodedOwner}/packages/container/package/${encodedPackage}`];
	}

	if (ownerType === 'org') {
		return [`${githubBaseUrl}/orgs/${encodedOwner}/packages/container/package/${encodedPackage}`];
	}

	return [
		`${githubBaseUrl}/users/${encodedOwner}/packages/container/package/${encodedPackage}`,
		`${githubBaseUrl}/orgs/${encodedOwner}/packages/container/package/${encodedPackage}`
	];
}

function readGhcrTotalDownloads(html: string): number | null {
	const markerIndex = html.indexOf('Total downloads');

	if (markerIndex === -1) {
		return null;
	}

	const totalDownloadsHtml = html.slice(markerIndex, markerIndex + 500);
	const match = totalDownloadsHtml.match(/<h3[^>]*title="([\d,]+)"[^>]*>/);
	const rawDownloads = match?.[1];

	if (!rawDownloads) {
		return null;
	}

	const downloads = Number.parseInt(rawDownloads.replaceAll(',', ''), 10);

	return Number.isFinite(downloads) ? downloads : null;
}

async function fetchGithubJson(path: string, fetcher: Fetcher): Promise<unknown> {
	const headers = new Headers({
		Accept: 'application/vnd.github+json',
		'User-Agent': 'portfolio-wm'
	});

	if (env.GITHUB_TOKEN) {
		headers.set('Authorization', `Bearer ${env.GITHUB_TOKEN}`);
	}

	const response = await fetcher(`${githubApiBaseUrl}${path}`, { headers });

	if (!response.ok) {
		return null;
	}

	return response.json();
}

function readReleaseDownloads(value: unknown): number | null {
	if (!Array.isArray(value)) {
		return null;
	}

	return value.reduce((total, release) => total + readReleaseAssetDownloads(release), 0);
}

function readReleaseAssetDownloads(value: unknown): number {
	if (!isRecord(value) || !Array.isArray(value.assets)) {
		return 0;
	}

	return value.assets.reduce(
		(total, asset) => total + (readNumber(asset, 'download_count') ?? 0),
		0
	);
}

function readNumber(value: unknown, key: string): number | null {
	if (!isRecord(value)) {
		return null;
	}

	const field = value[key];

	return typeof field === 'number' ? field : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

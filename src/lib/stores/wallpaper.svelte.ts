import { browser } from '$app/environment';

export type WallpaperSource = {
	id: string;
	label: string;
	kind: 'bundled' | 'custom';
	url: string;
};

type WallpaperPreferences = {
	activeId: string | null;
	customUrl: string;
};

type WallpaperStorage = {
	read(): WallpaperPreferences;
	write(preferences: WallpaperPreferences): void;
};

const activeIdStorageKey = 'desktop-wallpaper-active-id';
const customUrlStorageKey = 'desktop-wallpaper-custom-url';

function isAllowedProtocol(url: URL): boolean {
	return url.protocol === 'http:' || url.protocol === 'https:';
}

function validateWallpaperUrl(rawUrl: string): string {
	const url = new URL(rawUrl);

	if (!isAllowedProtocol(url)) {
		throw new Error('Use an http or https image URL.');
	}

	return url.toString();
}

function createWallpaperStorage(): WallpaperStorage {
	return {
		read() {
			if (!browser) {
				return {
					activeId: null,
					customUrl: ''
				};
			}

			return {
				activeId: window.localStorage.getItem(activeIdStorageKey),
				customUrl: window.localStorage.getItem(customUrlStorageKey) ?? ''
			};
		},
		write(preferences) {
			if (!browser) {
				return;
			}

			if (preferences.activeId) {
				window.localStorage.setItem(activeIdStorageKey, preferences.activeId);
			} else {
				window.localStorage.removeItem(activeIdStorageKey);
			}

			if (preferences.customUrl) {
				window.localStorage.setItem(customUrlStorageKey, preferences.customUrl);
			} else {
				window.localStorage.removeItem(customUrlStorageKey);
			}
		}
	};
}

export class WallpaperState {
	private storage = createWallpaperStorage();
	private bundledWallpapers: WallpaperSource[];

	activeId = $state<string | null>(null);
	customUrl = $state('');
	modalOpen = $state(false);
	draftUrl = $state('');
	errorMessage = $state('');

	constructor(bundledWallpapers: WallpaperSource[]) {
		this.bundledWallpapers = bundledWallpapers;
		this.activeId = bundledWallpapers[0]?.id ?? null;
		this.hydrate();
	}

	get sources() {
		const customWallpaper = this.customUrl
			? [
					{
						id: `custom:${this.customUrl}`,
						label: 'custom url',
						kind: 'custom' as const,
						url: this.customUrl
					}
				]
			: [];

		return [...this.bundledWallpapers, ...customWallpaper];
	}

	get activeWallpaper() {
		if (this.sources.length === 0) {
			return null;
		}

		return this.sources.find((wallpaper) => wallpaper.id === this.activeId) ?? this.sources[0];
	}

	private persist() {
		this.storage.write({
			activeId: this.activeId,
			customUrl: this.customUrl
		});
	}

	private hydrate() {
		const storedPreferences = this.storage.read();

		this.customUrl = storedPreferences.customUrl;

		const storedActiveId = storedPreferences.activeId;
		const availableWallpapers = this.sources;
		const hasStoredWallpaper = storedActiveId
			? availableWallpapers.some((wallpaper) => wallpaper.id === storedActiveId)
			: false;

		this.activeId = hasStoredWallpaper ? storedActiveId : (availableWallpapers[0]?.id ?? null);
		this.draftUrl = storedPreferences.customUrl;
		this.errorMessage = '';
		this.persist();
	}

	cycleWallpaper = () => {
		const availableWallpapers = this.sources;
		if (availableWallpapers.length === 0) {
			return;
		}

		const currentActiveId = this.activeId;
		const currentIndex = availableWallpapers.findIndex(
			(wallpaper) => wallpaper.id === currentActiveId
		);
		const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % availableWallpapers.length;

		this.activeId = availableWallpapers[nextIndex]?.id ?? availableWallpapers[0]?.id ?? null;
		this.persist();
	};

	openModal = () => {
		this.draftUrl = this.customUrl;
		this.errorMessage = '';
		this.modalOpen = true;
	};

	closeModal = () => {
		this.modalOpen = false;
		this.errorMessage = '';
	};

	updateDraftUrl = (value: string) => {
		this.draftUrl = value;
		if (this.errorMessage) {
			this.errorMessage = '';
		}
	};

	saveCustomWallpaper = () => {
		const nextDraftUrl = this.draftUrl.trim();

		if (!nextDraftUrl) {
			this.errorMessage = 'Enter an image URL.';
			return false;
		}

		try {
			const normalizedUrl = validateWallpaperUrl(nextDraftUrl);
			this.customUrl = normalizedUrl;
			this.activeId = `custom:${normalizedUrl}`;
			this.errorMessage = '';
			this.modalOpen = false;
			this.persist();

			return true;
		} catch (error) {
			this.errorMessage = error instanceof Error ? error.message : 'Enter a valid image URL.';
			return false;
		}
	};

	fallbackFromFailedWallpaper = () => {
		const currentWallpaper = this.activeWallpaper;
		if (currentWallpaper?.kind !== 'custom') {
			return;
		}

		const firstBundledWallpaper = this.bundledWallpapers[0];
		if (firstBundledWallpaper) {
			this.activeId = firstBundledWallpaper.id;
		}

		this.persist();
	};
}

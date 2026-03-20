import { browser } from '$app/environment';
import { derived, get, writable } from 'svelte/store';

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

export function createWallpaperState(bundledWallpapers: WallpaperSource[]) {
	const storage = createWallpaperStorage();
	const activeId = writable<string | null>(bundledWallpapers[0]?.id ?? null);
	const customUrl = writable('');
	const modalOpen = writable(false);
	const draftUrl = writable('');
	const errorMessage = writable('');

	const sources = derived([customUrl], ([savedCustomUrl]) => {
		const customWallpaper = savedCustomUrl
			? [
					{
						id: `custom:${savedCustomUrl}`,
						label: 'custom url',
						kind: 'custom' as const,
						url: savedCustomUrl
					}
				]
			: [];

		return [...bundledWallpapers, ...customWallpaper];
	});

	const activeWallpaper = derived([sources, activeId], ([$sources, $activeId]) => {
		if ($sources.length === 0) {
			return null;
		}

		return $sources.find((wallpaper) => wallpaper.id === $activeId) ?? $sources[0];
	});

	function persist() {
		storage.write({
			activeId: get(activeId),
			customUrl: get(customUrl)
		});
	}

	function hydrate() {
		const storedPreferences = storage.read();

		customUrl.set(storedPreferences.customUrl);

		const storedActiveId = storedPreferences.activeId;
		const availableWallpapers = get(sources);
		const hasStoredWallpaper = storedActiveId
			? availableWallpapers.some((wallpaper) => wallpaper.id === storedActiveId)
			: false;

		activeId.set(hasStoredWallpaper ? storedActiveId : (availableWallpapers[0]?.id ?? null));
		draftUrl.set(storedPreferences.customUrl);
		errorMessage.set('');
		persist();
	}

	function cycleWallpaper() {
		const availableWallpapers = get(sources);
		if (availableWallpapers.length === 0) {
			return;
		}

		const currentActiveId = get(activeId);
		const currentIndex = availableWallpapers.findIndex(
			(wallpaper) => wallpaper.id === currentActiveId
		);
		const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % availableWallpapers.length;

		activeId.set(availableWallpapers[nextIndex]?.id ?? availableWallpapers[0]?.id ?? null);
		persist();
	}

	function openModal() {
		draftUrl.set(get(customUrl));
		errorMessage.set('');
		modalOpen.set(true);
	}

	function closeModal() {
		modalOpen.set(false);
		errorMessage.set('');
	}

	function updateDraftUrl(value: string) {
		draftUrl.set(value);
		if (get(errorMessage)) {
			errorMessage.set('');
		}
	}

	function saveCustomWallpaper() {
		const nextDraftUrl = get(draftUrl).trim();

		if (!nextDraftUrl) {
			errorMessage.set('Enter an image URL.');
			return false;
		}

		try {
			const normalizedUrl = validateWallpaperUrl(nextDraftUrl);
			customUrl.set(normalizedUrl);
			activeId.set(`custom:${normalizedUrl}`);
			errorMessage.set('');
			modalOpen.set(false);
			persist();

			return true;
		} catch (error) {
			errorMessage.set(error instanceof Error ? error.message : 'Enter a valid image URL.');
			return false;
		}
	}

	function fallbackFromFailedWallpaper() {
		const currentWallpaper = get(activeWallpaper);
		if (currentWallpaper?.kind !== 'custom') {
			return;
		}

		const firstBundledWallpaper = bundledWallpapers[0];
		if (firstBundledWallpaper) {
			activeId.set(firstBundledWallpaper.id);
		}

		persist();
	}

	hydrate();

	return {
		activeId,
		activeWallpaper,
		closeModal,
		cycleWallpaper,
		draftUrl,
		errorMessage,
		fallbackFromFailedWallpaper,
		modalOpen,
		openModal,
		saveCustomWallpaper,
		sources,
		updateDraftUrl
	};
}

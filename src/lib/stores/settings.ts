import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const blurEnabledKey = 'desktop-blur-enabled';

function readBlurPreference(): boolean {
	if (!browser) {
		return false;
	}

	return window.localStorage.getItem(blurEnabledKey) === 'true';
}

function writeBlurPreference(enabled: boolean): void {
	if (!browser) {
		return;
	}

	window.localStorage.setItem(blurEnabledKey, String(enabled));
}

export function createSettingsState() {
	const blurEnabled = writable(readBlurPreference());

	function toggleBlur() {
		blurEnabled.update((current) => {
			const next = !current;
			writeBlurPreference(next);
			return next;
		});
	}

	function setBlur(enabled: boolean) {
		writeBlurPreference(enabled);
		blurEnabled.set(enabled);
	}

	return {
		blurEnabled,
		toggleBlur,
		setBlur
	};
}

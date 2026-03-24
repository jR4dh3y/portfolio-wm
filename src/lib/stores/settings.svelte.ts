import { browser } from '$app/environment';

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

export class SettingsState {
	blurEnabled = $state(readBlurPreference());

	toggleBlur = () => {
		this.blurEnabled = !this.blurEnabled;
		writeBlurPreference(this.blurEnabled);
	};

	setBlur = (enabled: boolean) => {
		this.blurEnabled = enabled;
		writeBlurPreference(this.blurEnabled);
	};
}

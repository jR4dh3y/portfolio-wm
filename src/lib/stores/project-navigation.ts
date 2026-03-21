import { writable } from 'svelte/store';
import type { PaneId } from '$lib/components/twm/layout';

export type ProjectNavigationRequest = {
	slug: string;
	nonce: number;
	sourcePane?: PaneId;
};

let requestNonce = 0;
let closeRequestNonce = 0;

export const projectNavigationRequest = writable<ProjectNavigationRequest | null>(null);
export const projectPaneFocusRequest = writable<number | null>(null);
export const returnToPane = writable<PaneId | null>(null);
export const projectDetailCloseRequest = writable<number | null>(null);

export function navigateToProject(slug: string, sourcePane?: PaneId) {
	requestNonce += 1;
	returnToPane.set(null);
	projectNavigationRequest.set({ slug, nonce: requestNonce, sourcePane });
	projectPaneFocusRequest.set(requestNonce);
}

export function navigateBack(targetPane: PaneId | null) {
	returnToPane.set(targetPane);
}

export function clearProjectNavigationRequest() {
	projectNavigationRequest.set(null);
}

export function clearProjectPaneFocusRequest() {
	projectPaneFocusRequest.set(null);
}

export function clearReturnToPane() {
	returnToPane.set(null);
}

export function requestProjectDetailClose() {
	closeRequestNonce += 1;
	projectDetailCloseRequest.set(closeRequestNonce);
}

import { writable } from 'svelte/store';
import type { PaneId } from '$lib/components/twm/layout';

export type ProjectNavigationRequest = {
	slug: string;
	nonce: number;
	sourcePane?: PaneId;
};

let requestNonce = 0;

export const projectNavigationRequest = writable<ProjectNavigationRequest | null>(null);

export function navigateToProject(slug: string, sourcePane?: PaneId) {
	requestNonce += 1;
	projectNavigationRequest.set({ slug, nonce: requestNonce, sourcePane });
}

export function clearProjectNavigationRequest() {
	projectNavigationRequest.set(null);
}

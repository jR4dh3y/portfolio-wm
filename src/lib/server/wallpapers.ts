import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

import type { WallpaperSource } from '$lib/stores/wallpaper';

const wallpaperDirectory = join(process.cwd(), 'static', 'wallpapers');
const supportedExtensions = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.webp']);

function getExtension(filename: string): string {
	const extensionIndex = filename.lastIndexOf('.');
	return extensionIndex === -1 ? '' : filename.slice(extensionIndex).toLowerCase();
}

function toWallpaperLabel(filename: string): string {
	return filename
		.replace(/\.[^.]+$/, '')
		.replace(/[-_]+/g, ' ')
		.trim();
}

export async function getBundledWallpapers(): Promise<WallpaperSource[]> {
	try {
		const entries = await readdir(wallpaperDirectory, { withFileTypes: true });

		return entries
			.filter((entry) => entry.isFile() && supportedExtensions.has(getExtension(entry.name)))
			.map((entry) => ({
				id: `bundled:${entry.name}`,
				label: toWallpaperLabel(entry.name) || entry.name,
				kind: 'bundled' as const,
				url: `/wallpapers/${entry.name}`
			}))
			.sort((left, right) => left.label.localeCompare(right.label, undefined, { numeric: true }));
	} catch {
		return [];
	}
}

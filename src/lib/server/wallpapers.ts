import type { WallpaperSource } from '$lib/stores/wallpaper';

const bundledFiles = ['lucy.jpeg', 'max.png', 'ryo.png', 'wall.png'] as const;

function toWallpaperLabel(filename: string): string {
	return filename
		.replace(/\.[^.]+$/, '')
		.replace(/[-_]+/g, ' ')
		.trim();
}

export function getBundledWallpapers(): WallpaperSource[] {
	return bundledFiles
		.map((filename) => ({
			id: `bundled:${filename}`,
			label: toWallpaperLabel(filename) || filename,
			kind: 'bundled' as const,
			url: `/wallpapers/${filename}`
		}))
		.sort((left, right) => left.label.localeCompare(right.label, undefined, { numeric: true }));
}

<script lang="ts">
	import { Image, RotateCw, Settings2 } from 'lucide-svelte';

	let {
		activeWallpaperLabel = 'wallpaper',
		onCycle,
		onOpenSettings
	}: {
		activeWallpaperLabel?: string;
		onCycle: () => void;
		onOpenSettings: () => void;
	} = $props();
</script>

<div
	class="inline-flex overflow-hidden border border-black/15 bg-transparent text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] md:backdrop-blur-xl"
>
	<button
		type="button"
		class="inline-flex items-center gap-2 border-r border-black/15 bg-accent px-2 py-1 transition-colors hover:bg-highlight hover:text-black"
		onclick={onCycle}
	>
		<RotateCw class="h-4 w-4" />
		<span class="hidden xl:inline">next</span>
	</button>
	<button
		type="button"
		class="inline-flex items-center gap-2 bg-accent px-2 py-1 transition-colors hover:bg-highlight hover:text-black"
		onclick={onOpenSettings}
	>
		<Image class="h-4 w-4" />
		<span class="max-w-32 truncate">{activeWallpaperLabel}</span>
		<Settings2 class="h-3.5 w-3.5 opacity-70" />
	</button>
</div>

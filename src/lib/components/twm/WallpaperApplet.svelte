<script lang="ts">
	import SunIcon from '$lib/components/twm/icons/SunIcon.svelte';
	import TerminalIcon from '$lib/components/twm/icons/TerminalIcon.svelte';

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
		<SunIcon class="h-4 w-4" />
		<span class="hidden xl:inline">next</span>
	</button>
	<button
		type="button"
		class="inline-flex items-center gap-2 bg-accent px-2 py-1 transition-colors hover:bg-highlight hover:text-black"
		onclick={onOpenSettings}
	>
		<TerminalIcon class="h-4 w-4" />
		<span class="max-w-32 truncate">{activeWallpaperLabel}</span>
		<SunIcon class="h-3.5 w-3.5 opacity-70" />
	</button>
</div>

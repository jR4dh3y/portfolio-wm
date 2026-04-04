<script lang="ts">
	import { ArrowRight, LoaderCircle } from 'lucide-svelte';

	let {
		onCycle,
		isLoading
	}: {
		onCycle: () => void | Promise<void>;
		isLoading: boolean;
	} = $props();
</script>

<button
	type="button"
	class="inline-flex items-center gap-2 border border-black/15 bg-accent px-2 py-1 text-black transition-colors hover:bg-highlight hover:text-black disabled:cursor-wait disabled:opacity-80"
	onclick={onCycle}
	disabled={isLoading}
	aria-busy={isLoading}
	aria-label={isLoading ? 'Loading next wallpaper' : 'Show next wallpaper'}
>
	{#if isLoading}
		<LoaderCircle class="h-4 w-4 animate-spin" />
		<span>loading wallpaper...</span>
	{:else}
		<ArrowRight class="h-4 w-4" />
		<span class="hidden xl:inline">next wallpaper</span>
	{/if}
</button>

<script lang="ts">
	import { RotateCw } from 'lucide-svelte';

	let { onCycle }: { onCycle: () => void } = $props();
</script>

<button
	type="button"
	class="inline-flex items-center gap-2 border border-black/15 bg-accent px-2 py-1 text-black transition-colors hover:bg-highlight hover:text-black"
	onclick={onCycle}
	aria-label="Show next wallpaper"
>
	<RotateCw class="h-4 w-4" />
	<span class="hidden xl:inline">next</span>
</button>

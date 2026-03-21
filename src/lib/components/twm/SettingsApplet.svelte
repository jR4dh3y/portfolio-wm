<script lang="ts">
	import { Cog } from 'lucide-svelte';

	let { onOpenSettings }: { onOpenSettings: () => void } = $props();
</script>

<button
	type="button"
	class="inline-flex items-center gap-2 border border-border bg-surface px-2 py-1 text-fg transition-colors hover:border-highlight hover:bg-highlight hover:text-black"
	onclick={onOpenSettings}
	aria-label="Open settings"
>
	<Cog class="h-4 w-4" />
	<span class="hidden xl:inline">settings</span>
</button>

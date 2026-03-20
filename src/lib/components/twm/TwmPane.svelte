<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		id,
		domId = id,
		trackPane = true,
		title,
		shortcut = '',
		className = '',
		activePaneId,
		onFocus,
		children
	}: {
		id: string;
		domId?: string;
		trackPane?: boolean;
		title: string;
		shortcut?: string;
		className?: string;
		activePaneId: string;
		onFocus: (id: string) => void;
		children: Snippet;
	} = $props();

	let isActive = $derived(activePaneId === id);
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
	id={`pane-${domId}`}
	data-pane-id={trackPane ? id : undefined}
	class="pane flex h-full min-h-0 w-full min-w-0 snap-start flex-col overflow-hidden outline-none {className}"
	tabindex={isActive ? 0 : -1}
	onfocusin={() => onFocus(id)}
	role="region"
	aria-labelledby={`pane-title-${domId}`}
>
	<div
		id={`pane-title-${domId}`}
		class="pane-header flex shrink-0 items-center justify-between px-2 py-1 font-mono text-xs font-bold uppercase"
	>
		<span class="flex items-center gap-2">
			{#if shortcut}
				<span class="opacity-50">[{shortcut}]</span>
			{/if}
			~/{title}
		</span>
		{#if isActive}
			<span class="animate-pulse">_</span>
		{/if}
	</div>
	<div class="flex-1 overflow-x-hidden overflow-y-auto">
		{@render children()}
	</div>
</div>

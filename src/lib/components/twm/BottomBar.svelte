<script lang="ts">
	import { MapPin } from 'lucide-svelte';
	import type {
		BottomBarAppletId,
		BottomBarAppletPlacement,
		PaneId,
		WorkspaceId,
		WorkspaceMeta
	} from '$lib/components/twm/layout';

	let {
		name,
		lastName,
		role,
		activePaneId,
		time,
		workspaces,
		appletPlacements,
		activeWorkspaceId,
		onSelectWorkspace,
		onToggleHelp
	}: {
		name: string;
		lastName: string;
		role: string;
		activePaneId: PaneId;
		time: string;
		workspaces: WorkspaceMeta[];
		appletPlacements: BottomBarAppletPlacement[];
		activeWorkspaceId: WorkspaceId;
		onSelectWorkspace: (workspaceId: WorkspaceId) => void;
		onToggleHelp: () => void;
	} = $props();

	function getAppletsForZone(zone: 'left' | 'right'): BottomBarAppletId[] {
		return appletPlacements
			.filter((placement) => placement.zone === zone)
			.sort((a, b) => a.order - b.order)
			.map((placement) => placement.id);
	}

	let leftApplets = $derived(getAppletsForZone('left'));
	let rightApplets = $derived(getAppletsForZone('right'));
</script>

<footer
	class="mt-2 flex shrink-0 flex-col gap-2 border border-border bg-surface px-3 py-2 font-mono text-[13px] text-fg uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] md:flex-row md:items-center md:justify-between"
>
	<div class="flex flex-wrap items-center gap-2">
		{#each leftApplets as appletId (appletId)}
			{#if appletId === 'identity'}
				<span
					class="inline-flex items-center border border-accent bg-accent px-2 py-1 text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
				>
					{name.toLowerCase()}@{lastName.toLowerCase()}
				</span>
			{:else if appletId === 'role'}
				<span
					class="inline-flex items-center gap-1 border border-caution bg-caution px-2 py-1 text-black"
				>
					<MapPin class="h-4 w-4" />{role}
				</span>
			{:else if appletId === 'active-pane'}
				<span
					class="hidden items-center gap-1 border border-highlight bg-highlight px-2 py-1 text-black xl:inline-flex"
				>
					active {activePaneId}
				</span>
			{:else if appletId === 'workspaces'}
				<div class="inline-flex overflow-hidden border border-border bg-(--surface)">
					{#each workspaces as workspace (workspace.id)}
						<button
							type="button"
							class={`px-2 py-1 ${
								workspace.id === activeWorkspaceId
									? 'bg-(--selection) text-secondary-accent'
									: 'text-dim hover:bg-highlight hover:text-black'
							}`}
							onclick={() => onSelectWorkspace(workspace.id)}
						>
							${workspace.label}
						</button>
					{/each}
				</div>
			{:else if appletId === 'help'}
				<button
					type="button"
					class="hidden items-center border border-urgent bg-urgent px-2 py-1 text-black transition-colors hover:border-highlight hover:bg-highlight hover:text-black xl:inline-flex"
					onclick={onToggleHelp}
				>
					press '?' for help
				</button>
			{:else if appletId === 'time'}
				<span
					class="border border-caution bg-caution px-2 py-1 text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
				>
					{time}
				</span>
			{/if}
		{/each}
	</div>
	<div class="flex flex-wrap items-center gap-2 md:justify-end">
		{#each rightApplets as appletId (appletId)}
			{#if appletId === 'identity'}
				<span
					class="inline-flex items-center border border-accent bg-accent px-2 py-1 text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
				>
					{name.toLowerCase()}@{lastName.toLowerCase()}
				</span>
			{:else if appletId === 'role'}
				<span
					class="inline-flex items-center gap-1 border border-caution bg-caution px-2 py-1 text-black"
				>
					<MapPin class="h-4 w-4" />{role}
				</span>
			{:else if appletId === 'active-pane'}
				<span
					class="hidden items-center gap-1 border border-highlight bg-highlight px-2 py-1 text-black xl:inline-flex"
				>
					active {activePaneId}
				</span>
			{:else if appletId === 'workspaces'}
				<div class="inline-flex overflow-hidden border border-border bg-(--surface)">
					{#each workspaces as workspace (workspace.id)}
						<button
							type="button"
							class={`px-2 py-1 ${
								workspace.id === activeWorkspaceId
									? 'bg-(--selection) text-secondary-accent'
									: 'text-dim hover:bg-highlight hover:text-black'
							}`}
							onclick={() => onSelectWorkspace(workspace.id)}
						>
							${workspace.label}
						</button>
					{/each}
				</div>
			{:else if appletId === 'help'}
				<button
					type="button"
					class="hidden items-center border border-urgent bg-urgent px-2 py-1 text-black transition-colors hover:border-highlight hover:bg-highlight hover:text-black xl:inline-flex"
					onclick={onToggleHelp}
				>
					press '?' for help
				</button>
			{:else if appletId === 'time'}
				<span
					class="border border-caution bg-caution px-2 py-1 text-black shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
				>
					{time}
				</span>
			{/if}
		{/each}
	</div>
</footer>

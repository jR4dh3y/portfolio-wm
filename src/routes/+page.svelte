<script lang="ts">
	import { onMount } from 'svelte';
	import { profile } from '$lib/data';
	import BottomBar from '$lib/components/twm/BottomBar.svelte';
	import TwmPane from '$lib/components/twm/TwmPane.svelte';
	import {
		projectNavigationRequest,
		returnToPane,
		clearReturnToPane
	} from '$lib/stores/project-navigation';
	import {
		bottomBarAppletPlacements,
		getFirstPaneIdForWorkspace,
		getNeighborPaneId,
		getWorkspaceById,
		getWorkspaceIdForPane,
		mobilePaneOrder,
		shortcutToPaneId,
		workspaces,
		type Direction,
		type PaneId
	} from '$lib/components/twm/layout';

	const desktopViewportId = 'workspace-viewport';

	let activePaneId = $state<PaneId>('hero');
	let time = $state(new Date().toLocaleTimeString());
	let showHelp = $state(false);
	let scrollSyncFrame = 0;

	let activeWorkspace = $derived(getWorkspaceById(getWorkspaceIdForPane(activePaneId)));

	function isDesktopViewport(): boolean {
		return typeof window !== 'undefined' && window.matchMedia('(min-width: 48rem)').matches;
	}

	function getScrollBehavior(): ScrollBehavior {
		if (
			typeof window !== 'undefined' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		) {
			return 'auto';
		}

		return 'smooth';
	}

	function focusPane(paneId: PaneId, shouldFocus = true) {
		activePaneId = paneId;

		const behavior = getScrollBehavior();
		const paneDomId = isDesktopViewport() ? paneId : `mobile-${paneId}`;
		const pane = document.getElementById(`pane-${paneDomId}`);

		if (!isDesktopViewport()) {
			pane?.scrollIntoView({ behavior, block: 'nearest', inline: 'nearest' });

			if (shouldFocus) {
				pane?.focus({ preventScroll: true });
			}

			return;
		}

		const workspace = document.getElementById(`workspace-${getWorkspaceIdForPane(paneId)}`);
		const column = pane?.closest<HTMLElement>('[data-column-id]');

		workspace?.scrollIntoView({ behavior, block: 'center', inline: 'nearest' });
		column?.scrollIntoView({ behavior, block: 'nearest', inline: 'center' });
		pane?.scrollIntoView({ behavior, block: 'nearest', inline: 'nearest' });

		if (shouldFocus) {
			pane?.focus({ preventScroll: true });
		}
	}

	function isInteractiveTarget(target: EventTarget | null): target is HTMLElement {
		return target instanceof HTMLElement;
	}

	function shouldIgnoreKeydown(event: KeyboardEvent): boolean {
		if (!isInteractiveTarget(event.target)) {
			return false;
		}

		if (event.target.isContentEditable) {
			return true;
		}

		return Boolean(event.target.closest('a, button, input, select, textarea'));
	}

	function queueViewportSync() {
		if (!isDesktopViewport()) {
			return;
		}

		if (scrollSyncFrame) {
			cancelAnimationFrame(scrollSyncFrame);
		}

		scrollSyncFrame = requestAnimationFrame(syncActivePaneFromViewport);
	}

	function syncActivePaneFromViewport() {
		scrollSyncFrame = 0;

		const viewport = document.getElementById(desktopViewportId);
		if (!viewport) {
			return;
		}

		const viewportRect = viewport.getBoundingClientRect();
		const centerX = viewportRect.left + viewportRect.width / 2;
		const centerY = viewportRect.top + viewportRect.height / 2;

		let nearestPaneId: PaneId | null = null;
		let nearestScore = Number.POSITIVE_INFINITY;

		for (const pane of document.querySelectorAll<HTMLElement>('[data-pane-id]')) {
			const rect = pane.getBoundingClientRect();
			if (rect.width === 0 || rect.height === 0) {
				continue;
			}

			const deltaX = rect.left + rect.width / 2 - centerX;
			const deltaY = rect.top + rect.height / 2 - centerY;
			const score = deltaX ** 2 + deltaY ** 2;
			const paneId = pane.dataset.paneId as PaneId | undefined;

			if (paneId && score < nearestScore) {
				nearestScore = score;
				nearestPaneId = paneId;
			}
		}

		if (nearestPaneId) {
			activePaneId = nearestPaneId;
		}
	}

	function handleKey(event: KeyboardEvent) {
		if (shouldIgnoreKeydown(event)) {
			return;
		}

		if (event.key === '?') {
			event.preventDefault();
			showHelp = !showHelp;
			return;
		}

		const directPane = shortcutToPaneId[event.key];
		if (directPane) {
			event.preventDefault();
			focusPane(directPane);
			return;
		}

		const directionByKey: Partial<Record<KeyboardEvent['key'], Direction>> = {
			ArrowLeft: 'left',
			ArrowRight: 'right',
			ArrowUp: 'up',
			ArrowDown: 'down'
		};

		const direction = directionByKey[event.key];
		if (!direction) {
			return;
		}

		event.preventDefault();
		focusPane(getNeighborPaneId(activePaneId, direction));
	}

	onMount(() => {
		const interval = setInterval(() => {
			time = new Date().toLocaleTimeString();
		}, 1000);

		if (isDesktopViewport()) {
			focusPane(activePaneId);
			queueViewportSync();
		}

		return () => {
			clearInterval(interval);
			cancelAnimationFrame(scrollSyncFrame);
		};
	});

	function handlePaneFocus(paneId: string) {
		activePaneId = paneId as PaneId;
	}

	function handleWorkspaceAppletClick(workspaceId: (typeof workspaces)[number]['id']) {
		focusPane(getFirstPaneIdForWorkspace(workspaceId));
	}

	$effect(() => {
		const request = $projectNavigationRequest;
		if (!request || typeof document === 'undefined') {
			return;
		}

		focusPane('projects');
	});

	$effect(() => {
		const targetPane = $returnToPane;
		if (!targetPane || typeof document === 'undefined') {
			return;
		}

		focusPane(targetPane);
		clearReturnToPane();
	});

	function toggleHelp() {
		showHelp = !showHelp;
	}
</script>

<svelte:window onkeydown={handleKey} />

<svelte:head>
	<title>Portfolio | {profile.name} {profile.lastName}</title>
</svelte:head>

<main
	class="flex h-full w-full flex-col bg-bg p-[var(--workspace-pane-gap)] font-mono text-fg antialiased md:h-screen md:max-h-screen"
>
	{#if showHelp}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-bg/90 p-4 backdrop-blur-sm">
			<div class="border border-border bg-surface p-6">
				<div class="mb-4 font-bold text-accent">~/help</div>
				<div class="grid grid-cols-[80px_1fr] gap-2 text-xs">
					<span class="text-dim">[1]-[6]</span> <span>Focus pane</span>
					<span class="text-dim">[←][→]</span> <span>Move across columns</span>
					<span class="text-dim">[↑][↓]</span> <span>Move stack / workspace</span>
					<span class="text-dim">[?]</span> <span>Toggle this help</span>
				</div>
				<button
					type="button"
					class="mt-6 border border-dim px-4 py-1 text-xs hover:border-highlight hover:bg-highlight hover:text-black"
					onclick={() => (showHelp = false)}
				>
					Close
				</button>
			</div>
		</div>
	{/if}

	<div class="flex flex-1 flex-col gap-[var(--workspace-pane-gap)] md:min-h-0">
		<div class="grid grid-cols-1 gap-[var(--workspace-pane-gap)] md:hidden">
			{#each mobilePaneOrder as pane (pane.id)}
				{@const PaneComponent = pane.component}
				<TwmPane
					id={pane.id}
					domId={`mobile-${pane.id}`}
					trackPane={false}
					title={pane.title}
					shortcut={pane.shortcut}
					className={pane.className ?? ''}
					{activePaneId}
					onFocus={handlePaneFocus}
				>
					<PaneComponent />
				</TwmPane>
			{/each}
		</div>

		<section
			class="workspace-stage hidden min-h-0 flex-1 overflow-hidden border border-border/70 bg-surface/30 p-[var(--workspace-pane-gap)] md:flex"
		>
			<div id={desktopViewportId} class="workspace-viewport flex-1" onscroll={queueViewportSync}>
				{#each workspaces as workspace (workspace.id)}
					<section id={`workspace-${workspace.id}`} class="workspace-sheet">
						<div
							class="workspace-rail"
							data-workspace-rail={workspace.id}
							onscroll={queueViewportSync}
						>
							{#each workspace.columns as column (column.id)}
								<div
									class={`workspace-column ${column.className}`}
									data-column-id={`${workspace.id}:${column.id}`}
								>
									{#each column.panes as pane (pane.id)}
										{@const PaneComponent = pane.component}
										<TwmPane
											id={pane.id}
											domId={pane.id}
											title={pane.title}
											shortcut={pane.shortcut}
											className={pane.className ?? ''}
											{activePaneId}
											onFocus={handlePaneFocus}
										>
											<PaneComponent />
										</TwmPane>
									{/each}
								</div>
							{/each}
						</div>
					</section>
				{/each}
			</div>
		</section>
	</div>

	<BottomBar
		name={profile.name}
		lastName={profile.lastName}
		onSelectWorkspace={handleWorkspaceAppletClick}
		activeWorkspaceId={activeWorkspace.id}
		{activePaneId}
		appletPlacements={bottomBarAppletPlacements}
		{workspaces}
		{time}
		role={profile.role}
		onToggleHelp={toggleHelp}
	/>
</main>
// fix shortcut conflicts
/* sync optimization */
/* remove listeners */

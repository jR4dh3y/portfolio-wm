<script lang="ts">
	import { fromStore } from 'svelte/store';
	import { onMount, untrack } from 'svelte';
	import { profile } from '$lib/data';
	import BottomBar from '$lib/components/twm/BottomBar.svelte';
	import SettingsModal from '$lib/components/twm/SettingsModal.svelte';
	import TwmPane from '$lib/components/twm/TwmPane.svelte';
	import {
		projectPaneFocusRequest,
		clearProjectPaneFocusRequest,
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
		type PaneMeta,
		type PaneId,
		type WorkspaceMeta
	} from '$lib/components/twm/layout';
	import { createWallpaperState } from '$lib/stores/wallpaper';
	import { createSettingsState } from '$lib/stores/settings';
	import type { PageData } from './$types';

	const desktopViewportId = 'workspace-viewport';

	type WorkspaceLayoutColumn = {
		id: string;
		className: string;
		panes?: PaneMeta[];
		children?: WorkspaceLayoutColumn[];
	};

	type WorkspaceLayoutMeta = Omit<WorkspaceMeta, 'columns'> & {
		columns: WorkspaceLayoutColumn[];
	};

	const workspaceLayout = workspaces as WorkspaceLayoutMeta[];

	function getColumnChildren(column: WorkspaceLayoutColumn): WorkspaceLayoutColumn[] {
		return column.children ?? [];
	}

	function getColumnPanes(column: WorkspaceLayoutColumn) {
		return column.panes ?? [];
	}

	let { data }: { data: PageData } = $props();

	let activePaneId = $state<PaneId>('hero');
	let time = $state(new Date().toLocaleTimeString());
	let scrollSyncFrame = 0;
	const wallpaperState = createWallpaperState(untrack(() => data.bundledWallpapers));
	const settingsState = createSettingsState();
	const blurEnabled = fromStore(settingsState.blurEnabled);
	const activeWallpaper = fromStore(wallpaperState.activeWallpaper);
	const wallpaperModalOpen = fromStore(wallpaperState.modalOpen);
	const wallpaperDraftUrl = fromStore(wallpaperState.draftUrl);
	const wallpaperErrorMessage = fromStore(wallpaperState.errorMessage);
	let activeWorkspaceId = $state<(typeof workspaceLayout)[number]['id']>('workspace-1');
	let activeWorkspace = $derived(getWorkspaceById(activeWorkspaceId));

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
		activeWorkspaceId = getWorkspaceIdForPane(paneId);

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
		column?.scrollIntoView({ behavior, block: 'nearest', inline: 'nearest' });
		pane?.scrollIntoView({ behavior, block: 'nearest', inline: 'nearest' });

		if (shouldFocus) {
			pane?.focus({ preventScroll: true });
		}
	}

	function focusWorkspace(workspaceId: (typeof workspaceLayout)[number]['id']) {
		activeWorkspaceId = workspaceId;

		if (!isDesktopViewport()) {
			const firstPaneId = getFirstPaneIdForWorkspace(workspaceId);
			if (firstPaneId) {
				focusPane(firstPaneId);
			}

			return;
		}

		const workspace = document.getElementById(`workspace-${workspaceId}`);
		workspace?.scrollIntoView({
			behavior: getScrollBehavior(),
			block: 'center',
			inline: 'nearest'
		});

		const firstPaneId = getFirstPaneIdForWorkspace(workspaceId);
		if (firstPaneId) {
			focusPane(firstPaneId);
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
		const workspaceEntries = workspaces
			.map((workspace) => {
				const element = document.getElementById(`workspace-${workspace.id}`);

				if (!element) {
					return null;
				}

				const rect = element.getBoundingClientRect();

				return {
					id: workspace.id,
					rect
				};
			})
			.filter((entry) => entry !== null);

		let nearestWorkspaceId: (typeof workspaces)[number]['id'] | null = null;
		let nearestWorkspaceScore = Number.POSITIVE_INFINITY;

		for (const workspace of workspaceEntries) {
			const deltaY = workspace.rect.top + workspace.rect.height / 2 - centerY;
			const score = deltaY ** 2;

			if (score < nearestWorkspaceScore) {
				nearestWorkspaceScore = score;
				nearestWorkspaceId = workspace.id;
			}
		}

		if (nearestWorkspaceId) {
			activeWorkspaceId = nearestWorkspaceId;
		}

		let nearestPaneId: PaneId | null = null;
		let nearestScore = Number.POSITIVE_INFINITY;

		for (const pane of document.querySelectorAll<HTMLElement>(
			`#workspace-${nearestWorkspaceId ?? activeWorkspaceId} [data-pane-id]`
		)) {
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
		if (wallpaperModalOpen.current) {
			if (event.key === 'Escape') {
				event.preventDefault();
				wallpaperState.closeModal();
			}

			return;
		}

		if (shouldIgnoreKeydown(event)) {
			return;
		}

		if (event.key === '?') {
			event.preventDefault();
			if (wallpaperModalOpen.current) {
				wallpaperState.closeModal();
			} else {
				wallpaperState.openModal();
			}
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
		const unsubscribeProjectPaneFocus = projectPaneFocusRequest.subscribe((nonce) => {
			if (!nonce || typeof document === 'undefined') {
				return;
			}

			clearProjectPaneFocusRequest();
			focusPane('projects');
		});

		const unsubscribeReturnToPane = returnToPane.subscribe((targetPane) => {
			if (!targetPane) {
				return;
			}

			clearReturnToPane();
			focusPane(targetPane);
		});

		const interval = setInterval(() => {
			time = new Date().toLocaleTimeString();
		}, 1000);

		if (isDesktopViewport()) {
			focusPane(activePaneId);
			queueViewportSync();
		}

		return () => {
			unsubscribeProjectPaneFocus();
			unsubscribeReturnToPane();
			clearInterval(interval);
			cancelAnimationFrame(scrollSyncFrame);
		};
	});

	function handlePaneFocus(paneId: string) {
		activePaneId = paneId as PaneId;
	}

	function handleWorkspaceAppletClick(workspaceId: (typeof workspaceLayout)[number]['id']) {
		focusWorkspace(workspaceId);
	}

	function handleOpenSettings() {
		wallpaperState.openModal();
	}

	function handleWallpaperError() {
		wallpaperState.fallbackFromFailedWallpaper();
	}
</script>

<svelte:window onkeydown={handleKey} />

<svelte:head>
	<title>Portfolio | {profile.name} {profile.lastName}</title>
</svelte:head>

<main
	class="relative flex h-full w-full flex-col overflow-hidden bg-bg p-[var(--workspace-pane-gap)] font-mono text-fg antialiased md:h-screen md:max-h-screen {blurEnabled.current
		? 'blur-enabled'
		: ''}"
>
	{#if activeWallpaper.current}
		<div class="pointer-events-none absolute inset-0 hidden md:block">
			<img
				src={activeWallpaper.current.url}
				alt={activeWallpaper.current.label}
				class="h-full w-full object-cover"
				onerror={handleWallpaperError}
			/>
			<div class="absolute inset-0 bg-linear-to-br from-bg/55 via-bg/35 to-bg/70"></div>
		</div>
	{/if}

	{#if wallpaperModalOpen.current}
		<SettingsModal
			errorMessage={wallpaperErrorMessage.current}
			inputValue={wallpaperDraftUrl.current}
			blurEnabled={blurEnabled.current}
			onClose={wallpaperState.closeModal}
			onInput={wallpaperState.updateDraftUrl}
			onSave={wallpaperState.saveCustomWallpaper}
			onToggleBlur={settingsState.toggleBlur}
		/>
	{/if}

	<div class="relative z-10 flex flex-1 flex-col gap-[var(--workspace-pane-gap)] md:min-h-0">
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

		<section class="hidden min-h-0 flex-1 overflow-hidden md:flex">
			<div id={desktopViewportId} class="workspace-viewport flex-1" onscroll={queueViewportSync}>
				{#each workspaceLayout as workspace (workspace.id)}
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
									{#if getColumnChildren(column).length}
										{#each getColumnChildren(column) as child (child.id)}
											<div
												class={`workspace-column ${child.className}`}
												data-column-id={`${workspace.id}:${child.id}`}
											>
												{#if getColumnChildren(child).length}
													{#each getColumnChildren(child) as nested (nested.id)}
														<div
															class={`workspace-column ${nested.className}`}
															data-column-id={`${workspace.id}:${nested.id}`}
														>
															{#each getColumnPanes(nested) as pane (pane.id)}
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
												{:else}
													{#each getColumnPanes(child) as pane (pane.id)}
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
												{/if}
											</div>
										{/each}
									{:else}
										{#each getColumnPanes(column) as pane (pane.id)}
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
									{/if}
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
		onCycleWallpaper={wallpaperState.cycleWallpaper}
		onOpenSettings={handleOpenSettings}
	/>
</main>

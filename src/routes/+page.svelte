<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { profile } from '$lib/data';
	import BottomBar from '$lib/components/twm/BottomBar.svelte';
	import SettingsModal from '$lib/components/twm/SettingsModal.svelte';
	import CheatLoadingScreen from '$lib/components/twm/CheatLoadingScreen.svelte';
	import TwmPane from '$lib/components/twm/TwmPane.svelte';
	import {
		projectPaneFocusRequest,
		clearProjectPaneFocusRequest,
		returnToPane,
		clearReturnToPane
	} from '$lib/stores/project-navigation';
	import MobileLanding from '$lib/components/MobileLanding.svelte';
	import {
		bottomBarAppletPlacements,
		getFirstPaneIdForWorkspace,
		getNeighborPaneId,
		getWorkspaceById,
		getWorkspaceIdForPane,
		shortcutToPaneId,
		workspaces,
		type Direction,
		type PaneMeta,
		type PaneId,
		type WorkspaceMeta,
		type WorkspaceId
	} from '$lib/components/twm/layout';
	import { WallpaperState } from '$lib/stores/wallpaper.svelte';
	import { SettingsState } from '$lib/stores/settings.svelte';
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
	const initialIsMobile = untrack(() => data.isMobileRequest);
	const wallpaperState = new WallpaperState(untrack(() => data.bundledWallpapers));
	const settingsState = new SettingsState();
	let activeWorkspaceId = $state<(typeof workspaceLayout)[number]['id']>('workspace-1');
	let activeWorkspace = $derived(getWorkspaceById(activeWorkspaceId));

	let isDesktop = $state(
		typeof window !== 'undefined'
			? window.matchMedia('(min-width: 48rem)').matches
			: !initialIsMobile
	);
	let prefersReducedMotion = $state(
		typeof window !== 'undefined'
			? window.matchMedia('(prefers-reduced-motion: reduce)').matches
			: false
	);

	function getScrollBehavior(): ScrollBehavior {
		return prefersReducedMotion ? 'auto' : 'smooth';
	}

	function focusPane(paneId: PaneId, shouldFocus = true) {
		activePaneId = paneId;
		activeWorkspaceId = getWorkspaceIdForPane(paneId);

		if (!isDesktop) {
			return;
		}

		const behavior = getScrollBehavior();
		const pane = document.getElementById(`pane-${paneId}`);
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

		if (!isDesktop) {
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
			focusPane(firstPaneId, false);
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
		if (!isDesktop) {
			return;
		}

		if (scrollSyncFrame) {
			cancelAnimationFrame(scrollSyncFrame);
		}

		scrollSyncFrame = requestAnimationFrame(syncActivePaneFromViewport);
	}

	let cachedWorkspaceElements: { id: WorkspaceId; element: HTMLElement }[] | null = null;
	let cachedPanesByWorkspace: Record<string, HTMLElement[]> = {};

	function getWorkspaceElements(): { id: WorkspaceId; element: HTMLElement }[] {
		if (!cachedWorkspaceElements) {
			const elements = workspaces.map((workspace) => ({
				id: workspace.id,
				element: document.getElementById(`workspace-${workspace.id}`)
			}));
			cachedWorkspaceElements = elements.filter(
				(w): w is { id: WorkspaceId; element: HTMLElement } => w.element !== null
			);
		}
		return cachedWorkspaceElements;
	}

	function getWorkspacePanes(workspaceId: string): HTMLElement[] {
		if (!cachedPanesByWorkspace[workspaceId]) {
			const panes = Array.from(
				document.querySelectorAll<HTMLElement>(`#workspace-${workspaceId} [data-pane-id]`)
			);
			cachedPanesByWorkspace[workspaceId] = panes;
		}
		return cachedPanesByWorkspace[workspaceId];
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

		const workspaceEntries = getWorkspaceElements().map((w) => ({
			id: w.id as (typeof workspaces)[number]['id'],
			rect: w.element.getBoundingClientRect()
		}));

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
		const targetWorkspaceId = nearestWorkspaceId ?? activeWorkspaceId;

		for (const pane of getWorkspacePanes(targetWorkspaceId)) {
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
		if (wallpaperState.modalOpen) {
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
			if (wallpaperState.modalOpen) {
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
		const desktopMq = window.matchMedia('(min-width: 48rem)');
		const desktopHandler = (e: MediaQueryListEvent) => (isDesktop = e.matches);
		desktopMq.addEventListener('change', desktopHandler);

		const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
		const motionHandler = (e: MediaQueryListEvent) => (prefersReducedMotion = e.matches);
		motionMq.addEventListener('change', motionHandler);

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

		let timeoutId: ReturnType<typeof setTimeout>;
		function tickTime() {
			time = new Date().toLocaleTimeString();
			const msToNextSecond = 1000 - new Date().getMilliseconds();
			timeoutId = setTimeout(tickTime, msToNextSecond);
		}
		tickTime();

		if (isDesktop) {
			focusPane(activePaneId);
			queueViewportSync();
		}

		return () => {
			desktopMq.removeEventListener('change', desktopHandler);
			motionMq.removeEventListener('change', motionHandler);
			unsubscribeProjectPaneFocus();
			unsubscribeReturnToPane();
			clearTimeout(timeoutId);
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

	let isPaneFocused = $state(false);

	$effect(() => {
		if (activeWorkspaceId && typeof document !== 'undefined') {
			const activeEl = document.activeElement as HTMLElement | null;
			const paneEl = activeEl?.closest('.pane') as HTMLElement | null;
			if (paneEl) {
				const paneId = paneEl.dataset.paneId as PaneId | undefined;
				if (paneId && getWorkspaceIdForPane(paneId) !== activeWorkspaceId) {
					activeEl?.blur();
				}
			}
		}
	});

	function handleFocusIn(event: FocusEvent) {
		const target = event.target as HTMLElement | null;
		if (target && typeof target.closest === 'function' && target.closest('.pane')) {
			isPaneFocused = true;
		}
	}

	function handleFocusOut(event: FocusEvent) {
		const relatedTarget = event.relatedTarget as HTMLElement | null;
		if (
			!relatedTarget ||
			(typeof relatedTarget.closest === 'function' && !relatedTarget.closest('.pane'))
		) {
			isPaneFocused = false;
		}
	}
</script>

<svelte:window
	onkeydown={handleKey}
	onfocusin={handleFocusIn}
	onfocusout={handleFocusOut}
	onblur={() => (isPaneFocused = false)}
/>

<svelte:head>
	<title>Portfolio | {profile.name} {profile.lastName}</title>
</svelte:head>

<main
	class="relative flex h-full w-full flex-col overflow-hidden bg-bg p-[var(--workspace-pane-gap)] font-mono text-fg antialiased md:h-screen md:max-h-screen {settingsState.blurEnabled
		? 'blur-enabled'
		: ''}"
>
	{#if wallpaperState.activeWallpaper}
		<div class="pointer-events-none absolute inset-0 hidden md:block">
			<img
				src={wallpaperState.activeWallpaper.url}
				alt={wallpaperState.activeWallpaper.label}
				class="h-full w-full object-cover"
				onerror={handleWallpaperError}
			/>
			<div class="absolute inset-0 bg-linear-to-br from-bg/55 via-bg/35 to-bg/70"></div>
		</div>
	{/if}

	{#if wallpaperState.modalOpen}
		<SettingsModal
			errorMessage={wallpaperState.errorMessage}
			inputValue={wallpaperState.draftUrl}
			blurEnabled={settingsState.blurEnabled}
			onClose={wallpaperState.closeModal}
			onInput={wallpaperState.updateDraftUrl}
			onSave={wallpaperState.saveCustomWallpaper}
			onToggleBlur={settingsState.toggleBlur}
		/>
	{/if}

	<div class="relative z-10 flex flex-1 flex-col gap-[var(--workspace-pane-gap)] md:min-h-0">
		{#if !isDesktop}
			<MobileLanding />
		{:else}
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
		{/if}
	</div>

	{#if isDesktop}
		<BottomBar
			name={profile.name}
			lastName={profile.lastName}
			onSelectWorkspace={handleWorkspaceAppletClick}
			activeWorkspaceId={activeWorkspace.id}
			activePaneId={isPaneFocused ? activePaneId : 'none'}
			appletPlacements={bottomBarAppletPlacements}
			{workspaces}
			{time}
			role={profile.role}
			isWallpaperLoading={wallpaperState.isCycling}
			onCycleWallpaper={wallpaperState.cycleWallpaper}
			onOpenSettings={handleOpenSettings}
		/>

		<CheatLoadingScreen />
	{/if}
</main>

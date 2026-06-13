<script lang="ts">
	import { onMount } from 'svelte';
	import { projects as defaultProjects } from '$lib/data';
	import ProjectCard from '$lib/components/twm/projects/ProjectCard.svelte';
	import ProjectDetailView from '$lib/components/twm/projects/ProjectDetailView.svelte';
	import { getProjectsContext } from '$lib/project-context';
	import {
		projectNavigationRequest,
		projectDetailCloseRequest,
		navigateBack,
		clearProjectPaneFocusRequest,
		requestProjectDetailClose
	} from '$lib/stores/project-navigation';
	import type { PaneId } from '$lib/components/twm/layout';

	const contextProjects = getProjectsContext();
	const projects = contextProjects ?? defaultProjects;
	const projectsListContainerId = 'projects-list-container';

	let selectedProjectIndex = $state<number | null>(null);
	let lastFocusedCardId = $state('');
	let projectsListScrollTop = 0;
	let sourcePane = $state<PaneId>('projects');

	let selectedProject = $derived(
		selectedProjectIndex === null ? null : projects[selectedProjectIndex]
	);

	function toProjectSlug(value: string): string {
		return value
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)+/g, '');
	}

	function getProjectsListContainer(): HTMLDivElement | null {
		return document.getElementById(projectsListContainerId) as HTMLDivElement | null;
	}

	function openProject(index: number, nextSourcePane: PaneId = 'projects') {
		projectsListScrollTop = getProjectsListContainer()?.scrollTop ?? projectsListScrollTop;
		lastFocusedCardId = `project-card-${index}`;
		sourcePane = nextSourcePane;
		selectedProjectIndex = index;
	}

	function openProjectFromProjects(index: number) {
		clearProjectPaneFocusRequest();
		openProject(index, 'projects');
	}

	function closeProject() {
		const originSourcePane = sourcePane;
		const focusedCardId = lastFocusedCardId;
		selectedProjectIndex = null;
		lastFocusedCardId = '';
		sourcePane = 'projects';
		requestProjectDetailClose();

		// If we came from another pane, navigate back to it
		if (originSourcePane !== 'projects') {
			clearProjectPaneFocusRequest();
			navigateBack(originSourcePane);
			return;
		}

		requestAnimationFrame(() => {
			const projectsListContainer = getProjectsListContainer();
			projectsListContainer?.scrollTo({ top: projectsListScrollTop });
		});

		if (!focusedCardId) {
			return;
		}

		requestAnimationFrame(() => {
			document.getElementById(focusedCardId)?.focus({ preventScroll: true });
		});
	}

	function handleProjectsListScroll(event: Event) {
		projectsListScrollTop = (event.currentTarget as HTMLDivElement).scrollTop;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key !== 'Escape' || selectedProjectIndex === null) {
			return;
		}

		event.preventDefault();
		closeProject();
	}

	let lastProcessedNavigationNonce = 0;
	let lastProcessedCloseNonce = 0;

	onMount(() => {
		const unsubscribeNavigation = projectNavigationRequest.subscribe((request) => {
			if (!request || request.nonce === lastProcessedNavigationNonce) {
				return;
			}

			lastProcessedNavigationNonce = request.nonce;

			const nextIndex = projects.findIndex((project) => {
				const projectSlug = project.slug ?? toProjectSlug(project.title);
				return projectSlug === request.slug;
			});

			if (nextIndex === -1) {
				return;
			}

			openProject(nextIndex, request.sourcePane ?? 'projects');
		});

		const unsubscribeClose = projectDetailCloseRequest.subscribe((closeRequest) => {
			if (!closeRequest || closeRequest === lastProcessedCloseNonce) {
				return;
			}

			lastProcessedCloseNonce = closeRequest;
			selectedProjectIndex = null;
			lastFocusedCardId = '';
			sourcePane = 'projects';
		});

		return () => {
			unsubscribeNavigation();
			unsubscribeClose();
		};
	});
</script>

<svelte:window onkeydown={handleKeydown} />

{#if selectedProject}
	<ProjectDetailView project={selectedProject} onBack={closeProject} />
{:else}
	<div
		id={projectsListContainerId}
		class="no-scrollbar h-full w-full overflow-y-auto p-4 sm:p-8"
		onscroll={handleProjectsListScroll}
	>
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
			{#each projects as project, index (project.title)}
				<ProjectCard
					{project}
					cardId={`project-card-${index}`}
					onOpen={() => openProjectFromProjects(index)}
				/>
			{/each}
		</div>
	</div>
{/if}

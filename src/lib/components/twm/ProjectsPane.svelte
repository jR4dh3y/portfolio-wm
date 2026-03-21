<script lang="ts">
	import { projects } from '$lib/data';
	import ProjectCard from '$lib/components/twm/projects/ProjectCard.svelte';
	import ProjectDetailView from '$lib/components/twm/projects/ProjectDetailView.svelte';
	import type { PaneId } from '$lib/components/twm/layout';

	let {
		selectedProjectSlug = null,
		sourcePane = 'projects',
		onOpenProject = () => {},
		onCloseProject = () => {}
	}: {
		selectedProjectSlug?: string | null;
		sourcePane?: PaneId;
		onOpenProject?: (slug: string, sourcePane: PaneId) => void;
		onCloseProject?: (sourcePane: PaneId) => void;
	} = $props();

	let lastFocusedCardId = $state('');
	let projectsListContainer = $state<HTMLDivElement | null>(null);
	let projectsListScrollTop = $state(0);

	let selectedProject = $derived(
		selectedProjectSlug
			? (projects.find((project) => {
					const projectSlug = project.slug ?? toProjectSlug(project.title);
					return projectSlug === selectedProjectSlug;
				}) ?? null)
			: null
	);

	function toProjectSlug(value: string): string {
		return value
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)+/g, '');
	}

	function openProject(index: number) {
		projectsListScrollTop = projectsListContainer?.scrollTop ?? projectsListScrollTop;
		lastFocusedCardId = `project-card-${index}`;
		onOpenProject(projects[index].slug ?? toProjectSlug(projects[index].title), 'projects');
	}

	function closeProject() {
		const originSourcePane = sourcePane;
		const focusedCardId = lastFocusedCardId;
		onCloseProject(originSourcePane);

		// If we came from another pane, navigate back to it
		if (originSourcePane !== 'projects') {
			return;
		}

		requestAnimationFrame(() => {
			if (projectsListContainer) {
				projectsListContainer.scrollTop = projectsListScrollTop;
			}
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
		if (event.key !== 'Escape' || !selectedProject) {
			return;
		}

		event.preventDefault();
		closeProject();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if selectedProject}
	<ProjectDetailView project={selectedProject} onBack={closeProject} />
{:else}
	<div
		class="no-scrollbar h-full w-full overflow-y-auto p-4 sm:p-8"
		bind:this={projectsListContainer}
		onscroll={handleProjectsListScroll}
	>
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
			{#each projects as project, index (project.title)}
				<ProjectCard {project} cardId={`project-card-${index}`} onOpen={() => openProject(index)} />
			{/each}
		</div>
	</div>
{/if}

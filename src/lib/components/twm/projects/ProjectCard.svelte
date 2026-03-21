<script lang="ts">
	import { ArrowUpRight, Github } from 'lucide-svelte';
	import type { Project } from '$lib/data';

	let {
		project,
		cardId,
		onOpen
	}: {
		project: Project;
		cardId: string;
		onOpen: () => void;
	} = $props();
</script>

<article
	class="group relative flex min-h-72 w-full flex-col justify-end overflow-hidden border border-border bg-surface transition-colors hover:border-highlight sm:aspect-[4/3]"
>
	<button
		type="button"
		id={cardId}
		onclick={onOpen}
		aria-label={`Open details for ${project.title}`}
		class="absolute inset-0 z-10 cursor-pointer focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[-1px] focus-visible:outline-highlight"
	></button>

	<div class="absolute inset-0 z-0 bg-bg">
		<img
			src={project.image}
			alt={project.title}
			class="h-full w-full object-cover opacity-50 grayscale transition-all duration-700 group-hover:opacity-100 group-hover:grayscale-0"
		/>
		<div
			class="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-60"
		></div>
	</div>

	<div
		class="absolute top-4 right-4 z-20 flex gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100"
	>
		<a
			href={project.githubUrl}
			target="_blank"
			rel="noopener noreferrer"
			aria-label={`Open ${project.title} source code`}
			class="border border-border bg-surface p-2 text-dim transition-colors hover:border-highlight hover:bg-highlight hover:text-black"
		>
			<Github class="h-4 w-4" aria-hidden="true" />
		</a>
		{#if project.liveUrl}
			<a
				href={project.liveUrl}
				target="_blank"
				rel="noopener noreferrer"
				aria-label={`Open ${project.title} live site`}
				class="border border-border bg-surface p-2 text-dim transition-colors hover:border-highlight hover:bg-highlight hover:text-black"
			>
				<ArrowUpRight class="h-4 w-4" aria-hidden="true" />
			</a>
		{/if}
	</div>

	<div
		class="pointer-events-none absolute inset-0 z-20 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100"
	>
		<span
			class="border border-border bg-surface/90 px-3 py-1 font-mono text-[10px] text-highlight uppercase"
		>
			[click to expand]
		</span>
	</div>

	<div class="pointer-events-none relative z-10 p-5 sm:p-6">
		<div class="relative">
			<h3
				class="text-xl font-bold tracking-tight text-fg uppercase transition-all duration-300 ease-out group-hover:translate-y-[2.75rem] group-hover:text-highlight sm:text-2xl"
			>
				{project.title}
			</h3>
		</div>

		<div class="mt-3 h-8 overflow-hidden transition-opacity duration-200 group-hover:opacity-0">
			<div class="flex h-full items-center gap-2 overflow-hidden">
				{#each project.tags.slice(0, 5) as tag (tag)}
					<span
						class="shrink-0 border border-border bg-bg/50 px-2 py-1 font-mono text-[10px] whitespace-nowrap text-highlight backdrop-blur-md transition-colors group-hover:border-highlight/50 group-hover:text-highlight"
					>
						{tag}
					</span>
				{/each}
			</div>
		</div>
	</div>
</article>

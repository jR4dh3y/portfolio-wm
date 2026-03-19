<script lang="ts">
	import type { Project } from '$lib/data';
	import * as Lucide from 'lucide-svelte';

	let {
		project,
		onBack
	}: {
		project: Project;
		onBack: () => void;
	} = $props();
</script>

<section
	class="flex h-full w-full flex-col gap-6 p-4 sm:p-8"
	aria-label={`${project.title} project details`}
>
	<div class="relative aspect-video w-full overflow-hidden border border-border bg-bg">
		<img src={project.image} alt={project.title} class="h-full w-full object-cover" />
		<div class="absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-transparent"></div>
		<div class="absolute top-4 right-4 z-10 flex flex-wrap items-center gap-2">
			<button
				type="button"
				onclick={onBack}
				class="inline-flex items-center gap-2 border border-border bg-surface px-3 py-1.5 font-mono text-[10px] text-dim uppercase transition-colors hover:border-highlight hover:bg-highlight hover:text-black"
				aria-label="Back to projects list"
			>
				<Lucide.ChevronLeft size={14} />
				Back
			</button>
		</div>
		<div class="absolute right-4 bottom-4 left-4 flex flex-wrap items-end justify-between gap-3">
			<h3 class="text-2xl font-bold tracking-tight text-fg uppercase sm:text-3xl">
				{project.title}
			</h3>
			<div class="flex gap-2">
				<a
					href={project.githubUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 border border-border bg-surface px-3 py-1.5 font-mono text-[10px] text-dim uppercase transition-colors hover:border-highlight hover:bg-highlight hover:text-black"
					aria-label={`Open ${project.title} source code`}
				>
					<Lucide.Github size={14} />
					Source
				</a>
				{#if project.liveUrl}
					<a
						href={project.liveUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex items-center gap-2 border border-border bg-surface px-3 py-1.5 font-mono text-[10px] text-dim uppercase transition-colors hover:border-highlight hover:bg-highlight hover:text-black"
						aria-label={`Open ${project.title} live site`}
					>
						<Lucide.ArrowUpRight size={14} />
						Live
					</a>
				{/if}
			</div>
		</div>
	</div>

	<div class="flex flex-col gap-4">
		{#each project.desc as para, i (i)}
			<p class="text-sm leading-7 text-fg/80 md:text-[15px]">{para}</p>
		{/each}
	</div>

	<div class="mt-auto flex flex-wrap gap-2">
		{#each project.tags as tag (tag)}
			<span
				class="border border-border bg-bg/50 px-2 py-1 font-mono text-[10px] text-highlight backdrop-blur-md"
			>
				{tag}
			</span>
		{/each}
	</div>
</section>

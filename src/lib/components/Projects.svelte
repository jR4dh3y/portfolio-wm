<script lang="ts">
	import { projects } from '$lib/data';
	import { Github, ArrowUpRight } from 'lucide-svelte';

	const flagships = projects.slice(0, 4);
	const others = projects.slice(4);
</script>

<section id="work" class="bg-grid w-full border-b-2 border-foreground py-24">
	<div class="container mx-auto px-4">
		<div
			class="mb-16 flex items-center justify-between border-b-2 border-[var(--color-primary)] pb-4"
		>
			<h2
				class="font-syne text-5xl font-black tracking-tighter text-foreground uppercase md:text-8xl"
			>
				Projects
			</h2>
			<div class="hidden gap-2 md:flex">
				<span class="font-mono text-xl font-bold text-[var(--color-secondary)]"
					>[ {projects.length} ]</span
				>
			</div>
		</div>

		<div class="mb-24 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
			{#each flagships as project, index (project.title)}
				<article
					class="group brutalist-border relative flex flex-col overflow-hidden bg-[var(--color-background)] transition-all duration-300"
				>
					<div
						class="absolute top-0 right-0 z-10 -mt-8 -mr-8 h-16 w-16 rotate-45 bg-[var(--color-primary)] opacity-0 transition-opacity group-hover:opacity-100"
					></div>

					<!-- Header -->
					<header class="flex items-start justify-between border-b-2 border-foreground p-6 md:p-8">
						<div class="w-full">
							<span class="mb-2 block font-mono text-sm font-bold text-[var(--color-primary)]"
								>0{index + 1}.</span
							>
							<h3 class="pr-8 font-syne text-3xl font-bold tracking-tight break-words uppercase">
								{project.title}
							</h3>
						</div>

						<div class="flex shrink-0 gap-4">
							{#if project.githubUrl}
								<a
									href={project.githubUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="transition-colors hover:text-[var(--color-secondary)]"
									aria-label="GitHub Repository"
								>
									<Github class="h-6 w-6" />
								</a>
							{/if}
							{#if project.liveUrl}
								<a
									href={project.liveUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="transition-colors hover:text-[var(--color-secondary)]"
									aria-label="Live Project"
								>
									<ArrowUpRight class="h-6 w-6" />
								</a>
							{/if}
						</div>
					</header>

					<!-- Body -->
					<div class="flex flex-1 flex-col justify-between p-6 md:p-8">
						<p class="mb-8 font-mono text-sm leading-relaxed text-gray-400 md:text-base">
							{project.desc}
						</p>

						<!-- Tags -->
						<div class="mt-auto flex flex-wrap gap-2">
							{#each project.tags as tag (tag)}
								<span
									class="border border-[var(--color-secondary)]/50 bg-[var(--color-secondary)]/5 px-3 py-1 font-mono text-xs text-[var(--color-secondary)]"
								>
									{tag}
								</span>
							{/each}
						</div>
					</div>
				</article>
			{/each}
		</div>

		<!-- Other Projects -->
		<h3
			class="mb-8 inline-block border-b-2 border-[var(--color-secondary)] pb-2 font-syne text-3xl font-black tracking-tighter text-foreground uppercase"
		>
			More Experiments
		</h3>

		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each others as project (project.title)}
				<article
					class="brutalist-border flex h-full flex-col bg-[var(--color-card)] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--color-primary)]"
				>
					<div class="mb-4 flex items-start justify-between">
						<h4 class="font-syne text-xl font-bold tracking-tight text-foreground uppercase">
							{project.title}
						</h4>
						<div class="flex shrink-0 gap-3">
							{#if project.githubUrl}
								<a
									href={project.githubUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="text-gray-400 transition-colors hover:text-[var(--color-secondary)]"
									aria-label="GitHub Repository"
								>
									<Github class="h-5 w-5" />
								</a>
							{/if}
							{#if project.liveUrl}
								<a
									href={project.liveUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="text-gray-400 transition-colors hover:text-[var(--color-secondary)]"
									aria-label="Live Project"
								>
									<ArrowUpRight class="h-5 w-5" />
								</a>
							{/if}
						</div>
					</div>

					<p class="mb-6 flex-1 font-mono text-sm leading-relaxed text-gray-400">
						{project.desc}
					</p>

					<div class="mt-auto flex flex-wrap gap-2">
						{#each project.tags as tag (tag)}
							<span class="font-mono text-xs font-bold text-[var(--color-primary)]">
								#{tag.toLowerCase().replace(/\s+/g, '')}
							</span>
						{/each}
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<script lang="ts">
	import { homelab } from '$lib/data';
	import { navigateToProject } from '$lib/stores/project-navigation';

	function openProjectFromHomelab(slug: string) {
		navigateToProject(slug, 'homelab');
	}
</script>

<div class="flex h-full w-full flex-col gap-4 p-4">
	<div class="flex flex-col gap-3">
		{#each homelab.paragraphs as paragraph, i (i)}
			<p class="font-mono text-sm leading-7 text-fg/85 md:text-[15px]">
				{paragraph}
			</p>
		{/each}
		<p class="font-mono text-sm leading-7 text-fg/85 md:text-[15px]">
			Some of my own projects run here:
			<button
				type="button"
				onclick={() => openProjectFromHomelab(homelab.featuredProjects.boxbox.slug)}
				class="font-semibold text-accent underline underline-offset-2 hover:bg-highlight hover:text-black"
			>
				{homelab.featuredProjects.boxbox.label}
			</button>,
			<button
				type="button"
				onclick={() => openProjectFromHomelab(homelab.featuredProjects.vidown.slug)}
				class="font-semibold text-accent underline underline-offset-2 hover:bg-highlight hover:text-black"
			>
				{homelab.featuredProjects.vidown.label}
			</button>, and
			<button
				type="button"
				onclick={() => openProjectFromHomelab(homelab.featuredProjects.anyConverter.slug)}
				class="font-semibold text-accent underline underline-offset-2 hover:bg-highlight hover:text-black"
			>
				{homelab.featuredProjects.anyConverter.label}
			</button>. Server configs and docker-compose files are in my
			<a
				href={homelab.repo.href}
				target="_blank"
				rel="noopener noreferrer"
				class="font-semibold text-accent underline underline-offset-2 hover:bg-highlight hover:text-black"
			>
				{homelab.repo.label}
			</a>
			repo.
		</p>
		<div class="flex flex-wrap gap-2">
			{#each homelab.technologies as tech (tech)}
				<span class="border border-border bg-surface px-2.5 py-1 font-mono text-xs text-accent">
					{tech}
				</span>
			{/each}
		</div>
	</div>
</div>

<script lang="ts">
	import { StepBack } from 'lucide-svelte';
	import { experience } from '$lib/data';
</script>

<div class="flex h-full w-full flex-col gap-12 p-4 sm:p-8">
	<section>
		<div class="flex flex-col gap-8 border-l border-border pl-4">
			{#each experience as exp (exp.role)}
				<div class="relative flex flex-col gap-1">
					<div class="absolute top-1.5 -left-[21px] h-2 w-2 bg-accent"></div>
					<div class="font-mono text-[10px] text-accent">{exp.period}</div>
					<h3 class="text-xl font-bold text-fg uppercase">{exp.role}</h3>
					<div class="mb-2 font-mono text-xs text-dim">@ {exp.company}</div>
					<p class="text-sm leading-relaxed whitespace-pre-line text-fg/80">
						{exp.description}
					</p>

					{#if exp.links && exp.links.length > 0}
						<div class="mt-4 flex flex-wrap gap-4">
							{#each exp.links as link (link.label)}
								<a
									href={link.href}
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex items-center gap-1 border-b border-dim pb-0.5 font-mono text-[10px] text-dim transition-colors hover:border-highlight hover:bg-highlight hover:text-black"
								>
									{link.label}
									<StepBack class="h-3 w-3 rotate-180" aria-hidden="true" />
								</a>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</section>
</div>

<script lang="ts">
	import { experience } from '$lib/data';
	import { ExternalLink } from 'lucide-svelte';
</script>

<section
	id="experience"
	class="w-full border-b-2 border-foreground bg-[var(--color-background)] py-24"
>
	<div class="container mx-auto px-4">
		<div class="mb-16">
			<h2
				class="font-syne text-5xl font-black tracking-tighter text-transparent uppercase md:text-8xl"
				style="-webkit-text-stroke: 1px var(--color-secondary); text-stroke: 1px var(--color-secondary);"
			>
				Experience
			</h2>
		</div>

		<div
			class="relative ml-auto flex max-w-5xl flex-col gap-12 border-l-4 border-foreground pl-8 md:pl-16"
		>
			{#each experience as exp (exp.company + exp.role)}
				<div class="group relative">
					<div
						class="absolute top-0 -left-[42px] h-6 w-6 border-4 border-background bg-[var(--color-secondary)] transition-colors group-hover:bg-[var(--color-primary)] md:-left-[74px]"
					></div>

					<div class="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
						<div>
							<h3 class="font-syne text-2xl font-bold text-foreground uppercase md:text-3xl">
								{exp.role}
							</h3>
							<h4 class="mt-1 font-mono text-lg text-[var(--color-primary)] md:text-xl">
								{exp.company}
							</h4>
						</div>
						<div
							class="border-2 border-[var(--color-secondary)] px-3 py-1 font-mono text-sm whitespace-nowrap text-[var(--color-secondary)] md:text-base"
						>
							{exp.period}
						</div>
					</div>

					<p
						class="mb-6 font-mono text-sm leading-relaxed whitespace-pre-line text-gray-300 md:text-base"
					>
						{exp.description}
					</p>

					<div class="flex flex-col gap-4">
						{#if exp.links.length > 0}
							<div class="flex flex-wrap gap-4">
								{#each exp.links as link (link.href)}
									<a
										href={link.href}
										target="_blank"
										rel="noopener noreferrer"
										class="inline-flex items-center gap-2 border-b border-transparent pb-1 font-mono text-sm text-foreground transition-all hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)]"
									>
										<ExternalLink class="h-4 w-4" />
										{link.label}
									</a>
								{/each}
							</div>
						{/if}

						<div class="flex flex-wrap gap-2">
							{#each exp.skills as skill (skill)}
								<span
									class="brutalist-border bg-foreground px-2 py-1 font-mono text-xs font-bold text-background uppercase transition-transform hover:-translate-y-1"
								>
									{skill}
								</span>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

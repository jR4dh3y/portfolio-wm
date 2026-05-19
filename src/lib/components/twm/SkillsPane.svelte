<script lang="ts">
	import { skills } from '$lib/data';

	function toCommandName(title: string): string {
		return title
			.toLowerCase()
			.replaceAll('&', 'and')
			.replaceAll(/[^a-z0-9]+/g, '-')
			.replaceAll(/(^-|-$)+/g, '');
	}
</script>

<div class="h-full min-h-0 w-full overflow-hidden bg-bg/25 p-2 sm:p-3">
	<div class="grid h-full min-h-0 grid-cols-1 gap-2 sm:grid-cols-2">
		{#each skills as group (group.title)}
			<section class="min-h-0 overflow-hidden border border-highlight/70 bg-surface/25 p-3">
				<div class="flex h-full min-h-0 flex-col gap-3">
					<div class="flex shrink-0 items-center gap-2.5">
						<h3 class="font-mono text-sm font-bold tracking-[0.14em] text-fg uppercase">
							./{toCommandName(group.title)}
						</h3>
						<span class="h-px min-w-4 flex-1 bg-highlight/70"></span>
					</div>

					<div
						class="flex min-h-0 flex-1 flex-wrap content-start items-baseline gap-x-2 gap-y-2 overflow-hidden"
					>
						{#each group.skills as skill, skillIndex (skill.name)}
							<span class="font-mono text-sm whitespace-nowrap text-fg/85">
								{skill.name}
							</span>
							{#if skillIndex < group.skills.length - 1}
								<span class="font-mono text-xs text-dim/45" aria-hidden="true">/</span>
							{/if}
						{/each}
					</div>
				</div>
			</section>
		{/each}
	</div>
</div>

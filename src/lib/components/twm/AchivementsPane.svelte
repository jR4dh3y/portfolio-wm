<script lang="ts">
	import { achievements } from '$lib/data';
</script>

<div class="h-full min-h-0 w-full p-4 sm:p-8">
	<section class="h-full min-h-0 overflow-auto pr-2">
		<div class="flex flex-col gap-8 border-l border-border pl-4">
			{#each achievements as achievement (achievement.title)}
				<article class="relative flex flex-col gap-1">
					<div class="absolute top-1.5 -left-5.25 h-2 w-2 bg-highlight"></div>
					<div class="font-mono text-[10px] text-highlight">{achievement.period}</div>
					<h3 class="text-xl font-bold text-fg uppercase">{achievement.title}</h3>
					<div class="mb-2 font-mono text-xs text-dim">
						@ {achievement.organization} / {achievement.location}
					</div>
					<ul class="flex list-disc flex-col gap-2 pl-4 text-sm leading-relaxed text-fg/80">
						{#each achievement.highlights as highlight (highlight)}
							<li>{highlight}</li>
						{/each}
					</ul>
				</article>
			{/each}
		</div>
	</section>
</div>

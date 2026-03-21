<script lang="ts">
	import { skills } from '$lib/data';
</script>

<section id="skills" class="bg-grid border-foreground w-full border-b-2 py-24">
	<div class="container mx-auto px-4">
		<h2
			class="border-foreground font-syne text-foreground mb-16 inline-block border-b-2 pr-12 pb-4 text-5xl font-black tracking-tighter uppercase md:text-8xl"
		>
			Skills
		</h2>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
			{#each skills as skillGroup (skillGroup.title)}
				<div
					class="brutalist-border bg-card border-2 border-[var(--color-primary)] p-6 shadow-[4px_4px_0_var(--color-primary)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0_var(--color-primary)]"
				>
					<h3
						class="font-syne mb-6 border-b-2 border-gray-800 pb-2 text-2xl font-bold tracking-tight text-[var(--color-secondary)] uppercase"
					>
						{skillGroup.title}
					</h3>

					<ul class="flex flex-wrap gap-3">
						{#each skillGroup.skills as item (item.name)}
							<li
								class="brutalist-border-lime bg-foreground text-background px-3 py-1 font-mono text-sm font-bold uppercase"
							>
								{item.name}
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>
	</div>
</section>

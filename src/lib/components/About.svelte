<script lang="ts">
	import { profile } from '$lib/data';
</script>

<section
	id="about"
	class="relative w-full border-b-2 border-foreground bg-[var(--color-background)] py-24"
>
	<div class="container mx-auto px-4">
		<div class="grid grid-cols-1 items-start gap-12 md:grid-cols-12 md:gap-8">
			<div class="md:col-span-4">
				<h2
					class="mb-4 font-syne text-5xl font-black tracking-tighter text-[var(--color-primary)] uppercase md:text-7xl"
				>
					About<br />Me.
				</h2>
				<div class="mb-8 h-2 w-16 bg-[var(--color-secondary)]"></div>
			</div>

			<div
				class="flex flex-col gap-6 border-l-2 border-dashed border-gray-700 pl-6 font-mono text-lg leading-relaxed text-gray-300 md:col-span-8 md:pl-12 md:text-xl"
			>
				{#each profile.about as p, index (index)}
					<p class="relative">
						<span
							class="absolute top-0 -left-12 text-sm font-bold text-[var(--color-secondary)] opacity-50 md:-left-18"
							>0{index + 1}.</span
						>
						{p}
					</p>
				{/each}

				<div class="brutalist-border mt-8 w-full max-w-md bg-card p-6">
					<p class="mb-4 text-sm font-bold tracking-widest text-[var(--color-secondary)] uppercase">
						// Currently Listening
					</p>
					<div class="h-32 w-full border-2 border-foreground bg-gray-900">
						<iframe
							src="https://open.spotify.com/embed/playlist/7d8zl8UGKsGmGLzzOm7t1r?utm_source=generator&theme=0"
							width="100%"
							height="100%"
							frameborder="0"
							allowfullscreen
							allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
							loading="lazy"
							title="Spotify Playlist"
						></iframe>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

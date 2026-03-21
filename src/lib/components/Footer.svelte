<script lang="ts">
	import { profile } from '$lib/data';
	import { ArrowUp } from 'lucide-svelte';
</script>

<footer
	class="border-foreground text-background w-full border-t-4 bg-[var(--color-secondary)] py-12"
>
	<div class="container mx-auto flex flex-col items-center justify-between gap-8 px-4 md:flex-row">
		<div class="flex flex-col items-center md:items-start">
			<h2 class="font-syne mb-2 text-4xl font-black tracking-tighter uppercase">
				{profile.name}
				{profile.lastName}
			</h2>
			<p
				class="border-background inline-block border-b-2 pb-1 font-mono text-sm font-bold tracking-widest uppercase"
			>
				System Architect
			</p>
		</div>

		<div class="flex items-center gap-4">
			<div class="font-mono text-xs font-bold">
				<p>&copy; {new Date().getFullYear()}</p>
				<p>Built with SvelteKit & Brutalism</p>
			</div>

			<a
				href="#top"
				class="brutalist-border bg-card hover:bg-foreground hover:text-background ml-4 p-4 text-[var(--color-secondary)] transition-colors"
				aria-label="Back to top"
			>
				<ArrowUp class="h-6 w-6" />
			</a>
		</div>
	</div>
</footer>

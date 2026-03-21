<script lang="ts">
	import { ArrowUpRight } from 'lucide-svelte';
	import { certifications } from '$lib/data';
</script>

<div class="flex h-full w-full flex-col overflow-auto p-3 sm:p-4">
	<div class="flex flex-col divide-y divide-border/50">
		{#each certifications as item (`${item.title}-${item.issuer}`)}
			<div class="flex items-center justify-between gap-2 py-2">
				<div class="min-w-0 flex-1">
					<span class="text-xs font-semibold text-fg uppercase">{item.title}</span>
					<span class="ml-1.5 font-mono text-[10px] tracking-wider text-dim">
						{item.issuer}
					</span>
				</div>
				{#if item.href}
					<a
						href={item.href}
						target="_blank"
						rel="noopener noreferrer"
						class="inline-flex shrink-0 items-center gap-0.5 border-b border-dim/50 pb-px font-mono text-[9px] text-dim transition-colors hover:border-highlight hover:bg-highlight hover:text-black"
					>
						cert
						<ArrowUpRight class="h-2.5 w-2.5" aria-hidden="true" />
					</a>
				{/if}
			</div>
		{/each}
	</div>
</div>

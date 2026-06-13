<script lang="ts">
	import { Download, Star } from 'lucide-svelte';
	import type { ProjectMetricValues } from '$lib/data';
	import { formatCompactNumber } from '$lib/project-metrics';

	type Variant = 'default' | 'compact' | 'overlay';

	let {
		metricValues,
		variant = 'default'
	}: {
		metricValues?: ProjectMetricValues;
		variant?: Variant;
	} = $props();

	let stars = $derived(metricValues?.stars ?? null);
	let downloads = $derived(metricValues?.downloads ?? null);
	let hasMetrics = $derived(stars !== null || downloads !== null);

	let rootClasses = $derived([
		'inline-flex items-center font-mono uppercase tracking-wide',
		variant === 'default' && 'flex-wrap gap-2 text-[10px] text-dim',
		variant === 'compact' && 'gap-1.5 text-[9px] text-dim',
		variant === 'overlay' &&
			'pointer-events-none absolute top-4 left-4 z-20 gap-1.5 border border-border bg-surface/90 px-2 py-1 text-[10px] text-highlight shadow-[2px_2px_0_rgba(0,0,0,0.35)] backdrop-blur-md'
	]);

	let itemClasses = $derived([
		'inline-flex items-center gap-1 whitespace-nowrap',
		variant === 'default' && 'border border-border bg-bg/50 px-2 py-1 text-highlight',
		variant === 'compact' &&
			'rounded-sm border border-border/80 bg-bg/50 px-1.5 py-0.5 text-accent',
		variant === 'overlay' && 'text-highlight'
	]);

	let iconClass = $derived(variant === 'compact' ? 'h-3 w-3 shrink-0' : 'h-3.5 w-3.5 shrink-0');
</script>

{#if hasMetrics}
	<div class={rootClasses} aria-label="Project metrics">
		{#if stars !== null}
			<span class={itemClasses} aria-label={`${stars} GitHub stars`}>
				<Star class={iconClass} aria-hidden="true" />
				<span>{formatCompactNumber(stars)}</span>
			</span>
		{/if}

		{#if downloads !== null}
			<span class={itemClasses} aria-label={`${downloads} downloads`}>
				<Download class={iconClass} aria-hidden="true" />
				<span>{formatCompactNumber(downloads)}</span>
			</span>
		{/if}
	</div>
{/if}

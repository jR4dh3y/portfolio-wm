<script lang="ts">
	import { profile } from '$lib/data';
</script>

<div class="flex h-full w-full flex-col gap-6 p-4 sm:p-8">
	<div
		class="flex flex-1 flex-col gap-4 overflow-y-auto pr-1 text-sm leading-7 text-fg/80 md:text-[15px]"
	>
		{#each profile.about as para, i (i)}
			<p>{para}</p>
		{/each}
	</div>
</div>

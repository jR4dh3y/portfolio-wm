<script lang="ts">
	import { experiencePaneSpotify } from '$lib/data';
</script>

<div class="flex h-full w-full flex-col">
	<div class="relative min-h-0 flex-1 overflow-hidden">
		<iframe
			title={experiencePaneSpotify.title}
			src={experiencePaneSpotify.embedUrl}
			class="absolute inset-[-8px] h-[calc(100%+16px)] w-[calc(100%+16px)]"
			style="border-radius: 0;"
			allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
			loading="lazy"
		></iframe>
	</div>
</div>

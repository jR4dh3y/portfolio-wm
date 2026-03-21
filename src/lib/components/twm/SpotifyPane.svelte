<script lang="ts">
	import { experiencePaneSpotify } from '$lib/data';
</script>

<div class="flex h-full w-full flex-col p-4 sm:p-6">
	<div class="min-h-0 flex-1 overflow-hidden rounded-xl">
		<iframe
			title={experiencePaneSpotify.title}
			src={experiencePaneSpotify.embedUrl}
			class="h-full w-full"
			style="border-radius: 12px;"
			allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
			loading="lazy"
		></iframe>
	</div>
</div>

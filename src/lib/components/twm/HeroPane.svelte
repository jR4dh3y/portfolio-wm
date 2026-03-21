<script lang="ts">
	import { Download, Github, Linkedin, Mail, X } from 'lucide-svelte';
	import { profile, socialLinks } from '$lib/data';
</script>

<div class="relative flex h-full w-full flex-col p-4 sm:p-8">
	<!-- Photo Background -->
	<div class="absolute inset-0 z-0">
		<img
			src="/assets/about.jpg"
			alt={profile.name}
			class="h-full w-full object-cover opacity-30 grayscale transition-all duration-700 hover:opacity-50 hover:grayscale-0"
		/>
		<div class="absolute inset-0 bg-linear-to-t from-bg via-bg/60 to-transparent"></div>
	</div>

	<!-- Content -->
	<div class="justify-top relative z-10 flex min-h-0 flex-1 flex-col gap-4">
		<h1
			class="max-w-full pr-1 text-[clamp(2rem,7vw,5.5rem)] leading-[0.9] font-black tracking-tighter sm:text-[clamp(2.75rem,7vw,6rem)] lg:text-[6vw]"
		>
			<span class="block whitespace-nowrap">{profile.name}</span>
			<span class="text-outline block whitespace-nowrap">{profile.lastName}</span>
		</h1>
	</div>
	<div class="relative z-10 mt-auto flex flex-col gap-4">
		<p class="mt-4 max-w-xl font-mono text-sm leading-relaxed text-dim sm:text-base">
			{profile.tagline}
		</p>

		<div class="mt-8 flex flex-wrap gap-4 font-mono text-xs uppercase">
			{#each socialLinks as link (link.label)}
				<a
					href={link.href}
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center gap-2 border border-border bg-surface px-4 py-2 transition-colors hover:bg-highlight hover:text-surface"
				>
					{#if link.icon === 'Github'}
						<Github class="h-4 w-4" aria-hidden="true" />
					{:else if link.icon === 'Linkedin'}
						<Linkedin class="h-4 w-4" aria-hidden="true" />
					{:else if link.icon === 'Mail'}
						<Mail class="h-4 w-4" aria-hidden="true" />
					{:else if link.icon === 'XIcon'}
						<X class="h-4 w-4" aria-hidden="true" />
					{:else}
						<Download class="h-4 w-4" aria-hidden="true" />
					{/if}
					<span class="hidden sm:inline">{link.label}</span>
				</a>
			{/each}
		</div>
	</div>
</div>

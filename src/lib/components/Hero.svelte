<script lang="ts">
	import { profile, socialLinks } from '$lib/data';
	import { ArrowDownRight, Github, Linkedin, Mail, Download, ExternalLink } from 'lucide-svelte';

	function getIconComponent(iconName: string) {
		switch (iconName) {
			case 'Github':
				return Github;
			case 'Linkedin':
				return Linkedin;
			case 'Mail':
				return Mail;
			case 'Download':
				return Download;
			default:
				return ExternalLink; // XIcon fallback or generic
		}
	}
</script>

<section
	class="bg-grid border-foreground relative flex min-h-[90vh] w-full flex-col justify-center overflow-hidden border-b-2 pt-24 pb-12"
>
	<div class="relative z-10 container mx-auto flex w-full flex-col items-start px-4">
		<!-- Top Section: Name + Floating Photo -->
		<div
			class="relative flex w-full flex-col items-start justify-between md:flex-row md:items-center"
		>
			<!-- Giant Typography -->
			<div class="pointer-events-none relative z-30 flex w-full flex-col md:w-auto">
				<h1
					class="font-syne text-foreground m-0 p-0 text-[14vw] leading-[0.85] font-black tracking-tighter uppercase transition-colors duration-500 hover:text-[var(--color-primary)] md:text-[12vw] lg:text-[11vw]"
				>
					{profile.name}
				</h1>
				<h1
					class="m-0 p-0 text-[14vw] leading-[0.85] font-black tracking-tighter text-transparent uppercase md:text-[12vw] lg:text-[11vw]"
					style="-webkit-text-stroke: 2px var(--color-foreground); text-stroke: 2px var(--color-foreground);"
				>
					{profile.lastName}
				</h1>
			</div>

			<!-- Floating Photo (Right side) -->
			<div
				class="pointer-events-auto absolute top-0 right-0 z-20 hidden w-[260px] translate-y-[-10%] transform md:top-auto md:flex md:translate-y-[-20%] lg:w-[320px] xl:translate-y-[-30%]"
			>
				<div
					class="brutalist-border bg-foreground w-full rotate-[4deg] p-2 transition-transform duration-300 hover:rotate-0"
				>
					<img
						src={profile.photo}
						alt={profile.name}
						class="border-background aspect-square w-full border-2 object-cover contrast-125 grayscale"
					/>
					<div
						class="border-background bg-card mt-2 border-2 p-2 text-center font-mono text-xs font-bold text-[var(--color-secondary)] uppercase"
					>
						ID: {profile.name}_{profile.lastName}
					</div>
				</div>
			</div>
		</div>

		<!-- Mobile Photo (inline) -->
		<div
			class="relative z-20 mt-8 flex w-full max-w-[280px] shrink-0 items-end justify-start md:hidden"
		>
			<div
				class="brutalist-border bg-foreground w-full rotate-[4deg] p-2 transition-transform duration-300 hover:rotate-0"
			>
				<img
					src={profile.photo}
					alt={profile.name}
					class="border-background aspect-square w-full border-2 object-cover contrast-125 grayscale"
				/>
				<div
					class="border-background bg-card mt-2 border-2 p-2 text-center font-mono text-xs font-bold text-[var(--color-secondary)] uppercase"
				>
					ID: {profile.name}_{profile.lastName}
				</div>
			</div>
		</div>

		<!-- Tagline & Links Below Name -->
		<div class="relative z-20 mt-12 flex w-full max-w-2xl flex-col justify-start">
			<div class="brutalist-border bg-background p-6 lg:p-8">
				<p class="font-mono text-sm leading-relaxed text-gray-300 md:text-base">
					{profile.tagline}
				</p>

				<div class="mt-8 flex flex-wrap gap-4">
					{#each socialLinks as link (link.href)}
						{@const Icon = getIconComponent(link.icon)}
						<a
							href={link.href}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={link.label}
							class="brutalist-border bg-foreground text-background p-3 transition-colors hover:bg-[var(--color-primary)]"
						>
							<Icon class="h-5 w-5" />
						</a>
					{/each}
				</div>
			</div>
		</div>

		<!-- Footer of Hero -->
		<div class="border-foreground mt-16 flex w-full items-end justify-end border-t-2 pt-6">
			<a
				href="#about"
				class="brutalist-border bg-foreground text-background flex items-center justify-center rounded-none p-4 transition-colors hover:bg-[var(--color-secondary)]"
			>
				<ArrowDownRight class="h-6 w-6" />
			</a>
		</div>
	</div>
</section>

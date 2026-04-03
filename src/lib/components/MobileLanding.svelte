<script lang="ts">
	import { profile, socialLinks, projects, experience, certifications, skills } from '$lib/data';
	import type { Project } from '$lib/data';
	import { Download, Github, Linkedin, Mail, X, ExternalLink, Monitor } from 'lucide-svelte';

	const iconMap: Record<string, typeof Github> = {
		Github,
		Linkedin,
		XIcon: X,
		Mail,
		Download
	};

	function getIcon(name: string) {
		return iconMap[name] ?? ExternalLink;
	}

	function getProjectHref(project: Project): string {
		return project.liveUrl ?? project.githubUrl;
	}
</script>

<div class="min-h-screen bg-bg text-fg">
	<!-- Hero Section -->
	<section class="relative flex min-h-[70vh] flex-col justify-end overflow-hidden p-6 sm:p-8">
		<div class="absolute inset-0 z-0">
			<img
				src="/assets/about.jpg"
				alt=""
				class="h-full w-full object-cover opacity-30"
				aria-hidden="true"
			/>
			<div class="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-transparent"></div>
		</div>

		<div class="relative z-10 flex flex-col gap-4">
			<h1 class="text-6xl font-black tracking-tighter sm:text-7xl">
				{profile.name}<br />
				<span class="text-accent">{profile.lastName}</span>
			</h1>

			<p class="max-w-md font-mono text-sm leading-relaxed text-dim sm:text-base">
				{profile.tagline}
			</p>

			<div class="mt-2 flex flex-wrap gap-3">
				{#each socialLinks as link (link.href)}
					{@const Icon = getIcon(link.icon)}
					<a
						href={link.href}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={link.label}
						class="rounded-md border border-border bg-surface p-2.5 text-fg transition-colors hover:border-accent hover:text-accent"
					>
						<Icon class="h-5 w-5" />
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- About Section -->
	<section class="border-t border-border p-6 sm:p-8">
		<h2 class="mb-6 text-3xl font-black tracking-tighter text-accent sm:text-4xl">About</h2>

		<div class="flex flex-col gap-4">
			{#each profile.about as paragraph, i (i)}
				<p class="font-mono text-sm leading-relaxed text-dim">{paragraph}</p>
			{/each}
		</div>
	</section>

	<!-- Projects Section -->
	<section class="border-t border-border p-6 sm:p-8">
		<h2 class="mb-6 text-3xl font-black tracking-tighter text-accent sm:text-4xl">Projects</h2>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			{#each projects as project (project.title)}
				<article class="flex flex-col overflow-hidden rounded-md border border-border bg-surface">
					<a href={getProjectHref(project)} target="_blank" rel="noopener noreferrer">
						<img
							src={project.image}
							alt={project.title}
							loading="lazy"
							class="aspect-video w-full object-cover"
						/>
					</a>

					<div class="flex flex-1 flex-col gap-3 p-4">
						<div class="flex items-start justify-between gap-2">
							<a
								href={getProjectHref(project)}
								target="_blank"
								rel="noopener noreferrer"
								class="font-sans text-lg font-bold tracking-tight text-fg hover:text-highlight"
							>
								{project.title}
							</a>
							<a
								href={project.githubUrl}
								target="_blank"
								rel="noopener noreferrer"
								aria-label="GitHub - {project.title}"
								class="shrink-0 text-dim transition-colors hover:text-fg"
							>
								<Github class="h-4 w-4" />
							</a>
						</div>

						<p class="line-clamp-3 font-mono text-xs leading-relaxed text-dim">
							{project.desc[0]}
						</p>

						<div class="mt-auto flex flex-wrap gap-1.5">
							{#each project.tags as tag (tag)}
								<span
									class="rounded-sm border border-border px-1.5 py-0.5 font-mono text-[10px] text-accent"
								>
									{tag}
								</span>
							{/each}
						</div>
					</div>
				</article>
			{/each}
		</div>
	</section>

	<!-- Experience Section -->
	<section class="border-t border-border p-6 sm:p-8">
		<h2 class="mb-6 text-3xl font-black tracking-tighter text-accent sm:text-4xl">Experience</h2>

		<div class="flex flex-col gap-6">
			{#each experience as exp (exp.company + exp.role)}
				<div class="border-l-2 border-highlight pl-4">
					<h3 class="font-sans text-lg font-bold tracking-tight text-fg">{exp.role}</h3>
					<p class="font-mono text-sm text-accent">{exp.company}</p>
					<p class="mt-1 font-mono text-xs text-dim">{exp.period}</p>

					<p class="mt-3 font-mono text-xs leading-relaxed whitespace-pre-line text-dim">
						{exp.description}
					</p>

					<div class="mt-3 flex flex-wrap gap-1.5">
						{#each exp.skills as skill (skill)}
							<span
								class="rounded-sm border border-border bg-bg px-1.5 py-0.5 font-mono text-[10px] text-highlight"
							>
								{skill}
							</span>
						{/each}
					</div>

					{#if exp.links.length > 0}
						<div class="mt-3 flex flex-wrap gap-3">
							{#each exp.links as link (link.href)}
								<a
									href={link.href}
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex items-center gap-1 font-mono text-xs text-accent transition-colors hover:text-highlight"
								>
									<ExternalLink class="h-3 w-3" />
									{link.label}
								</a>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</section>

	<!-- Skills Section -->
	<section class="border-t border-border p-6 sm:p-8">
		<h2 class="mb-6 text-3xl font-black tracking-tighter text-accent sm:text-4xl">Skills</h2>

		<div class="flex flex-col gap-5">
			{#each skills as group (group.title)}
				<div>
					<h3 class="mb-2 font-sans text-sm font-bold tracking-tight text-highlight">
						{group.title}
					</h3>
					<div class="flex flex-wrap gap-1.5">
						{#each group.skills as skill (skill.name)}
							<span
								class="rounded-sm border border-border bg-surface px-2 py-0.5 font-mono text-xs text-fg"
							>
								{skill.name}
							</span>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Certifications Section -->
	<section class="border-t border-border p-6 sm:p-8">
		<h2 class="mb-6 text-3xl font-black tracking-tighter text-accent sm:text-4xl">
			Certifications
		</h2>

		<div class="flex flex-col gap-3">
			{#each certifications as cert (cert.title)}
				<div
					class="flex items-center justify-between gap-3 rounded-md border border-border bg-surface px-4 py-3"
				>
					<div class="min-w-0">
						<p class="truncate font-mono text-sm font-medium text-fg">{cert.title}</p>
						<p class="font-mono text-xs text-dim">{cert.issuer}</p>
					</div>
					{#if cert.href}
						<a
							href={cert.href}
							target="_blank"
							rel="noopener noreferrer"
							aria-label="View {cert.title} credential"
							class="shrink-0 text-dim transition-colors hover:text-accent"
						>
							<ExternalLink class="h-4 w-4" />
						</a>
					{/if}
				</div>
			{/each}
		</div>
	</section>

	<!-- Footer -->
	<footer class="border-t border-border p-6 sm:p-8">
		<div class="flex flex-col items-center gap-4 text-center">
			<div class="flex items-center gap-2 text-dim">
				<Monitor class="h-4 w-4" />
				<p class="font-mono text-xs">Best experienced on desktop</p>
			</div>

			<div class="flex flex-wrap justify-center gap-3">
				{#each socialLinks as link (link.href)}
					{@const Icon = getIcon(link.icon)}
					<a
						href={link.href}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={link.label}
						class="rounded-md border border-border bg-surface p-2 text-dim transition-colors hover:border-accent hover:text-accent"
					>
						<Icon class="h-4 w-4" />
					</a>
				{/each}
			</div>

			<p class="font-mono text-[10px] text-dim">
				&copy; {new Date().getFullYear()}
				{profile.name}
				{profile.lastName}
			</p>
		</div>
	</footer>
</div>

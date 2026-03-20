<script lang="ts">
	import { homelab } from '$lib/data';
	import { navigateToProject } from '$lib/stores/project-navigation';
	import { tick } from 'svelte';

	type TerminalLine = { type: 'input' | 'output'; content: string };
	const initialLines: TerminalLine[] = [
		{ type: 'input', content: '$ neofetch' },
		{ type: 'output', content: '                                   pico@pico' },
		{ type: 'output', content: '                                   ─────────────────────────────' },
		{
			type: 'output',
			content: '  ██████╗  ██╗ ██████╗  ██████╗    OS        Ubuntu 24.04.3 LTS x86_64'
		},
		{ type: 'output', content: '  ██╔══██╗ ██║██╔════╝ ██╔═══██╗   Kernel    6.8.0-90-generic' },
		{ type: 'output', content: '  ██████╔╝ ██║██║      ██║   ██║   Uptime    8 days, 20 hours' },
		{ type: 'output', content: '  ██╔═══╝  ██║██║      ██║   ██║   Packages  906 (dpkg)' },
		{
			type: 'output',
			content: '  ██║      ██║╚██████╗ ╚██████╔╝   CPU       Intel i3-2310M @ 2.1GHz'
		},
		{
			type: 'output',
			content: '  ╚═╝      ╚═╝ ╚═════╝  ╚═════╝    Memory    3.87 GiB / 7.69 GiB (50%)'
		},
		{ type: 'output', content: '                                   Disk      59G / 218G (29%)' },
		{ type: 'output', content: '                                   ─────────────────────────────' },
		{ type: 'input', content: '$ help' },
		{ type: 'output', content: 'Commands: neofetch, docker ps, clear' }
	];

	const terminalCommands: Record<string, string[]> = {
		help: ['Commands: neofetch, docker ps, clear'],
		'docker ps': [
			'STACK              CONTAINERS  STATUS',
			'boxbox             3           healthy',
			'vidown             2           healthy',
			'anyconverter       1           healthy',
			'cloudflared        1           running',
			'jellyfin           1           running',
			'portainer          1           running',
			'vaultwarden        1           running'
		],
		neofetch: initialLines.slice(1, 11).map((l) => l.content)
	};

	let lines = $state<TerminalLine[]>([...initialLines]);
	let currentInput = $state('');
	let terminalClosed = $state(false);
	let passwordAttempt = $state('');
	let failedAttempt = $state(false);
	let showSuccess = $state(false);
	let terminalRef = $state<HTMLDivElement | null>(null);
	let inputRef = $state<HTMLInputElement | null>(null);

	function handleTerminalCommand(input: string) {
		const trimmed = input.trim().toLowerCase();
		if (trimmed === 'clear') {
			lines = [];
			return;
		}

		const response = terminalCommands[trimmed];
		let newLines: TerminalLine[] = [{ type: 'input', content: `$ ${input}` }];

		if (response) {
			response.forEach((l) => newLines.push({ type: 'output', content: l }));
		} else if (trimmed.startsWith('cat ')) {
			newLines.push({ type: 'output', content: `cat: ${trimmed.slice(4)}: not found` });
		} else if (trimmed !== '') {
			newLines.push({ type: 'output', content: `command not found: ${trimmed}` });
		}

		lines = [...lines, ...newLines];
		tick().then(() => {
			if (terminalRef) terminalRef.scrollTop = terminalRef.scrollHeight;
		});
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleTerminalCommand(currentInput);
			currentInput = '';
		}
	}

	function handlePasswordSubmit(e: Event) {
		e.preventDefault();
		const secret = 'admin';
		if (passwordAttempt.toLowerCase() === secret) {
			showSuccess = true;
			failedAttempt = false;
			setTimeout(() => {
				terminalClosed = false;
				showSuccess = false;
				passwordAttempt = '';
				lines = [...initialLines];
			}, 2500);
		} else if (passwordAttempt.length > 0) {
			failedAttempt = true;
			passwordAttempt = '';
		}
	}

	function openProjectFromHomelab(slug: string) {
		navigateToProject(slug, 'homelab');
	}
</script>

<div class="flex h-full w-full flex-col gap-6 p-4">
	<div class="flex flex-col gap-4">
		{#each homelab.paragraphs as paragraph, i (i)}
			<p class="font-mono text-sm leading-7 text-fg/85 md:text-[15px]">
				{paragraph}
			</p>
		{/each}
		<p class="font-mono text-sm leading-7 text-fg/85 md:text-[15px]">
			Some of my own projects run here:
			<button
				type="button"
				onclick={() => openProjectFromHomelab(homelab.featuredProjects.boxbox.slug)}
				class="font-semibold text-accent underline underline-offset-2 hover:bg-highlight hover:text-black"
			>
				{homelab.featuredProjects.boxbox.label}
			</button>,
			<button
				type="button"
				onclick={() => openProjectFromHomelab(homelab.featuredProjects.vidown.slug)}
				class="font-semibold text-accent underline underline-offset-2 hover:bg-highlight hover:text-black"
			>
				{homelab.featuredProjects.vidown.label}
			</button>, and
			<button
				type="button"
				onclick={() => openProjectFromHomelab(homelab.featuredProjects.anyConverter.slug)}
				class="font-semibold text-accent underline underline-offset-2 hover:bg-highlight hover:text-black"
			>
				{homelab.featuredProjects.anyConverter.label}
			</button>. Server configs and docker-compose files are in my
			<a
				href={homelab.repo.href}
				target="_blank"
				rel="noopener noreferrer"
				class="font-semibold text-accent underline underline-offset-2 hover:bg-highlight hover:text-black"
			>
				{homelab.repo.label}
			</a>
			repo.
		</p>
		<div class="flex flex-wrap gap-2">
			{#each homelab.technologies as tech (tech)}
				<span class="border border-border bg-surface px-2.5 py-1 font-mono text-xs text-accent">
					{tech}
				</span>
			{/each}
		</div>
	</div>

	<!-- Terminal Component -->
	<div class="flex flex-1 flex-col overflow-hidden">
		{#if terminalClosed}
			<div
				class="relative flex h-full w-full flex-col items-center justify-center overflow-hidden border border-border bg-bg p-4 text-center"
			>
				{#if showSuccess}
					<div class="mb-4 text-3xl">😅</div>
					<p class="font-mono text-[10px] text-dim">
						huh looks like i never changed the default password...
					</p>
				{:else}
					<div class="mb-2 text-3xl">🥀</div>
					<p class="mb-2 font-mono text-[10px] font-bold text-fg">Connection Lost</p>
					<form onsubmit={handlePasswordSubmit} class="flex w-full max-w-[200px] flex-col gap-2">
						<input
							type="password"
							bind:value={passwordAttempt}
							placeholder={failedAttempt ? 'nope, try again' : 'password'}
							class="w-full border {failedAttempt
								? 'border-urgent text-urgent'
								: 'border-border text-fg'} bg-surface px-2 py-1.5 font-mono text-[10px] outline-none focus:border-highlight"
							autocomplete="off"
						/>
						<button
							type="submit"
							class="bg-surface px-2 py-1.5 font-mono text-[10px] text-accent hover:bg-highlight hover:text-black"
						>
							ssh
						</button>
					</form>
				{/if}
			</div>
		{:else}
			<div class="flex h-full w-full flex-col overflow-hidden border border-border shadow-2xl">
				<!-- Header -->
				<div class="bg-tray flex items-center gap-2 border-b border-border px-3 py-1.5">
					<div class="flex gap-2">
						<button
							aria-label="Close"
							class="h-2.5 w-2.5 rounded-full bg-urgent hover:opacity-85"
							onclick={() => (terminalClosed = true)}
						></button>
						<div class="h-2.5 w-2.5 rounded-full bg-caution"></div>
						<div class="h-2.5 w-2.5 rounded-full bg-highlight"></div>
					</div>
					<span class="ml-1 font-mono text-[9px] text-dim">radhey@homelab:~</span>
				</div>

				<!-- Body -->
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="flex-1 overflow-x-auto overflow-y-auto bg-black p-3 font-mono text-[10px] md:text-xs"
					bind:this={terminalRef}
					onclick={() => inputRef?.focus()}
				>
					{#each lines as line, i (line.content + '-' + i)}
						<div
							class="mb-1 leading-relaxed whitespace-pre {line.type === 'input'
								? 'text-accent'
								: 'text-dim'}"
						>
							{line.content}
						</div>
					{/each}
					<div class="mt-1 flex items-center">
						<span class="mr-2 font-bold text-accent">$</span>
						<input
							bind:this={inputRef}
							type="text"
							bind:value={currentInput}
							onkeydown={handleKeyDown}
							class="flex-1 bg-transparent text-fg outline-none"
							spellcheck="false"
							autocomplete="off"
						/>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
// back button fix

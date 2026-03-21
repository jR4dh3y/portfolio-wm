<script lang="ts">
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
		help: ['Commands: neofetch, docker ps, clear, exit'],
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
		neofetch: initialLines.slice(1, 11).map((line) => line.content)
	};

	let lines = $state<TerminalLine[]>([...initialLines]);
	let currentInput = $state('');
	let terminalClosed = $state(false);
	let passwordAttempt = $state('');
	let failedAttempt = $state(false);
	let showSuccess = $state(false);
	let terminalRef = $state<HTMLDivElement | null>(null);
	let inputRef = $state<HTMLInputElement | null>(null);

	function resetTerminal() {
		lines = [...initialLines];
		currentInput = '';
	}

	function handleTerminalCommand(input: string) {
		const trimmed = input.trim().toLowerCase();
		if (trimmed === 'exit') {
			terminalClosed = true;
			return;
		}

		if (trimmed === 'clear') {
			lines = [];
			return;
		}

		const response = terminalCommands[trimmed];
		const newLines: TerminalLine[] = [{ type: 'input', content: `$ ${input}` }];

		if (response) {
			response.forEach((line) => newLines.push({ type: 'output', content: line }));
		} else if (trimmed.startsWith('cat ')) {
			newLines.push({ type: 'output', content: `cat: ${trimmed.slice(4)}: not found` });
		} else if (trimmed !== '') {
			newLines.push({ type: 'output', content: `command not found: ${trimmed}` });
		}

		lines = [...lines, ...newLines];
		tick().then(() => {
			if (terminalRef) {
				terminalRef.scrollTop = terminalRef.scrollHeight;
			}
		});
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			handleTerminalCommand(currentInput);
			currentInput = '';
		}
	}

	function handlePasswordSubmit(event: Event) {
		event.preventDefault();
		const secret = 'admin';

		if (passwordAttempt.toLowerCase() === secret) {
			showSuccess = true;
			failedAttempt = false;
			setTimeout(() => {
				terminalClosed = false;
				showSuccess = false;
				passwordAttempt = '';
				resetTerminal();
			}, 2500);
		} else if (passwordAttempt.length > 0) {
			failedAttempt = true;
			passwordAttempt = '';
		}
	}
</script>

<div class="flex h-full min-h-0 w-full flex-col bg-black">
	{#if terminalClosed}
		<div
			class="flex h-full w-full flex-col items-center justify-center overflow-hidden p-4 text-center"
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
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="flex-1 overflow-x-auto overflow-y-auto p-3 font-mono text-[10px] md:text-xs"
			bind:this={terminalRef}
			onclick={() => inputRef?.focus()}
		>
			{#each lines as line, index (line.content + '-' + index)}
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
	{/if}
</div>

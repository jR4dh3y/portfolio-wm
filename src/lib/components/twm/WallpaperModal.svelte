<script lang="ts">
	let {
		errorMessage = '',
		inputValue = '',
		onClose,
		onInput,
		onSave
	}: {
		errorMessage?: string;
		inputValue?: string;
		onClose: () => void;
		onInput: (value: string) => void;
		onSave: () => void;
	} = $props();
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 p-4 backdrop-blur-sm">
	<div
		class="w-full max-w-lg border border-border bg-surface/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
		role="dialog"
		aria-modal="true"
		aria-labelledby="wallpaper-modal-title"
	>
		<div class="mb-5 flex items-start justify-between gap-4">
			<div>
				<p class="text-xs font-bold tracking-[0.2em] text-accent uppercase">~/wallpaper</p>
				<h2 id="wallpaper-modal-title" class="mt-2 text-2xl text-fg">Custom wallpaper URL</h2>
			</div>
			<button
				type="button"
				class="border border-border px-3 py-1 text-xs text-dim uppercase transition-colors hover:border-highlight hover:bg-highlight hover:text-black"
				onclick={onClose}
			>
				Close
			</button>
		</div>

		<p class="mb-3 text-sm text-dim">Save an image link to include it in the wallpaper cycle.</p>

		<label class="block text-xs font-bold tracking-[0.2em] text-dim uppercase" for="wallpaper-url">
			Image URL
		</label>
		<input
			id="wallpaper-url"
			type="url"
			value={inputValue}
			placeholder="https://example.com/wallpaper.jpg"
			class="mt-2 w-full border border-border bg-bg/70 px-3 py-3 text-sm text-fg transition-colors outline-none focus:border-highlight"
			oninput={(event) => onInput(event.currentTarget.value)}
		/>

		{#if errorMessage}
			<p class="mt-3 text-sm text-urgent">{errorMessage}</p>
		{/if}

		<div class="mt-6 flex justify-end gap-3">
			<button
				type="button"
				class="border border-border px-4 py-2 text-xs text-dim uppercase transition-colors hover:border-accent hover:text-accent"
				onclick={onClose}
			>
				Cancel
			</button>
			<button
				type="button"
				class="border border-highlight bg-highlight px-4 py-2 text-xs font-bold text-black uppercase transition-colors hover:border-accent hover:bg-accent"
				onclick={onSave}
			>
				Save & apply
			</button>
		</div>
	</div>
</div>

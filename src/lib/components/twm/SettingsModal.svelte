<script lang="ts">
	let {
		errorMessage = '',
		inputValue = '',
		blurEnabled = false,
		onClose,
		onInput,
		onSave,
		onToggleBlur
	}: {
		errorMessage?: string;
		inputValue?: string;
		blurEnabled?: boolean;
		onClose: () => void;
		onInput: (value: string) => void;
		onSave: () => void;
		onToggleBlur: () => void;
	} = $props();
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 p-4 backdrop-blur-sm">
	<div
		class="w-full max-w-3xl border border-border bg-surface/90 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl"
		role="dialog"
		aria-modal="true"
		aria-labelledby="settings-modal-title"
	>
		<div class="mb-6 flex items-start justify-between gap-4">
			<div>
				<p class="text-xs font-bold tracking-[0.2em] text-accent uppercase">~/settings</p>
				<h2 id="settings-modal-title" class="mt-2 text-2xl text-fg">Desktop controls</h2>
			</div>
			<button
				type="button"
				class="border border-border px-3 py-1 text-xs text-dim uppercase transition-colors hover:border-highlight hover:bg-highlight hover:text-black"
				onclick={onClose}
			>
				Close
			</button>
		</div>

		<div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
			<div class="flex flex-col gap-6">
				<section class="border border-border bg-bg/40 p-5">
					<div class="mb-4 font-bold text-accent">~/help</div>
					<div class="grid grid-cols-[80px_1fr] gap-2 text-xs">
						<span class="text-dim">[1]-[6]</span>
						<span>Focus pane</span>
						<span class="text-dim">[←][→]</span>
						<span>Move across columns</span>
						<span class="text-dim">[↑][↓]</span>
						<span>Move stack / workspace</span>
						<span class="text-dim">[?]</span>
						<span>Toggle settings</span>
					</div>
				</section>

				<section class="border border-border bg-bg/40 p-5">
					<div class="mb-4 font-bold text-accent">~/appearance</div>
					<div class="flex items-center justify-between">
						<div>
							<p class="text-sm text-fg">Window blur</p>
							<p class="mt-1 text-xs text-dim">Frosted glass effect on panes</p>
						</div>
						<button
							type="button"
							class="relative h-6 w-11 shrink-0 rounded-full border transition-colors {blurEnabled
								? 'border-highlight bg-highlight/30'
								: 'border-border bg-bg/70'}"
							onclick={onToggleBlur}
							role="switch"
							aria-checked={blurEnabled}
							aria-label="Toggle window blur"
						>
							<span
								class="absolute top-0.5 left-0.5 h-4 w-4 rounded-full transition-transform {blurEnabled
									? 'translate-x-5 bg-highlight'
									: 'translate-x-0 bg-dim'}"
							></span>
						</button>
					</div>
				</section>
			</div>

			<section class="border border-border bg-bg/40 p-5">
				<div class="mb-4 font-bold text-accent">~/wallpaper</div>
				<p class="mb-3 text-sm text-dim">
					Save an image link to include it in the wallpaper cycle.
				</p>

				<label
					class="block text-xs font-bold tracking-[0.2em] text-dim uppercase"
					for="wallpaper-url"
				>
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
			</section>
		</div>
	</div>
</div>

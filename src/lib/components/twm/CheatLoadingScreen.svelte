<script lang="ts">
	import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-svelte';

	let show = $state(true);

	function dismiss() {
		show = false;
	}

	function handleKeydown() {
		dismiss();
	}
</script>

<svelte:window onkeydown={show ? handleKeydown : undefined} />

{#if show}
	<button
		class="fixed inset-0 z-[9999] flex h-full w-full cursor-pointer flex-col items-center justify-center overflow-hidden border-none bg-bg/50 p-0 text-left font-mono text-fg backdrop-blur-xl"
		onclick={dismiss}
		aria-label="Dismiss loading screen"
	>
		<div class="flex max-w-xl flex-col items-center gap-12 p-8 text-center sm:p-12">
			<!-- Info Text -->
			<p class="text-lg text-dim">
				This site uses a Scrolling Window Manager layout. To navigate all the workspaces and
				projects, you need to scroll in <strong class="text-fg">both directions</strong>.
			</p>

			<!-- Single Mouse with all directional arrows -->
			<div class="relative mt-8 flex items-center justify-center">
				<div class="animate-breathe-up absolute bottom-full mb-2 text-highlight">
					<ChevronUp class="h-10 w-10" />
				</div>
				<div class="animate-breathe-down absolute top-full mt-2 text-highlight">
					<ChevronDown class="h-10 w-10" />
				</div>
				<div class="animate-breathe-left absolute right-full mr-2 text-highlight">
					<ChevronLeft class="h-10 w-10" />
				</div>
				<div class="animate-breathe-right absolute left-full ml-2 text-highlight">
					<ChevronRight class="h-10 w-10" />
				</div>

				<div class="relative flex items-center justify-center">
					<!-- Custom Mouse SVG for perfect wheel animation -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="80"
						height="80"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="text-fg"
					>
						<rect x="5" y="2" width="14" height="20" rx="7" />
						<path
							d="M12 6v4"
							class="animate-scroll-wheel text-highlight"
							stroke="currentColor"
							stroke-width="2"
						/>
					</svg>
				</div>
			</div>

			<!-- Dismiss text -->
			<div class="mt-16 text-sm tracking-widest text-accent">
				[ PRESS ANY KEY OR CLICK TO START ]
			</div>
		</div>
	</button>
{/if}

<style>
	.animate-scroll-wheel {
		animation: scrollWheel 2s ease-in-out infinite;
	}
	.animate-breathe-up {
		animation: breatheUp 2s ease-in-out infinite;
	}
	.animate-breathe-down {
		animation: breatheDown 2s ease-in-out infinite;
	}
	.animate-breathe-left {
		animation: breatheLeft 2s ease-in-out infinite;
	}
	.animate-breathe-right {
		animation: breatheRight 2s ease-in-out infinite;
	}

	@keyframes scrollWheel {
		0%,
		10%,
		100% {
			transform: translateY(-2px);
			opacity: 1;
		}
		45%,
		55% {
			transform: translateY(0px);
			opacity: 1;
		}
	}

	@keyframes breatheUp {
		0%,
		100% {
			transform: translateY(0);
			opacity: 0.3;
		}
		50% {
			transform: translateY(-12px);
			opacity: 1;
		}
	}

	@keyframes breatheDown {
		0%,
		100% {
			transform: translateY(0);
			opacity: 0.3;
		}
		50% {
			transform: translateY(12px);
			opacity: 1;
		}
	}

	@keyframes breatheLeft {
		0%,
		100% {
			transform: translateX(0);
			opacity: 0.3;
		}
		50% {
			transform: translateX(-12px);
			opacity: 1;
		}
	}

	@keyframes breatheRight {
		0%,
		100% {
			transform: translateX(0);
			opacity: 0.3;
		}
		50% {
			transform: translateX(12px);
			opacity: 1;
		}
	}
</style>

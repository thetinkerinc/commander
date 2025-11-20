<script lang="ts">
let { type, lines, help, children } = $props();

import { tick } from 'svelte';
import { fade } from 'svelte/transition';
import QuestionBubble from '@lucide/svelte/icons/message-circle-question-mark';

import Card from './card.svelte';

let button: HTMLButtonElement;

let container = $state<HTMLDivElement>();
let helpOpen = $state<boolean>(false);
let nudge = $state<number>(0);

async function toggleOpen() {
	helpOpen = !helpOpen;
	if (helpOpen) {
		await tick();
		if (!container) {
			return;
		}
		nudge = 0;
		const maxWidth = window.innerWidth - 20;
		const bounds = container.getBoundingClientRect();
		if (bounds.left <= 20) {
			nudge = 20;
		} else if (bounds.right >= maxWidth) {
			nudge = maxWidth - bounds.right;
		}
	}
}

function handleWindowClick(evt: MouseEvent) {
	let elem = evt.target as HTMLElement | null | undefined;
	for (let depth = 0; depth < 4; depth++) {
		if (elem === button) {
			return;
		}
		elem = elem?.parentElement;
	}
	helpOpen = false;
}
</script>

<svelte:window
	onclick={handleWindowClick}
	onresize={() => (helpOpen = false)}
	onscroll={() => (helpOpen = false)} />
<Card>
	<div class="mb-2 flex items-center gap-2">
		<div class="flex-auto text-xl capitalize">{type}</div>
		<a href="https://svelte.dev/docs/kit/remote-functions#{type}" target="_blank">
			<img class="w-[20px]" src="/svelte.svg" alt="Svelte" />
		</a>
		<a
			href="https://github.com/thetinkerinc/commander/blob/main/src/routes/data.remote.ts#{lines}"
			target="_blank"
			aria-label="Github">
			<i class="fa-brands fa-github fa-lg translate-y-[1px]"></i>
		</a>
		<div class="relative">
			<button class="block cursor-pointer" onclick={toggleOpen} bind:this={button}>
				<QuestionBubble size={21} strokeWidth={2.5} />
			</button>
			{#if helpOpen}
				<div
					class="absolute top-full left-1/2 w-max max-w-[300px] rounded bg-white px-2 py-1 shadow"
					style="translate: calc(-50% + {nudge}px) 8px"
					bind:this={container}
					transition:fade={{ duration: 200 }}>
					{@render help()}
				</div>
				<div
					class="absolute top-full left-1/2 size-[0px] -translate-x-1/2 -translate-y-[5px] border-[7px] border-transparent border-b-white"
					transition:fade={{ duration: 200 }}>
				</div>
			{/if}
		</div>
	</div>
	{@render children()}
</Card>

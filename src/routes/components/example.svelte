<script lang="ts">
let { type, lines, help, children } = $props();

import { fade } from 'svelte/transition';
import QuestionBubble from '@lucide/svelte/icons/message-circle-question-mark';

import Card from './card.svelte';

let button: HTMLButtonElement;

let showHelp = $state<boolean>(false);

function handleWindowClick(evt: MouseEvent) {
	let elem = evt.target as HTMLElement | null | undefined;
	for (let depth = 0; depth < 4; depth++) {
		if (elem === button) {
			return;
		}
		elem = elem?.parentElement;
	}
	showHelp = false;
}
</script>

<svelte:window onclick={handleWindowClick} />
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
			<button
				class="block cursor-pointer"
				onclick={() => (showHelp = !showHelp)}
				bind:this={button}>
				<QuestionBubble size={21} strokeWidth={2.5} />
			</button>
			{#if showHelp}
				<div
					class="absolute top-full left-1/2 w-max max-w-[300px] -translate-x-1/2 translate-y-[8px] rounded bg-white px-2 py-1 shadow"
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

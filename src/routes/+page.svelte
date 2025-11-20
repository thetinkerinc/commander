<script lang="ts">
import { onMount } from 'svelte';
import { fade } from 'svelte/transition';
import { isHttpError } from '@sveltejs/kit';
import cookies from 'js-cookie';
import Cookie from '@lucide/svelte/icons/cookie';
import Backpack from '@lucide/svelte/icons/backpack';
import Dot from '@lucide/svelte/icons/dot';
import ChevronRight from '@lucide/svelte/icons/chevron-right';
import Check from '@lucide/svelte/icons/check';

import { getSecret, checkName, adventure } from './data.remote.ts';

import Install from './components/install.svelte';
import MakeCommander from './components/make-commander.svelte';
import Remote from './components/remote.svelte';
import Card from './components/card.svelte';
import Button from './components/button.svelte';

import type { TransitionConfig } from 'svelte/transition';

type ResponseType = keyof typeof responses & keyof typeof errors;
type CheckNameEnhanceParams = Parameters<Parameters<typeof checkName.enhance>[0]>[0];

onMount(() => {
	jar.remove('is_protected');
});

const jar = cookies.withAttributes({
	secure: true,
	sameSite: 'strict'
});

let promised = $state<boolean>(false);
let hasCookie = $state<boolean>(false);
let responses = $state({
	query: '',
	form: '',
	command: ''
});
let errors = $state({
	query: false,
	form: false,
	command: false
});

async function query() {
	try {
		resetField('query');
		responses.query = await getSecret(promised);
	} catch (err) {
		handleError(err, 'query');
	}
}

async function enhance({ form, submit }: CheckNameEnhanceParams) {
	try {
		resetField('form');
		await submit();
		if (checkName.result) {
			responses.form = checkName.result;
		}
	} catch (err) {
		handleError(err, 'form');
	} finally {
		form.reset();
	}
}

async function command() {
	try {
		resetField('command');
		responses.command = await adventure();
	} catch (err) {
		handleError(err, 'command');
	}
}

function toggleCookie() {
	responses.command = '';
	hasCookie = !hasCookie;
	if (hasCookie) {
		jar.set('is_protected', 'true');
	} else {
		jar.remove('is_protected');
	}
}

function resetField(type: ResponseType) {
	errors[type] = false;
	responses[type] = '';
}

function resetForm() {
	responses.form = '';
}

function handleError(err: unknown, type: ResponseType) {
	errors[type] = true;
	if (isHttpError(err, 403)) {
		responses[type] = err.body.message;
	} else {
		responses[type] = "Something actually went wrong and we're working to fix it!";
	}
}

function shrink(
	node: HTMLElement,
	{ duration = 200 }: { duration?: number } = {}
): TransitionConfig {
	const w = node.offsetWidth;
	return {
		duration,
		css: (t) => `width: ${t * w}px`
	};
}
</script>

<svelte:head>
	<title>Commander</title>
</svelte:head>
<div class="flex justify-center gap-4 rounded-lg bg-slate-100 p-4">
	<img class="w-[200px]" src="/logo.png" alt="Knight holding a spear guarding a door" />
	<div class="flex flex-col justify-center">
		<div class="text-[70px] leading-[normal] font-medium">Commander</div>
		<div class="ml-1 text-[30px] leading-[normal] text-gray-600 italic">
			Keep out unwanted guests
		</div>
		<div class="mt-3 flex items-center justify-center gap-6 text-[30px]">
			<a href="https://github.com/thetinkerinc/commander" target="_blank" aria-label="Github">
				<i class="fa-brands fa-github"></i>
			</a>
			<a
				href="https://www.npmjs.com/package/@thetinkerinc/commander"
				target="_blank"
				aria-label="npm">
				<i class="fa-brands fa-npm"></i>
			</a>
		</div>
	</div>
</div>

<div class="mx-auto mt-5 max-w-[500px] text-center text-[20px]">
	Commander is a SvelteKit utility library that lets you easily add customizable auth protection to
	your remote functions
</div>

<div>
	<div class="mb-2 text-[20px] text-slate-700">Examples</div>
	<div class="grid grid-cols-3 gap-4">
		<Card>
			<div>Query</div>
			<div>Swear the oath to retrieve a secret</div>
			<div class="flex items-center gap-2">
				<label for="promised">
					<input id="promised" type="checkbox" bind:checked={promised} />
					I solemnly swear that I am up to no good
				</label>
			</div>
			{#if responses.query}
				<div class={[errors.query && 'text-red-600']} transition:fade>{responses.query}</div>
			{/if}
			<Button onclick={query}>Reveal</Button>
		</Card>

		<Card>
			<div>Form</div>
			<div>What can I call you? I only trust travellers with a good, strong name like Sam</div>
			<div class="grid">
				{#if responses.form}
					<div class="cell-1" in:fade={{ duration: 200, delay: 100 }} out:fade={{ duration: 200 }}>
						<div class={[errors.form && 'text-red-600']}>{responses.form}</div>
						<Button onclick={resetForm}>Try again</Button>
					</div>
				{:else}
					<div class="cell-1" in:fade={{ duration: 200, delay: 100 }} out:fade={{ duration: 200 }}>
						<form {...checkName.enhance(enhance)}>
							<div>
								<input class="px-2 py-1" {...checkName.fields.name.as('text')} />
							</div>
							<Button {...checkName.buttonProps.enhance(enhance)}>Send</Button>
						</form>
					</div>
				{/if}
			</div>
		</Card>

		<Card>
			<div>Command</div>
			<div>It's dangerous to go alone! Take this</div>
			<div>
				<button
					class="flex w-full cursor-pointer items-center justify-center gap-2"
					onclick={toggleCookie}>
					<Cookie />
					{#if !hasCookie}
						<div class="flex items-center overflow-hidden" transition:shrink>
							<Dot />
							<Dot />
							<Dot />
							<ChevronRight />
						</div>
					{/if}
					<Backpack />
					{#if hasCookie}
						<div class="text-green-500" in:fade={{ duration: 500 }}>
							<Check />
						</div>
					{/if}
				</button>
			</div>
			{#if responses.command}
				<div class={[errors.command && 'text-red-600']} transition:fade>{responses.command}</div>
			{/if}
			<Button onclick={command}>Adventure</Button>
		</Card>
	</div>
</div>

<div class="mt-4 flex flex-col gap-2">
	<div class="text-[20px] text-slate-700">Setup</div>
	<Install />
	<MakeCommander />
	<Remote />
</div>

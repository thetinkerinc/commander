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

import Example from './components/example.svelte';
import Install from './components/install.svelte';
import MakeCommander from './components/make-commander.svelte';
import Remote from './components/remote.svelte';
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
		<Example type="query" lines="L9-L22">
			<div class="text-gray-600 italic">Swear the oath to retrieve a secret</div>
			<div class="my-1">
				<label for="promised" class="flex items-center gap-2">
					<input id="promised" type="checkbox" bind:checked={promised} />
					I solemnly swear that I am up to no good
				</label>
			</div>
			{#if responses.query}
				{@render response('query')}
			{/if}
			<div class="mt-2">
				<Button onclick={query}>Reveal</Button>
			</div>

			{#snippet help()}
				Hello There everybody what are you doing here?
			{/snippet}
		</Example>

		<Example type="form" lines="L24-L40">
			<div class="mb-2 leading-tight text-gray-600 italic">
				What can I call you? I only trust travellers with a good, strong name like Sam
			</div>
			<div class="grid">
				{#if responses.form}
					<div class="cell-1" in:fade={{ duration: 200, delay: 100 }} out:fade={{ duration: 200 }}>
						{@render response('form')}
						<Button onclick={resetForm}>Try again</Button>
					</div>
				{:else}
					<div class="cell-1" in:fade={{ duration: 200, delay: 100 }} out:fade={{ duration: 200 }}>
						<form {...checkName.enhance(enhance)}>
							<input class="mb-1 block rounded px-2 py-1" {...checkName.fields.name.as('text')} />
							<Button {...checkName.buttonProps.enhance(enhance)}>Send</Button>
						</form>
					</div>
				{/if}
			</div>

			{#snippet help()}
				Hello There everybody what are you doing here?
			{/snippet}
		</Example>

		<Example type="command" lines="L42-L51">
			<div class="text-gray-600 italic">It's dangerous to go alone! Take this</div>
			<button
				class="my-4 flex w-full cursor-pointer items-center justify-center gap-2"
				onclick={toggleCookie}>
				<Cookie size={27} />
				{#if !hasCookie}
					<div class="flex items-center overflow-hidden" transition:shrink>
						<Dot />
						<Dot />
						<Dot />
						<ChevronRight />
					</div>
				{/if}
				<Backpack size={27} />
				{#if hasCookie}
					<div class="text-green-500" in:fade={{ duration: 500 }}>
						<Check />
					</div>
				{/if}
			</button>
			{#if responses.command}
				{@render response('command')}
			{/if}
			<Button onclick={command}>Adventure</Button>

			{#snippet help()}
				Hello There everybody what are you doing here?
			{/snippet}
		</Example>
	</div>
</div>

<div class="mt-5">
	<div class="mb-2 text-[20px] text-slate-700">Setup</div>
	<div class="flex flex-col gap-4">
		<Install />
		<MakeCommander />
		<Remote />
	</div>
</div>

{#snippet response(type: ResponseType)}
	<div class={['my-1', !errors[type] && 'italic', errors[type] && 'text-red-600']} transition:fade>
		{responses[type]}
	</div>
{/snippet}

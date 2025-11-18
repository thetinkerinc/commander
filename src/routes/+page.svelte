<script lang="ts">
import { getSecret } from './data.remote.ts';

import Button from './button.svelte';

let secret = $state('');

async function query() {
	secret = await getSecret(false);
}

async function form() {

}

async function command() {

}
</script>

<svelte:head>
	<title>Commander</title>
</svelte:head>
<div class="flex gap-4">
	<img class="w-[200px]" src="/logo.png" alt="Knight holding a spear guarding a door" />
	<div class="flex flex-col justify-center">
		<div class="text-[70px] leading-[normal] font-medium">Commander</div>
		<div class="text-[30px] leading-[normal] italic text-gray-600 ml-1">
			Keep out unwanted guests
		</div>
	</div>
</div>

<div>
	<div>Query</div>
	<Button onclick={query}>Hello</Button>
</div>
<div>
	<div>Form</div>
	<Button onclick={query}>Hello</Button>
</div>
<div>
	<div>Command</div>
	<Button onclick={query}>Hello</Button>
</div>

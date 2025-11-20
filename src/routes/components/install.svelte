<script lang="ts">
const outline =
	'<pre class="shiki snazzy-light" style="background-color:#f1f5f9;color:#565869" tabindex="0"><code><span class="line"><span>COMMAND @thetinkerinc/commander</span></span></code></pre>';
const commands = {
	npm: 'npm install',
	pnpm: 'pnpm add',
	bun: 'bun add',
	yarn: 'yarn add'
};

let command = $state<keyof typeof commands>('npm');

let snippet = $derived(outline.replace('COMMAND', commands[command]));
</script>

<div>
	<div class="flex items-center gap-1">
		{#each Object.keys(commands) as cmd}
			{@const selected = cmd === command}
			<button
				class={[
					'cursor-pointer rounded-t-lg px-3 py-1',
					selected && 'bg-slate-100',
					!selected && 'hover:bg-slate-50'
				]}
				onclick={() => (command = cmd as keyof typeof commands)}>
				{cmd}
			</button>
		{/each}
	</div>
	<div class={['rounded-lg bg-slate-100 px-3 py-1', command === 'npm' && 'rounded-tl-none']}>
		{@html snippet}
	</div>
</div>

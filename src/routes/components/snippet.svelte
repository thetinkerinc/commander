<script lang="ts">
let { title, snippet } = $props();
</script>

<div class="rounded-lg bg-slate-100 px-3 py-2">
	<div class="mb-3 flex items-center gap-2">
		<div class="size-[12px] rounded-full bg-red-500"></div>
		<div class="size-[12px] rounded-full bg-yellow-400"></div>
		<div class="size-[12px] rounded-full bg-green-500"></div>
		<div class="ml-3 italic">{title}</div>
	</div>
	{@html snippet}
</div>

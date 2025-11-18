<script lang="ts">
let { children } = $props();
</script>

<div class="rounded shadow-md px-4 py-2 bg-linear-65 from-slate-300 to-slate-100 w-[400px]">
	{@render children()}
</div>

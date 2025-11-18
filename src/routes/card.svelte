<script lang="ts">
let { children } = $props();
</script>

<div class="w-[400px] rounded bg-linear-65 from-slate-300 to-slate-100 px-4 py-2 shadow-md">
	{@render children()}
</div>

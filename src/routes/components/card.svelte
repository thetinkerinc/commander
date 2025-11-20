<script lang="ts">
let { children } = $props();
</script>

<div class="rounded bg-slate-100 px-4 py-2 shadow-md">
	{@render children()}
</div>

<script lang="ts">
let { children } = $props();
</script>

<div class="rounded bg-slate-100 px-4 pt-2 pb-3 shadow-md">
	{@render children()}
</div>

<script lang="ts">
let { children, ...rest } = $props();
</script>

<button class="bg-amber-600 px-3 py-1 rounded shadow cursor-pointer" {...rest}>
	{@render children()}
</button>

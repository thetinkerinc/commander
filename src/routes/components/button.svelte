<script lang="ts">
let { children, ...rest } = $props();
</script>

<button class="cursor-pointer rounded bg-amber-600 px-3 py-1 shadow" {...rest}>
	{@render children()}
</button>

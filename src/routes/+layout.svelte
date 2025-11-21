<script lang="ts">
import '../app.css';

let { children } = $props();
</script>

<div class="bg-white dark:bg-black">
	<div class="mx-auto w-[90%] max-w-[1200px] pt-4 pb-6">
		{@render children()}
	</div>
</div>

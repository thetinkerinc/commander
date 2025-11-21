<script lang="ts">
import { browser } from '$app/environment';
import Sun from '@lucide/svelte/icons/sun';
import Moon from '@lucide/svelte/icons/moon';

type Theme = 'light' | 'dark';

const initialTheme: Theme = getInitialTheme();

let theme = $state<Theme>(initialTheme);

let nudge = $derived<number>(theme === 'light' ? 0 : -35);

$effect(() => {
	if (theme === 'light') {
		document.documentElement.classList.remove('dark');
	} else {
		document.documentElement.classList.add('dark');
	}
});

function getInitialTheme(): Theme {
	if (!browser) {
		return 'light';
	}
	return (
		(localStorage?.getItem('theme') as Theme) ??
		(window?.matchMedia('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light')
	);
}

function toggleTheme() {
	theme = theme === 'light' ? 'dark' : 'light';
	localStorage.setItem('theme', theme);
}
</script>

<button class="block size-[25px] cursor-pointer overflow-hidden rounded-full" onclick={toggleTheme}>
	<div class="transition-transform" style="translate: 0 {nudge}px">
		<Sun size={25} />
		<div class="my-[10px]"></div>
		<Moon size={25} />
	</div>
</button>

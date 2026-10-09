import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			preprocess: vitePreprocess(),
			compilerOptions: { experimental: { async: true } },
			adapter: adapter(),
			experimental: { remoteFunctions: true },
			alias: { $utils: './src/utils' }
		}),
		paraglideVitePlugin({ project: './project.inlang', outdir: './src/utils/paraglide' })
	]
});

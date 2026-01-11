import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss(), svelte()],
  base: './',
  server: {
    port: 4203,
    host: 'localhost',
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});

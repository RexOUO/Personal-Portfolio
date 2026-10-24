import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' makes every asset path relative, so the site works at
// https://rexouo.github.io/Personal-Portfolio/ without hard-coding the repo name.
export default defineConfig({
  base: './',
  plugins: [react()],
});

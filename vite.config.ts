import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [solid()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'fastcomments-solidjs',
      fileName: (format) => (format === 'cjs' ? 'index.cjs' : 'index.js'),
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['solid-js', 'solid-js/web', 'solid-js/store', 'fastcomments-typescript'],
      output: {
        globals: {
          'solid-js': 'Solid',
          'solid-js/web': 'SolidWeb',
        },
      },
    },
    sourcemap: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    transformMode: { web: [/\.[jt]sx?$/] },
    server: { deps: { inline: [/solid-js/] } },
  },
});

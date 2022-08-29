import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import visualizer from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import env from 'vite-plugin-env-compatible';

var plugins = [];

var mode = process.env.ANALYZE_MODE;

if (mode === 'bundle')
   plugins.push(
      visualizer({
         filename: resolve(__dirname, 'build/stats.html'),
         template: 'treemap', // sunburst|treemap|network
         sourcemap: true,
      }),
   );

// @ts-ignore
export default defineConfig({
   build: {
      chunkSizeWarningLimit: 700,
      outDir: 'build',
      target: 'es2015',
      minify: 'terser',
      sourcemap: true,
      rollupOptions: {
         preserveEntrySignatures: false,
         output: {
            sourcemap: true,
         },
         plugins: plugins,
      },
      terserOptions: {
         format: {
            comments: false,
         },
         compress: true,
      },
   },
   plugins: [react(), env({ prefix: 'REACT_APP' })],
   preview: {
      port: 3009,
   },
});

import path from 'path';
import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';

import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  root: './',
  base: './',
  publicDir: './src/assets',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'package.json': path.resolve(__dirname, 'package.json'),
    },
  },
  plugins: [
    react(),
    eslintPlugin({
      include: [
        './src/**/*.ts',
        './src/**/*.tsx',
      ],
      fix: true,
    }),
  ],
  build: {
    outDir: path.resolve(__dirname, './dist'),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].css',
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 8001,
    strictPort: true,
  },
});

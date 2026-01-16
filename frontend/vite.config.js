import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    plugins: [react()],
    css: {
      postcss: {
        plugins: [],
      },
    },
    base: isProd ? '/vite/' : '/',
    build: {
      outDir: '../public/vite',
      emptyOutDir: true,
      manifest: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/main.jsx')
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
      cors: true,
      hmr: {
        host: 'localhost',
        port: 5173,
      },
      proxy: {
        '/graphql': {
          target: 'http://app:3000',
          changeOrigin: true,
          secure: false,
        },
        '/investors': {
          target: 'http://app:3000',
          changeOrigin: true,
          secure: false,
        },
        '/api': {
          target: 'http://app:3000',
          changeOrigin: true,
          secure: false,
        },
      }
    },
  };
});
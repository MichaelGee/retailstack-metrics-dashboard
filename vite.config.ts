import path from 'path';
import url from 'url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      src: './src',
      '@utils': './src/utils',
      '@assets': './src/assets',
      '@components': './src/components',
      '@config': './src/config',
      '@context': './src/context',
      '@layouts': './src/layouts',
      '@pages': './src/pages',
      '@types': './src/types',
    },
  },
  server: {
    port: 9001,
    host: true,
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query', 'axios'],
          ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-dropdown-menu',
          ],
          charts: ['recharts'],
          motion: ['framer-motion'],
        },
      },
    },
  },
});

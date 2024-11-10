import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis', // Set 'global' to 'globalThis'
    'process.env': {}, // Provide a default process.env
  },
  resolve: {
    alias: {
      util: 'util/util.js', // For util module
      stream: 'stream-browserify',
      buffer: 'buffer/',
      process: 'process/browser', // Alias process to the browser version
    },
  },
});

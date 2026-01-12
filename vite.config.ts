
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Fix: Define __dirname for ES modules environment as it's not available by default
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
    // Fix: Use path.resolve('.') instead of process.cwd() to fix the "Property 'cwd' does not exist on type 'Process'" error
    const env = loadEnv(mode, path.resolve('.'), '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // Netlify sẽ cung cấp GEMINI_API_KEY trong Environment Variables
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.API_KEY),
      },
      resolve: {
        alias: {
          // Fix: Use the defined __dirname to correctly resolve the alias path
          '@': path.resolve(__dirname, './'),
        }
      },
      build: {
        outDir: 'dist',
        sourcemap: false,
        minify: 'terser',
        chunkSizeWarningLimit: 1600,
      }
    };
});

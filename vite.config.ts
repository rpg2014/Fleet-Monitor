import { defineConfig } from 'vite'
import deno from '@deno/vite-plugin'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    deno(), 
    react()
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js']
  },
  publicDir: 'public',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          query: ['@tanstack/react-query'],
          charts: ['@nivo/core', '@nivo/line'],
        }
      },
    },
  },
})

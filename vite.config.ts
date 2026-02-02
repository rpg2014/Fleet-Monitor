import { defineConfig } from 'vite'
import deno from '@deno/vite-plugin'
import react from '@vitejs/plugin-react-swc'

import { analyzer } from 'vite-bundle-analyzer'
// https://vite.dev/config/
export default defineConfig({
  plugins: [deno(), react(), analyzer()],
  publicDir: 'public',
  build: {
    rollupOptions: {
      output: {
        manualChunks: id => {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
})

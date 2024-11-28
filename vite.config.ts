import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@form': path.resolve(__dirname, 'src/form')
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts')
    },
  },
})

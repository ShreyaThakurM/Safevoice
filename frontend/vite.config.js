import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // You might need to run: npm install --save-dev @types/node

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
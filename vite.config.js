import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  base: './',
  
  root: path.join(__dirname, 'src/renderer'),
  
  build: {
    outDir: path.join(__dirname, 'dist/renderer'),
    emptyOutDir: true,
  },
  
  server: {
    port: 5173,
    strictPort: true,
  },
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/renderer/src'),
      '@components': path.resolve(__dirname, './src/renderer/src/components'),
      '@pages': path.resolve(__dirname, './src/renderer/src/pages'),
      '@hooks': path.resolve(__dirname, './src/renderer/src/hooks'),
      '@api': path.resolve(__dirname, './src/renderer/src/api'),
      '@store': path.resolve(__dirname, './src/renderer/src/store'),
      '@utils': path.resolve(__dirname, './src/renderer/src/utils'),
      '@assets': path.resolve(__dirname, './src/renderer/src/assets'),
    },
  },
})
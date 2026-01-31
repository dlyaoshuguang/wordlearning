import { defineConfig } from "vite";
import react from '@vitejs/plugin-react'
export default defineConfig({
  base: '/wordlearning/',
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
})
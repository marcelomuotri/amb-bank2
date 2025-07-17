import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Ignorar errores de TypeScript durante el build
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignorar warnings de TypeScript
        if (warning.code === 'TS2304' || warning.code === 'TS6133' || warning.code === 'TS2339') {
          return;
        }
        warn(warning);
      }
    }
  },
  esbuild: {
    // Configurar esbuild para ser menos estricto
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})

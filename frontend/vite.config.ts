import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Code splitting para chunks más pequeños
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase': ['firebase', 'firebase-admin'],
          'utils': ['axios', 'uuid']
        }
      }
    },
    // Optimizar tamaño de chunks
    chunkSizeWarningLimit: 1000,
    // Minificación con terser para mejor compresión
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Eliminar console.log en producción
        drop_debugger: true
      }
    }
  },
  // Optimizaciones de servidor dev
  server: {
    hmr: {
      overlay: false // Mejorar HMR performance
    }
  },
  // Pre-bundle dependencies para carga más rápida
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios']
  }
})

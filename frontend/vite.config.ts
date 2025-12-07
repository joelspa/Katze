import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Code splitting para chunks más pequeños
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('react-router')) {
              return 'router-vendor';
            }
            if (id.includes('firebase')) {
              return 'firebase-vendor';
            }
            if (id.includes('axios')) {
              return 'axios-vendor';
            }
            return 'vendor';
          }
        },
        // Optimize chunk names
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    // Optimizar tamaño de chunks
    chunkSizeWarningLimit: 1000,
    // Minificación con esbuild (más rápida que terser)
    minify: 'esbuild',
    // Optimizar el output
    cssCodeSplit: true,
    sourcemap: false,
    target: 'es2015'
  },
  // Optimizaciones de servidor dev
  server: {
    hmr: {
      overlay: false, // Mejorar HMR performance
      clientPort: 5173
    },
    port: 5173
  },
  // Pre-bundle dependencies para carga más rápida
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios']
  }
})

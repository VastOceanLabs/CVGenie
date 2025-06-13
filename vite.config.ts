import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      fastRefresh: true,
    })
  ],

  // CRITICAL: Set base for GitHub Pages - CVGenie specific
  base: process.env.NODE_ENV === 'production' ? '/CVGenie/' : '/',

  // Path resolution for clean imports
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/data': path.resolve(__dirname, './src/data'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/assets': path.resolve(__dirname, './src/assets')
    }
  },

  // Development server configuration
  server: {
    port: 3000,
    host: true,
    open: true,
  },

  // Build configuration optimized for GitHub Pages
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'icons': ['lucide-react'],
        }
      }
    },

    assetsDir: 'assets',
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000
  },

  // CSS preprocessing
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer')
      ]
    }
  },

  // Optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'lucide-react'
    ]
  }
});
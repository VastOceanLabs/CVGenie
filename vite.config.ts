import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
      // Optimize React production builds
      babel: {
        plugins: [
          // Remove console.log in production
          process.env.NODE_ENV === 'production' && ['transform-remove-console', { exclude: ['error', 'warn'] }]
        ].filter(Boolean)
      }
    }),
    
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'FreeResume Builder',
        short_name: 'FreeResume',
        description: 'Build professional resumes for free - No hidden fees, no credit card required',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        // Cache strategy for better offline experience
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
              },
              cacheKeyWillBeUsed: async ({ request }) => {
                return request.url
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
              }
            }
          }
        ]
      }
    })
  ],

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
    host: true, // Allow external connections
    open: true, // Open browser automatically
    hmr: {
      overlay: true
    }
  },

  // Preview server (for testing production builds)
  preview: {
    port: 4173,
    host: true
  },

  // Build configuration optimized for Cloudflare Pages
  build: {
    // Target modern browsers for better performance
    target: 'es2020',
    
    // Output directory
    outDir: 'dist',
    
    // Generate source maps for debugging (but exclude from production for size)
    sourcemap: process.env.NODE_ENV === 'development',
    
    // Optimize bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true,
        pure_funcs: process.env.NODE_ENV === 'production' ? ['console.log', 'console.info'] : []
      },
      mangle: {
        safari10: true
      }
    },

    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        // Manual chunk splitting for optimal loading
        manualChunks: {
          // React ecosystem
          'react-vendor': ['react', 'react-dom'],
          
          // Routing
          'router': ['react-router-dom'],
          
          // PDF generation (lazy loaded)
          'pdf-vendor': ['jspdf', 'html2canvas'],
          
          // Form handling
          'form-vendor': ['react-hook-form'],
          
          // Icons (large bundle)
          'icons': ['lucide-react'],
          
          // Utilities
          'utils': ['date-fns', 'clsx']
        },
        
        // Asset naming for better caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(css)$/.test(assetInfo.name)) {
            return `css/[name]-[hash].${ext}`;
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `images/[name]-[hash].${ext}`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `fonts/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        }
      }
    },

    // Asset handling
    assetsDir: 'assets',
    assetsInlineLimit: 4096, // 4kb - inline smaller assets as base64
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // Report bundle size
    reportCompressedSize: true,
    
    // Bundle size warning threshold
    chunkSizeWarningLimit: 1000
  },

  // CSS preprocessing
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer')
      ]
    },
    // CSS modules configuration (if needed)
    modules: {
      localsConvention: 'camelCase'
    }
  },

  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  },

  // Optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      'date-fns',
      'clsx'
    ],
    exclude: [
      // Exclude large libraries that should be lazy loaded
      'jspdf',
      'html2canvas'
    ]
  },

  // Esbuild configuration for faster builds
  esbuild: {
    // Remove debugger statements in production
    drop: process.env.NODE_ENV === 'production' ? ['debugger'] : [],
    
    // Legal comments handling
    legalComments: 'none'
  },

  // Base URL for assets (useful for Cloudflare Pages)
  base: process.env.NODE_ENV === 'production' ? '/' : '/',

  // Experimental features
  experimental: {
    // Enable build time optimization
    renderBuiltUrl(filename) {
      // Optimize asset URLs for CDN
      return filename;
    }
  }
});
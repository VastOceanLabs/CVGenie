/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{vue,svelte}',
    './public/**/*.html'
  ],
  
  theme: {
    extend: {
      // Custom color palette optimized for professional resumes and modern UI
      colors: {
        // Primary brand colors
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // Main brand color
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554'
        },
        
        // Secondary colors for accents and highlights
        secondary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed', // Secondary brand color
          800: '#6b21a8',
          900: '#581c87',
          950: '#3b0764'
        },
        
        // Success colors for completed sections, validation
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Main success color
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22'
        },
        
        // Warning colors for incomplete sections, tips
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Main warning color
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03'
        },
        
        // Error colors for validation errors
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444', // Main error color
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a'
        },
        
        // Extended gray palette for better typography and UI
        gray: {
          25: '#fcfcfd',
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          925: '#0c1220',
          950: '#030712'
        },
        
        // Professional resume template colors
        resume: {
          navy: '#1e3a8a',
          charcoal: '#374151',
          forest: '#047857',
          burgundy: '#991b1b',
          slate: '#475569',
          gold: '#d97706',
          teal: '#0d9488',
          purple: '#7c3aed'
        },
        
        // ATS-friendly colors (high contrast, print-safe)
        ats: {
          black: '#000000',
          darkgray: '#333333',
          mediumgray: '#666666',
          lightgray: '#999999',
          blue: '#0066cc',
          green: '#006600'
        }
      },
      
      // Typography scale optimized for forms and resume content
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        resume: ['Georgia', 'Times', 'serif'], // Professional serif for resumes
      },
      
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }], // 10px
        'xs': ['0.75rem', { lineHeight: '1rem' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],     // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
        '5xl': ['3rem', { lineHeight: '1.1' }],         // 48px
        '6xl': ['3.75rem', { lineHeight: '1.1' }],      // 60px
        '7xl': ['4.5rem', { lineHeight: '1.1' }],       // 72px
        '8xl': ['6rem', { lineHeight: '1.1' }],         // 96px
        '9xl': ['8rem', { lineHeight: '1.1' }],         // 128px
      },
      
      // Custom spacing for forms and layouts
      spacing: {
        '4.5': '1.125rem',  // 18px
        '5.5': '1.375rem',  // 22px
        '6.5': '1.625rem',  // 26px
        '7.5': '1.875rem',  // 30px
        '8.5': '2.125rem',  // 34px
        '9.5': '2.375rem',  // 38px
        '10.5': '2.625rem', // 42px
        '11.5': '2.875rem', // 46px
        '12.5': '3.125rem', // 50px
        '13': '3.25rem',    // 52px
        '15': '3.75rem',    // 60px
        '17': '4.25rem',    // 68px
        '18': '4.5rem',     // 72px
        '19': '4.75rem',    // 76px
        '21': '5.25rem',    // 84px
        '22': '5.5rem',     // 88px
        '84': '21rem',      // 336px
        '88': '22rem',      // 352px
        '92': '23rem',      // 368px
        '96': '24rem',      // 384px
        '100': '25rem',     // 400px
        '104': '26rem',     // 416px
        '108': '27rem',     // 432px
        '112': '28rem',     // 448px
        '116': '29rem',     // 464px
        '120': '30rem',     // 480px
      },
      
      // Enhanced responsive breakpoints
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
        // Print-specific breakpoint
        'print': { 'raw': 'print' },
        // High-DPI screens
        'retina': { 'raw': '(-webkit-min-device-pixel-ratio: 2)' }
      },
      
      // Custom shadows for modern UI
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'sm': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'DEFAULT': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
        'none': 'none',
        // Custom shadows for specific use cases
        'glow': '0 0 20px rgb(59 130 246 / 0.15)',
        'glow-lg': '0 0 40px rgb(59 130 246 / 0.2)',
        'form': '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px 0 rgb(0 0 0 / 0.06)',
        'card-hover': '0 10px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      
      // Custom border radius for modern UI
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        'DEFAULT': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        'full': '9999px',
      },
      
      // Animation and transitions
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'fade-out': 'fadeOut 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-left': 'slideLeft 0.3s ease-out',
        'slide-right': 'slideRight 0.3s ease-out',
        'scale-up': 'scaleUp 0.2s ease-out',
        'scale-down': 'scaleDown 0.2s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient': 'gradient 3s ease infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleDown: {
          '0%': { transform: 'scale(1.1)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '40%, 43%': { transform: 'translate3d(0, -8px, 0)' },
          '70%': { transform: 'translate3d(0, -4px, 0)' },
          '90%': { transform: 'translate3d(0, -2px, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgb(59 130 246 / 0.1)' },
          '100%': { boxShadow: '0 0 40px rgb(59 130 246 / 0.2)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      
      // Custom transitions
      transitionDuration: {
        '0': '0ms',
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '400': '400ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
        '2000': '2000ms',
      },
      
      // Z-index scale for layering
      zIndex: {
        '1': '1',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
        'auto': 'auto',
        'modal': '1000',
        'popover': '1010',
        'tooltip': '1020',
        'toast': '1030',
      },
      
      // Custom gradients
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-mesh': 'radial-gradient(at 40% 20%, hsla(228,74%,56%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(189,68%,75%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(355,85%,93%,1) 0px, transparent 50%)',
        'noise': 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%\' height=\'100%\' filter=\'url(%23noiseFilter)\' opacity=\'0.4\'/%3E%3C/svg%3E")',
      },
      
      // Custom backdrop blur
      backdropBlur: {
        '4xl': '72px',
        '5xl': '96px',
        '6xl': '128px',
      },
    },
  },
  
  plugins: [
    // Forms plugin for better form styling
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    
    // Typography plugin for better text content
    require('@tailwindcss/typography'),
    
    // Aspect ratio plugin for responsive media
    require('@tailwindcss/aspect-ratio'),
    
    // Container queries plugin
    require('@tailwindcss/container-queries'),
    
    // Custom plugin for resume builder specific utilities
    function({ addUtilities, addComponents, addBase, theme }) {
      // Base styles for better defaults
      addBase({
        // Smooth scrolling
        'html': {
          scrollBehavior: 'smooth',
        },
        
        // Better focus styles
        '*:focus': {
          outline: '2px solid transparent',
          outlineOffset: '2px',
        },
        
        // Print styles for resume generation
        '@media print': {
          '*': {
            '-webkit-print-color-adjust': 'exact !important',
            'color-adjust': 'exact !important',
          },
          'body': {
            margin: '0 !important',
            padding: '0 !important',
          },
          '.no-print': {
            display: 'none !important',
          },
          '.print-break-before': {
            pageBreakBefore: 'always',
          },
          '.print-break-after': {
            pageBreakAfter: 'always',
          },
          '.print-break-inside-avoid': {
            pageBreakInside: 'avoid',
          },
        },
      });
      
      // Custom component classes
      addComponents({
        // Glass morphism effect
        '.glass': {
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        
        '.glass-dark': {
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        
        // Gradient text
        '.text-gradient': {
          background: `linear-gradient(135deg, ${theme('colors.primary.600')} 0%, ${theme('colors.secondary.600')} 50%, ${theme('colors.pink.500')} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        },
        
        // Button variants
        '.btn-primary': {
          background: `linear-gradient(135deg, ${theme('colors.primary.600')} 0%, ${theme('colors.primary.700')} 100%)`,
          boxShadow: `0 10px 30px ${theme('colors.primary.600')}30`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 15px 40px ${theme('colors.primary.600')}40`,
          },
        },
        
        '.btn-secondary': {
          background: `linear-gradient(135deg, ${theme('colors.secondary.600')} 0%, ${theme('colors.secondary.700')} 100%)`,
          boxShadow: `0 10px 30px ${theme('colors.secondary.600')}30`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 15px 40px ${theme('colors.secondary.600')}40`,
          },
        },
        
        '.btn-accent': {
          background: `linear-gradient(135deg, ${theme('colors.warning.500')} 0%, ${theme('colors.orange.500')} 100%)`,
          boxShadow: `0 10px 30px ${theme('colors.warning.500')}30`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 15px 40px ${theme('colors.warning.500')}40`,
          },
        },
        
        // Card variants
        '.card': {
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        
        '.card-hover': {
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            background: 'rgba(255, 255, 255, 0.95)',
            boxShadow: theme('boxShadow.card-hover'),
          },
        },
        
        // Form elements
        '.form-input': {
          borderRadius: theme('borderRadius.lg'),
          borderColor: theme('colors.gray.300'),
          '&:focus': {
            borderColor: theme('colors.primary.500'),
            boxShadow: `0 0 0 3px ${theme('colors.primary.500')}20`,
          },
        },
        
        '.form-select': {
          borderRadius: theme('borderRadius.lg'),
          borderColor: theme('colors.gray.300'),
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
          '&:focus': {
            borderColor: theme('colors.primary.500'),
            boxShadow: `0 0 0 3px ${theme('colors.primary.500')}20`,
          },
        },
        
        // Loading states
        '.loading': {
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: `linear-gradient(90deg, transparent, ${theme('colors.gray.200')}, transparent)`,
            animation: 'shimmer 2s infinite',
          },
        },
      });
      
      // Custom utilities
      addUtilities({
        // Text utilities
        '.text-balance': {
          textWrap: 'balance',
        },
        
        // Scrollbar utilities
        '.scrollbar-hide': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
        
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: theme('colors.gray.100'),
          },
          '&::-webkit-scrollbar-thumb': {
            background: theme('colors.gray.300'),
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: theme('colors.gray.400'),
          },
        },
        
        // Safe area utilities for mobile
        '.pt-safe': {
          paddingTop: 'env(safe-area-inset-top)',
        },
        '.pb-safe': {
          paddingBottom: 'env(safe-area-inset-bottom)',
        },
        '.pl-safe': {
          paddingLeft: 'env(safe-area-inset-left)',
        },
        '.pr-safe': {
          paddingRight: 'env(safe-area-inset-right)',
        },
        
        // Aspect ratio utilities for resume previews
        '.aspect-resume': {
          aspectRatio: '8.5 / 11', // US Letter paper ratio
        },
        '.aspect-a4': {
          aspectRatio: '210 / 297', // A4 paper ratio
        },
      });
    },
  ],
  
  // Dark mode configuration
  darkMode: 'class',
  
  // Prefix for avoiding conflicts (optional)
  // prefix: 'tw-',
  
  // Important selector for specificity (use carefully)
  // important: true,
  
  // Purge/content configuration for production optimization
  future: {
    hoverOnlyWhenSupported: true,
    respectDefaultRingColorOpacity: false,
    disableColorOpacityUtilitiesByDefault: false,
    relativeContentPathsByDefault: false,
  },
  
  experimental: {
    optimizeUniversalDefaults: true,
    matchVariant: true,
  },
};
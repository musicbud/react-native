/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // MusicBud Core Dark Theme
        background: {
          DEFAULT: '#0F0E12', // Deep cool grey/green dark from Figma
          layer1: '#1A1A22', // Slightly elevated flat
          layer2: '#282833', // Cards and elevated menus
          layer3: '#333342', // Tooltips
        },
        primary: {
          DEFAULT: '#FF2D55', // Figma Primary Red
          dim: '#FE2C54',
          glow: 'rgba(255, 45, 85, 0.2)'
        },
        secondary: {
          DEFAULT: '#0ACF83', // Figma Accent Green
          dim: '#71C173',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          tertiary: '#64748B',
          dim: '#475569'
        },
        surface: {
          glass: 'rgba(24, 26, 32, 0.6)', 
          glassStrong: 'rgba(24, 26, 32, 0.85)',
          border: '#334155'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui'],
        display: ['Outfit', 'system-ui'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      // Reanimated fluid transitions and native scales
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

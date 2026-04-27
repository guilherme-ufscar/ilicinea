import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F5820A',
          hover: '#D96E00',
          light: '#FEF0DC',
          dark: '#B35A00',
        },
        text: {
          DEFAULT: '#111111',
          soft: '#444444',
          muted: '#888888',
        },
        accent: {
          DEFAULT: '#E8263A',
          light: '#FDE8EA',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          soft: '#F8F8F8',
          card: '#FFFFFF',
        },
        border: {
          DEFAULT: '#E5E5E5',
          strong: '#CCCCCC',
        },
        plan: {
          free: '#888888',
          essential: '#F5820A',
          professional: '#111111',
        },
        status: {
          success: '#16A34A',
          warning: '#F59E0B',
          error: '#DC2626',
          info: '#2563EB',
        },
        whatsapp: {
          DEFAULT: '#25D366',
          hover: '#1EBE5A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontWeight: {
        display: '700',
        heading: '600',
        label: '500',
      },
    },
  },
  plugins: [],
}

export default config

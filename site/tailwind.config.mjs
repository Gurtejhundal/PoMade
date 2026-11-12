import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          light: '#FBFBF9',
          dark: '#0B0C0E',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#14161B',
        },
        subtle: {
          light: '#F2F2EE',
          dark: '#1B1E26',
        },
        border: {
          subtle: {
            light: '#E8E8E4',
            dark: '#252830',
          },
          strong: {
            light: '#D1D1CB',
            dark: '#383D4A',
          },
        },
        text: {
          primary: {
            light: '#111215',
            dark: '#ECEFF4',
          },
          secondary: {
            light: '#4B5162',
            dark: '#B0B7C3',
          },
          muted: {
            light: '#6E7381',
            dark: '#8B949E',
          },
        },
        copper: {
          50: '#FDF8F5',
          100: '#FBEFE8',
          200: '#F5DC CE',
          300: '#ECC3AC',
          400: '#DF9F7B',
          500: '#C26526', // Pomade Light Accent
          600: '#A6521A',
          700: '#8A4114',
          800: '#6E3210',
          900: '#53250D',
        },
        amberGold: {
          400: '#FBBF24',
          500: '#F59E0B', // Pomade Dark Accent
          600: '#D97706',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
        mono: [
          '"Geist Mono"',
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      boxShadow: {
        editorial: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      },
    },
  },
  plugins: [],
};

export default config;

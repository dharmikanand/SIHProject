/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Stock palette remap: legacy components automatically inherit the
        // Editorial Harvest brand (emerald→field green, stone→warm ink/paper).
        emerald: {
          50: '#F0F5F1', 100: '#DCE8DF', 200: '#B9D1C0', 300: '#8FBA9E',
          400: '#4E7D5E', 500: '#2D5A3D', 600: '#264D34', 700: '#1E3D2A',
          800: '#162E1F', 900: '#0F2015', 950: '#0A170E',
        },
        stone: {
          50: '#FAF7F0', 100: '#F1ECE1', 200: '#E8E1D3', 300: '#D6CCB8',
          400: '#B3A58C', 500: '#8C7E64', 600: '#6B5F4B', 700: '#4E4636',
          800: '#332E24', 900: '#211D16', 950: '#14110D',
        },
        paper: {
          DEFAULT: '#FAF7F0',
          2: '#F1ECE1',
          3: '#E8E1D3',
        },
        ink: {
          DEFAULT: '#1C1917',
          2: '#57534E',
          3: '#A8A29E',
        },
        hairline: '#E2DCD0',
        field: {
          50: '#F0F5F1',
          100: '#DCE8DF',
          200: '#B9D1C0',
          400: '#4E7D5E',
          500: '#2D5A3D',
          600: '#264D34',
          700: '#1E3D2A',
          800: '#162E1F',
          900: '#0F2015',
        },
        harvest: {
          100: '#F7E4D8',
          200: '#EFC9B1',
          500: '#C4622D',
          600: '#A54F22',
          700: '#833F1B',
        },
        gold: {
          100: '#F4EBD3',
          500: '#B8860B',
          600: '#9A7009',
        },
        // Legacy aliases kept so untouched components keep rendering correctly
        agri: {
          50: '#F0F5F1', 100: '#DCE8DF', 200: '#B9D1C0', 300: '#8FBA9E',
          400: '#4E7D5E', 500: '#2D5A3D', 600: '#264D34', 700: '#1E3D2A',
          800: '#162E1F', 900: '#0F2015', 950: '#0A170E',
        },
        harvestOld: {},
        soil: {
          50: '#FAF7F0', 100: '#F1ECE1', 200: '#E8E1D3', 300: '#D6CCB8',
          400: '#B3A58C', 500: '#8C7E64', 600: '#6B5F4B', 700: '#4E4636',
          800: '#332E24', 900: '#211D16',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      fontSize: {
        meta: ['11px', { lineHeight: '16px', letterSpacing: '0.06em' }],
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        lg: '12px',
      },
      boxShadow: {
        raised: '0 1px 2px rgba(28,25,23,0.06), 0 8px 24px rgba(28,25,23,0.10)',
        modal: '0 24px 64px rgba(28,25,23,0.24)',
      },
      keyframes: {
        settle: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        settle: 'settle 0.35s cubic-bezier(0.22,1,0.36,1) both',
        fadeIn: 'fadeIn 0.25s ease-out both',
      },
    },
  },
  plugins: [],
}

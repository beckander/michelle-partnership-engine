/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Michelle's neutral luxury palette
        cream: {
          50: '#FEFDFB',
          100: '#FDF9F3',
          200: '#F9F1E5',
          300: '#F3E6D3',
          400: '#E8D5BC',
          500: '#D9C4A5',
        },
        taupe: {
          100: '#E8E4DF',
          200: '#D4CEC6',
          300: '#B8AFA3',
          400: '#9A8F80',
          500: '#7D7267',
          600: '#5E564D',
          700: '#433D36',
        },
        blush: {
          100: '#FDF5F3',
          200: '#F9E8E3',
          300: '#F2D4CC',
          400: '#E8B8AA',
        },
        sage: {
          100: '#F2F4F1',
          200: '#E1E6DD',
          300: '#C7D1C0',
          400: '#A8B89D',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Jost', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(125, 114, 103, 0.1), 0 10px 20px -2px rgba(125, 114, 103, 0.04)',
        'soft-lg': '0 10px 40px -10px rgba(125, 114, 103, 0.15)',
      },
    },
  },
  plugins: [],
};

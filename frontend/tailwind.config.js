/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        plum: {
          900: '#2b2431',
        },
        mauve: {
          700: '#8a718a',
          400: '#cdb4c8',
        },
        blush: {
          200: '#f3d8d2',
        },
        peach: {
          400: '#d89487',
        },
      },
      boxShadow: {
        luxury: '0 20px 60px rgba(43,36,49,0.18)',
      },
      borderRadius: {
        xl: '1rem',
      },
    },
  },
  plugins: [],
};



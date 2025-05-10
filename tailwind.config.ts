/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', 
    content: [
      './app/**/*.{js,ts,jsx,tsx}',
      './pages/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
     theme: {
    extend: {
      colors: {
        'custom-light-bg': '#eceff1',
        'custom-dark-bg': '#424242',
      },
    },
  },
    plugins: [],
  };
  
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4FA151',
        'primary-dark': '#3E8E45',
      },
    },
  },
  plugins: [],
};

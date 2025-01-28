/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      mobile: '375px',
      tablet: '768px',
      laptop: '1024px',
      desktop: '1280px',
    },
    extend: {
      colors: {
        primary: '#576F35',
        secondary: { DEFAULT: '#7A3145', hover: '#622133' },
        dark: '#141414',
        light: '#FBFBFB',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};

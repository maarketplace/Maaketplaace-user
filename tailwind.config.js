/** @type {import('tailwindcss').Config} */
export const purge = ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'];
export const darkMode = "class";
export const theme = {
  extend: {
    keyframes: {
      slideUp: {
        '0%': { transform: 'translateY(100%)', opacity: 0 },
        '100%': { transform: 'translateY(0)', opacity: 1 },
      },
    },
    animation: {
      slideUp: 'slideUp 2s ease-out',
    },
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
    },
    backgroundColor: {
      'default-bg': '#000000',
    },
  },
};
export const variants = {
  extend: {},
};
export const plugins = [
  import('@tailwindcss/typography'),
];


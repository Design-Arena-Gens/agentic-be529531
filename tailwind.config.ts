import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef3f2',
          100: '#fee5e2',
          200: '#fececa',
          300: '#fcaba5',
          400: '#f87a71',
          500: '#ef5844',
          600: '#dc3626',
          700: '#b9291c',
          800: '#99251b',
          900: '#7f241c',
        },
      },
    },
  },
  plugins: [],
};
export default config;

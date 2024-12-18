/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      container: {
        center: "true",
      },
      colors: {
        background: {
          DEFAULT: "var(--clr-background)",
          muted: "var(--clr-background-muted)",
        },
        foreground: {
          DEFAULT: "var(--clr-foreground)",
          muted: "var(--clr-foreground-muted)",
        },
        primary: {
          DEFAULT: "var(--clr-primary-400)",
          600: "var(--clr-primary-600)",
          800: "var(--clr-primary-800)",
        },
      },
    },
  },
  plugins: [],
};

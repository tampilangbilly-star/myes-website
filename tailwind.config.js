/** Design system M-YES: semua warna lewat CSS variables (lihat src/app/globals.css). */
const withAlpha = (v) => `rgb(var(${v}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: withAlpha("--color-primary"),
          soft: withAlpha("--color-primary-soft"),
          strong: withAlpha("--color-primary-strong"),
          ink: withAlpha("--color-primary-ink"),
        },
        bg: withAlpha("--color-bg"),
        surface: withAlpha("--color-surface"),
        ink: {
          DEFAULT: withAlpha("--color-ink"),
          muted: withAlpha("--color-ink-muted"),
          soft: withAlpha("--color-ink-soft"),
        },
        line: withAlpha("--color-line"),
        success: withAlpha("--color-success"),
        danger: withAlpha("--color-danger"),
        warning: withAlpha("--color-warning"),
        gold: withAlpha("--color-gold"),
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: { xl: "0.875rem", "2xl": "1.25rem", "3xl": "1.75rem" },
      boxShadow: {
        card: "0 1px 2px rgb(15 23 42 / 0.04), 0 8px 24px -12px rgb(15 23 42 / 0.12)",
        lift: "0 2px 4px rgb(15 23 42 / 0.04), 0 18px 40px -16px rgb(15 23 42 / 0.22)",
      },
      screens: { xs: "400px" },
    },
  },
  plugins: [],
};

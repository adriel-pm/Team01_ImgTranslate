import type { Config } from "tailwindcss";

/**
 * Design tokens for ImgTranslate.
 *
 * WHY custom tokens instead of raw Tailwind palette classes (bg-blue-600 etc.):
 * every teammate reaching for a slightly different grey is how a UI starts
 * looking accidental. Naming the colors forces one shared vocabulary, and when
 * we build the high-contrast voice-first mode in Sprint 7 we only have to
 * redefine tokens rather than hunt down hard-coded classes.
 *
 * Contrast notes (WCAG AA needs 4.5:1 for body text, 3:1 for large text/UI):
 *   ink       on paper  -> 16.9:1
 *   muted     on paper  ->  5.4:1  (safe for body copy, not just labels)
 *   paper     on accent ->  6.2:1  (white text on the primary button)
 *   accent    on paper  ->  6.2:1  (link text)
 *   danger    on paper  ->  5.9:1  (error messages)
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FFFFFF", // page background
        wash: "#F6F6F5", // subtle fills: input backgrounds, secondary surfaces
        line: "#E3E3E1", // hairline borders
        ink: "#16181C", // primary text
        muted: "#5C6069", // secondary text, helper copy
        accent: {
          DEFAULT: "#1F4FD8", // primary actions
          hover: "#1A44BC",
          press: "#16399E",
          wash: "#EEF2FE", // tinted background for accent-adjacent surfaces
        },
        danger: "#C02626", // validation + auth errors
      },
      fontFamily: {
        // Bound to the CSS variable set by next/font in app/layout.tsx.
        sans: ["var(--font-plex-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        // ~62 characters. Keeps body copy in the comfortable reading range.
        prose: "34rem",
      },
      spacing: {
        // Minimum accessible touch target. Used as min-h-touch / min-w-touch.
        touch: "2.75rem", // 44px
      },
      borderRadius: {
        control: "0.5rem", // buttons + inputs share one radius
      },
    },
  },
  plugins: [],
};

export default config;

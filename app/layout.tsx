import { IBM_Plex_Sans } from "next/font/google";

import AuthProvider from "@/components/providers/AuthProvider";

import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";

import "./globals.css";

/**
 * Root layout. Wraps every page in the app.
 *
 * Typeface choice: IBM Plex Sans. This is not a style preference -- it is a
 * product constraint. ImgTranslate displays text in whatever language the
 * camera found, so the UI font needs wide script coverage and needs to stay
 * legible at small sizes. Plex covers Latin, Greek, Cyrillic, Arabic, Thai,
 * Devanagari and Japanese, and was drawn for interface legibility.
 *
 * next/font downloads the font at build time and self-hosts it, so there is no
 * request to Google's servers at runtime and no layout shift while it loads.
 */
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  // Exposed as a CSS variable that tailwind.config.ts binds to font-sans.
  variable: "--font-plex-sans",
});

export const metadata: Metadata = {
  title: {
    default: "ImgTranslate",
    // Page titles become "Log in · ImgTranslate". Screen reader users hear the
    // title on every navigation, so it should say where they are first.
    template: "%s · ImgTranslate",
  },
  description:
    "Point a camera at text you can't read. ImgTranslate extracts it, translates it, describes the scene, and reads it aloud.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Deliberately NOT setting maximumScale or userScalable. Blocking pinch-zoom
  // is a WCAG failure and one of the most common accessibility bugs in mobile
  // web apps. Low-vision users need to be able to zoom.
};

interface RootLayoutProps {
  children: ReactNode;
}

function RootLayout({ children }: RootLayoutProps) {
  return (
    // lang="en" tells screen readers which pronunciation rules to use.
    // From Sprint 5 we set lang on individual result panels too, so a Japanese
    // translation is read with a Japanese voice rather than an English one.
    <html lang="en" className={plexSans.variable}>
      <body className="font-sans">
        {/* Keyboard users land on this first. It lets them jump past the header
            straight to the content instead of tabbing through navigation on
            every page. Visually hidden until focused. */}
        <a href="#main" className="sr-only-focusable">
          Skip to main content
        </a>

        {/* One auth listener for the entire app. See AuthProvider for why. */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

export default RootLayout;

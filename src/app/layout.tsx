import type { Metadata, Viewport } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import { Bricolage_Grotesque } from "next/font/google";

const hubFont = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-hub",
  display: "swap",
});

// add hubFont.variable to your <html> or <body> className:
// <body className={hubFont.variable}>
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "600", "700", "900"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "PRESS PLAY: THE GAME ROOM | 600 Point Tournament Arcade",
  description: "Experience Press Play: The Game Room - an electrifying 6-game tournament featuring Greener Grass, Real Headline or Not, Name That Tune, Categories, and Reverse Millionaire.",
};

import ArabianBackground from "@/components/layout/ArabianBackground";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${spaceGrotesk.variable} ${hubFont.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <ArabianBackground />
        {children}
      </body>
    </html>
  );
}

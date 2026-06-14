import type { Metadata } from "next";
import Script from "next/script";
import { Playfair_Display, Oswald, Manrope } from "next/font/google";
import "./globals.css";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

// The DriveMind "Otto" widget is loaded from the chatbot service via a single
// <script> tag. data-api points at the chatbot API base (…/api). These are
// public values (no secrets) — safe to expose on the page.
const OTTO_SRC = process.env.NEXT_PUBLIC_OTTO_SRC ?? "http://localhost:3002/otto.js";
const OTTO_API = process.env.NEXT_PUBLIC_OTTO_API ?? "http://localhost:3002/api";
const OTTO_DEALER_ID = process.env.NEXT_PUBLIC_DEALER_ID ?? "nextgear";

// High-contrast serif for hero statements, condensed grotesque for automotive
// labels/UI, clean sans for body copy — a deliberately non-default trio.
const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-display",
  display: "swap",
});
const condensed = Oswald({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-condensed",
  display: "swap",
});
const body = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "NextGear Motors — The Dream Factory | Premium Used Cars",
  description:
    "NextGear Motors — the UK's destination for hand-picked premium used cars. Browse the collection, sell your car, or let Otto find your perfect match.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${condensed.variable} ${body.variable}`}>
      <body className="min-h-screen bg-ink font-sans text-fog antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
        <Script
          src={OTTO_SRC}
          data-dealer-id={OTTO_DEALER_ID}
          data-api={OTTO_API}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

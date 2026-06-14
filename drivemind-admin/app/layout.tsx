import type { Metadata } from "next";
import { Oswald, Manrope } from "next/font/google";
import "./globals.css";
import { Logo } from "./components/Logo";

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
  title: "DriveMind Admin — Inventory Control",
  description: "Connect your inventory and sync it into the DriveMind assistant.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${condensed.variable} ${body.variable}`}>
      <body className="min-h-screen bg-ink font-sans text-fog antialiased">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/85 backdrop-blur-xl">
          <div className="container-x flex items-center justify-between py-4">
            <Logo />
            <div className="hidden items-center gap-2 sm:flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span className="font-condensed text-xs uppercase tracking-widest text-ash">
                Systems online
              </span>
            </div>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const NAV = [
  { label: "Our Stock", href: "/stock" },
  { label: "Sell", href: "/sell" },
  { label: "Our Story", href: "/our-story" },
  { label: "VIP Collection", href: "/vip" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close the drawer on route change.
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/10 bg-ink/85 py-3 backdrop-blur-xl"
          : "border-b border-transparent bg-gradient-to-b from-black/70 to-transparent py-5"
      }`}
    >
      <div className="container-x flex items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative font-condensed text-sm uppercase tracking-widest transition-colors ${
                isActive(item.href) ? "text-white" : "text-fog hover:text-white"
              }`}
            >
              {item.label}
              <span
                className={`absolute -bottom-1.5 left-0 h-0.5 bg-accent transition-all duration-300 ${
                  isActive(item.href) ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/stock" className="hidden btn-accent px-5 py-2.5 text-xs sm:inline-flex">
            View Stock
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full border border-white/15 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span
              className={`h-0.5 w-5 bg-white transition-all duration-300 ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span className={`h-0.5 w-5 bg-white transition-all duration-300 ${open ? "opacity-0" : ""}`} />
            <span
              className={`h-0.5 w-5 bg-white transition-all duration-300 ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-x-0 top-[var(--drawer-top,72px)] z-40 origin-top overflow-hidden border-t border-white/10 bg-ink/98 backdrop-blur-xl transition-all duration-300 lg:hidden ${
          open ? "max-h-[80vh] opacity-100" : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <nav className="container-x flex flex-col py-6">
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between border-b border-white/5 py-4 font-condensed text-lg uppercase tracking-widest transition-colors ${
                isActive(item.href) ? "text-accent" : "text-fog hover:text-white"
              }`}
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              {item.label}
              <span className="text-accent">→</span>
            </Link>
          ))}
          <Link href="/stock" className="btn-accent mt-6 w-full">
            View All Stock
          </Link>
        </nav>
      </div>
    </header>
  );
}

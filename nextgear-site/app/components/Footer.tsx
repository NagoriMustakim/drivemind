import Link from "next/link";
import { Logo } from "./Logo";

const COLUMNS = [
  {
    title: "Browse",
    links: [
      { label: "Our Stock", href: "/stock" },
      { label: "VIP Collection", href: "/vip" },
      { label: "Sell Your Car", href: "/sell" },
      { label: "Finance", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Story", href: "/our-story" },
      { label: "News", href: "/news" },
      { label: "Careers", href: "/contact" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Book a Viewing", href: "/contact" },
      { label: "Part Exchange", href: "/sell" },
      { label: "Warranty", href: "/our-story" },
      { label: "FAQs", href: "/contact" },
    ],
  },
];

const SOCIALS = ["Instagram", "YouTube", "TikTok", "LinkedIn"];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-coal">
      <div className="pointer-events-none absolute inset-0 bg-radial-accent opacity-40" />
      <div className="container-x relative py-16">
        {/* CTA strip */}
        <div className="mb-14 flex flex-col items-start justify-between gap-6 rounded-3xl border border-white/10 bg-gradient-to-r from-carbon to-ink p-8 sm:p-10 md:flex-row md:items-center">
          <div>
            <p className="eyebrow mb-2">Still searching?</p>
            <h3 className="font-display text-3xl text-white sm:text-4xl">
              Let Otto find your perfect match.
            </h3>
          </div>
          <Link href="/stock" className="btn-accent shrink-0">
            Explore the Showroom
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-ash">
              NextGear Motors — hand-picked premium used cars, rigorously inspected and ready to
              drive. The dream factory, no.1 in the UK.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s}
                  href="#"
                  className="rounded-full border border-white/10 px-4 py-1.5 font-condensed text-xs uppercase tracking-widest text-fog transition-colors hover:border-accent hover:text-accent"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-condensed text-sm uppercase tracking-widest text-white">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-ash transition-colors hover:text-accent"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-ash sm:flex-row">
          <p>© {new Date().getFullYear()} NextGear Motors Ltd. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-fog">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-fog">
              Terms
            </a>
            <a href="#" className="transition-colors hover:text-fog">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

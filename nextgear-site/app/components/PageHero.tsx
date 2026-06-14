import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./Reveal";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  image?: string;
  /** Optional breadcrumb-style links shown above the title. */
  crumb?: { label: string; href: string }[];
  children?: React.ReactNode;
}

/** Standard top section for inner pages — clears the fixed header and sets tone. */
export function PageHero({ eyebrow, title, subtitle, image, crumb, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/5">
      {image ? (
        <div className="absolute inset-0">
          <Image src={image} alt="" fill sizes="100vw" className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/75 to-ink" />
        </div>
      ) : (
        <div className="absolute inset-0 bg-radial-accent opacity-50" />
      )}
      <div className="bg-noise absolute inset-0 opacity-40" />

      <div className="container-x relative z-10 pb-16 pt-40 sm:pt-44">
        {crumb && (
          <Reveal className="mb-5 flex items-center gap-2 font-condensed text-xs uppercase tracking-widest text-ash">
            {crumb.map((c, i) => (
              <span key={c.href} className="flex items-center gap-2">
                {i > 0 && <span className="text-accent">/</span>}
                <Link href={c.href} className="transition-colors hover:text-accent">
                  {c.label}
                </Link>
              </span>
            ))}
          </Reveal>
        )}
        <Reveal>
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h1 className="font-display text-5xl leading-[0.95] text-white sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          {subtitle && <p className="mt-6 max-w-2xl text-lg text-fog">{subtitle}</p>}
        </Reveal>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}

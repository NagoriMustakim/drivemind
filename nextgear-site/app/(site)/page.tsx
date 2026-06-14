import Link from "next/link";
import Image from "next/image";
import { getDisplayCars, STATS, BRANDS, FEATURES, TESTIMONIALS, NEWS } from "@/lib/site-data";
import { formatDate } from "@/lib/format";
import { Reveal } from "@/app/components/Reveal";
import { Counter } from "@/app/components/Counter";
import { CarCard } from "@/app/components/CarCard";
import { HeroSearch } from "@/app/components/HeroSearch";
import { BrandMarquee } from "@/app/components/BrandMarquee";
import { Icon } from "@/app/components/Icons";

export const dynamic = "force-dynamic"; // always reflect current inventory

const HERO_IMG =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2400&q=80";

export default async function HomePage() {
  const { cars } = await getDisplayCars();
  const featured = cars.slice(0, 6);
  const makes = Array.from(new Set(cars.map((c) => c.make))).sort();

  return (
    <>
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMG}
            alt="Featured performance car on a forest road"
            fill
            priority
            sizes="100vw"
            className="scale-105 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/40 to-ink" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-transparent to-transparent" />
        </div>

        <div className="container-x relative z-10 pt-28">
          <div className="max-w-3xl">
            <p className="animate-fade-in eyebrow mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-accent" />
              No.1 in the UK
            </p>
            <h1 className="animate-fade-up font-display text-5xl font-700 leading-[0.95] text-white sm:text-7xl lg:text-8xl">
              Welcome to the
              <span className="block text-gradient">Dream Factory</span>
            </h1>
            <p
              className="mt-6 max-w-xl text-lg leading-relaxed text-fog"
              style={{ animation: "fade-up 0.8s 0.15s both" }}
            >
              Hand-picked premium used cars, rigorously inspected and ready to drive away. Tell our
              AI concierge Otto what you&apos;re after — and let the search come to you.
            </p>

            <div className="mt-9 max-w-2xl" style={{ animation: "fade-up 0.8s 0.3s both" }}>
              <HeroSearch makes={makes} />
            </div>

            <div
              className="mt-6 flex flex-wrap items-center gap-4"
              style={{ animation: "fade-up 0.8s 0.45s both" }}
            >
              <Link href="/stock" className="btn-ghost">
                View All Stock
              </Link>
              <Link href="/vip" className="font-condensed text-sm uppercase tracking-widest text-fog transition-colors hover:text-accent">
                Explore VIP Collection →
              </Link>
            </div>
          </div>
        </div>

        {/* scroll hint */}
        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-ash sm:flex">
          <span className="font-condensed text-[10px] uppercase tracking-mega">Scroll</span>
          <span className="h-10 w-px animate-pulse bg-gradient-to-b from-accent to-transparent" />
        </div>
      </section>

      {/* ──────────────────────── BRANDS ──────────────────────── */}
      <section className="border-y border-white/5 bg-coal py-10">
        <p className="container-x mb-6 text-center font-condensed text-xs uppercase tracking-mega text-ash">
          Trusted marques on our floor
        </p>
        <BrandMarquee brands={BRANDS} />
      </section>

      {/* ───────────────────────── STATS ───────────────────────── */}
      <section className="bg-ink py-20">
        <div className="container-x grid grid-cols-2 gap-y-12 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 100} className="text-center">
              <div className="font-condensed text-5xl font-700 text-white sm:text-6xl">
                <Counter to={s.value} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <p className="mt-2 font-condensed text-xs uppercase tracking-widest text-ash">
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ─────────────────────── FEATURED ─────────────────────── */}
      <section className="bg-coal py-24">
        <div className="container-x">
          <Reveal className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow mb-3">The Collection</p>
              <h2 className="font-display text-4xl text-white sm:text-5xl">Featured Stock</h2>
            </div>
            <Link href="/stock" className="btn-ghost">
              View All Stock
            </Link>
          </Reveal>

          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((car, i) => (
              <Reveal key={car.id} delay={(i % 3) * 100}>
                <CarCard car={car} priority={i < 3} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────── WHY CHOOSE US ───────────────────── */}
      <section className="relative overflow-hidden bg-ink py-24">
        <div className="pointer-events-none absolute inset-0 bg-noise opacity-60" />
        <div className="container-x relative grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10">
              <Image
                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80"
                alt="Inside the NextGear showroom"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -right-4 rounded-2xl border border-white/10 bg-carbon/90 p-6 backdrop-blur-md sm:-right-6">
              <p className="font-condensed text-4xl font-700 text-accent">142</p>
              <p className="font-condensed text-xs uppercase tracking-widest text-fog">
                Point inspection
              </p>
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="eyebrow mb-3">Why NextGear</p>
              <h2 className="font-display text-4xl text-white sm:text-5xl">
                Buying a car, finally done right.
              </h2>
              <p className="mt-5 max-w-lg text-fog">
                We obsess over the details so you don&apos;t have to. Every car is inspected,
                market-checked and presented honestly — backed by people who genuinely love cars.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {FEATURES.map((f, i) => (
                <Reveal key={f.title} delay={i * 90} className="surface group p-6 transition-colors hover:border-accent/40">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                    <Icon name={f.icon} className="h-6 w-6" />
                  </div>
                  <h3 className="font-condensed text-lg uppercase tracking-wide text-white">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ash">{f.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────── VIP COLLECTION ──────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=2400&q=80"
            alt="VIP performance car"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-ink/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink to-transparent" />
        </div>
        <div className="container-x relative z-10 py-28">
          <Reveal className="max-w-xl">
            <p className="eyebrow mb-3">By Invitation</p>
            <h2 className="font-display text-4xl text-white sm:text-6xl">The VIP Collection</h2>
            <p className="mt-5 text-fog">
              Our most exceptional cars — rare specifications, low-mileage modern classics and
              halo machines reserved for the discerning few. Private viewings by appointment.
            </p>
            <Link href="/vip" className="btn-accent mt-8">
              Enter the Collection
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────── TESTIMONIALS ─────────────────── */}
      <section className="bg-coal py-24">
        <div className="container-x">
          <Reveal className="mb-12 text-center">
            <p className="eyebrow mb-3">Driver Stories</p>
            <h2 className="font-display text-4xl text-white sm:text-5xl">Loved by the people who matter</h2>
          </Reveal>
          <div className="grid gap-7 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 120} className="surface flex flex-col p-7">
                <div className="mb-4 flex gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, n) => (
                    <Icon key={n} name="star" className="h-4 w-4" />
                  ))}
                </div>
                <p className="flex-1 text-fog">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-6 flex items-center gap-3 border-t border-white/5 pt-5">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/15 font-condensed text-sm text-accent">
                    {t.initials}
                  </span>
                  <div>
                    <p className="font-condensed text-sm uppercase tracking-wide text-white">
                      {t.name}
                    </p>
                    <p className="text-xs text-ash">{t.car}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── NEWS ───────────────────────── */}
      <section className="bg-ink py-24">
        <div className="container-x">
          <Reveal className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow mb-3">From the Garage</p>
              <h2 className="font-display text-4xl text-white sm:text-5xl">Latest News</h2>
            </div>
            <Link href="/news" className="btn-ghost">
              All Articles
            </Link>
          </Reveal>
          <div className="grid gap-7 md:grid-cols-3">
            {NEWS.map((post, i) => (
              <Reveal key={post.slug} delay={i * 110}>
                <Link
                  href="/news"
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/5 bg-carbon transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/40"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-3 text-xs text-ash">
                      <span className="font-condensed uppercase tracking-widest text-accent">
                        {post.category}
                      </span>
                      <span>· {post.readMins} min read</span>
                    </div>
                    <h3 className="mt-3 font-condensed text-xl uppercase leading-tight tracking-wide text-white transition-colors group-hover:text-accent">
                      {post.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-ash">{post.excerpt}</p>
                    <p className="mt-5 text-xs text-ash">{formatDate(post.date)}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

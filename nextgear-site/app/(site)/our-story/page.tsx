import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/app/components/PageHero";
import { Reveal } from "@/app/components/Reveal";
import { Counter } from "@/app/components/Counter";
import { STATS } from "@/lib/site-data";

export const metadata = {
  title: "Our Story — NextGear Motors",
  description: "From a single unit to the UK's premium used-car destination. Meet the people behind NextGear.",
};

const TIMELINE = [
  { year: "2008", title: "The first unit", body: "Two enthusiasts, six cars and a railway-arch workshop in Manchester." },
  { year: "2014", title: "The showroom opens", body: "We move into our flagship 40-car indoor showroom and never look back." },
  { year: "2019", title: "Nationwide delivery", body: "We start delivering hand-prepped cars to driveways across the UK." },
  { year: "2023", title: "Otto arrives", body: "Our AI concierge launches — matching buyers to the right car, instantly." },
  { year: "2026", title: "No.1 in the UK", body: "2,400+ cars delivered and a 4.9★ rating from the people who matter." },
];

const VALUES = [
  { title: "Honesty over everything", body: "If there's a mark, a niggle or a story, you'll hear it from us first. Always." },
  { title: "Quality, not quantity", body: "We'd rather have 60 great cars than 600 average ones. Every car earns its place." },
  { title: "Enthusiasts, genuinely", body: "We buy the cars we'd want to own. That bias shows up in everything we stock." },
];

const TEAM = [
  { name: "Daniel Hart", role: "Founder & MD", img: "photo-1500648767791-00dcc994a43e" },
  { name: "Sofia Marchetti", role: "Head of Buying", img: "photo-1573497019940-1c28c88b4f3e" },
  { name: "Tom Becker", role: "Lead Technician", img: "photo-1506794778202-cad84cf45f1d" },
  { name: "Aisha Khan", role: "Client Concierge", img: "photo-1544005313-94ddf0286df2" },
];

export default function OurStoryPage() {
  return (
    <>
      <PageHero
        eyebrow="Since 2008"
        title="The Dream Factory."
        subtitle="We started with six cars and a simple idea: buying a great car should feel as good as driving one. Eighteen years on, that hasn't changed."
        image="https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=2400&q=80"
        crumb={[
          { label: "Home", href: "/" },
          { label: "Our Story", href: "/our-story" },
        ]}
      />

      {/* Intro split */}
      <section className="bg-coal py-24">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <Reveal className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-white/10">
              <Image
                src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1400&q=80"
                alt="The NextGear showroom floor"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <p className="eyebrow mb-3">Who we are</p>
            <h2 className="font-display text-4xl text-white sm:text-5xl">
              A dealership built by drivers, for drivers.
            </h2>
            <p className="mt-5 text-fog">
              We&apos;re not a faceless car supermarket. We&apos;re a tight team of people who get a
              genuine kick from finding the right car and handing over the keys. Every car on our
              floor is sourced, inspected and prepared in-house — no outsourcing, no cutting corners.
            </p>
            <p className="mt-4 text-fog">
              That&apos;s why we can stand behind every sale, and why thousands of drivers come back
              to us when it&apos;s time for their next one.
            </p>
            <Link href="/stock" className="btn-accent mt-8">
              Browse the Collection
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/5 bg-ink py-16">
        <div className="container-x grid grid-cols-2 gap-y-10 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 90} className="text-center">
              <div className="font-condensed text-4xl font-700 text-white sm:text-5xl">
                <Counter to={s.value} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <p className="mt-2 font-condensed text-xs uppercase tracking-widest text-ash">
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-coal py-24">
        <div className="container-x">
          <Reveal className="mb-14 text-center">
            <p className="eyebrow mb-3">The journey</p>
            <h2 className="font-display text-4xl text-white sm:text-5xl">Eighteen years in the making</h2>
          </Reveal>
          <div className="relative mx-auto max-w-3xl">
            <div className="absolute left-[19px] top-2 h-full w-px bg-white/10 sm:left-1/2" />
            <div className="space-y-10">
              {TIMELINE.map((t, i) => (
                <Reveal
                  key={t.year}
                  delay={i * 60}
                  className={`relative flex gap-6 sm:w-1/2 ${
                    i % 2 ? "sm:ml-auto sm:flex-row" : "sm:flex-row-reverse sm:text-right"
                  }`}
                >
                  <span
                    className={`absolute top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent ring-4 ring-ink left-3 sm:left-auto ${
                      i % 2 ? "sm:-left-2" : "sm:-right-2"
                    }`}
                  />
                  <div className="ml-12 sm:ml-0 sm:px-8">
                    <span className="font-condensed text-2xl font-700 text-accent">{t.year}</span>
                    <h3 className="mt-1 font-condensed text-lg uppercase tracking-wide text-white">
                      {t.title}
                    </h3>
                    <p className="mt-1 text-sm text-ash">{t.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-ink py-24">
        <div className="container-x">
          <Reveal className="mb-12">
            <p className="eyebrow mb-3">What we stand for</p>
            <h2 className="font-display text-4xl text-white sm:text-5xl">Our values</h2>
          </Reveal>
          <div className="grid gap-7 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 100} className="surface p-8">
                <span className="font-condensed text-3xl font-700 text-accent">0{i + 1}</span>
                <h3 className="mt-4 font-condensed text-xl uppercase tracking-wide text-white">
                  {v.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ash">{v.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-coal py-24">
        <div className="container-x">
          <Reveal className="mb-12 text-center">
            <p className="eyebrow mb-3">The people</p>
            <h2 className="font-display text-4xl text-white sm:text-5xl">Meet the team</h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-7 lg:grid-cols-4">
            {TEAM.map((m, i) => (
              <Reveal key={m.name} delay={i * 90} className="group">
                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/5">
                  <Image
                    src={`https://images.unsplash.com/${m.img}?auto=format&fit=crop&w=700&q=80`}
                    alt={m.name}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
                  <div className="absolute bottom-0 p-5">
                    <h3 className="font-condensed text-lg uppercase tracking-wide text-white">
                      {m.name}
                    </h3>
                    <p className="text-xs uppercase tracking-widest text-accent">{m.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

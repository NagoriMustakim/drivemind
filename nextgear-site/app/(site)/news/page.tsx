import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/app/components/PageHero";
import { Reveal } from "@/app/components/Reveal";
import { LeadForm } from "@/app/components/LeadForm";
import { NEWS } from "@/lib/site-data";
import { formatDate } from "@/lib/format";

export const metadata = {
  title: "News — NextGear Motors",
  description: "Buying guides, market watch and behind-the-scenes stories from the NextGear garage.",
};

const CATEGORIES = ["All", "Buying Guide", "Market Watch", "Behind the Scenes", "Reviews"];

export default function NewsPage() {
  const featured = NEWS[0]!;
  const rest = NEWS.slice(1);
  // Pad the grid so the page reads as a real, busy editorial section.
  const grid = [...rest, ...NEWS, ...rest].slice(0, 6);

  return (
    <>
      <PageHero
        eyebrow="From the Garage"
        title="News & Stories"
        subtitle="Buying guides, market watch and the occasional look behind the workshop doors."
        crumb={[
          { label: "Home", href: "/" },
          { label: "News", href: "/news" },
        ]}
      />

      {/* Featured */}
      <section className="bg-coal py-20">
        <div className="container-x">
          <div className="mb-10 flex flex-wrap gap-3">
            {CATEGORIES.map((c, i) => (
              <span
                key={c}
                className={`rounded-full border px-4 py-2 font-condensed text-xs uppercase tracking-widest transition-colors ${
                  i === 0
                    ? "border-accent bg-accent text-white"
                    : "border-white/10 text-fog hover:border-accent hover:text-accent"
                }`}
              >
                {c}
              </span>
            ))}
          </div>

          <Reveal>
            <Link
              href="/news"
              className="group grid overflow-hidden rounded-3xl border border-white/5 bg-carbon lg:grid-cols-2"
            >
              <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
                <Image
                  src={featured.image}
                  alt={featured.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-12">
                <div className="flex items-center gap-3 text-xs text-ash">
                  <span className="font-condensed uppercase tracking-widest text-accent">
                    {featured.category}
                  </span>
                  <span>· {featured.readMins} min read</span>
                </div>
                <h2 className="mt-4 font-display text-3xl text-white transition-colors group-hover:text-accent sm:text-4xl">
                  {featured.title}
                </h2>
                <p className="mt-4 text-fog">{featured.excerpt}</p>
                <p className="mt-6 font-condensed text-xs uppercase tracking-widest text-ash">
                  {formatDate(featured.date)}
                </p>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-ink py-20">
        <div className="container-x">
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {grid.map((post, i) => (
              <Reveal key={`${post.slug}-${i}`} delay={(i % 3) * 100}>
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
                      <span>· {post.readMins} min</span>
                    </div>
                    <h3 className="mt-3 font-condensed text-lg uppercase leading-tight tracking-wide text-white transition-colors group-hover:text-accent">
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

      {/* Newsletter */}
      <section className="bg-coal py-24">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow mb-3">Stay in the loop</p>
            <h2 className="font-display text-4xl text-white sm:text-5xl">
              New arrivals, in your inbox.
            </h2>
            <p className="mt-5 text-fog">
              Join the list for fresh stock alerts, market insight and the occasional VIP preview.
              No spam, unsubscribe any time.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <LeadForm
              submitLabel="Subscribe"
              note="We'll only email you about cars and content. Promise."
              fields={[
                { name: "name", label: "Name", required: true },
                { name: "email", label: "Email", type: "email", required: true },
              ]}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}

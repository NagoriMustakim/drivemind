import Link from "next/link";
import { getDisplayCars } from "@/lib/site-data";
import { PageHero } from "@/app/components/PageHero";
import { Reveal } from "@/app/components/Reveal";
import { CarCard } from "@/app/components/CarCard";
import { LeadForm } from "@/app/components/LeadForm";
import { Icon } from "@/app/components/Icons";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "VIP Collection — NextGear Motors",
  description: "Our most exceptional cars, by invitation. Rare specs, modern classics and halo machines.",
};

const PERKS = [
  { icon: "spark", title: "First refusal", body: "See our rarest arrivals before they ever reach the public floor." },
  { icon: "shield", title: "Private viewings", body: "Out-of-hours appointments at the showroom, or a car brought to you." },
  { icon: "exchange", title: "Sourcing service", body: "Can't find it? We'll hunt down the exact spec, colour and history you want." },
  { icon: "tag", title: "Concierge handover", body: "Full detail, delivery and a white-glove handover wherever you are." },
];

export default async function VipPage() {
  const { cars } = await getDisplayCars();
  // The collection skews to the most expensive cars on the floor.
  const vip = [...cars].sort((a, b) => b.price - a.price).slice(0, 6);

  return (
    <>
      <PageHero
        eyebrow="By Invitation"
        title="The VIP Collection"
        subtitle="The cars we fight to keep for ourselves — rare specifications, low-mileage modern classics and genuine halo machines. Reserved for the discerning few."
        image="https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=2400&q=80"
        crumb={[
          { label: "Home", href: "/" },
          { label: "VIP Collection", href: "/vip" },
        ]}
      />

      {/* Collection grid */}
      <section className="bg-coal py-24">
        <div className="container-x">
          <Reveal className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="eyebrow mb-3">In the collection now</p>
              <h2 className="font-display text-4xl text-white sm:text-5xl">Exceptional, available</h2>
            </div>
            <p className="max-w-sm text-sm text-ash">
              Each car is offered privately. Register your interest and we&apos;ll arrange a viewing
              on your terms.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {vip.map((car, i) => (
              <Reveal key={car.id} delay={(i % 3) * 100}>
                <CarCard car={car} priority={i < 3} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Membership perks */}
      <section className="relative overflow-hidden bg-ink py-24">
        <div className="pointer-events-none absolute inset-0 bg-radial-accent opacity-40" />
        <div className="container-x relative">
          <Reveal className="mb-14 text-center">
            <p className="eyebrow mb-3">Membership</p>
            <h2 className="font-display text-4xl text-white sm:text-5xl">The VIP difference</h2>
          </Reveal>
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {PERKS.map((p, i) => (
              <Reveal key={p.title} delay={i * 90} className="surface group p-7 text-center transition-colors hover:border-accent/40">
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                  <Icon name={p.icon} className="h-7 w-7" />
                </span>
                <h3 className="font-condensed text-lg uppercase tracking-wide text-white">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ash">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Register interest */}
      <section className="bg-coal py-24">
        <div className="container-x grid items-start gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow mb-3">Request access</p>
            <h2 className="font-display text-4xl text-white sm:text-5xl">
              Tell us what you&apos;re looking for.
            </h2>
            <p className="mt-5 text-fog">
              Whether it&apos;s something in the collection or a car you&apos;ve been chasing for
              years, our sourcing team will make it happen. Register below and we&apos;ll be in touch
              personally.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <LeadForm
              submitLabel="Register Interest"
              note="Strictly confidential. We typically respond within one working day."
              fields={[
                { name: "name", label: "Full name", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "phone", label: "Phone", type: "tel" },
                { name: "budget", label: "Budget guide", placeholder: "e.g. £100k–150k" },
                {
                  name: "wishlist",
                  label: "The car you're after",
                  type: "textarea",
                  placeholder: "Make, model, spec, colour, mileage ceiling…",
                  required: true,
                },
              ]}
            />
          </Reveal>
        </div>
      </section>

      <section className="bg-ink pb-24">
        <div className="container-x">
          <Reveal className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-carbon to-ink p-10 text-center sm:p-14">
            <h3 className="font-display text-3xl text-white sm:text-4xl">
              Not sure where to start?
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-fog">
              Ask Otto in the chat corner — describe your dream car and it&apos;ll tell you what we
              have, what&apos;s coming, and what we can source.
            </p>
            <Link href="/stock" className="btn-accent mt-7">
              Browse All Stock
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

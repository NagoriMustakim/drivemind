import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getDisplayCarById, getRelatedCars } from "@/lib/site-data";
import { formatPrice } from "@/lib/format";
import { Reveal } from "@/app/components/Reveal";
import { CarCard } from "@/app/components/CarCard";
import { Icon } from "@/app/components/Icons";

export const dynamic = "force-dynamic";

const SPEC_META: Record<string, { label: string; icon: string }> = {
  transmission: { label: "Transmission", icon: "cog" },
  drivetrain: { label: "Drivetrain", icon: "exchange" },
  fuelType: { label: "Fuel", icon: "fuel" },
  engine: { label: "Engine", icon: "gauge" },
  seats: { label: "Seats", icon: "seat" },
  doors: { label: "Doors", icon: "door" },
  exteriorColor: { label: "Exterior", icon: "paint" },
  interiorColor: { label: "Interior", icon: "paint" },
  mpg: { label: "MPG", icon: "gauge" },
  rangeMiles: { label: "Range (mi)", icon: "gauge" },
};

export default async function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = await getDisplayCarById(id);
  if (!car) notFound();

  const related = await getRelatedCars(car.id, car.body_type);
  const features = Array.isArray(car.specs.features) ? (car.specs.features as string[]) : [];
  const specs = Object.entries(SPEC_META)
    .filter(([key]) => car.specs[key] !== undefined && car.specs[key] !== null)
    .map(([key, meta]) => ({ ...meta, value: String(car.specs[key]) }));

  const title = `${car.year} ${car.make} ${car.model}`;
  const isAvailable = car.status === "available";

  return (
    <>
      {/* Hero image band */}
      <section className="relative">
        <div className="relative h-[58vh] min-h-[420px] w-full overflow-hidden">
          {car.image_url && (
            <Image
              src={car.image_url}
              alt={title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/60" />
        </div>

        <div className="container-x relative z-10 -mt-32 pb-4">
          <Reveal className="mb-5 flex items-center gap-2 font-condensed text-xs uppercase tracking-widest text-ash">
            <Link href="/" className="transition-colors hover:text-accent">
              Home
            </Link>
            <span className="text-accent">/</span>
            <Link href="/stock" className="transition-colors hover:text-accent">
              Our Stock
            </Link>
            <span className="text-accent">/</span>
            <span className="text-fog">
              {car.make} {car.model}
            </span>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink pb-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_360px]">
          {/* Main column */}
          <div>
            <Reveal>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-accent/15 px-3 py-1 font-condensed text-[10px] uppercase tracking-widest text-accent">
                  {car.body_type}
                </span>
                {!isAvailable && (
                  <span className="rounded-full bg-white/10 px-3 py-1 font-condensed text-[10px] uppercase tracking-widest text-fog">
                    {car.status}
                  </span>
                )}
              </div>
              <h1 className="mt-4 font-display text-4xl text-white sm:text-5xl lg:text-6xl">
                {title}
              </h1>
            </Reveal>

            {/* Spec grid */}
            <Reveal className="mt-10">
              <h2 className="eyebrow mb-5">Specification</h2>
              <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {specs.map((s) => (
                  <div key={s.label} className="surface flex items-center gap-3 p-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <Icon name={s.icon} className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <dt className="font-condensed text-[10px] uppercase tracking-widest text-ash">
                        {s.label}
                      </dt>
                      <dd className="truncate font-condensed text-sm uppercase tracking-wide text-white">
                        {s.value}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </Reveal>

            {/* Features */}
            {features.length > 0 && (
              <Reveal className="mt-12">
                <h2 className="eyebrow mb-5">Highlights & Equipment</h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-3 rounded-xl border border-white/5 bg-carbon px-4 py-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white">
                        <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.5} />
                      </span>
                      <span className="text-sm text-fog">{f}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {/* Description */}
            <Reveal className="mt-12">
              <h2 className="eyebrow mb-5">Overview</h2>
              <div className="space-y-4 text-fog">
                <p>
                  This {title} has passed our 142-point inspection and is presented in exceptional
                  condition throughout. Finished in {String(car.specs.exteriorColor ?? "a striking colour")}
                  {car.specs.interiorColor ? ` over ${String(car.specs.interiorColor)}` : ""}, it
                  combines everyday usability with genuine driver appeal.
                </p>
                <p>
                  Every NextGear car comes with a full service history check, a comprehensive
                  warranty and the option of nationwide delivery. Part-exchange and tailored finance
                  are available — speak to the team to build the package that suits you.
                </p>
              </div>
            </Reveal>
          </div>

          {/* Sticky purchase card */}
          <aside>
            <div className="surface sticky top-28 p-7">
              <p className="font-condensed text-xs uppercase tracking-widest text-ash">
                NextGear price
              </p>
              <p className="mt-1 font-condensed text-4xl font-700 text-accent">
                {formatPrice(car.price)}
              </p>
              <p className="mt-2 text-sm text-ash">
                {new Intl.NumberFormat("en-GB").format(car.mileage)} miles · {car.year}
              </p>

              <div className="mt-6 space-y-3">
                <Link href="/contact" className="btn-accent w-full">
                  {isAvailable ? "Reserve / Enquire" : "Join the Waitlist"}
                </Link>
                <Link href="/contact" className="btn-ghost w-full">
                  Book a Viewing
                </Link>
              </div>

              <ul className="mt-7 space-y-3 border-t border-white/5 pt-6 text-sm text-fog">
                {[
                  "142-point inspection passed",
                  "Comprehensive warranty included",
                  "Nationwide delivery available",
                  "Part-exchange welcome",
                ].map((line) => (
                  <li key={line} className="flex items-center gap-3">
                    <span className="text-accent">
                      <Icon name="check" className="h-4 w-4" strokeWidth={2.5} />
                    </span>
                    {line}
                  </li>
                ))}
              </ul>

              <div className="mt-7 rounded-xl bg-gradient-to-br from-accent/15 to-transparent p-4">
                <p className="font-condensed text-sm uppercase tracking-wide text-white">
                  Ask Otto about this car
                </p>
                <p className="mt-1 text-xs text-ash">
                  Open the chat in the corner to compare specs, check finance or find alternatives.
                </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="container-x mt-24">
            <Reveal className="mb-10 flex items-end justify-between">
              <h2 className="font-display text-3xl text-white sm:text-4xl">You may also like</h2>
              <Link href="/stock" className="btn-ghost hidden sm:inline-flex">
                View All Stock
              </Link>
            </Reveal>
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((c, i) => (
                <Reveal key={c.id} delay={i * 100}>
                  <CarCard car={c} />
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}

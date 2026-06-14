import { getDisplayCars } from "@/lib/site-data";
import { PageHero } from "@/app/components/PageHero";
import { StockBrowser } from "@/app/components/StockBrowser";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Our Stock — NextGear Motors",
  description: "Browse every car on the NextGear Motors floor. Filter by make, type and budget.",
};

export default async function StockPage({
  searchParams,
}: {
  searchParams: Promise<{ make?: string; body?: string; maxPrice?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const { cars } = await getDisplayCars();

  return (
    <>
      <PageHero
        eyebrow="The Showroom"
        title="Our Stock"
        subtitle={`${cars.length} hand-picked cars, each inspected and ready to drive. Not sure what fits? Ask Otto.`}
        image="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=2400&q=80"
        crumb={[
          { label: "Home", href: "/" },
          { label: "Our Stock", href: "/stock" },
        ]}
      />
      <section className="relative overflow-hidden bg-coal py-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-radial-accent opacity-50" />
        <div className="bg-noise pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative">
          <StockBrowser
            cars={cars}
            initial={{ make: sp.make, body: sp.body, maxPrice: sp.maxPrice, q: sp.q }}
          />
        </div>
      </section>
    </>
  );
}

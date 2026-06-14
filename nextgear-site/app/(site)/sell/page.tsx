import { PageHero } from "@/app/components/PageHero";
import { Reveal } from "@/app/components/Reveal";
import { LeadForm } from "@/app/components/LeadForm";
import { Icon } from "@/app/components/Icons";

export const metadata = {
  title: "Sell Your Car — NextGear Motors",
  description: "Get a fair, fast valuation for your car. Free collection, instant payment.",
};

const STEPS = [
  { n: "01", title: "Tell us about it", body: "Reg, mileage and a few details — it takes under two minutes." },
  { n: "02", title: "Get your valuation", body: "We market-check live data and come back with a fair, firm figure." },
  { n: "03", title: "Free inspection", body: "Bring it in or we come to you — a quick once-over confirms the price." },
  { n: "04", title: "Get paid, same day", body: "Accept and the money is in your account before you leave. No fuss." },
];

const PERKS = [
  { icon: "tag", title: "Top market prices", body: "We sell premium cars, so we pay properly for them — often more than the supermarkets." },
  { icon: "exchange", title: "Part-exchange bonus", body: "Trading up? Roll your valuation straight into anything on our floor." },
  { icon: "shield", title: "Zero hassle", body: "We handle the paperwork, the finance settlement and the DVLA — all of it." },
  { icon: "spark", title: "Instant payment", body: "No waiting, no staged payments. Funds cleared the same day, every time." },
];

export default function SellPage() {
  return (
    <>
      <PageHero
        eyebrow="Sell or Part-Exchange"
        title="Your car deserves a fair price."
        subtitle="Premium cars, premium offers. Get a firm valuation in minutes and drive away (or get paid) the same day."
        image="https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=2400&q=80"
        crumb={[
          { label: "Home", href: "/" },
          { label: "Sell", href: "/sell" },
        ]}
      />

      {/* Steps */}
      <section className="bg-coal py-24">
        <div className="container-x">
          <Reveal className="mb-14 text-center">
            <p className="eyebrow mb-3">How it works</p>
            <h2 className="font-display text-4xl text-white sm:text-5xl">Four steps to sold</h2>
          </Reveal>
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 100} className="surface relative p-7">
                <span className="font-condensed text-5xl font-700 text-accent/30">{s.n}</span>
                <h3 className="mt-3 font-condensed text-lg uppercase tracking-wide text-white">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ash">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Valuation form + perks */}
      <section className="bg-ink py-24">
        <div className="container-x grid items-start gap-14 lg:grid-cols-2">
          <Reveal>
            <p className="eyebrow mb-3">Free valuation</p>
            <h2 className="font-display text-4xl text-white sm:text-5xl">
              Get your figure in minutes
            </h2>
            <p className="mt-5 text-fog">
              Pop in your details below and our buying team will come straight back with a fair,
              no-obligation valuation.
            </p>
            <div className="mt-8 space-y-6">
              {PERKS.map((p) => (
                <div key={p.title} className="flex gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Icon name={p.icon} className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-condensed text-base uppercase tracking-wide text-white">
                      {p.title}
                    </h3>
                    <p className="mt-1 text-sm text-ash">{p.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <LeadForm
              submitLabel="Get My Valuation"
              note="No obligation. We'll never share your details. Valuation valid for 7 days."
              fields={[
                { name: "reg", label: "Registration", placeholder: "e.g. AB21 XYZ", required: true },
                { name: "mileage", label: "Mileage", placeholder: "e.g. 24,500", required: true },
                { name: "make", label: "Make", placeholder: "e.g. BMW" },
                { name: "model", label: "Model", placeholder: "e.g. M4 Competition" },
                { name: "name", label: "Your name", required: true, full: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "phone", label: "Phone", type: "tel" },
                {
                  name: "notes",
                  label: "Anything we should know?",
                  type: "textarea",
                  placeholder: "Service history, modifications, condition…",
                },
              ]}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}

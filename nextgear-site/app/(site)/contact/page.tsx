import { PageHero } from "@/app/components/PageHero";
import { Reveal } from "@/app/components/Reveal";
import { LeadForm } from "@/app/components/LeadForm";
import { Icon } from "@/app/components/Icons";

export const metadata = {
  title: "Contact — NextGear Motors",
  description: "Visit the showroom, call the team, or send a message. We're here to help.",
};

const DETAILS = [
  { icon: "pin", title: "Showroom", lines: ["Unit 1, Gateway Park", "Trafford, Manchester M17 1AB"] },
  { icon: "phone", title: "Call us", lines: ["0161 555 0142", "Mon–Sat, 9am–6pm"] },
  { icon: "mail", title: "Email", lines: ["hello@nextgearmotors.co.uk", "We reply within 1 working day"] },
];

const HOURS = [
  { day: "Monday – Friday", time: "9:00 — 18:30" },
  { day: "Saturday", time: "9:00 — 17:00" },
  { day: "Sunday", time: "10:00 — 16:00" },
  { day: "Bank Holidays", time: "By appointment" },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title="Let's talk cars."
        subtitle="Pop into the showroom, give us a call, or drop a message below. Otto's in the chat corner too — day or night."
        crumb={[
          { label: "Home", href: "/" },
          { label: "Contact", href: "/contact" },
        ]}
      />

      {/* Detail cards */}
      <section className="bg-coal py-20">
        <div className="container-x grid gap-7 md:grid-cols-3">
          {DETAILS.map((d, i) => (
            <Reveal key={d.title} delay={i * 100} className="surface flex flex-col gap-4 p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Icon name={d.icon} className="h-6 w-6" />
              </span>
              <h3 className="font-condensed text-lg uppercase tracking-wide text-white">
                {d.title}
              </h3>
              <div>
                {d.lines.map((l) => (
                  <p key={l} className="text-sm text-ash">
                    {l}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Form + hours */}
      <section className="bg-ink py-20">
        <div className="container-x grid items-start gap-14 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <p className="eyebrow mb-3">Send a message</p>
            <h2 className="mb-6 font-display text-4xl text-white sm:text-5xl">
              How can we help?
            </h2>
            <LeadForm
              submitLabel="Send Message"
              note="By submitting you agree to be contacted about your enquiry."
              fields={[
                { name: "name", label: "Your name", required: true },
                { name: "email", label: "Email", type: "email", required: true },
                { name: "phone", label: "Phone", type: "tel" },
                { name: "subject", label: "Subject", placeholder: "e.g. Viewing the Audi R8" },
                {
                  name: "message",
                  label: "Message",
                  type: "textarea",
                  placeholder: "Tell us what you need…",
                  required: true,
                },
              ]}
            />
          </Reveal>

          <Reveal delay={120} className="space-y-7">
            <div className="surface p-7">
              <h3 className="mb-5 font-condensed text-lg uppercase tracking-wide text-white">
                Opening hours
              </h3>
              <ul className="space-y-3">
                {HOURS.map((h) => (
                  <li
                    key={h.day}
                    className="flex items-center justify-between border-b border-white/5 pb-3 text-sm last:border-0 last:pb-0"
                  >
                    <span className="text-fog">{h.day}</span>
                    <span className="font-condensed uppercase tracking-wide text-white">
                      {h.time}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="surface relative overflow-hidden">
              {/* Stylised map placeholder */}
              <div className="relative h-56 bg-gradient-to-br from-carbon to-ink">
                <div className="absolute inset-0 bg-grid-faint [background-size:28px_28px] opacity-60" />
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="relative flex h-4 w-4">
                    <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-accent" />
                    <span className="relative inline-flex h-4 w-4 rounded-full bg-accent" />
                  </span>
                </div>
                <span className="absolute bottom-4 left-4 font-condensed text-xs uppercase tracking-widest text-fog">
                  Gateway Park, Manchester
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

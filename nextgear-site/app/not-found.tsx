import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink">
      <div className="pointer-events-none absolute inset-0 bg-radial-accent opacity-50" />
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-40" />
      <div className="container-x relative z-10 text-center">
        <p className="font-condensed text-[28vw] font-700 leading-none text-white/5 sm:text-[18rem]">
          404
        </p>
        <div className="-mt-[14vw] sm:-mt-32">
          <p className="eyebrow mb-4">Wrong turn</p>
          <h1 className="font-display text-4xl text-white sm:text-6xl">This road leads nowhere.</h1>
          <p className="mx-auto mt-5 max-w-md text-fog">
            The page you&apos;re after has moved or never existed. Let&apos;s get you back on track.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/" className="btn-accent">
              Back Home
            </Link>
            <Link href="/stock" className="btn-ghost">
              Browse Stock
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Infinite horizontal marquee of brand names — pure CSS animation. */
export function BrandMarquee({ brands }: { brands: string[] }) {
  // Duplicate the list so the -50% translate loops seamlessly.
  const loop = [...brands, ...brands];
  return (
    <div className="mask-fade-x relative overflow-hidden py-4">
      <div className="flex w-max animate-marquee items-center gap-14 hover:[animation-play-state:paused]">
        {loop.map((brand, i) => (
          <span
            key={`${brand}-${i}`}
            className="select-none whitespace-nowrap font-condensed text-2xl font-500 uppercase tracking-widest text-white/25 transition-colors hover:text-white/70 sm:text-3xl"
          >
            {brand}
          </span>
        ))}
      </div>
    </div>
  );
}

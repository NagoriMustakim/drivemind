import Link from "next/link";

/** NextGear Motors wordmark with a chevron "speed" mark. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group flex items-center gap-3 ${className}`} aria-label="NextGear Motors home">
      <span className="relative flex h-10 w-10 items-center justify-center">
        <svg viewBox="0 0 40 40" className="h-10 w-10" fill="none" aria-hidden="true">
          <path
            d="M6 30 L18 8 L24 8 L12 30 Z"
            fill="#E11D2A"
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          />
          <path
            d="M18 30 L30 8 L36 8 L24 30 Z"
            fill="#fff"
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-condensed text-lg font-700 uppercase tracking-[0.18em] text-white">
          NextGear
        </span>
        <span className="font-condensed text-[10px] uppercase tracking-[0.42em] text-accent">
          Motors
        </span>
      </span>
    </Link>
  );
}

import Link from "next/link";
import Image from "next/image";
import type { DisplayCar } from "@/lib/site-data";
import { formatPrice, formatMiles } from "@/lib/format";

/** A single inventory card — showroom-spotlight photo, light-sweep + red glow on hover. */
export function CarCard({ car, priority = false }: { car: DisplayCar; priority?: boolean }) {
  const fuel = car.specs.fuelType as string | undefined;
  const transmission = car.specs.transmission as string | undefined;

  return (
    <Link
      href={`/cars/${car.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-carbon transition-all duration-500 hover:-translate-y-2 hover:border-accent/50 hover:ring-glow"
    >
      {/* red accent line that draws in on hover */}
      <span className="absolute inset-x-0 top-0 z-20 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-accent to-accent-bright transition-transform duration-500 ease-out group-hover:scale-x-100" />

      <div className="bg-spotlight relative aspect-[16/10] w-full overflow-hidden">
        {car.image_url ? (
          <Image
            src={car.image_url}
            alt={`${car.year} ${car.make} ${car.model}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.12]"
            priority={priority}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ash">No image</div>
        )}

        {/* glossy light sweep on hover */}
        <span className="pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
        {/* melt the photo into the card */}
        <div className="absolute inset-0 bg-gradient-to-t from-carbon via-transparent to-transparent" />

        <span className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 font-condensed text-[10px] uppercase tracking-widest text-white backdrop-blur-sm">
          {car.body_type}
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1 font-condensed text-[10px] uppercase tracking-widest text-white shadow-[0_6px_16px_-4px_rgba(225,29,42,0.7)]">
          {car.year}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-condensed text-lg uppercase leading-tight tracking-wide text-white">
          {car.make} <span className="text-fog">{car.model}</span>
        </h3>

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ash">
          <span>{formatMiles(car.mileage)}</span>
          {transmission && <span>· {transmission}</span>}
          {fuel && <span>· {fuel}</span>}
        </div>

        <div className="mt-5 flex items-end justify-between border-t border-white/5 pt-4">
          <span className="font-condensed text-2xl font-600 text-accent transition-[text-shadow] duration-500 group-hover:[text-shadow:0_0_22px_rgba(225,29,42,0.55)]">
            {formatPrice(car.price)}
          </span>
          <span className="flex items-center gap-1.5 font-condensed text-xs uppercase tracking-widest text-fog transition-colors group-hover:text-accent">
            View
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        </div>
      </div>
    </Link>
  );
}

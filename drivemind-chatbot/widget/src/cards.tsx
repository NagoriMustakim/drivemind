/**
 * Car cards (T046/T045). Built from the structured result — each card links by
 * id to the car's detail page on the dealer site (never from raw model text).
 * Display data comes from the trusted server payload.
 */
import type { RecommendedCard } from "./api";

export function formatPrice(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatMiles(n: number): string {
  return `${new Intl.NumberFormat("en-US").format(n)} mi`;
}

export function Card({ car, index = 0 }: { car: RecommendedCard; index?: number }) {
  return (
    <a class="otto-card" href={car.detailUrl} target="_top" style={`animation-delay:${index * 80}ms`}>
      <div class="media">
        <span class="tag">{car.bodyType}</span>
        <span class="price-badge">{formatPrice(car.price)}</span>
        {car.imageUrl ? <img src={car.imageUrl} alt={`${car.year} ${car.make} ${car.model}`} /> : null}
      </div>
      <div class="body">
        <div class="title">
          {car.year} {car.make} {car.model}
        </div>
        <div class="meta">
          {formatMiles(car.mileage)} · {car.bodyType}
        </div>
        {car.why ? <div class="why">{car.why}</div> : null}
        <div class="cta">
          View details <span class="a">→</span>
        </div>
      </div>
    </a>
  );
}

export function CardList({ cars }: { cars: RecommendedCard[] }) {
  if (cars.length === 0) return null;
  return (
    <div class="otto-cards">
      {cars.map((car, i) => (
        <Card key={car.id} car={car} index={i} />
      ))}
    </div>
  );
}

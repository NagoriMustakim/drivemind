"use client";

import { useMemo, useState } from "react";
import type { DisplayCar } from "@/lib/site-data";
import { CarCard } from "./CarCard";

type Sort = "newest" | "price-asc" | "price-desc" | "mileage-asc";

const SORTS: { label: string; value: Sort }[] = [
  { label: "Newest in", value: "newest" },
  { label: "Price: Low → High", value: "price-asc" },
  { label: "Price: High → Low", value: "price-desc" },
  { label: "Lowest mileage", value: "mileage-asc" },
];

export interface StockFilters {
  make?: string;
  body?: string;
  maxPrice?: string;
  q?: string;
}

export function StockBrowser({
  cars,
  initial,
}: {
  cars: DisplayCar[];
  initial: StockFilters;
}) {
  const [make, setMake] = useState(initial.make ?? "");
  const [body, setBody] = useState(initial.body ?? "");
  const [maxPrice, setMaxPrice] = useState(initial.maxPrice ?? "");
  const [q, setQ] = useState(initial.q ?? "");
  const [sort, setSort] = useState<Sort>("newest");

  const makes = useMemo(() => Array.from(new Set(cars.map((c) => c.make))).sort(), [cars]);
  const bodies = useMemo(() => Array.from(new Set(cars.map((c) => c.body_type))).sort(), [cars]);

  const filtered = useMemo(() => {
    const max = maxPrice ? Number(maxPrice) : Infinity;
    const term = q.trim().toLowerCase();
    const result = cars.filter((c) => {
      if (make && c.make !== make) return false;
      if (body && c.body_type !== body) return false;
      if (c.price > max) return false;
      if (term && !`${c.make} ${c.model} ${c.year} ${c.body_type}`.toLowerCase().includes(term))
        return false;
      return true;
    });
    result.sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "mileage-asc":
          return a.mileage - b.mileage;
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
    return result;
  }, [cars, make, body, maxPrice, q, sort]);

  const reset = () => {
    setMake("");
    setBody("");
    setMaxPrice("");
    setQ("");
    setSort("newest");
  };

  const hasFilters = make || body || maxPrice || q;

  const selectClass =
    "w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-carbon px-4 py-3 font-condensed text-sm uppercase tracking-widest text-white outline-none transition-colors hover:border-white/25 focus:border-accent";

  return (
    <div className="container-x">
      {/* Filter bar */}
      <div className="surface mb-8 grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <label className="mb-1.5 block font-condensed text-[10px] uppercase tracking-widest text-ash">
            Search
          </label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Make, model, year…"
            className="w-full rounded-xl border border-white/10 bg-carbon px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-ash hover:border-white/25 focus:border-accent"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-condensed text-[10px] uppercase tracking-widest text-ash">
            Make
          </label>
          <select value={make} onChange={(e) => setMake(e.target.value)} className={selectClass}>
            <option value="">All</option>
            {makes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block font-condensed text-[10px] uppercase tracking-widest text-ash">
            Type
          </label>
          <select value={body} onChange={(e) => setBody(e.target.value)} className={selectClass}>
            <option value="">All</option>
            {bodies.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block font-condensed text-[10px] uppercase tracking-widest text-ash">
            Max price
          </label>
          <select
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className={selectClass}
          >
            <option value="">Any</option>
            <option value="25000">£25k</option>
            <option value="50000">£50k</option>
            <option value="75000">£75k</option>
            <option value="100000">£100k</option>
            <option value="999999">£100k+</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block font-condensed text-[10px] uppercase tracking-widest text-ash">
            Sort by
          </label>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={selectClass}>
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result count */}
      <div className="mb-8 flex items-center justify-between">
        <p className="font-condensed text-sm uppercase tracking-widest text-fog">
          <span className="text-accent">{filtered.length}</span>{" "}
          {filtered.length === 1 ? "car" : "cars"} available
        </p>
        {hasFilters && (
          <button
            onClick={reset}
            className="font-condensed text-xs uppercase tracking-widest text-ash transition-colors hover:text-accent"
          >
            Clear filters ✕
          </button>
        )}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="surface flex flex-col items-center gap-4 py-20 text-center">
          <p className="font-display text-2xl text-white">No matches — yet.</p>
          <p className="max-w-sm text-sm text-ash">
            Try widening your filters, or ask Otto to keep an eye out and ping you the moment
            something fitting lands on the floor.
          </p>
          <button onClick={reset} className="btn-ghost mt-2">
            Reset Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((car, i) => (
            <CarCard key={car.id} car={car} priority={i < 6} />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const BODY_TYPES = ["SUV", "Sedan", "Coupe", "Truck", "Convertible", "Hatchback", "Van", "Wagon"];
const BUDGETS = [
  { label: "Up to £25k", value: "25000" },
  { label: "Up to £50k", value: "50000" },
  { label: "Up to £75k", value: "75000" },
  { label: "Up to £100k", value: "100000" },
  { label: "£100k+", value: "999999" },
];

function Select({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="relative flex-1">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full cursor-pointer appearance-none rounded-full border border-white/15 bg-black/50 py-3.5 pl-5 pr-10 font-condensed text-sm uppercase tracking-widest text-white outline-none transition-colors hover:border-white/30 focus:border-accent"
      >
        <option value="" className="bg-carbon text-white">
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-carbon text-white">
            {o.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-accent">
        ▾
      </span>
    </div>
  );
}

export function HeroSearch({ makes }: { makes: string[] }) {
  const router = useRouter();
  const [make, setMake] = useState("");
  const [body, setBody] = useState("");
  const [budget, setBudget] = useState("");

  const search = () => {
    const params = new URLSearchParams();
    if (make) params.set("make", make);
    if (body) params.set("body", body);
    if (budget) params.set("maxPrice", budget);
    router.push(`/stock${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <div className="w-full rounded-[28px] border border-white/10 bg-black/40 p-3 backdrop-blur-xl sm:rounded-full">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select
          value={make}
          onChange={setMake}
          placeholder="All Makes"
          options={makes.map((m) => ({ label: m, value: m }))}
        />
        <Select
          value={body}
          onChange={setBody}
          placeholder="All Types"
          options={BODY_TYPES.map((b) => ({ label: b, value: b }))}
        />
        <Select value={budget} onChange={setBudget} placeholder="Any Budget" options={BUDGETS} />
        <div className="flex gap-2">
          <button onClick={search} className="btn-accent flex-1 px-8 sm:flex-none">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

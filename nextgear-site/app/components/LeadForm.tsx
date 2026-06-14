"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "./Icons";

interface Field {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "textarea";
  placeholder?: string;
  required?: boolean;
  full?: boolean;
}

/**
 * Presentational lead form. There is no public submit endpoint on the dealer
 * site, so this validates client-side and shows a success state — wire it to a
 * CRM/email handler when one exists.
 */
export function LeadForm({
  fields,
  submitLabel,
  note,
}: {
  fields: Field[];
  submitLabel: string;
  note?: string;
}) {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="surface flex flex-col items-center gap-4 p-12 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white">
          <Icon name="check" className="h-7 w-7" strokeWidth={2.5} />
        </span>
        <h3 className="font-display text-2xl text-white">Thank you — message received.</h3>
        <p className="max-w-sm text-sm text-ash">
          A member of the NextGear team will be in touch shortly. In the meantime, Otto is always
          on hand in the chat corner.
        </p>
        <button onClick={() => setSent(false)} className="btn-ghost mt-2">
          Send Another
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-xl border border-white/10 bg-carbon px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-ash hover:border-white/25 focus:border-accent";

  return (
    <form onSubmit={onSubmit} className="surface grid gap-5 p-7 sm:grid-cols-2">
      {fields.map((f) => (
        <div key={f.name} className={f.full || f.type === "textarea" ? "sm:col-span-2" : ""}>
          <label
            htmlFor={f.name}
            className="mb-1.5 block font-condensed text-[10px] uppercase tracking-widest text-ash"
          >
            {f.label}
            {f.required && <span className="text-accent"> *</span>}
          </label>
          {f.type === "textarea" ? (
            <textarea
              id={f.name}
              name={f.name}
              required={f.required}
              placeholder={f.placeholder}
              rows={4}
              className={inputClass}
            />
          ) : (
            <input
              id={f.name}
              name={f.name}
              type={f.type ?? "text"}
              required={f.required}
              placeholder={f.placeholder}
              className={inputClass}
            />
          )}
        </div>
      ))}
      <div className="sm:col-span-2">
        <button type="submit" className="btn-accent w-full sm:w-auto">
          {submitLabel}
        </button>
        {note && <p className="mt-3 text-xs text-ash">{note}</p>}
      </div>
    </form>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

interface CounterProps {
  to: number;
  suffix?: string;
  prefix?: string;
  /** Duration of the count-up in ms. */
  duration?: number;
  className?: string;
}

/** Counts up from 0 → `to` the first time it scrolls into view. */
export function Counter({ to, suffix = "", prefix = "", duration = 1800, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting || started.current) return;
      started.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        // easeOutExpo for a punchy settle
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        setValue(Math.round(eased * to));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.disconnect();
    }, { threshold: 0.4 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString("en-GB")}
      {suffix}
    </span>
  );
}

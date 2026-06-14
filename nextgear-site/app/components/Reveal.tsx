"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Delay (ms) before the reveal transition starts — used to stagger siblings. */
  delay?: number;
  className?: string;
  /** Render as a different element (e.g. "li", "span"). Defaults to div. */
  as?: ElementType;
  /** Re-trigger every time it enters the viewport instead of once. */
  once?: boolean;
}

/**
 * Lightweight scroll-reveal. Adds `.reveal` (hidden) on mount, then `.is-visible`
 * when the element scrolls into view — the actual motion lives in globals.css so
 * there are no animation dependencies. Honours prefers-reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

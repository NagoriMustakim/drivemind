import type { SVGProps } from "react";

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function Icon({ name, ...props }: { name: string } & SVGProps<SVGSVGElement>) {
  const paths: Record<string, React.ReactNode> = {
    shield: <path d="M12 3 4 6v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V6l-8-3Z" />,
    spark: (
      <>
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
        <path d="m6 6 2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
      </>
    ),
    tag: (
      <>
        <path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9-9-9Z" />
        <circle cx="7.5" cy="7.5" r="1.2" />
      </>
    ),
    exchange: (
      <>
        <path d="M4 8h13l-3-3M20 16H7l3 3" />
      </>
    ),
    gauge: (
      <>
        <path d="M12 14a8 8 0 1 1 8-8" transform="translate(0 6)" />
        <path d="M12 14l4-4" />
      </>
    ),
    fuel: (
      <>
        <path d="M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h14" />
        <path d="M15 8h2.5A1.5 1.5 0 0 1 19 9.5V16a2 2 0 0 0 2 2 2 2 0 0 0 2-2V9l-3-3" />
      </>
    ),
    cog: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
      </>
    ),
    seat: (
      <>
        <path d="M6 4h7a2 2 0 0 1 2 2v8H8a2 2 0 0 1-2-2V4ZM6 14v6M15 14v6M6 18h9" />
      </>
    ),
    door: (
      <>
        <path d="M5 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16M3 21h16" />
        <circle cx="13" cy="12" r="0.8" fill="currentColor" />
      </>
    ),
    paint: (
      <>
        <rect x="4" y="4" width="16" height="12" rx="2" />
        <path d="M8 20h8M12 16v4" />
      </>
    ),
    phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />,
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    pin: (
      <>
        <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
    star: (
      <path d="M12 3l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8L6.6 19.6l1-6L3.3 9.4l6-.9L12 3Z" fill="currentColor" stroke="none" />
    ),
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  };
  return (
    <svg {...base} {...props}>
      {paths[name] ?? null}
    </svg>
  );
}

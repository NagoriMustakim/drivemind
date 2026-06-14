/** DriveMind control-plane wordmark with a chevron "speed" mark. */
export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center">
        <svg viewBox="0 0 40 40" className="h-10 w-10" fill="none" aria-hidden="true">
          <path d="M6 30 L18 8 L24 8 L12 30 Z" fill="#E11D2A" />
          <path d="M18 30 L30 8 L36 8 L24 30 Z" fill="#fff" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-condensed text-lg font-bold uppercase tracking-[0.18em] text-white">
          DriveMind
        </span>
        <span className="font-condensed text-[10px] uppercase tracking-[0.42em] text-accent">
          Control Plane
        </span>
      </span>
    </div>
  );
}

/**
 * Widget CSS, injected into the shadow root so it cannot clash with — or be
 * clobbered by — the host page (Constitution Principle V). All selectors are
 * scoped inside the shadow DOM.
 *
 * Theme: NextGear "performance showroom" — near-black surfaces, a signature red
 * accent (#E11D2A) and crisp, slightly condensed type. Designed to feel like a
 * natural extension of the dealer website.
 */
export const STYLES = `
:host {
  --accent: #E11D2A;
  --accent-bright: #FF3B41;
  --ink: #0B0B0F;
  --coal: #131318;
  --carbon: #1B1B22;
  --steel: #25252E;
  --line: rgba(255,255,255,.08);
  --fog: #C9C9D4;
  --ash: #8A8A97;
  all: initial;
}
:host, * { box-sizing: border-box; }
.otto * { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, system-ui, sans-serif; }

/* ───────────── Launcher ───────────── */
.otto-launcher {
  position: fixed; bottom: 22px; right: 22px; z-index: 2147483000;
  display: flex; align-items: center; gap: 10px;
  background: linear-gradient(135deg, var(--accent), var(--accent-bright));
  color: #fff; border: none; cursor: pointer;
  border-radius: 9999px; padding: 10px 20px 10px 10px;
  font: 600 14.5px system-ui, sans-serif; letter-spacing: .01em;
  box-shadow: 0 10px 30px -6px rgba(225,29,42,.6), 0 4px 12px rgba(0,0,0,.4);
  animation: otto-launch-in .5s cubic-bezier(.16,1,.3,1) both;
  transition: transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s;
}
.otto-launcher:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 16px 40px -8px rgba(225,29,42,.7); }
.otto-launcher:active { transform: translateY(0) scale(.99); }
.otto-launcher .av { position: relative; flex: none; width: 34px; height: 34px; }
.otto-launcher .av::before {
  content: ""; position: absolute; inset: -4px; border-radius: 9999px;
  border: 2px solid rgba(255,255,255,.55); animation: otto-ring 2s ease-out infinite;
}
.otto-launcher .dot {
  position: absolute; top: -2px; right: -2px; width: 11px; height: 11px;
  background: #22c55e; border: 2px solid #fff; border-radius: 9999px;
}

/* one-time nudge bubble so visitors notice Otto */
.otto-nudge {
  position: fixed; bottom: 84px; right: 22px; z-index: 2147482999;
  max-width: 230px; background: #fff; color: #0b0b0f;
  border-radius: 16px 16px 4px 16px; padding: 12px 14px; font: 500 13.5px system-ui, sans-serif;
  box-shadow: 0 14px 40px -10px rgba(0,0,0,.5); animation: otto-rise .45s cubic-bezier(.16,1,.3,1) both;
}
.otto-nudge b { color: var(--accent); }
.otto-nudge .x { position: absolute; top: 6px; right: 8px; cursor: pointer; color: #9ca3af; font-size: 15px; line-height: 1; background: none; border: none; }

/* ───────────── Panel shell ───────────── */
.otto-panel {
  position: fixed; bottom: 22px; right: 22px; z-index: 2147483000;
  width: 392px; max-width: calc(100vw - 24px);
  height: 640px; max-height: calc(100vh - 36px);
  display: flex; flex-direction: column;
  background: var(--ink); color: var(--fog);
  border: 1px solid var(--line); border-radius: 22px; overflow: hidden;
  box-shadow: 0 30px 80px -20px rgba(0,0,0,.7);
  transform-origin: bottom right;
  animation: otto-panel-in .42s cubic-bezier(.16,1,.3,1) both;
}
.otto-panel.closing { animation: otto-panel-out .26s cubic-bezier(.4,0,1,1) both; }

/* ───────────── Header ───────────── */
.otto-header {
  position: relative; display: flex; align-items: center; gap: 12px;
  padding: 16px 16px 16px 18px;
  background: linear-gradient(135deg, #1a0508 0%, var(--coal) 55%);
  border-bottom: 1px solid var(--line);
}
.otto-header .badge { position: relative; flex: none; }
.otto-header .badge .live {
  position: absolute; bottom: 0; right: 0; width: 11px; height: 11px;
  background: #22c55e; border: 2px solid var(--coal); border-radius: 9999px;
}
.otto-header .who { flex: 1; line-height: 1.2; }
.otto-header .who .name { font: 700 16px system-ui, sans-serif; color: #fff; letter-spacing: .01em; }
.otto-header .who .sub { font-size: 12px; color: #6fdc8c; display: flex; align-items: center; gap: 5px; }
.otto-close {
  flex: none; width: 32px; height: 32px; display: grid; place-items: center;
  background: rgba(255,255,255,.06); border: 1px solid var(--line); color: var(--fog);
  cursor: pointer; font-size: 18px; line-height: 1; border-radius: 9999px; transition: all .2s;
}
.otto-close:hover { background: var(--accent); color: #fff; border-color: var(--accent); transform: rotate(90deg); }

/* ───────────── Messages ───────────── */
.otto-messages {
  flex: 1; overflow-y: auto; padding: 18px 16px 8px;
  display: flex; flex-direction: column; gap: 14px;
  background:
    radial-gradient(120% 60% at 50% 0%, rgba(225,29,42,.10), transparent 60%),
    var(--ink);
  scrollbar-width: thin; scrollbar-color: var(--steel) transparent;
}
.otto-messages::-webkit-scrollbar { width: 8px; }
.otto-messages::-webkit-scrollbar-thumb { background: var(--steel); border-radius: 9999px; }

/* welcome hero */
.otto-welcome { text-align: center; padding: 8px 6px 4px; animation: otto-rise .5s cubic-bezier(.16,1,.3,1) both; }
.otto-welcome .hi { font: 800 22px system-ui, sans-serif; color: #fff; margin: 12px 0 4px; letter-spacing: -.01em; }
.otto-welcome .lead { font-size: 13.5px; color: var(--ash); line-height: 1.5; max-width: 280px; margin: 0 auto; }
.otto-qcards { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
.otto-qcard {
  display: flex; align-items: center; justify-content: space-between; gap: 8px; text-align: left;
  background: var(--carbon); border: 1px solid var(--line); color: var(--fog);
  border-radius: 14px; padding: 13px 14px; cursor: pointer; font: 600 13.5px system-ui, sans-serif;
  transition: all .2s cubic-bezier(.16,1,.3,1);
}
.otto-qcard:hover { border-color: var(--accent); color: #fff; transform: translateX(2px); background: var(--steel); }
.otto-qcard .arr { color: var(--accent); font-weight: 700; }

/* message rows with avatars */
.otto-row { display: flex; align-items: flex-end; gap: 8px; max-width: 92%; animation: otto-rise .4s cubic-bezier(.16,1,.3,1) both; }
.otto-row.assistant { align-self: flex-start; }
.otto-row.user { align-self: flex-end; flex-direction: row-reverse; }
.otto-row .stack { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.otto-av { flex: none; width: 30px; height: 30px; border-radius: 9999px; overflow: hidden; }
.otto-av.user { display: grid; place-items: center; background: var(--steel); color: var(--fog); }

.otto-msg { padding: 10px 13px; border-radius: 16px; line-height: 1.5; white-space: pre-wrap; font-size: 14px; word-wrap: break-word; }
.otto-msg.assistant { background: var(--carbon); color: #ECECF1; border: 1px solid var(--line); border-bottom-left-radius: 5px; }
.otto-msg.user { background: linear-gradient(135deg, var(--accent), var(--accent-bright)); color: #fff; border-bottom-right-radius: 5px; }

/* ───────────── Thinking / status ───────────── */
.otto-thinking { display: flex; align-items: center; gap: 10px; }
.otto-thinking .bubble {
  display: inline-flex; align-items: center; gap: 9px;
  background: var(--carbon); border: 1px solid var(--line);
  padding: 11px 14px; border-radius: 16px; border-bottom-left-radius: 5px;
}
.otto-dots { display: inline-flex; gap: 4px; }
.otto-dots i { width: 6px; height: 6px; border-radius: 9999px; background: var(--accent); display: block; animation: otto-bounce 1.2s infinite ease-in-out; }
.otto-dots i:nth-child(2) { animation-delay: .15s; }
.otto-dots i:nth-child(3) { animation-delay: .3s; }
.otto-think-label {
  font-size: 13px; color: var(--fog);
  background: linear-gradient(90deg, var(--ash) 0%, #fff 50%, var(--ash) 100%);
  background-size: 200% 100%; -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; animation: otto-shimmer 1.8s linear infinite;
}

/* ───────────── Cards ───────────── */
.otto-cards { display: flex; flex-direction: column; gap: 10px; align-self: flex-start; width: 100%; max-width: 100%; }
.otto-card {
  display: block; text-decoration: none; color: inherit; overflow: hidden;
  background: var(--carbon); border: 1px solid var(--line); border-radius: 16px;
  transition: transform .3s cubic-bezier(.16,1,.3,1), border-color .3s, box-shadow .3s;
  animation: otto-rise .45s cubic-bezier(.16,1,.3,1) both;
}
.otto-card:hover { transform: translateY(-3px); border-color: rgba(225,29,42,.5); box-shadow: 0 18px 40px -16px rgba(0,0,0,.8); }
.otto-card .media { position: relative; height: 132px; background: var(--steel); overflow: hidden; }
.otto-card .media img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
.otto-card:hover .media img { transform: scale(1.08); }
.otto-card .media::after { content: ""; position: absolute; inset: 0; background: linear-gradient(to top, rgba(11,11,15,.85), transparent 55%); }
.otto-card .tag {
  position: absolute; top: 10px; left: 10px; z-index: 1;
  background: rgba(0,0,0,.55); backdrop-filter: blur(4px); color: #fff;
  font: 600 10px system-ui, sans-serif; text-transform: uppercase; letter-spacing: .08em;
  padding: 4px 9px; border-radius: 9999px;
}
.otto-card .price-badge {
  position: absolute; bottom: 10px; right: 10px; z-index: 1;
  background: var(--accent); color: #fff; font: 700 14px system-ui, sans-serif;
  padding: 5px 11px; border-radius: 9999px;
}
.otto-card .body { padding: 12px 14px 14px; }
.otto-card .title { font: 700 14.5px system-ui, sans-serif; color: #fff; }
.otto-card .meta { font-size: 11.5px; color: var(--ash); margin-top: 3px; }
.otto-card .why { color: var(--fog); font-size: 12.5px; margin-top: 8px; line-height: 1.45; display: flex; gap: 6px; }
.otto-card .why::before { content: ""; flex: none; width: 3px; border-radius: 9999px; background: var(--accent); }
.otto-card .cta { margin-top: 10px; font: 700 11px system-ui, sans-serif; text-transform: uppercase; letter-spacing: .1em; color: var(--accent); display: flex; align-items: center; gap: 5px; }
.otto-card:hover .cta .a { transform: translateX(3px); }
.otto-card .cta .a { transition: transform .25s; }

/* ───────────── Chips ───────────── */
.otto-chips { display: flex; flex-wrap: wrap; gap: 7px; align-self: flex-start; padding-left: 38px; max-width: 100%; }
.otto-chip {
  background: transparent; color: var(--fog); border: 1px solid var(--line);
  border-radius: 9999px; padding: 7px 13px; font: 600 12.5px system-ui, sans-serif; cursor: pointer;
  transition: all .2s;
}
.otto-chip:hover { background: rgba(225,29,42,.12); border-color: var(--accent); color: #fff; }

/* ───────────── Input ───────────── */
.otto-input { display: flex; gap: 9px; padding: 12px 14px 10px; border-top: 1px solid var(--line); background: var(--coal); }
.otto-input input {
  flex: 1; padding: 11px 15px; border: 1px solid var(--line); border-radius: 9999px;
  font: 14px system-ui, sans-serif; outline: none; background: var(--carbon); color: #fff;
  transition: border-color .2s;
}
.otto-input input::placeholder { color: var(--ash); }
.otto-input input:focus { border-color: var(--accent); }
.otto-input button {
  flex: none; width: 42px; height: 42px; display: grid; place-items: center;
  background: linear-gradient(135deg, var(--accent), var(--accent-bright)); color: #fff;
  border: none; border-radius: 9999px; cursor: pointer; transition: transform .2s, opacity .2s;
}
.otto-input button:hover:not(:disabled) { transform: scale(1.08); }
.otto-input button:disabled { opacity: .4; cursor: default; }
.otto-foot { text-align: center; font-size: 10.5px; color: var(--ash); padding: 0 0 9px; background: var(--coal); }
.otto-foot b { color: var(--fog); font-weight: 600; }

/* ───────────── Otto avatar mark ───────────── */
.otto-mark {
  display: grid; place-items: center; width: 100%; height: 100%; border-radius: 9999px;
  background: linear-gradient(135deg, var(--accent), var(--accent-bright));
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.14);
}
.otto-mark svg { width: 60%; height: 60%; display: block; }
.otto-header .badge { width: 44px; height: 44px; }
.otto-welcome .hero-av { width: 66px; height: 66px; margin: 0 auto; }

/* ───────────── Keyframes ───────────── */
@keyframes otto-launch-in { 0% { opacity: 0; transform: translateY(20px) scale(.8); } 100% { opacity: 1; transform: none; } }
@keyframes otto-ring { 0% { transform: scale(1); opacity: .7; } 100% { transform: scale(1.5); opacity: 0; } }
@keyframes otto-panel-in { 0% { opacity: 0; transform: translateY(24px) scale(.92); } 100% { opacity: 1; transform: none; } }
@keyframes otto-panel-out { 0% { opacity: 1; transform: none; } 100% { opacity: 0; transform: translateY(24px) scale(.92); } }
@keyframes otto-rise { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: none; } }
@keyframes otto-bounce { 0%,80%,100% { transform: translateY(0); opacity: .5; } 40% { transform: translateY(-6px); opacity: 1; } }
@keyframes otto-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

@media (max-width: 480px) {
  .otto-panel { width: 100vw; height: 100dvh; max-height: 100dvh; bottom: 0; right: 0; border-radius: 0; border: none; }
  .otto-nudge { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .otto-launcher, .otto-panel, .otto-panel.closing, .otto-row, .otto-card, .otto-welcome, .otto-nudge { animation: none !important; }
  .otto-launcher .av::before, .otto-dots i, .otto-think-label { animation: none !important; }
}
`;

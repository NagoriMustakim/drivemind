/**
 * Conversation panel. Optimistic UI (instant user message + a lively, narrated
 * thinking indicator), progressive SSE rendering, message avatars, car cards,
 * suggestion chips, and open/close animations. Conversation state is persisted
 * to sessionStorage so it survives navigating to a car page and back (it clears
 * only when the tab/site is closed). Stateful logic lives here; index.tsx mounts.
 */
import { useState, useRef, useEffect, useCallback } from "preact/hooks";
import { createSession, streamQuery, type QueryResult, type RecommendedCard, type Stage } from "./api";
import { CardList } from "./cards";
import { Chips } from "./chips";

export interface Config {
  dealerId: string;
  apiBase: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  cars?: RecommendedCard[];
  suggestedAnswers?: string[];
  /** Live pipeline stage for the in-flight assistant message. */
  stage?: Stage;
  /** Candidate count surfaced at the "matching" stage. */
  count?: number;
}

const GREETING =
  "Hi, I'm Otto \u{1F44B} — your personal car-finding concierge. Tell me what you're after and I'll match it to cars on our floor in seconds.";
const STARTER_CHIPS = [
  "A reliable family SUV under $30k",
  "A fun weekend car",
  "Best value low-mileage car",
  "Something for a long commute",
];

const STORAGE_PREFIX = "otto:chat:";

/* ───────────────────────── Avatars ───────────────────────── */

export function OttoMark() {
  return (
    <span class="otto-mark">
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        {/* simple friendly "headlights" robot face */}
        <rect x="6" y="9" width="20" height="15" rx="5" fill="#fff" opacity="0.96" />
        <circle cx="12.5" cy="16.5" r="2.4" fill="#E11D2A" />
        <circle cx="19.5" cy="16.5" r="2.4" fill="#E11D2A" />
        <path d="M16 4.5v3.5" stroke="#fff" stroke-width="2" stroke-linecap="round" />
        <circle cx="16" cy="4" r="1.8" fill="#fff" />
      </svg>
    </span>
  );
}

function UserAvatar() {
  return (
    <span class="otto-av user" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M4.5 20a7.5 7.5 0 0 1 15 0" stroke-linecap="round" />
      </svg>
    </span>
  );
}

/* ───────────────────────── Thinking indicator ───────────────────────── */

const COMPOSING_PHRASES = [
  "Lining up Otto's top picks…",
  "Weighing up the best fit for you…",
  "Almost there — polishing the details…",
];

function thinkingLabel(stage: Stage | undefined, count: number | undefined, tick: number): string {
  switch (stage) {
    case "searching":
      return "Searching the showroom…";
    case "matching":
      return count && count > 0
        ? `Found ${count} strong match${count > 1 ? "es" : ""} — sizing them up…`
        : "Scanning the full inventory…";
    case "composing":
      return COMPOSING_PHRASES[tick % COMPOSING_PHRASES.length]!;
    default:
      return "Otto is typing…";
  }
}

export function Thinking({ stage, count }: { stage?: Stage; count?: number }) {
  const [tick, setTick] = useState(0);
  // Cycle the encouraging copy only during the longest stage so it feels alive.
  useEffect(() => {
    if (stage !== "composing") return;
    const id = setInterval(() => setTick((t) => t + 1), 1900);
    return () => clearInterval(id);
  }, [stage]);

  return (
    <div class="otto-row assistant">
      <span class="otto-av">
        <OttoMark />
      </span>
      <div class="otto-thinking">
        <div class="bubble">
          <span class="otto-dots">
            <i />
            <i />
            <i />
          </span>
          <span class="otto-think-label">{thinkingLabel(stage, count, tick)}</span>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Message bubble ───────────────────────── */

/** A single chat bubble (exported for testing — pure render of one message). */
export function Bubble({
  message,
  busy,
  isLast,
  onChip,
}: {
  message: Message;
  busy: boolean;
  isLast: boolean;
  onChip: (text: string) => void;
}) {
  const isEmptyAssistant = message.role === "assistant" && !message.content;
  if (isEmptyAssistant && busy && isLast) {
    return <Thinking stage={message.stage} count={message.count} />;
  }
  return (
    <>
      {message.content ? (
        <div class={`otto-row ${message.role}`}>
          <span class="otto-av">{message.role === "assistant" ? <OttoMark /> : null}</span>
          {message.role === "user" ? <UserAvatar /> : null}
          <div class="stack">
            <div class={`otto-msg ${message.role}`}>{message.content}</div>
          </div>
        </div>
      ) : null}
      {message.cars ? <CardList cars={message.cars} /> : null}
      {!busy && message.suggestedAnswers ? (
        <Chips items={message.suggestedAnswers} onPick={onChip} />
      ) : null}
    </>
  );
}

/* ───────────────────────── Panel ───────────────────────── */

export function Panel({ config }: { config: Config }) {
  const storeKey = STORAGE_PREFIX + config.dealerId;
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [nudge, setNudge] = useState(false);
  const tokenRef = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const restored = useRef(false);

  // Restore a prior conversation (survives navigation within the tab session).
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storeKey);
      if (raw) {
        const saved = JSON.parse(raw) as { messages?: Message[]; token?: string; open?: boolean };
        if (Array.isArray(saved.messages)) setMessages(saved.messages);
        if (saved.token) tokenRef.current = saved.token;
        if (saved.open) setOpen(true);
      }
    } catch {
      /* ignore corrupt storage */
    }
    restored.current = true;
  }, [storeKey]);

  // Persist after every settled change (never persist a mid-stream placeholder).
  useEffect(() => {
    if (!restored.current || busy) return;
    try {
      const clean = messages.filter((m) => m.content || m.cars);
      sessionStorage.setItem(
        storeKey,
        JSON.stringify({ messages: clean, token: tokenRef.current, open }),
      );
    } catch {
      /* storage full / unavailable — non-fatal */
    }
  }, [messages, open, busy, storeKey]);

  // One-time "psst, I'm here" nudge if the visitor hasn't opened Otto.
  useEffect(() => {
    if (open || messages.length > 0) return;
    const id = setTimeout(() => setNudge(true), 6000);
    return () => clearTimeout(id);
  }, [open, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const ensureSession = useCallback(async (): Promise<string> => {
    if (tokenRef.current) return tokenRef.current;
    const token = await createSession(config.apiBase, config.dealerId);
    tokenRef.current = token;
    return token;
  }, [config]);

  const openPanel = useCallback(() => {
    setNudge(false);
    setOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setOpen(false);
    }, 250);
  }, []);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || busy) return;
      setInput("");
      setBusy(true);

      const history = messages.filter((m) => m.content).map((m) => ({ role: m.role, content: m.content }));
      // Optimistic UI: user message + a thinking placeholder appear instantly.
      setMessages((prev) => [...prev, { role: "user", content: trimmed }, { role: "assistant", content: "" }]);

      const patchLast = (fn: (m: Message) => void) =>
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last && last.role === "assistant") fn(last);
          return next;
        });

      try {
        const token = await ensureSession();
        await streamQuery(config.apiBase, token, trimmed, history, {
          onStatus: (stage, count) =>
            patchLast((m) => {
              m.stage = stage;
              if (count !== undefined) m.count = count;
            }),
          onDelta: (delta) =>
            patchLast((m) => {
              m.content += delta;
              m.stage = undefined;
            }),
          onResult: (result: QueryResult) =>
            patchLast((m) => {
              m.content = result.response;
              m.cars = result.cars;
              m.suggestedAnswers = result.suggestedAnswers;
              m.stage = undefined;
            }),
          onError: (msg) =>
            patchLast((m) => {
              m.content = msg;
              m.stage = undefined;
            }),
        });
      } catch {
        patchLast((m) => {
          m.content = "Sorry, something went wrong. Please try again.";
          m.stage = undefined;
        });
      } finally {
        setBusy(false);
      }
    },
    [busy, messages, ensureSession, config],
  );

  if (!open) {
    return (
      <>
        {nudge ? (
          <div class="otto-nudge" role="status">
            <button class="x" onClick={() => setNudge(false)} aria-label="Dismiss">
              ×
            </button>
            Looking for your next car? <b>Ask Otto</b> — I'll find it in seconds. {"\u{1F44B}"}
          </div>
        ) : null}
        <button class="otto-launcher" onClick={openPanel} aria-label="Open Otto, the car assistant">
          <span class="av">
            <OttoMark />
            <span class="dot" />
          </span>
          Ask Otto
        </button>
      </>
    );
  }

  const showWelcome = messages.length === 0;

  return (
    <div class={`otto-panel ${closing ? "closing" : ""}`} role="dialog" aria-label="Otto car assistant">
      <div class="otto-header">
        <span class="badge">
          <OttoMark />
          <span class="live" />
        </span>
        <div class="who">
          <div class="name">Otto</div>
          <div class="sub">
            <span style="width:6px;height:6px;border-radius:9999px;background:#22c55e;display:inline-block" />
            Online · Car concierge
          </div>
        </div>
        <button class="otto-close" onClick={closePanel} aria-label="Close">
          ×
        </button>
      </div>

      <div class="otto-messages" ref={scrollRef}>
        {showWelcome ? (
          <div class="otto-welcome">
            <span class="hero-av">
              <OttoMark />
            </span>
            <div class="hi">Welcome {"\u{1F44B}"}</div>
            <p class="lead">{GREETING}</p>
            <div class="otto-qcards">
              {STARTER_CHIPS.map((q) => (
                <button class="otto-qcard" key={q} onClick={() => send(q)} type="button">
                  {q}
                  <span class="arr">→</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <Bubble key={i} message={m} busy={busy} isLast={i === messages.length - 1} onChip={send} />
          ))
        )}
      </div>

      <form
        class="otto-input"
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
      >
        <input
          value={input}
          onInput={(e) => setInput((e.target as HTMLInputElement).value)}
          placeholder="Describe the car you want…"
          aria-label="Message Otto"
          disabled={busy}
        />
        <button type="submit" disabled={busy || !input.trim()} aria-label="Send">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 2 11 13" />
            <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
          </svg>
        </button>
      </form>
    </div>
  );
}

"use client";

/**
 * Admin Inventory Control dashboard. Two ways to feed the assistant's knowledge
 * base:
 *   1. API Sync (fully functional) — the dealer enters { dealerId, apiUrl, token }
 *      and the client drives a batched, resumable sync via POST /api/sync.
 *   2. Website Crawl (UI preview only) — for clients who can't expose an API. The
 *      final action is intentionally DISABLED; it showcases the capability without
 *      a backend. Wire it to a real crawler endpoint when one exists.
 */
import { useState } from "react";

type Method = "crawl" | "api";

interface SyncJob {
  id: string;
  dealerId: string;
  status: "running" | "completed" | "failed";
  total: number | null;
  processed: number;
  searchableCount: number;
  error: string | null;
}

interface IngestedCar {
  source_car_id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  body_type: string;
}

function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

function Icon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  const paths: Record<string, React.ReactNode> = {
    api: (
      <>
        <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
        <path d="m9 9 3 3-3 3M15 9l-3 3 3 3" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
      </>
    ),
    car: (
      <>
        <path d="M5 11l1.5-4A2 2 0 0 1 8.4 6h7.2a2 2 0 0 1 1.9 1.4L19 11" />
        <path d="M3 16v-2a2 2 0 0 1 1.2-1.8L5 11h14l.8.2A2 2 0 0 1 21 14v2a1 1 0 0 1-1 1h-1M5 17H4a1 1 0 0 1-1-1Z" />
        <circle cx="7.5" cy="16.5" r="1.5" />
        <circle cx="16.5" cy="16.5" r="1.5" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </>
    ),
    sparkles: (
      <>
        <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
        <path d="m6.5 6.5 2 2M15.5 15.5l2 2M17.5 6.5l-2 2M8.5 15.5l-2 2" />
      </>
    ),
    bolt: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths[name] ?? null}
    </svg>
  );
}

/** Turn a raw job error into a human-friendly message + hint. */
function friendlyError(error: string | null): { message: string; hint?: string } {
  const e = error ?? "Sync failed.";
  if (/429|quota|RESOURCE_EXHAUSTED|limit:\s*0/i.test(e)) {
    return {
      message: "Gemini rate limit / quota reached.",
      hint: "Your GEMINI_API_KEY has no free-tier quota for the selected model. Create a key in Google AI Studio (aistudio.google.com/apikey), or set GEMINI_EXTRACT_MODEL / GEMINI_EMBED_MODEL to a model your key supports, then sync again.",
    };
  }
  if (/401|unauthorized|invalid token/i.test(e)) {
    return {
      message: "The dealer API rejected the token.",
      hint: "Check the Access token matches DEALER_API_TOKEN on the dealer site.",
    };
  }
  if (/fetch|ECONN|network|getaddrinfo|returned 4|returned 5/i.test(e)) {
    return {
      message: "Couldn't reach the inventory API.",
      hint: "Check the Inventory API URL is correct and the dealer site is running.",
    };
  }
  return { message: e };
}

const CRAWL_STEPS = [
  { icon: "globe", title: "Reach your site", body: "We securely fetch your public website." },
  { icon: "search", title: "Discover listings", body: "Locate your stock and vehicle pages." },
  { icon: "car", title: "Read every vehicle", body: "Extract make, model, price, specs & photos." },
  { icon: "sparkles", title: "Build the knowledge base", body: "Enrich & index so Otto can recommend." },
];

export default function AdminPage() {
  const [method, setMethod] = useState<Method>("crawl");
  const [dealerId, setDealerId] = useState("nextgear");

  // API sync state
  const [apiUrl, setApiUrl] = useState("https://drivemind-admin.vercel.app/api/cars");
  const [token, setToken] = useState("");
  const [job, setJob] = useState<SyncJob | null>(null);
  const [busy, setBusy] = useState(false);
  const [ingested, setIngested] = useState<IngestedCar[]>([]);

  // Crawl (UI preview only)
  const [domain, setDomain] = useState("");

  async function postBatch(jobId?: string): Promise<SyncJob> {
    const res = await fetch("/api/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dealerId, apiUrl, token, jobId }),
    });
    if (!res.ok) {
      const detail = (await res.json().catch(() => ({}))) as { error?: string };
      throw new Error(detail.error ?? `sync failed (${res.status})`);
    }
    return (await res.json()) as SyncJob;
  }

  async function loadIngested(): Promise<void> {
    const res = await fetch(`/api/ingested?dealerId=${encodeURIComponent(dealerId)}`);
    if (res.ok) {
      const data = (await res.json()) as { cars: IngestedCar[] };
      setIngested(data.cars);
    }
  }

  async function runSync(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setIngested([]);
    try {
      let current = await postBatch();
      setJob(current);
      let guard = 0;
      while (current.status === "running" && guard++ < 500) {
        current = await postBatch(current.id);
        setJob(current);
      }
      if (current.status === "completed") await loadIngested();
    } catch (err) {
      setJob({
        id: "",
        dealerId,
        status: "failed",
        total: null,
        processed: 0,
        searchableCount: 0,
        error: err instanceof Error ? err.message : "sync failed",
      });
    } finally {
      setBusy(false);
    }
  }

  const pct = job?.total ? Math.round((job.processed / job.total) * 100) : 0;
  const searchable = job?.searchableCount ?? ingested.length;
  const statusLabel = busy
    ? "Syncing"
    : job?.status === "completed"
      ? "Synced"
      : job?.status === "failed"
        ? "Error"
        : "Idle";

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="pointer-events-none absolute inset-0 bg-radial-accent opacity-60" />
        <div className="bg-noise pointer-events-none absolute inset-0 opacity-40" />
        <div className="container-x relative py-14">
          <p className="eyebrow mb-3 animate-fade-up">Inventory Control</p>
          <h1 className="max-w-2xl animate-fade-up font-condensed text-4xl font-bold uppercase leading-[0.95] tracking-wide text-white sm:text-5xl">
            Connect your inventory to <span className="text-accent">Otto</span>
          </h1>
          <p className="mt-4 max-w-xl animate-fade-up text-fog">
            Feed your live stock into the assistant&apos;s knowledge base. Sync via your API, or let
            us crawl your website — no engineering required.
          </p>

          {/* Stat tiles */}
          <div className="mt-9 grid max-w-3xl grid-cols-3 gap-4">
            {[
              { label: "Searchable cars", value: searchable.toLocaleString() },
              { label: "Active dealer", value: dealerId || "—" },
              { label: "Status", value: statusLabel },
            ].map((s) => (
              <div key={s.label} className="surface px-5 py-4">
                <div className="truncate font-condensed text-2xl font-bold text-white sm:text-3xl">
                  {s.value}
                </div>
                <div className="mt-1 font-condensed text-[11px] uppercase tracking-widest text-ash">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x space-y-8 py-12">
        {/* Dealer id (shared) */}
        <div className="surface p-5">
          <label className="block max-w-sm">
            <span className="field-label">Dealer ID</span>
            <input className="field" value={dealerId} onChange={(e) => setDealerId(e.target.value)} required />
          </label>
        </div>

        {/* Method selector */}
        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setMethod("crawl")}
            className={`surface group relative flex items-start gap-4 p-5 text-left transition-all duration-300 ${
              method === "crawl" ? "border-accent/60 shadow-glow" : "hover:border-white/20"
            }`}
          >
            <span className="absolute right-4 top-4 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 font-condensed text-[10px] uppercase tracking-widest text-accent">
              New
            </span>
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${
                method === "crawl" ? "bg-accent text-white" : "bg-accent/10 text-accent"
              }`}
            >
              <Icon name="globe" className="h-6 w-6" />
            </span>
            <span>
              <span className="block font-condensed text-lg uppercase tracking-wide text-white">
                Crawl my website
              </span>
              <span className="mt-1 block text-sm text-ash">
                No API, no token. Just paste your domain — we do the rest.
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMethod("api")}
            className={`surface group flex items-start gap-4 p-5 text-left transition-all duration-300 ${
              method === "api" ? "border-accent/60 shadow-glow" : "hover:border-white/20"
            }`}
          >
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${
                method === "api" ? "bg-accent text-white" : "bg-accent/10 text-accent"
              }`}
            >
              <Icon name="api" className="h-6 w-6" />
            </span>
            <span>
              <span className="block font-condensed text-lg uppercase tracking-wide text-white">
                Connect via API
              </span>
              <span className="mt-1 block text-sm text-ash">
                Point us at your inventory endpoint for live, exact data.
              </span>
            </span>
          </button>
        </div>

        {/* ───────── CRAWL PANEL (UI preview) ───────── */}
        {method === "crawl" && (
          <div className="surface animate-fade-up overflow-hidden">
            <div className="border-b border-white/5 p-6 sm:p-8">
              <h2 className="font-condensed text-2xl uppercase tracking-wide text-white">
                Crawl your website
              </h2>
              <p className="mt-2 max-w-xl text-sm text-fog">
                Built for dealers without a developer. Enter your website and we&apos;ll
                automatically read your stock and build Otto&apos;s knowledge base.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ash">
                    <Icon name="globe" className="h-5 w-5" />
                  </span>
                  <input
                    className="field pl-11"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="https://your-dealership.com"
                    aria-label="Website domain"
                  />
                </div>
                {/* Intentionally disabled — UI preview of a capability (no backend). */}
                <button
                  type="button"
                  disabled
                  title="Automated crawling is available on request — contact your DriveMind rep to enable it."
                  className="btn-accent shrink-0 cursor-not-allowed"
                  aria-disabled="true"
                >
                  <Icon name="lock" className="h-4 w-4" />
                  Start Crawl
                </button>
              </div>
              <p className="mt-3 flex items-center gap-2 text-xs text-ash">
                <Icon name="lock" className="h-3.5 w-3.5" />
                Preview — automated crawling is available on request. Contact your DriveMind rep to
                enable it for this dealer.
              </p>
            </div>

            {/* How it works */}
            <div className="grid gap-px bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
              {CRAWL_STEPS.map((step, i) => (
                <div key={step.title} className="bg-carbon p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <Icon name={step.icon} className="h-5 w-5" />
                    </span>
                    <span className="font-condensed text-3xl font-bold text-white/10">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="font-condensed text-base uppercase tracking-wide text-white">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-ash">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ───────── API SYNC PANEL (functional) ───────── */}
        {method === "api" && (
          <form onSubmit={runSync} className="surface animate-fade-up space-y-5 p-6 sm:p-8">
            <div>
              <h2 className="font-condensed text-2xl uppercase tracking-wide text-white">
                Connect via API
              </h2>
              <p className="mt-2 max-w-xl text-sm text-fog">
                Point DriveMind at your site&apos;s inventory API and sync your cars into the
                assistant.
              </p>
            </div>

            <label className="block">
              <span className="field-label">Inventory API URL</span>
              <input
                className="field"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://drivemind-admin.vercel.app/api/cars"
                required
              />
            </label>
            <label className="block">
              <span className="field-label">Access token</span>
              <input
                className="field"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Bearer token for GET /api/cars"
                required
              />
            </label>
            <button type="submit" disabled={busy} className="btn-accent">
              {busy ? <Spinner /> : <Icon name="bolt" className="h-4 w-4" />}
              {busy ? "Syncing…" : "Sync Inventory"}
            </button>
          </form>
        )}

        {/* Running banner */}
        {busy && (job?.status ?? "running") === "running" && (
          <div className="surface flex items-center gap-4 border-accent/30 p-5">
            <Spinner className="text-accent" />
            <div>
              <p className="font-condensed uppercase tracking-wide text-white">
                Processing your inventory…
              </p>
              <p className="text-sm text-ash">
                Enriching each car and generating embeddings in batches. This can take up to a
                minute on the free tier.
              </p>
            </div>
          </div>
        )}

        {/* Sync status */}
        {job && (
          <div className="surface p-6">
            <h2 className="font-condensed text-lg uppercase tracking-wide text-white">Sync status</h2>
            {job.status === "failed" ? (
              <div className="mt-3">
                <p className="font-medium text-accent">{friendlyError(job.error).message}</p>
                {friendlyError(job.error).hint && (
                  <p className="mt-1 text-sm text-ash">{friendlyError(job.error).hint}</p>
                )}
                <details className="mt-3 text-xs text-ash/70">
                  <summary className="cursor-pointer">Technical details</summary>
                  <pre className="mt-1 whitespace-pre-wrap break-words">{job.error}</pre>
                </details>
              </div>
            ) : (
              <>
                <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-steel">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-accent-bright transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-3 text-sm text-fog">
                  {job.status === "completed" ? "Completed" : "Running"} · {job.processed}
                  {job.total ? ` / ${job.total}` : ""} processed ·{" "}
                  <strong className="text-white">{job.searchableCount}</strong> searchable
                </p>
              </>
            )}
          </div>
        )}

        {/* Ingested list */}
        {ingested.length > 0 && (
          <div className="surface p-6">
            <h2 className="flex items-center gap-2 font-condensed text-lg uppercase tracking-wide text-white">
              <Icon name="check" className="h-5 w-5 text-accent" />
              Searchable inventory ({ingested.length})
            </h2>
            <ul className="mt-4 divide-y divide-white/5 text-sm">
              {ingested.map((c) => (
                <li key={c.source_car_id} className="flex items-center justify-between py-3">
                  <span className="flex items-center gap-3 text-fog">
                    <Icon name="car" className="h-4 w-4 text-ash" />
                    {c.year} {c.make} {c.model}
                    <span className="font-condensed text-xs uppercase tracking-wide text-ash">
                      · {c.body_type}
                    </span>
                  </span>
                  <span className="font-condensed text-white">${c.price.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  );
}

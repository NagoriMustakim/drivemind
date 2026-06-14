/**
 * Minimal in-memory fake of the Supabase client — just enough to exercise the
 * ingestion + sync logic in CI without a real database. Supports the specific
 * chains used by lib/ingest.ts and lib/sync.ts.
 */
type Row = Record<string, unknown>;

interface Store {
  sync_jobs: Map<string, Row>;
  cars: Map<string, Row>; // keyed by `${dealer_id}|${source_car_id}`
  jobSeq: number;
}

interface Result {
  data: unknown;
  error: unknown;
  count?: number;
}

class Query {
  private op: "select" | "insert" | "update" | "upsert" | "delete" = "select";
  private payload: unknown;
  private filters: Record<string, unknown> = {};
  private inFilter: { col: string; set: Set<unknown> } | null = null;
  private countHead = false;

  constructor(
    private store: Store,
    private table: keyof Store,
  ) {}

  insert(obj: Row): this {
    this.op = "insert";
    this.payload = obj;
    return this;
  }
  upsert(rows: Row[]): this {
    this.op = "upsert";
    this.payload = rows;
    return this;
  }
  update(patch: Row): this {
    this.op = "update";
    this.payload = patch;
    return this;
  }
  delete(): this {
    this.op = "delete";
    return this;
  }
  select(_cols?: string, opts?: { count?: string; head?: boolean }): this {
    if (opts?.head) this.countHead = true;
    return this;
  }
  eq(col: string, val: unknown): this {
    this.filters[col] = val;
    return this;
  }
  in(col: string, arr: unknown[]): this {
    this.inFilter = { col, set: new Set(arr) };
    return this;
  }
  order(): this {
    return this;
  }
  single(): Promise<Result> {
    return this.resolve();
  }
  maybeSingle(): Promise<Result> {
    return this.resolve();
  }
  then(onFulfilled: (v: Result) => unknown): Promise<unknown> {
    return this.resolve().then(onFulfilled);
  }

  private async resolve(): Promise<Result> {
    const jobs = this.store.sync_jobs;
    const cars = this.store.cars;

    if (this.table === "sync_jobs") {
      if (this.op === "insert") {
        const id = `job-${++this.store.jobSeq}`;
        const row = { id, ...(this.payload as Row) };
        jobs.set(id, row);
        return { data: row, error: null };
      }
      if (this.op === "update") {
        const id = this.filters.id as string;
        const row = { ...(jobs.get(id) ?? {}), ...(this.payload as Row) };
        jobs.set(id, row);
        return { data: row, error: null };
      }
      return { data: jobs.get(this.filters.id as string) ?? null, error: null };
    }

    // cars table
    if (this.op === "upsert") {
      for (const r of this.payload as Row[]) {
        cars.set(`${r.dealer_id}|${r.source_car_id}`, r);
      }
      return { data: null, error: null };
    }

    const matches = (r: Row): boolean => {
      for (const [k, v] of Object.entries(this.filters)) {
        if (r[k] !== v) return false;
      }
      if (this.inFilter && !this.inFilter.set.has(r[this.inFilter.col])) return false;
      return true;
    };

    if (this.op === "delete") {
      for (const [key, r] of cars) {
        if (matches(r)) cars.delete(key);
      }
      return { data: null, error: null };
    }

    const rows = [...cars.values()].filter(matches);
    if (this.countHead) return { data: null, error: null, count: rows.length };
    return { data: rows, error: null };
  }
}

export function makeFakeSupabase() {
  const store: Store = { sync_jobs: new Map(), cars: new Map(), jobSeq: 0 };
  const client = {
    from(table: keyof Store) {
      return new Query(store, table);
    },
  };
  return { client, store, withWake: <T>(fn: () => Promise<T>) => fn() };
}

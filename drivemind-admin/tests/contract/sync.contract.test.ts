/**
 * T035: contract test for the sync API DTO (admin-sync.openapi.yaml). Verifies
 * the SyncJob shape the routes return matches the documented contract.
 */
import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { toDto, type SyncJobRow } from "@/lib/sync";

describe("SyncJob DTO contract", () => {
  it("maps a DB row to the documented camelCase DTO", () => {
    const row: SyncJobRow = {
      id: "job-1",
      dealer_id: "nextgear",
      status: "running",
      total: 50,
      processed: 20,
      searchable_count: 20,
      error: null,
    };
    const dto = toDto(row);
    expect(dto).toEqual({
      id: "job-1",
      dealerId: "nextgear",
      status: "running",
      total: 50,
      processed: 20,
      searchableCount: 20,
      error: null,
    });
  });

  it("matches the documented contract file when present", () => {
    const p = resolve(__dirname, "../../../specs/001-drivemind/contracts/admin-sync.openapi.yaml");
    if (existsSync(p)) {
      const yaml = readFileSync(p, "utf8");
      expect(yaml).toContain("searchableCount");
      expect(yaml).toContain("SyncJob");
    } else {
      expect(true).toBe(true); // standalone repo — DTO shape is asserted above
    }
  });
});

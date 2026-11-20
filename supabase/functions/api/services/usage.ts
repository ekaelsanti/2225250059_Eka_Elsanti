// Anonymous AI usage: daily quota per client hash, monthly budget, and a request log for research.
// Privacy (CLAUDE.md §7): no participant code, no name, no question text is stored. The client hash is a salted
// SHA-256 of the IP address, kept only to enforce the daily quota.
import type postgres from "postgres";

export interface UsageEntry {
  surface: "tanya" | "rmt";
  lesson: string | null;
  phase: string | null;
  model: string | null;
  status: "ok" | "refused" | "busy" | "error";
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  latencyMs: number;
}

export interface UsageStore {
  /** Counts one request for this client today and returns the new count. */
  countToday(clientHash: string, day: string): Promise<number>;
  /** Estimated spend this month in USD. */
  monthCost(month: string): Promise<number>;
  record(month: string, entry: UsageEntry): Promise<void>;
}

export class MemoryUsageStore implements UsageStore {
  daily = new Map<string, number>();
  monthly = new Map<string, number>();
  log: UsageEntry[] = [];

  countToday(clientHash: string, day: string): Promise<number> {
    const k = `${day}:${clientHash}`;
    const n = (this.daily.get(k) ?? 0) + 1;
    this.daily.set(k, n);
    return Promise.resolve(n);
  }

  monthCost(month: string): Promise<number> {
    return Promise.resolve(this.monthly.get(month) ?? 0);
  }

  record(month: string, entry: UsageEntry): Promise<void> {
    this.monthly.set(month, (this.monthly.get(month) ?? 0) + entry.costUsd);
    this.log.push(entry);
    return Promise.resolve();
  }
}

/** Tables: supabase/migrations/20261120000000_ai_usage.sql (RLS on, no policies: Edge Function only). */
export class PgUsageStore implements UsageStore {
  private sql: postgres.Sql;

  constructor(sql: postgres.Sql) {
    this.sql = sql;
  }

  async countToday(clientHash: string, day: string): Promise<number> {
    const [row] = await this.sql`
      insert into ai_usage_daily (day, client_hash, requests) values (${day}, ${clientHash}, 1)
      on conflict (day, client_hash) do update set requests = ai_usage_daily.requests + 1
      returning requests`;
    return Number(row.requests);
  }

  async monthCost(month: string): Promise<number> {
    const [row] = await this.sql`select cost_usd from ai_usage_monthly where month = ${month}`;
    return row ? Number(row.cost_usd) : 0;
  }

  async record(month: string, e: UsageEntry): Promise<void> {
    await this.sql`
      insert into ai_usage_monthly (month, requests, input_tokens, output_tokens, cost_usd)
      values (${month}, 1, ${e.inputTokens}, ${e.outputTokens}, ${e.costUsd})
      on conflict (month) do update set
        requests = ai_usage_monthly.requests + 1,
        input_tokens = ai_usage_monthly.input_tokens + excluded.input_tokens,
        output_tokens = ai_usage_monthly.output_tokens + excluded.output_tokens,
        cost_usd = ai_usage_monthly.cost_usd + excluded.cost_usd`;
    await this.sql`
      insert into ai_requests (surface, lesson, phase, model, status, input_tokens, output_tokens, latency_ms)
      values (${e.surface}, ${e.lesson}, ${e.phase}, ${e.model}, ${e.status}, ${e.inputTokens}, ${e.outputTokens}, ${e.latencyMs})`;
  }
}

/** Salted SHA-256 of the client address (hex, 32 chars). Web Crypto: works on Deno and Node. */
export async function clientHash(address: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(`${salt}:${address}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}

/** Day and month in WIB (UTC+7), e.g. "2026-11-20" and "2026-11". */
export function wibDay(now = new Date()): { day: string; month: string } {
  const day = new Date(now.getTime() + 7 * 3600_000).toISOString().slice(0, 10);
  return { day, month: day.slice(0, 7) };
}

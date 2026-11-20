// Settings from environment variables: Supabase secrets in production, the root .env for `npm run api:dev`.
// The function runs on Deno (Supabase) and on Node (local dev and tests).

// deno-lint-ignore no-explicit-any
const g = globalThis as any;
export const isDeno = typeof g.Deno !== "undefined";

export function env(name: string): string | undefined {
  const v = isDeno ? g.Deno.env.get(name) : g.process?.env?.[name];
  return v === "" ? undefined : v;
}

function num(name: string, def: number): number {
  const v = env(name);
  const n = v === undefined ? NaN : Number(v);
  return Number.isFinite(n) ? n : def;
}

const DEV_SALT = "dev-only-usage-salt-change-me";

export interface Settings {
  appEnv: string;
  /** Supabase Postgres. Missing in local dev: usage limits are kept in memory. */
  databaseUrl: string | undefined;
  corsOrigins: string[];
  /** Google AI Studio key (GEMINI_API_KEY). Missing: AI tutor is off (/ask/status → enabled: false). */
  geminiApiKey: string | undefined;
  geminiModel: string;
  /** Tried when the main model is overloaded (429/5xx) or slow. Empty: off. */
  geminiFallbackModel: string | undefined;
  /** Must stay under the 26 s Netlify proxy limit. */
  timeoutSeconds: number;
  /** AI questions per client (anonymous hash) per day. */
  dailyQuota: number;
  /** The tutor pauses for the rest of the month when estimated spend reaches this. */
  monthlyBudgetUsd: number;
  /** USD per token (converted from per-1M prices) for the budget guard. */
  priceIn: number;
  priceOut: number;
  /** Salt for the anonymous client hash used by the daily quota. */
  usageSalt: string;
}

let cached: Settings | null = null;

export function settings(): Settings {
  if (cached) return cached;
  const rawKey = env("GEMINI_API_KEY")?.trim().replace(/^["']|["']$/g, "").trim();
  const s: Settings = {
    appEnv: env("APP_ENV") ?? (isDeno ? "production" : "development"),
    // SUPABASE_DB_URL is provided to every Edge Function by Supabase; DATABASE_URL overrides it.
    databaseUrl: env("DATABASE_URL") ?? env("SUPABASE_DB_URL"),
    corsOrigins: (env("CORS_ORIGINS") ?? "http://localhost:5173").split(",").map((o) => o.trim()).filter(Boolean),
    geminiApiKey: rawKey && !rawKey.toUpperCase().startsWith("TEMPEL_") ? rawKey : undefined,
    geminiModel: env("GEMINI_MODEL") ?? "gemini-3.5-flash-lite",
    geminiFallbackModel: isDeno ? g.Deno.env.get("GEMINI_FALLBACK_MODEL") ?? "gemini-3.8-flash"
      : g.process?.env?.GEMINI_FALLBACK_MODEL ?? "gemini-3.8-flash",
    timeoutSeconds: num("AI_TIMEOUT_SECONDS", 20),
    dailyQuota: num("AI_DAILY_QUOTA", 30),
    monthlyBudgetUsd: num("AI_MONTHLY_BUDGET_USD", 5),
    priceIn: num("AI_PRICE_IN_PER_M", 1.5) / 1_000_000,
    priceOut: num("AI_PRICE_OUT_PER_M", 7.5) / 1_000_000,
    usageSalt: env("USAGE_SALT") ?? DEV_SALT,
  };
  if (s.appEnv === "production") {
    if (s.usageSalt === DEV_SALT || s.usageSalt.length < 16) {
      throw new Error("USAGE_SALT must be set to a random value of at least 16 characters in production");
    }
    if (!s.databaseUrl) throw new Error("No database: SUPABASE_DB_URL / DATABASE_URL is not set");
  }
  cached = s;
  return s;
}

/** For tests only. */
export function resetSettings(): void {
  cached = null;
}

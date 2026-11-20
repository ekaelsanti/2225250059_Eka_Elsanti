// GradieKAn API (Supabase Edge Function "api"). Requests arrive as /api/v1/...
// (Supabase strips /functions/v1; Netlify proxies /api/* here). Deployment: docs/DEPLOYMENT.md.
import { Hono } from "hono";
import { cors } from "hono/cors";
import { callGemini } from "./ai/gemini.ts";
import { db } from "./lib/db.ts";
import { settings as defaultSettings, type Settings } from "./lib/env.ts";
import { HttpError, TEXT } from "./lib/errors.ts";
import { askRoutes, type AskDeps } from "./routes/ask.ts";
import { MemoryUsageStore, PgUsageStore, type UsageStore } from "./services/usage.ts";

export function createApp(deps: AskDeps): Hono {
  const app = new Hono().basePath("/api/v1");

  app.use("*", async (c, next) => {
    await next();
    c.header("X-Content-Type-Options", "nosniff");
    c.header("Referrer-Policy", "no-referrer");
  });
  app.use("*", (c, next) => cors({ origin: deps.settings().corsOrigins, allowMethods: ["GET", "POST"] })(c, next));

  app.get("/health", (c) => c.json({ ok: true, ai_configured: Boolean(deps.settings().geminiApiKey) }));
  app.route("/", askRoutes(deps));

  app.notFound((c) => c.json({ detail: "Not Found" }, 404));
  app.onError((err, c) => {
    if (err instanceof HttpError) return c.json({ detail: err.message }, err.status as 400);
    console.error(err);
    return c.json({ detail: TEXT.internal }, 500);
  });
  return app;
}

let store: UsageStore | null = null;

/** Production wiring: Supabase Postgres when a database URL is set, otherwise in-memory (local dev only). */
export function defaultDeps(): AskDeps {
  return {
    settings: defaultSettings,
    store: () => {
      if (!store) {
        const s: Settings = defaultSettings();
        if (!s.databaseUrl) console.warn("No DATABASE_URL: AI usage limits are kept in memory (local dev only).");
        store = s.databaseUrl ? new PgUsageStore(db()) : new MemoryUsageStore();
      }
      return store;
    },
    callModel: (system, messages) => {
      const s = defaultSettings();
      const models = [s.geminiModel, s.geminiFallbackModel].filter((m, i, a): m is string => Boolean(m) && a.indexOf(m) === i);
      return callGemini(system, messages, { apiKey: s.geminiApiKey as string, models, timeoutSeconds: s.timeoutSeconds });
    },
  };
}

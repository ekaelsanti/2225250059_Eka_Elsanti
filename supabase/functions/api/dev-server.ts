// Local development server on Node (no Deno needed): npm run api:dev → http://localhost:8787/api/v1/health
// Reads GEMINI_API_KEY, DATABASE_URL, etc. from the root .env (optional).
import { serve } from "@hono/node-server";
import { createApp, defaultDeps } from "./app.ts";

const port = Number(process.env.PORT ?? 8787);
serve({ fetch: createApp(defaultDeps()).fetch, port }, () => console.log(`GradieKAn API on http://localhost:${port}/api/v1`));

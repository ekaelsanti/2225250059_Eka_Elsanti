// Supabase Edge Function entry point (Deno). Deploy: npm run api:deploy (docs/DEPLOYMENT.md).
import { createApp, defaultDeps } from "./app.ts";

Deno.serve(createApp(defaultDeps()).fetch);

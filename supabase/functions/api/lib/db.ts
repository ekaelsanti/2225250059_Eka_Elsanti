// Postgres connection to the Supabase database (postgres.js). Schema: supabase/migrations/.
import postgres from "postgres";
import { env, settings } from "./env.ts";

let client: postgres.Sql | null = null;

export function db(): postgres.Sql {
  if (!client) {
    client = postgres(settings().databaseUrl as string, {
      prepare: false, // required by Supabase's transaction pooler (Supavisor)
      max: Number(env("DB_POOL_MAX") ?? 3),
      idle_timeout: 20,
      connect_timeout: 15,
    });
  }
  return client;
}

/** For the dev server shutdown. */
export async function closeDb(): Promise<void> {
  if (client) await client.end({ timeout: 5 });
  client = null;
}

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { env } from "@/lib/env";

import * as schema from "./schema";

/**
 * One client for the process, created on first use and then reused — not one
 * connection per request. There is no browser-facing client and no row-level-security
 * story to get right: the database is reachable only from server code holding the
 * connection string, so every write goes through an API route.
 */
type Database = ReturnType<typeof create>;

function create() {
  return drizzle(neon(env().DATABASE_URL), { schema });
}

let client: Database | null = null;

export function db(): Database {
  if (!client) client = create();
  return client;
}

export { schema };

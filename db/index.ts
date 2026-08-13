import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

type D1Env = Readonly<{
  DB?: D1Database;
}>;

const workersEnv = env as D1Env;

export function getDb() {
  if (!workersEnv.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB` or let your control plane inject the real binding values before using the database."
    );
  }

  return drizzle(workersEnv.DB, { schema });
}

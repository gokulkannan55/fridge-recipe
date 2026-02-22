import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

  // Development fallback: do not initialize Postgres. Allow upper layers
  // to provide an in-memory storage implementation when `db` is undefined.
  console.warn(
    "DATABASE_URL not set — running with in-memory fallback storage (development only).",
  );
} else {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle(pool, { schema });
}

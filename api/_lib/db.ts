import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { pgTable, text, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";

const { Pool } = pg;

export const adminConfigTable = pgTable("admin_config", {
  id: text("id").primaryKey().default("singleton"),
  version: text("version").notNull().default("v4.2.1"),
  maintenance: boolean("maintenance").notNull().default(false),
  velocityApi: jsonb("velocity_api").notNull().default({}),
  xenoApi: jsonb("xeno_api").notNull().default({}),
  buildFiles: jsonb("build_files").notNull().default({}),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (_db) return _db;
  const connectionString = process.env.NEON_DATABASE;
  if (!connectionString) throw new Error("NEON_DATABASE env var is not set");
  const pool = new Pool({ connectionString });
  _db = drizzle(pool, { schema: { adminConfigTable } });
  return _db;
}

export const SINGLETON_ID = "singleton";

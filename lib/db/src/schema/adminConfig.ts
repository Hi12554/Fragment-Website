import { pgTable, text, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";

export const adminConfigTable = pgTable("admin_config", {
  id: text("id").primaryKey().default("singleton"),
  version: text("version").notNull().default("v4.2.1"),
  maintenance: boolean("maintenance").notNull().default(false),
  velocityApi: jsonb("velocity_api").notNull().default({}),
  xenoApi: jsonb("xeno_api").notNull().default({}),
  buildFiles: jsonb("build_files").notNull().default({}),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const SINGLETON_ID = "singleton";

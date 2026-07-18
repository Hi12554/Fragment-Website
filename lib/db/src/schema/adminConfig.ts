import { pgTable, text, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const adminConfigTable = pgTable("admin_config", {
  id: text("id").primaryKey().default("singleton"),
  version: text("version").notNull().default("v4.2.1"),
  maintenance: boolean("maintenance").notNull().default(false),
  velocityApi: jsonb("velocity_api").notNull().default({}),
  xenoApi: jsonb("xeno_api").notNull().default({}),
  buildFiles: jsonb("build_files").notNull().default({}),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertAdminConfigSchema = createInsertSchema(adminConfigTable).omit({
  id: true,
  updatedAt: true,
});

export type InsertAdminConfig = z.infer<typeof insertAdminConfigSchema>;
export type AdminConfigRow = typeof adminConfigTable.$inferSelect;

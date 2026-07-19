import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getDb, adminConfigTable, SINGLETON_ID } from "../_lib/db";
import { verifyToken, extractToken } from "../_lib/auth";

function requireAuth(req: VercelRequest, res: VercelResponse): boolean {
  if (!process.env.SESSION_SECRET) {
    res.status(503).json({ error: "Server authentication is not configured." });
    return false;
  }
  const token = extractToken(req.headers as Record<string, string | undefined>);
  if (!token || !verifyToken(token)) {
    res.status(401).json({ error: "Unauthorized." });
    return false;
  }
  return true;
}

const ApiConfigSchema = z.object({
  status: z.enum(["up", "down"]),
  uncPercent: z.string(),
  suncPercent: z.string(),
  description: z.string(),
  supportedVersion: z.string(),
  downloadUrl: z.string(),
  virusTotalUrl: z.string(),
  virusTotalDetections: z.string(),
  previewImage: z.string(),
  releases: z.array(
    z.object({
      id: z.string(),
      version: z.string(),
      date: z.string(),
      changelog: z.string(),
    }),
  ),
});

const AdminConfigSchema = z.object({
  version: z.string().min(1),
  maintenance: z.boolean(),
  velocityApi: ApiConfigSchema,
  xenoApi: ApiConfigSchema,
  buildFiles: z.object({
    velocityBuildFile: z.string(),
    xenoBuildFile: z.string(),
  }),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    if (!requireAuth(req, res)) return;
    try {
      const db = getDb();
      const rows = await db
        .select()
        .from(adminConfigTable)
        .where(eq(adminConfigTable.id, SINGLETON_ID))
        .limit(1);

      if (rows.length === 0) {
        res.json({ found: false, config: null });
        return;
      }

      const row = rows[0];
      res.json({
        found: true,
        config: {
          version: row.version,
          maintenance: row.maintenance,
          velocityApi: row.velocityApi,
          xenoApi: row.xenoApi,
          buildFiles: row.buildFiles,
        },
      });
    } catch (err) {
      res.status(500).json({ error: "Failed to load config", details: String(err) });
    }
    return;
  }

  if (req.method === "PUT") {
    if (!requireAuth(req, res)) return;
    const parsed = AdminConfigSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid config", details: parsed.error.flatten() });
      return;
    }

    const { version, maintenance, velocityApi, xenoApi, buildFiles } = parsed.data;

    try {
      const db = getDb();
      await db
        .insert(adminConfigTable)
        .values({
          id: SINGLETON_ID,
          version,
          maintenance,
          velocityApi: velocityApi as Record<string, unknown>,
          xenoApi: xenoApi as Record<string, unknown>,
          buildFiles: buildFiles as Record<string, unknown>,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: adminConfigTable.id,
          set: {
            version,
            maintenance,
            velocityApi: velocityApi as Record<string, unknown>,
            xenoApi: xenoApi as Record<string, unknown>,
            buildFiles: buildFiles as Record<string, unknown>,
            updatedAt: new Date(),
          },
        });

      res.json({ ok: true });
    } catch (err) {
      res.status(500).json({ error: "Failed to save config", details: String(err) });
    }
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}

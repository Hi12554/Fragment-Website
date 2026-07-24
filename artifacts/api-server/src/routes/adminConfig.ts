import { Router, type Request, type Response } from "express";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@workspace/db";
import { adminConfigTable, SINGLETON_ID } from "@workspace/db";
import { verifyToken, extractToken } from "../lib/auth";

const router = Router();

function requireAuth(req: Request, res: Response): boolean {
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

router.get("/admin/config", async (req, res) => {
  if (!requireAuth(req, res)) return;
  try {
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
});

router.put("/admin/config", async (req, res) => {
  if (!requireAuth(req, res)) return;
  const parsed = AdminConfigSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid config", details: parsed.error.flatten() });
    return;
  }

  const { version, maintenance, velocityApi, xenoApi, buildFiles } = parsed.data;

  try {
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
});

export default router;

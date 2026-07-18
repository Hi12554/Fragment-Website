import { Router, type IRouter } from "express";
import { db, adminConfigTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { requireAdminAuth, handleAdminLogin } from "../middlewares/adminAuth";

const router: IRouter = Router();

const SINGLETON_ID = "singleton";

// ── Zod schema for the admin config payload ──────────────────────────────────

const ApiConfigSchema = z.object({
  status: z.enum(["up", "down", "roblox_downgrade"]),
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

// ── Routes ────────────────────────────────────────────────────────────────────

// POST /api/admin/login — validate password, issue signed token
router.post("/admin/login", (req, res) => handleAdminLogin(req, res));

// GET /api/admin/config — fetch the persisted admin config
router.get("/admin/config", requireAdminAuth, async (_req, res) => {
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

// PUT /api/admin/config — validate and upsert the admin config
router.put("/admin/config", requireAdminAuth, async (req, res) => {
  const parsed = AdminConfigSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid config payload", details: parsed.error.flatten() });
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

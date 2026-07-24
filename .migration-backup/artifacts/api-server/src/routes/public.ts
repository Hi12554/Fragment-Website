import { Router, type IRouter } from "express";
import { db, adminConfigTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

const SINGLETON_ID = "singleton";

/**
 * GET /api/public/config — returns full site config without auth.
 * Used by all public-facing pages (Download, Status, Build, maintenance gate).
 */
router.get("/public/config", async (_req, res) => {
  try {
    const rows = await db
      .select()
      .from(adminConfigTable)
      .where(eq(adminConfigTable.id, SINGLETON_ID))
      .limit(1);

    if (rows.length === 0) {
      res.json({ found: false });
      return;
    }

    const row = rows[0];
    res.json({
      found: true,
      maintenance: row.maintenance,
      version: row.version,
      velocityApi: row.velocityApi,
      xenoApi: row.xenoApi,
      buildFiles: row.buildFiles,
    });
  } catch {
    res.json({ found: false, maintenance: false, version: null });
  }
});

export default router;

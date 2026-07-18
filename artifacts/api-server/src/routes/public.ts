import { Router, type IRouter } from "express";
import { db, adminConfigTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

const SINGLETON_ID = "singleton";

/**
 * GET /api/public/config — returns non-sensitive site config (no auth required).
 * Used by the frontend on every page load to check maintenance mode.
 */
router.get("/public/config", async (_req, res) => {
  try {
    const rows = await db
      .select({
        maintenance: adminConfigTable.maintenance,
        version: adminConfigTable.version,
      })
      .from(adminConfigTable)
      .where(eq(adminConfigTable.id, SINGLETON_ID))
      .limit(1);

    if (rows.length === 0) {
      res.json({ maintenance: false, version: null });
      return;
    }

    res.json({ maintenance: rows[0].maintenance, version: rows[0].version });
  } catch {
    // On DB error, default to non-maintenance so the site stays up
    res.json({ maintenance: false, version: null });
  }
});

export default router;

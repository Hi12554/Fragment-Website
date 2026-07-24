import { Router } from "express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { adminConfigTable, SINGLETON_ID } from "@workspace/db";

const router = Router();

router.get("/public/config", async (req, res) => {
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

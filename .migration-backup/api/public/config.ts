import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { getDb, adminConfigTable, SINGLETON_ID } from "../_lib/db";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const db = getDb();
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
}

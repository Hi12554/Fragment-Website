import type { VercelRequest, VercelResponse } from "@vercel/node";
import { eq } from "drizzle-orm";
import { getDb, adminConfigTable, SINGLETON_ID } from "../_lib/db";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const db = getDb();
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
    res.json({ maintenance: false, version: null });
  }
}

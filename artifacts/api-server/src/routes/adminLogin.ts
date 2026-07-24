import { Router } from "express";
import { timingSafeEqual } from "node:crypto";
import { signToken } from "../lib/auth";

const router = Router();

router.post("/admin/login", (req, res) => {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    res.status(503).json({ error: "Admin authentication is not configured." });
    return;
  }

  const { password } = (req.body ?? {}) as { password?: string };

  let match = false;
  try {
    const a = Buffer.from(adminPassword);
    const b = Buffer.from(password ?? "");
    match = a.length === b.length && timingSafeEqual(a, b);
  } catch {
    match = false;
  }

  if (!match) {
    res.status(401).json({ error: "Invalid password." });
    return;
  }

  const token = signToken(Date.now());
  res.json({ token });
});

export default router;

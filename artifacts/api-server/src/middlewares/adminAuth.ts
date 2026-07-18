import { Request, Response, NextFunction } from "express";
import { createHmac, timingSafeEqual } from "crypto";

const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

/**
 * Sign a payload with SESSION_SECRET using HMAC-SHA256.
 * Token format: base64url("<timestamp>.<sig>")
 */
function signToken(timestamp: number): string {
  const secret = process.env.SESSION_SECRET!;
  const payload = String(timestamp);
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return Buffer.from(`${payload}.${sig}`).toString("base64url");
}

function verifyToken(token: string): boolean {
  try {
    const secret = process.env.SESSION_SECRET;
    if (!secret) return false;
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const dotIdx = decoded.lastIndexOf(".");
    if (dotIdx === -1) return false;
    const timestamp = Number(decoded.slice(0, dotIdx));
    const sig = decoded.slice(dotIdx + 1);
    if (Number.isNaN(timestamp)) return false;
    // Check expiry
    if (Date.now() - timestamp > TOKEN_TTL_MS) return false;
    // Constant-time comparison
    const expected = createHmac("sha256", secret).update(String(timestamp)).digest("hex");
    const expectedBuf = Buffer.from(expected);
    const sigBuf = Buffer.from(sig);
    if (expectedBuf.length !== sigBuf.length) return false;
    return timingSafeEqual(expectedBuf, sigBuf);
  } catch {
    return false;
  }
}

/**
 * POST /api/admin/login — validates ADMIN_PASSWORD and issues a signed token.
 * Returns 503 when ADMIN_PASSWORD env var is not configured.
 */
export function handleAdminLogin(req: Request, res: Response): void {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    res.status(503).json({ error: "Admin authentication is not configured on this server." });
    return;
  }

  const { password } = req.body as { password?: string };

  // Constant-time comparison to prevent timing attacks
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
}

/**
 * Middleware that requires a valid signed admin token.
 * Returns 503 when SESSION_SECRET is not configured (fail closed).
 */
export function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  if (!process.env.SESSION_SECRET) {
    res.status(503).json({ error: "Server authentication is not configured." });
    return;
  }

  const auth = req.headers["authorization"] ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

  if (!token || !verifyToken(token)) {
    res.status(401).json({ error: "Unauthorized. Please log in via the admin panel." });
    return;
  }

  next();
}

import { createHmac, timingSafeEqual } from "node:crypto";

const TOKEN_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

export function signToken(timestamp: number): string {
  const secret = process.env.SESSION_SECRET!;
  const payload = String(timestamp);
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  return Buffer.from(`${payload}.${sig}`).toString("base64url");
}

export function verifyToken(token: string): boolean {
  try {
    const secret = process.env.SESSION_SECRET;
    if (!secret) return false;
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const dotIdx = decoded.lastIndexOf(".");
    if (dotIdx === -1) return false;
    const timestamp = Number(decoded.slice(0, dotIdx));
    const sig = decoded.slice(dotIdx + 1);
    if (Number.isNaN(timestamp)) return false;
    if (Date.now() - timestamp > TOKEN_TTL_MS) return false;
    const expected = createHmac("sha256", secret)
      .update(String(timestamp))
      .digest("hex");
    const expectedBuf = Buffer.from(expected);
    const sigBuf = Buffer.from(sig);
    if (expectedBuf.length !== sigBuf.length) return false;
    return timingSafeEqual(expectedBuf, sigBuf);
  } catch {
    return false;
  }
}

export function extractToken(
  headers: Record<string, string | string[] | undefined>,
): string {
  const auth = (headers["authorization"] as string) ?? "";
  return auth.startsWith("Bearer ") ? auth.slice(7) : "";
}

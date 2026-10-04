import { SignJWT, jwtVerify } from "jose";
export const AUTH_COOKIE = "sal_admin";
const secret = () => {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) throw new Error("AUTH_SECRET must be set (32+ chars)");
  return new TextEncoder().encode(s);
};
export const signToken = (sub: string) =>
  new SignJWT({}).setProtectedHeader({ alg: "HS256" }).setSubject(sub).setIssuedAt().setExpirationTime("7d").sign(secret());
export async function verifyToken(t?: string) {
  if (!t) return null;
  try { return (await jwtVerify(t, secret())).payload.sub ?? null; } catch { return null; }
}

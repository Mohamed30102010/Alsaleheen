import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { AUTH_COOKIE, signToken } from "@/lib/token";
import { ipOf, limited } from "@/lib/rate";

const body = z.object({ email: z.string().trim().toLowerCase().email().max(200), password: z.string().min(1).max(200) });
// valid dummy hash so timing is similar for unknown users
const DUMMY = "$2a$12$C6UzMDM.H6dfI/f/IKcEeO5nPBZyN0y1o0uQ0Kz0r6k0R1m3s7e9u";

export async function POST(req: Request) {
  if (limited(`login:${ipOf(req)}`, 8, 10 * 60_000)) return NextResponse.json({ error: "rate" }, { status: 429 });
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  try {
    const user = await prisma.adminUser.findUnique({ where: { email: parsed.data.email } });
    const ok = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? DUMMY);
    if (!user || !ok) return NextResponse.json({ error: "invalid" }, { status: 401 });
    const res = NextResponse.json({ ok: true });
    res.cookies.set(AUTH_COOKIE, await signToken(user.id), {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (e) {
    console.error("[login]", e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

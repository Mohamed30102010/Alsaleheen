import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { guard, getAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ipOf, limited } from "@/lib/rate";

const schema = z.object({
  currentPassword: z.string().min(1).max(200),
  newEmail: z.string().trim().toLowerCase().email().max(200).optional().or(z.literal("")),
  newPassword: z.string().min(10).max(200).optional().or(z.literal("")),
});

export async function PUT(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  if (limited(`account:${ipOf(req)}`, 6, 10 * 60_000)) return NextResponse.json({ error: "rate" }, { status: 429 });

  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "validation" }, { status: 400 });
  const { currentPassword, newEmail, newPassword } = p.data;
  if (!newEmail && !newPassword) return NextResponse.json({ error: "nothing" }, { status: 400 });

  try {
    const id = await getAdmin();
    const user = id ? await prisma.adminUser.findUnique({ where: { id } }) : null;
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    if (!(await bcrypt.compare(currentPassword, user.passwordHash)))
      return NextResponse.json({ error: "wrong_password" }, { status: 403 });

    const data: { email?: string; passwordHash?: string } = {};
    if (newEmail) data.email = newEmail;
    if (newPassword) data.passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.adminUser.update({ where: { id: user.id }, data });
    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    if (typeof e === "object" && e && (e as { code?: string }).code === "P2002")
      return NextResponse.json({ error: "email_taken" }, { status: 409 });
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

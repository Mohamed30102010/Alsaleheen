import { NextResponse } from "next/server";
import { guard } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { RESOURCES, refresh } from "@/lib/admin-resources";

type P = { params: { resource: string; id: string } };

export async function PUT(req: Request, { params }: P) {
  const denied = await guard(req);
  if (denied) return denied;
  const cfg = RESOURCES[params.resource];
  if (!cfg) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const parsed = cfg.schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "validation", issues: parsed.error.issues.map((i) => i.path.join(".")) }, { status: 400 });
  try {
    const row = await (prisma as any)[cfg.model].update({ where: { id: params.id }, data: parsed.data });
    refresh();
    return NextResponse.json(row);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: P) {
  const denied = await guard(req);
  if (denied) return denied;
  const cfg = RESOURCES[params.resource];
  if (!cfg) return NextResponse.json({ error: "not_found" }, { status: 404 });
  try {
    await (prisma as any)[cfg.model].delete({ where: { id: params.id } });
    refresh();
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { guard } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { RESOURCES, refresh } from "@/lib/admin-resources";

export async function GET(req: Request, { params }: { params: { resource: string } }) {
  const denied = await guard(req);
  if (denied) return denied;
  const cfg = RESOURCES[params.resource];
  if (!cfg) return NextResponse.json({ error: "not_found" }, { status: 404 });
  try {
    const rows = await (prisma as any)[cfg.model].findMany({ orderBy: cfg.orderBy });
    return NextResponse.json(rows);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { resource: string } }) {
  const denied = await guard(req);
  if (denied) return denied;
  const cfg = RESOURCES[params.resource];
  if (!cfg) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const parsed = cfg.schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "validation", issues: parsed.error.issues.map((i) => i.path.join(".")) }, { status: 400 });
  try {
    const row = await (prisma as any)[cfg.model].create({ data: parsed.data });
    refresh();
    return NextResponse.json(row);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

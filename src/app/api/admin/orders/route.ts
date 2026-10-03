import { NextResponse } from "next/server";
import { guard } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  try {
    const rows = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 100, include: { items: true, customer: true } });
    return NextResponse.json(rows);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

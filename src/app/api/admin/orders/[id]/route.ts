import { NextResponse } from "next/server";
import { z } from "zod";
import { guard } from "@/lib/auth";
import { prisma } from "@/lib/db";

const body = z.object({ status: z.enum(["PENDING", "CONFIRMED", "PREPARING", "READY", "OUT_FOR_DELIVERY", "COMPLETED", "CANCELLED"]) });

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const denied = await guard(req);
  if (denied) return denied;
  const p = body.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "validation" }, { status: 400 });
  try {
    const row = await prisma.order.update({ where: { id: params.id }, data: { status: p.data.status } });
    return NextResponse.json(row);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

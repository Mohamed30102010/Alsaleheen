import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { ipOf, limited } from "@/lib/rate";
import type { Extra } from "@/lib/types";

const schema = z.object({
  customerName: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(/^[0-9+\s-]{8,16}$/),
  type: z.enum(["DELIVERY", "PICKUP"]),
  address: z.string().trim().max(300).optional(),
  notes: z.string().trim().max(500).optional(),
  locale: z.enum(["ar", "en"]).default("ar"),
  website: z.string().max(0).optional(), // honeypot
  items: z.array(z.object({
    itemId: z.string().min(1).max(60),
    qty: z.number().int().min(1).max(50),
    extraIds: z.array(z.string().max(60)).max(20).default([]),
  })).min(1).max(60),
});
const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function POST(req: Request) {
  if (limited(`order:${ipOf(req)}`, 6, 10 * 60_000)) return fail("rate", 429);
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail("validation");
  const d = parsed.data;
  if (d.type === "DELIVERY" && (!d.address || d.address.length < 6)) return fail("validation");

  try {
    const [s, dbItems] = await Promise.all([
      prisma.settings.findUnique({ where: { id: 1 } }),
      prisma.menuItem.findMany({ where: { id: { in: d.items.map((i) => i.itemId) } }, include: { category: true } }),
    ]);
    if (d.type === "DELIVERY" && s && !s.deliveryEnabled) return fail("delivery_off");
    if (d.type === "PICKUP" && s && !s.pickupEnabled) return fail("pickup_off");

    const byId = new Map(dbItems.map((i) => [i.id, i]));
    let subtotal = 0;
    const lines = [];
    for (const l of d.items) {
      const it = byId.get(l.itemId);
      if (!it || !it.available || !it.category.active) return fail("unavailable", 409);
      const all = (it.extras as unknown as Extra[]) ?? [];
      const chosen = l.extraIds.map((id) => all.find((e) => e.id === id));
      if (chosen.some((e) => !e)) return fail("unavailable", 409);
      const extras = chosen as Extra[];
      const unitPrice = it.price + extras.reduce((a, e) => a + e.price, 0);
      subtotal += unitPrice * l.qty;
      lines.push({ menuItemId: it.id, nameAr: it.nameAr, nameEn: it.nameEn, unitPrice, qty: l.qty, extras });
    }
    if (s && subtotal < s.minOrder) return fail("min_order");
    const deliveryFee = d.type === "DELIVERY" ? s?.deliveryFee ?? 0 : 0;

    const customer = await prisma.customer.upsert({
      where: { phone: d.phone.replace(/\s/g, "") },
      update: { name: d.customerName },
      create: { name: d.customerName, phone: d.phone.replace(/\s/g, "") },
    });
    const order = await prisma.order.create({
      data: {
        customerId: customer.id, type: d.type, address: d.type === "DELIVERY" ? d.address : null, notes: d.notes || null,
        subtotal, deliveryFee, total: subtotal + deliveryFee, locale: d.locale,
        items: { create: lines.map((l) => ({ ...l, extras: l.extras as object[] })) },
      },
    });
    revalidatePath("/admin");
    return NextResponse.json({ number: order.number, subtotal, deliveryFee, total: order.total });
  } catch (e) {
    console.error("[orders]", e);
    return fail("server", 500);
  }
}

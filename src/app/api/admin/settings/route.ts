import { NextResponse } from "next/server";
import { z } from "zod";
import { guard } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { defaultSettings } from "@/lib/defaults";
import { img, refresh } from "@/lib/admin-resources";

const s = (n: number) => z.string().trim().max(n).default("");
const url = z.string().trim().max(300).default("").refine((v) => v === "" || /^https?:\/\//.test(v), "url");
const schema = z.object({
  nameAr: z.string().trim().min(1).max(80), nameEn: s(80), taglineAr: s(160), taglineEn: s(160), descAr: s(800), descEn: s(800),
  phone: z.string().trim().max(30).default("").refine((v) => v === "" || /^[0-9+\s-]{6,20}$/.test(v), "phone"),
  whatsapp: z.string().trim().max(20).default("").refine((v) => v === "" || /^[0-9]{8,15}$/.test(v), "whatsapp (digits only, with country code)"),
  addressAr: s(300), addressEn: s(300), mapEmbedUrl: url, mapsLink: url,
  lat: z.coerce.number().min(-90).max(90).nullish().transform((v) => v ?? null),
  lng: z.coerce.number().min(-180).max(180).nullish().transform((v) => v ?? null),
  hoursAr: s(300), hoursEn: s(300), openingSpec: s(120), facebook: url, instagram: url, tiktok: url,
  logoUrl: img.transform((v) => v ?? ""), heroImageUrl: img.transform((v) => v ?? ""),
  storyJson: z.array(z.object({
    titleAr: z.string().max(60), titleEn: z.string().max(60), textAr: z.string().max(400), textEn: z.string().max(400), imageUrl: z.string().max(500).optional(),
  })).max(8),
  deliveryEnabled: z.boolean(), pickupEnabled: z.boolean(),
  deliveryFee: z.coerce.number().int().min(0).max(10000), minOrder: z.coerce.number().int().min(0).max(100000), isDemo: z.boolean(),
});

export async function GET(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  try {
    const row = await prisma.settings.findUnique({ where: { id: 1 } });
    return NextResponse.json(row ?? defaultSettings);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  const p = schema.safeParse(await req.json().catch(() => null));
  if (!p.success) return NextResponse.json({ error: "validation", issues: p.error.issues.map((i) => i.path.join(".")) }, { status: 400 });
  try {
    const data = { ...p.data, storyJson: p.data.storyJson as object[] };
    const row = await prisma.settings.upsert({ where: { id: 1 }, update: data, create: { id: 1, ...data } });
    refresh();
    return NextResponse.json(row);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

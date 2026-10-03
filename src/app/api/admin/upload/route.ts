import { NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { guard } from "@/lib/auth";

const OK = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const MAX = 5 * 1024 * 1024;

export async function POST(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  if (!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ error: "storage_not_configured" }, { status: 503 });
  const file = (await req.formData().catch(() => null))?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "no_file" }, { status: 400 });
  if (!OK.has(file.type)) return NextResponse.json({ error: "bad_type" }, { status: 415 });
  if (file.size > MAX) return NextResponse.json({ error: "too_large" }, { status: 413 });
  try {
    const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").slice(-60) || "image";
    const blob = await put(`alsaleheen/${Date.now()}-${safe}`, file, { access: "public", addRandomSuffix: true });
    return NextResponse.json({ url: blob.url });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const denied = await guard(req);
  if (denied) return denied;
  const url = new URL(req.url).searchParams.get("url") ?? "";
  if (!/^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//.test(url)) return NextResponse.json({ ok: true });
  try {
    await del(url);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
}

"use client";
import { useRef, useState } from "react";

export default function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function upload(file: File) {
    setBusy(true); setErr("");
    try {
      const fd = new FormData(); fd.append("file", file);
      const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { setErr(({ storage_not_configured: "التخزين غير مُفعّل (BLOB_READ_WRITE_TOKEN).", bad_type: "نوع الملف غير مدعوم.", too_large: "الحجم أكبر من 5MB." } as Record<string, string>)[d.error] ?? "فشل الرفع."); return; }
      const old = value;
      onChange(d.url);
      if (old) fetch(`/api/admin/upload?url=${encodeURIComponent(old)}`, { method: "DELETE" }).catch(() => {});
    } catch { setErr("تعذر الاتصال."); } finally { setBusy(false); }
  }
  return (
    <div style={{ display: "grid", gap: 8 }}>
      {value && /* eslint-disable-next-line @next/next/no-img-element */ <img src={value} alt="" style={{ width: 120, height: 90, objectFit: "cover", borderRadius: 10 }} />}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" className={`btn btn-line sm ${busy ? "loading" : ""}`} disabled={busy} onClick={() => ref.current?.click()}>{value ? "استبدال الصورة" : "رفع صورة"}</button>
        {value && <button type="button" className="btn btn-line sm" onClick={() => { fetch(`/api/admin/upload?url=${encodeURIComponent(value)}`, { method: "DELETE" }).catch(() => {}); onChange(""); }}>حذف</button>}
      </div>
      <input ref={ref} type="file" accept="image/jpeg,image/png,image/webp,image/avif" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} />
      <input className="input" dir="ltr" placeholder="https://…" value={value} onChange={(e) => onChange(e.target.value)} aria-label="رابط الصورة" />
      {err && <span className="err" role="alert">{err}</span>}
    </div>
  );
}

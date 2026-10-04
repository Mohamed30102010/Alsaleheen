"use client";
import { useEffect, useState } from "react";
import ImageField from "./ImageField";

type S = Record<string, any>;
const F: [string, string, "text" | "area" | "num" | "bool" | "img" | "json"][] = [
  ["nameAr", "اسم المطعم (عربي)", "text"], ["nameEn", "اسم المطعم (English)", "text"], ["taglineAr", "العبارة التعريفية (عربي)", "text"], ["taglineEn", "Tagline (English)", "text"],
  ["descAr", "وصف المطعم (عربي)", "area"], ["descEn", "Description (English)", "area"],
  ["logoUrl", "الشعار", "img"], ["heroImageUrl", "صورة الواجهة الرئيسية (Hero)", "img"],
  ["phone", "رقم الهاتف", "text"], ["whatsapp", "رقم واتساب (أرقام فقط مع كود الدولة، مثال 2010…)", "text"],
  ["addressAr", "العنوان (عربي)", "area"], ["addressEn", "Address (English)", "area"],
  ["hoursAr", "مواعيد العمل (عربي)", "area"], ["hoursEn", "Opening hours (English)", "area"], ["openingSpec", "مواعيد العمل لمحركات البحث (مثال: Mo-Su 12:00-24:00)", "text"],
  ["lat", "خط العرض Latitude (اختياري)", "text"], ["lng", "خط الطول Longitude (اختياري)", "text"], ["mapsLink", "رابط الاتجاهات على Google Maps (اختياري)", "text"], ["mapEmbedUrl", "رابط تضمين الخريطة Embed (اختياري)", "text"],
  ["facebook", "فيسبوك", "text"], ["instagram", "إنستجرام", "text"], ["tiktok", "تيك توك", "text"],
  ["deliveryEnabled", "تفعيل التوصيل", "bool"], ["pickupEnabled", "تفعيل الاستلام من المطعم", "bool"], ["deliveryFee", "رسوم التوصيل (ج.م)", "num"], ["minOrder", "الحد الأدنى للطلب (ج.م)", "num"],
  ["storyJson", "حكاية المطعم (JSON: titleAr,titleEn,textAr,textEn,imageUrl)", "json"],
  ["isDemo", "إظهار تنبيه 'محتوى تجريبي' في الموقع", "bool"],
];

export default function SettingsForm() {
  const [s, setS] = useState<S | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then((d) => setS({ ...d, storyJson: JSON.stringify(d.storyJson ?? [], null, 2), lat: d.lat ?? "", lng: d.lng ?? "" })).catch(() => setMsg("تعذر تحميل الإعدادات."));
  }, []);
  async function save() {
    if (!s) return;
    let story: unknown;
    try { story = JSON.parse(s.storyJson); } catch { setMsg("صيغة JSON في حقل الحكاية غير صحيحة."); return; }
    setBusy(true); setMsg("");
    const body = { ...s, storyJson: story, lat: s.lat === "" ? null : Number(s.lat), lng: s.lng === "" ? null : Number(s.lng) };
    delete body.id; delete body.updatedAt;
    try {
      const r = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const d = await r.json().catch(() => ({}));
      setMsg(r.ok ? "✓ تم الحفظ" : d.error === "validation" ? `بيانات غير صحيحة: ${(d.issues ?? []).join(", ")}` : "فشل الحفظ.");
    } catch { setMsg("تعذر الاتصال."); } finally { setBusy(false); }
  }
  if (!s) return msg ? <p className="err">{msg}</p> : <div className="skel" style={{ height: 120 }} />;
  return (
    <div className="card">
      <h2 style={{ fontSize: "1.3rem", marginBottom: 14 }}>إعدادات المطعم</h2>
      <div className="a-form">
        {F.map(([k, label, t]) => (
          <div key={k} className={`field ${["area", "img", "json"].includes(t) ? "full" : ""}`}>
            {t === "bool" ? <label className="opt"><input type="checkbox" checked={!!s[k]} onChange={(e) => setS({ ...s, [k]: e.target.checked })} /><span>{label}</span></label> : (
              <>
                <label htmlFor={`s-${k}`}>{label}</label>
                {t === "img" ? <ImageField value={s[k] ?? ""} onChange={(v) => setS({ ...s, [k]: v })} /> :
                  t === "area" || t === "json" ? <textarea id={`s-${k}`} className="input" dir={t === "json" ? "ltr" : undefined} style={t === "json" ? { minHeight: 220, fontFamily: "monospace" } : undefined} value={s[k] ?? ""} onChange={(e) => setS({ ...s, [k]: e.target.value })} /> :
                  <input id={`s-${k}`} className="input" type={t === "num" ? "number" : "text"} value={s[k] ?? ""} onChange={(e) => setS({ ...s, [k]: e.target.value })} />}
              </>
            )}
          </div>
        ))}
      </div>
      {msg && <p role="status" className={msg.startsWith("✓") ? "" : "err"} style={{ marginTop: 10 }}>{msg}</p>}
      <button className={`btn btn-primary ${busy ? "loading" : ""}`} style={{ marginTop: 12 }} disabled={busy} onClick={save}>حفظ الإعدادات</button>
    </div>
  );
}

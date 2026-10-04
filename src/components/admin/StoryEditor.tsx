"use client";
import ImageField from "./ImageField";

type Step = { titleAr: string; titleEn: string; textAr: string; textEn: string; imageUrl?: string };

export default function StoryEditor({ value, onChange }: { value: Step[]; onChange: (v: Step[]) => void }) {
  const set = (i: number, k: keyof Step, v: string) => onChange(value.map((s, n) => (n === i ? { ...s, [k]: v } : s)));
  return (
    <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
      <h3 style={{ fontSize: "1.1rem" }}>حكاية المطعم</h3>
      {value.map((s, i) => (
        <div className="card" key={i}>
          <div className="a-row" style={{ marginBottom: 10 }}>
            <b>الخانة {i + 1}</b>
            <button type="button" className="btn btn-danger sm" onClick={() => onChange(value.filter((_, n) => n !== i))}>حذف الخانة</button>
          </div>
          <div className="a-form">
            <div className="field"><label>العنوان (عربي)</label><input className="input" value={s.titleAr} onChange={(e) => set(i, "titleAr", e.target.value)} /></div>
            <div className="field"><label>Title (English)</label><input className="input" value={s.titleEn} onChange={(e) => set(i, "titleEn", e.target.value)} /></div>
            <div className="field"><label>النص (عربي)</label><textarea className="input" value={s.textAr} onChange={(e) => set(i, "textAr", e.target.value)} /></div>
            <div className="field"><label>Text (English)</label><textarea className="input" value={s.textEn} onChange={(e) => set(i, "textEn", e.target.value)} /></div>
            <div className="field full"><label>الصورة</label><ImageField value={s.imageUrl ?? ""} onChange={(v) => set(i, "imageUrl", v)} /></div>
          </div>
        </div>
      ))}
      {value.length < 8 && (
        <button type="button" className="btn btn-line sm" style={{ justifySelf: "start" }} onClick={() => onChange([...value, { titleAr: "", titleEn: "", textAr: "", textEn: "", imageUrl: "" }])}>+ إضافة خانة</button>
      )}
    </div>
  );
               }

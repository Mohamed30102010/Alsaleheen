"use client";
import { useCallback, useEffect, useState } from "react";
import ImageField from "./ImageField";

export type Field = { k: string; label: string; t: "text" | "area" | "num" | "bool" | "img" | "cat" | "extras" | "tags" | "json"; full?: boolean; def?: unknown };
type Row = Record<string, any>;

const toExtras = (txt: string) => txt.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => { const [nameAr, nameEn = "", price = "0"] = l.split("|").map((x) => x.trim()); return { nameAr, nameEn, price: Number(price) || 0 }; });
const fromExtras = (a: any[]) => (a ?? []).map((e) => `${e.nameAr} | ${e.nameEn} | ${e.price}`).join("\n");

export default function Crud({ resource, fields, title, cats, titleOf }: { resource: string; fields: Field[]; title: string; cats?: Row[]; titleOf: (r: Row) => string }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [edit, setEdit] = useState<Row | null>(null); // draft; id undefined => new
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try { const r = await fetch(`/api/admin/${resource}`); if (!r.ok) throw 0; setRows(await r.json()); setErr(""); } catch { setErr("تعذر تحميل البيانات."); setRows([]); }
  }, [resource]);
  useEffect(() => { load(); }, [load]);

  function blank(): Row {
    const o: Row = {};
    for (const f of fields) o[f.k] = f.def ?? (f.t === "bool" ? false : f.t === "num" ? 0 : f.t === "cat" ? cats?.[0]?.id ?? "" : f.t === "extras" ? "" : f.t === "tags" ? "" : "");
    return o;
  }
  function open(r?: Row) {
    if (!r) return setEdit(blank());
    const d: Row = { id: r.id };
    for (const f of fields) d[f.k] = f.t === "extras" ? fromExtras(r[f.k]) : f.t === "tags" ? (r[f.k] ?? []).join(", ") : r[f.k] ?? "";
    setEdit(d);
  }
  async function save() {
    if (!edit) return;
    setBusy(true); setErr("");
    const body: Row = {};
    for (const f of fields) {
      const v = edit[f.k];
      body[f.k] = f.t === "extras" ? toExtras(v) : f.t === "tags" ? String(v).split(",").map((x) => x.trim()).filter(Boolean) : f.t === "num" ? Number(v) : v;
    }
    try {
      const r = await fetch(edit.id ? `/api/admin/${resource}/${edit.id}` : `/api/admin/${resource}`, { method: edit.id ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!r.ok) { const d = await r.json().catch(() => ({})); setErr(d.error === "validation" ? `بيانات غير صحيحة: ${(d.issues ?? []).join(", ")}` : "فشل الحفظ."); return; }
      setEdit(null); await load();
    } catch { setErr("تعذر الاتصال."); } finally { setBusy(false); }
  }
  async function del(r: Row) {
    if (!confirm(`حذف "${titleOf(r)}"؟`)) return;
    const r2 = await fetch(`/api/admin/${resource}/${r.id}`, { method: "DELETE" });
    if (!r2.ok) setErr("فشل الحذف."); else load();
  }
  async function toggle(r: Row, k: string) {
    const body: Row = { ...r }; delete body.id; delete body.createdAt; body[k] = !r[k];
    const x = await fetch(`/api/admin/${resource}/${r.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!x.ok) setErr("فشل التحديث."); else load();
  }

  if (edit)
    return (
      <div className="card">
        <h2 style={{ fontSize: "1.2rem", marginBottom: 14 }}>{edit.id ? "تعديل" : "إضافة"} · {title}</h2>
        <div className="a-form">
          {fields.map((f) => (
            <div key={f.k} className={`field ${f.full || ["area", "img", "extras", "json"].includes(f.t) ? "full" : ""}`}>
              {f.t === "bool" ? (
                <label className="opt"><input type="checkbox" checked={!!edit[f.k]} onChange={(e) => setEdit({ ...edit, [f.k]: e.target.checked })} /><span>{f.label}</span></label>
              ) : (
                <>
                  <label htmlFor={`f-${f.k}`}>{f.label}{f.t === "extras" && " (سطر لكل إضافة: عربي | English | سعر)"}{f.t === "tags" && " (مفصولة بفاصلة)"}</label>
                  {f.t === "img" ? <ImageField value={edit[f.k] ?? ""} onChange={(v) => setEdit({ ...edit, [f.k]: v })} /> :
                    f.t === "cat" ? <select id={`f-${f.k}`} className="input" value={edit[f.k]} onChange={(e) => setEdit({ ...edit, [f.k]: e.target.value })}>{cats?.map((c) => <option key={c.id} value={c.id}>{c.nameAr}</option>)}</select> :
                    f.t === "area" || f.t === "extras" ? <textarea id={`f-${f.k}`} className="input" value={edit[f.k]} onChange={(e) => setEdit({ ...edit, [f.k]: e.target.value })} /> :
                    <input id={`f-${f.k}`} className="input" type={f.t === "num" ? "number" : "text"} inputMode={f.t === "num" ? "numeric" : undefined} value={edit[f.k]} onChange={(e) => setEdit({ ...edit, [f.k]: e.target.value })} />}
                </>
              )}
            </div>
          ))}
        </div>
        {err && <p className="err" role="alert">{err}</p>}
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button className={`btn btn-primary ${busy ? "loading" : ""}`} disabled={busy} onClick={save}>حفظ</button>
          <button className="btn btn-line" onClick={() => { setEdit(null); setErr(""); }}>إلغاء</button>
        </div>
      </div>
    );

  return (
    <div>
      <div className="a-row" style={{ marginBottom: 12 }}><h2 style={{ fontSize: "1.3rem" }}>{title}</h2><button className="btn btn-primary sm" onClick={() => open()}>+ إضافة</button></div>
      {err && <p className="err" role="alert">{err}</p>}
      {rows === null && <div className="skel" style={{ height: 80 }} />}
      {rows?.length === 0 && <p className="card">لا توجد عناصر بعد.</p>}
      {rows?.map((r) => (
        <div className="card a-row" key={r.id}>
          <div><b>{titleOf(r)}</b>{r.price != null && <small> · {r.price} ج.م</small>}
            <div>{"available" in r && <button className={`pill ${r.available ? "good" : "bad"}`} onClick={() => toggle(r, "available")}>{r.available ? "متاح" : "غير متاح"}</button>}{" "}
              {"featured" in r && <button className={`pill ${r.featured ? "warn" : ""}`} onClick={() => toggle(r, "featured")}>{r.featured ? "★ مميز" : "☆ مميز"}</button>}
              {"active" in r && <button className={`pill ${r.active ? "good" : "bad"}`} onClick={() => toggle(r, "active")}>{r.active ? "ظاهر" : "مخفي"}</button>}
              {"visible" in r && <button className={`pill ${r.visible ? "good" : "bad"}`} onClick={() => toggle(r, "visible")}>{r.visible ? "ظاهر" : "مخفي"}</button>}</div></div>
          <div style={{ display: "flex", gap: 8 }}><button className="btn btn-line sm" onClick={() => open(r)}>تعديل</button><button className="btn btn-danger sm" onClick={() => del(r)}>حذف</button></div>
        </div>
      ))}
    </div>
  );
}

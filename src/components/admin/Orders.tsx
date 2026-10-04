"use client";
import { useCallback, useEffect, useState } from "react";

const ST: [string, string][] = [["PENDING", "قيد المراجعة"], ["CONFIRMED", "تم التأكيد"], ["PREPARING", "جاري التحضير"], ["READY", "جاهز"], ["OUT_FOR_DELIVERY", "في الطريق"], ["COMPLETED", "مكتمل"], ["CANCELLED", "ملغي"]];

export default function Orders() {
  const [rows, setRows] = useState<any[] | null>(null);
  const [err, setErr] = useState("");
  const load = useCallback(async () => {
    try { const r = await fetch("/api/admin/orders"); if (!r.ok) throw 0; setRows(await r.json()); setErr(""); } catch { setErr("تعذر تحميل الطلبات."); setRows([]); }
  }, []);
  useEffect(() => { load(); const i = setInterval(load, 30000); return () => clearInterval(i); }, [load]);
  async function setStatus(id: string, status: string) {
    const r = await fetch(`/api/admin/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    if (!r.ok) setErr("فشل تحديث الحالة."); else load();
  }
  return (
    <div>
      <div className="a-row" style={{ marginBottom: 12 }}><h2 style={{ fontSize: "1.3rem" }}>الطلبات</h2><button className="btn btn-line sm" onClick={load}>تحديث</button></div>
      {err && <p className="err" role="alert">{err}</p>}
      {rows === null && <div className="skel" style={{ height: 90 }} />}
      {rows?.length === 0 && !err && <p className="card">لا توجد طلبات بعد.</p>}
      {rows?.map((o) => (
        <details className="card" key={o.id} open={o.status === "PENDING"}>
          <summary className="a-row" style={{ cursor: "pointer" }}>
            <span><b>#{o.number}</b> · {o.customer.name} · {o.total} ج.م <small>· {o.type === "DELIVERY" ? "توصيل" : "استلام"} · {new Date(o.createdAt).toLocaleString("ar-EG")}</small></span>
            <span className={`pill ${o.status === "PENDING" ? "warn" : o.status === "CANCELLED" ? "bad" : "good"}`}>{ST.find((s) => s[0] === o.status)?.[1]}</span>
          </summary>
          <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
            <p dir="ltr" style={{ textAlign: "end" }}><a href={`tel:${o.customer.phone}`}>{o.customer.phone}</a></p>
            {o.address && <p>العنوان: {o.address}</p>}{o.notes && <p>ملاحظات: {o.notes}</p>}
            {o.items.map((i: any) => <p key={i.id}>{i.qty}× {i.nameAr}{i.extras?.length > 0 && ` (${i.extras.map((e: any) => e.nameAr).join("، ")})`} — {i.qty * i.unitPrice} ج.م</p>)}
            {o.deliveryFee > 0 && <p>رسوم التوصيل: {o.deliveryFee} ج.م</p>}
            <label className="field" style={{ maxWidth: 260, marginTop: 6 }}><span>الحالة</span>
              <select className="input" value={o.status} onChange={(e) => setStatus(o.id, e.target.value)}>{ST.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
          </div>
        </details>
      ))}
    </div>
  );
}

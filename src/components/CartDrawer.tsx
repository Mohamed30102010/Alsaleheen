"use client";
import { useState } from "react";
import { useShop, type Line } from "./CartProvider";
import { getDict } from "@/lib/i18n";
import { fmt, pick } from "@/lib/types";
import { track } from "@/lib/analytics";

type Done = { number: number; total: number; deliveryFee: number; subtotal: number; lines: Line[]; type: string; name: string; phone: string; address: string; notes: string };

export default function CartDrawer() {
  const { locale, settings: s, lines, subtotal, drawer, setDrawer, setQty, clear, toast } = useShop();
  const t = getDict(locale);
  const canD = s.deliveryEnabled, canP = s.pickupEnabled;
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [type, setType] = useState<"DELIVERY" | "PICKUP">(canD ? "DELIVERY" : "PICKUP");
  const [f, setF] = useState({ name: "", phone: "", address: "", notes: "", website: "" });
  const [bad, setBad] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<Done | null>(null);
  const fee = type === "DELIVERY" ? s.deliveryFee : 0;
  const total = subtotal + fee;
  const nm = (l: { nameAr: string; nameEn: string }) => pick(locale, l.nameAr, l.nameEn);

  function validate() {
    const b: string[] = [];
    if (f.name.trim().length < 2) b.push("name");
    if (!/^[0-9+\s-]{8,16}$/.test(f.phone.trim())) b.push("phone");
    if (type === "DELIVERY" && f.address.trim().length < 6) b.push("address");
    setBad(b);
    return b.length === 0;
  }
  function close() { setDrawer(false); if (done) { setDone(null); setStep(1); } }

  async function submit() {
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: f.name, phone: f.phone, type, address: f.address || undefined, notes: f.notes || undefined, locale, website: f.website || undefined,
          items: lines.map((l) => ({ itemId: l.itemId, qty: l.qty, extraIds: l.extras.map((e) => e.id) })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setError((t.err as Record<string, string>)[data.error] ?? t.err.server); return; }
      track("order_placed", { total: data.total });
      setDone({ ...data, lines, type, name: f.name, phone: f.phone, address: f.address, notes: f.notes });
      clear();
    } catch { setError(t.err.network); } finally { setBusy(false); }
  }

  function waLink(d: Done) {
    const o = t.order;
    const rows = d.lines.map((l) => `• ${l.qty}× ${nm(l)}${l.extras.length ? ` (${l.extras.map(nm).join("، ")})` : ""} — ${fmt(l.qty * l.unit, locale)}`);
    const text = [`*${o.whatsapp} #${d.number}*`, `${o.customer}: ${d.name}`, `${o.phone}: ${d.phone}`, `${o.type}: ${d.type === "DELIVERY" ? t.form.delivery : t.form.pickup}`, "", `${o.items}:`, ...rows, "", `${o.total}: ${fmt(d.total, locale)}`, d.address ? `${o.address}: ${d.address}` : null, d.notes ? `${o.notes}: ${d.notes}` : null].filter((x) => typeof x === "string").join("\n");
    return `https://wa.me/${s.whatsapp}?text=${encodeURIComponent(text)}`;
  }

  const Err = ({ k }: { k: string }) => (bad.includes(k) ? <span className="err" role="alert">{t.form.fix}</span> : null);
  const empty = lines.length === 0 && !done;

  return (
    <>
      <div className={`scrim ${drawer ? "open" : ""}`} onClick={close} />
      <aside className={`drawer ${drawer ? "open" : ""}`} role="dialog" aria-modal="true" aria-label={t.cart.title} aria-hidden={!drawer}>
        <div className="d-head">
          <h2 style={{ fontSize: "1.3rem" }}>{done ? t.done.title : t.cart.title}</h2>
          <button className="icon-btn" onClick={close} aria-label={t.modal.close}><svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M6 6l12 12M18 6 6 18" /></svg></button>
        </div>
        <div className="d-body">
          {done ? (
            <div className="center">
              <div className="ok-badge"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 5 5 9-10" /></svg></div>
              <p>{t.done.no}</p><p style={{ fontSize: "2.2rem", fontWeight: 800 }}>#{done.number}</p>
              <p style={{ margin: "6px 0 18px" }}>{t.done.status}: <span className="pill warn">{t.done.pending}</span></p>
              <div style={{ textAlign: "start" }}>
                {done.lines.map((l) => <div className="sum" key={l.key}><span>{l.qty}× {nm(l)}</span><span>{fmt(l.qty * l.unit, locale)}</span></div>)}
                {done.deliveryFee > 0 && <div className="sum"><span>{t.cart.delivery}</span><span>{fmt(done.deliveryFee, locale)}</span></div>}
                <div className="sum t" style={{ marginTop: 8 }}><span>{t.cart.total}</span><span>{fmt(done.total, locale)}</span></div>
              </div>
              <div style={{ display: "grid", gap: 10, marginTop: 22 }}>
                {s.whatsapp && <a className="btn btn-dark" href={waLink(done)} target="_blank" rel="noopener" onClick={() => track("whatsapp_click")}>{t.done.wa}</a>}
                {s.phone && <a className="btn btn-line" href={`tel:${s.phone.replace(/\s/g, "")}`}>{t.done.call}</a>}
              </div>
            </div>
          ) : empty ? (
            <div className="center" style={{ padding: "48px 0" }}>
              <p style={{ fontSize: "1.2rem", fontWeight: 700 }}>{t.cart.empty}</p>
              <p style={{ color: "var(--muted)", margin: "6px 0 18px" }}>{t.cart.emptySub}</p>
              <a href="#menu" className="btn btn-primary" onClick={close}>{t.cart.browse}</a>
            </div>
          ) : (
            <>
              <div className="steps" aria-hidden="true"><span className={step === 1 ? "on" : ""}>1 · {t.cart.step1}</span><span className={step === 2 ? "on" : ""}>2 · {t.cart.step2}</span><span className={step === 3 ? "on" : ""}>3 · {t.cart.step3}</span></div>
              {step === 1 && lines.map((l) => (
                <div className="line" key={l.key}>
                  <div style={{ flex: 1 }}>
                    <div className="nm">{nm(l)}</div>
                    {l.extras.length > 0 && <small>{l.extras.map(nm).join("، ")}</small>}
                    <span className="price">{fmt(l.unit * l.qty, locale)}</span>
                  </div>
                  <div className="qty" role="group">
                    <button onClick={() => setQty(l.key, l.qty - 1)} aria-label={l.qty === 1 ? t.cart.remove : t.cart.dec}>{l.qty === 1 ? "🗑" : "−"}</button><output>{l.qty}</output>
                    <button onClick={() => setQty(l.key, l.qty + 1)} aria-label={t.cart.inc}>+</button>
                  </div>
                </div>
              ))}
              {step === 2 && (
                <div style={{ marginTop: 16 }}>
                  <div className="field"><span style={{ fontWeight: 600, fontSize: ".9rem" }}>{t.form.type}</span>
                    <div className="seg">
                      {canD && <button type="button" aria-pressed={type === "DELIVERY"} onClick={() => setType("DELIVERY")}>{t.form.delivery}</button>}
                      {canP && <button type="button" aria-pressed={type === "PICKUP"} onClick={() => setType("PICKUP")}>{t.form.pickup}</button>}
                    </div></div>
                  <div className="field"><label htmlFor="f-name">{t.form.name}</label><input id="f-name" className="input" autoComplete="name" value={f.name} aria-invalid={bad.includes("name")} onChange={(e) => setF({ ...f, name: e.target.value })} /><Err k="name" /></div>
                  <div className="field"><label htmlFor="f-phone">{t.form.phone}</label><input id="f-phone" className="input" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" value={f.phone} aria-invalid={bad.includes("phone")} onChange={(e) => setF({ ...f, phone: e.target.value })} /><Err k="phone" /></div>
                  {type === "DELIVERY" && <div className="field"><label htmlFor="f-addr">{t.form.address}</label><textarea id="f-addr" className="input" autoComplete="street-address" value={f.address} aria-invalid={bad.includes("address")} onChange={(e) => setF({ ...f, address: e.target.value })} /><Err k="address" /></div>}
                  <div className="field"><label htmlFor="f-notes">{t.form.notes}</label><textarea id="f-notes" className="input" value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></div>
                  <input className="sr" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" value={f.website} onChange={(e) => setF({ ...f, website: e.target.value })} />
                </div>
              )}
              {step === 3 && (
                <div style={{ marginTop: 16 }}>
                  {lines.map((l) => <div className="sum" key={l.key} style={{ marginBottom: 6 }}><span>{l.qty}× {nm(l)}{l.extras.length > 0 && <small style={{ color: "var(--muted)" }}> ({l.extras.map(nm).join("، ")})</small>}</span><span>{fmt(l.qty * l.unit, locale)}</span></div>)}
                  <hr style={{ border: 0, borderTop: "1px solid var(--line)", margin: "14px 0" }} />
                  <p><b>{type === "DELIVERY" ? t.form.delivery : t.form.pickup}</b></p>
                  <p>{f.name} · <span dir="ltr">{f.phone}</span></p>
                  {type === "DELIVERY" && <p style={{ color: "var(--muted)" }}>{f.address}</p>}
                  {f.notes && <p style={{ color: "var(--muted)" }}>{f.notes}</p>}
                  {error && <p className="err" role="alert" style={{ marginTop: 12 }}>{error}</p>}
                </div>
              )}
            </>
          )}
        </div>
        {!done && !empty && (
          <div className="d-foot">
            <div className="sum"><span>{t.cart.sub}</span><span>{fmt(subtotal, locale)}</span></div>
            {step > 1 && type === "DELIVERY" && s.deliveryFee > 0 && <div className="sum"><span>{t.cart.delivery}</span><span>{fmt(fee, locale)}</span></div>}
            <div className="sum t"><span>{t.cart.total}</span><span>{fmt(step > 1 ? total : subtotal, locale)}</span></div>
            {step === 1 && subtotal < s.minOrder && <p className="err">{t.err.min_order} ({fmt(s.minOrder, locale)})</p>}
            <div style={{ display: "flex", gap: 8 }}>
              {step > 1 && <button className="btn btn-line" onClick={() => setStep((step - 1) as 1 | 2)}>{t.cart.back}</button>}
              {step === 1 && <button className="btn btn-primary" style={{ flex: 1 }} disabled={subtotal < s.minOrder || (!canD && !canP)} onClick={() => setStep(2)}>{t.cart.checkout}</button>}
              {step === 2 && <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => validate() && setStep(3)}>{t.cart.next}</button>}
              {step === 3 && <button className={`btn btn-primary ${busy ? "loading" : ""}`} style={{ flex: 1 }} disabled={busy} onClick={submit}>{busy ? t.form.sending : t.form.confirm}</button>}
            </div>
          </div>
        )}
      </aside>
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}

"use client";
import { useEffect, useRef, useState } from "react";
import { useShop } from "./CartProvider";
import Pic from "./Pic";
import { getDict } from "@/lib/i18n";
import { fmt, pick } from "@/lib/types";

export default function ItemModal() {
  const { locale, selected: it, closeItem, add, flash } = useShop();
  const t = getDict(locale);
  const [qty, setQty] = useState(1);
  const [sel, setSel] = useState<string[]>([]);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (it) { setQty(1); setSel([]); setTimeout(() => closeRef.current?.focus(), 50); } }, [it]);
  const extras = it?.extras.filter((e) => sel.includes(e.id)) ?? [];
  const total = it ? (it.price + extras.reduce((a, e) => a + e.price, 0)) * qty : 0;
  return (
    <>
      <div className={`scrim ${it ? "open" : ""}`} onClick={closeItem} />
      <div className={`modal ${it ? "open" : ""}`} role="dialog" aria-modal="true" aria-label={it ? pick(locale, it.nameAr, it.nameEn) : undefined} aria-hidden={!it}>
        {it && (
          <>
            <button ref={closeRef} className="icon-btn close" onClick={closeItem} aria-label={t.modal.close}><svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M6 6l12 12M18 6 6 18" /></svg></button>
            <div className="pic"><Pic src={it.imageUrl} alt={pick(locale, it.nameAr, it.nameEn)} sizes="560px" label={t.menu.photo} /></div>
            <div className="body">
              <div className="a-row"><h3 style={{ fontSize: "1.6rem" }}>{pick(locale, it.nameAr, it.nameEn)}</h3><span className="price" style={{ fontSize: "1.25rem" }}>{fmt(it.price, locale)}</span></div>
              {(it.descAr || it.descEn) && <p style={{ color: "var(--muted)" }}>{pick(locale, it.descAr, it.descEn)}</p>}
              {it.extras.length > 0 && (
                <fieldset style={{ border: 0, padding: 0, margin: 0, display: "grid", gap: 8 }}>
                  <legend style={{ fontWeight: 700, marginBottom: 8 }}>{t.modal.extras}</legend>
                  {it.extras.map((e) => (
                    <label className="opt" key={e.id}>
                      <input type="checkbox" checked={sel.includes(e.id)} onChange={() => setSel((s) => (s.includes(e.id) ? s.filter((x) => x !== e.id) : [...s, e.id]))} />
                      <span>{pick(locale, e.nameAr, e.nameEn)}</span><span className="price">+{fmt(e.price, locale)}</span>
                    </label>
                  ))}
                </fieldset>
              )}
              {it.available ? (
                <div className="a-row">
                  <div className="qty" role="group" aria-label={t.modal.qty}>
                    <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label={t.cart.dec}>−</button><output>{qty}</output>
                    <button onClick={() => setQty((q) => Math.min(50, q + 1))} aria-label={t.cart.inc}>+</button>
                  </div>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { add(it, qty, extras); flash(`✓ ${pick(locale, it.nameAr, it.nameEn)}`); closeItem(); }}>
                    {t.modal.add} · {fmt(total, locale)}
                  </button>
                </div>
              ) : <p className="err">{t.menu.soldOut}</p>}
            </div>
          </>
        )}
      </div>
    </>
  );
}

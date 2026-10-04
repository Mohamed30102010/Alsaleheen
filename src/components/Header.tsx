"use client";
import { useEffect, useState } from "react";
import { useShop } from "./CartProvider";
import { getDict } from "@/lib/i18n";
import { pick } from "@/lib/types";
import { track } from "@/lib/analytics";

const CartIcon = () => (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 7h14l-1.3 11H6.3L5 7Zm4 0a3 3 0 0 1 6 0" /></svg>);

export default function Header() {
  const { locale, settings, count, bump, setDrawer, orderNow } = useShop();
  const t = getDict(locale);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const links: [string, string][] = [["#top", t.nav.home], ["#menu", t.nav.menu], ["#story", t.nav.story], ["#signature", t.nav.signature], ["#reviews", t.nav.reviews], ["#contact", t.nav.contact]];
  const other = locale === "ar" ? "en" : "ar";
  const name = pick(locale, settings.nameAr, settings.nameEn);
  return (
    <>
      <header className={`header ${solid ? "solid" : ""}`}>
        <div className="wrap">
          <a href="#top" className="brand" aria-label={name}><span className="brand-mark" aria-hidden="true">ص</span><span>{name}</span></a>
          <nav className="nav" aria-label="Main">{links.map(([h, l]) => <a key={h} href={h}>{l}</a>)}</nav>
          <div className="hdr-actions">
            <a className="lang" href={`/${other}`} hrefLang={other} lang={other}>{t.lang}</a>
            <button className="icon-btn cart-btn" onClick={() => setDrawer(true)} aria-label={`${t.cart.open} (${count})`}>
              <CartIcon />{count > 0 && <span key={bump} className="badge bump">{count}</span>}
            </button>
            <button className="btn btn-primary" style={{ display: "none" }} id="hdr-order" onClick={orderNow}>{t.hero.order}</button>
            <button className="icon-btn burger" onClick={() => setOpen(true)} aria-label="Menu" aria-expanded={open}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            </button>
          </div>
        </div>
        <style>{`@media(min-width:960px){#hdr-order{display:inline-flex!important;min-height:42px;padding:0 20px}}`}</style>
      </header>
      <div className={`mmenu ${open ? "open" : ""}`} aria-hidden={!open} {...(!open ? { inert: "" as unknown as boolean } : {})}>
        <div className="top"><span className="brand">{name}</span>
          <button className="icon-btn" onClick={() => setOpen(false)} aria-label={t.modal.close}><svg width="26" height="26" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none"><path d="M6 6l12 12M18 6 6 18" /></svg></button></div>
        {links.map(([h, l]) => <a key={h} href={h} onClick={() => setOpen(false)}>{l}</a>)}
      </div>
      <nav className="mbar" aria-label="Quick">
        <a href="#menu"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 4h14v16H5zM9 9h6M9 13h6" /></svg>{t.nav.menu}</a>
        <button className="order" onClick={orderNow}>{t.hero.order}</button>
        <button onClick={() => setDrawer(true)} aria-label={`${t.cart.open} (${count})`}><CartIcon />{t.cart.open}{count > 0 && <span key={bump} className="badge bump">{count}</span>}</button>
        {settings.phone ? <a href={`tel:${settings.phone.replace(/\s/g, "")}`} onClick={() => track("phone_click")}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" /></svg>{t.contact.call}</a> : <a href="#contact">{t.nav.contact}</a>}
      </nav>
    </>
  );
}

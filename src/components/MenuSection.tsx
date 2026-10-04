"use client";
import { useMemo, useState } from "react";
import { useShop } from "./CartProvider";
import Pic from "./Pic";
import { getDict } from "@/lib/i18n";
import { fmt, pick, type Cat, type Item } from "@/lib/types";
import { track } from "@/lib/analytics";

const norm = (s: string) => s.toLowerCase().replace(/[\u064B-\u0652\u0640]/g, "").replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي").trim();

export default function MenuSection({ categories, items, ok }: { categories: Cat[]; items: Item[]; ok: boolean }) {
  const { locale, openItem, add, flash } = useShop();
  const t = getDict(locale);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [tag, setTag] = useState("");
  const tags = useMemo(() => Array.from(new Set(items.flatMap((i) => i.tags))), [items]);
  const list = useMemo(() => {
    const n = norm(q);
    return items.filter((i) => (cat === "all" || i.categoryId === cat) && (!tag || i.tags.includes(tag)) &&
      (!n || norm(`${i.nameAr} ${i.nameEn} ${i.descAr} ${i.descEn}`).includes(n)));
  }, [items, q, cat, tag]);
  const grouped = cat === "all" && !q && !tag;
  const nm = (c: { nameAr: string; nameEn: string }) => pick(locale, c.nameAr, c.nameEn);

  const Row = ({ i }: { i: Item }) => (
    <div className={`row ${i.available ? "" : "off"}`}>
      <button type="button" className="row" style={{ border: 0, padding: 0, flex: 1, minWidth: 0 }} onClick={() => openItem(i)} aria-label={nm(i)}>
        <div className="pic thumb"><Pic src={i.imageUrl} alt="" sizes="80px" /></div>
        <div className="info"><div className="rname">{nm(i)}</div><div className="rdesc">{pick(locale, i.descAr, i.descEn)}</div></div>
      </button>
      <div className="side">
        <span className="price">{fmt(i.price, locale)}</span>
        {i.available ? (
          <button className="plus" aria-label={`${t.menu.add}: ${nm(i)}`} onClick={() => { if (i.extras.length) openItem(i); else { add(i, 1, []); flash(`✓ ${nm(i)}`); } }}>
            <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" fill="none"><path d="M12 5v14M5 12h14" /></svg>
          </button>
        ) : <span className="soldout">{t.menu.soldOut}</span>}
      </div>
    </div>
  );

  return (
    <section id="menu" className="menu-sec">
      <div className="wrap">
        <div className="sec-head rv in"><span className="eyebrow">{t.nav.menu}</span><h2>{t.menu.title}</h2></div>
        {!ok ? <div className="empty" role="alert">{t.menu.dbError}</div> : items.length === 0 ? <div className="empty">{t.menu.emptyAll}</div> : (
          <>
            <div className="toolbar">
              <label className="search"><span className="sr">{t.menu.search}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
                <input type="search" value={q} placeholder={t.menu.search} onChange={(e) => setQ(e.target.value)} onBlur={() => q && track("menu_search", { q })} />
              </label>
              <div className="chips" role="group" aria-label={t.menu.title}>
                <button className="chip" aria-pressed={cat === "all"} onClick={() => setCat("all")}>{t.menu.all}</button>
                {categories.map((c) => <button key={c.id} className="chip" aria-pressed={cat === c.id} onClick={() => { setCat(c.id); track("menu_category", { c: c.id }); }}>{nm(c)}</button>)}
              </div>
              {tags.length > 0 && <div className="chips" role="group" aria-label={t.menu.tags}>{tags.map((x) => <button key={x} className="chip sm" aria-pressed={tag === x} onClick={() => setTag(tag === x ? "" : x)}>{x}</button>)}</div>}
            </div>
            {list.length === 0 ? <div className="empty">{q || tag ? t.menu.emptySearch : t.menu.emptyCat}</div> :
              grouped ? categories.map((c) => {
                const its = list.filter((i) => i.categoryId === c.id);
                return its.length === 0 ? null : (<div key={c.id}><h3 className="cat-title">{nm(c)}</h3><div className="rows">{its.map((i) => <Row key={i.id} i={i} />)}</div></div>);
              }) : <div className="rows">{list.map((i) => <Row key={i.id} i={i} />)}</div>}
          </>
        )}
      </div>
    </section>
  );
}

import Pic from "./Pic";
import Reveal from "./Reveal";
import OpenBtn from "./OpenBtn";
import { getDict } from "@/lib/i18n";
import { fmt, pick, type Item, type Locale } from "@/lib/types";

export default function Signature({ items, locale }: { items: Item[]; locale: Locale }) {
  const t = getDict(locale);
  const feat = items.filter((i) => i.featured && i.available);
  const list = (feat.length ? feat : items.filter((i) => i.available)).slice(0, 4);
  if (list.length === 0) return null;
  return (
    <section id="signature" className="sig">
      <div className="wrap">
        <Reveal className="sec-head"><span className="eyebrow">{t.nav.signature}</span><h2>{t.sig.title}</h2><p>{t.sig.sub}</p></Reveal>
        {list.map((it, n) => (
          <Reveal key={it.id} className="sig-row">
            <OpenBtn item={it} className="pic" label={pick(locale, it.nameAr, it.nameEn)}>
              <Pic src={it.imageUrl} alt={pick(locale, it.nameAr, it.nameEn)} sizes="(min-width:820px) 45vw, 100vw" label={t.menu.photo} />
            </OpenBtn>
            <div className="sig-body">
              <span className="sig-num" aria-hidden="true">0{n + 1}</span>
              <h3>{pick(locale, it.nameAr, it.nameEn)}</h3>
              <p>{pick(locale, it.descAr, it.descEn)}</p>
              <span className="price">{fmt(it.price, locale)}</span>
              <OpenBtn item={it} className="btn btn-dark">{t.sig.order}</OpenBtn>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

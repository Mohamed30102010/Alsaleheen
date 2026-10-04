"use client";
import { useEffect, useState } from "react";
import Pic from "./Pic";
import Reveal from "./Reveal";
import { getDict } from "@/lib/i18n";
import { pick, type GalleryT, type Locale } from "@/lib/types";

const SPAN = ["w2 h2", "", "h2", "", "w2", "", "h2", ""];

export default function Gallery({ images, locale }: { images: GalleryT[]; locale: Locale }) {
  const t = getDict(locale);
  const [idx, setIdx] = useState<number | null>(null);
  const placeholder = images.length === 0;
  const list = placeholder ? Array.from({ length: 6 }, (_, i) => ({ id: `p${i}`, url: "", altAr: t.gallery.ph, altEn: t.gallery.ph })) : images;
  useEffect(() => {
    if (idx === null || placeholder) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIdx(null);
      if (e.key === "ArrowRight") setIdx((i) => ((i ?? 0) + (locale === "ar" ? -1 : 1) + list.length) % list.length);
      if (e.key === "ArrowLeft") setIdx((i) => ((i ?? 0) + (locale === "ar" ? 1 : -1) + list.length) % list.length);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [idx, placeholder, list.length, locale]);
  return (
    <section id="gallery" className="sig">
      <div className="wrap">
        <Reveal className="sec-head"><h2>{t.gallery.title}</h2>{placeholder && <p className="note">{t.gallery.sample}</p>}</Reveal>
        <Reveal className="gal">
          {list.map((g, i) => (
            <button key={g.id} className={SPAN[i % SPAN.length]} disabled={placeholder} onClick={() => setIdx(i)} aria-label={pick(locale, g.altAr, g.altEn) || t.gallery.ph}>
              <div className="pic"><Pic src={g.url} alt={pick(locale, g.altAr, g.altEn)} sizes="(min-width:800px) 25vw, 50vw" label={t.gallery.ph} /></div>
            </button>
          ))}
        </Reveal>
      </div>
      {idx !== null && !placeholder && (
        <div className="lb" role="dialog" aria-modal="true" onClick={() => setIdx(null)}>
          <button className="icon-btn x" aria-label={t.modal.close} onClick={() => setIdx(null)}>✕</button>
          <div className="pic" onClick={(e) => e.stopPropagation()}><Pic src={list[idx].url} alt={pick(locale, list[idx].altAr, list[idx].altEn)} sizes="100vw" /></div>
        </div>
      )}
    </section>
  );
}

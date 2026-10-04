import Reveal from "./Reveal";
import { getDict } from "@/lib/i18n";
import { pick, type Locale, type ReviewT } from "@/lib/types";

export default function Reviews({ reviews, locale }: { reviews: ReviewT[]; locale: Locale }) {
  const t = getDict(locale);
  if (!reviews.length) return null;
  const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
  const nf = new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", { maximumFractionDigits: 1, minimumFractionDigits: 1 });
  return (
    <section id="reviews" style={{ background: "var(--bg)" }}>
      <div className="wrap">
        <Reveal className="sec-head"><span className="eyebrow">{t.nav.reviews}</span><h2>{t.reviews.title}</h2>
          <div className="avg"><b>{nf.format(avg)}</b><span className="stars" aria-label={`${avg.toFixed(1)} / 5`}>{"★".repeat(Math.round(avg))}</span></div></Reveal>
        <div className="rev-grid">
          {reviews.map((r, i) => (
            <Reveal key={r.id} className="rev" delay={i * 0.08}>
              <span className="stars" role="img" aria-label={`${r.rating} / 5`}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
              <p>{pick(locale, r.textAr, r.textEn)}</p>
              <footer>{r.name} {r.date && <span>· {r.date}</span>}</footer>
            </Reveal>
          ))}
        </div>
        {reviews.some((r) => r.isSample) && <p className="note">{t.reviews.sample}</p>}
      </div>
    </section>
  );
}

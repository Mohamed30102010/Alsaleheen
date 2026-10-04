import Pic from "./Pic";
import Parallax from "./Parallax";
import OrderCta from "./OrderCta";
import { getDict } from "@/lib/i18n";
import { pick, type Locale, type PublicSettings } from "@/lib/types";

export default function Hero({ s, locale }: { s: PublicSettings; locale: Locale }) {
  const t = getDict(locale);
  const name = pick(locale, s.nameAr, s.nameEn);
  const i = (n: number) => ({ "--i": n }) as React.CSSProperties;
  return (
    <section id="top" className="hero">
      {s.heroImageUrl && (
        <Parallax className="hero-bg">
          <div className="pic" style={{ position: "absolute", inset: 0 }}><Pic src={s.heroImageUrl} alt={name} sizes="100vw" priority /></div>
        </Parallax>
      )}
      <div className="hero-shade" />
      <div className="wrap hero-inner">
        <p className="eyebrow rh" style={i(0)}>{t.hero.eyebrow}</p>
        <h1 className="rh" style={i(1)}>{name}</h1>
        <p className="tag rh" style={i(2)}>{pick(locale, s.taglineAr, s.taglineEn)}</p>
        <div className="ctas rh" style={i(3)}>
          <a href="#menu" className="btn btn-primary">{t.hero.menu}</a>
          <OrderCta className="btn btn-ghost">{t.hero.order}</OrderCta>
        </div>
      </div>
      <a href="#signature" className="scroll-ind" aria-label={t.hero.scroll}><span>{t.hero.scroll}</span><i /></a>
    </section>
  );
          }

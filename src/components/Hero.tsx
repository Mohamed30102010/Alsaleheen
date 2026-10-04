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
      <Parallax className="hero-bg">
        {s.heroImageUrl ? (
          <div className="pic" style={{ position: "absolute", inset: 0 }}><Pic src={s.heroImageUrl} alt={name} sizes="100vw" priority /></div>
        ) : (
          <>
            <div className="hero-art" aria-hidden="true" />
            <video className="hero-video" src="/hero.mp4" autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
            <style>{`.hero-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}@media(prefers-reduced-motion:reduce){.hero-video{display:none}}`}</style>
          </>
        )}
      </Parallax>
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

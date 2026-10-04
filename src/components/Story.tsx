import Pic from "./Pic";
import Reveal from "./Reveal";
import { getDict } from "@/lib/i18n";
import { pick, type Locale, type StoryStep } from "@/lib/types";

export default function Story({ steps, locale }: { steps: StoryStep[]; locale: Locale }) {
  const t = getDict(locale);
  if (!steps.length) return null;
  return (
    <section id="story">
      <div className="wrap">
        <Reveal className="sec-head"><span className="eyebrow">{t.nav.story}</span><h2>{t.story.title}</h2></Reveal>
        <div className="story-grid">
          {steps.map((s, i) => (
            <Reveal key={i} className="step" delay={i * 0.08}>
              <div className="pic"><Pic src={s.imageUrl} alt={pick(locale, s.titleAr, s.titleEn)} sizes="(min-width:1100px) 25vw, 50vw" label={t.story.ph} /></div>
              <b aria-hidden="true">0{i + 1}</b>
              <h3>{pick(locale, s.titleAr, s.titleEn)}</h3>
              <p>{pick(locale, s.textAr, s.textEn)}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

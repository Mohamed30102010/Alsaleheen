import Reveal from "./Reveal";
import TrackLink from "./TrackLink";
import { getDict } from "@/lib/i18n";
import { pick, type Locale, type PublicSettings } from "@/lib/types";

export function mapLinks(s: PublicSettings) {
  const q = s.lat != null && s.lng != null ? `${s.lat},${s.lng}` : s.addressEn || s.addressAr;
  const enc = encodeURIComponent(q);
  return {
    directions: s.mapsLink || `https://www.google.com/maps/dir/?api=1&destination=${enc}`,
    embed: s.mapEmbedUrl || `https://maps.google.com/maps?q=${enc}&hl=${"en"}&z=16&output=embed`,
  };
}

export default function Location({ s, locale }: { s: PublicSettings; locale: Locale }) {
  const t = getDict(locale);
  const { directions, embed } = mapLinks(s);
  const tel = s.phone.replace(/\s/g, "");
  const socials = [["Facebook", s.facebook], ["Instagram", s.instagram], ["TikTok", s.tiktok]].filter(([, u]) => u);
  return (
    <section id="contact" className="contact">
      <div className="wrap">
        <Reveal className="sec-head"><span className="eyebrow">{t.nav.contact}</span><h2>{t.contact.title}</h2></Reveal>
        <div className="c-grid">
          <Reveal className="c-list">
            <dl style={{ margin: 0, display: "grid", gap: 22 }}>
              <div><dt>{t.contact.address}</dt><dd>{pick(locale, s.addressAr, s.addressEn)}</dd></div>
              {(s.hoursAr || s.hoursEn) && <div><dt>{t.contact.hours}</dt><dd>{pick(locale, s.hoursAr, s.hoursEn)}</dd></div>}
              {s.phone && <div><dt>{t.form.phone}</dt><dd dir="ltr" style={{ textAlign: locale === "ar" ? "end" : "start" }}>{s.phone}</dd></div>}
            </dl>
            <div className="c-actions">
              <TrackLink ev="directions_click" className="btn btn-primary" href={directions} external>{t.contact.dir}</TrackLink>
              {s.phone && <TrackLink ev="phone_click" className="btn btn-line" href={`tel:${tel}`}>{t.contact.call}</TrackLink>}
              {s.whatsapp && <TrackLink ev="whatsapp_click" className="btn btn-dark" href={`https://wa.me/${s.whatsapp}`} external>{t.contact.wa}</TrackLink>}
            </div>
            {socials.length > 0 && <div><p style={{ fontWeight: 600, marginBottom: 8 }}>{t.contact.follow}</p><div className="social">{socials.map(([n, u]) => <a key={n} href={u} target="_blank" rel="noopener noreferrer">{n}</a>)}</div></div>}
          </Reveal>
          <Reveal className="map"><iframe title={t.contact.map} src={embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></Reveal>
        </div>
      </div>
    </section>
  );
}

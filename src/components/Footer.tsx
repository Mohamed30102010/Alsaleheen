import { getDict } from "@/lib/i18n";
import { pick, type Locale, type PublicSettings } from "@/lib/types";

export default function Footer({ s, locale }: { s: PublicSettings; locale: Locale }) {
  const t = getDict(locale);
  const name = pick(locale, s.nameAr, s.nameEn);
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="f-grid">
          <div><p className="brand" style={{ color: "#fff", marginBottom: 12 }}><span className="brand-mark" aria-hidden="true">ص</span>{name}</p><p style={{ maxWidth: "36ch" }}>{pick(locale, s.descAr, s.descEn)}</p></div>
          <div><h4>{t.footer.menu}</h4><ul>
            {[["#menu", t.nav.menu], ["#signature", t.nav.signature], ["#story", t.nav.story], ["#reviews", t.nav.reviews]].map(([h, l]) => <li key={h}><a href={h}>{l}</a></li>)}</ul></div>
          <div><h4>{t.footer.contact}</h4><ul>
            {s.phone && <li><a href={`tel:${s.phone.replace(/\s/g, "")}`} dir="ltr">{s.phone}</a></li>}
            {s.whatsapp && <li><a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener noreferrer">{t.contact.wa}</a></li>}
            {[["Facebook", s.facebook], ["Instagram", s.instagram], ["TikTok", s.tiktok]].filter(([, u]) => u).map(([n, u]) => <li key={n}><a href={u} target="_blank" rel="noopener noreferrer">{n}</a></li>)}</ul></div>
          <div><h4>{t.contact.address}</h4><p>{pick(locale, s.addressAr, s.addressEn)}</p><h4 style={{ marginTop: 16 }}>{t.contact.hours}</h4><p>{pick(locale, s.hoursAr, s.hoursEn)}</p></div>
        </div>
        <div className="f-bottom"><span>© {year} {name}. {t.footer.rights}.</span>{s.isDemo && <span>{t.footer.demo}</span>}</div>
      </div>
    </footer>
  );
}

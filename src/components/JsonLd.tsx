import type { Item, Cat, PublicSettings } from "@/lib/types";

export default function JsonLd({ s, items, categories, url }: { s: PublicSettings; items: Item[]; categories: Cat[]; url: string }) {
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org", "@type": "Restaurant", name: s.nameEn || s.nameAr, alternateName: s.nameAr, url,
    servesCuisine: "Egyptian", description: s.descEn || s.descAr, inLanguage: ["ar", "en"],
    address: { "@type": "PostalAddress", streetAddress: s.addressEn || s.addressAr, addressLocality: "Alexandria", addressCountry: "EG" },
  };
  if (s.phone) ld.telephone = s.phone;
  if (s.lat != null && s.lng != null) ld.geo = { "@type": "GeoCoordinates", latitude: s.lat, longitude: s.lng };
  if (s.openingSpec) ld.openingHours = s.openingSpec.split(",").map((x) => x.trim()).filter(Boolean);
  if (s.heroImageUrl) ld.image = s.heroImageUrl;
  const sameAs = [s.facebook, s.instagram, s.tiktok].filter(Boolean);
  if (sameAs.length) ld.sameAs = sameAs;
  if (items.length)
    ld.hasMenu = {
      "@type": "Menu", name: "Menu", inLanguage: "ar",
      hasMenuSection: categories.map((c) => ({
        "@type": "MenuSection", name: c.nameAr,
        hasMenuItem: items.filter((i) => i.categoryId === c.id).map((i) => ({
          "@type": "MenuItem", name: i.nameAr, description: i.descAr || undefined,
          offers: { "@type": "Offer", price: i.price, priceCurrency: "EGP" },
        })),
      })).filter((m) => (m.hasMenuItem as unknown[]).length > 0),
    };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />;
}

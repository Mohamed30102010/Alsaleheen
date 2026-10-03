import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  return ["ar", "en"].map((l) => ({
    url: `${base}/${l}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: l === "ar" ? 1 : 0.8,
    alternates: { languages: { ar: `${base}/ar`, en: `${base}/en` } },
  }));
}

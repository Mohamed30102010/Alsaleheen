import { prisma } from "./db";
import { defaultSettings } from "./defaults";
import type { Cat, Extra, GalleryT, Item, PublicSettings, ReviewT } from "./types";

export async function getSiteData() {
  try {
    const [s, categories, items, reviews, gallery] = await Promise.all([
      prisma.settings.findUnique({ where: { id: 1 } }),
      prisma.category.findMany({ where: { active: true }, orderBy: { sort: "asc" } }),
      prisma.menuItem.findMany({ orderBy: [{ sort: "asc" }, { createdAt: "asc" }] }),
      prisma.review.findMany({ where: { visible: true }, orderBy: { sort: "asc" } }),
      prisma.galleryImage.findMany({ orderBy: { sort: "asc" } }),
    ]);
    const settings: PublicSettings = s ? (({ id, updatedAt, ...rest }) => rest)(s) : defaultSettings;
    const catIds = new Set(categories.map((c) => c.id));
    return {
      ok: true,
      settings,
      categories: categories.map(({ id, nameAr, nameEn }): Cat => ({ id, nameAr, nameEn })),
      items: items.filter((i) => catIds.has(i.categoryId)).map((i): Item => ({
        id: i.id, categoryId: i.categoryId, nameAr: i.nameAr, nameEn: i.nameEn, descAr: i.descAr, descEn: i.descEn,
        price: i.price, imageUrl: i.imageUrl, tags: i.tags, extras: (i.extras as unknown as Extra[]) ?? [],
        available: i.available, featured: i.featured,
      })),
      reviews: reviews.map((r): ReviewT => ({ id: r.id, name: r.name, rating: r.rating, textAr: r.textAr, textEn: r.textEn, date: r.date, isSample: r.isSample })),
      gallery: gallery.map((g): GalleryT => ({ id: g.id, url: g.url, altAr: g.altAr, altEn: g.altEn })),
    };
  } catch (e) {
    console.error("[getSiteData] database unavailable", e);
    return { ok: false, settings: defaultSettings, categories: [] as Cat[], items: [] as Item[], reviews: [] as ReviewT[], gallery: [] as GalleryT[] };
  }
}

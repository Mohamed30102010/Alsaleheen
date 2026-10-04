export type Locale = "ar" | "en";
export const LOCALES: Locale[] = ["ar", "en"];
export type Extra = { id: string; nameAr: string; nameEn: string; price: number };
export type Item = {
  id: string; categoryId: string; nameAr: string; nameEn: string; descAr: string; descEn: string;
  price: number; imageUrl: string | null; tags: string[]; extras: Extra[]; available: boolean; featured: boolean;
};
export type Cat = { id: string; nameAr: string; nameEn: string };
export type ReviewT = { id: string; name: string; rating: number; textAr: string; textEn: string; date: string | null; isSample: boolean };
export type GalleryT = { id: string; url: string; altAr: string; altEn: string };
export type StoryStep = { titleAr: string; titleEn: string; textAr: string; textEn: string; imageUrl?: string };
export type PublicSettings = {
  nameAr: string; nameEn: string; taglineAr: string; taglineEn: string; descAr: string; descEn: string;
  phone: string; whatsapp: string; addressAr: string; addressEn: string; mapEmbedUrl: string; mapsLink: string;
  lat: number | null; lng: number | null; hoursAr: string; hoursEn: string; openingSpec: string;
  facebook: string; instagram: string; tiktok: string; logoUrl: string; heroImageUrl: string;
  storyJson: unknown; deliveryEnabled: boolean; pickupEnabled: boolean; deliveryFee: number; minOrder: number; isDemo: boolean;
};
export const pick = (l: Locale, ar: string, en: string) => (l === "ar" ? ar : en || ar);
export const fmt = (n: number, l: Locale) =>
  `${new Intl.NumberFormat(l === "ar" ? "ar-EG" : "en-US").format(n)} ${l === "ar" ? "ج.م" : "EGP"}`;

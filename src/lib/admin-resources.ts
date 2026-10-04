import { z } from "zod";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";

export const refresh = () => { revalidatePath("/ar"); revalidatePath("/en"); };

export const img = z.string().max(500).nullish()
  .transform((v) => (v ? v.trim() : null))
  .refine((v) => v === null || /^https?:\/\//.test(v), "url");
const str = (max: number) => z.string().trim().max(max);
const int = z.coerce.number().int().min(0).max(1_000_000);

const extras = z.array(z.object({
  id: z.string().max(60).optional(), nameAr: str(80).min(1), nameEn: str(80), price: int,
})).max(30).transform((a) => a.map((e) => ({ ...e, id: e.id || randomUUID().slice(0, 8) })));

export const RESOURCES: Record<string, { model: string; schema: z.ZodTypeAny; orderBy: object }> = {
  categories: {
    model: "category", orderBy: { sort: "asc" },
    schema: z.object({ nameAr: str(80).min(1), nameEn: str(80), sort: int.default(0), active: z.boolean().default(true) }),
  },
  items: {
    model: "menuItem", orderBy: [{ sort: "asc" }, { createdAt: "asc" }],
    schema: z.object({
      categoryId: z.string().min(1), nameAr: str(120).min(1), nameEn: str(120), descAr: str(600).default(""), descEn: str(600).default(""),
      price: int, imageUrl: img, tags: z.array(str(30)).max(10).default([]), extras: extras.default([]),
      available: z.boolean().default(true), featured: z.boolean().default(false), sort: int.default(0),
    }),
  },
  reviews: {
    model: "review", orderBy: { sort: "asc" },
    schema: z.object({
      name: str(80).min(1), rating: z.coerce.number().int().min(1).max(5), textAr: str(800).min(1), textEn: str(800).default(""),
      date: str(40).nullish().transform((v) => v || null), isSample: z.boolean().default(false), visible: z.boolean().default(true), sort: int.default(0),
    }),
  },
  gallery: {
    model: "galleryImage", orderBy: { sort: "asc" },
    schema: z.object({
      url: z.string().max(500).refine((v) => /^https?:\/\//.test(v), "url"), altAr: str(160).default(""), altEn: str(160).default(""), sort: int.default(0),
    }),
  },
};

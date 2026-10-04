import Hero from "@/components/Hero";
import Signature from "@/components/Signature";
import Story from "@/components/Story";
import MenuSection from "@/components/MenuSection";
import Reviews from "@/components/Reviews";
import Gallery from "@/components/Gallery";
import Location from "@/components/Location";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { getSiteData } from "@/lib/data";
import type { Locale, StoryStep } from "@/lib/types";

export default async function Home({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;
  const d = await getSiteData();
  const steps = (Array.isArray(d.settings.storyJson) ? d.settings.storyJson : []) as StoryStep[];
  const url = `${(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "")}/${locale}`;
  return (
    <>
      <Hero s={d.settings} locale={locale} />
      <Signature items={d.items} locale={locale} />
      <Story steps={steps} locale={locale} />
      <MenuSection categories={d.categories} items={d.items} ok={d.ok} />
      <Reviews reviews={d.reviews} locale={locale} />
      <Gallery images={d.gallery} locale={locale} />
      <Location s={d.settings} locale={locale} />
      <Footer s={d.settings} locale={locale} />
      <JsonLd s={d.settings} items={d.items} categories={d.categories} url={url} />
    </>
  );
}

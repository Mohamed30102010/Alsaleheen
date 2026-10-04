import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Reem_Kufi, IBM_Plex_Sans_Arabic, Playfair_Display } from "next/font/google";
import "../../globals.css";
import CartProvider from "@/components/CartProvider";
import Header from "@/components/Header";
import ItemModal from "@/components/ItemModal";
import CartDrawer from "@/components/CartDrawer";
import BgVideo from "@/components/BgVideo";
import { getDict } from "@/lib/i18n";
import { getSiteData } from "@/lib/data";
import { LOCALES, pick, type Locale } from "@/lib/types";

const display = Reem_Kufi({ subsets: ["arabic", "latin"], variable: "--f-display", display: "swap" });
const body = IBM_Plex_Sans_Arabic({ subsets: ["arabic", "latin"], weight: ["400", "500", "600", "700"], variable: "--f-body", display: "swap" });
const latin = Playfair_Display({ subsets: ["latin"], variable: "--f-latin", display: "swap" });

export const revalidate = 60;
export const generateStaticParams = () => LOCALES.map((locale) => ({ locale }));
export const viewport: Viewport = { themeColor: "#1F3B2D", width: "device-width", initialScale: 1 };

const site = () => (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  if (!LOCALES.includes(params.locale as Locale)) return {};
  const l = params.locale as Locale;
  const { settings: s } = await getSiteData();
  const name = pick(l, s.nameAr, s.nameEn);
  const title = `${name} | ${l === "ar" ? "الإسكندرية – الدخيلة" : "Alexandria – Dekhela"}`;
  const description = pick(l, s.descAr, s.descEn);
  return {
    metadataBase: new URL(site()), title: { default: title, template: `%s | ${name}` }, description,
    alternates: { canonical: `/${l}`, languages: { ar: "/ar", en: "/en", "x-default": "/ar" } },
    openGraph: { type: "website", url: `/${l}`, siteName: name, title, description, locale: l === "ar" ? "ar_EG" : "en_US", images: s.heroImageUrl ? [s.heroImageUrl] : undefined },
    twitter: { card: "summary_large_image", title, description, images: s.heroImageUrl ? [s.heroImageUrl] : undefined },
    robots: { index: true, follow: true },
  };
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  if (!LOCALES.includes(params.locale as Locale)) notFound();
  const locale = params.locale as Locale;
  const { settings } = await getSiteData();
  const t = getDict(locale);
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className={`${display.variable} ${body.variable} ${latin.variable}`}>
      <body className="vid">
        <BgVideo />
        <noscript><style>{`.rv,.rh{opacity:1!important;transform:none!important}`}</style></noscript>
        <a href="#menu" className="skip">{t.skip}</a>
        <CartProvider locale={locale} settings={settings}>
          <Header />
          <main>{children}</main>
          <ItemModal />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}

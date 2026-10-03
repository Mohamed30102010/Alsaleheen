import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "../../globals.css";

const body = IBM_Plex_Sans_Arabic({ subsets: ["arabic", "latin"], weight: ["400", "500", "600", "700"], variable: "--f-body", display: "swap" });
export const metadata: Metadata = { title: "لوحة التحكم", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={body.variable}>
      <body style={{ paddingBottom: 0 }}>{children}</body>
    </html>
  );
}

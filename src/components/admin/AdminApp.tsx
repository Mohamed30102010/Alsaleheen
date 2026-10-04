"use client";
import { useEffect, useState } from "react";
import Crud, { type Field } from "./Crud";
import Orders from "./Orders";
import SettingsForm from "./SettingsForm";
import AccountForm from "./AccountForm";

const TABS = [["orders", "الطلبات"], ["items", "المنيو"], ["categories", "الأقسام"], ["reviews", "الآراء"], ["gallery", "المعرض"], ["settings", "الإعدادات"]] as const;const TABS = [["orders", "الطلبات"], ["items", "المنيو"], ["categories", "الأقسام"], ["reviews", "الآراء"], ["gallery", "المعرض"], ["settings", "الإعدادات"], ["account", "الحساب"]] as const;

const CAT_F: Field[] = [{ k: "nameAr", label: "اسم القسم (عربي)", t: "text" }, { k: "nameEn", label: "Name (English)", t: "text" }, { k: "sort", label: "الترتيب (رقم أصغر = أولًا)", t: "num" }, { k: "active", label: "ظاهر في الموقع", t: "bool", def: true }];
const ITEM_F: Field[] = [
  { k: "nameAr", label: "اسم الطبق (عربي)", t: "text" }, { k: "nameEn", label: "Name (English)", t: "text" }, { k: "categoryId", label: "القسم", t: "cat" }, { k: "price", label: "السعر (ج.م)", t: "num" },
  { k: "descAr", label: "الوصف (عربي)", t: "area" }, { k: "descEn", label: "Description (English)", t: "area" }, { k: "imageUrl", label: "الصورة", t: "img" },
  { k: "extras", label: "الإضافات", t: "extras" }, { k: "tags", label: "تصنيفات (نباتي، حار…)", t: "tags", full: true }, { k: "sort", label: "الترتيب", t: "num" },
  { k: "available", label: "متاح", t: "bool", def: true }, { k: "featured", label: "طبق مميز (يظهر في أشهر الأطباق)", t: "bool" },
];
const REV_F: Field[] = [{ k: "name", label: "اسم العميل", t: "text" }, { k: "rating", label: "التقييم (1-5)", t: "num", def: 5 }, { k: "textAr", label: "نص الرأي (عربي)", t: "area" }, { k: "textEn", label: "Review (English)", t: "area" }, { k: "date", label: "التاريخ (اختياري)", t: "text" }, { k: "isSample", label: "رأي تجريبي", t: "bool" }, { k: "visible", label: "ظاهر", t: "bool", def: true }, { k: "sort", label: "الترتيب", t: "num" }];
const GAL_F: Field[] = [{ k: "url", label: "الصورة", t: "img" }, { k: "altAr", label: "وصف الصورة (عربي)", t: "text" }, { k: "altEn", label: "Alt (English)", t: "text" }, { k: "sort", label: "الترتيب", t: "num" }];

export default function AdminApp() {
  const [tab, setTab] = useState<(typeof TABS)[number][0]>("orders");
  const [cats, setCats] = useState<any[]>([]);
  useEffect(() => { fetch("/api/admin/categories").then((r) => r.json()).then((d) => Array.isArray(d) && setCats(d)).catch(() => {}); }, [tab]);
  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); window.location.href = "/admin/login"; }
  return (
    <div className="adm">
      <div className="a-top"><b>لوحة تحكم الصالحين</b><div style={{ display: "flex", gap: 8 }}><a className="btn btn-ghost sm" href="/ar" target="_blank" rel="noopener">الموقع</a><button className="btn btn-ghost sm" onClick={logout}>خروج</button></div></div>
      <div className="a-tabs" role="tablist">{TABS.map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{l}</button>)}</div>
      <main className="a-main">
        {tab === "orders" && <Orders />}
        {tab === "items" && <Crud key="items" resource="items" title="الأطباق" fields={ITEM_F} cats={cats} titleOf={(r) => r.nameAr} />}
        {tab === "categories" && <Crud key="cat" resource="categories" title="الأقسام" fields={CAT_F} titleOf={(r) => r.nameAr} />}
        {tab === "reviews" && <Crud key="rev" resource="reviews" title="الآراء" fields={REV_F} titleOf={(r) => `${r.name} · ${"★".repeat(r.rating)}`} />}
        {tab === "gallery" && <Crud key="gal" resource="gallery" title="المعرض" fields={GAL_F} titleOf={(r) => r.altAr || r.url.slice(-30)} />}
        {tab === "settings" && <SettingsForm />}
        {tab === "account" && <AccountForm />}
      </main>
    </div>
  );
}

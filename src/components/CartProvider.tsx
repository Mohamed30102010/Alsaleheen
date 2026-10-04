"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Extra, Item, Locale, PublicSettings } from "@/lib/types";
import { track } from "@/lib/analytics";

export type Line = { key: string; itemId: string; nameAr: string; nameEn: string; unit: number; qty: number; extras: Extra[] };
type Ctx = {
  locale: Locale; settings: PublicSettings; lines: Line[]; count: number; subtotal: number; bump: number;
  add: (item: Item, qty: number, extras: Extra[]) => void; setQty: (key: string, q: number) => void; clear: () => void;
  drawer: boolean; setDrawer: (v: boolean) => void; selected: Item | null; openItem: (i: Item) => void; closeItem: () => void;
  orderNow: () => void; toast: string; flash: (m: string) => void;
};
const C = createContext<Ctx | null>(null);
export const useShop = () => { const c = useContext(C); if (!c) throw new Error("ShopProvider missing"); return c; };

export default function CartProvider({ locale, settings, children }: { locale: Locale; settings: PublicSettings; children: React.ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [ready, setReady] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [selected, setSelected] = useState<Item | null>(null);
  const [bump, setBump] = useState(0);
  const [toast, setToast] = useState("");

  useEffect(() => {
    try { const raw = localStorage.getItem("sal_cart"); if (raw) setLines(JSON.parse(raw)); } catch { /* ignore corrupt storage */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) try { localStorage.setItem("sal_cart", JSON.stringify(lines)); } catch { /* storage full/blocked */ } }, [lines, ready]);
  useEffect(() => {
    const lock = drawer || !!selected;
    document.body.style.overflow = lock ? "hidden" : "";
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { setDrawer(false); setSelected(null); } };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [drawer, selected]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(""), 2200); return () => clearTimeout(t); }, [toast]);

  const add = useCallback((item: Item, qty: number, extras: Extra[]) => {
    const key = item.id + "|" + extras.map((e) => e.id).sort().join(",");
    const unit = item.price + extras.reduce((a, e) => a + e.price, 0);
    setLines((p) => {
      const f = p.find((l) => l.key === key);
      if (f) return p.map((l) => (l.key === key ? { ...l, qty: Math.min(50, l.qty + qty) } : l));
      return [...p, { key, itemId: item.id, nameAr: item.nameAr, nameEn: item.nameEn, unit, qty, extras }];
    });
    setBump((b) => b + 1);
    track("add_to_cart", { item: item.id, qty });
  }, []);
  const setQty = useCallback((key: string, q: number) => setLines((p) => (q <= 0 ? p.filter((l) => l.key !== key) : p.map((l) => (l.key === key ? { ...l, qty: Math.min(50, q) } : l)))), []);
  const clear = useCallback(() => setLines([]), []);
  const count = lines.reduce((a, l) => a + l.qty, 0);
  const subtotal = lines.reduce((a, l) => a + l.qty * l.unit, 0);
  const orderNow = useCallback(() => {
    track("order_now");
    if (count > 0) setDrawer(true);
    else document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" });
  }, [count]);

  const value = useMemo<Ctx>(() => ({
    locale, settings, lines, count, subtotal, bump, add, setQty, clear, drawer, setDrawer, selected,
    openItem: (i) => { track("product_click", { item: i.id }); setSelected(i); }, closeItem: () => setSelected(null),
    orderNow, toast, flash: setToast,
  }), [locale, settings, lines, count, subtotal, bump, add, setQty, clear, drawer, selected, orderNow, toast]);
  return <C.Provider value={value}>{children}</C.Provider>;
}

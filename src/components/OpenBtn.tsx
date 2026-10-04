"use client";
import { useShop } from "./CartProvider";
import type { Item } from "@/lib/types";

export default function OpenBtn({ item, children, className, label }: { item: Item; children: React.ReactNode; className?: string; label?: string }) {
  const { openItem } = useShop();
  return <button type="button" className={className} onClick={() => openItem(item)} aria-label={label}>{children}</button>;
}

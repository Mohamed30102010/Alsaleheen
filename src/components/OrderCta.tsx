"use client";
import { useShop } from "./CartProvider";
export default function OrderCta({ children, className }: { children: React.ReactNode; className?: string }) {
  const { orderNow } = useShop();
  return <button type="button" className={className} onClick={orderNow}>{children}</button>;
}

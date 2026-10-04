"use client";
import { useEffect, useRef } from "react";

export default function Reveal({ children, className = "", delay = 0, as: Tag = "div" }: {
  children: React.ReactNode; className?: string; delay?: number; as?: "div" | "li" | "article";
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) { el.classList.add("in"); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Comp = Tag as "div";
  return <Comp ref={ref} className={`rv ${className}`} style={{ "--dl": `${delay}s` } as React.CSSProperties}>{children}</Comp>;
}

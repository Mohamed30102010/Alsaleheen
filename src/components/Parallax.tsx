"use client";
import { useEffect, useRef } from "react";

export default function Parallax({ children, className, speed = 0.15 }: { children: React.ReactNode; className?: string; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (ref.current && y < window.innerHeight * 1.2) ref.current.style.transform = `translate3d(0,${y * speed}px,0)`;
      });
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => { window.removeEventListener("scroll", on); cancelAnimationFrame(raf); };
  }, [speed]);
  return <div ref={ref} className={className}>{children}</div>;
}

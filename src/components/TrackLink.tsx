"use client";
import { track } from "@/lib/analytics";
export default function TrackLink({ ev, href, className, children, external }: { ev: string; href: string; className?: string; children: React.ReactNode; external?: boolean }) {
  return <a href={href} className={className} onClick={() => track(ev)} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{children}</a>;
}

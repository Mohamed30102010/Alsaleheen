// Privacy-friendly hook. Plug GA4 / Plausible / Umami later; nothing is sent by default.
export function track(event: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { gtag?: (...a: unknown[]) => void; plausible?: (e: string, o?: unknown) => void };
  w.gtag?.("event", event, data);
  w.plausible?.(event, { props: data });
}

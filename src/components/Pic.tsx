import Image from "next/image";

const BLOB = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//;

export default function Pic({ src, alt, sizes = "(min-width:900px) 50vw, 100vw", priority = false, label }: {
  src?: string | null; alt: string; sizes?: string; priority?: boolean; label?: string;
}) {
  if (!src)
    return (
      <div className="ph" role="img" aria-label={alt}>
        <div>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
            <path d="M3 11h18M5 11a7 7 0 0 1 14 0M4 15h16l-1.2 4H5.2z" />
          </svg>
          {label}
        </div>
      </div>
    );
  if (BLOB.test(src)) return <Image src={src} alt={alt} fill sizes={sizes} priority={priority} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} decoding="async" />;
}

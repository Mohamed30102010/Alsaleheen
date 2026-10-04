export default function BgVideo() {
  return (
    <div className="bgv" aria-hidden="true">
      <video src="/hero.mp4" autoPlay muted loop playsInline preload="auto" />
      <div className="bgv-shade" />
    </div>
  );
}

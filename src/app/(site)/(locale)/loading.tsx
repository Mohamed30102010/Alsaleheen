export default function Loading() {
  return (
    <div className="wrap" style={{ paddingBlock: "120px" }} aria-busy="true">
      <div className="skel" style={{ height: 56, width: "60%", marginBottom: 20 }} />
      <div className="skel" style={{ height: 280 }} />
    </div>
  );
}

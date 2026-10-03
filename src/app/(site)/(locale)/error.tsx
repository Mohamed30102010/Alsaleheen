"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="wrap center" style={{ paddingBlock: "140px" }} role="alert">
      <h1 style={{ fontSize: "1.8rem", marginBottom: 12 }}>حدث خطأ غير متوقع · Something went wrong</h1>
      <button className="btn btn-primary" onClick={reset}>إعادة المحاولة · Retry</button>
    </div>
  );
}

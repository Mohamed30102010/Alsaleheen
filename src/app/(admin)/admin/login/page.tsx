"use client";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function go(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr("");
    try {
      const r = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      if (r.ok) { window.location.href = "/admin"; return; }
      setErr(r.status === 429 ? "محاولات كثيرة، انتظر قليلًا." : r.status === 401 || r.status === 400 ? "البريد أو كلمة المرور غير صحيحة." : "حدث خطأ، حاول مرة أخرى.");
    } catch { setErr("تعذر الاتصال بالإنترنت."); } finally { setBusy(false); }
  }
  return (
    <form className="login card" onSubmit={go}>
      <h1 style={{ fontSize: "1.6rem", marginBottom: 16 }}>تسجيل دخول الإدارة</h1>
      <div className="field"><label htmlFor="e">البريد الإلكتروني</label><input id="e" className="input" type="email" dir="ltr" autoComplete="username" value={email} onChange={(x) => setEmail(x.target.value)} required /></div>
      <div className="field"><label htmlFor="p">كلمة المرور</label><input id="p" className="input" type="password" dir="ltr" autoComplete="current-password" value={password} onChange={(x) => setPassword(x.target.value)} required /></div>
      {err && <p className="err" role="alert" style={{ marginBottom: 12 }}>{err}</p>}
      <button className={`btn btn-primary ${busy ? "loading" : ""}`} style={{ width: "100%" }} disabled={busy}>دخول</button>
    </form>
  );
}

"use client";
import { useState } from "react";

const MSG: Record<string, string> = {
  wrong_password: "كلمة المرور الحالية غير صحيحة.",
  email_taken: "هذا البريد مستخدم بالفعل.",
  rate: "محاولات كثيرة، انتظر قليلًا.",
  validation: "تأكد من البيانات (كلمة المرور الجديدة 10 أحرف على الأقل).",
  nothing: "اكتب بريدًا جديدًا أو كلمة مرور جديدة.",
};

export default function AccountForm() {
  const [cur, setCur] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true); setMsg(""); setOk(false);
    try {
      const r = await fetch("/api/admin/account", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: cur, newEmail: email, newPassword: pass }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok) { setOk(true); setMsg("✓ تم التحديث"); setCur(""); setEmail(""); setPass(""); }
      else setMsg(MSG[d.error] ?? "حدث خطأ، حاول مرة أخرى.");
    } catch { setMsg("تعذر الاتصال."); } finally { setBusy(false); }
  }

  return (
    <div className="card" style={{ maxWidth: 480 }}>
      <h2 style={{ fontSize: "1.3rem", marginBottom: 14 }}>حساب الأدمن</h2>
      <div className="field"><label htmlFor="a-cur">كلمة المرور الحالية (مطلوبة)</label><input id="a-cur" className="input" type="password" dir="ltr" autoComplete="current-password" value={cur} onChange={(e) => setCur(e.target.value)} /></div>
      <div className="field"><label htmlFor="a-em">بريد جديد (اختياري)</label><input id="a-em" className="input" type="email" dir="ltr" autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div className="field"><label htmlFor="a-pw">كلمة مرور جديدة (اختياري، 10 أحرف+)</label><input id="a-pw" className="input" type="password" dir="ltr" autoComplete="new-password" value={pass} onChange={(e) => setPass(e.target.value)} /></div>
      {msg && <p role="status" className={ok ? "" : "err"} style={{ marginBottom: 10 }}>{msg}</p>}
      <button className={`btn btn-primary ${busy ? "loading" : ""}`} disabled={busy || !cur} onClick={save}>حفظ</button>
    </div>
  );
                  }

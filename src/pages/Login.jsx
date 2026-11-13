import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

const DEMOS = [
  { name: "أنور أبو القيعان", phone: "0500000001", pin: "1234", role: "مدير عام" },
  { name: "عمار القريناوي", phone: "0500000104", pin: "1040", role: "كاشير" },
];

export default function Login() {
  const { session, login } = useStore();
  const navigate = useNavigate();
  const [phone, setPhone] = useState(DEMOS[0].phone);
  const [pin, setPin] = useState("1234");
  const [error, setError] = useState("");

  if (session) return <Navigate to="/" replace />;

  function submit(event) {
    event.preventDefault();
    if (!login(phone, pin)) {
      setError("رقم الجوال أو رمز الدخول غير مطابق للبيانات التجريبية");
      return;
    }
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-surface grid lg:grid-cols-2">
      <section className="hidden lg:flex flex-col justify-between bg-ink text-white p-12">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary-container grid place-items-center font-extrabold text-xl">K</div>
          <div>
            <div className="text-2xl font-extrabold">كونيكس</div>
            <div className="text-sm text-white/70">Kunix Retail OS · v2.4.0</div>
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-extrabold leading-snug">تشغيل فروع الاتصالات والأجهزة من لوحة واحدة.</h1>
          <p className="mt-4 text-white/70 leading-7">لكل فروعك، وين ما كانت. مخزون بالـ IMEI، صندوق يومي، ونقطة بيع.</p>
        </div>
        <p className="text-sm text-white/50">البيانات الحالية تجريبية ومحفوظة على هذا الجهاز حتى ربط Firebase.</p>
      </section>
      <section className="grid place-items-center p-6">
        <form onSubmit={submit} className="card w-full max-w-md p-6">
          <p className="text-[12px] font-bold text-primary-container">بدء الوردية</p>
          <h2 className="text-2xl font-extrabold mt-1 mb-5">تسجيل الدخول</h2>
          <label className="block text-[12px] font-bold text-muted mb-1">رقم الجوال</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full h-11 px-3 mb-3 rounded-lg border border-line nums" />
          <label className="block text-[12px] font-bold text-muted mb-1">رمز الدخول</label>
          <input value={pin} onChange={(e) => setPin(e.target.value)} className="w-full h-11 px-3 mb-4 rounded-lg border border-line nums" inputMode="numeric" />
          {error && <p className="text-[13px] text-error mb-3">{error}</p>}
          <button type="submit" className="w-full h-12 rounded-lg bg-primary-container text-white font-bold hover:bg-[#E66E00]">دخول إلى لوحة كونيكس</button>
          <Link to="/welcome" className="mt-4 block text-center text-[13px] font-bold text-primary">صاحب محل جديد؟ افتح متجرك بـ 500 ₪ شهرياً</Link>
          <div className="mt-4 grid gap-2">
            {DEMOS.map((demo) => (
              <button
                key={demo.phone}
                type="button"
                onClick={() => { setPhone(demo.phone); setPin(demo.pin); setError(""); }}
                className="text-right px-3 py-2 rounded-lg bg-surface-container-low text-[13px]"
              >
                <b>{demo.name}</b>
                <span className="text-muted"> · {demo.role} · {demo.pin}</span>
              </button>
            ))}
          </div>
        </form>
      </section>
    </div>
  );
}

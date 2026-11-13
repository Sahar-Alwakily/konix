import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";

export default function WorkerLogin() {
  const { session, login } = useStore();
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  if (session) return <Navigate to="/worker/pos" replace />;

  function submit(event) {
    event.preventDefault();
    if (!login(id, pin)) {
      setError("الرقم أو الرمز غير صحيح");
      return;
    }
    navigate("/worker/pos");
  }

  return (
    <div className="min-h-screen bg-white text-on-surface grid place-items-center px-5 py-10">
      <form onSubmit={submit} className="w-full" style={{ maxWidth: 440 }}>
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-[28px] bg-primary-container text-white grid place-items-center text-[42px] font-extrabold shadow-md">K</div>
          <h1 className="text-[40px] font-extrabold mt-4 leading-none">كونيكس</h1>
          <p className="text-[15px] text-on-surface-variant mt-2">بوابة الموظف</p>
        </div>

        <label className="block text-[14px] font-bold mt-8">
          الرقم أو الجوال
          <input
            value={id}
            onChange={(event) => { setId(event.target.value); setError(""); }}
            autoComplete="username"
            inputMode="numeric"
            placeholder="0500000000"
            className="mt-2 w-full h-14 px-4 rounded-2xl bg-surface-container-low text-[18px] nums outline-none focus:ring-2 focus:ring-primary-container"
          />
        </label>
        <label className="block text-[14px] font-bold mt-4">
          الرمز
          <input
            value={pin}
            onChange={(event) => { setPin(event.target.value); setError(""); }}
            type="password"
            autoComplete="current-password"
            inputMode="numeric"
            placeholder="••••"
            className="mt-2 w-full h-14 px-4 rounded-2xl bg-surface-container-low text-[18px] nums outline-none focus:ring-2 focus:ring-primary-container"
          />
        </label>
        {error && <p className="mt-3 text-[14px] font-bold text-error">{error}</p>}
        <button type="submit" className="mt-6 w-full h-16 rounded-2xl bg-primary-container text-white text-[20px] font-extrabold active:scale-[0.99]">
          تسجيل الدخول
        </button>
        <p className="mt-4 text-center text-[12px] text-outline">تجريبي: خالد · 0501234567 · 2222</p>
        <Link to="/welcome" className="mt-3 block text-center text-[13px] font-bold text-primary">العودة لصفحة المحل</Link>
      </form>
    </div>
  );
}

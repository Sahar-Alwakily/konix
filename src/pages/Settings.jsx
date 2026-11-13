import { useStore } from "../context/StoreContext";
import { fieldClass } from "../components/ui";

export default function Settings() {
  const { db, updateSettings, resetDummy, firebaseOn } = useStore();

  function save(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    updateSettings({
      name: data.get("name"),
      vat: Number(data.get("vat")),
      cashCeiling: Number(data.get("ceiling")),
    });
  }

  return (
    <div className="py-6 max-w-2xl space-y-4">
      <h1 className="text-[28px] font-extrabold">إعدادات المتجر العامة</h1>
      <p className="text-muted">القيم تُحفظ محلياً كبيانات تجريبية. مسار Firebase الجاهز: <span className="nums">kunix/settings</span></p>
      <form onSubmit={save} className="card p-5 space-y-3">
        <label className="block text-[12px] font-bold">اسم المتجر<input name="name" defaultValue={db.settings.name} className={fieldClass + " mt-1"} /></label>
        <label className="block text-[12px] font-bold">ضريبة القيمة المضافة %<input name="vat" type="number" defaultValue={db.settings.vat} className={fieldClass + " mt-1"} /></label>
        <label className="block text-[12px] font-bold">سقف نقدية الصندوق<input name="ceiling" type="number" defaultValue={db.settings.cashCeiling} className={fieldClass + " mt-1"} /></label>
        <button className="h-11 px-4 rounded-lg bg-primary-container text-white font-bold" type="submit">حفظ</button>
      </form>
      <article className="card p-5">
        <b>ربط Firebase</b>
        <p className="text-[13px] text-muted mt-1">
          {firebaseOn ? "مفاتيح Firebase موجودة. طبقة القراءة ما زالت على البيانات التجريبية إلى أن تُستبدل في StoreContext." : "غير مربوط. انسخ .env.example إلى .env واملأ مفاتيح Realtime Database."}
        </p>
        <p className="text-[12px] nums mt-2 text-outline">kunix/products · kunix/invoices · kunix/staff · kunix/stockMoves · kunix/cashMoves</p>
      </article>
      <button type="button" onClick={resetDummy} className="h-10 px-4 rounded-lg border border-error text-error font-bold">إرجاع البيانات التجريبية الأصلية</button>
    </div>
  );
}

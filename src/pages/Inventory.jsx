import { useMemo, useState } from "react";
import { useStore } from "../context/StoreContext";
import { Icon } from "../components/ui";

const FILTERS = [
  { id: "all", label: "كل الحركات" },
  { id: "in", label: "وارد (In)", dot: "bg-tertiary" },
  { id: "out", label: "صادر / مبيعات (Out)", dot: "bg-error" },
  { id: "transfer", label: "تحويل داخلي (Transfer)", dot: "bg-secondary" },
  { id: "return", label: "إرجاع / مرتجع (Return)", dot: "bg-outline" },
];

const LEVELS = [
  { name: "المستودع المركزي", place: "المنطقة الصناعية - رهط", kind: "رئيسي", kindClass: "bg-secondary-fixed text-on-secondary-fixed", qty: "1,850", pct: "74%", width: "74%", bar: "bg-secondary-container", pctClass: "text-secondary", cap: "سعة التخزين: 2,500", free: "متاح: 650", freeClass: "text-tertiary" },
  { name: "فرع رهط الرئيسي", place: "طريق السلام العام", kind: "معرض بيع", kindClass: "bg-tertiary-fixed text-on-tertiary-fixed", qty: "820", pct: "82%", width: "82%", bar: "bg-tertiary-container", pctClass: "text-tertiary", cap: "سعة التخزين: 1,000", free: "متاح: 180", freeClass: "text-on-surface" },
  { name: "فرع شقيب السلام", place: "المركز التجاري", kind: "معرض بيع", kindClass: "bg-surface-container-high text-on-surface-variant", qty: "490", pct: "61%", width: "61%", bar: "bg-primary-container", pctClass: "text-primary", cap: "سعة التخزين: 800", free: "متاح: 310", freeClass: "text-tertiary" },
  { name: "فرع حورة", place: "شارع السلام", kind: "منخفض", kindClass: "bg-error-container text-on-error-container", qty: "260", pct: "43%", width: "43%", bar: "bg-error", pctClass: "text-error", cap: "سعة التخزين: 600", free: "يحتاج تعزيز مخزون", freeClass: "text-error" },
];

function kindOf(move) {
  if (move.type.includes("إرجاع") || move.type.includes("مرتجع")) return "return";
  if (move.type.includes("وارد")) return "in";
  if (move.type.includes("صادر")) return "out";
  if (move.status.includes("طريق") || move.type.includes("توصيل")) return "transit";
  return "transfer";
}

const LOOK = {
  in: { icon: "south_east", box: "bg-tertiary-fixed text-on-tertiary-fixed", label: "text-tertiary", dest: "text-tertiary", row: "bg-surface-container-low/40" },
  out: { icon: "north_west", box: "bg-error-container text-on-error-container", label: "text-error", dest: "text-error", row: "" },
  transfer: { icon: "swap_horiz", box: "bg-secondary-fixed text-on-secondary-fixed", label: "text-secondary", dest: "text-secondary", row: "" },
  transit: { icon: "local_shipping", box: "bg-secondary text-white", label: "text-secondary", dest: "text-secondary", row: "bg-secondary-fixed/40" },
  return: { icon: "undo", box: "bg-surface-container-high text-on-surface", label: "text-on-surface-variant", dest: "text-on-surface", row: "" },
};

function statusLook(move) {
  if (move.status.includes("طريق")) return { box: "bg-secondary-fixed text-on-secondary-fixed", icon: "sync", spin: true };
  if (move.status.includes("مطابقة")) return { box: "bg-tertiary-fixed text-on-tertiary-fixed", icon: "done_all" };
  if (move.status.includes("POS")) return { box: "bg-surface-container-high text-on-surface", icon: "receipt" };
  if (move.status.includes("استلام") || move.status.includes("جرد")) return { box: "bg-tertiary-fixed text-on-tertiary-fixed", icon: "check_circle" };
  return { box: "bg-surface-container text-on-surface-variant", icon: "info" };
}

export default function Inventory() {
  const { db, query, flash } = useStore();
  const [filter, setFilter] = useState("all");
  const [scan, setScan] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 4;

  const moves = useMemo(() => db.moves.filter((move) => {
    const kind = kindOf(move);
    if (filter === "transfer" && kind !== "transfer" && kind !== "transit") return false;
    if (filter !== "all" && filter !== "transfer" && kind !== filter) return false;
    const blob = `${move.id} ${move.title} ${move.detail} ${move.who} ${move.from} ${move.to}`.toLowerCase();
    return !query || blob.includes(query.trim().toLowerCase());
  }), [db.moves, filter, query]);

  const pages = Math.max(1, Math.ceil(moves.length / pageSize));
  const safePage = Math.min(page, pages);
  const start = (safePage - 1) * pageSize;
  const visible = moves.slice(start, start + pageSize);

  function confirmScan(event) {
    event.preventDefault();
    const term = scan.trim();
    if (!term) return;
    const hit = db.products.find((product) => [product.barcode, product.imei, product.sku].includes(term));
    flash(hit ? `تمت مطابقة ${hit.name}` : `لا يوجد جهاز بالكود ${term}`);
    setScan("");
  }

  return (
    <div className="py-6 flex flex-col gap-5">
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold">مزامنة حية</span>
            <span className="text-[13px] text-outline font-bold nums">IMEI-TRACK v2.4</span>
          </div>
          <h1 className="text-[28px] font-extrabold tracking-tight">إدارة المخزون والمستودعات</h1>
          <p className="text-[14px] text-on-surface-variant">نظام تتبع الأجهزة بالأرقام التسلسلية IMEI والتحكم اللوجستي متعدد الفروع</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => flash("إذن التوريد يُحفظ مع ربط Firebase")} className="flex items-center gap-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface px-4 py-2.5 rounded-lg text-[14px] font-bold active:scale-95">
            <Icon name="inventory" className="text-tertiary" /> + إذن توريد جديد / استلام شحنة
          </button>
          <button type="button" onClick={() => flash("تحويل البضاعة بين الفروع تجريبي حالياً")} className="flex items-center gap-1.5 bg-primary-container hover:bg-on-primary-container text-white px-4 py-2.5 rounded-lg text-[14px] font-bold active:scale-95">
            <Icon name="swap_horiz" /> + تحويل بضاعة بين الفروع
          </button>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <article className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-bold text-on-surface-variant">إجمالي القطع بالمخزون</p>
              <p className="text-[36px] leading-none font-black nums mt-1">3,420</p>
              <p className="text-[10px] font-semibold text-on-surface-variant mt-1">جهاز ذكي وملحق تقني معتمد</p>
            </div>
            <span className="w-12 h-12 rounded-xl bg-primary-fixed text-on-primary-fixed grid place-items-center"><Icon name="warehouse" /></span>
          </div>
          <div className="mt-4 bg-surface-container-low rounded-lg px-3 py-2 flex items-center justify-between">
            <span className="text-[10px] font-bold text-on-surface-variant">القيمة التقديرية الحالية</span>
            <span className="text-[12px] font-extrabold text-primary nums">2,840,000 ₪</span>
          </div>
        </article>
        <article className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-bold text-on-surface-variant">عمليات التحويل النشطة</p>
              <p className="text-[36px] leading-none font-black text-secondary nums mt-1">3 <span className="text-[16px] font-bold">شحنات</span></p>
              <p className="text-[10px] font-semibold text-on-surface-variant mt-1">قيد النقل والتسليم المتبادل</p>
            </div>
            <span className="w-12 h-12 rounded-xl bg-secondary-fixed text-on-secondary-fixed grid place-items-center"><Icon name="local_shipping" /></span>
          </div>
          <div className="mt-4 bg-surface-container-low rounded-lg px-3 py-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold"><span className="w-2 h-2 rounded-full bg-secondary animate-ping" />جاري التتبع عبر GPS</span>
            <span className="text-[10px] font-extrabold text-secondary">المناديب: 2</span>
          </div>
        </article>
        <article className="bg-white p-6 rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[12px] font-bold text-on-surface-variant">تنبيهات الجرد الدوري</p>
              <p className="text-[36px] leading-none font-black text-tertiary nums mt-1">98.4%</p>
              <p className="text-[10px] font-semibold text-on-surface-variant mt-1">تمت مطابقة الأرقام التسلسلية</p>
            </div>
            <span className="w-12 h-12 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed grid place-items-center"><Icon name="verified_user" /></span>
          </div>
          <div className="mt-4 bg-surface-container-low rounded-lg px-3 py-2 flex items-center justify-between">
            <span className="text-[10px] font-bold text-on-surface-variant">انحراف الجرد الأسبوعي</span>
            <span className="text-[10px] font-extrabold text-tertiary bg-tertiary-fixed/40 px-2 py-0.5 rounded-full">آمن (أقل من 0.2%)</span>
          </div>
        </article>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Icon name="domain" className="text-primary-container text-[26px]" />
            <h2 className="text-[18px] font-extrabold">مستويات المخزون حسب الفروع</h2>
          </div>
          <span className="text-[10px] font-semibold text-on-surface-variant">السعة الاستيعابية للمنافذ والمستودعات</span>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {LEVELS.map((level) => (
            <article key={level.name} className="bg-white p-4 rounded-xl shadow-sm flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[16px] font-bold">{level.name}</p>
                  <p className="text-[10px] text-outline">{level.place}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${level.kindClass}`}>{level.kind}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <p className="text-[28px] font-black nums leading-none">{level.qty} <span className="text-[12px] font-medium text-on-surface-variant">قطعة</span></p>
                <span className={`text-[12px] font-bold nums ${level.pctClass}`}>{level.pct} ممتلئ</span>
              </div>
              <div className="h-2.5 rounded-full bg-surface-container-high overflow-hidden">
                <div className={`h-full rounded-full ${level.bar}`} style={{ width: level.width }} />
              </div>
              <div className="flex items-center justify-between text-[10px] text-on-surface-variant">
                <span>{level.cap}</span>
                <span className={`font-bold ${level.freeClass}`}>{level.free}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <form onSubmit={confirmScan} className="relative overflow-hidden rounded-xl bg-[#293040] text-[#edf0ff] p-6 shadow-md flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4 relative z-10">
          <span className="w-14 h-14 rounded-xl bg-primary-container text-white grid place-items-center shrink-0"><Icon name="barcode_scanner" className="text-[30px]" /></span>
          <div>
            <p className="text-[16px] font-bold">وضع الجرد السريع بالماسح الضوئي اللاسلكي</p>
            <p className="text-[12px] text-[#dce2f7]">اربط قارئ الباركود لمطابقة الأجهزة وتحديث الأرصدة. المطابقة الحالية تتم على البيانات التجريبية.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto relative z-10">
          <label className="relative flex-1 md:w-64">
            <Icon name="qr_code" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#dce2f7] text-[18px]" />
            <input value={scan} onChange={(event) => setScan(event.target.value)} placeholder="مسح IMEI أو الكود التسلسلي..." className="w-full bg-white/10 text-[#edf0ff] placeholder:text-[#dce2f7] text-[12px] font-semibold pr-9 pl-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-container" />
          </label>
          <button type="submit" className="bg-primary-container text-white text-[12px] font-bold px-4 py-2.5 rounded-lg">تأكيد المسح</button>
        </div>
      </form>

      <section className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Icon name="history" className="text-secondary text-[26px]" />
            <h2 className="text-[18px] font-extrabold">سجل حركة المخزون المباشر</h2>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-surface-container-low rounded-lg">
            {FILTERS.map((item) => (
              <button key={item.id} type="button" onClick={() => { setFilter(item.id); setPage(1); }} className={`px-3 py-1.5 rounded text-[12px] font-bold inline-flex items-center gap-1 ${filter === item.id ? "bg-white text-on-surface shadow-sm" : "text-on-surface-variant"}`}>
                {item.dot && <span className={`w-2 h-2 rounded-full ${item.dot}`} />}
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right min-w-[980px]">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-[12px] font-semibold">
                {["النوع والرقم المرجعي", "تفاصيل الحركة والأصناف المنقولة", "المسار (من / إلى)", "المسؤول / الموظف", "التوقيت"].map((head) => (
                  <th key={head} className="py-3 px-4 font-semibold">{head}</th>
                ))}
                <th className="py-3 px-4 font-semibold text-center">الحالة الإجرائية</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((move) => {
                const look = LOOK[kindOf(move)];
                const status = statusLook(move);
                const courier = move.who.startsWith("مندوب");
                return (
                  <tr key={move.id} className={`hover:bg-surface-container-low/60 ${look.row}`}>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-8 h-8 rounded-lg grid place-items-center shrink-0 ${look.box}`}><Icon name={look.icon} className="text-[18px]" /></span>
                        <div>
                          <p className={`text-[12px] font-bold ${look.label}`}>{move.type}</p>
                          <p className="text-[13px] text-outline font-semibold nums">#{move.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-[16px] font-bold">{move.title}</p>
                      <p className="text-[10px] text-on-surface-variant nums">{move.detail}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-[12px] font-medium">
                        <span>{move.from}</span>
                        <Icon name="arrow_left" className="text-outline text-[16px]" />
                        <span className={`font-bold ${look.dest}`}>{move.to}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {courier ? <Icon name="directions_car" className="text-secondary text-[18px]" /> : <span className="w-7 h-7 rounded-full bg-surface-container-high text-[10px] font-bold grid place-items-center">{move.who[0]}</span>}
                        <span className="text-[12px] font-bold">{move.who}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4"><span className="text-[13px] text-outline nums">{move.when}</span></td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${status.box}`}>
                        <Icon name={status.icon} className={`text-[14px] ${status.spin ? "animate-spin" : ""}`} />
                        {move.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {!visible.length && <tr><td colSpan={6} className="py-8 text-center text-on-surface-variant">لا حركات ضمن هذا التصنيف</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-on-surface-variant">
          <span>عرض <b className="text-on-surface nums">{moves.length ? start + 1 : 0} إلى {Math.min(start + pageSize, moves.length)}</b> من إجمالي <b className="text-on-surface nums">{moves.length} عملية حركة</b> في هذه النسخة التجريبية</span>
          <div className="flex items-center gap-1">
            <button type="button" disabled={safePage === 1} onClick={() => setPage(safePage - 1)} className="w-8 h-8 rounded-lg bg-surface-container-low disabled:opacity-40 grid place-items-center"><Icon name="chevron_right" className="text-[16px]" /></button>
            {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
              <button key={number} type="button" onClick={() => setPage(number)} className={`w-8 h-8 rounded-lg text-[10px] font-bold nums ${number === safePage ? "bg-primary-container text-white" : "bg-surface-container-low text-on-surface-variant"}`}>{number}</button>
            ))}
            <button type="button" disabled={safePage === pages} onClick={() => setPage(safePage + 1)} className="w-8 h-8 rounded-lg bg-surface-container-low disabled:opacity-40 grid place-items-center"><Icon name="chevron_left" className="text-[16px]" /></button>
          </div>
        </div>
      </section>
    </div>
  );
}

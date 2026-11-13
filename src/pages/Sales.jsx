import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { branchName } from "../data/seed";
import { Icon, Modal } from "../components/ui";

const selectClass = "w-full appearance-none bg-surface-container-low text-on-surface text-[12px] font-semibold pr-10 pl-8 py-2.5 rounded-xl cursor-pointer focus:outline-none focus:bg-white";

const PAYS = [
  ["all", "كل طرق الدفع"],
  ["card", "بطاقة ائتمان / إلكترونية"],
  ["visa", "فيزا / ماستركارد"],
  ["cash", "نقداً (كاش الصندوق)"],
  ["installments", "تقسيط محلي / دفعات"],
  ["bank", "تحويل بنكي"],
];

function dec(n) {
  return Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function stamp(at) {
  const date = new Date(at);
  if (Number.isNaN(date.getTime())) return { day: at, time: "" };
  const day = date.toLocaleDateString("en-GB");
  const time = date.toLocaleTimeString("en-GB", { hour12: false });
  return { day, time: `${time} ${date.getHours() >= 12 ? "م" : "ص"}` };
}

function inRange(invoice, range) {
  const day = String(invoice.at || "").slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);
  if (range === "all") return true;
  if (range === "today") return day === "2024-10-24" || day === today || invoice.live;
  if (range === "yesterday") return day === "2024-10-23";
  if (range === "month") return day.startsWith("2024-10") || day.startsWith(today.slice(0, 7));
  const age = Date.now() - new Date(invoice.at).getTime();
  return age >= 0 && age < 8 * 86400000;
}

function payKey(pay) {
  if (pay.includes("تقسيط")) return "installments";
  if (pay.includes("فيزا")) return "visa";
  if (pay.includes("نقد")) return "cash";
  if (pay.includes("تحويل")) return "bank";
  if (pay.includes("بطاقة")) return "card";
  return "other";
}

function payLook(pay) {
  const key = payKey(pay);
  if (key === "installments") return ["bg-primary-fixed text-on-primary-fixed", "schedule"];
  if (key === "visa") return ["bg-secondary-fixed text-on-secondary-fixed", "credit_card"];
  if (key === "cash") return ["bg-surface-container text-on-surface", "payments"];
  if (key === "bank") return ["bg-surface-container text-on-surface", "account_balance"];
  return ["bg-surface-container text-on-surface", "contactless"];
}

function itemIcon(name) {
  if (/iPhone/i.test(name)) return ["phone_iphone", "text-primary-container"];
  if (/Galaxy|Samsung/i.test(name)) return ["smartphone", "text-secondary"];
  if (/AirPods|سماعة/i.test(name)) return ["headphones", "text-on-surface"];
  if (/Redmi|Xiaomi/i.test(name)) return ["phone_android", "text-primary-container"];
  if (/iPad/i.test(name)) return ["tablet_mac", "text-on-surface"];
  return ["devices", "text-on-surface"];
}

function splitName(name) {
  const match = String(name).match(/^(.*?)(\s+\d+\s?GB.*)$/i);
  if (!match) return { title: name, chip: "" };
  return { title: match[1].trim(), chip: match[2].trim() };
}

function doneStatus(status) {
  return /مكتمل|معتمد/.test(status || "");
}

function round2(n) {
  return Math.round(Number(n || 0) * 100) / 100;
}

function pricingOf(invoice) {
  const lines = (invoice.items || []).map((item) => {
    const sold = round2(item.price);
    const list = round2(item.list != null ? item.list : item.price);
    const cost = item.cost == null ? null : round2(item.cost);
    return { ...item, sold, list, cost, discount: round2(list - sold) };
  });
  const base = round2(lines.reduce((sum, line) => sum + line.list, 0));
  const lineDiscount = round2(lines.reduce((sum, line) => sum + line.discount, 0));
  const discount = round2(lineDiscount + round2(invoice.discount));
  const actual = round2(base - discount);
  const cost = lines.length && lines.every((line) => line.cost != null)
    ? round2(lines.reduce((sum, line) => sum + line.cost, 0))
    : round2(Number(invoice.goods) - Number(invoice.profit));
  return { lines, cost, base, actual, discount, marked: discount > 0.004 };
}

function seesCost(session, staff) {
  if (!session) return false;
  const person = (staff || []).find((row) => row.id === session.id);
  if (person?.perms?.some((perm) => perm.includes("تكلفة"))) return true;
  return /صاحب|مدير/.test(session.role || "");
}

export default function Sales() {
  const { db, query, flash, session } = useStore();
  const navigate = useNavigate();
  const [localQuery, setLocalQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [range, setRange] = useState("today");
  const [branch, setBranch] = useState("all");
  const [seller, setSeller] = useState("all");
  const [pay, setPay] = useState("all");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [autoPrint, setAutoPrint] = useState(true);
  const [preview, setPreview] = useState(null);
  const [pricing, setPricing] = useState(null);
  const admin = seesCost(session, db.staff);

  const sellers = useMemo(() => [...new Set(db.invoices.map((invoice) => invoice.seller))], [db.invoices]);

  const base = useMemo(() => db.invoices.filter((invoice) => {
    if (!inRange(invoice, range)) return false;
    if (branch !== "all" && invoice.branch !== branch) return false;
    if (seller !== "all" && invoice.seller !== seller) return false;
    if (pay !== "all" && payKey(invoice.pay) !== pay) return false;
    const term = (localQuery || query).trim().toLowerCase();
    const blob = `${invoice.id} ${invoice.seller} ${invoice.phone || ""} ${invoice.customer || ""} ${invoice.items.map((item) => `${item.name} ${item.detail}`).join(" ")}`.toLowerCase();
    return !term || blob.includes(term);
  }), [db.invoices, range, branch, seller, pay, localQuery, query]);

  const counts = {
    all: base.length,
    done: base.filter((invoice) => doneStatus(invoice.status)).length,
    partial: base.filter((invoice) => /جزئ/.test(invoice.status || "")).length,
    back: base.filter((invoice) => /مرتجع|ملغ/.test(invoice.status || "")).length,
  };

  const rows = base.filter((invoice) => {
    if (status === "done") return doneStatus(invoice.status);
    if (status === "partial") return /جزئ/.test(invoice.status || "");
    if (status === "back") return /مرتجع|ملغ/.test(invoice.status || "");
    return true;
  });

  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, pages);
  const start = (safePage - 1) * pageSize;
  const visible = rows.slice(start, start + pageSize);

  return (
    <div className="py-6 flex flex-col gap-5">
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-[28px] font-extrabold">سجل المبيعات والطلبات</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold">مباشر • Real-time</span>
          </div>
          <p className="text-[14px] text-outline">تتبع لحظي لفواتير نقاط البيع، أرباح الهواتف وملحقاتها، وهوامش الربح التشغيلية</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => flash("تخصيص الأعمدة يُحفظ مع ربط Firebase")} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-container-low text-[12px] font-semibold shadow-sm">
            <Icon name="tune" className="text-[18px]" /> تخصيص الأعمدة
          </button>
          <button type="button" onClick={() => flash("تصدير Excel تجريبي")} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-container-low text-secondary text-[12px] font-semibold shadow-sm">
            <Icon name="download" className="text-[18px]" /> تصدير Excel / تقارير
          </button>
          <button type="button" onClick={() => navigate("/pos")} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary-container text-white text-[12px] font-bold shadow-md active:scale-95">
            <Icon name="point_of_sale" className="text-[18px]" /> فاتورة نقدية سريعة
          </button>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <article className="relative overflow-hidden rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-outline">إجمالي مبيعات اليوم</p>
              <p className="text-[36px] leading-none font-extrabold nums mt-1">48,650 <span className="text-[12px] text-outline">₪</span></p>
            </div>
            <span className="w-11 h-11 rounded-xl bg-primary-fixed text-primary grid place-items-center"><Icon name="payments" /></span>
          </div>
          <div className="mt-4 flex items-center justify-between text-[10px]">
            <span className="inline-flex items-center gap-1 text-tertiary font-bold"><Icon name="trending_up" className="text-[16px]" />+14.2% <span className="font-normal text-outline">مقارنة بأمس</span></span>
            <span className="text-outline nums">ضريبة 15%: 6,345 ₪</span>
          </div>
        </article>
        <article className="relative overflow-hidden rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-outline">إجمالي الأرباح الصافية</p>
              <p className="text-[36px] leading-none font-extrabold text-tertiary nums mt-1">11,820 <span className="text-[12px] text-outline">₪</span></p>
            </div>
            <span className="w-11 h-11 rounded-xl bg-surface-container-high text-tertiary grid place-items-center"><Icon name="query_stats" /></span>
          </div>
          <div className="mt-4 flex items-center justify-between text-[10px]">
            <span className="inline-flex items-center gap-1.5"><span className="px-1.5 py-0.5 rounded bg-surface-container-high text-tertiary font-bold nums">24.29%</span><span className="text-outline">هامش الربح العام</span></span>
            <span className="text-tertiary">أعلى ربح: ملحقات مغناطيسية</span>
          </div>
        </article>
        <article className="rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-outline">عدد الفواتير المنفذة</p>
              <p className="text-[36px] leading-none font-extrabold nums mt-1">32 <span className="text-[12px] text-outline">عملية مكتملة</span></p>
            </div>
            <span className="w-11 h-11 rounded-xl bg-secondary-fixed text-secondary grid place-items-center"><Icon name="receipt_long" /></span>
          </div>
          <div className="mt-4 flex items-center justify-between text-[10px]">
            <span className="inline-flex items-center gap-1 text-secondary font-bold"><Icon name="check_circle" className="text-[16px]" />0 مرتجعات اليوم</span>
            <span className="text-outline nums">ذروة البيع: 18:00 - 20:00</span>
          </div>
        </article>
        <article className="rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-outline">متوسط قيمة الفاتورة</p>
              <p className="text-[36px] leading-none font-extrabold nums mt-1">1,520 <span className="text-[12px] text-outline">₪ / فاتورة</span></p>
            </div>
            <span className="w-11 h-11 rounded-xl bg-surface-container grid place-items-center"><Icon name="shopping_basket" /></span>
          </div>
          <div className="mt-4 flex items-center justify-between text-[10px]">
            <span className="inline-flex items-center gap-1 text-primary font-bold"><Icon name="add_circle" className="text-[16px]" />1.8 صنف / عملية</span>
            <span className="text-outline">معدل الإرفاق: 68%</span>
          </div>
        </article>
      </section>

      <section className="rounded-xl bg-white p-4 shadow-sm flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          <label className="relative flex-1">
            <Icon name="manage_search" className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-container" />
            <input value={localQuery} onChange={(event) => { setLocalQuery(event.target.value); setPage(1); }} placeholder="بحث سريع: برقم الفاتورة #INV، جوال العميل، أو مسح الباركود التسلسلي IMEI..." className="w-full pr-11 pl-24 py-3 bg-surface-container-low rounded-xl text-[14px] placeholder:text-outline focus:outline-none focus:bg-white focus:shadow-md" />
            <span className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <button type="button" title="مسح باركود" onClick={() => flash("ماسح الباركود يُربط لاحقاً")} className="p-1.5 rounded-lg bg-white text-primary-container"><Icon name="barcode_scanner" className="text-[18px]" /></button>
              <kbd className="px-2 py-0.5 text-[10px] text-outline bg-white rounded">Esc</kbd>
            </span>
          </label>
          <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-xl overflow-x-auto">
            {[
              ["all", `الكل (${counts.all})`],
              ["done", `مكتملة (${counts.done})`],
              ["partial", `مدفوعة جزئياً (${counts.partial})`],
              ["back", `مرتجع / ملغي (${counts.back})`],
            ].map(([id, label]) => (
              <button key={id} type="button" onClick={() => { setStatus(id); setPage(1); }} className={`px-3.5 py-1.5 rounded-lg text-[12px] whitespace-nowrap ${status === id ? "bg-white font-bold shadow-sm" : "text-outline"}`}>{label}</button>
            ))}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <label className="block">
            <span className="block text-[10px] text-outline font-bold mb-1">نطاق التاريخ</span>
            <span className="relative flex items-center">
              <Icon name="calendar_today" className="absolute right-3 text-on-surface-variant text-[18px]" />
              <select value={range} onChange={(event) => { setRange(event.target.value); setPage(1); }} className={selectClass}>
                <option value="today">اليوم: 24 أكتوبر 2024</option>
                <option value="yesterday">أمس (23 أكتوبر)</option>
                <option value="last7">آخر 7 أيام</option>
                <option value="month">هذا الشهر (أكتوبر)</option>
                <option value="all">كل الفترات</option>
              </select>
              <Icon name="expand_more" className="absolute left-2 text-outline text-[16px]" />
            </span>
          </label>
          <label className="block">
            <span className="block text-[10px] text-outline font-bold mb-1">الفرع</span>
            <span className="relative flex items-center">
              <Icon name="storefront" className="absolute right-3 text-secondary text-[18px]" />
              <select value={branch} onChange={(event) => { setBranch(event.target.value); setPage(1); }} className={selectClass}>
                <option value="all">جميع الفروع (مجمّع)</option>
                <option value="rahat">فرع رهط الرئيسي</option>
                <option value="segev">فرع شقيب السلام</option>
                <option value="hura">فرع حورة</option>
              </select>
              <Icon name="expand_more" className="absolute left-2 text-outline text-[16px]" />
            </span>
          </label>
          <label className="block">
            <span className="block text-[10px] text-outline font-bold mb-1">الموظف البائع</span>
            <span className="relative flex items-center">
              <Icon name="badge" className="absolute right-3 text-primary-container text-[18px]" />
              <select value={seller} onChange={(event) => { setSeller(event.target.value); setPage(1); }} className={selectClass}>
                <option value="all">جميع الموظفين</option>
                {sellers.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
              <Icon name="expand_more" className="absolute left-2 text-outline text-[16px]" />
            </span>
          </label>
          <label className="block">
            <span className="block text-[10px] text-outline font-bold mb-1">طريقة الدفع</span>
            <span className="relative flex items-center">
              <Icon name="credit_card" className="absolute right-3 text-on-surface-variant text-[18px]" />
              <select value={pay} onChange={(event) => { setPay(event.target.value); setPage(1); }} className={selectClass}>
                {PAYS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
              </select>
              <Icon name="expand_more" className="absolute left-2 text-outline text-[16px]" />
            </span>
          </label>
        </div>
      </section>

      <section className="rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 bg-surface-container-low flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[16px] font-bold">سجل العمليات التفصيلي</span>
            <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant text-[13px] font-bold nums">عرض {visible.length} من أصل {rows.length} فاتورة</span>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-outline">
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-error" />خصم: البيع أقل من السعر الأساسي</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary" />سعر التكلفة للمدير فقط</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right min-w-[1480px] text-[12px]">
            <thead>
              <tr className="text-outline text-[12px] font-bold">
                {["الفاتورة / التوقيت", "البائع والفرع", "الأصناف المبيعة والأجهزة"].map((head) => (
                  <th key={head} className="py-3.5 px-4">{head}</th>
                ))}
                <th className="py-3.5 px-4 text-left bg-primary-fixed/40">
                  <span className="block text-on-surface">سعر التكلفة</span>
                  <span className="block text-[10px] font-bold text-primary">للمدير فقط</span>
                </th>
                <th className="py-3.5 px-4 text-left bg-primary-fixed/40">سعر البيع الأساسي</th>
                <th className="py-3.5 px-4 text-left bg-primary-fixed/40">سعر البيع الفعلي</th>
                <th className="py-3.5 px-4 text-left bg-primary-fixed/40">الخصم</th>
                {["قيمة السلع", "الإجمالي (+الضريبة)", "صافي الربح"].map((head) => (
                  <th key={head} className="py-3.5 px-4 text-left">{head}</th>
                ))}
                <th className="py-3.5 px-4 text-center">الدفع والحالة</th>
                <th className="py-3.5 px-4 text-center">الإجراءات السريعة</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((invoice) => {
                const when = stamp(invoice.at);
                const [main, ...rest] = invoice.items;
                const named = splitName(main?.name || "");
                const [icon, iconClass] = itemIcon(main?.name || "");
                const [payClass, payIcon] = payLook(invoice.pay);
                const b2b = invoice.kind === "B2B";
                const money = pricingOf(invoice);
                return (
                  <tr key={invoice.id} className="hover:bg-surface-container-low align-top">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5">
                        <button type="button" onClick={() => setPreview(invoice)} className="text-[13px] font-bold text-secondary nums hover:underline">#{invoice.id}</button>
                        <span className={`px-1.5 rounded text-[10px] ${b2b ? "bg-secondary-fixed text-on-secondary-fixed font-bold" : "bg-surface-container-high text-on-surface-variant"}`}>{b2b ? "مؤسسة B2B" : invoice.kind || "B2C"}</span>
                      </div>
                      <p className="text-[10px] text-outline mt-1">{when.day}</p>
                      <p className="text-[13px] text-on-surface-variant nums">{when.time}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-[12px] font-bold">{invoice.seller}</p>
                      <p className="text-[10px] text-outline mt-0.5">{branchName(invoice.branch)}</p>
                      {invoice.phone && <p className="text-[10px] text-on-surface-variant mt-1 inline-flex items-center gap-1"><Icon name="call" className="text-[14px] text-outline" /><span className="nums">{invoice.phone}</span></p>}
                      {invoice.customer && <p className={`text-[10px] mt-1 inline-flex items-center gap-1 ${b2b ? "text-secondary font-bold" : "text-on-surface-variant"}`}>{!b2b && <Icon name="person" className="text-[14px] text-outline" />}{invoice.customer}</p>}
                    </td>
                    <td className="py-4 px-4 max-w-xs">
                      <div className="flex items-start gap-2">
                        <span className={`w-8 h-8 rounded-lg bg-surface-container grid place-items-center shrink-0 ${iconClass}`}><Icon name={icon} className="text-[16px]" /></span>
                        <div>
                          <p className="text-[12px] font-bold">{named.title} {named.chip && <span className="px-1.5 rounded-full bg-surface-container-high text-[13px] font-medium nums">{named.chip}</span>}</p>
                          {main?.detail && <p className="text-[13px] text-secondary nums mt-0.5">{main.detail}</p>}
                        </div>
                      </div>
                      {rest.map((item) => (
                        <p key={item.name} className="flex items-center gap-2 mt-2 text-[10px] text-on-surface-variant">
                          <Icon name="subdirectory_arrow_left" className="text-[14px] text-outline" />
                          {item.name} {item.detail}
                        </p>
                      ))}
                    </td>
                    <td className="py-4 px-4 text-left bg-primary-fixed/25">
                      {admin ? (
                        <p className="font-bold nums whitespace-nowrap">{dec(money.cost)} ₪</p>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-outline" title="سعر التكلفة للمدير فقط"><Icon name="lock" className="text-[14px]" />للمدير فقط</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-left bg-primary-fixed/25">
                      <p className="font-bold nums whitespace-nowrap">{dec(money.base)} ₪</p>
                    </td>
                    <td className="py-4 px-4 text-left bg-primary-fixed/25">
                      <p className="font-bold nums whitespace-nowrap">{dec(money.actual)} ₪</p>
                    </td>
                    <td className="py-4 px-4 text-left bg-primary-fixed/25">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg nums font-extrabold whitespace-nowrap ${money.marked ? "bg-error-container text-error" : "text-outline"}`}>
                        {money.marked && <Icon name="priority_high" className="text-[14px]" />}
                        {dec(money.discount)} ₪
                      </span>
                    </td>
                    <td className="py-4 px-4 text-left">
                      <p className="font-bold nums">{dec(invoice.goods)} ₪</p>
                      <p className="text-[10px] text-outline nums">{invoice.items.map((item) => dec(item.price)).join(" + ")}</p>
                    </td>
                    <td className="py-4 px-4 text-left">
                      <p className="text-[18px] font-extrabold nums">{dec(invoice.total)}</p>
                      <p className="text-[10px] text-outline nums">شامل {dec(invoice.tax)} ضريبة</p>
                    </td>
                    <td className="py-4 px-4 text-left">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-high text-tertiary font-extrabold nums">
                        <Icon name="arrow_drop_up" className="text-[16px]" />+{dec(invoice.profit)} ₪
                      </span>
                      <p className="text-[10px] text-tertiary font-bold mt-1 nums">هامش: {invoice.margin}%</p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${payClass}`}><Icon name={payIcon} className="text-[14px]" />{invoice.pay}</span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-tertiary text-[10px] font-bold inline-flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-tertiary" />{invoice.status}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        <button type="button" title="تفاصيل الأسعار" aria-label="تفاصيل الأسعار" onClick={() => setPricing(invoice)} className="p-2 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-primary-container hover:text-white"><Icon name="visibility" className="text-[18px]" /></button>
                        <button type="button" title="معاينة الفاتورة" onClick={() => setPreview(invoice)} className="p-2 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-primary-container hover:text-white"><Icon name="receipt" className="text-[18px]" /></button>
                        <button type="button" title="فاتورة PDF" onClick={() => flash(`PDF ${invoice.id} تجريبي`)} className="p-2 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-secondary-fixed hover:text-secondary"><Icon name="picture_as_pdf" className="text-[18px]" /></button>
                        <button type="button" title="إرجاع أو استبدال" onClick={() => flash(`طلب إرجاع ${invoice.id} تجريبي`)} className="p-2 rounded-lg bg-surface-container-low text-on-surface-variant hover:bg-error-container hover:text-on-error-container"><Icon name="keyboard_return" className="text-[18px]" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!visible.length && <tr><td colSpan={12} className="py-8 text-center text-outline">لا فواتير ضمن هذا التصفية</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-outline">
          <label className="flex items-center gap-2">عرض
            <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }} className="bg-surface-container-low text-on-surface rounded-lg px-2 py-1 font-bold">
              {[5, 10, 25, 50, 100].map((size) => <option key={size} value={size}>{size} فواتير</option>)}
            </select>
            من أصل {rows.length} فاتورة
          </label>
          <div className="flex items-center gap-1">
            <button type="button" disabled={safePage === 1} onClick={() => setPage(safePage - 1)} className="w-8 h-8 rounded-lg bg-surface-container-low disabled:opacity-40 grid place-items-center"><Icon name="chevron_right" className="text-[16px]" /></button>
            {Array.from({ length: pages }, (_, index) => index + 1).slice(0, 4).map((number) => (
              <button key={number} type="button" onClick={() => setPage(number)} className={`w-8 h-8 rounded-lg text-[13px] font-bold nums ${number === safePage ? "bg-primary-container text-white" : "bg-surface-container-low"}`}>{number}</button>
            ))}
            <button type="button" disabled={safePage === pages} onClick={() => setPage(safePage + 1)} className="w-8 h-8 rounded-lg bg-surface-container-low disabled:opacity-40 grid place-items-center"><Icon name="chevron_left" className="text-[16px]" /></button>
          </div>
        </div>
      </section>

      <section className="grid lg:grid-cols-3 gap-4">
        <article className="rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-lg bg-surface-container text-primary-container grid place-items-center"><Icon name="account_balance_wallet" className="text-[20px]" /></span>
              <div><p className="text-[16px] font-bold">قنوات الدفع اليومية</p><p className="text-[10px] text-outline">توزيع السيولة والتحصيلات</p></div>
            </div>
            <span className="text-[13px] font-bold text-secondary nums">32 عملية</span>
          </div>
          <div className="mt-5 h-3 w-full rounded-full bg-surface-container overflow-hidden flex">
            <div className="h-full bg-secondary" style={{ width: "58%" }} />
            <div className="h-full bg-primary-container" style={{ width: "24%" }} />
            <div className="h-full bg-tertiary-container" style={{ width: "12%" }} />
            <div className="h-full bg-surface-dim" style={{ width: "6%" }} />
          </div>
          <div className="grid grid-cols-1 gap-2 pt-3 text-[10px]">
            {[
              ["bg-secondary", "بطاقات ائتمان / شيك: 28,217 ₪ (58%)"],
              ["bg-primary-container", "تقسيط محلي / دفعات: 11,676 ₪ (24%)"],
              ["bg-tertiary-container", "نقدي (كاش): 5,838 ₪ (12%)"],
              ["bg-surface-dim", "فيزا وماستركارد: 2,919 ₪ (6%)"],
            ].map(([dot, label]) => (
              <p key={label} className="flex items-center gap-2"><span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dot}`} />{label}</p>
            ))}
          </div>
        </article>
        <article className="rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-lg bg-surface-container text-tertiary grid place-items-center"><Icon name="star" className="text-[20px]" /></span>
              <div><p className="text-[16px] font-bold">أعلى الأجهزة والملحقات ربحاً</p><p className="text-[10px] text-outline">حسب الأرباح الصافية المحققة اليوم</p></div>
            </div>
            <span className="px-2 py-0.5 rounded bg-surface-container-high text-tertiary text-[10px] font-bold">أفضل ربحية</span>
          </div>
          <div className="mt-4 flex flex-col gap-2.5">
            {[
              ["#1", "iPhone 15 Pro Max 256GB", "+2,520 ₪ (3 وحدات)"],
              ["#2", "Galaxy S24 Ultra Titanium", "+1,920 ₪ (2 وحدات)"],
              ["#3", "كفرات وشواحن MagSafe أصلي", "+1,640 ₪ (14 قطعة)"],
            ].map(([rank, name, profit]) => (
              <div key={rank} className="flex items-center justify-between gap-2 py-1 bg-surface-container-low px-3 rounded-lg">
                <span className="inline-flex items-center gap-2"><b className="text-secondary nums">{rank}</b><span className="text-[12px] font-bold">{name}</span></span>
                <span className="text-[13px] font-extrabold text-tertiary nums shrink-0">{profit}</span>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-lg bg-surface-container text-primary grid place-items-center"><Icon name="print" className="text-[20px]" /></span>
              <div><p className="text-[16px] font-bold">إعدادات الطباعة اللحظية</p><p className="text-[10px] text-outline">طابعات الإيصالات عبر الشبكة</p></div>
            </div>
            <span className="inline-flex items-center gap-1 text-tertiary text-[10px] font-bold"><span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse" />Epson TM-T88 جاهزة</span>
          </div>
          <div className="mt-4 p-3 bg-surface-container-low rounded-xl flex items-center justify-between gap-3">
            <div>
              <p className="text-[12px] font-bold">طباعة تلقائية عند البيع</p>
              <p className="text-[10px] text-outline">نسخة للمحل + نسخة للعميل مع QR ضريبة</p>
            </div>
            <button type="button" aria-label="تفعيل الطباعة التلقائية" onClick={() => setAutoPrint((value) => !value)} className={`w-11 h-6 rounded-full relative p-0.5 ${autoPrint ? "bg-tertiary-container" : "bg-surface-container-high"}`}>
              <span className={`block w-5 h-5 bg-white rounded-full shadow transition ${autoPrint ? "-translate-x-5" : ""}`} />
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <button type="button" onClick={() => flash(autoPrint ? "الطابعات جاهزة على المنفذ 9100" : "الطباعة التلقائية متوقفة")} className="text-[10px] font-bold text-secondary inline-flex items-center gap-1"><Icon name="settings_ethernet" className="text-[14px]" />فحص حالة الطابعات</button>
            <span className="text-[13px] text-outline nums">Port: 9100 Direct</span>
          </div>
        </article>
      </section>

      {pricing && (() => {
        const money = pricingOf(pricing);
        return (
          <Modal title={`تفاصيل الأسعار · ${pricing.id}`} onClose={() => setPricing(null)}>
            <p className="text-[12px] text-outline mb-4">الخصم = سعر البيع الأساسي − سعر البيع الفعلي. سعر التكلفة يظهر لصاحب المحل والمدير فقط.{Number(pricing.discount) > 0 ? " خصم هذه الفاتورة مسجّل على إجماليها." : ""}</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                ["سعر التكلفة", admin ? `${dec(money.cost)} ₪` : "للمدير فقط", false],
                ["سعر البيع الأساسي", `${dec(money.base)} ₪`, false],
                ["سعر البيع الفعلي", `${dec(money.actual)} ₪`, false],
                ["الخصم", `${dec(money.discount)} ₪`, money.marked],
              ].map(([label, value, marked]) => (
                <div key={label} className={`rounded-xl px-3 py-2 ${marked ? "bg-error-container" : "bg-surface-container-low"}`}>
                  <p className="text-[11px] text-outline">{label}{label === "سعر التكلفة" && <span className="text-primary font-bold"> · للمدير فقط</span>}</p>
                  <p className={`text-[18px] font-extrabold nums ${marked ? "text-error" : ""}`}>{value}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              {money.lines.map((line) => (
                <div key={`${line.name}-${line.detail}`} className="rounded-xl border border-surface-container-high px-3 py-2">
                  <p className="font-bold text-[13px]">{line.name}</p>
                  <p className="text-[11px] text-outline nums">{line.detail}</p>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2 text-[12px]">
                    <p>التكلفة <b className="nums">{admin ? `${dec(line.cost)} ₪` : "للمدير فقط"}</b></p>
                    <p>الأساسي <b className="nums">{dec(line.list)} ₪</b></p>
                    <p>الفعلي <b className="nums">{dec(line.sold)} ₪</b></p>
                    <p className={line.discount > 0.004 ? "text-error font-bold" : ""}>الخصم <b className="nums">{dec(line.discount)} ₪</b></p>
                  </div>
                </div>
              ))}
            </div>
          </Modal>
        );
      })()}

      {preview && (
        <Modal title={`فاتورة ${preview.id}`} onClose={() => setPreview(null)}>
          <p className="text-[13px] text-outline mb-3">{preview.seller} · {branchName(preview.branch)} · {stamp(preview.at).day} {stamp(preview.at).time}</p>
          {preview.items.map((item) => (
            <div key={item.name} className="flex justify-between gap-3 py-2 border-t border-surface-container-low text-[13px]">
              <span>{item.name}<span className="block text-[11px] text-outline">{item.detail}</span></span>
              <span className="nums font-bold">{dec(item.price)} ₪</span>
            </div>
          ))}
          <p className="mt-3 text-[18px] font-extrabold nums">الإجمالي {dec(preview.total)} ₪</p>
          <p className="text-[12px] text-tertiary nums">الربح +{dec(preview.profit)} ₪ · هامش {preview.margin}%</p>
          <button type="button" onClick={() => { flash(`طُبعت ${preview.id} تجريبياً`); setPreview(null); }} className="mt-4 h-11 px-4 rounded-lg bg-primary-container text-white font-bold">طباعة حرارية</button>
        </Modal>
      )}
    </div>
  );
}

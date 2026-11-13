import { useMemo, useState } from "react";
import { useStore } from "../context/StoreContext";
import { Icon, Modal, fieldClass } from "../components/ui";

const FACE = {
  c1: { title: "رصيد العهدة النقدية لبداية اليومية", sub: "درج كاشير فرع رهط #01" },
  c2: { title: "فاتورة بيع كاش #INV-10490", sub: "سماعات AirPods Pro (الجيل الثاني)", icon: "headphones" },
  c3: { title: "شراء مستلزمات ضيافة وقهوة عربية للمحل", sub: "سند صرف #EX-102", voucher: true },
  c4: { title: "صيانة فورية لوحدة التكييف بصالة العرض", sub: "سند صرف #EX-103", voucher: true },
  c5: { title: "فاتورة بيع كاش #INV-10493", sub: "iPhone 15 Pro Max 256GB تيتانيوم طبيعي", icon: "smartphone" },
};

const AVATAR = {
  a1: "bg-primary-fixed text-on-primary-fixed-variant",
  a2: "bg-surface-container-high text-primary-container",
  a3: "bg-secondary-fixed text-secondary",
  a4: "bg-tertiary-fixed text-on-tertiary-fixed",
  a5: "bg-surface-container-high text-outline",
};

const TASKS = [
  "مطابقة رصيد الشبكة (POS Terminal)",
  "حصر سندات الصرف الورقية والتواقيع",
  "جرد هواتف العرض الذكية (Security tether)",
  "إيداع فائض الكاش بالخزنة الحديدية",
];

const IN_KINDS = ["مقبوضات بيع", "تغذية عهدة", "استرداد تأمين", "تسوية فروقات"];
const OUT_KINDS = ["مصروف تشغيلي", "مصروف طوارئ", "سلفة موظف", "تسوية فروقات"];

function money(value) {
  return Math.abs(value).toLocaleString("en-US");
}

function initials(name) {
  const parts = String(name).split(/\s+/).filter((word) => word && word !== "أبو" && word !== "ابن");
  const first = parts[0]?.[0] || "";
  const lastWord = parts[parts.length - 1] || "";
  const last = lastWord.replace(/^ال/, "")[0] || "";
  return parts.length > 1 ? `${first}.${last}` : first;
}

function faceOf(row) {
  if (FACE[row.id]) return FACE[row.id];
  const [title, sub] = String(row.detail || row.label).split("•").map((part) => part.trim());
  const blob = `${title} ${sub || ""}`;
  let icon = "";
  if (/سماع|AirPod/i.test(blob)) icon = "headphones";
  else if (/iPhone|هاتف|Galaxy|Samsung/i.test(blob)) icon = "smartphone";
  return { title: title || row.label, sub: sub || "", icon, voucher: /سند/.test(sub || "") };
}

function chipOf(row) {
  if (row.label.includes("افتتاح") || row.label.includes("عهدة")) return { icon: "vpn_key", box: "bg-secondary-fixed text-on-secondary-fixed" };
  if (row.kind === "out" && row.label.includes("طوارئ")) return { icon: "build", box: "bg-error-container text-on-error-container" };
  if (row.kind === "out") return { icon: "remove", box: "bg-error-container text-on-error-container" };
  return { icon: "add", box: "bg-surface-container-high text-tertiary" };
}

function amountTone(row) {
  if (row.kind === "out") return "text-error";
  if (row.label.includes("افتتاح") || row.label.includes("عهدة")) return "text-secondary";
  return "text-tertiary";
}

export default function Cash() {
  const { db, session, addCash, flash } = useStore();
  const [flow, setFlow] = useState("all");
  const [mode, setMode] = useState(null);
  const [askClose, setAskClose] = useState(false);
  const [closed, setClosed] = useState(false);
  const [tasks, setTasks] = useState([true, true, true, false]);

  const books = useMemo(() => {
    const openingRow = db.cash.find((row) => row.label.includes("افتتاح") || row.label.includes("عهدة"));
    const opening = openingRow?.amount || 0;
    const sales = db.cash.filter((row) => row.kind === "in" && row !== openingRow).reduce((sum, row) => sum + row.amount, 0);
    const expenses = db.cash.filter((row) => row.kind === "out").reduce((sum, row) => sum + row.amount, 0);
    const drawer = opening + sales - expenses;
    const ceiling = db.settings.cashCeiling || 15000;
    const ratio = Math.min(100, Math.round((drawer / ceiling) * 100));
    return { opening, sales, expenses, drawer, ceiling, ratio, slips: db.cash.filter((row) => row.kind === "out").length };
  }, [db.cash, db.settings.cashCeiling]);

  const rows = db.cash.filter((row) => {
    if (flow === "in") return row.kind === "in" && !row.label.includes("افتتاح");
    if (flow === "out") return row.kind === "out";
    return true;
  });

  const doneCount = tasks.filter(Boolean).length;

  function save(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const amount = Number(data.get("amount"));
    if (!amount) return;
    addCash({
      kind: mode,
      label: data.get("label"),
      detail: data.get("detail"),
      who: session?.name || "أنور أبو القيعان",
      role: "مدير الفرع",
      amount,
    });
    setMode(null);
  }

  return (
    <div className="py-6 flex flex-col gap-5">
      <section className="bg-white rounded-xl p-5 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary-container text-white grid place-items-center shadow-md">
            <Icon name="account_balance_wallet" className="text-[26px]" />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-outline flex items-center gap-1.5">
              سجل اليومية الميداني
              <span>•</span>
              <span className="text-tertiary">جلسة العمل رقم #DS-892</span>
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <h1 className="text-[22px] font-extrabold text-on-surface">إدارة الصندوق والحضور اليومي</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${closed ? "bg-surface-container-high text-outline" : "bg-tertiary-fixed text-on-tertiary-fixed"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${closed ? "bg-outline" : "bg-tertiary animate-pulse"}`} />
                {closed ? "مغلقة" : "مفتوح الآن"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-surface-container-low px-3 py-2 rounded-lg gap-2">
            <Icon name="calendar_month" className="text-primary-container text-[18px]" />
            <span className="text-[14px] font-bold">الخميس، 24 أكتوبر 2024</span>
            <button type="button" onClick={() => flash("اليومية مثبتة على الخميس 24 أكتوبر 2024")} className="text-on-surface-variant hover:text-on-surface">
              <Icon name="swap_horiz" className="text-[16px]" />
            </button>
          </div>
          <button type="button" onClick={() => flash("جاري تجهيز كشف ميزان اليومية #DS-892")} className="flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container px-3 py-2 rounded-lg text-[13px] font-bold">
            <Icon name="receipt" className="text-[18px]" />
            طباعة كشف ميزان اليومية
          </button>
          <button type="button" onClick={() => setAskClose(true)} className="flex items-center gap-1.5 bg-primary-container hover:bg-on-primary-container text-white px-4 py-2 rounded-lg text-[13px] font-bold shadow-sm">
            <Icon name="lock_clock" className="text-[18px]" />
            إغلاق الصندوق وترحيل اليومية
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
        <article className="bg-white rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[132px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-outline">الرصيد الافتتاحي (العهدة)</span>
            <span className="w-8 h-8 rounded-lg bg-surface-container-low text-secondary grid place-items-center"><Icon name="savings" className="text-[18px]" /></span>
          </div>
          <div>
            <p className="text-[26px] font-extrabold nums leading-none">{money(books.opening)} <span className="text-[12px] text-on-surface-variant">₪</span></p>
            <p className="text-[12px] text-on-surface-variant mt-1">تم التثبيت 09:00 ص</p>
          </div>
          <span className="absolute bottom-0 inset-x-0 h-1 bg-secondary-fixed" />
        </article>

        <article className="bg-white rounded-xl p-4 shadow-sm flex flex-col justify-between min-h-[132px]">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="flex items-center gap-1 text-[13px] font-bold"><Icon name="shield" className="text-primary-container text-[18px]" />سقف النقدية المسموح</span>
            <span className="text-[10px] font-bold text-outline nums">الحد: {money(books.ceiling)} ₪</span>
          </div>
          <p className="text-[12px] text-on-surface-variant leading-5">
            رصيدك الحالي (<b className="text-on-surface nums">{money(books.drawer)} ₪</b>) يمثل <b className="text-primary-container nums">{books.ratio}%</b> من حد الأمان. {books.ratio >= 80 ? "يلزم ترحيل جزئي الآن." : "لا يلزم ترحيل جزئي الآن."}
          </p>
          <div className="mt-2">
            <div className="h-2 rounded-full bg-surface-container-low overflow-hidden"><div className="h-full bg-primary-container rounded-full" style={{ width: `${books.ratio}%` }} /></div>
            <div className="flex justify-between mt-1.5 text-[10px] text-outline">
              <span>آمن</span>
              <span className="text-primary font-bold">{books.ratio >= 80 ? "قرب السقف" : "مستوى اعتيادي"}</span>
              <span>ترحيل إجباري</span>
            </div>
          </div>
        </article>

        <article className="bg-white rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[132px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-outline">مدفوعات ومصروفات (Cash Out)</span>
            <span className="w-8 h-8 rounded-lg bg-surface-container-low text-error grid place-items-center"><Icon name="arrow_upward" className="text-[18px]" /></span>
          </div>
          <div>
            <p className="text-[26px] font-extrabold nums leading-none text-error">-{money(books.expenses)} <span className="text-[12px] text-on-surface-variant">₪</span></p>
            <p className="text-[12px] text-error mt-1 flex items-center gap-1"><Icon name="receipt_long" className="text-[14px]" />{books.slips} سند صرف معتمد</p>
          </div>
          <span className="absolute bottom-0 inset-x-0 h-1 bg-error" />
        </article>

        <article className="rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[132px] bg-gradient-to-bl from-primary-fixed/40 to-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-primary">الرصيد الفعلي بالدرج</span>
            <span className="w-8 h-8 rounded-lg bg-primary-container text-white grid place-items-center shadow-sm"><Icon name="paid" className="text-[18px]" /></span>
          </div>
          <div>
            <p className="text-[26px] font-extrabold nums leading-none text-primary-container">{money(books.drawer)} <span className="text-[12px] text-primary">₪</span></p>
            <p className="text-[12px] text-on-surface-variant mt-1 flex items-center gap-1"><Icon name="check_circle" className="text-tertiary text-[14px]" />مطابق للنظام بنسبة 100%</p>
          </div>
          <span className="absolute bottom-0 inset-x-0 h-1 bg-primary-container" />
        </article>

        <article className="bg-white rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[132px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-outline">حضور طاقم العمل</span>
            <span className="w-8 h-8 rounded-lg bg-surface-container-low text-secondary grid place-items-center"><Icon name="badge" className="text-[18px]" /></span>
          </div>
          <div>
            <p className="text-[26px] font-extrabold nums leading-none">9 <span className="text-[16px] text-outline font-bold">/ 10</span> <span className="text-[12px] text-on-surface-variant font-bold">حاضرين</span></p>
            <p className="text-[12px] text-tertiary mt-1 flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tertiary" />90% نسبة التواجد الفعلي</p>
          </div>
          <span className="absolute bottom-0 inset-x-0 h-1 bg-tertiary" />
        </article>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 flex flex-col gap-4">
          <article className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-6 bg-secondary rounded-full" />
                <div>
                  <h2 className="text-[16px] font-extrabold">تحضير وانضباط الطاقم</h2>
                  <p className="text-[11px] text-outline">سجل الدوام والورديات - فرع رهط</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface-variant text-[11px] font-bold nums">10 موظفين</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 mb-4 text-center">
              {[["حاضر", "8", "text-tertiary"], ["متأخر", "1", "text-primary-container"], ["غائب", "0", "text-error"], ["إجازة", "1", "text-secondary"]].map(([label, value, tone]) => (
                <div key={label} className="bg-surface-container-low rounded-lg py-2">
                  <span className="block text-[11px] text-outline">{label}</span>
                  <span className={`text-[15px] font-extrabold nums ${tone}`}>{value}</span>
                </div>
              ))}
            </div>
            <ul className="flex flex-col gap-1.5">
              {db.attendance.map((row) => {
                const leave = row.state === "إجازة";
                const late = row.state === "متأخر";
                return (
                  <li key={row.id} className={`p-2.5 rounded-lg bg-surface-bright hover:bg-surface-container-low flex items-center justify-between gap-2 ${leave ? "opacity-80" : ""}`}>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative shrink-0">
                        <div className={`w-9 h-9 rounded-full grid place-items-center font-bold text-[13px] ${AVATAR[row.id] || "bg-surface-container-high text-on-surface"}`}>{initials(row.name)}</div>
                        {!leave && <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${late ? "bg-primary-container" : "bg-tertiary-container"}`} />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold truncate">{row.name} <span className="text-[11px] text-outline font-medium">({row.role})</span></p>
                        {leave ? (
                          <p className="text-[11px] text-outline">إجازة اعتيادية سنوية</p>
                        ) : (
                          <p className="text-[11px] text-outline flex items-center gap-2">
                            <span>دخول: <b className={`nums ${late ? "text-primary-container" : "text-on-surface"}`}>{row.inn}</b></span>
                            {late ? <b className="text-primary-container">{row.out}</b> : <span>خروج: <span className="nums text-outline-variant">{row.out}</span></span>}
                          </p>
                        )}
                      </div>
                    </div>
                    {leave ? (
                      <span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold shrink-0">إجازة رسمية</span>
                    ) : late ? (
                      <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold flex items-center gap-1 shrink-0"><Icon name="schedule" className="text-[13px]" />متأخر</span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-tertiary text-[11px] font-bold flex items-center gap-1 shrink-0"><Icon name="done_all" className="text-[13px]" />حاضر</span>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 p-3 rounded-xl bg-surface-container-low flex items-start gap-2">
              <Icon name="info" className="text-primary-container text-[18px] mt-0.5" />
              <div>
                <p className="text-[12px] font-bold">ملاحظات الانضباط اليومية المسجلة:</p>
                <p className="text-[12px] text-on-surface-variant leading-5">تأخير بعذر 15 دقيقة للموظف خالد الطوري بسبب ازدحام مروري على مفرق رهط الجنوبي، تم الاعتماد إدارياً.</p>
              </div>
            </div>
            <div className="mt-3 pt-3 flex items-center justify-between text-[12px] text-outline">
              <span>تحديث حضور سريع بالبصمة</span>
              <button type="button" onClick={() => flash("تمت مزامنة جهاز البصمة مع سجل الدوام")} className="text-secondary font-bold flex items-center gap-0.5">
                <Icon name="fingerprint" className="text-[16px]" />
                مزامنة جهاز البصمة
              </button>
            </div>
          </article>

          <article className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-lg bg-surface-container-low text-primary-container grid place-items-center"><Icon name="timelapse" /></span>
              <div>
                <span className="text-[11px] text-outline block">الوردية الحالية</span>
                <span className="text-[14px] font-bold">الصباحية (09:00 ص - 05:00 م)</span>
              </div>
            </div>
            <span className="nums text-[13px] font-bold text-on-surface-variant bg-surface-container-low px-2.5 py-1 rounded">متبقي: 02:45:10</span>
          </article>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-4">
          <article className="bg-white rounded-xl p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-6 bg-primary-container rounded-full" />
                <div>
                  <h2 className="text-[16px] font-extrabold">سجل حركات الصندوق والخزينة</h2>
                  <p className="text-[11px] text-outline">تدفق السيولة النقدية اليدوية وتذاكر الفواتير</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setMode("in")} className="flex items-center gap-1 bg-surface-container-high text-tertiary px-3 py-2 rounded-lg text-[13px] font-bold">
                  <Icon name="add_circle" className="text-[16px]" />+ إيداع نقدي (Cash In)
                </button>
                <button type="button" onClick={() => setMode("out")} className="flex items-center gap-1 bg-error-container text-on-error-container px-3 py-2 rounded-lg text-[13px] font-bold">
                  <Icon name="remove_circle" className="text-[16px]" />- صرف نقدي (Cash Out)
                </button>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 py-1.5 mb-2 bg-surface-container-low px-2 rounded-lg">
              <div className="flex items-center gap-1">
                {[
                  ["all", `الكل (${db.cash.length} حركات)`],
                  ["in", "المقبوضات فقط"],
                  ["out", "المصروفات والسندات"],
                ].map(([id, label]) => (
                  <button key={id} type="button" onClick={() => setFlow(id)} className={`px-2.5 py-1 rounded-md text-[12px] ${flow === id ? "bg-white shadow-sm font-bold text-on-surface" : "text-on-surface-variant font-medium"}`}>{label}</button>
                ))}
              </div>
              <span className="nums text-[11px] font-bold text-outline">صافي التدفق: {books.sales - books.expenses >= 0 ? "+" : ""}{money(books.sales - books.expenses)} ₪</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant text-[12px]">
                    {["الوقت", "نوع الحركة", "البيان والتفاصيل", "المسؤول / المعتمد"].map((head) => <th key={head} className="py-2.5 px-3 font-bold">{head}</th>)}
                    <th className="py-2.5 px-3 font-bold text-left">المبلغ</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => {
                    const face = faceOf(row);
                    const chip = chipOf(row);
                    return (
                      <tr key={row.id} className="hover:bg-surface-container-low">
                        <td className="py-3 px-3 nums text-[12px] text-outline">{row.time}</td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${chip.box}`}>
                            <Icon name={chip.icon} className="text-[13px]" />{row.label}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="text-[13px] font-bold">{face.title}</div>
                          {face.sub && (
                            <div className={`text-[11px] flex items-center gap-1 ${face.voucher ? "text-error font-bold nums" : "text-outline"}`}>
                              {face.icon && <Icon name={face.icon} className="text-[13px]" />}
                              <span>{face.sub}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3 text-[12px]">
                          <span className="font-bold block">{row.who}</span>
                          <span className="text-[11px] text-outline">{row.role}</span>
                        </td>
                        <td className="py-3 px-3 text-left">
                          <span className={`text-[16px] font-extrabold nums ${amountTone(row)}`}>{row.kind === "out" ? "-" : "+"}{money(row.amount)}</span>
                          <span className="text-[11px] text-outline font-bold mr-0.5">₪</span>
                        </td>
                      </tr>
                    );
                  })}
                  {rows.length === 0 && (
                    <tr><td colSpan={5} className="py-8 text-center text-[13px] text-outline">لا حركات في هذا التصفية</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-4 bg-surface-container-low rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-lg bg-white text-primary-container grid place-items-center"><Icon name="calculate" /></span>
                <div>
                  <span className="text-[11px] text-outline block">معادلة رصيد الدرج الدفتري:</span>
                  <span className="nums text-[12px]">{money(books.opening)} (عهدة) + {money(books.sales)} (مبيعات) - {money(books.expenses)} (مصاريف)</span>
                </div>
              </div>
              <div className="text-left">
                <span className="text-[11px] text-outline block">الرصيد الختامي المتوقع</span>
                <p className="text-[20px] font-extrabold nums">{books.drawer.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-[12px] text-outline">₪</span></p>
              </div>
            </div>
          </article>

          <div className="grid sm:grid-cols-2 gap-3">
            <article className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="flex items-center gap-1.5 text-[14px] font-bold"><Icon name="fact_check" className="text-secondary" />قائمة مهام تسليم الوردية</span>
                <span className="text-[11px] font-bold text-tertiary">{doneCount} من {TASKS.length} مكتملة</span>
              </div>
              <div className="space-y-1.5">
                {TASKS.map((task, index) => (
                  <label key={task} className="flex items-center gap-2 cursor-pointer text-[13px]">
                    <input type="checkbox" checked={tasks[index]} onChange={() => setTasks((prev) => prev.map((item, i) => (i === index ? !item : item)))} className="w-4 h-4 accent-primary-container" />
                    <span className={tasks[index] ? "line-through text-outline" : "font-bold"}>{task}</span>
                  </label>
                ))}
              </div>
            </article>
            <article className="bg-white rounded-xl p-4 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-[14px] font-bold"><Icon name="shield" className="text-primary-container" />سقف النقدية المسموح</span>
                <span className="text-[11px] font-bold text-outline nums">الحد الأقصى: {money(books.ceiling)} ₪</span>
              </div>
              <p className="text-[13px] text-on-surface-variant leading-6">
                رصيدك الحالي (<b className="text-on-surface nums">{money(books.drawer)} ₪</b>) يمثل <b className="text-primary-container nums">{books.ratio}%</b> من حد الأمان المالي للصندوق. {books.ratio >= 80 ? "يلزم ترحيل جزئي الآن." : "لا يلزم ترحيل جزئي الآن."}
              </p>
              <div>
                <div className="h-2 rounded-full bg-surface-container-low overflow-hidden mt-3"><div className="h-full bg-primary-container rounded-full" style={{ width: `${books.ratio}%` }} /></div>
                <div className="flex justify-between mt-2 text-[11px] text-outline">
                  <span>آمن</span>
                  <span className="text-primary font-bold">{books.ratio >= 80 ? "قرب السقف" : "مستوى اعتيادي"}</span>
                  <span>ترحيل إجباري</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {mode && (
        <Modal title={mode === "in" ? "تسجيل حركة نقدية جديدة (Cash In)" : "تسجيل صرف نقدي (Cash Out)"} onClose={() => setMode(null)}>
          <form onSubmit={save}>
            <label className="block text-[13px] font-bold mb-3">
              المبلغ النقدي (₪)
              <input name="amount" type="number" min="1" required placeholder="0.00" className={`${fieldClass} mt-1 nums`} />
            </label>
            <label className="block text-[13px] font-bold mb-3">
              نوع العملية
              <select name="label" className={`${fieldClass} mt-1`}>
                {(mode === "in" ? IN_KINDS : OUT_KINDS).map((kind) => <option key={kind}>{kind}</option>)}
              </select>
            </label>
            <label className="block text-[13px] font-bold mb-4">
              البيان / ملاحظات التدقيق
              <textarea name="detail" required rows={3} placeholder="أدخل تفاصيل العملية ورقم السند أو الفاتورة إن وجد..." className="w-full mt-1 p-3 rounded-lg border border-line bg-white text-[14px] outline-none focus:border-primary-container" />
            </label>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setMode(null)} className="px-4 py-2 rounded-lg bg-surface-container-low font-bold text-[13px]">إلغاء</button>
              <button type="submit" className={`px-5 py-2 rounded-lg font-bold text-[13px] text-white ${mode === "in" ? "bg-tertiary-container" : "bg-error"}`}>
                {mode === "in" ? "تأكيد وإيداع بالدرج" : "تأكيد والصرف من الدرج"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {askClose && (
        <Modal title="إغلاق الصندوق وترحيل اليومية" onClose={() => setAskClose(false)}>
          <p className="text-[14px] text-on-surface-variant leading-6 mb-4">إغلاق الصندوق يطبع تقرير Z ويُنشئ سند ترحيل الخزينة #CL-892. الرصيد الختامي {money(books.drawer)} ₪.</p>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setAskClose(false)} className="px-4 py-2 rounded-lg bg-surface-container-low font-bold text-[13px]">تراجع</button>
            <button
              type="button"
              onClick={() => {
                setClosed(true);
                setAskClose(false);
                flash("تم إغلاق الصندوق اليومي. سند ترحيل الخزينة #CL-892");
              }}
              className="px-5 py-2 rounded-lg bg-primary-container text-white font-bold text-[13px]"
            >
              تأكيد الإغلاق
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

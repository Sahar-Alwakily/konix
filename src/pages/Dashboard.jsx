import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { Icon } from "../components/ui";

const FILTERS = ["اليوم", "آخر 7 أيام", "هذا الشهر", "الربع الحالي"];

const BARS = [
  { day: "السبت", k: "36.2K", acc: 32, phones: 94 },
  { day: "الأحد", k: "41.8K", acc: 40, phones: 108 },
  { day: "الاثنين", k: "33.5K", acc: 25, phones: 86 },
  { day: "الثلاثاء", k: "39.1K", acc: 36, phones: 99 },
  { day: "الأربعاء", k: "44.6K", acc: 45, phones: 115 },
  { day: "الخميس", k: "52.3K", acc: 50, phones: 135, hot: true },
  { day: "اليوم", k: "48.6K", acc: 47, phones: 124, today: true },
];

const ALERTS = [
  { name: "iPhone 15 Pro Max", detail: "256GB • تيتانيوم طبيعي • موديل A3106", left: "باقي 2 فقط", min: "5 قطع", critical: false },
  { name: "شاحن Apple MagSafe الأصلي", detail: "ملحقات طاقة • كابل 1 متر • 15W", left: "باقي 4 فقط", min: "15 قطعة", critical: false },
  { name: "Samsung Galaxy S24 Ultra", detail: "512GB • رمادي تيتانيوم • ضمان الوكيل", left: "باقي 1 فقط!", min: "4 قطع", critical: true },
  { name: "AirPods Pro الجيل الثاني", detail: "منفذ Type-C • علبة MagSafe مع مكبر صوت", left: "باقي 3 فقط", min: "10 قطع", critical: false },
];

const BRANCHES = [
  { name: "فرع رهط الرئيسي", place: "الشارع الرئيسي - المركز التجاري", sales: "26,400 ₪", avg: "متوسط 1,466 ₪", bills: "18 عملية", pct: "110%", note: "متفوق", width: "100%", bar: "bg-tertiary-container", noteClass: "text-tertiary", badge: "نشط ومرتفع", badgeClass: "bg-tertiary-fixed text-on-tertiary-container", icon: "store", iconClass: "bg-primary-fixed text-primary" },
  { name: "فرع شقيب السلام", place: "حي المروج - المجمع التجاري", sales: "14,850 ₪", avg: "متوسط 1,650 ₪", bills: "9 عمليات", pct: "85%", note: "طبيعي", width: "85%", bar: "bg-secondary-container", noteClass: "text-on-surface", badge: "ضمن المستهدف", badgeClass: "bg-surface-container text-on-surface-variant", icon: "storefront", iconClass: "bg-surface-container text-on-surface" },
  { name: "فرع حورة", place: "شارع السلام - المعرض التجاري", sales: "7,400 ₪", avg: "متوسط 1,480 ₪", bills: "5 عمليات", pct: "68%", note: "أقل من المتوقع", width: "68%", bar: "bg-primary-container", noteClass: "text-outline", badge: "حركة هادئة", badgeClass: "bg-surface-container-high text-on-surface-variant", icon: "storefront", iconClass: "bg-surface-container text-on-surface" },
];

function Kpi({ kicker, title, icon, iconClass, wash, value, valueClass = "text-on-surface", footer }) {
  return (
    <article className="bg-white p-5 rounded-xl shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[188px] hover:shadow-md transition">
      <div className={`absolute -left-6 -bottom-6 w-24 h-24 rounded-full pointer-events-none ${wash}`} />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold tracking-wider text-outline">{kicker}</p>
          <p className="text-[16px] font-bold">{title}</p>
        </div>
        <span className={`w-11 h-11 rounded-xl grid place-items-center shrink-0 ${iconClass}`}>
          <Icon name={icon} />
        </span>
      </div>
      <p className={`text-[36px] leading-none font-extrabold nums my-4 ${valueClass}`}>
        {value} <span className="text-[12px] font-bold text-outline">₪</span>
      </p>
      <div className="pt-2 border-t border-surface-container-low text-[12px]">{footer}</div>
    </article>
  );
}

export default function Dashboard() {
  const { session, flash, db } = useStore();
  const [filter, setFilter] = useState(FILTERS[0]);
  const [sent, setSent] = useState({});

  function restock(name) {
    setSent((prev) => ({ ...prev, [name]: true }));
    flash("تم إرسال أمر التوريد");
    setTimeout(() => setSent((prev) => ({ ...prev, [name]: false })), 1800);
  }

  return (
    <div className="py-6 flex flex-col gap-5">
      <section className="bg-white rounded-xl shadow-sm p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              مباشر • تحديث تلقائي
            </span>
            <span className="text-[10px] text-outline">آخر مزامنة: منذ دقيقتين</span>
          </div>
          <h1 className="text-[22px] font-extrabold tracking-tight">مرحباً بعودتك، {session?.name || "أنور ابو القيعان"}</h1>
          <p className="text-[14px] text-on-surface-variant">لوحة التحكم التنفيذية لشبكة فروع كونيكس للاتصالات والأجهزة الذكية</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex p-1 bg-surface-container-low rounded-lg gap-1">
            {FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`px-4 py-1.5 rounded-lg text-[12px] font-semibold ${filter === item ? "bg-white text-primary font-bold shadow-sm" : "text-on-surface-variant"}`}
              >
                {item}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => flash("تم تجهيز الملخص التجريبي")} className="flex items-center gap-1 bg-secondary-container hover:bg-secondary text-white px-4 py-2 rounded-lg text-[12px] font-bold active:scale-95">
            <Icon name="download" />
            تصدير ملخص التنفيذي
          </button>
        </div>
      </section>

      {(db.stockRequests || []).length > 0 && (
        <section className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="text-[16px] font-extrabold">طلبات الموظفين</h2>
            <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold">{db.stockRequests.length} طلب مسجّل</span>
          </div>
          <div className="flex flex-col gap-2">
            {db.stockRequests.map((request) => (
              <article key={request.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-surface-container-low px-3 py-2">
                <div>
                  <p className="font-extrabold">{request.name} <span className="nums text-[13px] text-outline">{request.storage}</span></p>
                  <p className="text-[12px] text-on-surface-variant">{request.by} · {request.branchName} · {request.qty} قطع{request.note ? ` · ${request.note}` : ""}</p>
                </div>
                <div className="text-left">
                  <p className="text-[12px] font-bold text-primary">{request.status}</p>
                  <p className="nums text-[11px] text-outline">{request.id}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Kpi
          kicker="حجم التداول الفوري"
          title="مبيعات اليوم"
          icon="point_of_sale"
          iconClass="bg-primary-fixed text-on-primary-fixed"
          wash="bg-primary-container/10"
          value="8,650"
          footer={<div className="flex items-center justify-between"><span className="text-tertiary font-bold inline-flex items-center gap-1"><Icon name="trending_up" className="text-[16px]" />+14.2% مقارنة بالأمس</span><span className="text-on-surface-variant">32 عملية مكتملة</span></div>}
        />
        <Kpi
          kicker="العائد بعد التكاليف"
          title="صافي أرباح اليوم"
          icon="query_stats"
          iconClass="bg-secondary-fixed text-secondary"
          wash="bg-secondary-fixed/40"
          value="11,820"
          valueClass="text-secondary"
          footer={<div className="flex items-center justify-between"><span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold">هامش ربح 24.3%</span><span className="text-tertiary font-bold inline-flex items-center gap-0.5"><Icon name="verified" className="text-[16px]" />ضمن الهدف</span></div>}
        />
        <Kpi
          kicker="إجمالي حركة الأسبوع"
          title="مبيعات الأسبوع"
          icon="calendar_view_week"
          iconClass="bg-surface-container-low text-on-surface"
          wash="bg-surface-container-high/50"
          value="84,900"
          footer={<div className="flex items-center justify-between"><span className="text-tertiary font-bold inline-flex items-center gap-1"><Icon name="trending_up" className="text-[16px]" />+8.5% نمو متراكم</span><span className="text-on-surface-variant">184 جهاز وملحق</span></div>}
        />
        <Kpi
          kicker="مؤشر المستهدف التجاري"
          title="مبيعات الشهر الحالي"
          icon="flag_circle"
          iconClass="bg-tertiary-fixed text-on-tertiary-container"
          wash="bg-tertiary-fixed/40"
          value="142,500"
          footer={
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between"><span className="font-bold">تحقيق 92% من 1.2M</span><span className="text-primary font-bold">متبقي 57,500 ₪</span></div>
              <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden"><div className="h-full bg-primary-container rounded-full w-[92%]" /></div>
            </div>
          }
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-8 flex flex-col gap-5">
          <article className="bg-white p-5 rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-container-low">
              <div>
                <h2 className="text-[18px] font-bold">مؤشر المبيعات الأسبوعية حسب الأيام</h2>
                <p className="text-[12px] text-on-surface-variant">رصد المبيعات اليومية وتوزيع الإيرادات بين الأجهزة الذكية والإكسسوارات</p>
              </div>
              <div className="flex items-center gap-4 text-[12px]">
                <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-primary-container" />الهواتف والأجهزة الذكية</span>
                <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-secondary-container" />الإكسسوارات والخدمات</span>
              </div>
            </div>
            <div className="h-64 mt-4 flex items-end justify-between gap-2 sm:gap-6 px-2">
              {BARS.map((bar) => (
                <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className={`text-[12px] nums font-bold ${bar.today ? "text-primary" : "text-outline"}`}>{bar.k}</span>
                  <div className="w-full max-w-[44px] h-[180px] flex flex-col justify-end gap-1 relative">
                    {bar.today && <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary animate-pulse" />}
                    <div className="w-full bg-secondary-container rounded-t-sm shrink-0" style={{ height: bar.acc }} />
                    <div className="w-full bg-primary-container rounded-b-sm shrink-0" style={{ height: bar.phones }} />
                  </div>
                  <span className={`text-[12px] font-semibold ${bar.today ? "text-primary font-bold bg-primary-fixed/60 px-2 py-0.5 rounded" : bar.hot ? "text-primary font-bold" : "text-on-surface-variant"}`}>{bar.day}</span>
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-3 gap-4 p-4 mt-3 bg-surface-container-low rounded-xl">
              <div><p className="text-[12px] text-on-surface-variant">إيراد الهواتف (هذا الأسبوع)</p><p className="text-[16px] font-bold nums">219,300 ₪</p></div>
              <div><p className="text-[12px] text-on-surface-variant">إيراد الإكسسوارات والخدمات</p><p className="text-[16px] font-bold nums text-secondary">65,600 ₪</p></div>
              <div><p className="text-[12px] text-on-surface-variant">متوسط سلة المشتريات</p><p className="text-[16px] font-bold nums text-tertiary">1,548 ₪ / فاتورة</p></div>
            </div>
          </article>

          <article className="bg-white p-5 rounded-xl shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-low">
              <div>
                <h2 className="text-[18px] font-bold">أداء الفروع اليوم</h2>
                <p className="text-[12px] text-on-surface-variant">توزيع المبيعات المباشرة ونسب الإنجاز للفروع النشطة</p>
              </div>
              <Link to="/reports" className="text-[12px] font-bold text-primary inline-flex items-center gap-1">تقرير الفروع المفصل <Icon name="arrow_back" className="text-[16px]" /></Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right min-w-[720px]">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant text-[12px] font-semibold">
                    {["الفرع والموقع", "المبيعات المحققة", "عدد الفواتير", "نسبة تحقيق الهدف", "الحالة"].map((head) => (
                      <th key={head} className="py-3 px-3 font-semibold">{head}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {BRANCHES.map((row) => (
                    <tr key={row.name} className="border-t border-surface-container-low">
                      <td className="py-4 px-3">
                        <div className="flex items-center gap-3">
                          <span className={`w-9 h-9 rounded-lg grid place-items-center ${row.iconClass}`}><Icon name={row.icon} /></span>
                          <span><b className="block text-[14px]">{row.name}</b><span className="text-[12px] text-outline">{row.place}</span></span>
                        </div>
                      </td>
                      <td className="py-4 px-3"><b className="nums block">{row.sales}</b><span className="text-[12px] text-outline">{row.avg}</span></td>
                      <td className="py-4 px-3 font-bold nums">{row.bills}</td>
                      <td className="py-4 px-3">
                        <div className="w-36">
                          <div className={`flex justify-between text-[12px] font-bold ${row.noteClass}`}><span>{row.pct}</span><span>{row.note}</span></div>
                          <div className="h-2 bg-surface-container-high rounded-full overflow-hidden mt-1"><div className={`h-full rounded-full ${row.bar}`} style={{ width: row.width }} /></div>
                        </div>
                      </td>
                      <td className="py-4 px-3 text-center"><span className={`inline-flex px-2.5 py-0.5 rounded-full text-[12px] font-bold ${row.badgeClass}`}>{row.badge}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-5">
          <article className="bg-white p-5 rounded-xl shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-low">
              <div className="flex items-center gap-2">
                <Icon name="warning" className="text-error text-[26px]" />
                <div>
                  <h2 className="text-[18px] font-bold leading-tight">تنبيهات انخفاض المخزون</h2>
                  <p className="text-[12px] text-on-surface-variant">عناصر وصلت لحد الأمان الحرج</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-error-container text-on-error-container text-[12px] font-bold">عاجل (4)</span>
            </div>
            <div className="flex flex-col gap-3 mt-3">
              {ALERTS.map((alert) => (
                <div key={alert.name} className="p-3 rounded-xl bg-surface-container-low">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold leading-snug">{alert.name}</p>
                      <p className="text-[12px] text-outline">{alert.detail}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[12px] font-bold whitespace-nowrap nums ${alert.critical ? "bg-error text-white" : "bg-error-container text-error"}`}>{alert.left}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-surface-container-high/60 text-[12px]">
                    <span className="text-on-surface-variant">حد الأمان: <strong>{alert.min}</strong></span>
                    <button
                      type="button"
                      onClick={() => restock(alert.name)}
                      className={`px-3 py-1.5 rounded-lg font-bold inline-flex items-center gap-1 active:scale-95 ${sent[alert.name] ? "bg-tertiary-container text-on-tertiary-container" : "bg-primary-container text-white hover:bg-[#E66E00]"}`}
                    >
                      <Icon name={sent[alert.name] ? "check" : "local_shipping"} className="text-[16px]" />
                      {sent[alert.name] ? "تم إرسال أمر التوريد" : "طلب توريد سريع"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/inventory" className="mt-3 w-full py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high font-bold text-[12px] flex items-center justify-center gap-1">
              عرض مستودع النواقص بالكامل <Icon name="inventory" className="text-[16px]" />
            </Link>
          </article>

          <article className="bg-white p-5 rounded-xl shadow-sm">
            <p className="text-[10px] font-bold tracking-wider text-outline mb-3">إجراءات إدارية سريعة</p>
            <div className="grid grid-cols-2 gap-3">
              <Link to="/products" className="p-4 rounded-xl bg-surface-container-low hover:bg-primary-fixed/40 flex flex-col items-center text-center gap-1">
                <Icon name="add_box" className="text-primary text-[26px]" />
                <b className="text-[12px]">إضافة منتج</b>
                <span className="text-[12px] text-outline">تسجيل IMEI جديد</span>
              </Link>
              <Link to="/inventory" className="p-4 rounded-xl bg-surface-container-low hover:bg-secondary-fixed/60 flex flex-col items-center text-center gap-1">
                <Icon name="swap_horiz" className="text-secondary text-[26px]" />
                <b className="text-[12px]">مناقلة فروع</b>
                <span className="text-[12px] text-outline">تحويل بضاعة</span>
              </Link>
              <Link to="/cash" className="p-4 rounded-xl bg-surface-container-low hover:bg-tertiary-fixed/50 flex flex-col items-center text-center gap-1">
                <Icon name="lock_clock" className="text-tertiary text-[26px]" />
                <b className="text-[12px]">إغلاق الصندوق</b>
                <span className="text-[12px] text-outline">جرد الكاش اليومي</span>
              </Link>
              <Link to="/inventory" className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container-high flex flex-col items-center text-center gap-1">
                <Icon name="fact_check" className="text-on-surface text-[26px]" />
                <b className="text-[12px]">جرد مفاجئ</b>
                <span className="text-[12px] text-outline">مطابقة الباركود</span>
              </Link>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

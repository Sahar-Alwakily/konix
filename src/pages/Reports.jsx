import { useState } from "react";
import { useStore } from "../context/StoreContext";
import { Icon } from "../components/ui";

const RANGES = ["اليومي", "الأسبوعي", "الشهري", "السنوي / الربع سنوي"];

const MONTHS = [
  ["مايو", "142K ₪", false],
  ["يونيو", "158K ₪", false],
  ["يوليو", "189K ₪", false],
  ["أغسطس", "210K ₪", false],
  ["سبتمبر (القمة)", "384K ₪", "peak"],
  ["أكتوبر (الحالي)", "310K ₪", "now"],
];

const TOP = [
  {
    name: "iPhone 15 Pro Max 256GB - تيتانيوم طبيعي",
    icon: "smartphone",
    iconClass: "text-on-surface",
    chips: [["64 جهاز مباع", "bg-secondary-fixed text-on-secondary-fixed"], ["كود: SKU-APL-15PM", "plain"]],
    sales: "332,736 ₪",
    profit: "+51,200 ₪",
  },
  {
    name: "كفرات وشواحن MagSafe و Anker الأصلية",
    icon: "power",
    iconClass: "text-secondary",
    chips: [["180 قطعة مباعة", "bg-tertiary-fixed text-on-tertiary-fixed"], ["هامش قياسي 58%", "bg-primary-fixed text-on-primary-fixed"]],
    sales: "27,900 ₪",
    profit: "+16,200 ₪",
  },
  {
    name: "Samsung Galaxy S24 Ultra 512GB",
    icon: "phone_android",
    iconClass: "text-on-surface",
    chips: [["38 جهاز مباع", "bg-secondary-fixed text-on-secondary-fixed"], ["سامسونج الخليج", "plain"]],
    sales: "186,162 ₪",
    profit: "+24,700 ₪",
  },
  {
    name: "AirPods Pro 2 (USB-C)",
    icon: "headphones",
    iconClass: "text-on-surface",
    chips: [["52 قطعة مباعة", "bg-secondary-fixed text-on-secondary-fixed"], ["ضمان حاسبات العرب", "plain"]],
    sales: "49,348 ₪",
    profit: "+8,840 ₪",
  },
  {
    name: "باقات حماية الشاشة VIP النانوية ضد الكسر",
    icon: "security",
    iconClass: "text-primary",
    chips: [["145 باقة", "bg-tertiary-fixed text-on-tertiary-fixed"], ["هامش ربح استثنائي 85%", "bg-primary-fixed text-on-primary-fixed"]],
    sales: "17,400 ₪",
    profit: "+14,790 ₪",
  },
];

const PAY = [
  ["bg-tertiary-container", "بطاقات الشبكة", "683,519 ₪", "62%"],
  ["bg-secondary", "تقسيط محلي", "220,490 ₪", "20%"],
  ["bg-primary-container", "فيزا / ماستركارد الائتمانية", "121,270 ₪", "11%"],
  ["bg-outline", "كاش نقدي (صندوق الكاشير)", "77,171 ₪", "7%"],
];

export default function Reports() {
  const { flash } = useStore();
  const [range, setRange] = useState("الشهري");
  const [scope, setScope] = useState("all");

  return (
    <div className="py-6 flex flex-col gap-5">
      <section className="bg-white rounded-xl p-5 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-bold">الذكاء المالي والتحليل المالي</span>
            <span className="text-outline text-[12px]">•</span>
            <span className="nums text-[12px] text-on-surface-variant">Q4 - Fiscal 2024</span>
          </div>
          <h1 className="text-[28px] font-extrabold tracking-tight mt-1">التقارير التحليلية والأرباح</h1>
          <p className="text-[13px] text-on-surface-variant">مراقبة الأداء المالي، هوامش الربحية المباشرة، وحركات النمو التشغيلي لمبيعات التجزئة</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-surface-container-low p-1 rounded-xl flex items-center gap-1">
            {RANGES.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => { setRange(label); flash(`تم تثبيت العرض على ${label}`); }}
                className={`px-3.5 py-1.5 rounded-lg text-[13px] ${range === label ? "bg-white text-primary font-bold shadow-sm" : "text-on-surface-variant"}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Icon name="domain" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-primary text-[18px] pointer-events-none" />
            <select
              value={scope}
              onChange={(event) => { setScope(event.target.value); flash("الأرقام المعروضة هي لقطة كافة الفروع حتى ربط المحاسبة"); }}
              className="appearance-none bg-surface-container-low hover:bg-surface-container text-[13px] font-bold pr-9 pl-8 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-primary-container"
            >
              <option value="all">كافة الفروع مجمعة</option>
              <option value="rahat">فرع رهط الرئيسي</option>
              <option value="segev">فرع شقيب السلام</option>
              <option value="hura">فرع حورة</option>
            </select>
            <Icon name="expand_more" className="absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px] pointer-events-none" />
          </div>
          <button type="button" onClick={() => flash("جاري تجهيز ملف Excel للتقارير المالية")} className="flex items-center gap-1.5 bg-surface-container hover:bg-surface-container-high text-tertiary px-3 py-2.5 rounded-xl text-[13px] font-bold shadow-sm">
            <Icon name="table_view" className="text-tertiary-container text-[18px]" />
            تصدير إلى Excel (XLSX)
          </button>
          <button type="button" onClick={() => flash("جاري إصدار تقرير الفواتير الضريبية المعتمد")} className="flex items-center gap-1.5 bg-primary-container hover:bg-on-primary-container text-white px-4 py-2.5 rounded-xl text-[13px] font-bold shadow-md">
            <Icon name="verified" className="text-[18px]" />
            تصدير تقرير فواتير ضريبية معتمد (PDF)
          </button>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-3">
        <article className="bg-white rounded-xl p-5 shadow-sm flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-outline">متوسط هامش الربح الإجمالي</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[36px] font-extrabold nums leading-none">22.4%</span>
              <span className="inline-flex items-center text-tertiary text-[13px] font-bold bg-surface-container-low px-2 py-0.5 rounded-full">
                <Icon name="trending_up" className="text-[14px]" /> +3.1%
              </span>
            </div>
            <p className="text-[13px] text-on-surface-variant mt-1">مقارنة بنظيره في الربع السابق</p>
          </div>
          <span className="relative z-10 w-14 h-14 rounded-2xl bg-surface-container text-primary-container grid place-items-center"><Icon name="percent" className="text-[28px]" /></span>
          <span className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-primary-fixed/30 blur-xl" />
        </article>
        <article className="bg-white rounded-xl p-5 shadow-sm flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-outline">إجمالي صافي أرباح الشهر</span>
            <p className="text-[36px] font-extrabold nums leading-none text-secondary mt-1">246,800 <span className="text-[14px]">₪</span></p>
            <p className="text-[13px] text-on-surface-variant mt-1">من إجمالي مبيعات بلغت 1,102,450 ₪</p>
          </div>
          <span className="relative z-10 w-14 h-14 rounded-2xl bg-secondary-fixed text-secondary grid place-items-center"><Icon name="account_balance_wallet" className="text-[28px]" /></span>
          <span className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-secondary-fixed/50 blur-xl" />
        </article>
        <article className="bg-white rounded-xl p-5 shadow-sm flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-outline">أعلى شهر مبيعاً (ذروة الربع)</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-[36px] font-extrabold text-tertiary leading-none">سبتمبر</span>
              <span className="px-2 py-0.5 rounded-full bg-tertiary-container/15 text-tertiary text-[11px] font-bold">إطلاق أبل الجديد</span>
            </div>
            <p className="text-[13px] text-on-surface-variant mt-1">سجل مبيعات قياسية بلغت 384,120 ₪</p>
          </div>
          <span className="relative z-10 w-14 h-14 rounded-2xl bg-surface-container-high text-tertiary grid place-items-center"><Icon name="celebration" className="text-[28px]" /></span>
          <span className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-tertiary-fixed/40 blur-xl" />
        </article>
      </section>

      <section className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
              <h2 className="text-[18px] font-extrabold">مسار الأرباح والإيرادات (الأشهر الستة الماضية)</h2>
            </div>
            <p className="text-[13px] text-on-surface-variant">مقارنة تحليلية دقيقة بين حجم التدفق النقدي الإجمالي وهامش الربح الصافي الفعلي المحقق</p>
          </div>
          <div className="flex items-center gap-4 bg-surface-container-low px-4 py-2 rounded-xl text-[13px]">
            <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full bg-secondary" />الإيرادات الإجمالية</span>
            <span className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full bg-primary-container" />صافي الأرباح التشغيلية</span>
          </div>
        </div>
        <div className="bg-surface-container-low/60 rounded-xl p-4" dir="ltr">
          <div className="relative h-72">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 300">
              <defs>
                <linearGradient id="revenueGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#522ee7" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#522ee7" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="profitGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#ff7a00" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ff7a00" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[30, 95, 160, 225].map((y) => <line key={y} stroke="#dce2f7" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="1000" y1={y} y2={y} />)}
              <line stroke="#dce2f7" strokeWidth="1.5" x1="0" x2="1000" y1="290" y2="290" />
              <path d="M 50 190 Q 230 180 410 160 T 590 145 T 770 40 T 950 85 L 950 290 L 50 290 Z" fill="url(#revenueGrad)" />
              <path d="M 50 190 Q 230 180 410 160 T 590 145 T 770 40 T 950 85" fill="none" stroke="#522ee7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
              <path d="M 50 240 Q 230 235 410 220 T 590 205 T 770 120 T 950 140 L 950 290 L 50 290 Z" fill="url(#profitGrad)" />
              <path d="M 50 240 Q 230 235 410 220 T 590 205 T 770 120 T 950 140" fill="none" stroke="#ff7a00" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
              <line stroke="#ff7a00" strokeDasharray="3 3" strokeWidth="1.5" x1="770" x2="770" y1="40" y2="290" />
              <circle cx="770" cy="40" fill="#ffffff" r="6" stroke="#522ee7" strokeWidth="3" />
              <circle cx="770" cy="120" fill="#ffffff" r="6" stroke="#ff7a00" strokeWidth="3" />
              <circle cx="950" cy="85" fill="#ffffff" r="5" stroke="#522ee7" strokeWidth="2.5" />
              <circle cx="950" cy="140" fill="#ffffff" r="5" stroke="#ff7a00" strokeWidth="2.5" />
              {[[50, 190], [230, 180], [410, 160], [590, 145]].map(([cx, cy]) => <circle key={`r${cx}`} cx={cx} cy={cy} fill="#522ee7" r="4" />)}
              {[[50, 240], [230, 235], [410, 220], [590, 205]].map(([cx, cy]) => <circle key={`p${cx}`} cx={cx} cy={cy} fill="#ff7a00" r="4" />)}
            </svg>
            <div className="absolute right-[21%] top-3 bg-[#293040] text-white px-3 py-1.5 rounded-xl shadow-lg flex flex-col items-center">
              <span className="text-[11px] font-bold text-tertiary-fixed">ذروة إطلاق أبل</span>
              <span className="nums text-[13px] font-extrabold">384,120 ₪</span>
            </div>
          </div>
          <div className="grid grid-cols-6 text-center text-[13px] font-bold text-on-surface-variant pt-2 border-t border-surface-container-high/60">
            {MONTHS.map(([label, value, tone]) => (
              <div key={label} className={`flex flex-col items-center ${tone === "peak" ? "text-primary font-black" : ""} ${tone === "now" ? "text-on-surface font-extrabold" : ""}`}>
                <span className={tone === "peak" ? "bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-md" : ""}>{label}</span>
                <span className={`nums text-[11px] font-bold ${tone === "peak" ? "text-primary" : tone === "now" ? "text-secondary" : "text-outline font-normal"}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid lg:grid-cols-12 gap-4">
        <article className="lg:col-span-8 bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <Icon name="workspace_premium" className="text-primary text-[24px]" />
                <h2 className="text-[16px] font-extrabold">المنتجات الأكثر مبيعاً والأعلى ربحية</h2>
              </div>
              <p className="text-[13px] text-on-surface-variant">ترتيب الأجهزة والملحقات حسب العائد المالي وهامش الربحية الصافي</p>
            </div>
            <span className="nums text-[12px] text-on-surface-variant bg-surface-container-low px-3 py-1 rounded-lg">Top 5 SKU</span>
          </div>
          <ol className="divide-y divide-surface-container">
            {TOP.map((item, index) => (
              <li key={item.name} className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-surface-container-low/40 rounded-xl px-2">
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-8 h-8 rounded-full grid place-items-center font-bold text-[14px] shrink-0 ${index === 0 ? "bg-primary-container text-white shadow-sm" : "bg-surface-container-high"}`}>{index + 1}</span>
                  <span className="w-12 h-12 rounded-xl bg-surface-container grid place-items-center shrink-0"><Icon name={item.icon} className={`text-[24px] ${item.iconClass}`} /></span>
                  <div className="min-w-0">
                    <p className="font-bold truncate">{item.name}</p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                      {item.chips.map(([label, tone]) => (
                        tone === "plain"
                          ? <span key={label} className="text-[11px] text-on-surface-variant">{index === 0 || label.includes("سامس") || label.includes("ضمان") ? <><span className="text-outline">• </span>{label}</> : label}</span>
                          : <span key={label} className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${tone}`}>{label}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 shrink-0">
                  <div className="text-left"><span className="block text-[11px] text-outline">إجمالي المبيعات</span><span className="font-bold nums">{item.sales}</span></div>
                  <div className="text-left"><span className="block text-[11px] text-tertiary font-bold">صافي الأرباح</span><span className="text-[16px] font-extrabold text-tertiary nums">{item.profit}</span></div>
                </div>
              </li>
            ))}
          </ol>
        </article>

        <article className="lg:col-span-4 bg-white rounded-xl p-6 shadow-sm flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Icon name="pie_chart" className="text-secondary text-[24px]" />
              <h2 className="text-[16px] font-extrabold">توزيع طرق الدفع</h2>
            </div>
            <p className="text-[13px] text-on-surface-variant">تحليل التدفقات النقدية وفق قنوات التحصيل</p>
          </div>
          <div className="relative flex items-center justify-center">
            <svg className="w-48 h-48 -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" fill="none" r="62" stroke="#f1f3ff" strokeWidth="18" />
              <circle cx="80" cy="80" fill="none" r="62" stroke="#03b67e" strokeDasharray="241.5 389.5" strokeWidth="18" />
              <circle cx="80" cy="80" fill="none" r="62" stroke="#522ee7" strokeDasharray="77.9 389.5" strokeDashoffset="-241.5" strokeWidth="18" />
              <circle cx="80" cy="80" fill="none" r="62" stroke="#ff7a00" strokeDasharray="42.8 389.5" strokeDashoffset="-319.4" strokeWidth="18" />
              <circle cx="80" cy="80" fill="none" r="62" stroke="#8c7263" strokeDasharray="27.3 389.5" strokeDashoffset="-362.2" strokeWidth="18" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[11px] font-bold text-outline">الحصة الأكبر</span>
              <span className="text-[28px] font-extrabold leading-none">62%</span>
              <span className="text-[13px] font-bold text-tertiary">بطاقات الشبكة</span>
            </div>
          </div>
          <ul className="flex flex-col gap-2">
            {PAY.map(([dot, label, amount, share]) => (
              <li key={label} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-surface-container-low/50">
                <span className="flex items-center gap-2 text-[13px] font-bold"><span className={`w-3.5 h-3.5 rounded-full shrink-0 ${dot}`} />{label}</span>
                <span className="flex items-center gap-3 shrink-0"><span className="nums text-[12px] text-on-surface-variant">{amount}</span><b className="text-[13px]">{share}</b></span>
              </li>
            ))}
          </ul>
          <p className="p-3 bg-surface-container-high/40 rounded-xl flex items-center gap-2 text-[12px] text-on-surface-variant">
            <Icon name="receipt_long" className="text-secondary text-[18px]" />
            مطابق لمعايير ومتطلبات نظام الفواتير الضريبية المعتمد محلياً
          </p>
        </article>
      </section>
    </div>
  );
}

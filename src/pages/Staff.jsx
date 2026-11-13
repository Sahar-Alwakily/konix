import { useMemo, useState } from "react";
import { useStore } from "../context/StoreContext";
import { BRANCHES, branchName } from "../data/seed";
import { Field, Icon, Modal, fieldClass } from "../components/ui";

const ORDER = ["s2", "s3", "s4", "s5", "s6", "s1", "s7"];
const PAGE = 5;

const AVATAR = {
  s2: "bg-primary-fixed text-on-primary-fixed-variant ring-primary-container/20",
  s3: "bg-secondary-fixed text-on-secondary-fixed ring-transparent",
  s4: "bg-secondary-fixed text-on-secondary-fixed ring-secondary/30",
  s5: "bg-surface-container-high text-on-surface ring-primary-container/20",
  s6: "bg-tertiary-fixed text-on-tertiary-container ring-transparent",
};

function initials(name) {
  const parts = String(name).split(/\s+/).filter((word) => word && word !== "أبو" && word !== "ابن");
  const first = parts[0]?.[0] || "";
  const lastWord = parts[parts.length - 1] || "";
  const last = lastWord.replace(/^ال/, "")[0] || lastWord[0] || "";
  return parts.length > 1 ? `${first}.${last}` : first;
}

function chip(person) {
  if (/Senior|رئيسي/.test(person.role) && !person.role.includes("صاحب")) return ["نخبة المبيعات", "bg-primary-fixed text-on-primary-fixed-variant"];
  if (person.role === "موظف مبيعات") return ["موظف", "bg-secondary-fixed text-on-secondary-fixed"];
  return null;
}

function matrix(perms) {
  const discount = perms.find((item) => item.includes("خصم"));
  const transfer = perms.find((item) => item.includes("نقل") || item.includes("تحويل"));
  return [
    { key: "بيع", label: "بيع POS", on: perms.some((item) => item.includes("بيع")) },
    { key: "خصم", label: discount || "خصم", on: Boolean(discount) },
    { key: "تكلفة", label: perms.some((item) => item.includes("تكلفة")) ? "رؤية سعر التكلفة" : "سعر التكلفة", on: perms.some((item) => item.includes("تكلفة")), highlight: perms.some((item) => item.includes("تكلفة")) },
    { key: "مخزون", label: transfer?.includes("نقل") ? "صلاحية نقل كاملة" : "تحويل مخزون", on: Boolean(transfer), highlight: Boolean(transfer?.includes("نقل")) },
  ];
}

export default function Staff() {
  const { db, query, addStaff, flash } = useStore();
  const [localQuery, setLocalQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [frozen, setFrozen] = useState({});
  const [grants, setGrants] = useState({});

  const searched = useMemo(() => {
    const term = (localQuery || query).trim();
    return db.staff.filter((person) => {
      const blob = `${person.name} ${person.phone} ${person.role} ${branchName(person.branch)}`;
      return !term || blob.includes(term);
    });
  }, [db.staff, localQuery, query]);

  const counts = {
    all: searched.length,
    online: searched.filter((person) => person.tone !== "leave").length,
    hura: searched.filter((person) => person.branch === "hura").length,
    segev: searched.filter((person) => person.branch === "segev").length,
    warehouse: searched.filter((person) => person.branch === "warehouse").length,
  };

  const rows = searched
    .filter((person) => {
      if (tab === "online") return person.tone !== "leave";
      if (tab === "all") return true;
      return person.branch === tab;
    })
    .slice()
    .sort((a, b) => (ORDER.indexOf(a.id) < 0 ? 99 : ORDER.indexOf(a.id)) - (ORDER.indexOf(b.id) < 0 ? 99 : ORDER.indexOf(b.id)));

  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const safePage = Math.min(page, pages);
  const start = (safePage - 1) * PAGE;
  const visible = rows.slice(start, start + PAGE);

  function permsOf(person) {
    return grants[person.id] || person.perms;
  }

  function togglePerm(person, slot) {
    const current = permsOf(person);
    const next = slot.on
      ? current.filter((item) => !item.includes(slot.key))
      : [...current, slot.label];
    setGrants((prev) => ({ ...prev, [person.id]: next }));
    flash("تم تحديث إعدادات الصلاحية وجاري مزامنتها مع أجهزة POS");
  }

  function save(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const perms = [...event.target.querySelectorAll("input[name=perm]:checked")].map((input) => input.value);
    addStaff({
      name: data.get("name"),
      phone: data.get("phone"),
      pin: data.get("pin"),
      role: data.get("role"),
      branch: data.get("branch"),
      shift: "حساب تشغيلي جديد",
      perms: perms.length ? perms : ["بيع POS"],
    });
    setOpen(false);
    setTab("all");
    setPage(1);
  }

  return (
    <div className="py-6 flex flex-col">
      <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">إدارة الموارد البشرية • Kunix OS</span>
          </div>
          <h1 className="text-[28px] font-bold">إدارة الموظفين وفريق العمل</h1>
          <p className="text-[14px] text-on-surface-variant">إدارة طاقم المبيعات، الصلاحيات الفردية، وحالات النشاط اللحظية عبر الفروع</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => flash("قوالب الصلاحيات: بائع، كاشير، أمين مستودع")} className="flex items-center gap-1.5 bg-surface-container px-4 py-2.5 rounded-xl text-[12px] font-semibold shadow-sm">
            <Icon name="tune" className="text-[18px]" /> قوالب الصلاحيات
          </button>
          <button type="button" onClick={() => flash("تصدير سجل الموظفين تجريبي")} className="flex items-center gap-1.5 bg-surface-container px-4 py-2.5 rounded-xl text-[12px] font-semibold shadow-sm">
            <Icon name="download" className="text-[18px]" /> تصدير السجل (XLS)
          </button>
          <button type="button" onClick={() => setOpen(true)} className="flex items-center gap-1.5 bg-primary-container text-white px-5 py-2.5 rounded-xl text-[12px] font-bold shadow-md active:scale-95">
            <Icon name="person_add" /> + إضافة موظف جديد
          </button>
        </div>
      </section>

      <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-5">
        <article className="relative overflow-hidden bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[12px] text-outline">إجمالي الموظفين</p>
            <p className="text-[36px] leading-none font-extrabold mt-1">14 <span className="text-[10px] text-on-surface-variant">موظف مسجل</span></p>
            <p className="text-[10px] text-tertiary font-bold mt-2 inline-flex items-center gap-1"><Icon name="trending_up" className="text-[14px]" />+2 انضموا هذا الشهر</p>
          </div>
          <span className="w-14 h-14 rounded-2xl bg-surface-container-low text-secondary grid place-items-center"><Icon name="badge" className="text-[28px]" /></span>
        </article>
        <article className="relative overflow-hidden bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[12px] text-outline">على رأس العمل الآن</p>
            <p className="text-[36px] leading-none font-extrabold text-tertiary mt-1">9 <span className="text-[10px] text-on-surface-variant">متصلون بنظام POS</span></p>
            <p className="text-[10px] text-on-surface-variant mt-2 inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse" />نسبة الحضور 64.2%</p>
          </div>
          <span className="relative w-14 h-14 grid place-items-center">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="19" fill="none" className="text-surface-container" stroke="currentColor" strokeWidth="5" />
              <circle cx="24" cy="24" r="19" fill="none" className="text-tertiary-container" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeDasharray="119.38" strokeDashoffset="42.9" />
            </svg>
            <Icon name="sensors" className="absolute text-tertiary text-[20px]" />
          </span>
        </article>
        <article className="relative overflow-hidden bg-white rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[12px] text-outline">فروع التشغيل المشمولة</p>
            <p className="text-[36px] leading-none font-extrabold text-primary-container mt-1">3 <span className="text-[10px] text-on-surface-variant">فرعين + مستودع</span></p>
            <p className="text-[10px] text-outline mt-2">حورة • شقيب السلام • مستودع حورة</p>
          </div>
          <span className="w-14 h-14 rounded-2xl bg-primary-fixed text-on-primary-fixed-variant grid place-items-center"><Icon name="storefront" className="text-[28px]" /></span>
        </article>
        <article className="bg-white rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[12px] text-outline">مبيعات الطاقم الشهرية</p>
              <p className="text-[22px] font-bold nums mt-0.5">342,850 ₪</p>
            </div>
            <span className="px-2 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[13px] font-bold nums">88%</span>
          </div>
          <div className="h-2 rounded-full bg-surface-container mt-3 overflow-hidden"><div className="h-full bg-secondary-container rounded-full" style={{ width: "88%" }} /></div>
          <div className="flex items-center justify-between mt-2 text-[10px] text-on-surface-variant">
            <span>المستهدف: 390,000 ₪</span>
            <span className="font-bold text-secondary">باقي 7 أيام</span>
          </div>
        </article>
      </section>

      <section className="bg-white rounded-2xl p-4 shadow-sm mb-5">
        <div className="flex flex-col xl:flex-row xl:items-center gap-3">
          <label className="relative w-full xl:w-80 shrink-0">
            <Icon name="search" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline" />
            <input value={localQuery} onChange={(event) => { setLocalQuery(event.target.value); setPage(1); }} placeholder="بحث بالاسم، رقم الجوال، أو الفرع..." className="w-full pr-11 pl-4 py-2.5 bg-surface-container-low rounded-xl text-[12px] placeholder:text-outline focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-container" />
          </label>
          <div className="flex items-center gap-1 overflow-x-auto min-w-0 flex-1">
            {[
              ["all", `جميع الكوادر (${counts.all})`],
              ["online", `على رأس العمل (${counts.online})`],
              ["hura", `فرع حورة (${counts.hura})`],
              ["segev", `فرع شقيب السلام (${counts.segev})`],
              ["warehouse", `المستودع (${counts.warehouse})`],
            ].map(([id, label]) => (
              <button key={id} type="button" onClick={() => { setTab(id); setPage(1); flash("تمت تصفية قائمة الموظفين"); }} className={`px-4 py-2 rounded-xl text-[12px] whitespace-nowrap ${tab === id ? "bg-primary-container text-white font-bold shadow-sm" : "text-on-surface-variant font-medium"}`}>{label}</button>
            ))}
          </div>
          <div className="flex gap-2 shrink-0">
            <button type="button" title="تصفية متقدمة" onClick={() => flash("التصفية المتقدمة تعمل من التبويبات")} className="p-2 rounded-xl bg-surface-container-low text-on-surface-variant"><Icon name="filter_list" /></button>
            <button type="button" title="إعدادات الأعمدة" onClick={() => flash("الأعمدة ثابتة في هذه النسخة")} className="p-2 rounded-xl bg-surface-container-low text-on-surface-variant"><Icon name="view_column" /></button>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right min-w-[1080px]">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant text-[12px] font-bold">
                {["الموظف وبيانات الاتصال", "الفرع والدور الوظيفي", "مصفوفة الصلاحيات المباشرة"].map((head) => <th key={head} className="py-3.5 px-4">{head}</th>)}
                <th className="py-3.5 px-4 text-center">مبيعات الشهر الحالي</th>
                <th className="py-3.5 px-4 text-center">حالة الحضور</th>
                <th className="py-3.5 px-5 text-left">إجراءات سريعة</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((person, index) => {
                const perms = permsOf(person);
                const slots = matrix(perms);
                const badge = chip(person);
                const leave = person.tone === "leave" || frozen[person.id];
                const [status, note] = String(person.presence).split(" • ");
                const warehouse = person.branch === "warehouse";
                const bar = person.sales ? Math.min(100, Math.round((person.sales / 120000) * 100)) : 0;
                const cost = perms.some((item) => item.includes("تكلفة"));
                return (
                  <tr key={person.id} className={`hover:bg-surface-container-low/60 ${index % 2 ? "bg-[#fbfbff]" : ""}`}>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <span className="relative">
                          <span className={`w-12 h-12 rounded-xl grid place-items-center font-bold shadow-sm ring-2 ${AVATAR[person.id] || "bg-surface-container text-on-surface ring-transparent"}`}>{initials(person.name)}</span>
                          <span className={`absolute -bottom-1 -left-1 w-3.5 h-3.5 rounded-full ring-2 ring-white ${leave ? "bg-outline" : "bg-tertiary-container"}`} />
                        </span>
                        <div>
                          <p className="text-[16px] font-bold inline-flex items-center gap-2">{person.name}{badge && <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badge[1]}`}>{badge[0]}</span>}</p>
                          <p className="text-[12px] text-on-surface-variant mt-0.5"><span className="nums text-outline tracking-wider">{person.phone}</span> • <span className={person.role.includes("Senior") ? "text-secondary font-medium" : ""}>{person.role}</span></p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-[12px] font-bold">
                        <Icon name={warehouse ? "warehouse" : person.role.includes("مسؤول") ? "domain" : "store"} className={`text-[14px] ${warehouse ? "text-outline" : "text-primary-container"}`} />
                        {branchName(person.branch)}
                      </span>
                      <p className="text-[10px] text-outline mt-1">{person.shift}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="grid grid-cols-2 gap-2 max-w-sm">
                        {slots.map((slot) => (
                          <div key={slot.key} className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg ${slot.highlight && slot.on ? (slot.key === "مخزون" ? "bg-primary-fixed/40" : "bg-secondary-fixed/40") : "bg-surface-container-low"} ${slot.on ? "" : "opacity-75"}`}>
                            <span className={`text-[10px] font-medium ${slot.highlight && slot.on ? (slot.key === "مخزون" ? "text-on-primary-fixed-variant font-bold" : "text-secondary font-bold") : slot.on ? "text-on-surface" : "text-outline"}`}>{slot.label}</span>
                            <button type="button" aria-pressed={slot.on} onClick={() => togglePerm(person, slot)} className={`w-8 h-4 rounded-full relative shrink-0 ${slot.on ? (slot.highlight && slot.key === "مخزون" ? "bg-primary-container" : slot.highlight ? "bg-secondary-container" : "bg-tertiary-container") : "bg-surface-container-highest"}`}>
                              <span className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow ${slot.on ? "left-4" : "left-0.5"}`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {warehouse ? (
                        <div>
                          <p className="text-[18px] font-bold text-outline">--</p>
                          <p className="text-[10px] text-on-surface-variant">{person.deals} حركة إدخال مخزن</p>
                          <p className="text-[10px] text-tertiary font-bold">دقة الجرد 99.8%</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <p className="text-[18px] font-bold nums">{person.sales ? person.sales.toLocaleString("en-US") : "—"} <span className="text-[10px] text-outline">₪</span></p>
                          <p className={`text-[10px] font-medium mt-0.5 ${cost ? "text-secondary font-bold" : person.sales > 80000 ? "text-tertiary font-bold" : "text-on-surface-variant"}`}>{person.deals} عملية بيع</p>
                          <div className="w-24 h-1.5 rounded-full bg-surface-container-low mt-1.5 overflow-hidden"><div className={`h-full rounded-full ${cost ? "bg-secondary-container" : "bg-primary-container"}`} style={{ width: `${bar}%` }} /></div>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${leave ? "bg-surface-container-high text-on-surface-variant" : "bg-tertiary-fixed text-on-tertiary-container"}`}>
                        <span className={`w-2 h-2 rounded-full ${leave ? "bg-outline" : "bg-tertiary-container animate-ping"}`} />
                        {frozen[person.id] ? "مجمّد مؤقتاً" : status}
                      </span>
                      {note && !frozen[person.id] && <p className="text-[10px] text-outline mt-1">{note}</p>}
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button type="button" title="تعديل بيانات وصلاحيات" onClick={() => flash(`تعديل ${person.name} يُحفظ مع Firebase`)} className="w-9 h-9 rounded-xl bg-surface-container-low text-on-surface-variant hover:text-primary-container hover:bg-primary-fixed grid place-items-center"><Icon name="edit" className="text-[18px]" /></button>
                        <button type="button" title="إعادة تعيين PIN" onClick={() => flash(`أُعيد تعيين PIN لـ ${person.name}`)} className="w-9 h-9 rounded-xl bg-surface-container-low text-on-surface-variant hover:text-secondary hover:bg-secondary-fixed grid place-items-center"><Icon name="lock_reset" className="text-[18px]" /></button>
                        <button type="button" title="تجميد الحساب مؤقتاً" onClick={() => { setFrozen((prev) => ({ ...prev, [person.id]: !prev[person.id] })); flash(frozen[person.id] ? `فُك تجميد ${person.name}` : `جُمّد حساب ${person.name} مؤقتاً`); }} className="w-9 h-9 rounded-xl bg-surface-container-low text-on-surface-variant hover:text-error hover:bg-error-container grid place-items-center"><Icon name="block" className="text-[18px]" /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!visible.length && <tr><td colSpan={6} className="py-8 text-center text-outline">لا موظفين ضمن هذا التصفية</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="bg-surface-container-low px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-on-surface-variant">
          <span>عرض <b className="text-on-surface nums">{visible.length}</b> من أصل <b className="text-on-surface nums">{rows.length}</b> موظف <span className="hidden md:inline">| يتم تطبيق مزامنة الصلاحيات على أجهزة الكاشير خلال <b className="text-secondary">30 ثانية</b></span></span>
          <div className="flex items-center gap-1">
            <button type="button" disabled={safePage === 1} onClick={() => setPage(safePage - 1)} className="w-9 h-9 rounded-xl bg-white shadow-sm disabled:opacity-50 grid place-items-center"><Icon name="chevron_right" className="text-[18px]" /></button>
            {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
              <button key={number} type="button" onClick={() => setPage(number)} className={`w-9 h-9 rounded-xl text-[13px] font-bold nums ${number === safePage ? "bg-primary-container text-white shadow-sm" : "bg-white"}`}>{number}</button>
            ))}
            <button type="button" disabled={safePage === pages} onClick={() => setPage(safePage + 1)} className="w-9 h-9 rounded-xl bg-white shadow-sm disabled:opacity-50 grid place-items-center"><Icon name="chevron_left" className="text-[18px]" /></button>
          </div>
        </div>
      </section>

      <section className="grid lg:grid-cols-3 gap-5 mt-5">
        <article className="bg-white rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-10 h-10 rounded-xl bg-secondary-fixed text-on-secondary-fixed grid place-items-center"><Icon name="shield_lock" /></span>
              <div><h3 className="text-[16px] font-bold">سياسات الأمان ومنع الاحتيال</h3><p className="text-[10px] text-outline">Kunix Zero-Trust Audit</p></div>
            </div>
            <p className="text-[12px] text-on-surface-variant leading-relaxed">جميع العمليات التي تتجاوز خصم 5% أو تعديل أسعار الهواتف المفتوحة تتطلب تأكيد رمز المشرف (Manager PIN) أو البصمة البيومترية الموثقة.</p>
          </div>
          <div className="flex items-center justify-between mt-4 bg-surface-container-low p-3 rounded-xl">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold"><Icon name="verified_user" className="text-tertiary text-[18px]" />سجل الرقابة المالية نشط</span>
            <button type="button" onClick={() => flash("سجل الرقابة تجريبي حتى ربط Firebase")} className="text-[10px] text-secondary font-bold">مراجعة السجلات</button>
          </div>
        </article>
        <article className="bg-white rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-primary-fixed text-on-primary-fixed-variant grid place-items-center"><Icon name="point_of_sale" /></span>
                <div><h3 className="text-[16px] font-bold">أجهزة نقاط البيع النشطة</h3><p className="text-[10px] text-outline">جلسات العمل المفتوحة</p></div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-container text-[13px] font-bold">5 محطات</span>
            </div>
            <div className="flex flex-col gap-2 text-[10px]">
              <p className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low"><b>محطة حورة #01 (POS-01)</b><span className="text-tertiary font-bold">خالد أبو القيعان • نشط</span></p>
              <p className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low"><b>محطة شقيب السلام #01 (POS-02)</b><span className="text-tertiary font-bold">تيسير الأطرش • نشط</span></p>
              <p className="flex items-center justify-between p-2 rounded-xl bg-surface-container-low"><b>محطة شقيب السلام #02 (POS-03)</b><span className="text-outline">غير متصلة حالياً</span></p>
            </div>
          </div>
          <button type="button" onClick={() => flash("إغلاق الجلسات تجريبي ولن يخرج المستخدم الحالي")} className="w-full mt-3 py-2 rounded-xl bg-surface-container text-[10px] font-bold">إغلاق كافة الجلسات المفتوحة (End of Day)</button>
        </article>
        <article className="bg-white rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-[12px] text-outline">فروع التشغيل المشمولة</p>
            <p className="text-[36px] leading-none font-extrabold text-primary-container mt-1">3 <span className="text-[10px] text-on-surface-variant">فرعين + مستودع</span></p>
            <p className="text-[10px] text-outline mt-2">حورة • شقيب السلام • مستودع حورة</p>
          </div>
          <button type="button" onClick={() => setOpen(true)} className="w-full mt-3 py-2 rounded-xl bg-secondary-container text-white text-[10px] font-bold shadow-sm">تخصيص رتب وصلاحيات جديدة</button>
        </article>
      </section>

      {open && (
        <Modal title="إضافة موظف جديد إلى النظام" onClose={() => setOpen(false)}>
          <p className="text-[12px] text-outline -mt-2 mb-3">إنشاء حساب تشغيلي، تعيين الفرع وتحديد الصلاحيات المباشرة</p>
          <form onSubmit={save}>
            <div className="grid sm:grid-cols-2 gap-3">
              <Field label="الاسم الكامل"><input name="name" required className={fieldClass} placeholder="مثال: عبد الله ناصر العتيبي" /></Field>
              <Field label="رقم الجوال"><input name="phone" required className={fieldClass} placeholder="05XXXXXXXX" /></Field>
              <Field label="الفرع">
                <select name="branch" className={fieldClass}>
                  {BRANCHES.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
                </select>
              </Field>
              <Field label="المسمى الوظيفي"><input name="role" required className={fieldClass} placeholder="مثال: بائع أجهزة / كاشير" /></Field>
              <Field label="رمز الدخول (PIN)"><input name="pin" required maxLength={4} className={fieldClass} placeholder="****" /></Field>
              <Field label="البريد للتقارير"><input name="email" type="email" className={fieldClass} placeholder="staff@kunix.sa" /></Field>
            </div>
            <p className="text-[14px] font-bold mb-2">تحديد الصلاحيات الممنوحة</p>
            <div className="grid sm:grid-cols-2 gap-2 bg-surface-container-low p-3 rounded-2xl mb-4">
              {[
                ["بيع POS", true],
                ["خصم حتى 5%", true],
                ["سعر التكلفة", false],
                ["تحويل مخزون", true],
                ["إرجاع بضاعة", false],
                ["إقفال الصندوق", false],
              ].map(([label, checked]) => (
                <label key={label} className="flex items-center justify-between p-2 rounded-xl bg-white text-[12px]">
                  {label}
                  <input name="perm" value={label} type="checkbox" defaultChecked={checked} className="accent-primary-container" />
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="px-4 py-2.5 rounded-xl bg-surface-container text-[12px] font-semibold">إلغاء</button>
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-primary-container text-white text-[12px] font-bold">حفظ وإصدار بطاقة الموظف</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

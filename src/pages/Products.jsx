import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { money, statusLabel, stockStatus } from "../data/seed";
import { Field, Icon, Modal, fieldClass } from "../components/ui";

const CATEGORIES = ["جميع التصنيفات", "هواتف ذكية", "إكسسوارات وحماية", "شواحن وكوابل", "سماعات وصوتيات"];
const BRANDS = ["جميع الماركات", "Apple", "Samsung", "Anker", "Belkin", "Xiaomi"];
const SIZES = [5, 10, 25, 50, 100];

const selectClass = "appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-[12px] pr-8 pl-8 py-2.5 rounded-xl cursor-pointer focus:outline-none focus:border-orange-500";

function brandChip(brand) {
  if (brand === "Apple") return "bg-slate-900 text-white";
  if (brand === "Samsung") return "bg-blue-100 text-blue-800 border border-blue-200";
  if (brand === "Anker") return "bg-emerald-100 text-emerald-800 border border-emerald-200";
  return "bg-slate-100 text-slate-700 border border-slate-200";
}

function statusPill(status) {
  if (status === "low") return "bg-amber-100 text-amber-800 border-amber-200";
  if (status === "out") return "bg-red-100 text-red-800 border-red-200";
  return "bg-emerald-100 text-emerald-800 border-emerald-200";
}

function dot(status) {
  if (status === "low") return "bg-amber-500";
  if (status === "out") return "bg-red-600";
  return "bg-emerald-600";
}

function rowStatus(product) {
  const status = stockStatus(product);
  if (status !== "ok") return status;
  const thin = ["rahat", "segev", "hura"].some((id) => {
    const qty = product.stock?.[id] || 0;
    return qty > 0 && qty <= 1;
  });
  return thin ? "low" : "ok";
}

export default function Products() {
  const { db, query, addProduct, updatePrice, removeProduct, flash } = useStore();
  const navigate = useNavigate();
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [brand, setBrand] = useState(BRANDS[0]);
  const [branch, setBranch] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [localQuery, setLocalQuery] = useState("");
  const [grid, setGrid] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [picked, setPicked] = useState([]);
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [menu, setMenu] = useState(null);
  const [draft, setDraft] = useState({ name: "", brand: "Apple", category: "هواتف ذكية", sku: "", barcode: "", cost: "", price: "", variant: "" });

  const rows = useMemo(() => db.products.filter((product) => {
    const term = (localQuery || query).trim().toLowerCase();
    const blob = `${product.name} ${product.sku} ${product.barcode} ${product.variant} ${product.imei || ""}`.toLowerCase();
    if (term && !blob.includes(term)) return false;
    if (category !== CATEGORIES[0] && product.category !== category) return false;
    if (brand !== BRANDS[0] && product.brand !== brand) return false;
    if (branch !== "all" && !(product.stock?.[branch] > 0)) return false;
    const status = rowStatus(product);
    if (availability === "ok" && status !== "ok") return false;
    if (availability === "low" && status !== "low") return false;
    if (availability === "out" && status !== "out") return false;
    return true;
  }), [db.products, query, localQuery, category, brand, branch, availability]);

  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const safePage = Math.min(page, pages);
  const start = (safePage - 1) * pageSize;
  const visible = rows.slice(start, start + pageSize);

  function resetFilters() {
    setCategory(CATEGORIES[0]);
    setBrand(BRANDS[0]);
    setBranch("all");
    setAvailability("all");
    setLocalQuery("");
    setPage(1);
  }

  function saveProduct(event) {
    event.preventDefault();
    addProduct({
      ...draft,
      cost: Number(draft.cost),
      price: Number(draft.price),
      badge: "جديد",
      note: "أضيف يدوياً",
      stock: { rahat: 1, segev: 0, hura: 0, warehouse: 0 },
    });
    setOpen(false);
  }

  function toggle(id) {
    setPicked((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  }

  return (
    <div className="py-6 flex flex-col gap-4">
      <section className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-7 bg-orange-500 rounded-full" />
            <h1 className="text-2xl font-black text-slate-900">إدارة المنتجات وقائمة الأسعار</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[12px] font-black">مزامنة فورية</span>
          </div>
          <p className="text-[14px] text-slate-500 mt-1 mr-5">
            إجمالي <strong className="text-slate-900 nums text-[16px]">{db.products.length}</strong> منتجاً متزامناً ومسعراً عبر كافة الفروع ومستودعات التوزيع
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => flash("تعديل الأسعار الجماعي يفتح مع ربط Firebase")} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-[12px] font-bold">
            <Icon name="tune" className="text-indigo-600" /> تعديل أسعار جماعي (Bulk Edit)
          </button>
          <button type="button" onClick={() => flash("تصدير Excel تجريبي جاهز لاحقاً")} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-[12px] font-bold">
            <Icon name="file_download" className="text-emerald-600" /> استيراد / تصدير Excel
          </button>
          <button type="button" onClick={() => setOpen(true)} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-[12px] font-black shadow-md shadow-orange-500/25 active:scale-95">
            <Icon name="add_box" /> + إضافة منتج جديد
          </button>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          ["إجمالي القيمة التقديرية للمخزون", "2,840,000", "₪", "trending_up", "بسعر البيع الفعلي المستهدف", "text-slate-900", "text-emerald-600", "bg-emerald-50 text-emerald-600 border-emerald-100", "account_balance"],
          ["متوسط هامش الربح الإجمالي", "22.4%", "صافي", "check_circle", "مستقر ومطابق لأهداف المبيعات", "text-indigo-600", "text-indigo-600", "bg-indigo-50 text-indigo-600 border-indigo-100", "percent"],
          ["منتجات بحاجة لإعادة طلب / نواقص", "14", "صنفاً", "warning", "6 منها أجهزة رائدة (Flagship)", "text-amber-600", "text-amber-600", "bg-amber-50 text-amber-600 border-amber-100", "priority_high"],
          ["إجمالي مبيعات الهواتف اليوم", "38", "جهازاً", "bolt", "الأعلى مبيعاً: iPhone 15 Pro Max", "text-slate-900", "text-emerald-600", "bg-orange-50 text-orange-600 border-orange-100", "shopping_cart_checkout"],
        ].map(([label, value, unit, trend, hint, valueClass, hintClass, iconClass, icon]) => (
          <article key={label} className="bg-white rounded-2xl p-5 border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-[12px] text-slate-500 font-bold">{label}</p>
              <p className={`text-[24px] font-black nums mt-1 ${valueClass}`}>{value} <span className="text-[12px] text-slate-500">{unit}</span></p>
              <p className={`text-[12px] font-bold mt-1 inline-flex items-center gap-1 ${hintClass}`}><Icon name={trend} className="text-[16px]" />{hint}</p>
            </div>
            <span className={`w-12 h-12 rounded-2xl border grid place-items-center ${iconClass}`}><Icon name={icon} /></span>
          </article>
        ))}
      </section>

      <section className="bg-white rounded-2xl p-5 border border-slate-200 flex flex-col gap-4">
        <div className="flex flex-col xl:flex-row gap-3">
          <label className="relative flex-1">
            <Icon name="search" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={localQuery}
              onChange={(event) => { setLocalQuery(event.target.value); setPage(1); }}
              placeholder="بحث باسم المنتج، الموديل، الباركود EAN، أو الرقم التسلسلي IMEI..."
              className="w-full pr-11 pl-28 py-3 bg-slate-50 border border-slate-200 rounded-xl text-[12px] focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-slate-200/80 text-[10px] nums text-slate-600 font-bold">مسح باركود</span>
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <label className="relative">
              <Icon name="category" className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600 text-[16px]" />
              <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className={selectClass}>
                {CATEGORIES.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="relative">
              <Icon name="verified" className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600 text-[16px]" />
              <select value={brand} onChange={(e) => { setBrand(e.target.value); setPage(1); }} className={selectClass}>
                {BRANDS.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label className="relative">
              <Icon name="storefront" className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600 text-[16px]" />
              <select value={branch} onChange={(e) => { setBranch(e.target.value); setPage(1); }} className={selectClass}>
                <option value="all">كافة الفروع</option>
                <option value="rahat">فرع رهط الرئيسي</option>
                <option value="segev">فرع شقيب السلام</option>
                <option value="hura">فرع حورة</option>
                <option value="warehouse">المستودع المركزي</option>
              </select>
            </label>
            <label className="relative">
              <Icon name="inventory" className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600 text-[16px]" />
              <select value={availability} onChange={(e) => { setAvailability(e.target.value); setPage(1); }} className={selectClass}>
                <option value="all">حالة التوفر</option>
                <option value="ok">متوفر بالمخزون</option>
                <option value="low">مخزون منخفض</option>
                <option value="out">نفذت الكمية</option>
              </select>
            </label>
            <button type="button" onClick={resetFilters} title="إعادة تعيين المرشحات" className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500">
              <Icon name="restart_alt" />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-[12px]">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 font-bold">الفلاتر المطبقة:</span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">التصنيف: {category === CATEGORIES[0] ? "كل الأصناف" : category}</span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">الحالة: {availability === "all" ? "نشط ومفعل" : statusLabel(availability)}</span>
            <button type="button" onClick={resetFilters} className="text-orange-600 font-bold">تفريغ كافة الفلاتر</button>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <span>طريقة العرض:</span>
            <button type="button" onClick={() => setGrid(false)} className={`p-1.5 rounded-lg border ${grid ? "border-transparent text-slate-400" : "bg-orange-50 text-orange-600 border-orange-200"}`}><Icon name="table_rows" className="text-[18px]" /></button>
            <button type="button" onClick={() => setGrid(true)} className={`p-1.5 rounded-lg border ${grid ? "bg-orange-50 text-orange-600 border-orange-200" : "border-transparent text-slate-400"}`}><Icon name="grid_view" className="text-[18px]" /></button>
          </div>
        </div>
      </section>

      {grid ? (
        <section className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {visible.map((product) => {
            const status = rowStatus(product);
            const margin = product.cost ? Math.round(((product.price - product.cost) / product.cost) * 100) : 0;
            return (
              <article key={product.id} className="bg-white rounded-2xl border border-slate-200 p-4">
                <div className="h-28 rounded-xl bg-slate-100 border border-slate-200 grid place-items-center relative mb-3">
                  <span className="text-2xl font-black text-slate-400">{product.brand[0]}</span>
                  <span className="absolute bottom-0 right-0 bg-slate-900 text-white text-[10px] px-1.5 font-bold rounded-tl">{product.badge}</span>
                </div>
                <h3 className="font-extrabold">{product.name}</h3>
                <p className="text-[12px] text-slate-500">{product.variant}</p>
                <p className="nums text-[22px] font-black mt-2">{money(product.price)} <span className="text-[12px] text-emerald-700">+{margin}%</span></p>
                <span className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-black border ${statusPill(status)}`}><span className={`w-2 h-2 rounded-full ${dot(status)}`} />{statusLabel(status)}</span>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
              <span className="text-[14px] font-black">جدول المخزون والتسعير الموحد</span>
              <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 nums text-[12px] font-bold">عرض {visible.length} من أصل {rows.length} صنف</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[12px] text-slate-500 inline-flex items-center gap-1"><Icon name="verified_user" className="text-[16px]" />صلاحية كشف التكلفة: مدير عام فقط</span>
              <button type="button" onClick={() => flash(picked.length ? `طباعة ${picked.length} باركود` : "حدّد أصنافاً أولاً")} className="text-indigo-600 text-[12px] font-bold bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg inline-flex items-center gap-1">
                <Icon name="print" className="text-[16px]" /> طباعة باركودات محددة
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right min-w-[1100px]">
              <thead>
                <tr className="bg-slate-100/90 text-slate-700 text-[12px] font-black h-12 border-b border-slate-200">
                  <th className="px-4 w-12 text-center"><input type="checkbox" className="accent-orange-500" checked={visible.length > 0 && visible.every((product) => picked.includes(product.id))} onChange={() => setPicked(visible.every((product) => picked.includes(product.id)) ? [] : visible.map((product) => product.id))} /></th>
                  {["المنتج وتفاصيل SKU والباركود", "التصنيف والماركة", "سعر التكلفة", "سعر البيع للجمهور والهامش", "المخزون وتوزيعه بالفروع المحلية", "حالة التوفر", "الإجراءات السريعة"].map((head) => (
                    <th key={head} className="px-4 py-3 font-black">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((product) => {
                  const status = rowStatus(product);
                  const total = (product.stock?.rahat || 0) + (product.stock?.segev || 0) + (product.stock?.hura || 0);
                  const margin = product.cost ? Math.round(((product.price - product.cost) / product.cost) * 100) : 0;
                  const gain = product.price - product.cost;
                  const parts = [
                    ["rahat", "رهط", "bg-orange-500", "text-orange-600"],
                    ["segev", "شقيب", "bg-indigo-500", "text-indigo-600"],
                    ["hura", "حورة", product.stock?.hura <= 1 ? "bg-red-500" : "bg-emerald-500", product.stock?.hura <= 1 ? "text-red-700" : "text-emerald-600"],
                  ];
                  return (
                    <tr key={product.id} className="border-t border-slate-200 hover:bg-slate-50/80">
                      <td className="px-4 py-4 text-center"><input type="checkbox" className="accent-orange-500" checked={picked.includes(product.id)} onChange={() => toggle(product.id)} /></td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 rounded-xl bg-slate-100 border border-slate-200 grid place-items-center relative shrink-0">
                            <span className="font-black text-slate-400">{product.brand[0]}</span>
                            <span className="absolute bottom-0 right-0 bg-slate-900 text-white text-[9px] px-1 font-bold rounded-tl">{product.badge}</span>
                          </div>
                          <div>
                            <p className="text-[14px] font-extrabold hover:text-orange-600">{product.name}</p>
                            <p className="text-[12px] text-slate-500">{product.variant}</p>
                            <div className="flex items-center gap-2 mt-1.5 text-[11px] nums">
                              <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-semibold">SKU: {product.sku}</span>
                              <span className="text-slate-400 inline-flex items-center gap-0.5"><Icon name="barcode" className="text-[14px]" />{product.barcode}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${brandChip(product.brand)}`}>{product.brand}</span>
                        <div className="text-[11px] text-slate-500 font-bold bg-slate-100 px-2 py-0.5 rounded-md mt-1 inline-block">{product.category}</div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="inline-flex flex-col items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                          <span className="nums text-[16px] font-extrabold">{money(product.cost)}</span>
                          <span className="text-[10px] text-indigo-700 font-black bg-indigo-50 px-1.5 py-0.5 rounded mt-0.5 inline-flex items-center gap-0.5"><Icon name="lock" className="text-[12px]" />تكلفة مؤمنة</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="nums text-[18px] font-black">{product.price.toLocaleString("en-US")} <span className="text-[12px] text-orange-600">₪</span></div>
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black nums"><Icon name="trending_up" className="text-[13px]" />+{margin}% هامش</span>
                          <span className="text-[10px] text-emerald-700 font-bold nums">(+{gain.toLocaleString("en-US")} ₪)</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="min-w-[240px]">
                          <div className="flex items-center justify-between text-[12px]">
                            <b className={status === "low" ? "text-amber-700" : "text-slate-900"}>إجمالي {total} قطعة بالمخازن</b>
                            <span className={`px-2 py-0.5 rounded font-bold ${status === "low" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{product.note}</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full flex overflow-hidden border border-slate-200 mt-1.5">
                            {parts.map(([key, , color]) => (
                              <div key={key} className={`${color} h-full`} style={{ width: total ? `${((product.stock?.[key] || 0) / total) * 100}%` : 0 }} />
                            ))}
                          </div>
                          <div className="flex gap-1 mt-1.5 text-[11px] nums">
                            {parts.map(([key, label, , text]) => (
                              <span key={key} className={`px-1.5 py-0.5 rounded border ${key === "hura" && product.stock?.hura <= 1 ? "bg-red-50 border-red-200" : "bg-slate-100 border-slate-200"}`}>{label}: <strong className={text}>{product.stock?.[key] || 0}</strong></span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-black border ${statusPill(status)}`}>
                          <span className={`w-2 h-2 rounded-full ${dot(status)}`} />{statusLabel(status)}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-1 relative">
                          <button type="button" title="تعديل السعر والمنتج" onClick={() => setEdit(product)} className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-orange-600 hover:bg-orange-50"><Icon name="edit" className="text-[18px]" /></button>
                          <button type="button" title="طباعة الباركود" onClick={() => flash(`باركود ${product.barcode}`)} className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"><Icon name="barcode_scanner" className="text-[18px]" /></button>
                          <button type="button" title="سجل حركات المخزون" onClick={() => navigate("/inventory")} className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600"><Icon name="history" className="text-[18px]" /></button>
                          <button type="button" title="المزيد" onClick={() => setMenu(menu === product.id ? null : product.id)} className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400"><Icon name="more_vert" className="text-[18px]" /></button>
                          {menu === product.id && (
                            <button type="button" onClick={() => { removeProduct(product.id); setMenu(null); }} className="absolute top-9 left-0 z-10 bg-white border border-red-200 text-red-600 text-[12px] font-bold px-3 py-2 rounded-lg shadow">حذف المنتج</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!visible.length && <tr><td colSpan={8} className="p-8 text-center text-slate-400">لا منتجات ضمن هذا البحث</td></tr>}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-slate-600">
            <div className="flex items-center gap-4">
              <span>عرض النتائج من <b className="nums text-slate-900">{rows.length ? start + 1 : 0}</b> إلى <b className="nums text-slate-900">{Math.min(start + pageSize, rows.length)}</b> من أصل <b className="nums text-slate-900">{rows.length}</b> منتج</span>
              <label className="flex items-center gap-1.5 text-slate-400">عدد المنتجات بالصفحة:
                <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="bg-white border border-slate-300 text-slate-800 rounded-lg px-2 py-1 nums">
                  {SIZES.map((size) => <option key={size}>{size}</option>)}
                </select>
              </label>
            </div>
            <div className="flex items-center gap-1.5">
              <button type="button" disabled={safePage === 1} onClick={() => setPage(safePage - 1)} className="w-9 h-9 rounded-xl bg-white border border-slate-200 disabled:opacity-40"><Icon name="chevron_right" /></button>
              {Array.from({ length: pages }, (_, index) => index + 1).slice(0, 4).map((number) => (
                <button key={number} type="button" onClick={() => setPage(number)} className={`w-9 h-9 rounded-xl nums font-bold text-[12px] ${number === safePage ? "bg-orange-500 text-white shadow-md shadow-orange-500/25" : "bg-white border border-slate-200"}`}>{number}</button>
              ))}
              <button type="button" disabled={safePage === pages} onClick={() => setPage(safePage + 1)} className="w-9 h-9 rounded-xl bg-white border border-slate-200 disabled:opacity-40"><Icon name="chevron_left" /></button>
            </div>
          </div>
        </section>
      )}

      <section className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 text-[12px] text-slate-500">
        <span className="inline-flex items-center gap-1.5 text-slate-900 font-bold"><Icon name="check_circle" className="text-emerald-600" />مزامنة الباركودات والأسعار مع أنظمة نقاط البيع (POS) نشطة ومحدثة لحظياً <span className="text-slate-400 font-normal">• آخر تدقيق تسعيري: اليوم 11:24 ص بواسطة (أنور أبو القيعان)</span></span>
        <span className="flex gap-3"><button type="button" onClick={() => flash("سجل التدقيق تجريبي")} className="text-indigo-600 font-bold">سجل تدقيق التغييرات (Audit Log)</button><button type="button" onClick={() => flash("تصدير CSV تجريبي")} className="text-orange-600 font-bold">تصدير تقرير الجرد المالي (CSV)</button></span>
      </section>

      {open && (
        <Modal title="إضافة منتج جديد" onClose={() => setOpen(false)}>
          <form onSubmit={saveProduct}>
            <Field label="اسم المنتج"><input required className={fieldClass} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
            <Field label="الوصف"><input className={fieldClass} value={draft.variant} onChange={(e) => setDraft({ ...draft, variant: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="SKU"><input required className={fieldClass} value={draft.sku} onChange={(e) => setDraft({ ...draft, sku: e.target.value })} /></Field>
              <Field label="الباركود"><input className={fieldClass} value={draft.barcode} onChange={(e) => setDraft({ ...draft, barcode: e.target.value })} /></Field>
              <Field label="التكلفة"><input required type="number" className={fieldClass} value={draft.cost} onChange={(e) => setDraft({ ...draft, cost: e.target.value })} /></Field>
              <Field label="سعر البيع"><input required type="number" className={fieldClass} value={draft.price} onChange={(e) => setDraft({ ...draft, price: e.target.value })} /></Field>
            </div>
            <button className="h-11 px-4 rounded-lg bg-orange-500 text-white font-bold" type="submit">حفظ في البيانات التجريبية</button>
          </form>
        </Modal>
      )}
      {edit && (
        <Modal title={`سعر ${edit.name}`} onClose={() => setEdit(null)}>
          <form onSubmit={(event) => { event.preventDefault(); updatePrice(edit.id, event.target.price.value); setEdit(null); }}>
            <Field label="سعر البيع للجمهور"><input name="price" type="number" defaultValue={edit.price} className={fieldClass} /></Field>
            <button className="h-11 px-4 rounded-lg bg-orange-500 text-white font-bold" type="submit">تحديث</button>
          </form>
        </Modal>
      )}
    </div>
  );
}

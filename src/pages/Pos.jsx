import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "../context/StoreContext";
import { branchName } from "../data/seed";
import { Icon } from "../components/ui";

const CATS = ["الكل", "هواتف آيفون", "هواتف سامسونج", "شواحن وكوابل", "حمايات وكفرات", "سماعات وملحقات"];
const PAYS = [
  ["فيزا / ماستركارد", "credit_card"],
  ["كاش نقدي", "payments"],
  ["بت Bit", "contactless"],
  ["تقسيط دفعات", "calendar_month"],
];
const REASONS = [
  ["promo", "عرض تسويقي مباشر مع الجهاز"],
  ["vip", "عميل دائم ومميز للمحل"],
  ["cash", "خصم تفاوضي نقدي معتمد"],
  ["damage", "عيب طفيف في كرتون التغليف"],
];

const LOOK = {
  p1: { title: "آيفون 15 برو ماكس تيتانيوم أزرق", cart: "آيفون 15 برو ماكس تيتانيوم أزرق 256GB", mark: "256GB", icon: "smartphone", tone: "text-primary-container", photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0fNhyPLyRa1bUY8eni1ArfvkIHcScMS2310LUT2v3wnWadHFz4AwbiHuNttoWkI989iANV1laTBHz_a1-hoKp8eBjpGIuNTmkTQG629LcxQN-Gvw1vyerUzO0YcTjgXI99OvqvZbOV2GeLHYWEtbye3pdKeSIjB_mlgCmzP1W9987u_lHhs2i37WjadhvV_elUeChr-E6lTLmcLrUT-5YQWvJn3rDRXVH16qybcX9" },
  p2: { title: "سامسونج جالاكسي S24 ألترا أسود", cart: "سامسونج جالاكسي S24 ألترا أسود 512GB", mark: "512GB", icon: "smartphone", tone: "text-primary-container", photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCuHxpzX64GQRq_ehHl_XbXMBxcNyEF5iCu0Vd94TpcGZfRd97rCMiF6DdvGLRt7jPBEguyeuPKhixNTKHMCha0a5G6yBwtCRBIZMQrNlI3aNcHPRRN1F1j2D1p3UD0VDA3xnBo6hjgHKRg_yXSvVbVf9eoEIPexXC6WMP2uyW0yjjwfzCjC0gxgJs7uGZnrfuUgJBCHV021OwtxXkJQjLrzuvv7dlrH-uzYnWWoljE" },
  p3: { title: "سماعات Apple AirPods Pro (الجيل الثاني Type-C)", cart: "سماعات Apple AirPods Pro (الجيل الثاني)", mark: "USB-C", icon: "headphones", tone: "text-secondary" },
  p4: { title: "شاحن جداري سريع Anker Nano 30W Type-C", cart: "شاحن جداري Anker 65W GaN", mark: "GaN", icon: "power", tone: "text-secondary" },
  p5: { title: "كفر سيليكون أصلي MagSafe كحلي", cart: "كفر حماية سيليكون أصلي MagSafe", mark: "MagSafe", icon: "shield", tone: "text-secondary", photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTLqLCavNi0A9bMNPLFuRnFZo9ZCZ0Fw9JmJberEy8dB0a--89kb4QLeVfnY2HlUFh_lLn_5BwxWuhIdjwjdhShfkYM-RHoFR0DMvngN_xdE2-gCSDcXjnOxIV2AZZWG1WNH0AOoJHwyX1OivNIvkOpAExpzbaMrYcsZ-HCIEO3Uolo-oYpql7I2jx5ijCW_kI4V5kONO4FByl_FtuHDG0OnNKI805HyCwcvycJn6l", extra: "لون كحلي" },
  p6: { title: "حماية شاشة زجاجية خصوصية Belkin UltraGlass", cart: "حماية شاشة Belkin UltraGlass", mark: "خصوصية", icon: "screen_lock_portrait", tone: "text-primary" },
};

function look(product) {
  return LOOK[product.id] || { title: product.name, cart: product.name, mark: product.badge || "", icon: "devices", tone: "text-on-surface" };
}

function inCat(product, cat) {
  if (cat === "الكل") return true;
  if (cat === "هواتف آيفون") return product.brand === "Apple" && product.category.includes("هواتف");
  if (cat === "هواتف سامسونج") return product.brand === "Samsung";
  if (cat === "شواحن وكوابل") return product.category.includes("شواحن");
  if (cat === "حمايات وكفرات") return product.category.includes("إكسسوار");
  return product.category.includes("سماع");
}

function stockLabel(qty) {
  if (qty === 2) return "متبقي قطعتين";
  if (qty === 1) return "متبقي قطعة";
  if (qty === 0) return "نفد من الفرع";
  return `متبقي ${qty} ${qty < 10 ? "قطع" : "قطعة"}`;
}

function money(value, digits = 0) {
  return Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export default function Pos() {
  const { db, session, branch, checkout, flash } = useStore();
  const register = branch === "all" || branch === "warehouse" ? "rahat" : branch;
  const searchRef = useRef(null);
  const [cat, setCat] = useState(CATS[0]);
  const [term, setTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [held, setHeld] = useState(null);
  const [pay, setPay] = useState(PAYS[0][0]);
  const [discount, setDiscount] = useState(0);
  const [reason, setReason] = useState("promo");
  const [customer, setCustomer] = useState("خليل النصاصرة (052-8741963)");
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    if (seeded || !db.products.length) return;
    const picks = ["p1", "p5"].map((id) => db.products.find((product) => product.id === id)).filter(Boolean);
    setCart(picks.map((product) => ({ ...product, qty: 1 })));
    setSeeded(true);
  }, [db.products, seeded]);

  useEffect(() => {
    function onKey(event) {
      if (event.key === "F2") {
        event.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
      if (event.key === "F9") {
        event.preventDefault();
        finish();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const products = useMemo(() => {
    const q = term.trim().toLowerCase();
    return db.products.filter((product) => {
      if (!inCat(product, cat)) return false;
      if (!q) return true;
      const blob = `${product.name} ${product.brand} ${product.sku} ${product.barcode || ""} ${product.imei || ""} ${look(product).title}`.toLowerCase();
      return blob.includes(q);
    });
  }, [db.products, cat, term]);

  const rate = 1 + (db.settings.vat || 0) / 100;
  const sticker = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountN = Math.max(0, Number(discount) || 0);
  const due = Math.max(0, sticker - discountN);
  const net = Math.round((due / rate) * 100) / 100;
  const tax = Math.round((due - net) * 100) / 100;

  function qtyOf(id) {
    return db.products.find((product) => product.id === id)?.stock?.[register] ?? 0;
  }

  function add(product) {
    const left = qtyOf(product.id);
    setCart((prev) => {
      const found = prev.find((item) => item.id === product.id);
      const nextQty = (found?.qty || 0) + 1;
      if (nextQty > left) {
        flash(left ? `المتوفر في الفرع ${left} فقط` : "الصنف نفد من هذا الفرع");
        return prev;
      }
      if (found) return prev.map((item) => (item.id === product.id ? { ...item, qty: nextQty } : item));
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function setQty(id, qty) {
    setCart((prev) => prev.flatMap((item) => {
      if (item.id !== id) return [item];
      if (qty <= 0) return [];
      if (qty > qtyOf(id)) {
        flash(`المتوفر في الفرع ${qtyOf(id)} فقط`);
        return [item];
      }
      return [{ ...item, qty }];
    }));
  }

  function scan(event) {
    event.preventDefault();
    const q = term.trim().toLowerCase();
    if (!q) return;
    const exact = db.products.find((product) => [product.barcode, product.sku, product.imei].some((code) => code && code.toLowerCase() === q));
    const hit = exact || (products.length === 1 ? products[0] : null);
    if (!hit) {
      flash("لا يوجد صنف مطابق لهذا الباركود");
      return;
    }
    add(hit);
    setTerm("");
  }

  function finish() {
    if (!cart.length || due <= 0) return;
    if (discountN > 50) {
      flash("الحد الأقصى للخصم في هذه الوردية 50 ₪");
      return;
    }
    checkout({
      items: cart.map((item) => ({ ...item, name: look(item).cart, price: Math.round((item.price / rate) * 100) / 100 })),
      pay,
      discount: Math.round((discountN / rate) * 100) / 100,
      seller: session?.name || "عمار القريناوي",
      branchId: register,
    });
    setCart([]);
    setDiscount(0);
  }

  function hold() {
    if (cart.length) {
      setHeld(cart);
      setCart([]);
      flash("تم تعليق الفاتورة. اضغط التعليق مرة أخرى لاسترجاعها");
      return;
    }
    if (held?.length) {
      setCart(held);
      setHeld(null);
      flash("تمت استعادة الفاتورة المعلقة");
    }
  }

  const cashierNo = session?.name?.includes("عمار") ? "104" : String((session?.id || "s1").replace(/\D/g, "") || "1").padStart(3, "0");

  return (
    <div className="py-6 flex flex-col gap-4">
      <section className="bg-white rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary-container text-white grid place-items-center shadow-md">
            <Icon name="point_of_sale" className="text-[26px]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[18px] font-extrabold">محطة البيع السريع (كاشير الموظف)</h1>
              <span className="px-2 py-0.5 rounded-full bg-tertiary-container/20 text-tertiary text-[11px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary" /> نوبة مباشرة
              </span>
            </div>
            <p className="text-[12px] text-on-surface-variant">
              الكاشير: {session?.name || "عمار القريناوي"} (رقم الكاشير: #{cashierNo}) • صندوق رقم 2 • وضع التسعير للبيع المباشر ({branchName(register)})
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low text-[13px]">
            <Icon name="timer" className="text-primary text-[16px]" />
            <span>مدة الوردية: 04:32:18</span>
          </div>
          <button type="button" onClick={hold} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-high text-[13px] font-bold">
            <Icon name="pause_circle" className="text-[18px]" />
            تعليق الفاتورة (F4)
          </button>
          <button type="button" onClick={() => flash("تم تحديث كميات المخزون من البيانات التجريبية")} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-container-high text-[13px] font-bold">
            <Icon name="sync" className="text-[18px]" />
            تحديث المخزون
          </button>
        </div>
      </section>

      <section className="grid xl:grid-cols-12 gap-4 items-start">
        <div className="xl:col-span-7 flex flex-col gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col gap-3">
            <form onSubmit={scan} className="relative flex items-center">
              <Icon name="barcode_scanner" className="absolute right-3.5 text-primary text-[24px] pointer-events-none" />
              <input
                ref={searchRef}
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder="امسح الباركود، رقم IMEI، أو اكتب اسم الجهاز / الإكسسوار..."
                className="w-full pr-12 pl-24 py-3 bg-surface-container-low rounded-xl text-[14px] outline-none focus:bg-white focus:ring-2 focus:ring-primary-container"
              />
              <div className="absolute left-3 flex items-center gap-1.5">
                <kbd className="px-2 py-1 rounded bg-surface-container-high text-on-surface-variant text-[11px] font-bold">F2</kbd>
                <button type="submit" className="w-8 h-8 rounded-lg bg-primary-container text-white grid place-items-center">
                  <Icon name="search" className="text-[18px]" />
                </button>
              </div>
            </form>
            <div className="flex items-center gap-2 overflow-x-auto">
              {CATS.map((item) => (
                <button key={item} type="button" onClick={() => setCat(item)} className={`px-3 py-2 rounded-lg text-[13px] whitespace-nowrap ${cat === item ? "bg-primary-container text-white font-bold shadow-sm" : "bg-surface-container-low hover:bg-surface-container-high"}`}>
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {products.map((product) => {
              const face = look(product);
              const left = qtyOf(product.id);
              const low = left <= 2;
              return (
                <article key={product.id} className="group bg-white rounded-xl p-3 shadow-sm hover:shadow-md relative overflow-hidden flex flex-col">
                  <span className={`absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full text-[11px] font-bold ${low ? "bg-error-container text-on-error-container" : left <= 8 ? "bg-tertiary-container/15 text-tertiary" : "bg-secondary-fixed text-on-secondary-fixed"}`}>
                    {stockLabel(left)}
                  </span>
                  <div className="w-full h-36 rounded-lg bg-surface-container-low mb-2 overflow-hidden relative grid place-items-center">
                    {face.photo ? (
                      <img src={face.photo} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <Icon name={face.icon} className="text-outline/50 text-[48px]" />
                    )}
                    {face.mark && <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-white/90 text-[11px] font-bold nums">{face.mark}</span>}
                  </div>
                  <span className="text-[11px] font-bold text-secondary">{product.brand}</span>
                  <h3 className="text-[14px] font-bold leading-snug line-clamp-1">{face.title}</h3>
                  <span className="text-[11px] text-outline nums mt-0.5">{product.imei ? `IMEI: ${product.imei.slice(0, 10)}...` : `SKU: ${product.sku}`}</span>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[18px] font-extrabold nums">{money(product.price)} <span className="text-[12px] font-medium text-on-surface-variant">₪</span></span>
                    <button type="button" onClick={() => add(product)} className="w-9 h-9 rounded-lg bg-primary-container text-white grid place-items-center">
                      <Icon name="add_shopping_cart" className="text-[18px]" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="xl:col-span-5 bg-white rounded-xl shadow-md p-4 flex flex-col">
          <div className="flex items-center justify-between bg-surface-container-low p-3 rounded-lg mb-3">
            <div className="flex items-center gap-2">
              <Icon name="shopping_cart" className="text-primary-container text-[24px]" />
              <div>
                <p className="text-[15px] font-extrabold">سلة الفاتورة الحالية</p>
                <p className="text-[11px] text-on-surface-variant nums">فاتورة بيع رقم: #INV-2024-8841</p>
              </div>
            </div>
            <button type="button" onClick={() => setCart([])} className="px-2.5 py-1 rounded bg-error-container text-on-error-container text-[11px] font-bold flex items-center gap-1">
              <Icon name="delete_sweep" className="text-[14px]" />
              إفراغ السلة
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 bg-surface-container-low/60 p-2 rounded-lg mb-3">
            <div className="flex items-center gap-2 flex-1">
              <Icon name="person" className="text-outline text-[18px]" />
              <input value={customer} onChange={(event) => setCustomer(event.target.value)} placeholder="العميل: عميل نقدي عام (أو رقم الجوال)" className="w-full bg-transparent text-[13px] outline-none" />
            </div>
            <button type="button" onClick={() => setCustomer("")} className="px-2 py-1 rounded bg-surface-container-high text-[11px] font-bold">تغيير</button>
          </div>

          <ul className="flex flex-col gap-2 max-h-64 overflow-y-auto">
            {!cart.length && <li className="text-[13px] text-outline text-center py-6">السلة فارغة. أضف جهازاً من القائمة أو امسح الباركود.</li>}
            {cart.map((item) => {
              const face = look(item);
              return (
                <li key={item.id} className="bg-surface-container-low p-2.5 rounded-lg flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-10 h-10 rounded-lg bg-white grid place-items-center shrink-0"><Icon name={face.icon} className={`${face.tone} text-[20px]`} /></span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold truncate">{face.cart}</p>
                      <p className="text-[11px] nums text-outline">{item.imei ? <span className="text-secondary font-bold">IMEI: {item.imei}</span> : `SKU: ${item.sku}${face.extra ? ` • ${face.extra}` : ""}`}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center bg-white rounded-lg px-1">
                      <button type="button" onClick={() => setQty(item.id, item.qty - 1)} className="w-6 h-6 text-on-surface-variant">-</button>
                      <span className="w-6 text-center text-[12px] font-bold nums">{item.qty}</span>
                      <button type="button" onClick={() => setQty(item.id, item.qty + 1)} className="w-6 h-6 text-on-surface-variant">+</button>
                    </div>
                    <span className="text-[14px] font-extrabold nums min-w-[70px] text-left">{money(item.price * item.qty)} <span className="text-[11px] font-normal text-on-surface-variant">₪</span></span>
                    <button type="button" onClick={() => setQty(item.id, 0)} className="text-outline hover:text-error"><Icon name="close" className="text-[18px]" /></button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 bg-surface-container-low p-3 rounded-xl flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1 text-[13px] font-bold"><Icon name="sell" className="text-primary text-[16px]" />حقل تعديل السعر / خصم استثنائي:</span>
              <span className="text-[11px] font-bold text-on-surface-variant">الحد الأقصى المسموح: 50 ₪</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-2">
              <div className="relative">
                <input type="number" min="0" value={discount} onChange={(event) => setDiscount(event.target.value)} className="w-full bg-white rounded-lg py-2 pr-3 pl-14 nums font-bold outline-none focus:ring-2 focus:ring-primary-container" />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[11px] text-outline">₪ خصم</span>
              </div>
              <select value={reason} onChange={(event) => setReason(event.target.value)} className="w-full bg-white rounded-lg py-2 px-3 text-[12px] outline-none focus:ring-2 focus:ring-primary-container">
                {REASONS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
              </select>
            </div>
            <div className="bg-primary-fixed/40 p-2.5 rounded-lg flex items-start gap-2">
              <Icon name="warning" className="text-primary text-[18px] shrink-0" />
              <p className="text-[12px] text-on-primary-container leading-relaxed">تنبيه: أي تعديل على السعر الرسمي يتطلب سبب الخصم وسيتم تسجيله باسم البائع في تقرير الإدارة اليومي.</p>
            </div>
          </div>

          <dl className="mt-4 flex flex-col gap-1.5 text-[13px]">
            <div className="flex justify-between text-on-surface-variant"><dt>المجموع قبل الضريبة:</dt><dd className="nums font-bold text-on-surface">{money(net, 2)} ₪</dd></div>
            <div className="flex justify-between text-on-surface-variant"><dt>ضريبة القيمة المضافة ({db.settings.vat}%):</dt><dd className="nums font-bold text-on-surface">{money(tax, 2)} ₪</dd></div>
            <div className="flex justify-between text-on-surface-variant"><dt>إجمالي الخصم المطبق:</dt><dd className="nums font-bold text-tertiary">{money(discountN, 2)} ₪</dd></div>
            <div className="flex justify-between items-baseline bg-surface-container-low px-3 py-2 rounded-xl mt-1">
              <dt className="text-[15px] font-extrabold text-on-surface">المبلغ الإجمالي المستحق:</dt>
              <dd className="text-[32px] font-extrabold text-primary-container nums leading-none">{money(due)} <span className="text-[14px] text-on-surface">₪</span></dd>
            </div>
          </dl>

          <div className="mt-4">
            <p className="text-[11px] font-bold text-on-surface-variant mb-2">طريقة الدفع الفوري:</p>
            <div className="grid grid-cols-4 gap-2">
              {PAYS.map(([label, icon]) => (
                <button key={label} type="button" onClick={() => setPay(label)} className={`py-2.5 px-1 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 ${pay === label ? "bg-secondary text-white shadow-sm ring-2 ring-secondary/30" : "bg-surface-container-low hover:bg-surface-container-high"}`}>
                  <Icon name={icon} className="text-[20px]" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <button type="button" disabled={!cart.length} onClick={finish} className="mt-4 w-full py-4 rounded-xl bg-primary-container hover:bg-on-primary-container text-white text-[16px] font-extrabold shadow-lg flex items-center justify-center gap-2 disabled:opacity-40">
            <Icon name="check_circle" className="text-[24px]" />
            إتمام عملية البيع وطباعة الفاتورة (F9)
            <span className="px-2.5 py-1 rounded-lg bg-white/20 nums text-[13px]">{money(due)} ₪</span>
          </button>
        </aside>
      </section>

      <section className="bg-white rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-lg bg-secondary-fixed text-on-secondary-fixed grid place-items-center"><Icon name="trending_up" /></span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-extrabold">إحصائيات مبيعاتي اليوم</span>
              <span className="text-[11px] text-outline">(البائع: عمار القريناوي)</span>
            </div>
            <p className="text-[12px] text-on-surface-variant">البيانات مخصصة للمناوبة الحالية ومحدثة لحظياً</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {[
            ["receipt", "text-primary", "bg-surface-container-low", "الفواتير المنجزة", "4 فواتير", "text-on-surface"],
            ["account_balance_wallet", "text-secondary", "bg-surface-container-low", "إجمالي القيمة المباعة", "11,850 ₪", "text-on-surface"],
            ["paid", "text-tertiary", "bg-tertiary-container/15", "العمولة المكتسبة اليوم", "195 ₪", "text-tertiary"],
          ].map(([icon, iconTone, box, label, value, valueTone]) => (
            <div key={label} className={`flex items-center gap-2 px-3 py-2 rounded-lg ${box}`}>
              <Icon name={icon} className={`${iconTone} text-[20px]`} />
              <div>
                <span className={`block text-[11px] ${valueTone === "text-tertiary" ? "text-tertiary font-bold" : "text-outline"}`}>{label}</span>
                <span className={`text-[14px] font-extrabold nums ${valueTone}`}>{value}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

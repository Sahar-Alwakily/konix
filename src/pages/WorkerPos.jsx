import { useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { BRANCHES, branchName } from "../data/seed";
import { Icon, Modal } from "../components/ui";

const CATS = [
  ["الكل", () => true],
  ["هواتف", (product) => product.category.includes("هواتف")],
  ["إكسسوارات", (product) => product.category.includes("إكسسوار")],
  ["شواحن", (product) => product.category.includes("شواحن")],
  ["سماعات", (product) => product.category.includes("سماع")],
];

const FACE = {
  p1: { title: "آيفون 15 برو ماكس", photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0fNhyPLyRa1bUY8eni1ArfvkIHcScMS2310LUT2v3wnWadHFz4AwbiHuNttoWkI989iANV1laTBHz_a1-hoKp8eBjpGIuNTmkTQG629LcxQN-Gvw1vyerUzO0YcTjgXI99OvqvZbOV2GeLHYWEtbye3pdKeSIjB_mlgCmzP1W9987u_lHhs2i37WjadhvV_elUeChr-E6lTLmcLrUT-5YQWvJn3rDRXVH16qybcX9" },
  p2: { title: "سامسونج جالاكسي S24 ألترا", photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCuHxpzX64GQRq_ehHl_XbXMBxcNyEF5iCu0Vd94TpcGZfRd97rCMiF6DdvGLRt7jPBEguyeuPKhixNTKHMCha0a5G6yBwtCRBIZMQrNlI3aNcHPRRN1F1j2D1p3UD0VDA3xnBo6hjgHKRg_yXSvVbVf9eoEIPexXC6WMP2uyW0yjjwfzCjC0gxgJs7uGZnrfuUgJBCHV021OwtxXkJQjLrzuvv7dlrH-uzYnWWoljE" },
  p5: { title: "كفر سيليكون MagSafe", photo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDTLqLCavNi0A9bMNPLFuRnFZo9ZCZ0Fw9JmJberEy8dB0a--89kb4QLeVfnY2HlUFh_lLn_5BwxWuhIdjwjdhShfkYM-RHoFR0DMvngN_xdE2-gCSDcXjnOxIV2AZZWG1WNH0AOoJHwyX1OivNIvkOpAExpzbaMrYcsZ-HCIEO3Uolo-oYpql7I2jx5ijCW_kI4V5kONO4FByl_FtuHDG0OnNKI805HyCwcvycJn6l" },
};

function face(product) {
  return FACE[product.id] || { title: product.name, photo: "" };
}

function capacity(product) {
  if (product.storage) return product.storage;
  const match = String(product.name).match(/(\d+)\s?(GB|TB)/i);
  return match ? match[0].replace(/\s/g, "") : "";
}

function money(value) {
  return Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function firstName(name) {
  return String(name || "موظف").trim().split(/\s+/)[0];
}

function isMineToday(invoice, name) {
  if (invoice.seller !== name) return false;
  const day = String(invoice.at || "").slice(0, 10);
  const today = new Date().toISOString().slice(0, 10);
  return day === "2024-10-24" || day === today || invoice.live;
}

export default function WorkerPos() {
  const { db, session, logout, checkout, requestStock, flash, toast } = useStore();
  const [cat, setCat] = useState("الكل");
  const [term, setTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [editId, setEditId] = useState(null);
  const [draft, setDraft] = useState("");
  const [pay, setPay] = useState("كاش نقدي");
  const [infoId, setInfoId] = useState(null);
  const [askQty, setAskQty] = useState(1);
  const [askNote, setAskNote] = useState("");
  const [sentId, setSentId] = useState("");

  const register = !session || session.branch === "all" || session.branch === "warehouse" ? "rahat" : session.branch;
  const rate = 1 + (db.settings.vat || 0) / 100;

  const products = useMemo(() => {
    const match = CATS.find((item) => item[0] === cat)?.[1] || (() => true);
    const q = term.trim().toLowerCase();
    return db.products.filter((product) => {
      if (!match(product)) return false;
      if (!q) return true;
      const blob = `${product.name} ${face(product).title} ${product.sku} ${product.barcode || ""}`.toLowerCase();
      return blob.includes(q);
    });
  }, [db.products, cat, term]);

  const mine = useMemo(
    () => db.invoices.filter((invoice) => isMineToday(invoice, session?.name)),
    [db.invoices, session?.name],
  );
  const mineTotal = mine.reduce((sum, invoice) => sum + Number(invoice.total || 0), 0);

  if (!session) return <Navigate to="/worker" replace />;

  function stockOf(id) {
    return db.products.find((product) => product.id === id)?.stock?.[register] ?? 0;
  }

  function add(product) {
    const left = stockOf(product.id);
    setCart((prev) => {
      const found = prev.find((item) => item.id === product.id);
      const nextQty = (found?.qty || 0) + 1;
      if (nextQty > left) {
        flash(left ? `المتوفر ${left} فقط` : "الصنف غير متوفر في الفرع");
        return prev;
      }
      if (found) return prev.map((item) => (item.id === product.id ? { ...item, qty: nextQty } : item));
      return [...prev, { id: product.id, name: face(product).title, sku: product.sku, imei: product.imei, price: product.price, cost: product.cost, qty: 1 }];
    });
  }

  function setQty(id, qty) {
    setCart((prev) => prev.flatMap((item) => {
      if (item.id !== id) return [item];
      if (qty <= 0) return [];
      if (qty > stockOf(id)) {
        flash(`المتوفر ${stockOf(id)} فقط`);
        return [item];
      }
      return [{ ...item, qty }];
    }));
  }

  function savePrice(id) {
    const next = Number(draft);
    if (!Number.isFinite(next) || next < 0) {
      flash("اكتب سعراً صحيحاً");
      return;
    }
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, salePrice: Math.round(next * 100) / 100 } : item)));
    setEditId(null);
  }

  const total = cart.reduce((sum, item) => sum + (item.salePrice ?? item.price) * item.qty, 0);

  function confirmSale() {
    if (!cart.length) return;
    checkout({
      items: cart.map((item) => {
        const sold = item.salePrice ?? item.price;
        return {
          id: item.id,
          name: item.name,
          sku: item.sku,
          imei: item.imei,
          qty: item.qty,
          cost: item.cost,
          price: Math.round((sold / rate) * 100) / 100,
          list: Math.round((item.price / rate) * 100) / 100,
        };
      }),
      pay,
      discount: 0,
      seller: session.name,
      branchId: register,
    });
    setCart([]);
    setEditId(null);
  }

  const info = db.products.find((product) => product.id === infoId) || null;

  function sendRequest() {
    if (!info) return;
    const id = requestStock({
      productId: info.id,
      name: face(info).title,
      sku: info.sku,
      storage: capacity(info),
      qty: Math.max(1, Number(askQty) || 1),
      note: askNote.trim(),
      branch: register,
      branchName: branchName(register),
      by: session.name,
    });
    setSentId(id);
  }

  return (
    <div className="h-screen bg-white text-on-surface flex flex-col">
      <header className="h-[72px] shrink-0 border-b border-line px-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-primary-container text-white grid place-items-center font-extrabold text-xl shrink-0">K</div>
          <div className="min-w-0">
            <p className="text-[20px] font-extrabold truncate">مرحباً، {firstName(session.name)}</p>
            <p className="text-[13px] text-on-surface-variant truncate">{branchName(register)}</p>
          </div>
        </div>
        <button type="button" onClick={logout} className="h-12 px-4 rounded-xl bg-surface-container-low font-bold">تسجيل خروج</button>
      </header>

      <div className="w-desk flex-1 min-h-0 p-4">
        <aside className="bg-surface min-h-0 rounded-3xl p-4 flex flex-col gap-3 overflow-hidden">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-extrabold">سلة البيع</h2>
            <span className="nums text-[13px] font-bold text-outline">{cart.reduce((sum, item) => sum + item.qty, 0)} قطع</span>
          </div>
          <div className="flex-1 min-h-0 overflow-auto flex flex-col gap-2">
            {!cart.length && <p className="text-[14px] text-outline py-8 text-center">اضغط صنفاً لإضافته إلى السلة</p>}
            {cart.map((item) => {
              const sold = item.salePrice ?? item.price;
              const changed = item.salePrice != null && item.salePrice !== item.price;
              return (
                <article key={item.id} className="bg-white rounded-2xl p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-extrabold leading-6">{item.name}</p>
                    <p className="nums font-extrabold whitespace-nowrap">{money(sold * item.qty)} ₪</p>
                  </div>
                  <p className="text-[12px] text-outline nums mt-1">
                    سعر البيع {money(sold)} ₪
                    {changed && <span className="text-primary font-bold"> · كان {money(item.price)} ₪</span>}
                  </p>
                  <div className="flex items-center justify-between gap-2 mt-3">
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setQty(item.id, item.qty - 1)} className="w-11 h-11 rounded-xl bg-surface-container-low text-[22px] font-bold">−</button>
                      <span className="nums text-[18px] font-extrabold w-6 text-center">{item.qty}</span>
                      <button type="button" onClick={() => setQty(item.id, item.qty + 1)} className="w-11 h-11 rounded-xl bg-surface-container-low text-[22px] font-bold">+</button>
                    </div>
                    <button type="button" onClick={() => { setEditId(item.id); setDraft(String(sold)); }} className="h-11 px-3 rounded-xl bg-primary-fixed text-on-primary-fixed-variant font-bold text-[13px]">تعديل السعر</button>
                  </div>
                  {editId === item.id && (
                    <div className="mt-3 flex items-center gap-2">
                      <input value={draft} onChange={(event) => setDraft(event.target.value)} inputMode="decimal" className="flex-1 h-12 px-3 rounded-xl bg-surface-container-low nums text-[18px] font-bold outline-none focus:ring-2 focus:ring-primary-container" />
                      <button type="button" onClick={() => savePrice(item.id)} className="h-12 px-4 rounded-xl bg-primary-container text-white font-bold">حفظ</button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
          <div className="bg-white rounded-2xl p-3 flex items-center justify-between">
            <div>
              <p className="text-[12px] font-bold text-outline">مبيعاتي اليوم</p>
              <p className="text-[13px] font-bold">{mine.length} فواتير</p>
            </div>
            <p className="nums text-[20px] font-extrabold">{money(mineTotal)} ₪</p>
          </div>
          <div className="flex gap-2">
            {["كاش نقدي", "بطاقة"].map((option) => (
              <button key={option} type="button" onClick={() => setPay(option)} className={`flex-1 h-11 rounded-xl font-bold ${pay === option ? "bg-on-surface text-white" : "bg-white"}`}>{option}</button>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="font-bold">الإجمالي</span>
            <span className="nums text-[28px] font-extrabold">{money(total)} ₪</span>
          </div>
          <button type="button" disabled={!cart.length} onClick={confirmSale} className="h-16 rounded-2xl bg-primary-container text-white text-[20px] font-extrabold disabled:opacity-40">تأكيد البيع</button>
        </aside>

        <main className="min-h-0 min-w-0 flex flex-col gap-3 overflow-hidden">
          <label className="relative shrink-0">
            <Icon name="search" className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-container" />
            <input value={term} onChange={(event) => setTerm(event.target.value)} placeholder="ابحث عن جهاز أو إكسسوار" className="w-full h-14 pr-12 pl-4 rounded-2xl bg-surface-container-low text-[16px] outline-none focus:ring-2 focus:ring-primary-container" />
          </label>
          <div className="flex gap-2 overflow-x-auto shrink-0 pb-1">
            {CATS.map(([label]) => (
              <button key={label} type="button" onClick={() => setCat(label)} className={`h-12 px-4 rounded-2xl whitespace-nowrap font-bold ${cat === label ? "bg-primary-container text-white" : "bg-surface-container-low"}`}>{label}</button>
            ))}
          </div>
          <div className="flex-1 min-h-0 overflow-auto grid grid-cols-2 xl:grid-cols-3 gap-3 content-start">
            {products.map((product) => {
              const card = face(product);
              const here = product.stock?.[register] ?? 0;
              const size = capacity(product);
              return (
                <button key={product.id} type="button" onClick={() => { setInfoId(product.id); setAskQty(1); setAskNote(""); setSentId(""); }} className="bg-surface text-right rounded-3xl p-3 min-h-[240px] flex flex-col active:scale-[0.99]">
                  <span className="h-28 rounded-2xl bg-white overflow-hidden grid place-items-center">
                    {card.photo ? <img src={card.photo} alt="" className="w-full h-full object-cover" /> : <Icon name="devices" className="text-primary-container text-[36px]" />}
                  </span>
                  <span className="font-extrabold mt-3 leading-6">{card.title}</span>
                  <span className="text-[12px] text-on-surface-variant mt-1">{[size, product.variant].filter(Boolean).join(" · ")}</span>
                  <span className={`text-[12px] font-bold mt-1 ${here ? "text-tertiary" : "text-error"}`}>{here ? `في فرعك: ${here}` : "غير متوفر في فرعك"}</span>
                  <span className="nums text-[22px] font-extrabold mt-auto pt-2">{money(product.price)} <span className="text-[13px] font-bold">₪</span></span>
                  <span className="text-[11px] text-outline">سعر البيع</span>
                </button>
              );
            })}
          </div>
        </main>
      </div>
      {info && (
        <Modal title={face(info).title} onClose={() => setInfoId(null)}>
          <div className="flex gap-3 mb-4">
            <span className="w-24 h-24 rounded-2xl bg-surface-container-low overflow-hidden grid place-items-center shrink-0">
              {face(info).photo ? <img src={face(info).photo} alt="" className="w-full h-full object-cover" /> : <Icon name="devices" className="text-primary-container" />}
            </span>
            <div>
              <p className="text-[12px] text-outline">سعر البيع</p>
              <p className="nums text-[28px] font-extrabold leading-none">{money(info.price)} ₪</p>
              <p className="text-[13px] text-on-surface-variant mt-2">{info.brand} · {info.category}</p>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-2 text-[13px] mb-4">
            {[
              ["السعة", capacity(info) || "—"],
              ["النسخة", info.variant || "—"],
              ["الماركة", info.brand || "—"],
              ["التصنيف", info.category || "—"],
              ["الباركود", info.barcode || "—"],
              ["SKU", info.sku || "—"],
            ].map(([label, value]) => (
              <div key={label} className="bg-surface-container-low rounded-xl px-3 py-2">
                <dt className="text-[11px] text-outline">{label}</dt>
                <dd className="font-bold nums">{value}</dd>
              </div>
            ))}
          </dl>
          {info.imei && <p className="text-[12px] text-on-surface-variant nums mb-3">IMEI مرجعي: {info.imei}</p>}
          {info.note && <p className="text-[13px] mb-3">{info.note}</p>}
          <p className="font-extrabold mb-2">وين موجود</p>
          <div className="flex flex-col gap-2 mb-4">
            {BRANCHES.map((place) => {
              const qty = info.stock?.[place.id] ?? 0;
              const mineBranch = place.id === register;
              return (
                <div key={place.id} className={`flex items-center justify-between rounded-xl px-3 py-2 ${mineBranch ? "bg-primary-fixed" : "bg-surface-container-low"}`}>
                  <span className="font-bold">{place.name}{mineBranch ? " · فرعك" : ""}</span>
                  <span className={`nums font-extrabold ${qty ? "text-tertiary" : "text-error"}`}>{qty ? `${qty} قطعة` : "غير متوفر"}</span>
                </div>
              );
            })}
          </div>
          {(info.stock?.[register] ?? 0) > 0 ? (
            <button type="button" onClick={() => { add(info); setInfoId(null); }} className="w-full h-14 rounded-2xl bg-primary-container text-white font-extrabold">أضف للسلة</button>
          ) : (
            <div className="rounded-2xl bg-error-container/40 p-3">
              <p className="font-extrabold text-error">غير متوفر في فرعك</p>
              <p className="text-[13px] mt-1">أرسل طلباً للأدمن. الطلب ينسجل ويظهر في لوحته.</p>
              {sentId ? (
                <p className="mt-3 font-extrabold">تم تسجيل الطلب <span className="nums">{sentId}</span></p>
              ) : (
                <>
                  <div className="flex items-center justify-between mt-3">
                    <span className="font-bold">الكمية المطلوبة</span>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setAskQty((value) => Math.max(1, value - 1))} className="w-10 h-10 rounded-xl bg-white font-bold">−</button>
                      <span className="nums font-extrabold w-6 text-center">{askQty}</span>
                      <button type="button" onClick={() => setAskQty((value) => Math.min(20, value + 1))} className="w-10 h-10 rounded-xl bg-white font-bold">+</button>
                    </div>
                  </div>
                  <input value={askNote} onChange={(event) => setAskNote(event.target.value)} placeholder="ملاحظة للزبون أو للتسليم" className="mt-3 w-full h-12 px-3 rounded-xl bg-white outline-none focus:ring-2 focus:ring-primary-container" />
                  <button type="button" onClick={sendRequest} className="mt-3 w-full h-14 rounded-2xl bg-primary-container text-white font-extrabold">إرسال طلب للأدمن</button>
                </>
              )}
            </div>
          )}
        </Modal>
      )}
      {toast && <div className="fixed bottom-6 left-6 z-[90] bg-ink text-white px-4 py-3 rounded-xl text-[13px] font-semibold shadow-lg">{toast}</div>}
    </div>
  );
}

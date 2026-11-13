import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext";
import { Icon } from "../components/ui";

const TYPES = [
  { id: "phones", icon: "smartphone", name: "هواتف وإكسسوارات", hint: "IMEI، ضمان، ونقطة بيع" },
  { id: "electronics", icon: "devices", name: "إلكترونيات", hint: "أجهزة، شاشات، وصيانة" },
  { id: "fashion", icon: "checkroom", name: "ملابس وأزياء", hint: "مقاسات، ألوان، ومواسم" },
  { id: "grocery", icon: "shopping_basket", name: "تموين وسوبرماركت", hint: "باركود، صلاحية، وجرد" },
  { id: "care", icon: "health_and_beauty", name: "عناية وصيدلية", hint: "دفعات، وتنبيهات النواقص" },
  { id: "jewelry", icon: "diamond", name: "مجوهرات وساعات", hint: "قطع ثمينة وصندوق يومي" },
  { id: "cafe", icon: "local_cafe", name: "مقهى ومطعم", hint: "ورديات، وكاش سريع" },
  { id: "general", icon: "storefront", name: "متجر عام", hint: "بيع، مخزون، وموظفون" },
];

const STEPS = ["النوع", "البيانات", "الصورة", "الفريق", "الاشتراك"];

const INCLUDED = [
  ["dashboard", "لوحة القيادة والمبيعات"],
  ["warehouse", "المخزون وحركات الجرد"],
  ["point_of_sale", "نقطة بيع للموظف"],
  ["account_balance_wallet", "الصندوق والحضور اليومي"],
  ["badge", "الموظفون والصلاحيات"],
  ["insights", "تقارير الأرباح"],
];

function readPhoto(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => {
      const max = 640;
      const scale = Math.min(1, max / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("photo"));
    };
    image.src = url;
  });
}

export default function Landing() {
  const { session, openShop } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    type: "phones",
    owner: "",
    shop: "",
    phone: "",
    email: "",
    city: "",
    photo: "",
    hasStaff: true,
    staffCount: 2,
  });

  const kind = TYPES.find((item) => item.id === form.type) || TYPES[0];

  function set(partial) {
    setForm((prev) => ({ ...prev, ...partial }));
    setError("");
  }

  function next() {
    if (step === 2) {
      if (!form.owner.trim() || !form.shop.trim()) {
        setError("اسمك واسم المتجر مطلوبان");
        return;
      }
      if (!/^05\d{8}$/.test(form.phone.replace(/\s|-/g, ""))) {
        setError("اكتب جوالاً يبدأ بـ 05 ومن عشر خانات");
        return;
      }
    }
    setError("");
    setStep((value) => Math.min(5, value + 1));
  }

  async function onPhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("اختَر ملف صورة");
      return;
    }
    try {
      set({ photo: await readPhoto(file) });
    } catch {
      setError("تعذّر قراءة الصورة");
    }
  }

  function start() {
    openShop({
      shopType: kind.id,
      shopTypeName: kind.name,
      owner: form.owner.trim(),
      shopName: form.shop.trim(),
      phone: form.phone.replace(/\s|-/g, ""),
      email: form.email.trim(),
      city: form.city,
      photo: form.photo,
      hasStaff: form.hasStaff,
      staffCount: form.hasStaff ? Number(form.staffCount) || 1 : 0,
    });
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur border-b border-line">
        <div className="k-wrap h-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-white grid place-items-center font-extrabold">K</div>
            <div>
              <div className="font-extrabold leading-tight">كونيكس</div>
              <div className="text-[10px] font-bold text-outline tracking-wide">Kunix Retail OS</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-5 text-[13px] font-bold text-on-surface-variant">
            <a href="#work">ماذا يدير</a>
            <a href="#price">الاشتراك</a>
          </nav>
          <div className="flex items-center gap-2">
            {session ? (
              <Link to="/" className="h-10 px-4 rounded-lg font-bold text-[13px] grid place-items-center">اللوحة</Link>
            ) : (
              <Link to="/worker" className="h-10 px-4 rounded-lg font-bold text-[13px] grid place-items-center">دخول الموظفين</Link>
            )}
            <button type="button" onClick={() => setStep(1)} className="h-10 px-4 rounded-lg bg-primary-container text-white font-bold text-[13px]">افتح متجرك</button>
          </div>
        </div>
      </header>

      {step === 0 ? (
        <main>
          <section className="k-wrap k-hero py-12">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-[12px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container" /> نظام تشغيل متاجر الاتصالات
              </span>
              <h1 className="text-[40px] font-extrabold leading-[1.25] mt-4">المخزون، الصندوق، والبيع. في لوحة واحدة.</h1>
              <p className="text-[16px] text-on-surface-variant leading-8 mt-4">
                كونيكس لصاحب المحل: كل جهاز برقم IMEI، كل موظف بصلاحية، وكل شيكل في الدرج له سند. لفروعك كلها، وين ما كانت.
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-6">
                <button type="button" onClick={() => setStep(1)} className="h-12 px-6 rounded-xl bg-primary-container text-white font-extrabold shadow-sm">افتح متجرك · 500 ₪</button>
                <Link to="/worker" className="h-12 px-5 rounded-xl bg-white border border-line font-bold grid place-items-center">دخول الموظفين</Link>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2 mt-6 text-[13px] font-bold text-on-surface">
                {["تتبع IMEI", "نقطة بيع", "صندوق يومي", "صلاحيات الفريق"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5"><Icon name="check_circle" className="text-tertiary text-[18px]" />{item}</span>
                ))}
              </div>
            </div>

            <article className="bg-white rounded-2xl p-4 shadow-[0_16px_40px_-24px_rgba(20,27,43,0.45)] border border-line min-w-0">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <p className="text-[11px] font-bold text-outline">لوحة اليوم</p>
                  <p className="font-extrabold">الفرع الرئيسي</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold shrink-0">النظام متصل</span>
              </div>
              <div className="k-kpis">
                <div className="rounded-xl bg-surface-container-low p-3 min-w-0">
                  <p className="text-[12px] text-outline">مبيعات اليوم</p>
                  <p className="text-[26px] font-extrabold nums leading-none mt-2 whitespace-nowrap">8,650 <span className="text-[13px] text-outline">₪</span></p>
                </div>
                <div className="rounded-xl bg-secondary-fixed p-3 min-w-0">
                  <p className="text-[12px] text-on-secondary-fixed">صافي الربح</p>
                  <p className="text-[26px] font-extrabold nums text-secondary leading-none mt-2 whitespace-nowrap">2,140 <span className="text-[13px]">₪</span></p>
                </div>
              </div>
              <div className="mt-3 flex items-end gap-2 h-24">
                {[46, 58, 40, 62, 78, 70].map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-md bg-primary-container/80" style={{ height: h }} />
                ))}
              </div>
              <div className="mt-3 rounded-xl border border-surface-container-high px-3 py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold truncate">Samsung Galaxy S24 Ultra</p>
                  <p className="text-[12px] text-error font-bold">باقي قطعة واحدة في أحد الفروع</p>
                </div>
                <span className="text-[12px] font-bold text-primary shrink-0">تنبيه مخزون</span>
              </div>
            </article>
          </section>

          <section id="work" className="k-wrap pb-12">
            <h2 className="text-[22px] font-extrabold">ماذا يدير عنك</h2>
            <p className="text-[14px] text-on-surface-variant mt-1 mb-4">نفس الشاشات التي يفتحها الموظف كل يوم، من لوحة صاحب المحل.</p>
            <div className="k-feats">
              {[
                ["dashboard", "لوحة القيادة", "مبيعات اليوم، ربح الفروع، وتنبيه النواقص."],
                ["inventory_2", "الأجهزة والأسعار", "سعر البيع، التكلفة، والهامش لكل صنف."],
                ["warehouse", "المخزون والـ IMEI", "وارد، صادر، وتحويل بين الفروع."],
                ["point_of_sale", "نقطة البيع", "فاتورة، خصم بحد، وطباعة من صندوق الموظف."],
                ["account_balance_wallet", "الصندوق والحضور", "عهدة الدرج، سندات الصرف، ودوام الطاقم."],
                ["insights", "تقارير الأرباح", "هامش الشهر، وأعلى الأجهزة ربحاً."],
              ].map(([icon, title, text]) => (
                <article key={title} className="bg-white rounded-2xl p-4 border border-line min-w-0">
                  <span className="w-10 h-10 rounded-xl bg-wash text-primary-container grid place-items-center"><Icon name={icon} /></span>
                  <h3 className="font-extrabold mt-3">{title}</h3>
                  <p className="text-[13px] text-on-surface-variant leading-6 mt-1">{text}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="price" className="k-wrap pb-16">
            <article className="bg-white rounded-2xl border border-line p-6 k-price">
              <div>
                <p className="text-[12px] font-bold text-outline">اشتراك صاحب المحل</p>
                <p className="text-[48px] font-extrabold nums leading-none mt-2 text-primary-container">500 <span className="text-[18px] text-on-surface">₪</span></p>
                <p className="text-[14px] text-on-surface-variant mt-2">كل شهر. كل الفروع. كل الموظفين.</p>
              </div>
              <div>
                <ul className="grid sm:grid-cols-2 gap-2 mb-5">
                  {INCLUDED.map(([icon, label]) => (
                    <li key={label} className="flex items-center gap-2 text-[14px] font-bold"><Icon name={icon} className="text-tertiary text-[18px]" />{label}</li>
                  ))}
                </ul>
                <button type="button" onClick={() => setStep(1)} className="h-12 px-6 rounded-xl bg-primary-container text-white font-extrabold">ابدأ الاشتراك</button>
                <p className="text-[12px] text-outline mt-3">التجهيز خمس خطوات: نوع المتجر، بياناتك، الصورة، الفريق، ثم التأكيد. الدفع تجريبي على هذا الجهاز.</p>
              </div>
            </article>
          </section>
        </main>
      ) : (
        <main className="w-full mx-auto px-5 py-8" style={{ maxWidth: 720 }}>
          <div className="flex items-center gap-2 mb-5">
            {STEPS.map((label, index) => {
              const n = index + 1;
              const on = step === n;
              const done = step > n;
              return (
                <div key={label} className="flex-1">
                  <div className={`h-1.5 rounded-full ${done || on ? "bg-primary-container" : "bg-surface-container-high"}`} />
                  <p className={`text-[11px] mt-1 font-bold ${on ? "text-primary" : "text-outline"}`}>{label}</p>
                </div>
              );
            })}
          </div>

          <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm">
            {step === 1 && (
              <>
                <p className="text-[12px] font-bold text-secondary">الخطوة 1 من 5</p>
                <h2 className="text-[22px] font-extrabold mt-1">نوع المتجر</h2>
                <p className="text-[14px] text-on-surface-variant mt-1 mb-5">اختر النشاط الأقرب لمحلك.</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {TYPES.map((item) => {
                    const on = form.type === item.id;
                    return (
                      <button key={item.id} type="button" onClick={() => set({ type: item.id })} className={`text-right p-4 rounded-2xl border flex items-center gap-3 ${on ? "border-primary-container bg-primary-fixed/40" : "border-surface-container-high hover:bg-surface-container-low"}`}>
                        <span className={`w-11 h-11 rounded-xl grid place-items-center ${on ? "bg-primary-container text-white" : "bg-surface-container-low text-on-surface"}`}><Icon name={item.icon} /></span>
                        <span>
                          <span className="block font-extrabold">{item.name}</span>
                          <span className="block text-[12px] text-outline">{item.hint}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <p className="text-[12px] font-bold text-secondary">الخطوة 2 من 5</p>
                <h2 className="text-[22px] font-extrabold mt-1">بيانات صاحب المحل</h2>
                <p className="text-[14px] text-on-surface-variant mt-1 mb-5">الاسم الذي يظهر في اللوحة، واسم المحل، ووسيلة التواصل.</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <label className="block text-[13px] font-bold">اسمك<input value={form.owner} onChange={(event) => set({ owner: event.target.value })} placeholder="مثال: أنور أبو القيعان" className="mt-1 w-full h-12 px-3 rounded-xl bg-surface-container-low outline-none focus:ring-2 focus:ring-primary-container font-medium" /></label>
                  <label className="block text-[13px] font-bold">اسم المتجر<input value={form.shop} onChange={(event) => set({ shop: event.target.value })} placeholder="مثال: النقب موبايل" className="mt-1 w-full h-12 px-3 rounded-xl bg-surface-container-low outline-none focus:ring-2 focus:ring-primary-container font-medium" /></label>
                  <label className="block text-[13px] font-bold">الجوال<input value={form.phone} onChange={(event) => set({ phone: event.target.value })} placeholder="05xxxxxxxx" inputMode="numeric" className="mt-1 w-full h-12 px-3 rounded-xl bg-surface-container-low outline-none focus:ring-2 focus:ring-primary-container nums font-medium" /></label>
                  <label className="block text-[13px] font-bold">البريد <span className="text-outline font-medium">(اختياري)</span><input value={form.email} onChange={(event) => set({ email: event.target.value })} placeholder="shop@example.com" className="mt-1 w-full h-12 px-3 rounded-xl bg-surface-container-low outline-none focus:ring-2 focus:ring-primary-container font-medium" /></label>
                </div>
                <label className="block text-[13px] font-bold mt-4">مدينة الفرع<input value={form.city} onChange={(event) => set({ city: event.target.value })} placeholder="اكتب المدينة، مش شرط مكان معيّن" className="mt-1 w-full h-12 px-3 rounded-xl bg-surface-container-low outline-none focus:ring-2 focus:ring-primary-container font-medium" /></label>
              </>
            )}

            {step === 3 && (
              <>
                <p className="text-[12px] font-bold text-secondary">الخطوة 3 من 5</p>
                <h2 className="text-[22px] font-extrabold mt-1">صورة المحل</h2>
                <p className="text-[14px] text-on-surface-variant mt-1 mb-5">شعار أو واجهة المحل. يمكن تخطي هذه الخطوة.</p>
                <label className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-outline-variant bg-surface-container-low min-h-64 cursor-pointer overflow-hidden">
                  {form.photo ? (
                    <img src={form.photo} alt="" className="w-full max-h-72 object-cover" />
                  ) : (
                    <>
                      <span className="w-16 h-16 rounded-2xl bg-white text-primary-container grid place-items-center shadow-sm"><Icon name="add_a_photo" className="text-[28px]" /></span>
                      <span className="font-bold">ارفع صورة</span>
                      <span className="text-[12px] text-outline">JPG أو PNG، وبنصغّرها تلقائياً</span>
                    </>
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={onPhoto} />
                </label>
                {form.photo && (
                  <button type="button" onClick={() => set({ photo: "" })} className="mt-3 text-[13px] font-bold text-error">حذف الصورة</button>
                )}
              </>
            )}

            {step === 4 && (
              <>
                <p className="text-[12px] font-bold text-secondary">الخطوة 4 من 5</p>
                <h2 className="text-[22px] font-extrabold mt-1">فريق العمل</h2>
                <p className="text-[14px] text-on-surface-variant mt-1 mb-5">حساب صاحب المحل وحده، أو فريق مع صلاحيات.</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <button type="button" onClick={() => set({ hasStaff: false, staffCount: 0 })} className={`p-5 rounded-2xl text-right border ${!form.hasStaff ? "border-primary-container bg-primary-fixed/40" : "border-surface-container-high"}`}>
                    <Icon name="person" className="text-primary-container" />
                    <p className="font-extrabold mt-2">أعمل وحدي</p>
                    <p className="text-[12px] text-outline mt-1">حساب واحد، صندوق واحد، وصلاحية كاملة.</p>
                  </button>
                  <button type="button" onClick={() => set({ hasStaff: true, staffCount: form.staffCount || 2 })} className={`p-5 rounded-2xl text-right border ${form.hasStaff ? "border-secondary bg-secondary-fixed/60" : "border-surface-container-high"}`}>
                    <Icon name="groups" className="text-secondary" />
                    <p className="font-extrabold mt-2">عندي فريق</p>
                    <p className="text-[12px] text-outline mt-1">كاشير، بائع، وأمين مستودع، كل واحد بصلاحياته.</p>
                  </button>
                </div>
                {form.hasStaff && (
                  <div className="mt-4 flex items-center justify-between bg-surface-container-low rounded-2xl px-4 py-3">
                    <span className="font-bold">عدد الموظفين معك</span>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => set({ staffCount: Math.max(1, form.staffCount - 1) })} className="w-9 h-9 rounded-xl bg-white font-bold">−</button>
                      <span className="nums text-[22px] font-extrabold w-8 text-center">{form.staffCount}</span>
                      <button type="button" onClick={() => set({ staffCount: Math.min(40, form.staffCount + 1) })} className="w-9 h-9 rounded-xl bg-white font-bold">+</button>
                    </div>
                  </div>
                )}
              </>
            )}

            {step === 5 && (
              <>
                <p className="text-[12px] font-bold text-secondary">الخطوة 5 من 5</p>
                <h2 className="text-[22px] font-extrabold mt-1">الاشتراك الشهري</h2>
                <p className="text-[14px] text-on-surface-variant mt-1 mb-5">خطة واحدة. الدفع تجريبي على هذا الجهاز حتى ربط الدفع.</p>
                <div className="rounded-2xl bg-surface-container-low p-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[12px] text-outline">كونيكس · {kind.name}</p>
                    <p className="text-[36px] font-extrabold nums leading-none mt-1 text-primary-container">500 <span className="text-[16px] text-on-surface">₪</span></p>
                    <p className="text-[13px] text-outline mt-1">كل شهر</p>
                  </div>
                  {form.photo ? <img src={form.photo} alt="" className="w-16 h-16 rounded-2xl object-cover" /> : <span className="w-16 h-16 rounded-2xl bg-primary-container text-white grid place-items-center"><Icon name={kind.icon} /></span>}
                </div>
                <dl className="mt-4 grid sm:grid-cols-2 gap-2 text-[13px]">
                  {[
                    ["المتجر", form.shop],
                    ["صاحب المحل", form.owner],
                    ["الجوال", form.phone],
                    ["المدينة", form.city || "—"],
                    ["الفريق", form.hasStaff ? `${form.staffCount} موظفين` : "صاحب المحل فقط"],
                    ["البريد", form.email || "—"],
                  ].map(([label, value]) => (
                    <div key={label} className="bg-surface-container-low rounded-xl px-3 py-2">
                      <dt className="text-[11px] text-outline">{label}</dt>
                      <dd className="font-bold">{value}</dd>
                    </div>
                  ))}
                </dl>
                <ul className="mt-4 grid sm:grid-cols-2 gap-2">
                  {INCLUDED.map(([icon, label]) => (
                    <li key={label} className="flex items-center gap-2 text-[13px] font-bold"><Icon name={icon} className="text-tertiary text-[18px]" />{label}</li>
                  ))}
                </ul>
              </>
            )}

            {error && <p className="mt-4 text-[13px] font-bold text-error">{error}</p>}

            <div className="flex items-center justify-between gap-3 mt-6">
              <button type="button" onClick={() => { setError(""); setStep((value) => value - 1); }} className="h-12 px-4 rounded-xl bg-surface-container-low font-bold">رجوع</button>
              {step < 5 ? (
                <button type="button" onClick={next} className="h-12 px-6 rounded-xl bg-primary-container text-white font-extrabold">{step === 3 && !form.photo ? "تخطي الصورة" : "التالي"}</button>
              ) : (
                <button type="button" onClick={start} className="h-12 px-6 rounded-xl bg-primary-container text-white font-extrabold">تأكيد الاشتراك ودخول اللوحة</button>
              )}
            </div>
          </section>
        </main>
      )}
    </div>
  );
}

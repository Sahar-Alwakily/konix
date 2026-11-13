const BRANCHES = [
  { id: "shqeb", name: "شقيب", hours: "كل يوم ١٠ ص – ٩ م" },
  { id: "hawara", name: "حورة", hours: "كل يوم ١٠ ص – ٩ م" },
];

const CATEGORIES = [
  { id: "phones", name: "هواتف" },
  { id: "accessories", name: "إكسسوارات" },
  { id: "tablets", name: "آيباد" },
  { id: "devices", name: "أجهزة" },
];

const PRODUCTS = [
  { id: "ph1", name: "هاتف كيون X1", cat: "phones", price: 1890, old: 2140, rating: 4.6, count: 18, stock: { shqeb: 6, hawara: 2 },
    desc: "شاشة ساطعة وبطارية تكفي يوم استخدام عادي. مناسب للاتصال والتصوير اليومي.",
    specs: [["الشاشة", "6.5 إنش"], ["التخزين", "128 ج.ب"], ["البطارية", "5000 مللي أمبير"]],
    reviews: [{ name: "ليلى عودة", date: "2 آذار 2026", text: "البطارية مريحة، والاستلام من فرع حورة كان سريع." }] },
  { id: "ph2", name: "هاتف كيون نوت", cat: "phones", price: 2490, old: 0, rating: 4.8, count: 11, stock: { shqeb: 3, hawara: 4 },
    desc: "شاشة أكبر وذاكرة أوسع لمن يصور كثير ويحتفظ بالملفات على الجهاز.",
    specs: [["الشاشة", "6.7 إنش"], ["التخزين", "256 ج.ب"], ["الذاكرة", "8 ج.ب"]],
    reviews: [{ name: "سامي نجار", date: "18 شباط 2026", text: "واضح وسريع. بقي منه كم قطعة لما مرّيت على شقيب." }] },
  { id: "ph3", name: "هاتف كيون لايت", cat: "phones", price: 990, old: 1150, rating: 4.3, count: 9, stock: { shqeb: 8, hawara: 1 },
    desc: "جهاز خفيف بسعر أوضح، يكفي للواتساب والخرائط والتصوير العادي.",
    specs: [["الشاشة", "6.1 إنش"], ["التخزين", "64 ج.ب"], ["البطارية", "4500 مللي أمبير"]],
    reviews: [] },
  { id: "ph4", name: "هاتف كيون ميني", cat: "phones", price: 760, old: 0, rating: 4.1, count: 6, stock: { shqeb: 0, hawara: 5 },
    desc: "حجم صغير يمسك بإيد واحدة. الشاشة كافية للقراءة والمكالمات.",
    specs: [["الشاشة", "5.4 إنش"], ["التخزين", "64 ج.ب"], ["الوزن", "158 غ"]],
    reviews: [{ name: "هدى قاسم", date: "9 كانون الثاني 2026", text: "حجمه مريح بإيدي. ما لقيت منه بفرع شقيب وقتها." }] },
  { id: "ac1", name: "سماعات كيون بودز", cat: "accessories", price: 220, old: 260, rating: 4.5, count: 22, stock: { shqeb: 12, hawara: 3 },
    desc: "سماعات لاسلكية مع علبة شحن. الصوت واضح للمكالمات والمشي.",
    specs: [["الاتصال", "بلوتوث"], ["العلبة", "تشحن الجهاز مرات عدة"], ["المقاومة", "رذاذ خفيف"]],
    reviews: [{ name: "عمر بركات", date: "1 نيسان 2026", text: "ثابتة بالأذن وما انقطعت بالمشي." }] },
  { id: "ac2", name: "شاحن سريع 30 واط", cat: "accessories", price: 79, old: 0, rating: 4.4, count: 14, stock: { shqeb: 15, hawara: 9 },
    desc: "رأس شحن مع كابل. يشتغل مع أغلب هواتف المتجر والأجهزة اللوحية.",
    specs: [["القدرة", "30 واط"], ["الكابل", "متر واحد"], ["المنفذ", "USB-C"]],
    reviews: [] },
  { id: "ac3", name: "كفر حماية شفاف", cat: "accessories", price: 35, old: 0, rating: 4.2, count: 30, stock: { shqeb: 20, hawara: 7 },
    desc: "كفر مرن يحمي الأطراف بدون ما يغيّر لون الجهاز.",
    specs: [["الخامة", "سيليكون مرن"], ["الأطراف", "مرتفعة عن الشاشة"], ["اللون", "شفاف"]],
    reviews: [] },
  { id: "ac4", name: "حامل سيارة مغناطيسي", cat: "accessories", price: 55, old: 70, rating: 4.0, count: 8, stock: { shqeb: 4, hawara: 0 },
    desc: "يتثبت على فتحة التكييف ويمسك الهاتف بالمغناطيس أثناء الطريق.",
    specs: [["التثبيت", "فتحة التكييف"], ["القبض", "مغناطيس"], ["الدوران", "أفقي ورأسي"]],
    reviews: [{ name: "رامي حداد", date: "12 آذار 2026", text: "ما يهتز على طريق حورة. التركيب دقائق." }] },
  { id: "tb1", name: "جهاز لوحي 11 إنش", cat: "tablets", price: 2790, old: 3050, rating: 4.7, count: 7, stock: { shqeb: 2, hawara: 3 },
    desc: "شاشة واسعة للدراسة والفيديو. القلم يُباع لحاله عند الطلب.",
    specs: [["الشاشة", "11 إنش"], ["التخزين", "128 ج.ب"], ["القلم", "اختياري"]],
    reviews: [{ name: "ميساء عودة", date: "20 شباط 2026", text: "أخذته للدراسة. الشاشة مريحة والفرع شرح الفرق بين المقاسين." }] },
  { id: "tb2", name: "جهاز لوحي 8 إنش", cat: "tablets", price: 1590, old: 0, rating: 4.4, count: 5, stock: { shqeb: 1, hawara: 2 },
    desc: "أخف للحقيبة. يناسب القراءة والصفوف والاتصال المنزلي.",
    specs: [["الشاشة", "8.3 إنش"], ["التخزين", "64 ج.ب"], ["الوزن", "خفي"]],
    reviews: [] },
  { id: "tb3", name: "قلم شاشة للوحي", cat: "tablets", price: 190, old: 0, rating: 4.6, count: 10, stock: { shqeb: 6, hawara: 4 },
    desc: "قلم يشتغل مع الأجهزة اللوحية المعروضة في الفرعين. رأس ناعم للكتابة.",
    specs: [["التوافق", "أجهزة Kunix اللوحية"], ["الشحن", "سلكي"], ["الرأس", "قابل للتبديل"]],
    reviews: [{ name: "نادر سالم", date: "5 نيسان 2026", text: "الكتابة قريبة من الورق. بقي مخزون منيح بالفرعين." }] },
  { id: "dv1", name: "سماعة مكتب كيون", cat: "devices", price: 340, old: 390, rating: 4.5, count: 9, stock: { shqeb: 3, hawara: 5 },
    desc: "سماعة بغرفة صغيرة أو مكتب. الصوت يكفي غرفة جلوس عادية.",
    specs: [["الاتصال", "بلوتوث وسلك"], ["البطارية", "12 ساعة"], ["الميكروفون", "مدمج"]],
    reviews: [] },
  { id: "dv2", name: "ماوس لاسلكي", cat: "devices", price: 65, old: 0, rating: 4.2, count: 16, stock: { shqeb: 11, hawara: 8 },
    desc: "ماوس هادئ للكمبيوتر المحمول. بطارية واحدة تكفيه شهوراً.",
    specs: [["الاتصال", "دونغل USB"], ["الأزرار", "3"], ["اللون", "رمادي"]],
    reviews: [] },
  { id: "dv3", name: "لوحة مفاتيح مضيئة", cat: "devices", price: 180, old: 210, rating: 4.3, count: 4, stock: { shqeb: 2, hawara: 1 },
    desc: "لوحة كاملة مع إضاءة خفيفة. تناسب الدراسة بالليل.",
    specs: [["الإضاءة", "ثلاث درجات"], ["اللغة", "عربي وإنجليزي"], ["الكابل", "USB"]],
    reviews: [{ name: "سارة يوسف", date: "28 آذار 2026", text: "الحروف العربية واضحة. الإضاءة ما بتتعب." }] },
  { id: "dv4", name: "ساعة كيون فيت", cat: "devices", price: 420, old: 0, rating: 4.4, count: 13, stock: { shqeb: 4, hawara: 6 },
    desc: "ساعة للخطوات والنبض والتنبيه. تتربط مع هواتف المتجر.",
    specs: [["الشاشة", "1.4 إنش"], ["المقاومة", "ماء خفيف"], ["البطارية", "أيام عدة"]],
    reviews: [{ name: "فادي منصور", date: "8 نيسان 2026", text: "النبض قريب من قياس الصيدلية. الشحن كل كم يوم." }] },
];

const PAYMENTS = [
  { id: "cash", name: "الدفع عند الاستلام من الفرع" },
  { id: "visa", name: "فيزا" },
  { id: "mastercard", name: "ماستركارد" },
];

const ICONS = {
  menu: "M4 7h16M4 12h16M4 17h16",
  back: "M14 6l-6 6 6 6",
  bell: "M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 19a2 2 0 0 0 4 0",
  search: "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14M20 20l-3.5-3.5",
  heart: "M12 19s-7-4.4-7-8.5A3.5 3.5 0 0 1 12 8a3.5 3.5 0 0 1 7 2.5C19 14.6 12 19 12 19z",
  bag: "M6 8h12l-1 12H7L6 8zM9 8V7a3 3 0 0 1 6 0v1",
  home: "M4 11l8-7 8 7v9H4z",
  grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 20a7 7 0 0 1 14 0",
  close: "M7 7l10 10M17 7L7 17",
  check: "M5 12l5 5L19 7",
  pin: "M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11z",
  phone: "M8 3h8a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
  buds: "M7 10a3 3 0 0 1 3-3v8a3 3 0 0 1-3 3 2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2zM17 10a3 3 0 0 0-3-3v8a3 3 0 0 0 3 3 2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2z",
  tablet: "M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  device: "M4 14l4-8h8l4 8H4zM8 18h8",
};

const KEY = "kunix-shop";
const saved = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } })();
const state = {
  view: saved.view || "home",
  branch: saved.branch || "hawara",
  cat: saved.cat || "",
  productId: saved.productId || "",
  query: "",
  cart: saved.cart || [],
  wish: saved.wish || [],
  orders: saved.orders || [],
  sold: saved.sold || {},
  profile: saved.profile || { name: "", phone: "" },
  menu: false,
  qty: 1,
  pay: "cash",
  openOrder: "",
  errors: {},
  canInstall: false,
};
let installEvent = null;

function persist() {
  localStorage.setItem(KEY, JSON.stringify({
    view: state.view, branch: state.branch, cat: state.cat, productId: state.productId,
    cart: state.cart, wish: state.wish, orders: state.orders, sold: state.sold, profile: state.profile,
  }));
}

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}
function money(n) { return `${n} ₪`; }
function icon(name) {
  return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${ICONS[name] || ICONS.grid}"/></svg>`;
}
function device(o) {
  const x = o.x;
  const y = o.y;
  const w = o.w;
  const h = o.h;
  const r = o.r || 18;
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${o.body}"/>
    <rect x="${x + 3}" y="${y + 6}" width="${w - 6}" height="${h - 14}" rx="${Math.max(8, r - 6)}" fill="${o.bezel}"/>
    <rect x="${x + 8}" y="${y + 14}" width="${w - 16}" height="${h - 36}" rx="8" fill="${o.screen}"/>
    <rect x="${x + 14}" y="${y + 22}" width="${Math.round((w - 28) * 0.7)}" height="5" rx="2.5" fill="#fff" opacity=".85"/>
    <rect x="${x + 14}" y="${y + 32}" width="${w - 28}" height="18" rx="5" fill="${o.ui}"/>
    <rect x="${x + 14}" y="${y + 56}" width="16" height="16" rx="4" fill="#fff" opacity=".3"/>
    <rect x="${x + 34}" y="${y + 56}" width="16" height="16" rx="4" fill="#fff" opacity=".16"/>
    <circle cx="${x + w / 2}" cy="${y + h - 11}" r="2.4" fill="${o.dot || o.bezel}"/>`;
}
function shot(id, bare) {
  const scenes = {
    ph1: device({ x: 68, y: 26, w: 64, h: 146, body: "#2b2623", bezel: "#14110f", screen: "#ff8a4c", ui: "#fff7f2" }),
    ph2: device({ x: 62, y: 20, w: 76, h: 158, body: "#11100f", bezel: "#1c1a19", screen: "#2a211c", ui: "#ff5a1f", dot: "#3a332e" }),
    ph3: device({ x: 68, y: 30, w: 64, h: 140, body: "#e7e1da", bezel: "#fbfaf8", screen: "#1c1917", ui: "#ffb088", dot: "#d5cec6" }),
    ph4: device({ x: 76, y: 46, w: 48, h: 104, r: 14, body: "#f7f4f1", bezel: "#fff", screen: "#ffd8c2", ui: "#fff", dot: "#e6dfd8" }),
    ac1: `<ellipse cx="70" cy="86" rx="18" ry="28" fill="#f7f3ef"/><ellipse cx="130" cy="86" rx="18" ry="28" fill="#f7f3ef"/><ellipse cx="70" cy="82" rx="7" ry="10" fill="#2a2420"/><ellipse cx="130" cy="82" rx="7" ry="10" fill="#2a2420"/><rect x="62" y="108" width="76" height="52" rx="20" fill="#221e1b"/><circle cx="100" cy="134" r="4" fill="#ff5a1f"/>`,
    ac2: `<rect x="72" y="52" width="56" height="78" rx="14" fill="#fbfaf8" stroke="#e4ddd4" stroke-width="2"/><rect x="88" y="40" width="24" height="16" rx="4" fill="#d5cec6"/><rect x="90" y="74" width="20" height="8" rx="3" fill="#ff5a1f"/><path d="M100 130 v16 q0 18 22 16" fill="none" stroke="#ff5a1f" stroke-width="5" stroke-linecap="round"/>`,
    ac3: `<rect x="64" y="30" width="72" height="140" rx="20" fill="#fff" stroke="#ff5a1f" stroke-width="4"/><rect x="78" y="48" width="44" height="100" rx="8" fill="#f3eee9"/><rect x="86" y="62" width="28" height="36" rx="5" fill="#ffd0b8"/>`,
    ac4: `<rect x="80" y="30" width="10" height="34" rx="3" fill="#2a2420"/><rect x="110" y="30" width="10" height="34" rx="3" fill="#2a2420"/><rect x="88" y="38" width="24" height="22" rx="4" fill="#3a342f"/><rect x="96" y="58" width="8" height="34" rx="3" fill="#6b625b"/><circle cx="100" cy="122" r="34" fill="#ff5a1f"/><circle cx="100" cy="122" r="16" fill="#fff"/><circle cx="100" cy="122" r="6" fill="#ff5a1f"/>`,
    tb1: `<rect x="24" y="54" width="152" height="96" rx="14" fill="#2a2623"/><rect x="32" y="62" width="136" height="80" rx="8" fill="#ff8a4c"/><rect x="44" y="74" width="48" height="8" rx="3" fill="#fff" opacity=".85"/><rect x="44" y="88" width="78" height="28" rx="6" fill="#fff" opacity=".22"/>`,
    tb2: `<rect x="50" y="34" width="100" height="132" rx="16" fill="#efe8e1"/><rect x="58" y="46" width="84" height="104" rx="8" fill="#1c1917"/><rect x="68" y="60" width="40" height="7" rx="3" fill="#ffb088"/><rect x="68" y="74" width="64" height="28" rx="6" fill="#ff5a1f" opacity=".85"/>`,
    tb3: `<g transform="rotate(-36 100 100)"><rect x="90" y="34" width="18" height="112" rx="9" fill="#f7f4f1"/><rect x="90" y="34" width="18" height="30" rx="9" fill="#ff5a1f"/><polygon points="90,138 108,138 99,164" fill="#e7e0d8"/></g>`,
    dv1: `<rect x="58" y="40" width="84" height="120" rx="42" fill="#241f1c"/><circle cx="100" cy="92" r="30" fill="none" stroke="#ff5a1f" stroke-width="7"/><circle cx="100" cy="92" r="10" fill="#3a332e"/><rect x="78" y="132" width="44" height="6" rx="3" fill="#4a433d"/>`,
    dv2: `<ellipse cx="100" cy="108" rx="38" ry="50" fill="#f7f4f1" stroke="#e4ddd6" stroke-width="2"/><path d="M100 62 v40" stroke="#e4ddd6" stroke-width="2"/><rect x="94" y="74" width="12" height="18" rx="6" fill="#ff5a1f"/>`,
    dv4: `<rect x="86" y="24" width="28" height="26" rx="6" fill="#3a332e"/><rect x="86" y="150" width="28" height="26" rx="6" fill="#3a332e"/><circle cx="100" cy="100" r="42" fill="#1c1917"/><circle cx="100" cy="100" r="32" fill="#ff5a1f"/><circle cx="100" cy="100" r="4" fill="#fff"/><rect x="98" y="78" width="4" height="22" rx="2" fill="#fff"/><rect x="100" y="98" width="16" height="4" rx="2" fill="#fff"/>`,
  };
  let inner = scenes[id] || scenes.ph1;
  if (id === "dv3") {
    inner = `<rect x="36" y="58" width="128" height="84" rx="12" fill="#2a2623"/>`;
    for (let r = 0; r < 4; r += 1) {
      for (let c = 0; c < 8; c += 1) {
        const hot = r === 0 && c === 0;
        inner += `<rect x="${48 + c * 13}" y="${70 + r * 14}" width="10" height="9" rx="2" fill="${hot ? "#ff5a1f" : "#4a433d"}"/>`;
      }
    }
  }
  return `<svg class="shot-svg" viewBox="0 0 200 200" aria-hidden="true">${bare ? "" : `<rect width="200" height="200" fill="#f4f1ee"/><ellipse cx="100" cy="178" rx="46" ry="7" fill="#1a120c" opacity=".08"/>`}${inner}</svg>`;
}
function offTag(item) {
  if (!item.old || item.old <= item.price) return "";
  return `<span class="off" dir="ltr">-${Math.round((1 - item.price / item.old) * 100)}%</span>`;
}
function meter(item) {
  const base = item.stock[state.branch] || 0;
  const n = left(item);
  const pct = base ? Math.max(8, Math.round((n / base) * 100)) : 0;
  return `<div class="meter ${stockClass(n)}" aria-hidden="true"><span style="width:${n ? pct : 100}%"></span></div>`;
}
function branch() { return BRANCHES.find((item) => item.id === state.branch); }
function product(id) { return PRODUCTS.find((item) => item.id === id); }
function catName(id) { return CATEGORIES.find((item) => item.id === id)?.name || ""; }
function left(item, branchId = state.branch) {
  return Math.max(0, (item.stock[branchId] || 0) - (state.sold[item.id]?.[branchId] || 0));
}
function stockText(n) {
  if (n <= 0) return "نفد من هذا الفرع";
  if (n === 1) return "باقي قطعة واحدة";
  if (n === 2) return "باقي قطعتان";
  if (n <= 10) return `باقي ${n} قطع`;
  return `باقي ${n} قطعة`;
}
function stockClass(n) { return n <= 0 ? "out" : n <= 3 ? "low" : ""; }
function cartCount() { return state.cart.reduce((sum, line) => sum + line.qty, 0); }
function cartTotal() {
  return state.cart.reduce((sum, line) => {
    const item = product(line.id);
    return sum + (item ? item.price * line.qty : 0);
  }, 0);
}
function stars(n) {
  const full = Math.round(n);
  return `${"★".repeat(full)}${"☆".repeat(5 - full)}`;
}

function go(view, extra = {}) {
  Object.assign(state, extra, { view, menu: false, errors: {} });
  if (view === "product") state.qty = 1;
  persist();
  history.pushState({ view: state.view, productId: state.productId }, "", `#${view}`);
  render();
}

function render() {
  const focus = document.activeElement;
  const focusId = focus && focus.id;
  const caret = focus && focus.selectionStart;
  document.getElementById("app").innerHTML = shell(view());
  if (focusId) {
    const next = document.getElementById(focusId);
    if (next) {
      next.focus();
      if (caret != null && next.setSelectionRange) next.setSelectionRange(caret, caret);
    }
  }
}

function shell(content) {
  const orange = state.view === "home" && !state.menu;
  return `<div class="app">
    ${state.menu ? menu() : ""}
    ${content}
  </div>`;
}

function menu() {
  const links = [
    ["home", "الرئيسية", "home"],
    ["cats", "الأقسام", "grid"],
    ["wish", "المفضلة", "heart"],
    ["cart", "السلة", "bag"],
    ["orders", "طلباتي", "bell"],
    ["account", "الحساب", "user"],
  ];
  return `<button class="scrim" data-act="menu" aria-label="إغلاق"></button>
    <aside class="drawer">
      <button class="close" data-act="menu" aria-label="إغلاق">${icon("close")}</button>
      <h2>Kunix</h2>
      ${links.map(([view, label, glyph]) => `<button class="menu-link ${state.view === view ? "on" : ""}" data-go="${view}">${icon(glyph)} ${label}</button>`).join("")}
      <p class="foot">فرع شقيب · فرع حورة<br>هواتف، إكسسوارات، آيباد، وأجهزة</p>
    </aside>`;
}

function topbar(title, orange) {
  const count = cartCount();
  return `<header class="top ${orange ? "orange" : ""}">
    ${state.view === "home" ? `<h1 class="brand">Kunix</h1>` : `<button class="icon-btn" data-act="back" aria-label="رجوع">${icon("back")}</button><h1 class="brand" style="font-size:20px">${esc(title)}</h1>`}
    <button class="icon-btn" data-go="orders" aria-label="الطلبات">${icon("bell")}</button>
    <button class="icon-btn" data-go="cart" aria-label="السلة">${icon("bag")}${count ? `<span class="badge">${count}</span>` : ""}</button>
    <button class="icon-btn" data-act="menu" aria-label="القائمة">${icon("menu")}</button>
  </header>`;
}

function tabs(current) {
  const items = [["home", "الرئيسية", "home"], ["cats", "الأقسام", "grid"], ["cart", "السلة", "bag"], ["account", "حسابي", "user"]];
  return `<nav class="tabbar">${items.map(([view, label, glyph]) => `<button class="tab ${current === view ? "on" : ""}" data-go="${view}">${icon(glyph)}<span>${label}</span>${view === "cart" && cartCount() ? `<span class="badge">${cartCount()}</span>` : ""}</button>`).join("")}</nav>`;
}

function view() {
  if (state.view === "product") return productView();
  if (state.view === "cart") return cartView();
  if (state.view === "checkout") return checkoutView();
  if (state.view === "wish") return listView("المفضلة", state.wish.map(product).filter(Boolean));
  if (state.view === "orders") return ordersView();
  if (state.view === "account") return accountView();
  if (state.view === "done") return doneView();
  if (state.view === "cats") return catsView();
  return homeView();
}

function homeView() {
  const q = state.query.trim();
  const list = PRODUCTS.filter((item) => (!state.cat || item.cat === state.cat) && (!q || item.name.includes(q)));
  const ready = PRODUCTS.filter((item) => left(item) > 0).length;
  const count = cartCount();
  return `<header class="top orange home-top">
      <div class="top-row">
        <h1 class="brand">Kunix</h1>
        <button class="icon-btn" data-go="orders" aria-label="الطلبات">${icon("bell")}</button>
        <button class="icon-btn" data-go="cart" aria-label="السلة">${icon("bag")}${count ? `<span class="badge">${count}</span>` : ""}</button>
        <button class="icon-btn" data-act="menu" aria-label="القائمة">${icon("menu")}</button>
      </div>
      <label class="search">${icon("search")}<input id="q" placeholder="ابحثي عن هاتف أو سماعة" value="${esc(state.query)}"></label>
      <div class="seg">
        ${BRANCHES.map((item) => `<button class="seg-btn ${item.id === state.branch ? "on" : ""}" data-act="branch" data-id="${item.id}">فرع ${item.name}</button>`).join("")}
      </div>
    </header>
    <main class="main pad">
      <section class="hero">
        <div class="hero-copy">
          <div class="kicker">فرع ${esc(branch().name)}</div>
          <h2>المخزون على الرف، محدّث اليوم</h2>
          <p>${ready} منتج متوفر للاستلام</p>
        </div>
        <div class="hero-shot">${shot("ph1", true)}</div>
      </section>
      ${state.canInstall ? `<button class="install" id="install" data-act="install">تثبيت Kunix على الجهاز</button>` : ""}
      <div class="section-head"><h3>الأقسام</h3><button class="linkish" data-go="cats">عرض الأقسام</button></div>
      <div class="cats">
        <button class="cat ${state.cat === "" ? "on" : ""}" data-act="cat" data-id=""><span class="cat-ico">${icon("grid")}</span><span>الكل</span></button>
        ${CATEGORIES.map((item) => {
          const cover = item.id === "phones" ? "ph1" : item.id === "accessories" ? "ac1" : item.id === "tablets" ? "tb1" : "dv4";
          return `<button class="cat ${state.cat === item.id ? "on" : ""}" data-act="cat" data-id="${item.id}"><span class="cat-ico">${shot(cover, true)}</span><span>${item.name}</span></button>`;
        }).join("")}
      </div>
      <div class="section-head"><h3>${q ? "نتائج البحث" : "المعروض الآن"}</h3><span class="muted">${list.length} منتج</span></div>
      ${list.length ? `<div class="grid">${list.map(card).join("")}</div>` : `<p class="empty">ما في نتائج بهالفرع بهالكلمة.</p>`}
    </main>${tabs("home")}`;
}

function card(item) {
  const n = left(item);
  return `<button class="card" data-go="product" data-id="${item.id}">
    <div class="art">${offTag(item)}${shot(item.id)}</div>
    <div class="card-body">
      <h4>${esc(item.name)}</h4>
      <div class="rate">★ ${item.rating}</div>
      <div class="price-line"><span class="price">${money(item.price)}</span>${item.old ? `<span class="old">${money(item.old)}</span>` : ""}</div>
      ${meter(item)}
      <span class="stock ${stockClass(n)}">${stockText(n)}</span>
    </div>
  </button>`;
}

function catsView() {
  return `${topbar("الأقسام")}
    <main class="main pad">
      <div class="grid">
        ${CATEGORIES.map((item) => {
          const count = PRODUCTS.filter((product) => product.cat === item.id).length;
          const ready = PRODUCTS.filter((product) => product.cat === item.id && left(product) > 0).length;
          const cover = item.id === "phones" ? "ph1" : item.id === "accessories" ? "ac1" : item.id === "tablets" ? "tb1" : "dv4";
          return `<button class="card" data-act="cat" data-id="${item.id}" data-go="home">
            <div class="art">${shot(cover)}</div>
            <div class="card-body"><h4>${item.name}</h4><p class="muted">${count} منتجات · ${ready} متوفر بفرع ${esc(branch().name)}</p></div>
          </button>`;
        }).join("")}
      </div>
    </main>${tabs("cats")}`;
}

function productView() {
  const item = product(state.productId);
  if (!item) return homeView();
  const n = left(item);
  const other = BRANCHES.find((place) => place.id !== state.branch);
  const otherLeft = left(item, other.id);
  const wished = state.wish.includes(item.id);
  return `<main class="main product">
      <div class="product-art">
        <button class="float-back" data-act="back" aria-label="رجوع">${icon("back")}</button>
        <button class="float-heart ${wished ? "on" : ""}" data-act="wish" data-id="${item.id}" aria-label="مفضلة">${icon("heart")}</button>
        ${shot(item.id)}
      </div>
      <div class="product-body">
      <div class="stars" aria-label="التقييم ${item.rating}">${stars(item.rating)} <span class="muted">(${item.count})</span></div>
      <h2 class="title">${esc(item.name)}</h2>
      <div class="price-row">
        <span class="price lg">${money(item.price)}</span>
        ${item.old ? `<span class="old">${money(item.old)}</span>` : ""}
        <span class="tag">${esc(catName(item.cat))}</span>
      </div>
      <div class="stock-box">
        <div class="row"><strong class="${n ? "" : "muted"}">${stockText(n)}</strong><span class="muted">فرع ${esc(branch().name)}</span></div>
        ${meter(item)}
        <span class="other">${otherLeft ? `فرع ${esc(other.name)}: ${stockText(otherLeft)}` : `نفد أيضاً من فرع ${esc(other.name)}`}</span>
      </div>
      <details open><summary>الوصف</summary><p>${esc(item.desc)}</p></details>
      <details><summary>المواصفات</summary>${item.specs.map(([k, v]) => `<div class="spec"><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join("")}</details>
      <details><summary>التقييمات (${item.reviews.length})</summary>
        ${item.reviews.length ? item.reviews.map((review) => `<div class="review"><div class="avatar">${esc(review.name.slice(0, 1))}</div><div><b>${esc(review.name)}</b><div class="muted">${esc(review.date)}</div><p>${esc(review.text)}</p></div></div>`).join("") : `<p class="muted">لسا ما في تقييمات لهذا المنتج.</p>`}
      </details>
      </div>
    </main>
    <div class="buybar">
      <div class="qty">
        <button data-act="localqty" data-dir="-1" aria-label="إنقاص">−</button>
        <b>${state.qty}</b>
        <button data-act="localqty" data-dir="1" aria-label="زيادة">+</button>
      </div>
      <button class="primary" data-act="add" data-id="${item.id}" ${n < 1 ? "disabled" : ""}>${n < 1 ? "نفد من الفرع" : "أضيفي للسلة"}</button>
    </div>`;
}

function cartView() {
  const lines = state.cart.map((line) => ({ ...line, item: product(line.id) })).filter((line) => line.item);
  return `${topbar("السلة")}
    <main class="main pad">
      ${lines.length ? lines.map((line) => {
        const n = left(line.item);
        return `<div class="line">
          <div class="art">${shot(line.item.id)}</div>
          <div class="grow">
            <b>${esc(line.item.name)}</b>
            <div class="price">${money(line.item.price)}</div>
            <span class="stock ${stockClass(n)}">${stockText(n)}</span>
            ${line.qty > n ? `<div class="warn">الكمية بالسلة أعلى من المتبقي</div>` : ""}
            <div class="row">
              <div class="qty">
                <button data-act="cartqty" data-id="${line.id}" data-dir="-1" aria-label="إنقاص">−</button>
                <b>${line.qty}</b>
                <button data-act="cartqty" data-id="${line.id}" data-dir="1" aria-label="زيادة">+</button>
              </div>
              <button class="linkish" data-act="remove" data-id="${line.id}">حذف</button>
            </div>
          </div>
        </div>`;
      }).join("") + `<div class="row"><span>المجموع</span><span class="total">${money(cartTotal())}</span></div>
        <p class="note">الاستلام من فرع ${esc(branch().name)}، ${esc(branch().hours)}.</p>` : `<p class="empty">السلة فاضية. اختاري منتج وشوفي كم باقي منه.</p>`}
    </main>
    ${lines.length ? `<div class="buybar"><button class="primary" data-go="checkout">إتمام الشراء</button></div>` : tabs("cart")}`;
}

function checkoutView() {
  const over = state.cart.some((line) => {
    const item = product(line.id);
    return item && line.qty > left(item);
  });
  return `${topbar("الدفع")}
    <main class="main">
      <label class="field"><span>الاسم</span><input id="name" class="${state.errors.name ? "bad" : ""}" value="${esc(state.profile.name)}"></label>
      ${state.errors.name ? `<div class="err">${state.errors.name}</div>` : ""}
      <label class="field"><span>الجوال</span><input id="phone" inputmode="tel" class="${state.errors.phone ? "bad" : ""}" value="${esc(state.profile.phone)}"></label>
      ${state.errors.phone ? `<div class="err">${state.errors.phone}</div>` : ""}
      <div class="field"><span>الاستلام</span>
        <div class="branches">${BRANCHES.map((item) => `<button type="button" class="chip ${item.id === state.branch ? "on" : ""}" data-act="branch" data-id="${item.id}">${item.name}</button>`).join("")}</div>
      </div>
      <div class="field"><span>طريقة الدفع</span>
        ${PAYMENTS.map((item) => `<button type="button" class="pay ${state.pay === item.id ? "on" : ""}" data-act="pay" data-id="${item.id}">${item.name}</button>`).join("")}
      </div>
      <p class="note">الطلب ينحفظ على هذا الجهاز للفرع. ما في سحب من البطاقة داخل الصفحة، والدفع يتم عند الاستلام بالطريقة اللي اخترتيها.</p>
      ${over ? `<p class="warn">في منتج كميته أعلى من مخزون فرع ${esc(branch().name)}. عدّلي السلة قبل التأكيد.</p>` : ""}
      <div class="row"><span>المجموع</span><span class="total">${money(cartTotal())}</span></div>
    </main>
    <div class="buybar"><button class="primary" data-act="place" ${over || !state.cart.length ? "disabled" : ""}>تأكيد الطلب</button></div>`;
}

function listView(title, items) {
  return `${topbar(title)}<main class="main pad">${items.length ? `<div class="grid">${items.map(card).join("")}</div>` : `<p class="empty">لسا ما في منتجات هون.</p>`}</main>${tabs(state.view === "wish" ? "wish" : "home")}`;
}

function ordersView() {
  return `${topbar("طلباتي")}<main class="main pad">${state.orders.length ? state.orders.map((order) => `<button class="ticket" data-go="done" data-id="${esc(order.id)}">
      <div class="row"><b>${esc(order.id)}</b><span class="price">${money(order.total)}</span></div>
      <div class="muted">فرع ${esc(BRANCHES.find((item) => item.id === order.branch)?.name || "")} · ${esc(order.payName)}</div>
    </button>`).join("") : `<p class="empty">ما في طلبات بعد.</p>`}</main>${tabs("orders")}`;
}

function accountView() {
  return `${topbar("الحساب")}
    <main class="main pad">
      <label class="field"><span>الاسم</span><input id="name" value="${esc(state.profile.name)}"></label>
      <label class="field"><span>الجوال</span><input id="phone" inputmode="tel" value="${esc(state.profile.phone)}"></label>
      <button class="primary" data-act="save" style="width:100%;margin-bottom:16px">حفظ البيانات</button>
      ${BRANCHES.map((item) => `<div class="stock-box"><strong>فرع ${item.name}</strong><span class="muted">${item.hours}</span><div class="pinline">${icon("pin")} استلام من الفرع</div></div>`).join("")}
      <button class="ghost" data-act="wipe" style="width:100%">مسح السلة والطلبات من الجهاز</button>
    </main>${tabs("account")}`;
}

function doneView() {
  const order = state.orders.find((item) => item.id === state.openOrder) || state.orders[0];
  if (!order) return ordersView();
  return `${topbar("تم الطلب")}
    <main class="main">
      <div class="success">
        <div class="mark">${icon("check")}</div>
        <h2>وصلنا طلبك</h2>
        <div class="order-no">${esc(order.id)}</div>
        <p class="muted">الاستلام من فرع ${esc(BRANCHES.find((item) => item.id === order.branch)?.name || "")}</p>
      </div>
      ${order.items.map((item) => `<div class="spec"><span>${esc(item.name)} × ${item.qty}</span><b>${money(item.price * item.qty)}</b></div>`).join("")}
      <div class="spec"><span>${esc(order.payName)}</span><b>${money(order.total)}</b></div>
      <p class="note">اعرضي رقم الطلب بالفرع. الدفع حسب الطريقة المختارة وما ينخصم تلقائياً من البطاقة.</p>
    </main>
    <div class="buybar"><button class="ghost" data-go="orders">طلباتي</button><button class="primary" data-go="home">متابعة التسوق</button></div>`;
}

document.getElementById("app").addEventListener("click", (event) => {
  const target = event.target.closest("[data-go],[data-act]");
  if (!target) return;
  if (target.dataset.go) {
    const extra = {};
    if (target.dataset.go === "product" || target.dataset.go === "done") extra[target.dataset.go === "product" ? "productId" : "openOrder"] = target.dataset.id;
    if (target.dataset.act === "cat") state.cat = target.dataset.id || "";
    go(target.dataset.go === "home" && target.dataset.act === "cat" ? "home" : target.dataset.go, extra);
    return;
  }
  const act = target.dataset.act;
  if (act === "menu") { state.menu = !state.menu; render(); return; }
  if (act === "back") { history.back(); return; }
  if (act === "branch") { state.branch = target.dataset.id; persist(); render(); return; }
  if (act === "cat") { state.cat = target.dataset.id || ""; persist(); render(); return; }
  if (act === "wish") {
    state.wish = state.wish.includes(target.dataset.id) ? state.wish.filter((id) => id !== target.dataset.id) : [target.dataset.id, ...state.wish];
    persist(); render(); return;
  }
  if (act === "localqty") {
    const item = product(state.productId);
    const next = state.qty + Number(target.dataset.dir);
    state.qty = Math.max(1, Math.min(next, Math.max(left(item), 1)));
    render(); return;
  }
  if (act === "add") {
    const item = product(target.dataset.id);
    if (!item || left(item) < 1) return;
    const qty = Math.min(state.qty, left(item));
    const line = state.cart.find((row) => row.id === item.id);
    if (line) line.qty = Math.min(left(item), line.qty + qty);
    else state.cart.push({ id: item.id, qty });
    persist();
    go("cart");
    return;
  }
  if (act === "cartqty") {
    const line = state.cart.find((row) => row.id === target.dataset.id);
    const item = product(target.dataset.id);
    if (!line || !item) return;
    line.qty += Number(target.dataset.dir);
    if (line.qty < 1) state.cart = state.cart.filter((row) => row.id !== line.id);
    else line.qty = Math.min(line.qty, left(item));
    persist(); render(); return;
  }
  if (act === "remove") { state.cart = state.cart.filter((row) => row.id !== target.dataset.id); persist(); render(); return; }
  if (act === "pay") { state.pay = target.dataset.id; render(); return; }
  if (act === "save") { readProfile(); persist(); return; }
  if (act === "wipe") {
    state.cart = []; state.orders = []; state.wish = []; state.sold = {};
    persist(); render(); return;
  }
  if (act === "install" && installEvent) {
    installEvent.prompt();
    installEvent.userChoice.finally(() => { installEvent = null; state.canInstall = false; render(); });
    return;
  }
  if (act === "place") placeOrder();
});

document.getElementById("app").addEventListener("input", (event) => {
  if (event.target.id === "q") {
    state.query = event.target.value;
    render();
  }
  if (event.target.id === "name" || event.target.id === "phone") readProfile();
});

function readProfile() {
  const name = document.getElementById("name");
  const phone = document.getElementById("phone");
  if (name) state.profile.name = name.value;
  if (phone) state.profile.phone = phone.value;
}

function placeOrder() {
  readProfile();
  const errors = {};
  if (state.profile.name.trim().length < 2) errors.name = "اكتبي الاسم";
  if (state.profile.phone.replace(/\D/g, "").length < 8) errors.phone = "رقم الجوال غير مكتمل";
  state.errors = errors;
  if (Object.keys(errors).length || !state.cart.length) { render(); return; }
  const items = state.cart.map((line) => {
    const item = product(line.id);
    return item ? { id: item.id, name: item.name, price: item.price, qty: Math.min(line.qty, left(item)) } : null;
  }).filter((item) => item && item.qty > 0);
  if (!items.length) { render(); return; }
  items.forEach((item) => {
    state.sold[item.id] = state.sold[item.id] || { shqeb: 0, hawara: 0 };
    state.sold[item.id][state.branch] += item.qty;
  });
  const order = {
    id: `KU-${String(Date.now()).slice(-6)}`,
    branch: state.branch,
    pay: state.pay,
    payName: PAYMENTS.find((item) => item.id === state.pay)?.name || "",
    name: state.profile.name.trim(),
    phone: state.profile.phone.trim(),
    items,
    total: items.reduce((sum, item) => sum + item.price * item.qty, 0),
  };
  state.orders = [order, ...state.orders];
  state.cart = [];
  state.openOrder = order.id;
  persist();
  go("done", { openOrder: order.id });
}

window.addEventListener("popstate", (event) => {
  if (event.state && event.state.view) {
    state.view = event.state.view;
    if (event.state.productId) state.productId = event.state.productId;
  }
  state.menu = false;
  render();
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installEvent = event;
  state.canInstall = true;
  render();
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

history.replaceState({ view: state.view }, "", `#${state.view}`);
render();

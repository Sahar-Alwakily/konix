export const BRANCHES = [
  { id: "rahat", name: "فرع رهط الرئيسي", place: "الشارع الرئيسي - المركز التجاري" },
  { id: "segev", name: "فرع شقيب السلام", place: "حي المروج - المجمع التجاري" },
  { id: "hura", name: "فرع حورة", place: "شارع السلام - المعرض التجاري" },
  { id: "warehouse", name: "المستودع المركزي", place: "المنطقة الصناعية - رهط" },
];

export const branchName = (id) => BRANCHES.find((b) => b.id === id)?.name || "كل الفروع";

export function money(n) {
  const v = Math.round(Number(n) || 0);
  return `${new Intl.NumberFormat("en-US").format(v)} ₪`;
}

export function stockTotal(product) {
  return Object.values(product.stock || {}).reduce((s, n) => s + n, 0);
}

export function stockStatus(product) {
  const total = stockTotal(product);
  if (total <= 0) return "out";
  if (total <= (product.min || 0)) return "low";
  return "ok";
}

const STATUS = { ok: "متوفر بالمخزون", low: "مخزون منخفض", out: "نفذت الكمية" };
export const statusLabel = (key) => STATUS[key] || key;

export function createSeed() {
  return {
    settings: {
      name: "كونيكس",
      legal: "Kunix Retail OS",
      currency: "₪",
      vat: 17,
      version: "2.4.0",
      cashCeiling: 15000,
    },
    products: [
      {
        id: "p1",
        sku: "IPH15PM-256-BLU",
        barcode: "0195949038241",
        name: "iPhone 15 Pro Max 256GB",
        variant: "أزرق تيتانيوم (Natural Titanium)",
        brand: "Apple",
        category: "هواتف ذكية",
        badge: "5G",
        cost: 4150,
        price: 4890,
        min: 5,
        note: "متوفر في كل الفروع",
        imei: "864920061244910",
        stock: { rahat: 22, segev: 15, hura: 8, warehouse: 0 },
      },
      {
        id: "p2",
        sku: "SM-S928B-512-GRY",
        barcode: "8806095381920",
        name: "Samsung Galaxy S24 Ultra 512GB",
        variant: "رمادي تيتانيوم + S-Pen",
        brand: "Samsung",
        category: "هواتف ذكية",
        badge: "AI",
        cost: 3750,
        price: 4350,
        min: 4,
        note: "طلب توريد قريب",
        imei: "359142098812004",
        stock: { rahat: 5, segev: 2, hura: 1, warehouse: 0 },
      },
      {
        id: "p3",
        sku: "APP2-USBC-WHT",
        barcode: "0195949052520",
        name: "سماعات Apple AirPods Pro 2 (USB-C)",
        variant: "علبة شحن MagSafe مع مكبر صوت",
        brand: "Apple",
        category: "سماعات وصوتيات",
        badge: "ANC",
        cost: 620,
        price: 820,
        min: 10,
        note: "وفرة ممتازة",
        stock: { rahat: 14, segev: 8, hura: 6, warehouse: 0 },
      },
      {
        id: "p4",
        sku: "ANK-GAN-65W-BLK",
        barcode: "6941787123901",
        name: "شاحن جداري Anker 65W GaN",
        variant: "3 منافذ (2x Type-C + USB-A) تدعم PPS",
        brand: "Anker",
        category: "شواحن وكوابل",
        badge: "GaN",
        cost: 45,
        price: 75,
        min: 15,
        note: "أعلى دوران مبيعات",
        stock: { rahat: 30, segev: 20, hura: 14, warehouse: 0 },
      },
      {
        id: "p5",
        sku: "CAS-MGS-15P-NVY",
        barcode: "0195949112933",
        name: "كفر حماية سيليكون أصلي مع MagSafe",
        variant: "كحلي داكن — iPhone 15 Pro Max",
        brand: "Apple",
        category: "إكسسوارات وحماية",
        badge: "MagSafe",
        cost: 60,
        price: 160,
        min: 8,
        note: "متوفر في كل الفروع",
        stock: { rahat: 22, segev: 15, hura: 8, warehouse: 0 },
      },
      {
        id: "p6",
        sku: "SCR-BLK-15P",
        barcode: "0745883791028",
        name: "حماية شاشة زجاجية خصوصية Belkin UltraGlass",
        variant: "iPhone 15 Pro Max",
        brand: "Belkin",
        category: "إكسسوارات وحماية",
        badge: "privacy",
        cost: 40,
        price: 95,
        min: 6,
        note: "متبقي قطعتين في المعرض",
        stock: { rahat: 2, segev: 4, hura: 1, warehouse: 6 },
      },
      {
        id: "p7",
        sku: "IPH15PM-1TB-BLK",
        barcode: "0195949039999",
        name: "iPhone 15 Pro Max 1TB",
        variant: "أسود تيتانيوم",
        brand: "Apple",
        category: "هواتف ذكية",
        badge: "5G",
        cost: 5400,
        price: 6490,
        min: 2,
        note: "غير متوفر في بعض الفروع. الكمية في المستودع.",
        imei: "864920061200171",
        stock: { rahat: 2, segev: 0, hura: 0, warehouse: 4 },
      },
    ],
    invoices: [
      {
        id: "INV-10492",
        at: "2024-10-24T18:42:15",
        seller: "خالد أبو القيعان",
        branch: "hura",
        phone: "050***8814",
        kind: "B2C",
        items: [
          { name: "iPhone 15 Pro Titanium 256GB", detail: "IMEI: 359142109845211", price: 4520.87, list: 4720.87, cost: 3700 },
          { name: "كفر آبل ماج سيف سيليكون أصلي (أزرق)", detail: "× 1", price: 164.35, list: 164.35, cost: 145.22 },
        ],
        goods: 4685.22,
        total: 5388,
        tax: 702.78,
        profit: 840,
        margin: 15.6,
        pay: "بطاقة ائتمان (POS)",
        status: "مكتملة بنجاح",
      },
      {
        id: "INV-10491",
        at: "2024-10-24T17:55:02",
        seller: "تيسير الأطرش",
        branch: "segev",
        phone: "054***1120",
        kind: "B2C",
        items: [
          { name: "Samsung Galaxy S24 Ultra 512GB", detail: "IMEI: 864901053219482", price: 4347.83, list: 4347.83, cost: 3450 },
          { name: "شاحن سامسونج أصلي 45W Type-C", detail: "× 1", price: 130.43, list: 130.43, cost: 68.26 },
        ],
        goods: 4478.26,
        total: 5150,
        tax: 671.74,
        profit: 960,
        margin: 18.6,
        pay: "تقسيط محلي (4 دفعات)",
        status: "معتمد ومسدد",
      },
      {
        id: "INV-10490",
        at: "2024-10-24T16:18:40",
        seller: "خالد أبو القيعان",
        branch: "hura",
        customer: "سليمان العقبي",
        kind: "B2C",
        items: [
          { name: "AirPods Pro (الجيل الثاني Type-C)", detail: "SN: H7GCK938P0", price: 869.57, list: 869.57, cost: 560 },
          { name: "حماية شاشة سيراميك نانو", detail: "× 2", price: 165.21, list: 200, cost: 89.78 },
        ],
        goods: 1034.78,
        total: 1190,
        tax: 155.22,
        profit: 385,
        margin: 37.2,
        pay: "نقداً Cash",
        status: "مكتمل بالصندوق",
      },
      {
        id: "INV-10489",
        at: "2024-10-24T15:10:11",
        seller: "تيسير الأطرش",
        branch: "segev",
        phone: "056***9933",
        kind: "B2C",
        items: [
          { name: "Redmi Note 13 Pro+ 5G", detail: "IMEI: 869018442194883", price: 1303.48, list: 1450, cost: 1050 },
          { name: "ضمان إضافي كير VIP لسنة", detail: "× 1", price: 173.91, list: 173.91, cost: 137.39 },
        ],
        goods: 1477.39,
        total: 1699,
        tax: 221.61,
        profit: 290,
        margin: 19.6,
        pay: "فيزا إلكترونية",
        status: "مكتملة بنجاح",
      },
      {
        id: "INV-10488",
        at: "2024-10-24T14:22:30",
        seller: "خالد أبو القيعان",
        branch: "hura",
        customer: "مكتب نقليات السلام",
        kind: "B2B",
        items: [
          { name: "iPad Air 11-inch M2 Wi-Fi 128GB", detail: "× 2", price: 5043.48, list: 5400, cost: 4100 },
          { name: "Apple Pencil Pro", detail: "× 2", price: 1034.78, list: 1100, cost: 828.26 },
        ],
        goods: 6078.26,
        total: 6990,
        tax: 911.74,
        profit: 1150,
        margin: 18.9,
        pay: "تحويل بنكي / سريع",
        status: "مكتمل ومفوتر",
      },
    ],
    staff: [
      { id: "s1", name: "أنور أبو القيعان", phone: "0500000001", pin: "1234", role: "صاحب المحل والمدير العام", branch: "all", shift: "إشراف", perms: ["بيع POS", "خصم حتى 15%", "سعر التكلفة", "تحويل مخزون", "إقفال الصندوق"], sales: 0, deals: 0, presence: "متصل من لوحة الإشراف", tone: "online" },
      { id: "s2", name: "خالد أبو القيعان", phone: "0501234567", pin: "2222", role: "بائع رئيسي (Senior Sales)", branch: "hura", shift: "ورديّة الصباح • صالة الهواتف", perms: ["بيع POS", "خصم حتى 5%", "تحويل مخزون"], sales: 86400, deals: 42, presence: "نشط الآن (POS-01) • منذ 08:30 ص", tone: "online" },
      { id: "s3", name: "تيسير الأطرش", phone: "0559876543", pin: "3333", role: "كاشير ومبيعات أجهزة", branch: "segev", shift: "ورديّة المساء • صندوق رقم 1", perms: ["بيع POS", "خصم استثنائي"], sales: 54120, deals: 28, presence: "نشط الآن (POS-02) • منذ 02:15 م", tone: "online" },
      { id: "s4", name: "بلال السيد", phone: "0543210987", pin: "4444", role: "موظف مبيعات", branch: "segev", shift: "مسؤول المبيعات المباشرة", perms: ["بيع POS", "خصم حتى 15%", "سعر التكلفة", "تحويل مخزون"], sales: 118900, deals: 31, presence: "نشط الآن (Portal)", tone: "online" },
      { id: "s5", name: "مريم العقبي", phone: "0567890123", pin: "5555", role: "خدمة عملاء ومبيعات إكسسوارات", branch: "hura", shift: "قسم الدعم الفني وملحقات Apple", perms: ["بيع POS", "خصم حتى 3%"], sales: 32450, deals: 58, presence: "في إجازة دورية • العودة بعد يومين", tone: "leave" },
      { id: "s6", name: "سليمان النصاصرة", phone: "0523456789", pin: "6666", role: "أمين مستودع وجرد أجهزة", branch: "warehouse", shift: "مسؤول الباركود والواردات", perms: ["صلاحية نقل كاملة"], sales: 0, deals: 380, presence: "نشط الآن (W-Scan)", tone: "online" },
      { id: "s7", name: "عمار القريناوي", phone: "0500000104", pin: "1040", role: "كاشير نقطة البيع", branch: "rahat", shift: "صندوق رقم 2", perms: ["بيع POS", "خصم حتى 50 ₪"], sales: 11850, deals: 4, presence: "نوبة مباشرة • 04:32", tone: "online" },
    ],
    moves: [
      { id: "TR-8841", type: "تحويل داخلي", title: "5 أجهزة Apple iPhone 15 Pro", detail: "اللون: تيتانيوم طبيعي | سعة: 256GB", from: "المستودع المركزي", to: "فرع شقيب السلام", who: "خالد الطوري", when: "اليوم 11:42 ص", status: "تم الاستلام والجرد" },
      { id: "IN-3920", type: "وارد توريد", title: "20 كرتونة كوابل وشواحن Anker السريعة", detail: "المورد: شركة عصر الجوال المحدودة", from: "المورد الخارجي", to: "المستودع المركزي", who: "طارق محمود", when: "اليوم 09:15 ص", status: "تم الجرد والمطابقة" },
      { id: "INV-9402", type: "صادر مبيعات", title: "1x هاتف Samsung Galaxy S24 Ultra", detail: "IMEI: 358941098234112", from: "فرع رهط الرئيسي", to: "فاتورة عميل نقطة البيع", who: "سالم أبو عصا", when: "أمس 08:50 م", status: "مسجل بنظام POS" },
      { id: "TR-8845", type: "تحويل قيد التوصيل", title: "3 شاشات بديلة وساعات Galaxy Watch 6", detail: "طلب تغطية عاجل لفرع حورة", from: "فرع رهط الرئيسي", to: "فرع حورة", who: "مندوب التوصيل (السبع / النقب)", when: "اليوم 01:20 م", status: "في الطريق مع المندوب" },
    ],
    cash: [
      { id: "c1", time: "10:00 ص", kind: "in", label: "إيداع افتتاحي", detail: "رصيد العهدة النقدية لبداية اليومية • درج كاشير فرع رهط #01", who: "أحمد القريناوي", role: "مدير الفرع", amount: 3000 },
      { id: "c2", time: "12:40 م", kind: "in", label: "مقبوضات بيع", detail: "فاتورة بيع كاش #INV-10490 • سماعات AirPods Pro", who: "سالم أبو عصا", role: "بائع POS", amount: 1190 },
      { id: "c3", time: "03:15 م", kind: "out", label: "مصروف تشغيلي", detail: "ضيافة وقهوة عربية • سند صرف #EX-102", who: "خالد الطوري", role: "اعتماد المشرف", amount: 120 },
      { id: "c4", time: "05:30 م", kind: "out", label: "مصروف طوارئ", detail: "صيانة وحدة التكييف • سند صرف #EX-103", who: "أحمد القريناوي", role: "مدير الفرع", amount: 300 },
      { id: "c5", time: "07:15 م", kind: "in", label: "مقبوضات بيع", detail: "فاتورة بيع كاش #INV-10493 • iPhone 15 Pro Max 256GB", who: "سالم أبو عصا", role: "بائع POS", amount: 5260 },
    ],
    attendance: [
      { id: "a1", name: "أحمد القريناوي", role: "مدير الفرع", inn: "08:52 ص", out: "--:--", state: "حاضر" },
      { id: "a2", name: "خالد الطوري", role: "أخصائي مبيعات", inn: "09:15 ص", out: "+15د", state: "متأخر" },
      { id: "a3", name: "سالم أبو عصا", role: "كاشير POS", inn: "08:58 ص", out: "--:--", state: "حاضر" },
      { id: "a4", name: "مريم الهواشلة", role: "خدمة عملاء واستبدال", inn: "08:45 ص", out: "--:--", state: "حاضر" },
      { id: "a5", name: "وسيم النصاصرة", role: "أمين المستودع", inn: "—", out: "—", state: "إجازة" },
    ],
    stockRequests: [],
    alerts: [
      { id: "n1", name: "iPhone 15 Pro Max", detail: "256GB • تيتانيوم طبيعي • موديل A3106", left: 2, min: 5 },
      { id: "n2", name: "شاحن Apple MagSafe الأصلي", detail: "ملحقات طاقة • كابل 1 متر • 15W", left: 4, min: 15 },
      { id: "n3", name: "Samsung Galaxy S24 Ultra", detail: "512GB • رمادي تيتانيوم • ضمان الوكيل", left: 1, min: 4 },
      { id: "n4", name: "AirPods Pro الجيل الثاني", detail: "منفذ Type-C • علبة MagSafe", left: 3, min: 10 },
    ],
  };
}

export function enrichInvoices(db) {
  const fresh = createSeed();
  const byId = new Map(fresh.invoices.map((invoice) => [invoice.id, invoice]));
  for (const invoice of db.invoices || []) {
    const source = byId.get(invoice.id);
    if (!source) continue;
    invoice.items.forEach((item, index) => {
      const row = source.items[index];
      if (!row) return;
      if (item.list == null && row.list != null) item.list = row.list;
      if (item.cost == null && row.cost != null) item.cost = row.cost;
    });
  }
  const ids = new Set((db.products || []).map((product) => product.id));
  for (const product of fresh.products) {
    if (!ids.has(product.id)) db.products.push(structuredClone(product));
  }
  if (!Array.isArray(db.stockRequests)) db.stockRequests = [];
  return db;
}

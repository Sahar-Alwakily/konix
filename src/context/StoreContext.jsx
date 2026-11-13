import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { firebaseConfigured } from "../APIFirebase/firebase";
import { createSeed, enrichInvoices } from "../data/seed";

const KEY = "kunix.dummy.v1";
const SESSION = "kunix.session.v1";
const StoreContext = createContext(null);

function readDb() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return enrichInvoices(JSON.parse(raw));
  } catch {
    /* fresh seed */
  }
  return createSeed();
}

export function StoreProvider({ children }) {
  const [db, setDb] = useState(readDb);
  const [session, setSession] = useState(() => {
    try {
      const raw = localStorage.getItem(SESSION);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [branch, setBranch] = useState("rahat");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(db));
  }, [db]);

  useEffect(() => {
    if (session) localStorage.setItem(SESSION, JSON.stringify(session));
    else localStorage.removeItem(SESSION);
  }, [session]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(""), 2800);
    return () => clearTimeout(t);
  }, [toast]);

  const api = useMemo(() => {
    const flash = (message) => setToast(message);
    const patch = (fn) => setDb((prev) => {
      const next = structuredClone(prev);
      fn(next);
      return next;
    });

    return {
      firebaseOn: firebaseConfigured(),
      login(phone, pin) {
        const key = String(phone || "").replace(/\s|-/g, "");
        const code = String(pin || "").trim();
        const user = db.staff.find((s) => (String(s.phone).replace(/\s|-/g, "") === key || s.id === key) && s.pin === code);
        if (!user) return false;
        setSession({ id: user.id, name: user.name, role: user.role, branch: user.branch === "all" ? "rahat" : user.branch });
        if (user.branch !== "all") setBranch(user.branch);
        return true;
      },
      logout() {
        setSession(null);
      },
      flash,
      addProduct(product) {
        patch((next) => {
          next.products.unshift({
            id: `p${Date.now()}`,
            stock: { rahat: 0, segev: 0, hura: 0, warehouse: 0 },
            min: 2,
            ...product,
          });
        });
        flash("تمت إضافة المنتج إلى البيانات التجريبية");
      },
      updatePrice(id, price) {
        patch((next) => {
          const row = next.products.find((p) => p.id === id);
          if (row) row.price = Number(price);
        });
        flash("تم تحديث سعر البيع");
      },
      removeProduct(id) {
        patch((next) => {
          next.products = next.products.filter((p) => p.id !== id);
        });
      },
      checkout({ items, pay, discount, seller, branchId }) {
        const goods = items.reduce((s, item) => s + item.price * item.qty, 0) - (discount || 0);
        const vat = db.settings.vat / 100;
        const tax = Math.round(goods * vat * 100) / 100;
        const total = Math.round((goods + tax) * 100) / 100;
        const id = `INV-${10493 + db.invoices.length}`;
        const invoice = {
          id,
          at: new Date().toISOString(),
          seller,
          branch: branchId,
          kind: "B2C",
          live: true,
          items: items.map((item) => {
            const unit = Number(item.price) || 0;
            const listUnit = item.list != null ? Number(item.list) : unit;
            return {
              name: item.name,
              detail: item.sku || item.imei || "",
              price: Math.round(unit * item.qty * 100) / 100,
              list: Math.round(listUnit * item.qty * 100) / 100,
              cost: Math.round((Number(item.cost) || 0) * item.qty * 100) / 100,
            };
          }),
          discount: Math.round((discount || 0) * 100) / 100,
          goods,
          total,
          tax,
          profit: Math.round(items.reduce((s, item) => s + (item.price - item.cost) * item.qty, 0) - (discount || 0)),
          margin: goods ? Math.round(((items.reduce((s, item) => s + (item.price - item.cost) * item.qty, 0) - (discount || 0)) / goods) * 1000) / 10 : 0,
          pay,
          status: "مكتملة بنجاح",
        };
        patch((next) => {
          next.invoices.unshift(invoice);
          items.forEach((item) => {
            const product = next.products.find((p) => p.id === item.id);
            if (product?.stock?.[branchId] != null) {
              product.stock[branchId] = Math.max(0, product.stock[branchId] - item.qty);
            }
          });
          if (pay.includes("نقد")) {
            next.cash.unshift({
              id: `c${Date.now()}`,
              time: "الآن",
              kind: "in",
              label: "مقبوضات بيع",
              detail: `فاتورة ${id}`,
              who: seller,
              role: "بائع POS",
              amount: total,
            });
          }
        });
        flash(`تم تسجيل ${id} في البيانات التجريبية`);
        return invoice;
      },
      requestStock(request) {
        const id = `RQ-${String(Date.now()).slice(-6)}`;
        patch((next) => {
          if (!Array.isArray(next.stockRequests)) next.stockRequests = [];
          next.stockRequests.unshift({
            id,
            at: new Date().toISOString(),
            status: "بانتظار الأدمن",
            ...request,
          });
        });
        flash(`تم تسجيل الطلب ${id} ووصل للأدمن`);
        return id;
      },
      addCash(move) {
        patch((next) => {
          next.cash.unshift({ id: `c${Date.now()}`, time: "الآن", ...move });
        });
        flash("تم تسجيل حركة الصندوق");
      },
      addStaff(person) {
        patch((next) => {
          next.staff.push({
            id: `s${Date.now()}`,
            sales: 0,
            deals: 0,
            presence: "حساب جديد",
            tone: "online",
            perms: person.perms || ["بيع POS"],
            ...person,
          });
        });
        flash("تم إصدار بطاقة الموظف");
      },
      openShop(profile) {
        patch((next) => {
          next.settings = { ...next.settings, ...profile, plan: "شهري", price: 500 };
        });
        setSession({ id: "owner", name: profile.owner, role: "صاحب المحل", branch: "rahat" });
        setBranch("rahat");
        flash("تم فتح المتجر. أهلاً بك في كونيكس");
      },
      updateSettings(partial) {
        patch((next) => {
          next.settings = { ...next.settings, ...partial };
        });
        flash("تم حفظ إعدادات المتجر محلياً");
      },
      resetDummy() {
        setDb(enrichInvoices(createSeed()));
        flash("رجعت البيانات التجريبية الأصلية");
      },
    };
  }, [db.settings.vat, db.invoices.length, db.staff]);

  const value = { db, session, branch, setBranch, query, setQuery, toast, ...api };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore outside provider");
  return ctx;
}

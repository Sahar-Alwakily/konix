import { NavLink, useNavigate } from "react-router-dom";
import { BRANCHES } from "../../data/seed";
import { useStore } from "../../context/StoreContext";
import { Icon } from "../ui";

const NAV = [
  { to: "/", label: "لوحة القيادة الرئيسية", icon: "dashboard", end: true },
  { to: "/products", label: "إدارة المنتجات والأسعار", icon: "inventory_2" },
  { to: "/inventory", label: "المستودع وحركات الجرد", icon: "warehouse" },
  { to: "/sales", label: "المبيعات وسجل الفواتير", icon: "receipt_long" },
  { to: "/staff", label: "الموظفون والصلاحيات", icon: "badge" },
  { to: "/cash", label: "الإدارة والصندوق اليومي", icon: "account_balance_wallet" },
  { to: "/reports", label: "التقارير المالية والتحليل", icon: "insights" },
  { to: "/pos", label: "بوابة الموظف (POS)", icon: "point_of_sale", fast: true },
];

export default function Shell({ children }) {
  const { session, logout, branch, setBranch, query, setQuery, toast, db } = useStore();
  const navigate = useNavigate();
  const alerts = db.alerts.length;

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <aside className="fixed right-0 top-0 h-full w-72 bg-white shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between max-lg:hidden">
        <div className="flex-1 overflow-y-auto">
          <div className="h-16 px-5 flex items-center justify-between border-b border-surface-container-high">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary-container text-white grid place-items-center font-extrabold">K</div>
              <div>
                <div className="font-extrabold leading-tight truncate max-w-[140px]">{db.settings.shopName || "كونيكس"}</div>
                <div className="text-[10px] font-bold text-outline tracking-wide">{db.settings.shopName ? "كونيكس" : "Kunix Retail OS"}</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold">PRO</span>
          </div>
          <div className="p-4">
            <div className="bg-surface-container-low rounded-xl p-3 mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="store" className="text-secondary" />
                <div>
                  <div className="text-[10px] text-outline">الفرع الحالي</div>
                  <div className="text-[12px] font-bold">{BRANCHES.find((b) => b.id === branch)?.name || "كل الفروع"}</div>
                </div>
              </div>
            </div>
            <div className="px-2 py-1 text-[10px] font-bold tracking-wider text-outline">القائمة الرئيسية</div>
            <nav className="flex flex-col gap-1">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-[14px] font-semibold transition ${
                      isActive ? "bg-primary-container text-white shadow-sm" : "text-on-surface-variant hover:bg-surface-container-low"
                    }`
                  }
                >
                  <span className="flex items-center gap-3">
                    <Icon name={item.icon} />
                    {item.label}
                  </span>
                  {item.fast && <span className="px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container text-[10px] font-bold">سريع</span>}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
        <div className="p-4 border-t border-surface-container-high flex flex-col gap-1">
          <NavLink to="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-[12px] font-semibold text-on-surface-variant hover:bg-surface-container-low">
            <Icon name="settings" /> إعدادات المتجر العامة
          </NavLink>
          <button type="button" onClick={logout} className="flex items-center gap-3 px-3 py-2 rounded-lg text-[12px] font-semibold text-error hover:bg-error-container">
            <Icon name="logout" /> تسجيل الخروج
          </button>
          <div className="flex items-center justify-between px-2 pt-1 text-outline text-[10px] font-bold">
            <span>نظام كونيكس السحابي</span>
            <span className="nums">v2.4.0</span>
          </div>
        </div>
      </aside>

      <header className="fixed top-0 right-0 left-0 lg:right-72 h-16 bg-surface/85 backdrop-blur-xl z-40 flex items-center justify-between gap-3 px-4 lg:px-8 border-b border-surface-container-high">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <label className="relative">
            <Icon name="storefront" className="absolute right-2 top-1/2 -translate-y-1/2 text-primary-container" />
            <select value={branch} onChange={(e) => setBranch(e.target.value)} className="appearance-none bg-surface-container-low text-[12px] font-semibold rounded-lg pr-9 pl-8 py-2 outline-none">
              {BRANCHES.filter((b) => b.id !== "warehouse").map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
              <option value="all">كل الفروع (مجمّع)</option>
            </select>
          </label>
          <label className="relative max-w-md w-full hidden md:block">
            <Icon name="search" className="absolute right-3 top-1/2 -translate-y-1/2 text-outline" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="بحث عن هاتف، IMEI، رقم فاتورة، أو عميل..."
              className="w-full pr-10 pl-16 py-2 bg-white border border-surface-container-high rounded-lg text-[12px] outline-none focus:ring-2 focus:ring-primary-container"
            />
            <kbd className="absolute left-2 top-1/2 -translate-y-1/2 px-2 py-0.5 text-[10px] text-outline bg-surface-container-low rounded border border-line">Ctrl + K</kbd>
          </label>
          <span className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low text-[10px] font-bold text-tertiary">
            <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse" />
            النظام متصل
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate("/pos")} className="flex items-center gap-1 bg-primary-container hover:bg-[#E66E00] text-white px-3 py-2 rounded-lg text-[12px] font-bold active:scale-[0.98]">
            <Icon name="add_shopping_cart" />
            <span className="hidden sm:inline">+ عملية بيع سريعة</span>
          </button>
          <button type="button" onClick={() => navigate("/")} className="relative w-9 h-9 rounded-lg bg-surface-container-low text-on-surface-variant">
            <Icon name="notifications" />
            <span className="absolute -top-1 -left-1 w-4 h-4 bg-error text-white rounded-full text-[10px] font-bold grid place-items-center">{alerts}</span>
          </button>
          <div className="hidden xl:block text-left">
            <div className="text-[13px] font-bold leading-4">{session?.name}</div>
            <div className="text-[10px] text-outline">{session?.role}</div>
          </div>
        </div>
      </header>

      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-line flex overflow-x-auto">
        {NAV.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `shrink-0 px-3 py-2 text-[11px] font-bold ${isActive ? "text-primary-container" : "text-outline"}`}>
            {item.label.split(" ")[0]}
          </NavLink>
        ))}
      </nav>

      <main className="lg:mr-72 pt-16 pb-16 lg:pb-8 px-4 lg:px-8">{children}</main>
      {toast && <div className="fixed bottom-6 left-6 z-[90] bg-ink text-white px-4 py-3 rounded-xl text-[13px] font-semibold shadow-lg">{toast}</div>}
    </div>
  );
}

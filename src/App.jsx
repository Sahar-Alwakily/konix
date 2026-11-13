import { Navigate, Route, Routes } from "react-router-dom";
import { useStore } from "./context/StoreContext";
import Shell from "./components/layout/Shell";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Inventory from "./pages/Inventory";
import Sales from "./pages/Sales";
import Staff from "./pages/Staff";
import Cash from "./pages/Cash";
import Reports from "./pages/Reports";
import Pos from "./pages/Pos";
import Settings from "./pages/Settings";
import WorkerLogin from "./pages/WorkerLogin";
import WorkerPos from "./pages/WorkerPos";

function Guard({ children }) {
  const { session } = useStore();
  if (!session) return <Navigate to="/welcome" replace />;
  return <Shell>{children}</Shell>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/welcome" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/worker" element={<WorkerLogin />} />
      <Route path="/worker/pos" element={<WorkerPos />} />
      <Route path="/" element={<Guard><Dashboard /></Guard>} />
      <Route path="/products" element={<Guard><Products /></Guard>} />
      <Route path="/inventory" element={<Guard><Inventory /></Guard>} />
      <Route path="/sales" element={<Guard><Sales /></Guard>} />
      <Route path="/staff" element={<Guard><Staff /></Guard>} />
      <Route path="/cash" element={<Guard><Cash /></Guard>} />
      <Route path="/reports" element={<Guard><Reports /></Guard>} />
      <Route path="/pos" element={<Guard><Pos /></Guard>} />
      <Route path="/settings" element={<Guard><Settings /></Guard>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

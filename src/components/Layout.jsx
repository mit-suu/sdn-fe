import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth, useLogout } from "../hooks/useAuth";
import { authService } from "../services/api";
import { IconDashboard, IconCar, IconPlus, IconCalendar } from "./Icons";

const navItems = [
  { to: "/", icon: IconDashboard, label: "Dashboard" },
  { to: "/cars", icon: IconCar, label: "Xe" },
  { to: "/cars/new", icon: IconPlus, label: "Thêm xe" },
  { to: "/bookings", icon: IconCalendar, label: "Bookings" },
  { to: "/bookings/new", icon: IconPlus, label: "Thêm booking" },
];

export default function Layout({ children }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const logout = useLogout();

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success("Đăng xuất thành công");
      logout();
    } catch (error) {
      toast.error("Lỗi khi đăng xuất");
      // Vẫn logout mặc dù có lỗi
      logout();
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-zinc-950/80 backdrop-blur-xl border-r border-zinc-800/50 flex flex-col">
        {/* Logo */}
        <div className="px-6 py-7 border-b border-zinc-800/50">
          <span className="font-heading text-2xl font-bold text-brand tracking-tight">Car</span>
          <span className="font-heading text-2xl font-bold text-zinc-100 tracking-tight">Rental</span>
          <p className="text-zinc-500 text-xs mt-1 font-body">Management System</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to + label}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-brand/10 text-brand shadow-sm"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
                }`
              }
            >
              <Icon size={18} className={undefined} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User Info & Logout */}
        <div className="px-6 py-4 border-t border-zinc-800/50 space-y-4">
          {/* User Info */}
          {user && (
            <div className="bg-zinc-800/50 rounded-lg p-3">
              <p className="text-xs text-zinc-400 mb-1">Đăng nhập với</p>
              <p className="text-sm font-semibold text-zinc-100 truncate">
                {user.username || user.email}
              </p>
              <p className="text-xs text-zinc-500 truncate">{user.email}</p>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-sm font-medium rounded-lg transition-all duration-200 border border-red-500/20"
          >
            Đăng Xuất
          </button>

          <p className="text-zinc-600 text-xs font-body">v1.0.0</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto bg-zinc-950">
        <div className="p-8 animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { carService, bookingService } from "../services/api";
import { LoadingSpinner, StatusBadge } from "../components/UI";
import { IconCar, IconCheckCircle, IconKey, IconWrench, IconImageOff } from "../components/Icons";

export default function Dashboard() {
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([carService.getAll(), bookingService.getAll()])
      .then(([c, b]) => {
        setCars(c.data || []);
        setBookings(b.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const available = cars.filter((c) => c.status === "available").length;
  const rented = cars.filter((c) => c.status === "rented").length;
  const maintenance = cars.filter((c) => c.status === "maintenance").length;

  const stats = [
    { label: "Tổng xe", value: cars.length, icon: IconCar, color: "text-brand", bg: "bg-brand/5 border-brand/15", iconBg: "bg-brand/10" },
    { label: "Sẵn sàng", value: available, icon: IconCheckCircle, color: "text-emerald-400", bg: "bg-emerald-900/20 border-emerald-800/30", iconBg: "bg-emerald-900/30" },
    { label: "Đang thuê", value: rented, icon: IconKey, color: "text-orange-400", bg: "bg-orange-900/20 border-orange-800/30", iconBg: "bg-orange-900/30" },
    { label: "Bảo trì", value: maintenance, icon: IconWrench, color: "text-red-400", bg: "bg-red-900/20 border-red-800/30", iconBg: "bg-red-900/30" },
  ];

  const recentBookings = [...bookings].slice(0, 5);

  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-zinc-100 tracking-tight">Dashboard</h1>
        <p className="text-zinc-500 text-sm mt-1.5 font-body">Tổng quan hệ thống quản lý cho thuê xe</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map(({ label, value, icon: StatIcon, color, bg, iconBg }) => (
          <div key={label} className={`card border ${bg} hover:shadow-card-hover transition-all duration-300 group`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                <StatIcon size={22} className={color} />
              </div>
              <div>
                <p className="text-zinc-500 text-xs uppercase tracking-wider font-medium">{label}</p>
                <p className={`font-heading text-3xl font-bold ${color}`}>{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-lg font-semibold text-zinc-100 tracking-tight">Booking gần đây</h2>
            <Link to="/bookings" className="text-brand text-xs font-medium hover:text-brand-light transition-colors">
              Xem tất cả →
            </Link>
          </div>
          {recentBookings.length === 0 ? (
            <p className="text-zinc-600 text-sm text-center py-8 font-body">Chưa có booking nào</p>
          ) : (
            <div className="space-y-1">
              {recentBookings.map((b) => (
                <div key={b._id} className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-zinc-800/40 transition-colors">
                  <div>
                    <p className="text-zinc-200 text-sm font-medium">{b.customerName}</p>
                    <p className="text-zinc-500 text-xs font-body">{b.carNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-brand text-sm font-semibold">
                      {b.totalAmount?.toLocaleString("vi-VN")}₫
                    </p>
                    <p className="text-zinc-600 text-xs font-body">
                      {new Date(b.startDate).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Car List Summary */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-lg font-semibold text-zinc-100 tracking-tight">Danh sách xe</h2>
            <Link to="/cars" className="text-brand text-xs font-medium hover:text-brand-light transition-colors">
              Xem tất cả →
            </Link>
          </div>
          {cars.length === 0 ? (
            <p className="text-zinc-600 text-sm text-center py-8 font-body">Chưa có xe nào</p>
          ) : (
            <div className="space-y-1">
              {cars.slice(0, 5).map((car) => (
                <div key={car._id} className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-zinc-800/40 transition-colors">
                  <div className="flex items-center gap-3">
                    {car.image ? (
                      <img src={car.image} alt={car.carNumber} className="w-10 h-10 rounded-lg object-cover border border-zinc-700/50" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg border border-zinc-700/50 bg-zinc-800/60 flex items-center justify-center">
                        <IconCar size={18} className="text-zinc-500" />
                      </div>
                    )}
                    <div>
                      <p className="text-zinc-200 text-sm font-medium">{car.carNumber}</p>
                      <p className="text-zinc-500 text-xs font-body">{car.capacity} chỗ</p>
                    </div>
                  </div>
                  <StatusBadge status={car.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { bookingService } from "../services/api";
import { PageHeader, LoadingSpinner, EmptyState, ConfirmModal } from "../components/UI";
import { IconPencil, IconTrash, IconCheckCircle } from "../components/Icons";

export default function BookingsList() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [pickupTarget, setPickupTarget] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await bookingService.getAll();
      setBookings(res.data || []);
    } catch {
      toast.error("Không thể tải danh sách booking");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleDelete = async () => {
    try {
      await bookingService.delete(deleteTarget);
      toast.success("Đã xoá booking thành công");
      setDeleteTarget(null);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Xoá booking thất bại");
    }
  };

  const handlePickup = async () => {
    try {
      await bookingService.pickup(pickupTarget);
      toast.success("Đã nhận xe thành công");
      setPickupTarget(null);
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || "Nhận xe thất bại");
    }
  };

  const calcDays = (start, end) =>
    Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));

  const isActive = (start, end) => {
    const now = new Date();
    return new Date(start) <= now && now <= new Date(end);
  };

  return (
    <div className="animate-slide-up">
      <PageHeader
        title="Quản lý Booking"
        subtitle={`${bookings.length} booking`}
        action={
          <Link to="/bookings/new" className="btn-primary">
            <span className="text-base leading-none">+</span> Tạo booking
          </Link>
        }
      />

      {loading ? (
        <LoadingSpinner />
      ) : bookings.length === 0 ? (
        <EmptyState
          message="Chưa có booking nào"
          action={
            <Link to="/bookings/new" className="btn-primary">
              <span className="text-base leading-none">+</span> Tạo booking
            </Link>
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800/50 shadow-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-zinc-900/60 border-b border-zinc-800/50">
                {["Khách hàng", "Biển số xe", "Bắt đầu", "Kết thúc", "Số ngày", "Tổng tiền", "Trạng thái", ""].map((h) => (
                  <th key={h} className="text-left text-zinc-500 text-xs uppercase tracking-wider px-5 py-3.5 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => {
                const active = isActive(b.startDate, b.endDate);
                const days = calcDays(b.startDate, b.endDate);
                return (
                  <tr key={b._id} className="border-b border-zinc-800/40 last:border-0 hover:bg-zinc-800/30 transition-colors">
                    <td className="px-5 py-3.5 text-zinc-100 font-medium">{b.customerName}</td>
                    <td className="px-5 py-3.5">
                      <span className="bg-zinc-800/60 text-brand border border-zinc-700/40 px-2.5 py-1 rounded-lg text-xs font-mono">
                        {b.carNumber}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-400 font-body">
                      {new Date(b.startDate).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-400 font-body">
                      {new Date(b.endDate).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-300">{days} ngày</td>
                    <td className="px-5 py-3.5 text-brand font-semibold">
                      {b.totalAmount?.toLocaleString("vi-VN")}₫
                    </td>
                    <td className="px-5 py-3.5">
                      {active ? (
                        <span className="badge-available">Đang diễn ra</span>
                      ) : new Date(b.endDate) < new Date() ? (
                        <span className="inline-flex items-center bg-zinc-800/50 text-zinc-500 border border-zinc-700/40 text-xs px-2.5 py-1 rounded-full font-medium">
                          Đã kết thúc
                        </span>
                      ) : (
                        <span className="badge-rented">Sắp tới</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        {active && (
                          <button
                            onClick={() => setPickupTarget(b._id)}
                            className="btn-primary px-2.5 py-1.5 text-xs"
                            title="Nhận xe"
                          >
                            <IconCheckCircle size={13} className="text-white" />
                          </button>
                        )}
                        <Link to={`/bookings/edit/${b._id}`} className="btn-ghost px-2.5 py-1.5 text-xs">
                          <IconPencil size={13} className="text-zinc-400" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(b._id)}
                          className="btn-danger px-2.5 py-1.5 text-xs"
                        >
                          <IconTrash size={13} className="text-white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Xoá Booking"
        message="Bạn có chắc muốn xoá booking này? Xe sẽ được trả về trạng thái sẵn sàng."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmModal
        open={!!pickupTarget}
        title="Nhận Xe"
        message="Xác nhận nhận xe cho booking này?"
        onConfirm={handlePickup}
        onCancel={() => setPickupTarget(null)}
      />
    </div>
  );
}
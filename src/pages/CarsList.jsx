import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { carService } from "../services/api";
import { StatusBadge, PageHeader, LoadingSpinner, EmptyState, ConfirmModal } from "../components/UI";
import { IconPencil, IconTrash, IconCar } from "../components/Icons";

const STATUS_FILTERS = ["all", "available", "rented", "maintenance"];

export default function CarsList() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const res = await carService.getAll(filter === "all" ? "" : filter);
      setCars(res.data || []);
    } catch {
      toast.error("Không thể tải danh sách xe");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCars(); }, [filter]);

  const handleDelete = async () => {
    try {
      await carService.delete(deleteTarget);
      toast.success("Đã xoá xe thành công");
      setDeleteTarget(null);
      fetchCars();
    } catch (err) {
      toast.error(err.response?.data?.message || "Xoá xe thất bại");
    }
  };

  return (
    <div className="animate-slide-up">
      <PageHeader
        title="Danh sách xe"
        subtitle={`${cars.length} xe tìm thấy`}
        action={
          <Link to="/cars/new" className="btn-primary">
            <span className="text-base leading-none">+</span> Thêm xe
          </Link>
        }
      />

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-xs uppercase tracking-wider font-medium transition-all duration-200 ${
              filter === s
                ? "bg-brand text-white shadow-md"
                : "bg-zinc-800/60 text-zinc-400 hover:bg-zinc-700/60 border border-zinc-700/40"
            }`}
          >
            {s === "all" ? "Tất cả" : s}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : cars.length === 0 ? (
        <EmptyState
          message="Không có xe nào"
          action={
            <Link to="/cars/new" className="btn-primary">
              <span className="text-base leading-none">+</span> Thêm xe
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {cars.map((car) => (
            <div key={car._id} className="card hover:border-zinc-700/80 hover:shadow-card-hover transition-all duration-300 group">
              {/* Image */}
              <div className="w-full h-44 rounded-xl mb-5 overflow-hidden bg-zinc-800/40 border border-zinc-700/40 flex items-center justify-center">
                {car.image ? (
                  <img
                    src={car.image}
                    alt={car.carNumber}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-zinc-600">
                    <IconCar size={40} className="text-zinc-600" />
                    <span className="text-xs font-body">Không có ảnh</span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-heading text-lg font-semibold text-zinc-100 tracking-tight">{car.carNumber}</h3>
                  <p className="text-zinc-500 text-xs font-body">{car.capacity} chỗ ngồi</p>
                </div>
                <StatusBadge status={car.status} />
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className="text-brand font-semibold text-sm">
                  {car.pricePerDay?.toLocaleString("vi-VN")}₫
                  <span className="text-zinc-500 text-xs font-normal">/ngày</span>
                </span>
              </div>

              {car.features?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {car.features.map((f) => (
                    <span key={f} className="bg-zinc-800/60 text-zinc-400 text-xs px-2.5 py-1 rounded-lg border border-zinc-700/40 font-body">
                      {f}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-zinc-800/50">
                <Link to={`/cars/edit/${car.carNumber}`} className="btn-ghost flex-1 justify-center text-xs">
                  <IconPencil size={14} className="text-zinc-400" /> Sửa
                </Link>
                <button
                  onClick={() => setDeleteTarget(car.carNumber)}
                  className="btn-danger flex-1 justify-center text-xs"
                >
                  <IconTrash size={14} className="text-white" /> Xoá
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Xoá xe"
        message={`Bạn có chắc muốn xoá xe "${deleteTarget}"? Hành động này không thể hoàn tác.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
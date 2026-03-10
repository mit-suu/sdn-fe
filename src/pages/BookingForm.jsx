import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { bookingService, carService } from "../services/api";
import { PageHeader, FormField } from "../components/UI";
import { IconArrowLeft, IconSave, IconCar, IconCalculator } from "../components/Icons";

const today = () => new Date().toISOString().split("T")[0];

const INITIAL = {
  customerName: "",
  carNumber: "",
  startDate: today(),
  endDate: "",
};

export default function BookingForm() {
  const { bookingId } = useParams();
  const isEdit = Boolean(bookingId);
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL);
  const [cars, setCars] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    carService.getAll().then((res) => setCars(res.data || []));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    bookingService.getOne(bookingId)
      .then((res) => {
        const b = res.data;
        setForm({
          customerName: b.customerName,
          carNumber: b.carNumber,
          startDate: b.startDate?.split("T")[0],
          endDate: b.endDate?.split("T")[0],
        });
      })
      .catch(() => toast.error("Không tải được thông tin booking"))
      .finally(() => setFetching(false));
  }, [bookingId, isEdit]);

  useEffect(() => {
    if (!form.startDate || !form.endDate || !form.carNumber) {
      setPreview(null);
      return;
    }
    const car = cars.find((c) => c.carNumber === form.carNumber);
    if (!car) return;
    const diff = new Date(form.endDate) - new Date(form.startDate);
    if (diff <= 0) { setPreview(null); return; }
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    setPreview({ days, totalAmount: days * car.pricePerDay });
  }, [form.startDate, form.endDate, form.carNumber, cars]);

  const validate = () => {
    const e = {};
    if (!form.customerName.trim()) e.customerName = "Vui lòng nhập tên khách hàng";
    if (!form.carNumber) e.carNumber = "Vui lòng chọn xe";
    if (!form.startDate) e.startDate = "Vui lòng chọn ngày bắt đầu";
    if (!form.endDate) e.endDate = "Vui lòng chọn ngày kết thúc";
    if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate))
      e.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      if (isEdit) {
        await bookingService.update(bookingId, form);
        toast.success("Cập nhật booking thành công");
      } else {
        await bookingService.create(form);
        toast.success("Tạo booking thành công");
      }
      navigate("/bookings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-2 border-zinc-700 border-t-brand rounded-full animate-spin" />
    </div>
  );

  const selectedCar = cars.find((c) => c.carNumber === form.carNumber);

  return (
    <div className="animate-slide-up max-w-2xl">
      <PageHeader
        title={isEdit ? "Sửa Booking" : "Tạo Booking"}
        subtitle={isEdit ? `Đang sửa booking #${bookingId?.slice(-6)}` : "Đặt xe mới cho khách hàng"}
        action={
          <button onClick={() => navigate("/bookings")} className="btn-ghost">
            <IconArrowLeft size={16} className="text-zinc-400" /> Quay lại
          </button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="card space-y-5">
          <FormField label="Tên khách hàng *" error={errors.customerName}>
            <input
              name="customerName"
              value={form.customerName}
              onChange={handleChange}
              className="input-field"
              placeholder="Nguyễn Văn A"
            />
          </FormField>

          <FormField label="Chọn xe *" error={errors.carNumber}>
            <select name="carNumber" value={form.carNumber} onChange={handleChange} className="input-field">
              <option value="">-- Chọn xe --</option>
              {cars.map((car) => (
                <option
                  key={car.carNumber}
                  value={car.carNumber}
                  disabled={car.status === "maintenance"}
                >
                  {car.carNumber} — {car.capacity} chỗ — {car.pricePerDay?.toLocaleString("vi-VN")}₫/ngày
                  {car.status !== "available" ? ` (${car.status})` : ""}
                </option>
              ))}
            </select>
          </FormField>

          {/* Selected car info */}
          {selectedCar && (
            <div className="flex items-center gap-3 bg-zinc-800/40 border border-zinc-700/40 rounded-xl p-4">
              {selectedCar.image ? (
                <img
                  src={selectedCar.image}
                  alt={selectedCar.carNumber}
                  className="w-14 h-14 object-cover rounded-xl border border-zinc-700/50"
                />
              ) : (
                <div className="w-14 h-14 bg-zinc-700/40 rounded-xl flex items-center justify-center">
                  <IconCar size={24} className="text-zinc-500" />
                </div>
              )}
              <div>
                <p className="text-zinc-200 text-sm font-semibold">{selectedCar.carNumber}</p>
                <p className="text-zinc-500 text-xs font-body">{selectedCar.capacity} chỗ · {selectedCar.features?.join(", ")}</p>
                <p className="text-brand text-xs mt-0.5 font-medium">{selectedCar.pricePerDay?.toLocaleString("vi-VN")}₫/ngày</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Ngày bắt đầu *" error={errors.startDate}>
              <input
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                className="input-field"
              />
            </FormField>

            <FormField label="Ngày kết thúc *" error={errors.endDate}>
              <input
                name="endDate"
                type="date"
                value={form.endDate}
                min={form.startDate}
                onChange={handleChange}
                className="input-field"
              />
            </FormField>
          </div>
        </div>

        {/* Payment preview */}
        {preview && (
          <div className="card border-brand/20 bg-brand/5 animate-slide-up">
            <div className="flex items-center gap-2 mb-3 text-brand">
              <IconCalculator size={16} className="text-brand" />
              <span className="text-xs uppercase tracking-wider font-semibold">Tính toán tự động</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-zinc-400 text-sm font-body">
                <span className="text-zinc-200 font-medium">{preview.days}</span> ngày ×{" "}
                <span className="text-zinc-200 font-medium">{selectedCar?.pricePerDay?.toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="text-right">
                <p className="text-zinc-400 text-xs font-body">Tổng tiền</p>
                <p className="font-heading text-3xl font-bold text-brand tracking-tight">
                  {preview.totalAmount?.toLocaleString("vi-VN")}₫
                </p>
              </div>
            </div>
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
          <IconSave size={16} className="text-white" /> {loading ? "Đang lưu..." : isEdit ? "Cập nhật booking" : "Tạo booking"}
        </button>
      </form>
    </div>
  );
}
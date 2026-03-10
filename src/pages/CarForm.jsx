import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { carService } from "../services/api";
import { PageHeader, FormField } from "../components/UI";
import { IconArrowLeft, IconSave, IconImage } from "../components/Icons";

const INITIAL = {
  carNumber: "",
  capacity: "",
  status: "available",
  pricePerDay: "",
  features: [],
  image: "",
};

export default function CarForm() {
  const { carNumber } = useParams();
  const isEdit = Boolean(carNumber);
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL);
  const [featureInput, setFeatureInput] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    carService.getOne(carNumber)
      .then((res) => {
        const c = res.data;
        setForm({
          carNumber: c.carNumber,
          capacity: c.capacity,
          status: c.status,
          pricePerDay: c.pricePerDay,
          features: c.features || [],
          image: c.image || "",
        });
      })
      .catch(() => toast.error("Không tải được thông tin xe"))
      .finally(() => setFetching(false));
  }, [carNumber, isEdit]);

  const validate = () => {
    const e = {};
    if (!form.carNumber.trim()) e.carNumber = "Vui lòng nhập biển số xe";
    if (!form.capacity || form.capacity < 1) e.capacity = "Sức chứa phải >= 1";
    if (!form.pricePerDay || form.pricePerDay < 0) e.pricePerDay = "Giá phải >= 0";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const addFeature = () => {
    const val = featureInput.trim();
    if (val && !form.features.includes(val)) {
      setForm((prev) => ({ ...prev, features: [...prev.features, val] }));
      setFeatureInput("");
    }
  };

  const removeFeature = (f) =>
    setForm((prev) => ({ ...prev, features: prev.features.filter((x) => x !== f) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const payload = {
      ...form,
      capacity: Number(form.capacity),
      pricePerDay: Number(form.pricePerDay),
    };
    try {
      if (isEdit) {
        await carService.update(carNumber, payload);
        toast.success("Cập nhật xe thành công");
      } else {
        await carService.create(payload);
        toast.success("Thêm xe thành công");
      }
      navigate("/cars");
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

  return (
    <div className="animate-slide-up max-w-2xl">
      <PageHeader
        title={isEdit ? "Sửa xe" : "Thêm xe"}
        subtitle={isEdit ? `Đang sửa: ${carNumber}` : "Thêm xe mới vào hệ thống"}
        action={
          <button onClick={() => navigate("/cars")} className="btn-ghost">
            <IconArrowLeft size={16} className="text-zinc-400" /> Quay lại
          </button>
        }
      />

      <form onSubmit={handleSubmit} className="card space-y-5">
        {/* Image preview */}
        <FormField label="URL Ảnh xe">
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            className="input-field"
            placeholder="https://example.com/car.jpg"
          />
          {form.image ? (
            <img
              src={form.image}
              alt="preview"
              className="mt-3 w-full h-48 object-cover rounded-xl border border-zinc-700/50"
              onError={(e) => { e.target.style.display = "none"; }}
            />
          ) : (
            <div className="mt-3 w-full h-48 bg-zinc-800/40 border border-zinc-700/40 rounded-xl flex flex-col items-center justify-center text-zinc-600 gap-2">
              <IconImage size={36} className="text-zinc-600" />
              <span className="text-xs font-body">Chưa có ảnh</span>
            </div>
          )}
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Biển số xe *" error={errors.carNumber}>
            <input
              name="carNumber"
              value={form.carNumber}
              onChange={handleChange}
              disabled={isEdit}
              className={`input-field ${isEdit ? "opacity-50 cursor-not-allowed" : ""}`}
              placeholder="51A-12345"
            />
          </FormField>

          <FormField label="Sức chứa (chỗ) *" error={errors.capacity}>
            <input
              name="capacity"
              type="number"
              min="1"
              value={form.capacity}
              onChange={handleChange}
              className="input-field"
              placeholder="7"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Trạng thái">
            <select name="status" value={form.status} onChange={handleChange} className="input-field">
              <option value="available">Sẵn sàng</option>
              <option value="rented">Đang thuê</option>
              <option value="maintenance">Bảo trì</option>
            </select>
          </FormField>

          <FormField label="Giá / ngày (₫) *" error={errors.pricePerDay}>
            <input
              name="pricePerDay"
              type="number"
              min="0"
              value={form.pricePerDay}
              onChange={handleChange}
              className="input-field"
              placeholder="500000"
            />
          </FormField>
        </div>

        {/* Features */}
        <FormField label="Tính năng">
          <div className="flex gap-2 mb-2">
            <input
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
              className="input-field flex-1"
              placeholder="GPS, automatic, ... rồi Enter"
            />
            <button type="button" onClick={addFeature} className="btn-ghost px-4">
              Thêm
            </button>
          </div>
          {form.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.features.map((f) => (
                <span
                  key={f}
                  className="flex items-center gap-1.5 bg-zinc-800/60 border border-zinc-700/40 text-zinc-300 text-xs px-3 py-1.5 rounded-lg font-body"
                >
                  {f}
                  <button
                    type="button"
                    onClick={() => removeFeature(f)}
                    className="text-zinc-500 hover:text-red-400 leading-none transition-colors"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </FormField>

        <div className="pt-2">
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
            <IconSave size={16} className="text-white" /> {loading ? "Đang lưu..." : isEdit ? "Cập nhật xe" : "Thêm xe"}
          </button>
        </div>
      </form>
    </div>
  );
}
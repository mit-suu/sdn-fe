import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "../services/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      toast.error("Vui lòng điền tất cả các trường");
      return;
    }

    if (form.username.length < 3) {
      toast.error("Username phải có ít nhất 3 ký tự");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Mật khẩu không khớp");
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register({
        username: form.username,
        email: form.email,
        password: form.password,
      });

      toast.success("Đăng ký thành công!");
      navigate("/login");
    } catch (error) {
      const message = error.response?.data?.message || "Đăng ký thất bại";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4">
              <span className="text-3xl font-bold">
                <span className="text-brand">Car</span>
                <span className="text-zinc-100">Rental</span>
              </span>
            </div>
            <h1 className="text-2xl font-bold text-zinc-100 mb-2">Đăng Ký</h1>
            <p className="text-zinc-400 text-sm">
              Tạo tài khoản mới
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Tên tài khoản
              </label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="nguyenvana"
                className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/30 transition-all"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Tối thiểu 3 ký tự
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="nguyenvana@example.com"
                className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/30 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••"
                className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/30 transition-all"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Tối thiểu 6 ký tự
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••"
                className="w-full px-4 py-2.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/30 transition-all"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-brand/90 disabled:bg-zinc-700 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 mt-6"
            >
              {loading ? "Đang đăng ký..." : "Đăng Ký"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-700/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-zinc-900/50 text-zinc-500">Hoặc</span>
            </div>
          </div>

          {/* Login Link */}
          <p className="text-center text-zinc-400 text-sm">
            Đã có tài khoản?{" "}
            <button
              onClick={() => navigate("/auth/login")}
              className="text-brand hover:text-brand/80 font-semibold transition-colors"
            >
              Đăng nhập
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

import { IconImageOff } from "./Icons";

// ── StatusBadge ──────────────────────────────────────
export function StatusBadge({ status }) {
  const map = {
    available: { cls: "badge-available", dot: "bg-emerald-400", label: "Sẵn sàng" },
    rented: { cls: "badge-rented", dot: "bg-orange-400", label: "Đang thuê" },
    maintenance: { cls: "badge-maintenance", dot: "bg-red-400", label: "Bảo trì" },
  };
  const s = map[status] || map.available;
  return (
    <span className={s.cls}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} inline-block`} />
      {s.label}
    </span>
  );
}

// ── PageHeader ────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="font-heading text-3xl font-bold text-zinc-100 tracking-tight">{title}</h1>
        {subtitle && <p className="text-zinc-500 text-sm mt-1.5 font-body">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// ── LoadingSpinner ────────────────────────────────────
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-2 border-zinc-700 border-t-brand rounded-full animate-spin" />
    </div>
  );
}

// ── EmptyState ────────────────────────────────────────
export function EmptyState({ message, action }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="w-16 h-16 rounded-2xl bg-zinc-800/60 border border-zinc-700/50 flex items-center justify-center mb-4 backdrop-blur-sm">
        <IconImageOff size={28} className="text-zinc-500" />
      </div>
      <p className="text-zinc-500 text-sm font-body">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ── ConfirmModal ──────────────────────────────────────
export function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-sm animate-slide-up shadow-2xl">
        {/* Warning icon */}
        <div className="w-12 h-12 rounded-2xl bg-red-900/30 border border-red-800/40 flex items-center justify-center mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h3 className="font-heading text-xl font-bold text-zinc-100 tracking-tight mb-2">{title}</h3>
        <p className="text-zinc-400 text-sm mb-6 font-body leading-relaxed">{message}</p>
        <div className="flex gap-3 justify-end">
          <button className="btn-ghost" onClick={onCancel}>Huỷ</button>
          <button className="btn-danger" onClick={onConfirm}>Xác nhận xoá</button>
        </div>
      </div>
    </div>
  );
}

// ── FormField ─────────────────────────────────────────
export function FormField({ label, error, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1.5 font-body">{error}</p>}
    </div>
  );
}
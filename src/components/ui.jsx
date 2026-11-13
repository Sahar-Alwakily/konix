export function Icon({ name, className = "" }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

export function Stat({ icon, label, value, hint, tone = "orange" }) {
  const tones = {
    orange: "bg-wash text-primary-container",
    purple: "bg-secondary-fixed text-secondary",
    green: "bg-tertiary-fixed/40 text-tertiary",
    ink: "bg-surface-container-low text-on-surface",
  };
  return (
    <article className="card p-4 flex flex-col gap-3 min-h-[148px]">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] text-muted font-semibold">{label}</p>
        <span className={`w-10 h-10 rounded-xl grid place-items-center ${tones[tone]}`}>
          <Icon name={icon} />
        </span>
      </div>
      <p className="text-[28px] font-extrabold nums leading-none text-ink">{value}</p>
      <p className="text-[12px] text-muted leading-5">{hint}</p>
    </article>
  );
}

export function Badge({ children, tone = "ok" }) {
  const tones = {
    ok: "text-[#065F46] bg-[#ECFDF5] border-[#A7F3D0]",
    low: "text-[#92400E] bg-[#FFFBEB] border-[#FDE68A]",
    out: "text-[#991B1B] bg-[#FEF2F2] border-[#FECACA]",
    info: "text-[#5B21B6] bg-[#F3F0FF] border-[#DDD6FE]",
    muted: "text-muted bg-[#F9FAFB] border-line",
  };
  return <span className={`inline-flex items-center h-6 px-2.5 rounded-full border text-[10px] font-bold ${tones[tone]}`}>{children}</span>;
}

export function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[80] bg-[rgba(17,24,39,0.4)] grid place-items-center p-4" onClick={onClose}>
      <div className="card w-full max-w-lg p-5 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[18px] font-bold">{title}</h3>
          <button type="button" onClick={onClose} className="w-9 h-9 rounded-lg hover:bg-surface-container-low">
            <Icon name="close" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <label className="block text-right mb-3">
      <span className="block text-[12px] font-bold text-muted mb-1">{label}</span>
      {children}
    </label>
  );
}

export const fieldClass = "w-full h-[42px] px-3 rounded-lg border border-line bg-white text-[14px] focus:border-primary-container focus:shadow-[0_0_0_3px_rgba(255,122,0,0.15)] outline-none";

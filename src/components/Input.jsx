export function Input({ label, error, className = '', ...props }) {
  return (
    <label className="block space-y-2 text-sm">
      {label && <span className="font-medium text-stone-200">{label}</span>}
      <input
        className={`w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-stone-100 placeholder:text-stone-500 focus:border-leather-accent focus:outline-none ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </label>
  );
}

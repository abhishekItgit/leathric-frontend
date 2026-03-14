export function Input({ label, error, className = '', ...props }) {
  return (
    <label className="block space-y-2 text-sm">
      {label && <span className="form-label">{label}</span>}
      <input className={`form-input ${className}`} {...props} />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </label>
  );
}

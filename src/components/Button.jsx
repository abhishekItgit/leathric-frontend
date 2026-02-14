export function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-leather-900';

  const variants = {
    primary: 'bg-leather-accent text-black hover:brightness-110 focus:ring-leather-accent',
    outline: 'border border-white/20 text-stone-100 hover:bg-white/10 focus:ring-white/20',
    ghost: 'text-stone-300 hover:bg-white/10 focus:ring-white/20',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

import { motion } from 'framer-motion';

export function Button({
  children,
  variant = 'primary',
  className = '',
  loading = false,
  disabled = false,
  ...props
}) {
  const base =
    'rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-leather-900 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-leather-accent text-black hover:brightness-110 focus:ring-leather-accent disabled:hover:brightness-100',
    secondary: 'border border-white/20 text-stone-100 hover:bg-white/10 focus:ring-white/20',
    ghost: 'text-stone-300 hover:bg-white/10 focus:ring-white/20',
    danger: 'bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30 focus:ring-red-500/50',
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="inline-block"
          >
            ⟳
          </motion.span>
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}

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
    'rounded-lg px-5 py-2.5 text-sm font-semibold tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-leather-cream disabled:cursor-not-allowed disabled:opacity-50';

  const variants = {
    primary: 'bg-leather-950 text-leather-cream hover:bg-leather-accent hover:text-leather-950 focus:ring-leather-accent',
    secondary: 'border border-leather-700/30 bg-white/70 text-leather-900 hover:border-leather-accent/70 hover:bg-white focus:ring-leather-700/30',
    ghost: 'text-leather-900 hover:bg-leather-950/5 focus:ring-leather-700/20',
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

import { motion } from 'framer-motion';

export function GradientButton({ children, className = '', variant = 'gold', ...props }) {
  const variantStyles =
    variant === 'ghost'
      ? 'border border-leather-700/35 text-leather-900 bg-white/70 hover:border-leather-accent hover:text-leather-accent'
      : 'bg-leather-950 text-leather-cream hover:bg-leather-accent hover:text-leather-950';

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25 }}
      className={`rounded-lg px-6 py-3 text-sm font-semibold tracking-[0.08em] shadow-[0_10px_24px_rgba(15,23,42,0.14)] transition ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

import { motion } from 'framer-motion';

export function GradientButton({ children, className = '', variant = 'gold', ...props }) {
  const variantStyles =
    variant === 'ghost'
      ? 'border border-[#C8A36A]/60 text-[#EDEDED] bg-white/5 hover:bg-white/10'
      : 'bg-gradient-to-r from-[#C8A36A] to-[#b4874c] text-black hover:brightness-110';

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.25 }}
      className={`rounded-full px-6 py-3 text-sm font-semibold tracking-wide shadow-[0_12px_30px_rgba(0,0,0,0.35)] transition ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

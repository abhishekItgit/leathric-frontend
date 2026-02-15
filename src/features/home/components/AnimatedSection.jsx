import { motion } from 'framer-motion';

export function AnimatedSection({ className = '', children, delay = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

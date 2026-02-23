import { motion } from 'framer-motion';

export function AnimatedTitle({ eyebrow, title, description, align = 'left' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={align === 'center' ? 'text-center' : ''}
    >
      {eyebrow ? <p className="text-xs uppercase tracking-[0.28em] text-leather-accent">{eyebrow}</p> : null}
      <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-leather-950 md:text-5xl">{title}</h2>
      {description ? <p className="mt-5 max-w-2xl text-sm leading-relaxed text-leather-800 md:text-base">{description}</p> : null}
    </motion.div>
  );
}

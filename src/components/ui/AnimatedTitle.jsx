import { motion } from 'framer-motion';

export function AnimatedTitle({ eyebrow, title, description, align = 'left' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={align === 'center' ? 'text-center' : ''}
    >
      {eyebrow ? <p className="text-xs uppercase tracking-[0.25em] text-[#C8A36A]">{eyebrow}</p> : null}
      <h2 className="mt-3 text-3xl font-semibold leading-tight text-[#EDEDED] md:text-5xl">{title}</h2>
      {description ? <p className="mt-4 max-w-2xl text-sm text-stone-300 md:text-base">{description}</p> : null}
    </motion.div>
  );
}

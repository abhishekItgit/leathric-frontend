import { motion } from 'framer-motion';
import { SectionContainer } from '../../../components/ui/SectionContainer';

const points = [
  'Handcrafted in India',
  'Full Grain Leather',
  'Lifetime Craft Guarantee',
  'Free Shipping PAN India',
];

export function TrustStrip() {
  return (
    <SectionContainer className="pt-6">
      <div className="grid gap-3 rounded-2xl border border-leather-700/20 bg-[#f3efe7] p-4 md:grid-cols-4">
        {points.map((point, idx) => (
          <motion.div
            key={point}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: idx * 0.08 }}
            className="flex items-center gap-3 rounded-xl border border-white/70 bg-white/70 px-4 py-3"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-leather-accent/60 text-leather-accent">✦</span>
            <p className="text-sm text-leather-900">{point}</p>
          </motion.div>
        ))}
      </div>
    </SectionContainer>
  );
}

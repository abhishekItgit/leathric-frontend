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
      <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:grid-cols-4">
        {points.map((point, idx) => (
          <motion.div
            key={point}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: idx * 0.08 }}
            className="flex items-center gap-3 rounded-xl bg-black/30 px-4 py-3"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#C8A36A]/60 text-[#C8A36A]">✦</span>
            <p className="text-sm text-stone-100">{point}</p>
          </motion.div>
        ))}
      </div>
    </SectionContainer>
  );
}

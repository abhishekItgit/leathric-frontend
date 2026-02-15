import { motion } from 'framer-motion';
import { AnimatedTitle } from '../../../components/ui/AnimatedTitle';
import { SectionContainer } from '../../../components/ui/SectionContainer';

const timeline = ['Design', 'Cut', 'Stitch', 'Finish'];

export function BrandStory() {
  return (
    <SectionContainer className="pt-20">
      <section className="rounded-[2rem] border border-white/10 bg-[#111] p-8 md:p-12">
        <AnimatedTitle eyebrow="Craftsmanship" title="Our Craft is Our Signature" align="center" />
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {timeline.map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative rounded-2xl border border-white/10 bg-black/30 p-5 text-center"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-[#C8A36A]/60 text-[#C8A36A]">{index + 1}</div>
              <p className="font-medium text-[#EDEDED]">{item}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </SectionContainer>
  );
}

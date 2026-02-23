import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GradientButton } from '../../../components/ui/GradientButton';
import { SectionContainer } from '../../../components/ui/SectionContainer';

export function Hero() {
  return (
    <SectionContainer className="pt-8 md:pt-12">
      <section className="relative overflow-hidden rounded-[2rem] border border-leather-700/20 bg-gradient-to-br from-[#fbf9f5] via-[#f7f2ea] to-[#efe9e0] p-6 md:p-12">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-leather-accent">WalkEra Signature Collection</p>
            <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-leather-950 md:text-6xl">Step Into the New Era.</h1>
            <p className="max-w-lg text-base text-leather-800 md:text-lg">Luxury leather shoes, belts, and essentials defined by modern confidence and timeless craft.</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/products">
                <GradientButton>Shop Collection</GradientButton>
              </Link>
              <Link to="/our-story">
                <GradientButton variant="ghost">Explore Craftsmanship</GradientButton>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="group relative"
          >
            <motion.img
              src="https://images.unsplash.com/photo-1548032885-b5e38734688a?auto=format&fit=crop&w=1600&q=80"
              alt="Luxury leather product"
              className="h-[460px] w-full rounded-[1.6rem] object-cover shadow-[0_18px_40px_rgba(59,47,47,0.24)]"
              loading="lazy"
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ duration: 0.5 }}
            />
            <div className="pointer-events-none absolute inset-0 rounded-[1.6rem] bg-gradient-to-t from-leather-950/40 via-leather-950/5 to-transparent" />
            <div className="absolute bottom-6 left-6 rounded-2xl border border-white/65 bg-white/70 p-4 text-sm backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.2em] text-leather-accent">Atelier Drop</p>
              <p className="mt-1 text-leather-950">Full-grain leather with handcrafted finish.</p>
            </div>
          </motion.div>
        </div>
      </section>
    </SectionContainer>
  );
}

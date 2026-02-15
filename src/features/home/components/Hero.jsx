import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GradientButton } from '../../../components/ui/GradientButton';
import { SectionContainer } from '../../../components/ui/SectionContainer';

export function Hero() {
  return (
    <SectionContainer className="pt-8 md:pt-12">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#171717] via-[#111] to-[#0B0B0B] p-6 md:p-10">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
            <p className="text-xs uppercase tracking-[0.28em] text-[#C8A36A]">Leathric Signature Collection</p>
            <h1 className="text-4xl font-semibold leading-tight text-[#EDEDED] md:text-6xl">Crafted to Age Beautifully.</h1>
            <p className="max-w-lg text-base text-stone-300 md:text-lg">Premium leather essentials designed for modern India.</p>
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
              className="h-[460px] w-full rounded-[1.6rem] object-cover"
              loading="lazy"
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ duration: 0.5 }}
            />
            <div className="pointer-events-none absolute inset-0 rounded-[1.6rem] bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 rounded-2xl border border-white/20 bg-white/10 p-4 text-sm backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.2em] text-[#C8A36A]">Atelier Drop</p>
              <p className="mt-1 text-[#EDEDED]">Full-grain leather with handcrafted finish.</p>
            </div>
          </motion.div>
        </div>
      </section>
    </SectionContainer>
  );
}

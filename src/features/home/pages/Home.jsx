import { motion } from 'framer-motion';
import { Hero } from '../components/Hero';
import { TrustStrip } from '../components/TrustStrip';
import { ProductGrid } from '../components/ProductGrid';
import { BrandStory } from '../components/BrandStory';
import { PremiumCTA } from '../components/PremiumCTA';
import { AnimatedTitle } from '../../../components/ui/AnimatedTitle';
import { SectionContainer } from '../../../components/ui/SectionContainer';
import { AnimatedSection } from '../components/AnimatedSection';

const featuredCraftImages = [
  {
    src: 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=1200&q=80',
    alt: 'Hand-stitched full-grain leather wallet',
  },
  {
    src: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=1200&q=80',
    alt: 'Plain leather ankle boots without visible brand marks',
  },
  {
    src: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80',
    alt: 'Classic leather dress shoes with no logo branding',
  },
];

export function Home({ products, loading, error, refetch, onAddToCart }) {
  return (
    <div className="pb-10">
      <Hero />
      <TrustStrip />

      <AnimatedSection className="pt-16">
        <SectionContainer>
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="grid grid-cols-2 gap-3">
              {featuredCraftImages.map((image, idx) => (
                <motion.img
                  key={image.src}
                  src={image.src}
                  loading="lazy"
                  alt={image.alt}
                  className={`w-full rounded-2xl object-cover ${idx === 0 ? 'col-span-2 h-64' : 'h-48'}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                />
              ))}
            </div>
            <div>
              <AnimatedTitle
                eyebrow="Heritage Process"
                title="From Raw Hide to Heritage"
                description="Every piece passes through artisan hands with precision-led patterning, clean skiving, and edge finishing that matures beautifully over time."
              />
            </div>
          </div>
        </SectionContainer>
      </AnimatedSection>

      <ProductGrid products={products} loading={loading} error={error} refetch={refetch} onAddToCart={onAddToCart} />
      <BrandStory />
      <PremiumCTA />
    </div>
  );
}

import { motion } from 'framer-motion';
import { ProductCard } from '../../products/components/ProductCard';
import { LoadingSkeleton } from '../../../components/LoadingSkeleton';
import { ErrorState } from '../../../components/ErrorState';
import { AnimatedTitle } from '../../../components/ui/AnimatedTitle';
import { SectionContainer } from '../../../components/ui/SectionContainer';

export function ProductGrid({
  products,
  loading,
  error,
  refetch,
  onAddToCart,
  onWishlistToggle,
  isInWishlist,
}) {
  return (
    <SectionContainer className="pt-16">
      <AnimatedTitle
        eyebrow="Featured Collection"
        title="Built for Daily Carry, Styled for Legacy"
        description="Premium silhouettes engineered for utility with a quiet luxury finish."
      />

      <div className="mt-8">
        {error ? <ErrorState message={error} onRetry={refetch} /> : null}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <LoadingSkeleton key={index} className="h-[380px]" />
            ))}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="show"
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {products.slice(0, 6).map((product) => (
              <motion.div
                key={product.id}
                variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  onWishlistToggle={onWishlistToggle}
                  isInWishlist={isInWishlist?.(product.id) || false}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </SectionContainer>
  );
}

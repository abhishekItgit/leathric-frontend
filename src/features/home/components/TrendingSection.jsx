import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ProductCard } from '../../products/components/ProductCard';
import { LoadingSkeleton } from '../../../components/LoadingSkeleton';
import { AnimatedTitle } from '../../../components/ui/AnimatedTitle';
import { SectionContainer } from '../../../components/ui/SectionContainer';
import { productApi } from '../../../services/productApiService';
import { useWishlist } from '../../../context/WishlistContext';
import { useCart } from '../../cart/hooks/useCart';
import { useToast } from '../../../components/ui/Toast';

export function TrendingSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const data = await productApi.getTrendingProducts({ limit: 6 });
        setProducts(data.data || []);
      } catch (err) {
        console.error('Failed to load trending products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTrending();
  }, []);

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1);
      addToast(`${product.name} added to cart!`, 'success');
    } catch (err) {
      addToast('Failed to add item to cart. Please try again.', 'error');
    }
  };

  const handleWishlist = async (productId) => {
    try {
      await toggleWishlist(productId);
      addToast(
        isInWishlist(productId) ? 'Removed from wishlist' : 'Added to wishlist',
        'success'
      );
    } catch (err) {
      addToast('Please log in to use wishlist', 'error');
    }
  };

  return (
    <SectionContainer className="py-16">
      <AnimatedTitle
        eyebrow="Trending Now"
        title="Most Loved by Our Community"
        description="Discover what other leather enthusiasts are passionate about."
      />

      <div className="mt-8">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <LoadingSkeleton key={idx} className="h-[380px]" />
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
            {products.map((product) => (
              <motion.div
                key={product.id}
                variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  onWishlistToggle={handleWishlist}
                  isInWishlist={isInWishlist(product.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="mt-10 text-center">
          <Link to="/products">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full border-2 border-leather-accent text-leather-accent font-semibold hover:bg-leather-accent/10 transition"
            >
              View All Products →
            </motion.button>
          </Link>
        </div>
      </div>
    </SectionContainer>
  );
}

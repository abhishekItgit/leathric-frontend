import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Rating } from '../../../components/ui/Rating';

function ProductCardBase({
  product,
  onAddToCart,
  onWishlistToggle,
  isInWishlist = false,
}) {
  const handleAdd = useCallback(() => {
    if (typeof onAddToCart === 'function') {
      onAddToCart(product);
    }
  }, [onAddToCart, product]);

  const handleWishlist = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onWishlistToggle?.(product.id);
  }, [onWishlistToggle, product.id]);

  return (
    <motion.article
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ duration: 0.35 }}
      className="group relative overflow-hidden rounded-3xl border border-leather-700/20 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.12)] transition-shadow hover:shadow-[0_20px_40px_rgba(15,23,42,0.16)]"
    >
      <div className="relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-72 w-full object-cover transition duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badge */}
        <span className="absolute left-4 top-4 rounded-full bg-leather-accent px-3 py-1 text-xs font-semibold text-leather-950">
          Signature
        </span>

        {/* Wishlist Button */}
        {onWishlistToggle && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWishlist}
            className="absolute right-4 top-4 rounded-full bg-white/85 p-2 backdrop-blur transition hover:bg-leather-accent group-hover:opacity-100"
          >
            <span className={`text-lg ${isInWishlist ? 'text-leather-950' : 'text-leather-800'}`}>
              {isInWishlist ? '♥' : '♡'}
            </span>
          </motion.button>
        )}

        {/* Add to Cart Button */}
        {typeof onAddToCart === 'function' && (
          <button
            onClick={handleAdd}
            className="absolute bottom-4 right-4 rounded-lg bg-leather-950 px-4 py-2 text-xs font-semibold tracking-wide text-leather-cream opacity-0 transition duration-300 hover:bg-leather-accent hover:text-leather-950 group-hover:opacity-100"
          >
            Add to Cart
          </button>
        )}
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-leather-950">{product.name}</h3>
            {product.rating && (
              <div className="mt-1">
                <Rating value={product.rating} readOnly size="sm" />
              </div>
            )}
          </div>
          <span className="whitespace-nowrap text-sm font-semibold text-leather-700">
            ₹{product.price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-leather-800">{product.description}</p>
        <Link
          to={`/products/${product.id}`}
          className="inline-flex items-center text-sm text-leather-900 transition hover:text-leather-accent"
        >
          View Details →
        </Link>
      </div>
    </motion.article>
  );
}

export const ProductCard = memo(ProductCardBase);

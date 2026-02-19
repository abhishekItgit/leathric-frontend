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
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#171717] to-[#111] shadow-[0_12px_32px_rgba(0,0,0,0.38)]"
    >
      <div className="relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-72 w-full object-cover transition duration-700 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badge */}
        <span className="absolute left-4 top-4 rounded-full bg-[#C8A36A] px-3 py-1 text-xs font-semibold text-black">
          Signature
        </span>

        {/* Wishlist Button */}
        {onWishlistToggle && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWishlist}
            className="absolute right-4 top-4 rounded-full bg-black/80 p-2 backdrop-blur transition hover:bg-[#C8A36A] group-hover:opacity-100"
          >
            <span className={`text-lg ${isInWishlist ? 'text-[#C8A36A]' : 'text-white'}`}>
              {isInWishlist ? '♥' : '♡'}
            </span>
          </motion.button>
        )}

        {/* Add to Cart Button */}
        {typeof onAddToCart === 'function' && (
          <button
            onClick={handleAdd}
            className="absolute bottom-4 right-4 rounded-full bg-black/80 px-4 py-2 text-xs font-semibold text-white opacity-0 backdrop-blur transition duration-300 hover:bg-[#C8A36A] hover:text-black group-hover:opacity-100"
          >
            Add to Cart
          </button>
        )}
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-[#EDEDED]">{product.name}</h3>
            {product.rating && (
              <div className="mt-1">
                <Rating value={product.rating} readOnly size="sm" />
              </div>
            )}
          </div>
          <span className="text-sm font-semibold text-[#C8A36A] whitespace-nowrap">
            ₹{product.price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-stone-400">{product.description}</p>
        <Link
          to={`/products/${product.id}`}
          className="inline-flex items-center text-sm text-stone-200 hover:text-[#C8A36A]"
        >
          View Details →
        </Link>
      </div>
    </motion.article>
  );
}

export const ProductCard = memo(ProductCardBase);

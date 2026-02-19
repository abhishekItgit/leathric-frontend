import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { ImageGallery } from '../components/ui/ImageGallery';
import { Rating } from '../components/ui/Rating';
import { useCart } from '../features/cart/hooks/useCart';
import { useProduct } from '../features/products/hooks/useProducts';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../components/ui/Toast';
import { productApi } from '../services/productApiService';

export function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { product, loading, error, refetch } = useProduct(id);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [userReview, setUserReview] = useState('');
  const [userRating, setUserRating] = useState(5);

  // Load reviews and related products
  useEffect(() => {
    if (!id || loading) return;

    const loadData = async () => {
      try {
        setLoadingReviews(true);
        const [reviewsData, relatedData] = await Promise.all([
          productApi.getProductReviews(id),
          productApi.getRelatedProducts(id),
        ]);
        setReviews(reviewsData.data || []);
        setRelatedProducts(relatedData.data || []);
      } catch (err) {
        console.error('Failed to load reviews/related products:', err);
      } finally {
        setLoadingReviews(false);
      }
    };

    loadData();
  }, [id, loading]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate(`/signin?redirect=${encodeURIComponent(`/products/${id}`)}`);
      return;
    }

    try {
      await addItem(product, quantity, selectedVariant);
      addToast('Added to cart!', 'success');
      setQuantity(1);
    } catch (err) {
      addToast('Failed to add to cart', 'error');
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      navigate(`/signin?redirect=${encodeURIComponent(`/products/${id}`)}`);
      return;
    }

    try {
      await toggleWishlist(id);
      addToast(
        isInWishlist(id) ? 'Removed from wishlist' : 'Added to wishlist',
        'success'
      );
    } catch (err) {
      addToast('Failed to update wishlist', 'error');
    }
  };

  const handleSubmitReview = async () => {
    if (!isAuthenticated) {
      navigate(`/signin?redirect=${encodeURIComponent(`/products/${id}`)}`);
      return;
    }

    if (!userReview.trim()) {
      addToast('Please write a review', 'warning');
      return;
    }

    try {
      await productApi.createProductReview(id, {
        rating: userRating,
        comment: userReview,
      });
      addToast('Review submitted successfully!', 'success');
      setUserReview('');
      setUserRating(5);
      // Reload reviews
      const updatedReviews = await productApi.getProductReviews(id);
      setReviews(updatedReviews.data || []);
    } catch (err) {
      addToast('Failed to submit review', 'error');
    }
  };

  if (loading) return <LoadingSkeleton className="h-[600px]" />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!product) return <div className="panel p-10 text-center">Product not found.</div>;

  const images = [
    { src: product.imageUrl },
    ...(product.galleryImages || []).map((img) => ({ src: img })),
  ];

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-12">
      {/* Product Details Section */}
      <section className="grid gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <div>
          <ImageGallery images={images} alt={product.name} />
        </div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Category Badge */}
          <span className="inline-block rounded-full border border-leather-accent px-4 py-2 text-xs font-semibold uppercase tracking-wider text-leather-accent">
            {product.category}
          </span>

          {/* Title and Price */}
          <div>
            <h1 className="text-4xl font-bold leading-tight">{product.name}</h1>
            <p className="mt-2 text-stone-400">{product.description}</p>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Rating value={parseFloat(avgRating)} readOnly showCount size="md" reviewCount={reviews.length} />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <p className="text-4xl font-bold text-leather-accent">₹{product.price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            {product.originalPrice && product.originalPrice > product.price && (
              <p className="text-sm text-stone-400 line-through">
                ₹{product.originalPrice?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            )}
          </div>

          {/* Variant Selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold uppercase text-stone-400">
                Choose Variant
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {product.variants.map((variant) => (
                  <motion.button
                    key={variant.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedVariant(variant.id)}
                    className={`rounded-lg border-2 p-3 text-sm font-medium transition ${
                      selectedVariant === variant.id
                        ? 'border-leather-accent bg-leather-accent/10'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    {variant.name}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selection */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold uppercase text-stone-400">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-10 w-10 rounded-lg border border-white/20 hover:bg-white/10"
              >
                −
              </motion.button>
              <input
                type="number"
                min="1"
                max="10"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 rounded-lg border border-white/20 bg-transparent text-center"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="h-10 w-10 rounded-lg border border-white/20 hover:bg-white/10"
              >
                +
              </motion.button>
            </div>
          </div>

          {/* Delivery Info */}
          {product.deliveryEstimate && (
            <div className="rounded-lg bg-white/5 border border-white/10 p-4 space-y-2">
              <p className="text-sm font-semibold">📦 Delivery Information</p>
              <p className="text-sm text-stone-300">{product.deliveryEstimate}</p>
              {product.shippingCost && (
                <p className="text-xs text-stone-400">Shipping: ₹{product.shippingCost}</p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleAddToCart} className="flex-1">
              Add to Cart
            </Button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleWishlistToggle}
              className={`h-12 w-12 rounded-lg border-2 flex items-center justify-center text-xl transition ${
                isInWishlist(id)
                  ? 'border-leather-accent bg-leather-accent/10 text-leather-accent'
                  : 'border-white/20 text-white hover:border-white/40'
              }`}
            >
              {isInWishlist(id) ? '♥' : '♡'}
            </motion.button>
          </div>

          {/* Product Highlights */}
          {product.highlights && (
            <div className="space-y-2 border-t border-white/10 pt-6">
              <p className="text-sm font-semibold uppercase text-stone-400">Highlights</p>
              <ul className="space-y-2">
                {product.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-stone-300">
                    <span className="text-leather-accent">✓</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      </section>

      {/* Reviews Section */}
      <section className="space-y-6 border-t border-white/10 pt-12">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>

        {/* Write Review */}
        {isAuthenticated && (
          <div className="panel p-6 space-y-4">
            <h3 className="font-semibold">Share Your Review</h3>
            <div className="space-y-3">
              <div>
                <p className="mb-2 text-sm font-medium">Rating</p>
                <Rating value={userRating} onChange={setUserRating} size="lg" />
              </div>
              <textarea
                value={userReview}
                onChange={(e) => setUserReview(e.target.value)}
                placeholder="Tell other customers about your experience..."
                className="w-full h-32 rounded-lg bg-white/10 border border-white/20 p-4 text-white placeholder-stone-500"
              />
              <Button onClick={handleSubmitReview} className="w-full">
                Submit Review
              </Button>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {loadingReviews ? (
            <p className="text-center text-stone-400">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-center text-stone-400">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="panel p-4 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{review.userName || 'Anonymous'}</p>
                    <Rating value={review.rating || 0} readOnly size="sm" />
                  </div>
                  <p className="text-xs text-stone-400">{review.createdAt || 'Recently'}</p>
                </div>
                <p className="text-sm text-stone-300">{review.comment}</p>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 border-t border-white/10 pt-12">
          <h2 className="text-2xl font-bold">Related Products</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.slice(0, 4).map((related) => (
              <motion.div
                key={related.id}
                whileHover={{ y: -6 }}
                onClick={() => navigate(`/products/${related.id}`)}
                className="panel p-4 cursor-pointer space-y-3 hover:border-white/30 transition"
              >
                <img
                  src={related.imageUrl}
                  alt={related.name}
                  className="h-40 w-full rounded-lg object-cover"
                />
                <h3 className="font-semibold text-sm">{related.name}</h3>
                <p className="text-leather-accent font-bold">₹{related.price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

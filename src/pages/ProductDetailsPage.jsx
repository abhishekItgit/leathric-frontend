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

const benefits = [
  'Full-grain leather upper that ages with character',
  'Cushioned footbed for long office and event wear',
  'Breathable lining reduces all-day heat build-up',
  'Anti-slip outsole tuned for Indian roads and venues',
];

const trustBadges = [
  'Free shipping across India',
  '7-day easy return/exchange',
  'COD available',
  'Quality inspected before dispatch',
];

const faqs = [
  {
    q: 'How do I choose the right size?',
    a: 'Use our size guide and compare with your current formal shoe in CM. If you are between sizes, choose the larger size for comfort.',
  },
  {
    q: 'Can I return if fit is not right?',
    a: 'Yes, you can request a return or size exchange within 7 days from delivery, provided the product is unused and in original packaging.',
  },
  {
    q: 'Is the leather genuine?',
    a: 'Yes. Walkera uses genuine leather and each pair goes through quality checks for grain consistency, finish, and durability.',
  },
];

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
  const [showSizeGuide, setShowSizeGuide] = useState(false);

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

  const ensureAuth = () => {
    if (!isAuthenticated) {
      addToast('Please login to continue.', 'warning');
      navigate(`/signin?redirect=${encodeURIComponent(`/products/${id}`)}`);
      return false;
    }
    return true;
  };

  const handleAddToCart = async () => {
    if (!ensureAuth()) return;

    try {
      await addItem(product, quantity, selectedVariant);
      addToast('Added to cart!', 'success');
      setQuantity(1);
    } catch {
      addToast('Failed to add to cart', 'error');
    }
  };

  const handleWishlistToggle = async () => {
    if (!ensureAuth()) return;

    try {
      await toggleWishlist(id);
      addToast(isInWishlist(id) ? 'Removed from wishlist' : 'Added to wishlist', 'success');
    } catch (err) {
      addToast(err?.response?.data?.message || 'Failed to update wishlist', 'error');
    }
  };

  const handleSubmitReview = async () => {
    if (!ensureAuth()) return;
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
      const updatedReviews = await productApi.getProductReviews(id);
      setReviews(updatedReviews.data || []);
    } catch {
      addToast('Failed to submit review', 'error');
    }
  };

  if (loading) return <LoadingSkeleton className="h-[600px]" />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!product) return <div className="panel p-10 text-center">Product not found.</div>;

  const images = [{ src: product.imageUrl }, ...(product.galleryImages || []).map((img) => ({ src: img }))];

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : 0;

  const formattedPrice = product.price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-12 pb-24 md:pb-4">
      <section className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <ImageGallery images={images} alt={product.name} />
          <div className="grid grid-cols-2 gap-3 text-xs md:text-sm">
            {trustBadges.map((item) => (
              <div key={item} className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-stone-700">
                ✓ {item}
              </div>
            ))}
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <span className="inline-block rounded-full border border-[#c9a86a]/70 bg-[#f4ead8] px-4 py-1 text-xs font-semibold uppercase tracking-wide text-[#6f5123]">
            {product.category} · Premium Collection
          </span>

          <div>
            <h1 className="text-3xl font-semibold leading-tight text-stone-900 md:text-4xl">{product.name}</h1>
            <p className="mt-2 text-stone-600">{product.description}</p>
          </div>

          <Rating value={parseFloat(avgRating)} readOnly showCount size="md" reviewCount={reviews.length} />

          <div className="space-y-2 rounded-2xl border border-stone-200 bg-white p-5">
            <div className="flex items-end gap-3">
              <p className="text-4xl font-bold text-[#1d1914]">₹{formattedPrice}</p>
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="pb-1 text-sm text-stone-400 line-through">
                  ₹{product.originalPrice?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              )}
            </div>
            <p className="text-sm font-medium text-emerald-700">🔥 24 people viewed this in the last 3 hours</p>
            <p className="text-sm text-stone-600">Offer: Flat 10% off on prepaid orders + extra 5% on 2nd pair.</p>
            <p className="text-sm text-rose-700">Low stock alert: Only 3 left in popular sizes.</p>
          </div>

          <div className="space-y-3 rounded-2xl border border-stone-200 bg-white p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-stone-600">Benefits</p>
            <ul className="space-y-2">
              {benefits.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2 text-sm text-stone-700">
                  <span className="mt-0.5 text-[#6f5123]">✦</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold uppercase text-stone-500">Select Size</label>
                <button onClick={() => setShowSizeGuide((v) => !v)} className="text-sm font-semibold text-[#6f5123]">
                  {showSizeGuide ? 'Hide size guide' : 'Size guide'}
                </button>
              </div>
              {showSizeGuide && (
                <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 text-xs text-stone-700 md:text-sm">
                  UK 7 = 26 cm · UK 8 = 26.7 cm · UK 9 = 27.5 cm · UK 10 = 28.3 cm
                </div>
              )}
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant.id)}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      selectedVariant === variant.id
                        ? 'border-[#6f5123] bg-[#f4ead8] text-[#6f5123]'
                        : 'border-stone-300 bg-white hover:border-stone-500'
                    }`}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <label className="block text-sm font-semibold uppercase text-stone-500">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-10 w-10 rounded-lg border border-stone-300 bg-white hover:bg-stone-100"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max="10"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-16 rounded-lg border border-stone-300 bg-white text-center"
              />
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="h-10 w-10 rounded-lg border border-stone-300 bg-white hover:bg-stone-100"
              >
                +
              </button>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Button onClick={handleAddToCart} className="w-full">Add to Cart</Button>
            <button
              onClick={handleWishlistToggle}
              className="h-12 rounded-xl border border-stone-300 bg-white text-sm font-semibold text-stone-800 transition hover:border-stone-500"
            >
              {isInWishlist(id) ? '♥ Wishlisted' : '♡ Add to Wishlist'}
            </button>
          </div>
        </motion.div>
      </section>

      <section className="space-y-6 border-t border-stone-200 pt-12">
        <h2 className="text-2xl font-semibold text-stone-900">Customer Reviews</h2>

        {isAuthenticated && (
          <div className="panel space-y-4 p-6">
            <h3 className="font-semibold text-stone-900">Share Your Experience</h3>
            <div>
              <p className="mb-2 text-sm font-medium text-stone-700">Rating</p>
              <Rating value={userRating} onChange={setUserRating} size="lg" />
            </div>
            <textarea
              value={userReview}
              onChange={(e) => setUserReview(e.target.value)}
              placeholder="How was the comfort, fit, and finish?"
              className="h-32 w-full rounded-lg border border-stone-300 bg-white p-4 text-stone-900 placeholder:text-stone-400"
            />
            <Button onClick={handleSubmitReview} className="w-full">Submit Review</Button>
          </div>
        )}

        <div className="space-y-4">
          {loadingReviews ? (
            <p className="text-center text-stone-500">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-center text-stone-500">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((review, idx) => (
              <motion.div key={review.id || idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="panel space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-stone-900">{review.userName || 'Verified Buyer'}</p>
                    <Rating value={review.rating || 0} readOnly size="sm" />
                  </div>
                  <p className="text-xs text-stone-500">{review.createdAt || 'Recently'}</p>
                </div>
                <p className="text-sm text-stone-700">{review.comment}</p>
                <div className="flex gap-2">
                  {[0, 1].map((photo) => (
                    <div key={photo} className="h-16 w-16 rounded-lg bg-stone-100 text-[10px] text-stone-500 grid place-items-center">
                      Buyer Photo
                    </div>
                  ))}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>

      <section className="space-y-4 border-t border-stone-200 pt-10">
        <h2 className="text-2xl font-semibold text-stone-900">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((item) => (
            <details key={item.q} className="rounded-xl border border-stone-200 bg-white p-4">
              <summary className="cursor-pointer list-none font-semibold text-stone-900">{item.q}</summary>
              <p className="mt-2 text-sm text-stone-600">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="space-y-6 border-t border-stone-200 pt-12">
          <h2 className="text-2xl font-semibold text-stone-900">You may also like</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.slice(0, 4).map((related) => (
              <button
                key={related.id}
                onClick={() => navigate(`/products/${related.id}`)}
                className="panel cursor-pointer space-y-3 p-4 text-left transition hover:-translate-y-1"
              >
                <img src={related.imageUrl} alt={related.name} className="h-40 w-full rounded-lg object-cover" />
                <h3 className="font-semibold text-sm text-stone-900">{related.name}</h3>
                <p className="font-bold text-[#6f5123]">₹{related.price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-300 bg-white p-3 shadow-[0_-8px_25px_rgba(0,0,0,0.08)] md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-stone-500">Today&apos;s Price</p>
            <p className="text-lg font-bold text-[#1d1914]">₹{formattedPrice}</p>
          </div>
          <Button onClick={handleAddToCart} className="min-w-[180px]">Add to Cart</Button>
        </div>
      </div>
    </div>
  );
}

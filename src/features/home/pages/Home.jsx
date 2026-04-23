import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SectionContainer } from '../../../components/ui/SectionContainer';
import { AnimatedTitle } from '../../../components/ui/AnimatedTitle';
import { ProductCard } from '../../products/components/ProductCard';
import { LoadingSkeleton } from '../../../components/LoadingSkeleton';
import { ErrorState } from '../../../components/ErrorState';
import { useCart } from '../../cart/hooks/useCart';
import { useWishlist } from '../../../context/WishlistContext';
import { useToast } from '../../../components/ui/Toast';
import { useAuth } from '../../../hooks/useAuth';

const categoryBlocks = [
  {
    title: 'Office Icons',
    subtitle: 'Polished derbies and loafers built for 10-hour days.',
    cta: 'Shop Office',
    href: '/products?style=office',
    image:
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Wedding Statements',
    subtitle: 'Hand-finished silhouettes for sangeet to reception nights.',
    cta: 'Shop Wedding',
    href: '/products?style=wedding',
    image:
      'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Casual Luxe',
    subtitle: 'Weekend-ready leather essentials with elevated comfort.',
    cta: 'Shop Casual',
    href: '/products?style=casual',
    image:
      'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?auto=format&fit=crop&w=1200&q=80',
  },
];

const trustPills = [
  '4.8/5 average customer rating',
  'Free delivery in 2-5 days across India',
  'Easy 7-day returns + exchange',
  'COD available on eligible pin codes',
];

const testimonials = [
  {
    name: 'Rahul S., Bengaluru',
    quote:
      'These are the first premium shoes I can wear from office to dinner without switching. The finish still looks new after months.',
  },
  {
    name: 'Aman G., Delhi NCR',
    quote:
      'I bought Walkera for my wedding functions. Got compliments from everyone, and the comfort surprised me.',
  },
  {
    name: 'Vivek P., Mumbai',
    quote:
      'Packaging felt premium, delivery was quick, and leather quality is genuinely top-tier for the price.',
  },
];

const instagramFrames = [
  'https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1548032885-b5e38734688a?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80',
];

export function Home({ products, loading, error, refetch }) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      addToast('Please login to add items to cart.', 'warning');
      navigate(`/signin?redirect=${encodeURIComponent(`${location.pathname}${location.search}`)}`);
      return;
    }

    try {
      await addToCart(product, 1);
      addToast(`${product.name} added to cart!`, 'success');
    } catch {
      addToast('Failed to add item to cart. Please try again.', 'error');
    }
  };

  const handleWishlistToggle = async (productId) => {
    try {
      await toggleWishlist(productId);
      addToast(isInWishlist(productId) ? 'Removed from wishlist' : 'Added to wishlist', 'success');
    } catch (err) {
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        addToast('Please login to continue.', 'warning');
        navigate(`/signin?redirect=${encodeURIComponent(`${location.pathname}${location.search}`)}`);
        return;
      }

      addToast(err?.response?.data?.message || 'Failed to update wishlist', 'error');
    }
  };

  return (
    <div className="space-y-14 pb-14 md:space-y-20">
      <SectionContainer className="pt-6 md:pt-10">
        <section className="premium-surface relative overflow-hidden rounded-[2rem] border border-[#b08a53]/30 p-6 md:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,168,106,0.25),transparent_45%)]" />
          <div className="relative grid items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <span className="inline-flex rounded-full border border-[#c9a86a]/45 bg-white/70 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#5b4523]">
                Crafted in India · Premium Leather
              </span>
              <h1 className="text-4xl font-semibold leading-tight text-[#17120d] md:text-6xl">
                Walk Into Every Room Like You Own It.
              </h1>
              <p className="max-w-xl text-base text-stone-700 md:text-lg">
                Hand-finished leather footwear for men who value status, durability, and all-day comfort — from boardrooms to wedding nights.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate('/products')}
                  className="rounded-xl bg-[#1d1914] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2a231b]"
                >
                  Shop Now
                </button>
                <button
                  onClick={() => navigate('/our-story')}
                  className="rounded-xl border border-[#1d1914]/30 bg-white px-6 py-3 text-sm font-semibold text-[#1d1914] transition hover:border-[#1d1914]/60"
                >
                  Discover Craftsmanship
                </button>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {trustPills.map((item) => (
                  <p key={item} className="rounded-lg bg-white/80 px-3 py-2 text-sm text-stone-700">
                    ✓ {item}
                  </p>
                ))}
              </div>
            </div>
            <motion.img
              src="https://images.unsplash.com/photo-1548032885-b5e38734688a?auto=format&fit=crop&w=1300&q=80"
              alt="Walkera premium leather shoe"
              className="h-[460px] w-full rounded-[1.7rem] object-cover shadow-[0_24px_60px_rgba(28,22,15,0.25)]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            />
          </div>
        </section>
      </SectionContainer>

      <SectionContainer>
        <AnimatedTitle
          eyebrow="Shop by Occasion"
          title="Built Around Your Life"
          description="Find your perfect pair by how and where you wear it."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {categoryBlocks.map((item) => (
            <button
              key={item.title}
              onClick={() => navigate(item.href)}
              className="group overflow-hidden rounded-2xl border border-stone-200 bg-white text-left shadow-sm"
            >
              <img src={item.image} alt={item.title} className="h-56 w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="space-y-2 p-5">
                <p className="text-xl font-semibold text-stone-900">{item.title}</p>
                <p className="text-sm text-stone-600">{item.subtitle}</p>
                <p className="pt-2 text-sm font-semibold text-[#6d4f21]">{item.cta} →</p>
              </div>
            </button>
          ))}
        </div>
      </SectionContainer>

      <SectionContainer>
        <AnimatedTitle
          eyebrow="Best Sellers"
          title="Most Loved by Walkera Men"
          description="Top-rated picks this week, tagged for quick decision-making."
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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.slice(0, 6).map((product, idx) => (
                <div key={product.id} className="relative">
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-[#1d1914] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                    {idx < 2 ? 'Trending' : idx < 4 ? 'Bestseller' : 'Limited'}
                  </span>
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onWishlistToggle={handleWishlistToggle}
                    isInWishlist={isInWishlist?.(product.id) || false}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </SectionContainer>

      <SectionContainer>
        <div className="grid gap-6 rounded-3xl border border-stone-200 bg-white p-6 md:grid-cols-3 md:p-8">
          <div className="md:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7e5e2b]">Why Walkera</p>
            <h2 className="mt-3 text-3xl font-semibold text-stone-900">Luxury without guesswork.</h2>
          </div>
          <div className="grid gap-3 md:col-span-2 sm:grid-cols-2">
            {[
              '100% genuine leather with hand-finished detailing',
              'Comfort sole architecture for long-wear support',
              'Transparent pricing: premium quality, no inflated markups',
              'Dedicated support on WhatsApp for size and fit help',
            ].map((item) => (
              <div key={item} className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-700">
                {item}
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>

      <SectionContainer>
        <AnimatedTitle
          eyebrow="Real Customers"
          title="Trusted by 25,000+ Style-First Professionals"
          description="Authentic voices from office commutes, destination weddings, and daily city wear."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <p className="text-sm leading-relaxed text-stone-700">“{item.quote}”</p>
              <p className="mt-4 text-sm font-semibold text-stone-900">{item.name}</p>
            </article>
          ))}
        </div>
      </SectionContainer>

      <SectionContainer>
        <div className="rounded-3xl border border-stone-200 bg-[#15120e] p-6 text-white md:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#d7b885]">@walkeraofficial</p>
              <h3 className="mt-2 text-3xl font-semibold">Spotted on Instagram</h3>
            </div>
            <button
              onClick={() => window.open('https://instagram.com', '_blank', 'noopener,noreferrer')}
              className="rounded-xl border border-white/35 px-5 py-2 text-sm font-semibold hover:border-white/70"
            >
              Follow Us
            </button>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {instagramFrames.map((image, idx) => (
              <img key={idx} src={image} alt={`Walkera community ${idx + 1}`} className="h-44 w-full rounded-xl object-cover md:h-52" />
            ))}
          </div>
        </div>
      </SectionContainer>

      <SectionContainer>
        <div className="rounded-2xl border border-stone-200 bg-white p-6 text-center md:p-8">
          <p className="text-xs uppercase tracking-[0.24em] text-[#7e5e2b]">Walkera Promise</p>
          <h3 className="mt-2 text-2xl font-semibold text-stone-900">Premium leather. Clear policies. Zero anxiety checkout.</h3>
          <p className="mt-2 text-sm text-stone-600">Secure payments · COD support · Easy exchanges · Dedicated post-purchase care.</p>
        </div>
      </SectionContainer>
    </div>
  );
}

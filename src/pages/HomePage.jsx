import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { ProductCard } from '../components/ProductCard';
import { useCart } from '../hooks/useCart';
import { useProducts } from '../hooks/useProducts';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';

export function HomePage() {
  const { addToCart } = useCart();
  const { products, categories, loading, error, refetch } = useProducts();

  return (
    <div className="space-y-16">
      <section className="grid gap-8 rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top,#33271a,transparent_60%)] p-8 md:grid-cols-2 md:p-12">
        <div className="space-y-5 self-center animate-fadeInUp">
          <p className="text-sm uppercase tracking-[0.2em] text-leather-accent">Premium Craftsmanship</p>
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">Leather essentials made for a lifetime.</h1>
          <p className="max-w-md text-stone-300">
            Discover handcrafted bags, wallets, and apparel designed with precision, heritage, and timeless elegance.
          </p>
          <div className="flex gap-3">
            <Link to="/products">
              <Button>Shop Collection</Button>
            </Link>
            <Button variant="outline">Our Story</Button>
          </div>
        </div>
        <img
          className="h-80 w-full rounded-2xl object-cover shadow-premium"
          src="https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?auto=format&fit=crop&w=1200&q=80"
          alt="Leathric premium collection"
        />
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link to="/products" className="text-sm text-leather-accent">
            View all
          </Link>
        </div>

        {error && <ErrorState message={error} onRetry={refetch} />}

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <LoadingSkeleton key={index} className="h-[360px]" />
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <div key={category} className="panel p-6 text-center">
            <h3 className="font-semibold">{category}</h3>
            <p className="mt-1 text-sm text-stone-400">Curated premium leather {category.toLowerCase()}.</p>
          </div>
        ))}
      </section>

      <section className="panel flex flex-col items-center gap-4 p-8 text-center">
        <h3 className="text-3xl font-bold">Elevate your everyday carry.</h3>
        <p className="max-w-xl text-stone-300">Join Leathric members to access exclusive drops and private offers.</p>
        <Link to="/signup">
          <Button>Create account</Button>
        </Link>
      </section>
    </div>
  );
}

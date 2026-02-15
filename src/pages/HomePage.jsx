import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { ProductCard } from '../features/products/components/ProductCard';
import { useCart } from '../features/cart/hooks/useCart';
import { useProducts } from '../features/products/hooks/useProducts';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { Hero } from '../features/home/components/Hero';

export function HomePage() {
  const { addToCart } = useCart();
  const { products, categories, loading, error, refetch } = useProducts();

  return (
    <div className="space-y-16">
      <Hero />

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

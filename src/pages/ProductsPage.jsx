import { useEffect, useMemo, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Input } from '../components/Input';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { productService } from '../services/productService';
import { mockProducts } from './mockData';
import { useCart } from '../hooks/useCart';

const pageSize = 6;

export function ProductsPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('All');
  const [priceLimit, setPriceLimit] = useState('600');
  const [sortBy, setSortBy] = useState('featured');
  const [page, setPage] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await productService.getProducts();
      setProducts(data.products || data || mockProducts);
    } catch {
      setProducts(mockProducts);
      setError('Live API unavailable. Showing curated catalog preview.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let output = [...products];
    if (category !== 'All') output = output.filter((item) => item.category === category);
    output = output.filter((item) => Number(item.price) <= Number(priceLimit));

    if (sortBy === 'priceAsc') output.sort((a, b) => a.price - b.price);
    if (sortBy === 'priceDesc') output.sort((a, b) => b.price - a.price);
    if (sortBy === 'name') output.sort((a, b) => a.name.localeCompare(b.name));

    return output;
  }, [products, category, priceLimit, sortBy]);

  const paginated = filteredProducts.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));

  useEffect(() => {
    setPage(1);
  }, [category, priceLimit, sortBy]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Shop Leather Collection</h1>

      <div className="panel grid gap-4 p-4 md:grid-cols-4">
        <label className="space-y-2 text-sm">
          <span>Category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5">
            {['All', 'Bags', 'Wallets', 'Apparel', 'Accessories'].map((item) => (
              <option key={item} value={item} className="bg-leather-900">
                {item}
              </option>
            ))}
          </select>
        </label>
        <Input type="range" label={`Max Price: $${priceLimit}`} min="50" max="600" value={priceLimit} onChange={(e) => setPriceLimit(e.target.value)} />
        <label className="space-y-2 text-sm">
          <span>Sort</span>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5">
            <option value="featured" className="bg-leather-900">Featured</option>
            <option value="priceAsc" className="bg-leather-900">Price: Low to High</option>
            <option value="priceDesc" className="bg-leather-900">Price: High to Low</option>
            <option value="name" className="bg-leather-900">Name</option>
          </select>
        </label>
      </div>

      {error && <ErrorState message={error} onRetry={fetchProducts} />}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingSkeleton key={index} className="h-[360px]" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
          <div className="flex justify-center gap-2">
            <button disabled={page === 1} onClick={() => setPage((value) => value - 1)} className="rounded-xl border border-white/20 px-3 py-2 text-sm disabled:opacity-40">Prev</button>
            <span className="rounded-xl border border-white/20 px-3 py-2 text-sm">
              {page}/{totalPages}
            </span>
            <button disabled={page === totalPages} onClick={() => setPage((value) => value + 1)} className="rounded-xl border border-white/20 px-3 py-2 text-sm disabled:opacity-40">Next</button>
          </div>
        </>
      )}
    </div>
  );
}

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Input } from '../../../components/Input';
import { LoadingSkeleton } from '../../../components/LoadingSkeleton';
import { ErrorState } from '../../../components/ErrorState';
import { Pagination } from '../../../components/ui/Pagination';
import { FilterPanel } from '../../../components/ui/FilterPanel';
import { useCart } from '../../cart/hooks/useCart';
import { useProducts } from '../hooks/useProducts';
import { useWishlist } from '../../../context/WishlistContext';
import { useToast } from '../../../components/ui/Toast';

const pageSize = 12;

export function Shop() {
  const { addToCart } = useCart();
  const { products, categories, loading, error, refetch } = useProducts();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedRating, setSelectedRating] = useState(null);
  const [sortBy, setSortBy] = useState('featured');
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);

  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);
    setPage(1);
  }, []);

  const filteredProducts = useMemo(() => {
    let result = products;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory) {
      result = result.filter((item) => item.categoryName === selectedCategory);
    }

    // Price filter
    result = result.filter(
      (item) => Number(item.price) >= priceRange[0] && Number(item.price) <= priceRange[1]
    );

    // Rating filter
    if (selectedRating) {
      result = result.filter((item) => (item.rating || 0) >= selectedRating);
    }

    // Sorting
    if (sortBy === 'priceAsc') {
      result = [...result].sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'priceDesc') {
      result = [...result].sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'newest') {
      result = [...result].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    } else if (sortBy === 'rating') {
      result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [products, searchQuery, selectedCategory, priceRange, selectedRating, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginated = useMemo(
    () => filteredProducts.slice((page - 1) * pageSize, page * pageSize),
    [filteredProducts, page]
  );

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory, priceRange, selectedRating, sortBy]);

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product, 1);
      addToast(`${product.name} added to cart!`, 'success');
    } catch (err) {
      addToast('Failed to add item to cart. Please try again.', 'error');
    }
  };

  const handleWishlistToggle = async (productId) => {
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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Shop Leather Collection</h1>

      {/* Search Bar */}
      <div className="panel p-4">
        <Input
          type="text"
          placeholder="Search products, materials, colors..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        {/* Filters - Sticky Sidebar */}
        <div className="hidden lg:block">
          <FilterPanel
            categories={['All', ...(Array.isArray(categories) ? categories : [])]}
            priceRange={priceRange}
            onPriceChange={(min, max) => {
              setPriceRange([min, max]);
              setPage(1);
            }}
            onCategoryChange={(cat) => {
              setSelectedCategory(cat);
              setPage(1);
            }}
            onRatingChange={(rating) => {
              setSelectedRating(rating);
              setPage(1);
            }}
            selectedCategory={selectedCategory}
            selectedRating={selectedRating}
            loading={loading}
          />
        </div>

        <div className="space-y-6">
          {/* Sort and View Options */}
          <div className="panel p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-stone-400">
                Showing {paginated.length > 0 ? (page - 1) * pageSize + 1 : 0} to{' '}
                {Math.min(page * pageSize, filteredProducts.length)} of {filteredProducts.length} products
              </span>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="rating">Highest Rated</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </label>
          </div>

          {error && <ErrorState message={error} onRetry={refetch} />}

          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: pageSize }).map((_, index) => (
                <LoadingSkeleton key={index} className="h-[380px]" />
              ))}
            </div>
          ) : (
            <>
              {!paginated.length ? (
                <div className="panel p-8 text-center text-stone-300 min-h-96">
                  <p className="text-lg font-medium mb-2">No products found</p>
                  <p className="text-sm">Try adjusting your filters or search query</p>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {paginated.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                      onWishlistToggle={handleWishlistToggle}
                      isInWishlist={isInWishlist(product.id)}
                    />
                  ))}
                </div>
              )}

              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                loading={loading}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

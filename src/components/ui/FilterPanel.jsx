import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

export function FilterPanel({
  categories = [],
  priceRange = [0, 1000],
  onPriceChange,
  onCategoryChange,
  onRatingChange,
  selectedCategory = null,
  selectedRating = null,
  loading = false,
}) {
  const [expanded, setExpanded] = useState(true);

  const handlePriceChange = (min, max) => {
    if (onPriceChange) {
      onPriceChange(min, max);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="panel p-6 space-y-6 h-fit sticky top-24"
    >
      <h3 className="text-lg font-semibold">Filters</h3>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm uppercase text-stone-400">Category</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategory === cat}
                onChange={(e) => onCategoryChange(e.target.checked ? cat : null)}
                disabled={loading}
                className="w-4 h-4 rounded cursor-pointer"
              />
              <span className="text-sm text-stone-300 capitalize">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm uppercase text-stone-400">Price Range</h4>
        <div className="space-y-2">
          <label className="text-sm text-stone-300">
            Min: ₹
            <input
              type="number"
              min="0"
              max={priceRange[1]}
              defaultValue={priceRange[0]}
              onChange={(e) => handlePriceChange(Number(e.target.value), priceRange[1])}
              disabled={loading}
              className="w-20 ml-2 px-2 py-1 rounded bg-white/10 border border-white/20 text-white"
            />
          </label>
          <label className="text-sm text-stone-300">
            Max: ₹
            <input
              type="number"
              min={priceRange[0]}
              defaultValue={priceRange[1]}
              onChange={(e) => handlePriceChange(priceRange[0], Number(e.target.value))}
              disabled={loading}
              className="w-20 ml-2 px-2 py-1 rounded bg-white/10 border border-white/20 text-white"
            />
          </label>
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-3">
        <h4 className="font-medium text-sm uppercase text-stone-400">Rating</h4>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedRating === rating}
                onChange={(e) => onRatingChange(e.target.checked ? rating : null)}
                disabled={loading}
                className="w-4 h-4 rounded cursor-pointer"
              />
              <span className="text-sm text-stone-300">
                {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
              </span>
            </label>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

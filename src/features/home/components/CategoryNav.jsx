import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LoadingSkeleton } from '../../../components/LoadingSkeleton';
import { SectionContainer } from '../../../components/ui/SectionContainer';
import { productApi } from '../../../services/productApiService';

export function CategoryNav() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await productApi.getCategories();
        setCategories(data.data || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className="h-12 w-32 rounded-lg bg-white/10 animate-pulse" />
        ))}
      </div>
    );
  }

  const categoryList = Array.isArray(categories) ? categories : [];

  return (
    <SectionContainer className="py-8">
      <div className="flex gap-3 overflow-x-auto pb-2">
        <Link to="/products">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="whitespace-nowrap px-6 py-3 rounded-full border-2 border-leather-accent bg-leather-accent/10 text-leather-accent font-semibold transition hover:bg-leather-accent/20"
          >
            All Products
          </motion.button>
        </Link>

        {categoryList.map((cat) => (
          <Link key={cat} to={`/products?category=${cat}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="whitespace-nowrap px-6 py-3 rounded-full border-2 border-white/20 text-white font-semibold transition hover:border-white/40 hover:bg-white/5"
            >
              {cat}
            </motion.button>
          </Link>
        ))}
      </div>
    </SectionContainer>
  );
}

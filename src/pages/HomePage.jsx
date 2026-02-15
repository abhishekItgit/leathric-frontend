import { useCart } from '../features/cart/hooks/useCart';
import { useProducts } from '../features/products/hooks/useProducts';
import { Home } from '../features/home/pages/Home';

export function HomePage() {
  const { addToCart } = useCart();
  const { products, loading, error, refetch } = useProducts();

  return <Home products={products} loading={loading} error={error} refetch={refetch} onAddToCart={addToCart} />;
}

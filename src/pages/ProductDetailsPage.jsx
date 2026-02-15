import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { useCart } from '../features/cart/hooks/useCart';
import { useProduct } from '../features/products/hooks/useProducts';
import { useAuth } from '../hooks/useAuth';

export function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { product, loading, error, refetch } = useProduct(id);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate(`/signin?redirect=${encodeURIComponent(`/products/${id}`)}`);
      return;
    }

    await addItem(product);
    navigate('/cart');
  };

  if (loading) return <LoadingSkeleton className="h-[460px]" />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!product) return <p>Product not found.</p>;

  return (
    <section className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <img src={product.imageUrl} alt={product.name} className="h-[420px] w-full rounded-2xl object-cover" />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((index) => (
            <img key={index} src={product.imageUrl} alt={`${product.name} preview ${index}`} className="h-24 w-full rounded-xl object-cover opacity-70" />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <span className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-wider text-leather-accent">{product.category}</span>
        <h1 className="text-4xl font-bold">{product.name}</h1>
        <p className="text-2xl font-semibold text-leather-accent">${product.price}</p>
        <p className="text-stone-300">{product.description}</p>
        <Button onClick={handleAddToCart}>Add to cart</Button>
      </div>
    </section>
  );
}

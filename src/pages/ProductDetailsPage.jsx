import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { productService } from '../services/productService';
import { mockProducts } from './mockData';
import { useCart } from '../hooks/useCart';

export function ProductDetailsPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const { data } = await productService.getProductById(id);
        setProduct(data.product || data);
      } catch {
        setProduct(mockProducts.find((item) => String(item.id) === id));
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  if (loading) return <LoadingSkeleton className="h-[460px]" />;
  if (!product) return <p>Product not found.</p>;

  return (
    <section className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-4">
        <img src={product.image} alt={product.name} className="h-[420px] w-full rounded-2xl object-cover" />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((index) => (
            <img key={index} src={product.image} alt={`${product.name} preview ${index}`} className="h-24 w-full rounded-xl object-cover opacity-70" />
          ))}
        </div>
      </div>
      <div className="space-y-6">
        <span className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-wider text-leather-accent">{product.category}</span>
        <h1 className="text-4xl font-bold">{product.name}</h1>
        <p className="text-2xl font-semibold text-leather-accent">${product.price}</p>
        <p className="text-stone-300">{product.description}</p>
        <Button onClick={() => addToCart(product)}>Add to cart</Button>

        <div className="panel p-5">
          <h3 className="text-lg font-semibold">Reviews</h3>
          <div className="mt-4 space-y-4 text-sm text-stone-300">
            <p>⭐️⭐️⭐️⭐️⭐️ “Exceptional quality and finish.” — Priya</p>
            <p>⭐️⭐️⭐️⭐️ “Beautiful leather, quick shipping.” — Marcus</p>
          </div>
        </div>
      </div>
    </section>
  );
}

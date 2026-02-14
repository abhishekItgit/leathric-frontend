import { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../../components/Card';
import { Button } from '../../../components/Button';

function ProductCardBase({ product, onAddToCart }) {
  const handleAdd = useCallback(() => onAddToCart(product), [onAddToCart, product]);

  return (
    <Card className="group flex flex-col">
      <div className="relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold">{product.name}</h3>
          <span className="text-sm font-medium text-leather-accent">${product.price}</span>
        </div>
        <p className="line-clamp-2 text-sm text-stone-400">{product.description}</p>
        <div className="flex gap-2 pt-1">
          <Link className="flex-1" to={`/products/${product.id}`}>
            <Button variant="outline" className="w-full">
              Details
            </Button>
          </Link>
          <Button onClick={handleAdd} className="flex-1">
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
}

export const ProductCard = memo(ProductCardBase);

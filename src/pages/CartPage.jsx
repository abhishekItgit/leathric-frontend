import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { useCart } from '../hooks/useCart';

export function CartPage() {
  const { cartItems, cartTotal, updateQuantity, removeItem } = useCart();

  if (!cartItems.length) {
    return (
      <div className="panel p-10 text-center">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <Link to="/products" className="mt-3 inline-block text-leather-accent">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="panel flex items-center gap-4 p-4">
            <img src={item.imageUrl} alt={item.name} className="h-20 w-20 rounded-xl object-cover" />
            <div className="flex-1">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-stone-300">${item.price}</p>
            </div>
            <input type="number" min="1" value={item.quantity} onChange={(e) => updateQuantity(item.id, Number(e.target.value))} className="w-16 rounded-lg border border-white/20 bg-transparent p-2" />
            <button onClick={() => removeItem(item.id)} className="text-sm text-red-400">Remove</button>
          </div>
        ))}
      </div>
      <aside className="panel h-fit space-y-4 p-5">
        <h3 className="text-lg font-semibold">Order Summary</h3>
        <div className="flex justify-between text-sm text-stone-300">
          <span>Subtotal</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
        <Link to="/checkout" className="block">
          <Button className="w-full">Proceed to Checkout</Button>
        </Link>
      </aside>
    </div>
  );
}

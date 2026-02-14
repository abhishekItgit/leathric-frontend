import { createContext, useEffect, useMemo, useState } from 'react';
import { cartService } from '../services/cartService';

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    try {
      const { data } = await cartService.getCart();
      setCartItems(data.items || []);
    } catch {
      // noop for unauthenticated visitors
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (product) => {
    const existing = cartItems.find((item) => item.id === product.id);
    if (existing) {
      return updateQuantity(product.id, existing.quantity + 1);
    }

    setCartItems((prev) => [...prev, { ...product, quantity: 1 }]);
    try {
      await cartService.addToCart({ productId: product.id, quantity: 1 });
    } catch {
      // fallback to optimistic state
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)));
    try {
      await cartService.updateItem(id, { quantity });
    } catch {
      // keep UX snappy even when backend unavailable
    }
  };

  const removeItem = async (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    try {
      await cartService.removeItem(id);
    } catch {
      // ignore API failure for demo UX
    }
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const value = useMemo(
    () => ({ cartItems, cartCount, cartTotal, addToCart, updateQuantity, removeItem, fetchCart }),
    [cartItems, cartCount, cartTotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

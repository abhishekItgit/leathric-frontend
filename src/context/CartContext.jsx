import { createContext, useEffect, useMemo, useState } from 'react';
import { cartService } from '../services/cartService';

export const CartContext = createContext(null);

const mapCartItem = (item) => ({
  ...item,
  id: item.id || item.productId,
  imageUrl: item.imageUrl || item.image || item.product?.imageUrl || '',
  name: item.name || item.product?.name,
  price: item.price || item.product?.price || 0,
});

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const fetchCart = async () => {
    try {
      const { data } = await cartService.getCart();
      setCartItems((data.items || []).map(mapCartItem));
    } catch {
      setCartItems([]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (product) => {
    await cartService.addToCart({ productId: product.id, quantity: 1 });
    await fetchCart();
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;
    await cartService.updateItem(id, { quantity });
    await fetchCart();
  };

  const removeItem = async (id) => {
    await cartService.removeItem(id);
    await fetchCart();
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + Number(item.price) * item.quantity, 0);

  const value = useMemo(
    () => ({ cartItems, cartCount, cartTotal, addToCart, updateQuantity, removeItem, fetchCart }),
    [cartItems, cartCount, cartTotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

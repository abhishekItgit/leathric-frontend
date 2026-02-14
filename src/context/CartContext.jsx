import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { cartApi } from '../features/cart/api/cartApi';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await cartApi.getCart();
      setCartItems((data.items || []).map(mapCartItem));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load cart.');
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(async (product) => {
    await cartApi.addToCart({ productId: product.id, quantity: 1 });
    await fetchCart();
  }, [fetchCart]);

  const updateQuantity = useCallback(async (id, quantity) => {
    if (quantity < 1) return;
    await cartApi.updateItem(id, { quantity });
    await fetchCart();
  }, [fetchCart]);

  const removeItem = useCallback(async (id) => {
    await cartApi.removeItem(id);
    await fetchCart();
  }, [fetchCart]);

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );
  const cartTotal = useMemo(
    () => cartItems.reduce((total, item) => total + Number(item.price) * item.quantity, 0),
    [cartItems]
  );

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      cartTotal,
      loading,
      error,
      addToCart,
      updateQuantity,
      removeItem,
      fetchCart,
    }),
    [cartItems, cartCount, cartTotal, loading, error, addToCart, updateQuantity, removeItem, fetchCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

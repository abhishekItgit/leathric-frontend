import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authStorage } from '../services/authStorage';
import { cartService } from '../services/cartService';
import { getApiErrorMessage } from '../utils/apiError';

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
    const token = authStorage.getToken();

    if (!token) {
      setCartItems([]);
      setError('');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data } = await cartService.getCart();
      setCartItems((data.items || []).map(mapCartItem));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load cart.'));
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(
    async (product) => {
      await cartService.addToCart({ productId: product.id, quantity: 1 });
      await fetchCart();
    },
    [fetchCart]
  );

  const updateQuantity = useCallback(
    async (id, quantity) => {
      if (quantity < 1) return;
      await cartService.updateItem(id, { quantity });
      await fetchCart();
    },
    [fetchCart]
  );

  const removeItem = useCallback(
    async (id) => {
      await cartService.removeItem(id);
      await fetchCart();
    },
    [fetchCart]
  );

  const cartCount = useMemo(() => cartItems.reduce((total, item) => total + item.quantity, 0), [cartItems]);
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

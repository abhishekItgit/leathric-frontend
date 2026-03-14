import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { cartService } from '../services/cartService';
import { orderService } from '../services/orderService';
import { getApiErrorMessage } from '../utils/apiError';
import { useAuth } from '../hooks/useAuth';

export const CartContext = createContext(null);

const mapCartItem = (item) => ({
  ...item,
  id: item.cartItemId || item.id || item.productId,
  productId: item.productId || item.id || item.productId,
  imageUrl: item.imageUrl || item.image || item.product?.imageUrl || item.productImage || '',
  name: item.name || item.product?.name || item.productName || item.product?.title || '',
  price: Number(item.unitPrice ?? item.unit_price ?? item.price ?? item.product?.price ?? 0),
});

const normalizeCartItems = (response) => {
  const payload = response?.data ?? response;

  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.cartItems)) return payload.cartItems;
  if (Array.isArray(payload?.data)) return payload.data;

  return [];
};

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mutating, setMutating] = useState(false);
  const [error, setError] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      setLoading(false);
      setError('');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await cartService.getCart();
      setCartItems(normalizeCartItems(res).map(mapCartItem));
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setCartItems([]);
        setError('');
      } else {
        setError(getApiErrorMessage(err, 'Unable to load cart.'));
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = useCallback(
    async (product, quantity = 1) => {
      if (!isAuthenticated) {
        const authError = new Error('Please login to add items to cart.');
        authError.code = 'AUTH_REQUIRED';
        throw authError;
      }

      if (!product || !product.id) {
        throw new Error('Invalid product');
      }

      setError('');
      setMutating(true);

      const optimisticItem = {
        id: product.id,
        productId: product.id,
        imageUrl: product.imageUrl,
        name: product.name,
        price: Number(product.price || 0),
        quantity,
      };

      setCartItems((prev) => {
        const existing = prev.find((item) => item.id === product.id || item.productId === product.id);
        if (!existing) return [...prev, optimisticItem];

        return prev.map((item) =>
          item.id === product.id || item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      });

      try {
        await cartService.addItem(product.id, quantity);
      } catch (err) {
        setError(getApiErrorMessage(err, 'Unable to add item to cart.'));
        throw err;
      } finally {
        setMutating(false);
        await refreshCart();
      }
    },
    [isAuthenticated, refreshCart]
  );

  const updateQuantity = useCallback(
    async (id, quantity) => {
      if (!isAuthenticated || quantity < 1) return;

      setError('');
      setMutating(true);

      setCartItems((prev) =>
        prev.map((item) => (item.id === id || item.productId === id ? { ...item, quantity } : item))
      );

      try {
        await cartService.updateItem(id, quantity);
      } catch (err) {
        setError(getApiErrorMessage(err, 'Unable to update quantity.'));
      } finally {
        setMutating(false);
        await refreshCart();
      }
    },
    [isAuthenticated, refreshCart]
  );

  const removeItem = useCallback(
    async (id) => {
      if (!isAuthenticated) return;

      setError('');
      setMutating(true);
      const previousItems = cartItems;
      setCartItems((prev) => prev.filter((item) => item.id !== id && item.productId !== id));

      try {
        await cartService.removeItem(id);
      } catch (err) {
        setError(getApiErrorMessage(err, 'Unable to remove item from cart.'));
        setCartItems(previousItems);
      } finally {
        setMutating(false);
        await refreshCart();
      }
    },
    [cartItems, isAuthenticated, refreshCart]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
    setError('');
  }, []);

  const placeOrder = useCallback(
    async (payload) => {
      if (placingOrder) {
        return null;
      }

      setPlacingOrder(true);
      setError('');

      try {
        const { data } = await orderService.placeOrder(payload);
        clearCart();
        return data;
      } catch (err) {
        setError(getApiErrorMessage(err, 'Unable to place order.'));
        throw err;
      } finally {
        setPlacingOrder(false);
        await refreshCart();
      }
    },
    [placingOrder, clearCart, refreshCart]
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
      mutating,
      error,
      placingOrder,
      addItem,
      addToCart: addItem,
      updateQuantity,
      removeItem,
      placeOrder,
      clearCart,
      refreshCart,
    }),
    [cartItems, cartCount, cartTotal, loading, mutating, error, placingOrder, addItem, updateQuantity, removeItem, placeOrder, clearCart, refreshCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { cartService } from '../services/cartService';
import { orderService } from '../services/orderService';
import { getApiErrorMessage } from '../utils/apiError';
import { useAuth } from '../hooks/useAuth';

export const CartContext = createContext(null);

const mapCartItem = (item) => ({
  ...item,
  // Prefer cart-specific id (cartItemId) then id then productId
  id: item.cartItemId || item.id || item.productId,
  productId: item.productId || item.id || item.productId,
  // Normalize image/name/price from different API shapes
  imageUrl:
    item.imageUrl || item.image || item.product?.imageUrl || item.productImage || '',
  name: item.name || item.product?.name || item.productName || item.product?.title || '',
  // price: unitPrice, unit_price, price, product?.price
  price:
    Number(item.unitPrice ?? item.unit_price ?? item.price ?? item.product?.price ?? 0),
});

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
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await cartService.getCart();

      // Normalize response shapes: API may return { items: [...] } or { data: { items: [...] } } or nested structures
      const payload = res?.data ?? res;
      let items = [];
      if (Array.isArray(payload?.items)) items = payload.items;
      else if (Array.isArray(payload?.data?.items)) items = payload.data.items;
      else if (Array.isArray(payload?.content)) items = payload.content;
      else if (Array.isArray(payload?.cartItems)) items = payload.cartItems;
      else if (Array.isArray(payload?.data)) items = payload.data;

      setCartItems((items || []).map(mapCartItem));
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
      if (!product || !product.id) {
        throw new Error('Invalid product');
      }

      setMutating(true);
      const optimisticItem = {
        id: product.id,
        productId: product.id,
        imageUrl: product.imageUrl,
        name: product.name,
        price: product.price,
        quantity,
      };

      setCartItems((prev) => {
        const existing = prev.find((item) => item.id === product.id || item.productId === product.id);
        if (!existing) {
          return [...prev, optimisticItem];
        }

        return prev.map((item) =>
          item.id === product.id || item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      });

      try {
        await cartService.addItem(product.id, quantity);
        await refreshCart();
      } catch (err) {
        console.error('Error adding item to cart:', err);
        setError(getApiErrorMessage(err, 'Unable to add item to cart.'));
        throw err;
      } finally {
        setMutating(false);
      }
    },
    [refreshCart]
  );

  const updateQuantity = useCallback(
    async (id, quantity) => {
      if (quantity < 1) return;
      setMutating(true);
      try {
        await cartService.updateItem(id, quantity);
      } finally {
        setMutating(false);
        await refreshCart();
      }
    },
    [refreshCart]
  );

  const removeItem = useCallback(
    async (id) => {
      setMutating(true);
      try {
        await cartService.removeItem(id);
      } finally {
        setMutating(false);
        await refreshCart();
      }
    },
    [refreshCart]
  );

  const placeOrder = useCallback(async (payload) => {
    setPlacingOrder(true);
    setError('');

    try {
      const { data } = await orderService.placeOrder(payload);
      setCartItems([]);
      return data;
    } catch (err) {
      const message = getApiErrorMessage(err, 'Unable to place order.');
      setError(message);
      throw err;
    } finally {
      setPlacingOrder(false);
      await refreshCart();
    }
  }, [refreshCart]);

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
      // backward-compatible alias
      addToCart: addItem,
      updateQuantity,
      removeItem,
      placeOrder,
      refreshCart,
    }),
    [cartItems, cartCount, cartTotal, loading, mutating, error, placingOrder, addItem, updateQuantity, removeItem, placeOrder, refreshCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

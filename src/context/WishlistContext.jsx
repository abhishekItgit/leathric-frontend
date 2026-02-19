import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { wishlistApi } from '../services/wishlistApiService';
import { getApiErrorMessage } from '../utils/apiError';
import { useAuth } from '../hooks/useAuth';

export const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await wishlistApi.getWishlist();

      // Normalize various API response shapes to an array
      let items = [];
      if (Array.isArray(res)) {
        items = res;
      } else if (Array.isArray(res?.data)) {
        items = res.data;
      } else if (Array.isArray(res?.items)) {
        items = res.items;
      } else if (Array.isArray(res?.content)) {
        items = res.content;
      } else if (Array.isArray(res?.wishlist)) {
        items = res.wishlist;
      }

      setWishlistItems(items);
    } catch (err) {
      if (err.response?.status !== 401 && err.response?.status !== 403) {
        setError(getApiErrorMessage(err, 'Unable to load wishlist.'));
      }
      setWishlistItems([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const toggleWishlist = useCallback(
    async (productId) => {
      if (!isAuthenticated) {
        throw new Error('Please log in to use wishlist');
      }

      const list = Array.isArray(wishlistItems) ? wishlistItems : [];
      const isInWishlist = list.some((item) => item.id === productId || item.productId === productId);

      if (isInWishlist) {
        setWishlistItems((prev) =>
          (Array.isArray(prev) ? prev : []).filter((item) => item.id !== productId && item.productId !== productId)
        );
        try {
          await wishlistApi.removeFromWishlist(productId);
        } catch (err) {
          setError(getApiErrorMessage(err, 'Unable to remove from wishlist.'));
          throw err;
        } finally {
          await refreshWishlist();
        }
      } else {
        setWishlistItems((prev) => [...(Array.isArray(prev) ? prev : []), { id: productId, productId }]);
        try {
          await wishlistApi.addToWishlist(productId);
        } catch (err) {
          setError(getApiErrorMessage(err, 'Unable to add to wishlist.'));
          throw err;
        } finally {
          await refreshWishlist();
        }
      }
    },
    [isAuthenticated, wishlistItems, refreshWishlist]
  );

  const isInWishlist = useCallback(
    (productId) => {
      const list = Array.isArray(wishlistItems) ? wishlistItems : [];
      return list.some((item) => item.id === productId || item.productId === productId);
    },
    [wishlistItems]
  );

  const value = useMemo(
    () => ({
      wishlistItems,
      loading,
      error,
      toggleWishlist,
      isInWishlist,
      refreshWishlist,
    }),
    [wishlistItems, loading, error, toggleWishlist, isInWishlist, refreshWishlist]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}

import { axiosClient } from '../lib/axiosClient';

const CART_STORAGE_KEY = 'leathric_cart';

const getLocalCart = () => {
  try {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : { items: [] };
  } catch (err) {
    return { items: [] };
  }
};

const saveLocalCart = (cart) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (err) {
    console.error('Failed to save cart to localStorage:', err);
  }
};

export const cartService = {
  getCart: () => {
    return axiosClient.get('/cart').catch((err) => {
      console.error('Error fetching cart:', err.message);
      // Fallback to empty cart if API fails
      return { data: { items: [] } };
    });
  },

  addItem: (productId, quantity = 1) => {
    return axiosClient
      .post('/cart/items', { productId, quantity })
      .then((response) => {
        // Save to localStorage as backup
        if (response.data?.items) {
          saveLocalCart(response.data);
        }
        return response;
      })
      .catch((err) => {
        console.error('Error adding item to cart:', err.message);
        // Fallback to localStorage
        const cart = getLocalCart();
        const existingItem = cart.items.find(
          (item) => item.productId === productId || item.id === productId
        );

        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          cart.items.push({
            id: productId,
            productId,
            quantity,
          });
        }

        saveLocalCart(cart);
        return { data: cart };
      });
  },

  updateItem: (itemId, quantity) => {
    return axiosClient
      .patch(`/cart/items/${itemId}`, { quantity })
      .then((response) => {
        if (response.data?.items) {
          saveLocalCart(response.data);
        }
        return response;
      })
      .catch((err) => {
        console.error('Error updating cart item:', err.message);
        // Fallback to localStorage
        const cart = getLocalCart();
        const item = cart.items.find((item) => item.id === itemId || item.productId === itemId);

        if (item) {
          item.quantity = quantity;
          saveLocalCart(cart);
        }

        return { data: cart };
      });
  },

  removeItem: (itemId) => {
    return axiosClient
      .delete(`/cart/items/${itemId}`)
      .then((response) => {
        if (response.data?.items) {
          saveLocalCart(response.data);
        }
        return response;
      })
      .catch((err) => {
        console.error('Error removing cart item:', err.message);
        // Fallback to localStorage
        const cart = getLocalCart();
        cart.items = cart.items.filter((item) => item.id !== itemId && item.productId !== itemId);
        saveLocalCart(cart);
        return { data: cart };
      });
  },
};

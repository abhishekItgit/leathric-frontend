import { axiosClient } from '../lib/axiosClient';

export const cartService = {
  getCart: () => axiosClient.get('/cart'),
  addItem: (productId, quantity = 1) => axiosClient.post('/cart/items', { productId, quantity }),
  updateItem: (itemId, quantity) => axiosClient.patch(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId) => axiosClient.delete(`/cart/items/${itemId}`),
};

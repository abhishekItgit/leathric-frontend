import { axiosClient } from '../api/axiosClient';

export const cartService = {
  getCart: () => axiosClient.get('/cart'),
  addItem: (productId, quantity = 1) => axiosClient.post('/cart', { productId, quantity }),
  updateItem: (id, quantity) => axiosClient.patch(`/cart/${id}`, { quantity }),
  removeItem: (id) => axiosClient.delete(`/cart/${id}`),
};

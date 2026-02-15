import { axiosClient } from '../api/axiosClient';

export const cartService = {
  getCart: () => axiosClient.get('/cart'),
  addToCart: (payload) => axiosClient.post('/cart', payload),
  updateItem: (id, payload) => axiosClient.patch(`/cart/${id}`, payload),
  removeItem: (id) => axiosClient.delete(`/cart/${id}`),
  placeOrder: (payload) => axiosClient.post('/orders', payload),
};

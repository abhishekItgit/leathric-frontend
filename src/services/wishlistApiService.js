import { axiosClient } from '../lib/axiosClient';

export const wishlistApi = {
  async getWishlist(params = {}) {
    const response = await axiosClient.get('/wishlist', { params });
    return response.data;
  },

  async addToWishlist(productId) {
    const response = await axiosClient.post('/wishlist', { productId });
    return response.data;
  },

  async removeFromWishlist(productId) {
    const response = await axiosClient.delete(`/wishlist/${productId}`);
    return response.data;
  },

  async isInWishlist(productId) {
    const response = await axiosClient.get(`/wishlist/${productId}/status`);
    return response.data;
  },
};

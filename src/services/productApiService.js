import { axiosClient } from '../lib/axiosClient';

export const productApi = {
  async getProducts(params = {}) {
    const response = await axiosClient.get('/products', { params });
    return response.data;
  },

  async getProductById(id) {
    const response = await axiosClient.get(`/products/${id}`);
    return response.data;
  },

  async getProductsByCategory(category, params = {}) {
    const response = await axiosClient.get(`/products/category/${category}`, { params });
    return response.data;
  },

  async searchProducts(query, params = {}) {
    const response = await axiosClient.get('/products/search', {
      params: { ...params, q: query },
    });
    return response.data;
  },

  async getProductReviews(productId, params = {}) {
    const response = await axiosClient.get(`/products/${productId}/reviews`, { params });
    return response.data;
  },

  async createProductReview(productId, data) {
    const response = await axiosClient.post(`/products/${productId}/reviews`, data);
    return response.data;
  },

  async getCategories() {
    const response = await axiosClient.get('/categories');
    return response.data;
  },

  async getTrendingProducts(params = {}) {
    const response = await axiosClient.get('/products/trending', { params });
    return response.data;
  },

  async getFeaturedProducts(params = {}) {
    const response = await axiosClient.get('/products/featured', { params });
    return response.data;
  },

  async getRelatedProducts(productId, params = {}) {
    const response = await axiosClient.get(`/products/${productId}/related`, { params });
    return response.data;
  },
};

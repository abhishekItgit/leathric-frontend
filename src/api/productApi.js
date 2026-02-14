import { axiosClient } from './axiosClient';

export const productApi = {
  async getProducts(params = {}) {
    const { data } = await axiosClient.get('/products', { params });
    return data;
  },
  async getProductById(id) {
    const { data } = await axiosClient.get(`/products/${id}`);
    return data;
  },
  async getCategories() {
    const { data } = await axiosClient.get('/categories');
    return data;
  },
};

import { axiosClient } from '../../../lib/axiosClient';
import {
  normalizeCategoryResponse,
  normalizeProductResponse,
  normalizeSingleProductResponse,
} from '../../../utils/productMappers';

export const productApi = {
  async getProducts(params = {}) {
    const { data } = await axiosClient.get('/products', { params });
    return normalizeProductResponse(data);
  },
  async getProductById(id) {
    const { data } = await axiosClient.get(`/products/${id}`);
    return normalizeSingleProductResponse(data);
  },
  async getCategories() {
    const { data } = await axiosClient.get('/categories');
    return normalizeCategoryResponse(data);
  },
};

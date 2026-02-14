import { productApi } from '../api/productApi';
import {
  normalizeCategoryResponse,
  normalizeProductResponse,
  normalizeSingleProductResponse,
} from '../utils/productMappers';

export const productService = {
  async getProducts(params) {
    const response = await productApi.getProducts(params);
    return normalizeProductResponse(response);
  },
  async getProductById(id) {
    const response = await productApi.getProductById(id);
    return normalizeSingleProductResponse(response);
  },
  async getCategories() {
    const response = await productApi.getCategories();
    return normalizeCategoryResponse(response);
  },
};

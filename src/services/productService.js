import { axiosClient } from './axiosClient';

export const productService = {
  getProducts: (params) => axiosClient.get('/products', { params }),
  getProductById: (id) => axiosClient.get(`/products/${id}`),
};

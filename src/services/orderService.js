import { axiosClient } from '../api/axiosClient';

export const orderService = {
  placeOrder: (payload) => axiosClient.post('/orders', payload),
};

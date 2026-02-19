import { axiosClient } from '../lib/axiosClient';

export const orderApi = {
  async createOrder(data) {
    const response = await axiosClient.post('/orders', data);
    return response.data;
  },

  async getOrders(params = {}) {
    const response = await axiosClient.get('/orders', { params });
    return response.data;
  },

  async getOrderById(id) {
    const response = await axiosClient.get(`/orders/${id}`);
    return response.data;
  },

  async cancelOrder(id) {
    const response = await axiosClient.post(`/orders/${id}/cancel`);
    return response.data;
  },

  async getOrderTracking(id) {
    const response = await axiosClient.get(`/orders/${id}/tracking`);
    return response.data;
  },

  async applyPromoCode(code, subtotal) {
    const response = await axiosClient.post('/promo-codes/validate', {
      code,
      subtotal,
    });
    return response.data;
  },
};

export const addressApi = {
  async getAddresses() {
    const response = await axiosClient.get('/addresses');
    return response.data;
  },

  async getAddressById(id) {
    const response = await axiosClient.get(`/addresses/${id}`);
    return response.data;
  },

  async createAddress(data) {
    const response = await axiosClient.post('/addresses', data);
    return response.data;
  },

  async updateAddress(id, data) {
    const response = await axiosClient.put(`/addresses/${id}`, data);
    return response.data;
  },

  async deleteAddress(id) {
    const response = await axiosClient.delete(`/addresses/${id}`);
    return response.data;
  },

  async setDefaultAddress(id) {
    const response = await axiosClient.post(`/addresses/${id}/set-default`);
    return response.data;
  },
};

export const userApi = {
  async getProfile() {
    const response = await axiosClient.get('/profile');
    return response.data;
  },

  async updateProfile(data) {
    const response = await axiosClient.put('/profile', data);
    return response.data;
  },

  async changePassword(data) {
    const response = await axiosClient.post('/profile/change-password', data);
    return response.data;
  },
};

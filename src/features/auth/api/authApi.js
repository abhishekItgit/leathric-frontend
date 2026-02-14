import { axiosClient } from '../../../lib/axiosClient';

export const authApi = {
  async login(payload) {
    const { data } = await axiosClient.post('/auth/login', payload);
    return data;
  },
  async register(payload) {
    const { data } = await axiosClient.post('/auth/register', payload);
    return data;
  },
};

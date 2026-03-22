import api from './api';

export const addressService = {
  // Get all addresses
  getAddresses: async () => {
    const response = await api.get('/addresses');
    return response.data;
  },

  // Add new address
  addAddress: async (addressData) => {
    const response = await api.post('/addresses', addressData);
    return response.data;
  },

  // Update address
  updateAddress: async (id, addressData) => {
    const response = await api.put(`/addresses/${id}`, addressData);
    return response.data;
  },

  // Delete address
  deleteAddress: async (id) => {
    const response = await api.delete(`/addresses/${id}`);
    return response.data;
  },

  // Set default address
  setDefaultAddress: async (id) => {
    const response = await api.post(`/addresses/${id}/default`);
    return response.data;
  }
};
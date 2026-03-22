import api from './api';

export const orderService = {
  // Get buyer orders
  getBuyerOrders: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/orders/buyer${queryParams ? `?${queryParams}` : ''}`);
    return response.data;
  },

  // Get seller orders
  getSellerOrders: async () => {
    const response = await api.get('/orders/seller');
    return response.data;
  },

  // Get order by ID
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Create order (checkout)
  createOrder: async (orderData) => {
    const response = await api.post('/orders/checkout', orderData);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (id) => {
    const response = await api.post(`/orders/${id}/cancel`);
    return response.data;
  },

  // Update order status (seller)
  updateOrderStatus: async (itemId, status) => {
    const response = await api.put(`/orders/item/${itemId}/status`, { status });
    return response.data;
  }
};
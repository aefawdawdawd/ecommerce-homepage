import api from './api';

export const cartService = {
  // Get cart
  getCart: async () => {
    try {
      console.log('📦 Fetching cart...');
      const response = await api.get('/cart');
      console.log('✅ Cart response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error getting cart:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  // Add to cart
  addToCart: async (data) => {
    try {
      console.log('🛒 Adding to cart with data:', data);
      
      // Validate dữ liệu trước khi gửi
      if (!data.productId) {
        throw new Error('Product ID is required');
      }

      // Chuyển đổi sang số nguyên
      const payload = {
        productId: parseInt(data.productId),
        quantity: parseInt(data.quantity) || 1
      };
      
      console.log('📤 Sending payload:', payload);
      
      const response = await api.post('/cart/add', payload);
      console.log('✅ Add to cart response:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Error adding to cart:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: error.config
      });
      
      // Hiển thị lỗi chi tiết
      if (error.response) {
        // Server trả về lỗi
        console.error('🔴 Server error:', error.response.data);
        throw new Error(error.response.data.error || 'Failed to add to cart');
      } else if (error.request) {
        // Không nhận được response
        console.error('🔴 No response from server');
        throw new Error('No response from server');
      } else {
        // Lỗi khi setup request
        console.error('🔴 Request setup error:', error.message);
        throw error;
      }
    }
  },

  // Update cart item
  updateCartItem: async (itemId, data) => {
    try {
      console.log('🔄 Updating cart item:', itemId, data);
      const response = await api.put(`/cart/item/${itemId}`, data);
      return response.data;
    } catch (error) {
      console.error('❌ Error updating cart:', error.response?.data || error.message);
      throw error;
    }
  },

  // Remove from cart
  removeFromCart: async (itemId) => {
    try {
      console.log('🗑️ Removing from cart:', itemId);
      const response = await api.delete(`/cart/item/${itemId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Error removing from cart:', error.response?.data || error.message);
      throw error;
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      console.log('🧹 Clearing cart');
      const response = await api.delete('/cart/clear');
      return response.data;
    } catch (error) {
      console.error('❌ Error clearing cart:', error.response?.data || error.message);
      throw error;
    }
  }
};
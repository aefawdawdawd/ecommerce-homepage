import api from './api';

export const wishlistService = {
  // Get user's wishlist
  getWishlist: async (userId) => {
    try {
      console.log('🔍 Fetching wishlist for user:', userId);
      const url = userId ? `/wishlist/${userId}` : '/wishlist';
      const response = await api.get(url);
      console.log('✅ Wishlist response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching wishlist:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      // Return empty array nếu API chưa có
      if (error.response?.status === 404) {
        console.log('ℹ️ Wishlist API not available, returning empty array');
        return [];
      }
      throw error;
    }
  },

  // Add to wishlist
  addToWishlist: async (productId) => {
    try {
      console.log('➕ Adding to wishlist:', productId);
      const response = await api.post('/wishlist/add', { productId });
      console.log('✅ Add to wishlist response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error adding to wishlist:', error.response?.data || error.message);
      throw error;
    }
  },

  // Remove from wishlist
  removeFromWishlist: async (userId, productId) => {
    try {
      console.log('➖ Removing from wishlist:', { userId, productId });
      const response = await api.delete(`/wishlist/${userId}/${productId}`);
      console.log('✅ Remove from wishlist response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error removing from wishlist:', error.response?.data || error.message);
      throw error;
    }
  },

  // Check if product is in wishlist
  checkWishlist: async (userId, productId) => {
    try {
      const response = await api.get(`/wishlist/check/${userId}/${productId}`);
      return response.data.inWishlist;
    } catch (error) {
      console.error('❌ Error checking wishlist:', error.response?.data || error.message);
      return false;
    }
  }
};
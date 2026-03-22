import api from './api';

export const reviewService = {
  // Get reviews for a product
  getProductReviews: async (productId) => {
    try {
      console.log('🔍 Fetching reviews for product:', productId);
      const response = await api.get(`/reviews/product/${productId}`);
      console.log('✅ Reviews response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching reviews:', error.response?.data || error.message);
      // Return empty array nếu API chưa có
      if (error.response?.status === 404) {
        console.log('ℹ️ Reviews API not available, returning empty array');
        return [];
      }
      throw error;
    }
  },

  // Add a review
  addReview: async (productId, reviewData) => {
    try {
      console.log('➕ Adding review:', { productId, ...reviewData });
      const response = await api.post(`/reviews/product/${productId}`, reviewData);
      console.log('✅ Add review response:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error adding review:', error.response?.data || error.message);
      throw error;
    }
  },

  // Update a review
  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await api.put(`/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error updating review:', error.response?.data || error.message);
      throw error;
    }
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    try {
      const response = await api.delete(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting review:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get average rating for a product
  getAverageRating: async (productId) => {
    try {
      const reviews = await reviewService.getProductReviews(productId);
      if (reviews.length === 0) return { average: 0, count: 0 };
      
      const total = reviews.reduce((sum, r) => sum + r.rating, 0);
      return {
        average: total / reviews.length,
        count: reviews.length
      };
    } catch (error) {
      console.error('Error calculating average rating:', error);
      return { average: 0, count: 0 };
    }
  }
};
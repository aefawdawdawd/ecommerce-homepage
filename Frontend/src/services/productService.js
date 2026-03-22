import axios from 'axios';

const API_BASE_URL = window.location.hostname.includes('ngrok-free.dev') 
    ? 'https://cinderlike-unduteously-korey.ngrok-free.dev/api' 
    : 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

export const productService = {
    getProducts: async (params = {}) => {
        try {
            console.log('📡 Fetching products with params:', params);
            // Đảm bảo URL đầy đủ: API_BASE_URL/products
            const response = await api.get('/products', { params });
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching products:', error.response?.data || error.message);
            throw error;
        }
    },

    // Get product by ID
    getProductById: async (id) => {
        try {
            console.log('📡 Fetching product with ID:', id);
            const response = await api.get(`/products/${id}`);
            console.log('✅ Product response:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching product:', error.response?.data || error.message);
            throw error;
        }
    },

    // Get categories (thêm hàm này nếu cần)
    getCategories: async () => {
        try {
            const response = await api.get('/categories');
            return response.data;
        } catch (error) {
            console.error('❌ Error fetching categories:', error);
            throw error;
        }
    },

    // Create new product
    createProduct: async (formData) => {
        try {
            const response = await api.post('/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error creating product:', error.response?.data || error.message);
            throw error;
        }
    },

    // Update product
    updateProduct: async (id, formData) => {
        try {
            const response = await api.put(`/products/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating product:', error.response?.data || error.message);
            throw error;
        }
    },

    // Delete product
    deleteProduct: async (id) => {
        try {
            const response = await api.delete(`/products/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting product:', error.response?.data || error.message);
            throw error;
        }
    },

    // Get seller products
    getSellerProducts: async (sellerId) => {
        try {
            const response = await api.get(`/products/seller/${sellerId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching seller products:', error.response?.data || error.message);
            throw error;
        }
    },

    // Add review
    addReview: async (productId, reviewData) => {
        try {
            const response = await api.post(`/products/${productId}/reviews`, reviewData);
            return response.data;
        } catch (error) {
            console.error('Error adding review:', error.response?.data || error.message);
            throw error;
        }
    }
};

export default productService;
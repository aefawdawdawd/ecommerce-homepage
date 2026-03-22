import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const ProductContext = createContext(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);

  // Fetch tất cả sản phẩm
  const fetchProducts = async (params = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await axios.get(`/products${queryParams ? `?${queryParams}` : ''}`);
      setProducts(response.data);
      setTotalProducts(response.data.length);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch sản phẩm theo ID
  const fetchProductById = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(`/products/${id}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch product');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Tạo sản phẩm mới
  const createProduct = async (productData) => {
    setLoading(true);
    try {
      const response = await axios.post('/products', productData);
      if (response.data.success) {
        // Refresh products list
        await fetchProducts();
        return { success: true, productId: response.data.productId };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to create product';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật sản phẩm
  const updateProduct = async (id, productData) => {
    setLoading(true);
    try {
      const response = await axios.put(`/products/${id}`, productData);
      if (response.data.success) {
        await fetchProducts();
        return { success: true };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to update product';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Xóa sản phẩm
  const deleteProduct = async (id) => {
    setLoading(true);
    try {
      const response = await axios.delete(`/products/${id}`);
      if (response.data.success) {
        await fetchProducts();
        return { success: true };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to delete product';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Tìm kiếm sản phẩm
  const searchProducts = async (query) => {
    setLoading(true);
    try {
      const response = await axios.get(`/products?search=${query}`);
      setProducts(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  // Lọc sản phẩm theo category
  const filterByCategory = async (category) => {
    setLoading(true);
    try {
      const response = await axios.get(`/products?category=${category}`);
      setProducts(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Filter failed');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    products,
    loading,
    error,
    totalProducts,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    filterByCategory
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
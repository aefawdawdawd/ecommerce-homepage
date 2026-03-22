import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Grid, List, SlidersHorizontal, ChevronDown } from 'lucide-react';
import ProductCard from './ProductCard';
import { productService } from '../services/productService';

const ProductGrid = () => {
  const [layout, setLayout] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Loading products from API...');
      const response = await productService.getProducts({ 
        sort: sortBy,
        page: pagination.page,
        limit: 12
      });
      
      console.log('✅ API Response:', response);
      
      // Xử lý nhiều format response khác nhau
      let productsData = [];
      let paginationData = { page: 1, total: 0, pages: 1 };
      
      if (response) {
        if (Array.isArray(response)) {
          // Trường hợp API trả về mảng trực tiếp
          productsData = response;
          paginationData = { page: 1, total: response.length, pages: 1 };
          console.log('📦 Received array with', response.length, 'products');
        } 
        else if (response.products && Array.isArray(response.products)) {
          // Trường hợp API trả về object có products field
          productsData = response.products;
          paginationData = response.pagination || { page: 1, total: response.products.length, pages: 1 };
          console.log('📦 Received paginated data with', response.products.length, 'products');
        }
        else if (response.data && Array.isArray(response.data)) {
          // Trường hợp API trả về trong data field
          productsData = response.data;
          paginationData = { page: 1, total: response.data.length, pages: 1 };
        }
      }
      
      console.log('🎯 Setting products:', productsData);
      setProducts(productsData);
      setPagination(paginationData);
      
    } catch (error) {
      console.error('❌ Error loading products:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = async (value) => {
    setSortBy(value);
    setLoading(true);
    try {
      const response = await productService.getProducts({ sort: value });
      if (Array.isArray(response)) {
        setProducts(response);
      } else if (response?.products) {
        setProducts(response.products);
      }
    } catch (error) {
      console.error('Error sorting:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' }
  ];

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-500">Error: {error}</p>
            <button 
              onClick={loadProducts}
              className="mt-4 px-4 py-2 bg-black text-white rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-black/5 pb-6">
          <div>
            <span className="text-xs text-black/40 tracking-[0.3em] uppercase block mb-3">
              Curated Selection
            </span>
            <h2 className="text-3xl font-light text-black tracking-[-0.02em]">
              Featured Products
            </h2>
            <p className="text-sm text-black/40 mt-2">
              {pagination.total} products available
            </p>
          </div>

          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none bg-transparent border border-black/10 px-4 py-2 pr-10 text-sm font-light text-black/60 hover:text-black focus:outline-none focus:border-black"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/40 pointer-events-none" />
            </div>

            <div className="flex items-center border border-black/10">
              <button
                onClick={() => setLayout('grid')}
                className={`p-2 transition-colors ${
                  layout === 'grid' ? 'bg-black text-white' : 'text-black/40 hover:text-black'
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setLayout('list')}
                className={`p-2 transition-colors ${
                  layout === 'list' ? 'bg-black text-white' : 'text-black/40 hover:text-black'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Debug info - chỉ hiển thị khi có sản phẩm */}
        {products.length > 0 && (
          <div className="mb-4 text-sm text-gray-500">
            Found {products.length} products
          </div>
        )}

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-black/40">No products found</p>
            <p className="text-xs text-gray-400 mt-2">Debug: API returned empty array</p>
          </div>
        ) : (
          <div
            className={
              layout === 'grid'
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12'
                : 'flex flex-col gap-8'
            }
          >
            {products.map((product, index) => {
              console.log('Rendering product:', product.id, product.name);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  layout={layout}
                />
              );
            })}
          </div>
        )}

        {/* Load More */}
        {pagination.page < pagination.pages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-16"
          >
            <button
              onClick={() => {
                setPagination(prev => ({ ...prev, page: prev.page + 1 }));
                loadProducts();
              }}
              className="group flex items-center gap-2 text-sm text-black/60 hover:text-black transition-colors"
            >
              <span className="border-b border-black/20 group-hover:border-black pb-0.5">
                Load More Products
              </span>
              <ChevronDown className="h-4 w-4 group-hover:translate-y-1 transition-transform" />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
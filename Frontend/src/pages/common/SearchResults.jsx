import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, Filter, Grid, List, ChevronDown,
  SlidersHorizontal, X, Star
} from 'lucide-react';
import ProductCard from '../../components/ProductCard';
import { productService } from '../../services/productService';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [layout, setLayout] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: false
  });
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 1
  });

  useEffect(() => {
    if (query) {
      loadSearchResults();
    }
  }, [query, sortBy, filters, pagination.page]);

  const loadSearchResults = async () => {
    setLoading(true);
    try {
      const params = {
        search: query,
        sort: sortBy !== 'relevance' ? sortBy : undefined,
        category: filters.category || undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        page: pagination.page,
        limit: 12
      };
      
      const response = await productService.getProducts(params);
      setProducts(response.products || []);
      setPagination(response.pagination || { page: 1, total: 0, pages: 1 });
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      inStock: false
    });
    setSortBy('relevance');
  };

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'newest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' }
  ];

  const categories = [
    'Electronics', 'Laptops', 'Phones', 'Audio', 
    'Tablets', 'Accessories', 'Wearables', 'Cameras',
    'Books', 'Clothing', 'Sports', 'Home & Garden'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-900">
            Search Results for "{query}"
          </h1>
          <p className="text-gray-500 mt-2">
            Found {pagination.total} products
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Sort */}
            <div className="flex-1 flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 bg-white"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    Sort by: {option.label}
                  </option>
                ))}
              </select>

              {/* Active Filters */}
              {(filters.category || filters.minPrice || filters.maxPrice) && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                >
                  <X className="h-4 w-4" />
                  Clear filters
                </button>
              )}
            </div>

            {/* Layout Toggle */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLayout('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  layout === 'grid' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setLayout('list')}
                className={`p-2 rounded-lg transition-colors ${
                  layout === 'list' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Category</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Min Price</label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    placeholder="$0"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Max Price</label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    placeholder="$1000+"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                  />
                </div>

                {/* In Stock */}
                <div className="flex items-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                      className="text-black"
                    />
                    <span className="text-sm text-gray-600">In Stock Only</span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-light text-gray-900 mb-2">No products found</h2>
            <p className="text-gray-500 mb-6">
              Try different keywords or remove filters
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Browse All Products
            </button>
          </div>
        ) : (
          <>
            <div className={
              layout === 'grid'
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'
                : 'space-y-4'
            }>
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  layout={layout}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
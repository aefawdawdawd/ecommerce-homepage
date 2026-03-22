import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Grid, List, SlidersHorizontal, ChevronDown, 
  X, Filter, Star, ArrowLeft, Home,
  Package, TrendingUp, Clock, CheckCircle,
  Heart, ShoppingCart, Eye, Truck, Shield,
  ChevronLeft, ChevronRight, SortAsc, SortDesc,
  Laptop, Smartphone, Headphones, Watch, Camera,
  Gamepad, Speaker, Tablet, Printer, HardDrive,
  Sparkles, Zap, Gift, Award, ThumbsUp
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { productService } from '../services/productService';

// Icon mapping cho các danh mục
const categoryIcons = {
  'Electronics': <Laptop className="h-8 w-8" />,
  'Laptops': <Laptop className="h-8 w-8" />,
  'Phones': <Smartphone className="h-8 w-8" />,
  'Audio': <Headphones className="h-8 w-8" />,
  'Wearables': <Watch className="h-8 w-8" />,
  'Accessories': <Speaker className="h-8 w-8" />,
  'Cameras': <Camera className="h-8 w-8" />,
  'Gaming': <Gamepad className="h-8 w-8" />,
  'Tablets': <Tablet className="h-8 w-8" />,
  'Printers': <Printer className="h-8 w-8" />,
  'Storage': <HardDrive className="h-8 w-8" />
};

// Màu sắc gradient cho các category
const categoryColors = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-red-500',
  'from-indigo-500 to-purple-500',
  'from-yellow-500 to-orange-500',
  'from-pink-500 to-rose-500',
  'from-cyan-500 to-blue-500',
];

// Hàm xử lý images an toàn
const getProductImage = (product) => {
  if (!product || !product.images) return 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&auto=format';
  
  try {
    if (typeof product.images === 'string') {
      // Kiểm tra nếu là JSON array
      if (product.images.trim().startsWith('[')) {
        const parsed = JSON.parse(product.images);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (parsed[0].startsWith('/')) {
            return `http://localhost:5000${parsed[0]}`;
          }
          return parsed[0];
        }
      } else {
        // Nếu là string đơn
        if (product.images.startsWith('/')) {
          return `http://localhost:5000${product.images}`;
        }
        return product.images;
      }
    } else if (Array.isArray(product.images) && product.images.length > 0) {
      if (product.images[0].startsWith('/')) {
        return `http://localhost:5000${product.images[0]}`;
      }
      return product.images[0];
    }
  } catch (e) {
    console.log('Lỗi parse image:', e);
  }
  
  return 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&auto=format';
};

const CategoryProducts = () => {
  const navigate = useNavigate();
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 1,
    limit: 40
  });

  // Filters state
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    inStock: false,
    selectedBrands: [],
    selectedRatings: [],
    freeShipping: false
  });

  // Temporary filters
  const [tempFilters, setTempFilters] = useState({ ...filters });

  // Load tất cả categories từ database khi component mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Load products khi chọn category hoặc sort/page thay đổi
  useEffect(() => {
    if (selectedCategory) {
      loadProducts();
    }
  }, [selectedCategory, sortBy, pagination.page]);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('📡 Đang tải categories...');
      const response = await productService.getProducts({ limit: 1000 });
      const allProducts = response.products || [];
      console.log('✅ Đã nhận', allProducts.length, 'sản phẩm');
      
      const categoryStats = {};
      allProducts.forEach(product => {
        if (product.category) {
          if (!categoryStats[product.category]) {
            categoryStats[product.category] = {
              count: 0,
              products: []
            };
          }
          categoryStats[product.category].count++;
          categoryStats[product.category].products.push(product);
        }
      });

      const categoriesList = Object.keys(categoryStats).map((cat, index) => {
        const firstProduct = categoryStats[cat].products[0];
        const imageUrl = getProductImage(firstProduct);
        
        return {
          id: cat,
          name: cat,
          count: categoryStats[cat].count,
          icon: categoryIcons[cat] || <Package className="h-8 w-8" />,
          image: imageUrl,
          color: categoryColors[index % categoryColors.length],
          description: `Khám phá ${categoryStats[cat].count} sản phẩm ${cat.toLowerCase()} chất lượng cao`
        };
      });

      console.log('✅ Categories list:', categoriesList);
      setCategories(categoriesList);
    } catch (err) {
      console.error('❌ Lỗi khi tải categories:', err);
      setError('Không thể tải danh mục sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async () => {
    if (!selectedCategory) return;
    
    setProductsLoading(true);
    try {
      const params = {
        category: selectedCategory.id,
        sort: sortBy,
        page: pagination.page,
        limit: pagination.limit
      };

      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.inStock) params.inStock = true;

      const response = await productService.getProducts(params);
      
      setProducts(response.products || []);
      setPagination(prev => ({
        ...prev,
        total: response.pagination?.total || 0,
        pages: response.pagination?.pages || 1
      }));
    } catch (err) {
      console.error('❌ Lỗi khi tải sản phẩm:', err);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    setPagination(prev => ({ ...prev, page: 1 }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setProducts([]);
    setFilters({
      minPrice: '',
      maxPrice: '',
      inStock: false,
      selectedBrands: [],
      selectedRatings: [],
      freeShipping: false
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleApplyFilters = () => {
    setFilters({ ...tempFilters });
    setPagination(prev => ({ ...prev, page: 1 }));
    setShowMobileFilter(false);
  };

  const handleClearFilters = () => {
    const cleared = {
      minPrice: '',
      maxPrice: '',
      inStock: false,
      selectedBrands: [],
      selectedRatings: [],
      freeShipping: false
    };
    setTempFilters(cleared);
    setFilters(cleared);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const sortOptions = [
    { value: 'newest', label: 'Mới nhất', icon: Clock },
    { value: 'price_asc', label: 'Giá: Thấp đến cao', icon: SortAsc },
    { value: 'price_desc', label: 'Giá: Cao đến thấp', icon: SortDesc },
    { value: 'rating', label: 'Đánh giá cao nhất', icon: Star },
  ];

  const activeFilterCount = () => {
    let count = 0;
    if (filters.minPrice) count++;
    if (filters.maxPrice) count++;
    if (filters.inStock) count++;
    return count;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-black animate-pulse" />
            </div>
          </div>
          <p className="text-gray-600 font-light">Đang tải danh mục sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-light text-gray-900 mb-3">Có lỗi xảy ra</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header với breadcrumb */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <button 
              onClick={() => navigate('/')} 
              className="text-gray-500 hover:text-black transition-colors flex items-center gap-1 group"
            >
              <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span>Trang chủ</span>
            </button>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <span className="text-black font-medium bg-gray-100 px-3 py-1 rounded-full">
              Danh mục sản phẩm
            </span>
            {selectedCategory && (
              <>
                <ChevronRight className="h-3 w-3 text-gray-400" />
                <button 
                  onClick={handleBackToCategories}
                  className="text-black font-medium hover:underline bg-black/5 px-3 py-1 rounded-full flex items-center gap-1"
                >
                  <ArrowLeft className="h-3 w-3" />
                  {selectedCategory.name}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedCategory ? (
          // Hiển thị tất cả categories
          <>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-light text-gray-900">
                Danh mục sản phẩm
              </h1>
              <p className="text-base text-gray-500 max-w-2xl mx-auto mt-2">
                Khám phá hàng ngàn sản phẩm chất lượng cao từ các thương hiệu hàng đầu
              </p>
            </motion.div>
            
            {categories.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
                <Package className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                <h2 className="text-2xl font-light text-gray-900 mb-3">Chưa có danh mục nào</h2>
                <p className="text-gray-500">Hiện tại chưa có sản phẩm nào trong hệ thống.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                    onClick={() => handleSelectCategory(category)}
                    className="group cursor-pointer"
                  >
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
                      <div className="relative h-48 overflow-hidden">
                        <div className={`absolute inset-0 bg-linear-to-br ${category.color} opacity-90 group-hover:opacity-100 transition-opacity duration-300`} />
                        <img 
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover mix-blend-overlay group-hover:scale-110 transition-transform duration-700"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&auto=format';
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white transform group-hover:scale-110 transition-all duration-300">
                            {category.icon}
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-medium text-gray-900 mb-2">{category.name}</h3>
                        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{category.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-black bg-gray-100 px-3 py-1 rounded-full">
                            {category.count} sản phẩm
                          </span>
                          <span className="text-sm text-black group-hover:translate-x-2 transition-transform flex items-center gap-1">
                            Xem ngay
                            <ChevronRight className="h-4 w-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        ) : (
          // Hiển thị sản phẩm trong category được chọn
          <>
            {/* Category Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-8"
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={handleBackToCategories}
                  className="w-10 h-10 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center group shrink-0"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:-translate-x-1 transition-transform" />
                </button>
                
                <div className="flex items-center gap-4 flex-1">
                  {/* Icon với gradient */}
                  <div className="w-14 h-14 bg-linear-to-br from-black to-gray-700 rounded-xl flex items-center justify-center text-white shadow-md shrink-0">
                    {selectedCategory.icon}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h1 className="text-2xl md:text-3xl font-light text-gray-900">
                        {selectedCategory.name}
                      </h1>
                      <span className="px-3 py-1 bg-black/5 text-black text-sm rounded-full whitespace-nowrap">
                        {pagination.total} sản phẩm
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Cập nhật: {new Date().toLocaleDateString('vi-VN')}
                      </span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full hidden sm:block"></span>
                      <span className="flex items-center gap-1">
                        <Truck className="h-4 w-4" />
                        Miễn phí vận chuyển
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mobile filter button */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setShowMobileFilter(true)}
                className="w-full bg-white rounded-xl shadow-md p-4 flex items-center justify-between hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                    <Filter className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="font-medium block">Bộ lọc</span>
                    {activeFilterCount() > 0 && (
                      <span className="text-xs text-gray-500">{activeFilterCount()} bộ lọc đang áp dụng</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </button>
            </div>

            <div className="flex gap-8">
              {/* Sidebar filters - Desktop */}
              <div className="hidden lg:block w-72 shrink-0">
                <div className="bg-white rounded-2xl shadow-lg sticky top-24 overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="font-medium flex items-center gap-2 text-lg">
                      <Filter className="h-5 w-5" />
                      Bộ lọc tìm kiếm
                    </h3>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Khoảng giá */}
                    <div>
                      <h4 className="font-medium mb-4">Khoảng giá</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            value={tempFilters.minPrice}
                            onChange={(e) => setTempFilters({ ...tempFilters, minPrice: e.target.value })}
                            placeholder="Từ"
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
                          />
                          <span className="text-gray-400">—</span>
                          <input
                            type="number"
                            value={tempFilters.maxPrice}
                            onChange={(e) => setTempFilters({ ...tempFilters, maxPrice: e.target.value })}
                            placeholder="Đến"
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Tình trạng */}
                    <div>
                      <h4 className="font-medium mb-4">Tình trạng</h4>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={tempFilters.inStock}
                            onChange={(e) => setTempFilters({ ...tempFilters, inStock: e.target.checked })}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 border-2 rounded transition-colors ${
                            tempFilters.inStock 
                              ? 'bg-black border-black' 
                              : 'border-gray-300 group-hover:border-gray-400'
                          }`}>
                            {tempFilters.inStock && (
                              <CheckCircle className="h-4 w-4 text-white absolute top-0.5 left-0.5" />
                            )}
                          </div>
                        </div>
                        <span className="text-sm text-gray-700">Chỉ hiển thị sản phẩm còn hàng</span>
                      </label>
                    </div>
                  </div>

                  <div className="p-6 border-t border-gray-100 bg-gray-50">
                    <div className="flex gap-3">
                      <button
                        onClick={handleClearFilters}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-white transition-colors"
                      >
                        Xóa tất cả
                      </button>
                      <button
                        onClick={handleApplyFilters}
                        className="flex-1 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
                      >
                        Áp dụng
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product grid */}
              <div className="flex-1">
                {/* Top bar */}
                <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 hidden lg:flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <span className="text-sm text-gray-500">
                      Hiển thị <span className="font-medium text-black">{products.length}</span> trên tổng số <span className="font-medium text-black">{pagination.total}</span> sản phẩm
                    </span>
                    <div className="flex items-center gap-2 border-l border-gray-200 pl-6">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-all ${
                          viewMode === 'grid' 
                            ? 'bg-black text-white shadow-md' 
                            : 'text-gray-400 hover:text-black hover:bg-gray-100'
                        }`}
                      >
                        <Grid className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-all ${
                          viewMode === 'list' 
                            ? 'bg-black text-white shadow-md' 
                            : 'text-gray-400 hover:text-black hover:bg-gray-100'
                        }`}
                      >
                        <List className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">Sắp xếp:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-black bg-white cursor-pointer hover:border-gray-300 transition-colors"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Products */}
                {productsLoading ? (
                  <div className="flex justify-center py-20">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
                      <Sparkles className="h-6 w-6 text-black absolute top-5 left-5 animate-pulse" />
                    </div>
                  </div>
                ) : products.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
                    <Package className="h-20 w-20 text-gray-300 mx-auto mb-6" />
                    <h2 className="text-2xl font-light text-gray-900 mb-3">Không tìm thấy sản phẩm</h2>
                    <p className="text-gray-500 mb-6">Không có sản phẩm nào trong danh mục này.</p>
                    <button
                      onClick={handleClearFilters}
                      className="px-8 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg"
                    >
                      Xóa bộ lọc
                    </button>
                  </div>
                ) : (
                  <>
                    <div className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                        : 'space-y-4'
                    }>
                      {products.map((product, index) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          index={index}
                          layout={viewMode}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                      <div className="flex justify-center mt-12">
                        <div className="flex items-center gap-2 bg-white rounded-xl shadow-lg p-2">
                          <button
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                            disabled={pagination.page === 1}
                            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                          
                          {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                            const pageNum = i + 1;
                            const isActive = pagination.page === pageNum;
                            return (
                              <button
                                key={i}
                                onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                                className={`w-10 h-10 rounded-lg font-medium transition-all ${
                                  isActive
                                    ? 'bg-black text-white shadow-md scale-110'
                                    : 'hover:bg-gray-100 text-gray-700'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                          
                          {pagination.pages > 5 && (
                            <>
                              <span className="px-2 text-gray-400">...</span>
                              <button
                                onClick={() => setPagination(prev => ({ ...prev, page: pagination.pages }))}
                                className="w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
                              >
                                {pagination.pages}
                              </button>
                            </>
                          )}
                          
                          <button
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                            disabled={pagination.page === pagination.pages}
                            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Mobile Filter Modal */}
            <AnimatePresence>
              {showMobileFilter && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/50 lg:hidden"
                  onClick={() => setShowMobileFilter(false)}
                >
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="h-full flex flex-col">
                      {/* Header */}
                      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h3 className="font-medium text-lg">Bộ lọc</h3>
                        <button
                          onClick={() => setShowMobileFilter(false)}
                          className="w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Filter content */}
                      <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Khoảng giá */}
                        <div>
                          <h4 className="font-medium mb-4">Khoảng giá</h4>
                          <div className="space-y-3">
                            <input
                              type="number"
                              value={tempFilters.minPrice}
                              onChange={(e) => setTempFilters({ ...tempFilters, minPrice: e.target.value })}
                              placeholder="Giá từ"
                              className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm"
                            />
                            <input
                              type="number"
                              value={tempFilters.maxPrice}
                              onChange={(e) => setTempFilters({ ...tempFilters, maxPrice: e.target.value })}
                              placeholder="Giá đến"
                              className="w-full px-4 py-2 border border-gray-200 rounded-xl text-sm"
                            />
                          </div>
                        </div>

                        {/* Tình trạng */}
                        <div>
                          <h4 className="font-medium mb-4">Tình trạng</h4>
                          <label className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={tempFilters.inStock}
                              onChange={(e) => setTempFilters({ ...tempFilters, inStock: e.target.checked })}
                              className="w-4 h-4 text-black rounded"
                            />
                            <span className="text-sm">Còn hàng</span>
                          </label>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="p-6 border-t border-gray-100 bg-gray-50">
                        <div className="flex gap-3">
                          <button
                            onClick={handleClearFilters}
                            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-white transition-colors"
                          >
                            Xóa
                          </button>
                          <button
                            onClick={handleApplyFilters}
                            className="flex-1 px-4 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
                          >
                            Áp dụng
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
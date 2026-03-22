import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ShoppingBag, Menu, X, User, LogOut, 
  ChevronDown, Heart, Package, Settings, Home,
  Grid, ShoppingCart, Phone, Mail, HelpCircle,
  BarChart3, Users, Shield, DollarSign, PlusCircle,
  Star, TrendingUp, Award, Camera, Gift, Info,
  HeadphonesIcon, MessageCircle, ChevronRight, Truck,
  Clock, CheckCircle, AlertCircle, Globe,
  Laptop, Smartphone, Headphones, Watch, Camera as CameraIcon,
  Gamepad, Speaker, Tablet, Printer, HardDrive
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { productService } from '../services/productService';
import { cartService } from '../services/cartService';
import { useToast } from '../context/ToastContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSupportMenuOpen, setIsSupportMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [categories, setCategories] = useState([]);
  
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const supportMenuRef = useRef(null);

  // Icon mapping cho các danh mục
  const categoryIcons = {
    'Electronics': <Laptop className="h-4 w-4" />,
    'Laptops': <Laptop className="h-4 w-4" />,
    'Phones': <Smartphone className="h-4 w-4" />,
    'Audio': <Headphones className="h-4 w-4" />,
    'Wearables': <Watch className="h-4 w-4" />,
    'Accessories': <Speaker className="h-4 w-4" />,
    'Cameras': <CameraIcon className="h-4 w-4" />,
    'Gaming': <Gamepad className="h-4 w-4" />,
    'Tablets': <Tablet className="h-4 w-4" />,
    'Printers': <Printer className="h-4 w-4" />,
    'Storage': <HardDrive className="h-4 w-4" />
  };

  // Load categories từ database
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await productService.getProducts({ limit: 1000 });
      const allProducts = response.products || [];
      
      // Thống kê categories từ dữ liệu thật
      const categoryStats = {};
      allProducts.forEach(product => {
        if (product.category) {
          if (!categoryStats[product.category]) {
            categoryStats[product.category] = 0;
          }
          categoryStats[product.category]++;
        }
      });

      // Chuyển đổi thành mảng categories
      const categoriesList = Object.keys(categoryStats).map(cat => ({
        id: cat,
        name: cat,
        count: categoryStats[cat],
        icon: categoryIcons[cat] || <Package className="h-4 w-4" />
      }));

      setCategories(categoriesList);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  // Load cart count
  useEffect(() => {
    if (isAuthenticated) {
      loadCartCount();
    } else {
      setCartCount(0);
    }
  }, [isAuthenticated]);

  const loadCartCount = async () => {
    try {
      const cart = await cartService.getCart();
      setCartCount(cart.itemCount || 0);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  // Lắng nghe sự kiện cập nhật giỏ hàng
  useEffect(() => {
    const handleCartUpdate = () => {
      if (isAuthenticated) {
        loadCartCount();
      }
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, [isAuthenticated]);

  // Xử lý scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Đóng dropdown khi click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (supportMenuRef.current && !supportMenuRef.current.contains(event.target)) {
        setIsSupportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await productService.getProducts({ search: searchQuery });
      setSearchResults(results.products || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
    showToast('Đăng xuất thành công', 'success');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Hàm xử lý images an toàn cho search results
  const getProductImage = (product) => {
    if (!product) return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=40&auto=format';
    
    let imageUrl = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=40&auto=format';
    
    if (product.images) {
      try {
        if (typeof product.images === 'string') {
          if (product.images.trim().startsWith('[')) {
            const parsed = JSON.parse(product.images);
            if (Array.isArray(parsed) && parsed.length > 0) {
              imageUrl = parsed[0];
            }
          } else {
            imageUrl = product.images;
          }
        } else if (Array.isArray(product.images) && product.images.length > 0) {
          imageUrl = product.images[0];
        }
      } catch (e) {
        console.log('Image parse error:', e);
        if (typeof product.images === 'string') {
          imageUrl = product.images;
        }
      }
    }
    
    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
      imageUrl = `http://localhost:5000${imageUrl}`;
    }
    
    return imageUrl;
  };

  // Animation variants
  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.8
      }
    }
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    exit: { 
      opacity: 0, 
      y: -10, 
      scale: 0.95,
      transition: {
        duration: 0.2
      }
    }
  };

  // Liên kết hỗ trợ
  const supportLinks = [
    { name: 'Trung tâm trợ giúp', icon: HelpCircle, href: '/support', description: 'Giải đáp thắc mắc' },
    { name: 'Liên hệ', icon: Phone, href: '/contact', description: 'Gọi cho chúng tôi' },
    { name: 'Email', icon: Mail, href: '/contact#email', description: 'Gửi email hỗ trợ' },
    { name: 'FAQ', icon: MessageCircle, href: '/faq', description: 'Câu hỏi thường gặp' },
    { name: 'Về chúng tôi', icon: Info, href: '/about', description: 'Tìm hiểu về G2 Tech' },
  ];

  return (
    <>
      <motion.nav
        variants={navVariants}
        initial="hidden"
        animate="visible"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg' 
            : 'bg-white/98 backdrop-blur-sm'
        } border-b border-gray-200`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="shrink-0"
            >
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">G2</span>
                </div>
                <span className="text-xl font-light tracking-tight hidden sm:block">
                  Tech<span className="font-medium">Store</span>
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation - Center */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <Link to="/" className="px-3 py-2 rounded-lg text-gray-700 hover:text-black hover:bg-gray-100 transition-all">
                Trang chủ
              </Link>
              
              {/* Nút Danh mục - trỏ thẳng đến trang category */}
              <Link 
                to="/category" 
                className="px-3 py-2 rounded-lg text-gray-700 hover:text-black hover:bg-gray-100 transition-all flex items-center space-x-1"
              >
                <Grid className="h-4 w-4" />
                <span>Danh mục</span>
              </Link>

              {/* Trung tâm hỗ trợ Dropdown */}
              <div className="relative" ref={supportMenuRef}>
                <button
                  onClick={() => setIsSupportMenuOpen(!isSupportMenuOpen)}
                  className="px-3 py-2 rounded-lg text-gray-700 hover:text-black hover:bg-gray-100 transition-all flex items-center space-x-1"
                >
                  <HeadphonesIcon className="h-4 w-4" />
                  <span>Trung tâm hỗ trợ</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isSupportMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isSupportMenuOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                    >
                      <div className="p-2">
                        {supportLinks.map((link) => {
                          const Icon = link.icon;
                          return (
                            <Link
                              key={link.name}
                              to={link.href}
                              onClick={() => setIsSupportMenuOpen(false)}
                              className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                            >
                              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200">
                                <Icon className="h-4 w-4 text-gray-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{link.name}</p>
                                <p className="text-xs text-gray-500">{link.description}</p>
                              </div>
                              <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Liên hệ */}
              <Link to="/contact" className="px-3 py-2 rounded-lg text-gray-700 hover:text-black hover:bg-gray-100 transition-all flex items-center space-x-1">
                <Phone className="h-4 w-4" />
                <span>Liên hệ</span>
              </Link>

              {/* Về chúng tôi */}
              <Link to="/about" className="px-3 py-2 rounded-lg text-gray-700 hover:text-black hover:bg-gray-100 transition-all flex items-center space-x-1">
                <Info className="h-4 w-4" />
                <span>Về chúng tôi</span>
              </Link>
              
              {/* Nút đăng sản phẩm - chỉ hiện với seller và admin */}
              {(user?.role === 'seller' || user?.role === 'admin') && (
                <Link to="/sell" className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-all flex items-center space-x-2 shadow-md ml-2">
                  <PlusCircle className="h-4 w-4" />
                  <span>Đăng sản phẩm</span>
                </Link>
              )}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search Button - Desktop */}
              <div className="hidden md:block relative" ref={searchRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 rounded-lg text-gray-600 hover:text-black hover:bg-gray-100 transition-colors relative"
                >
                  <Search className="h-5 w-5" />
                </motion.button>

                <AnimatePresence>
                  {isSearchOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                    >
                      <form onSubmit={handleSearchSubmit} className="p-3">
                        <div className="relative">
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm kiếm sản phẩm..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                            autoFocus
                          />
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          {isSearching && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          )}
                        </div>

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                          <div className="mt-3 border-t border-gray-100 pt-3 max-h-80 overflow-y-auto">
                            {searchResults.slice(0, 5).map((product) => {
                              const productImage = getProductImage(product);
                              
                              return (
                                <Link
                                  key={product.id}
                                  to={`/product/${product.id}`}
                                  onClick={() => setIsSearchOpen(false)}
                                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors group"
                                >
                                  <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                    <img 
                                      src={productImage}
                                      alt={product.name}
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                                      onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=40&auto=format';
                                      }}
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate group-hover:text-black">
                                      {product.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price * 23000)}
                                    </p>
                                  </div>
                                </Link>
                              );
                            })}
                            
                            {searchResults.length > 5 && (
                              <button
                                onClick={handleSearchSubmit}
                                className="w-full mt-2 text-sm text-center text-gray-500 hover:text-black py-2 hover:bg-gray-50 rounded-lg transition-colors"
                              >
                                Xem tất cả {searchResults.length} kết quả →
                              </button>
                            )}
                          </div>
                        )}
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                {isAuthenticated ? (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white">
                        {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                      </div>
                      <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </motion.button>

                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                        >
                          <div className="p-3 border-b border-gray-100">
                            <p className="font-medium text-gray-900">{user?.full_name || user?.username}</p>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                            <p className="text-xs text-gray-400 mt-1 capitalize">
                              {user?.role === 'user' ? 'Người mua' : 
                               user?.role === 'seller' ? 'Người bán' : 
                               user?.role === 'admin' ? 'Quản trị viên' : user?.role}
                            </p>
                          </div>
                          <div className="p-2">
                            {/* Common Links */}
                            <Link
                              to="/profile"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <User className="h-5 w-5 text-gray-400" />
                              <span>Hồ sơ của tôi</span>
                            </Link>

                            {/* Buyer Links */}
                            {user?.role === 'user' && (
                              <>
                                <Link
                                  to="/orders"
                                  onClick={() => setIsUserMenuOpen(false)}
                                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <Package className="h-5 w-5 text-gray-400" />
                                  <span>Đơn hàng của tôi</span>
                                </Link>
                                <Link
                                  to="/wishlist"
                                  onClick={() => setIsUserMenuOpen(false)}
                                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <Heart className="h-5 w-5 text-gray-400" />
                                  <span>Yêu thích</span>
                                </Link>
                              </>
                            )}

                            {/* Seller Links */}
                            {user?.role === 'seller' && (
                              <>
                                <Link
                                  to="/seller/dashboard"
                                  onClick={() => setIsUserMenuOpen(false)}
                                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <Package className="h-5 w-5 text-gray-400" />
                                  <span>Bảng điều khiển</span>
                                </Link>
                                <Link
                                  to="/seller/orders"
                                  onClick={() => setIsUserMenuOpen(false)}
                                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <Truck className="h-5 w-5 text-gray-400" />
                                  <span>Đơn hàng</span>
                                </Link>
                                <Link
                                  to="/seller/products"
                                  onClick={() => setIsUserMenuOpen(false)}
                                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <Package className="h-5 w-5 text-gray-400" />
                                  <span>Sản phẩm của tôi</span>
                                </Link>
                                <Link
                                  to="/seller/revenue"
                                  onClick={() => setIsUserMenuOpen(false)}
                                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <DollarSign className="h-5 w-5 text-gray-400" />
                                  <span>Doanh thu</span>
                                </Link>
                              </>
                            )}

                            {/* Admin Links */}
                            {user?.role === 'admin' && (
                              <>
                                <Link
                                  to="/admin/dashboard"
                                  onClick={() => setIsUserMenuOpen(false)}
                                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <Shield className="h-5 w-5 text-gray-400" />
                                  <span>Bảng điều khiển</span>
                                </Link>
                                <Link
                                  to="/admin/users"
                                  onClick={() => setIsUserMenuOpen(false)}
                                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <Users className="h-5 w-5 text-gray-400" />
                                  <span>Người dùng</span>
                                </Link>
                                <Link
                                  to="/admin/orders"
                                  onClick={() => setIsUserMenuOpen(false)}
                                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <Package className="h-5 w-5 text-gray-400" />
                                  <span>Tất cả đơn hàng</span>
                                </Link>
                                <Link
                                  to="/admin/products"
                                  onClick={() => setIsUserMenuOpen(false)}
                                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <Grid className="h-5 w-5 text-gray-400" />
                                  <span>Sản phẩm</span>
                                </Link>
                                <Link
                                  to="/admin/categories"
                                  onClick={() => setIsUserMenuOpen(false)}
                                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <Settings className="h-5 w-5 text-gray-400" />
                                  <span>Danh mục</span>
                                </Link>
                                <Link
                                  to="/admin/reports"
                                  onClick={() => setIsUserMenuOpen(false)}
                                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <BarChart3 className="h-5 w-5 text-gray-400" />
                                  <span>Báo cáo</span>
                                </Link>
                              </>
                            )}
                          </div>
                          <div className="p-2 border-t border-gray-100">
                            <button
                              onClick={handleLogout}
                              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors w-full text-left text-red-600"
                            >
                              <LogOut className="h-5 w-5" />
                              <span>Đăng xuất</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <div className="hidden md:flex items-center space-x-2">
                    <Link to="/login">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        Đăng nhập
                      </motion.button>
                    </Link>
                    <Link to="/register">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors shadow-md"
                      >
                        Đăng ký
                      </motion.button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link to="/cart">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg text-gray-600 hover:text-black hover:bg-gray-100 transition-colors relative"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </motion.button>
              </Link>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 hover:text-black hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden py-3 border-t border-gray-100"
              >
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black transition-colors"
                    autoFocus
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  {searchQuery && (
                    <button
                      type="submit"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-black font-medium"
                    >
                      Tìm
                    </button>
                  )}
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-3">
                {/* Search in mobile */}
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>

                {/* Mobile Navigation Links */}
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Home className="h-5 w-5 text-gray-400" />
                  <span>Trang chủ</span>
                </Link>

                <Link
                  to="/category"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Grid className="h-5 w-5 text-gray-400" />
                  <span>Danh mục</span>
                </Link>

                {/* Mobile Support Links */}
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 uppercase tracking-wider px-3">Hỗ trợ</p>
                  <Link
                    to="/support"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <HelpCircle className="h-5 w-5 text-gray-400" />
                    <span>Trung tâm trợ giúp</span>
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span>Liên hệ</span>
                  </Link>
                  <Link
                    to="/about"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Info className="h-5 w-5 text-gray-400" />
                    <span>Về chúng tôi</span>
                  </Link>
                  <Link
                    to="/faq"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <MessageCircle className="h-5 w-5 text-gray-400" />
                    <span>Câu hỏi thường gặp</span>
                  </Link>
                </div>

                {/* Nút đăng bài trên mobile */}
                {isAuthenticated && (user?.role === 'seller' || user?.role === 'admin') && (
                  <Link
                    to="/sell"
                    onClick={() => setIsMenuOpen(false)}
                    className="mt-4 block w-full py-3 bg-black text-white rounded-lg text-center font-medium"
                  >
                    <PlusCircle className="h-5 w-5 inline mr-2" />
                    Đăng sản phẩm
                  </Link>
                )}

                {/* User links khi chưa đăng nhập */}
                {!isAuthenticated && (
                  <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full py-2 px-4 text-center border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full py-2 px-4 text-center bg-black text-white rounded-lg hover:bg-gray-800"
                    >
                      Đăng ký
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Spacer */}
      <div className="h-16 md:h-20" />
    </>
  );
};

export default Navbar;
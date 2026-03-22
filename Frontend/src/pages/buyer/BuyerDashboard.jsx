import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, Heart, Clock, DollarSign,
  ShoppingBag, Star, TrendingUp, Award,
  ChevronRight, Bell, Gift, Truck, User,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import { wishlistService } from '../../services/wishlistService';

// Default image fallback - dùng ảnh từ Unsplash thay vì placeholder.com
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&auto=format';

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    wishlistCount: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBuyerData();
  }, []);

  const loadBuyerData = async () => {
    setLoading(true);
    try {
      // Load orders
      const ordersResponse = await orderService.getBuyerOrders();
      const orders = ordersResponse.orders || [];
      
      // Load wishlist
let wishlistData = [];
try {
  wishlistData = await wishlistService.getWishlist(user.id);
} catch (error) {
  console.log('Using empty wishlist while API is being set up');
  wishlistData = [];
}      
      // Load recommended products
      const productsResponse = await productService.getProducts({ 
        limit: 4,
        sort: 'rating'
      });
      
      const totalSpent = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);
      
      setStats({
        totalOrders: orders.length,
        totalSpent,
        wishlistCount: wishlistData.length,
        pendingOrders: orders.filter(o => o.status === 'pending').length
      });
      
      setRecentOrders(orders.slice(0, 3));
      setWishlist(wishlistData.slice(0, 3));
      setRecommendations(productsResponse.products?.slice(0, 4) || []);
      
      // Generate recent activities
      const activities = [];
      
      // Add order activities
      orders.slice(0, 2).forEach(order => {
        activities.push({
          id: `order-${order.id}`,
          type: 'order',
          title: `Order #${order.id} ${order.status}`,
          description: `Total: $${Number(order.total_amount).toFixed(2)}`,
          time: new Date(order.created_at),
          icon: Package,
          iconColor: 'bg-blue-100 text-blue-600',
          link: `/orders/${order.id}`
        });
      });
      
      // Add wishlist activities
      wishlistData.slice(0, 2).forEach(item => {
        activities.push({
          id: `wishlist-${item.id}`,
          type: 'wishlist',
          title: `Added to wishlist`,
          description: item.name,
          time: new Date(item.created_at),
          icon: Heart,
          iconColor: 'bg-red-100 text-red-600',
          link: `/product/${item.product_id}`
        });
      });
      
      // Sort by time (newest first)
      activities.sort((a, b) => b.time - a.time);
      setRecentActivities(activities.slice(0, 3));
      
    } catch (error) {
      console.error('Error loading buyer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Hàm xử lý images an toàn
  const getProductImage = (product) => {
    if (!product) return DEFAULT_IMAGE;
    
    let imageUrl = DEFAULT_IMAGE;
    
    if (product.images) {
      try {
        if (typeof product.images === 'string') {
          // Kiểm tra nếu là JSON array
          if (product.images.trim().startsWith('[')) {
            const parsed = JSON.parse(product.images);
            if (Array.isArray(parsed) && parsed.length > 0) {
              imageUrl = parsed[0];
            }
          } else {
            // Là string đơn (đường dẫn trực tiếp)
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
    
    // Thêm base URL nếu cần
    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
      imageUrl = `http://localhost:5000${imageUrl}`;
    }
    
    return imageUrl;
  };

  // Format time relative
  const getRelativeTime = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const statCards = [
    { 
      icon: Package, 
      label: 'Total Orders', 
      value: stats.totalOrders, 
      color: 'bg-blue-500', 
      link: '/orders',
      bgColor: 'bg-blue-50'
    },
    { 
      icon: DollarSign, 
      label: 'Total Spent', 
      value: `$${stats.totalSpent.toFixed(2)}`, 
      color: 'bg-green-500', 
      link: '/orders',
      bgColor: 'bg-green-50'
    },
    { 
      icon: Heart, 
      label: 'Wishlist', 
      value: stats.wishlistCount, 
      color: 'bg-red-500', 
      link: '/wishlist',
      bgColor: 'bg-red-50'
    },
    { 
      icon: Clock, 
      label: 'Pending', 
      value: stats.pendingOrders, 
      color: 'bg-yellow-500', 
      link: '/orders?status=pending',
      bgColor: 'bg-yellow-50'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header with Logout */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between"
        >
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <div className="w-14 h-14 bg-linear-to-br from-gray-800 to-black rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-medium">
                {user?.full_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <h1 className="text-3xl font-light text-gray-900">
                Welcome back, <span className="font-medium">{user?.full_name || user?.username}</span>!
              </h1>
              <p className="text-gray-500 mt-1">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all flex items-center gap-2 self-start"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                onClick={() => navigate(stat.link)}
                className="bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-2xl font-light text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-400 flex items-center gap-1">
                  <span>Click to view</span>
                  <ChevronRight className="h-3 w-3" />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-light">Recent Orders</h2>
                <button
                  onClick={() => navigate('/orders')}
                  className="text-sm text-gray-500 hover:text-black flex items-center gap-1 group"
                >
                  View All
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {recentOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">No orders yet</p>
                  <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Package className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${Number(order.total_amount).toFixed(2)}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Wishlist Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-light">Wishlist</h2>
                <button
                  onClick={() => navigate('/wishlist')}
                  className="text-sm text-gray-500 hover:text-black flex items-center gap-1 group"
                >
                  View All
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {wishlist.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Your wishlist is empty</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {wishlist.map((item) => {
                    const itemImage = item.images ? getProductImage(item) : DEFAULT_IMAGE;
                    
                    return (
                      <div
                        key={item.id}
                        onClick={() => navigate(`/product/${item.product_id}`)}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
                      >
                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                          <img 
                            src={itemImage}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                            onError={(e) => {
                              e.target.src = DEFAULT_IMAGE;
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 truncate group-hover:text-black">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            ${Number(item.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* Recommended for You */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-light mb-4">Recommended for You</h2>
              <div className="space-y-3">
                {recommendations.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No recommendations yet</p>
                ) : (
                  recommendations.map((product) => {
                    const productImage = getProductImage(product);
                    
                    return (
                      <div
                        key={product.id}
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group"
                      >
                        <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                          <img 
                            src={productImage}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
                            onError={(e) => {
                              e.target.src = DEFAULT_IMAGE;
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 truncate group-hover:text-black">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            ${Number(product.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <button
            onClick={() => navigate('/')}
            className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-left flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
              <ShoppingBag className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="font-medium">Continue Shopping</p>
              <p className="text-sm text-gray-500">Explore new products</p>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/orders')}
            className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-left flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
              <Truck className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="font-medium">Track Orders</p>
              <p className="text-sm text-gray-500">View order status</p>
            </div>
          </button>
          
          <button
            onClick={() => navigate('/profile')}
            className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all text-left flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="font-medium">Your Profile</p>
              <p className="text-sm text-gray-500">Manage your account</p>
            </div>
          </button>
        </motion.div>

        {/* Recent Activity Feed */}
        {recentActivities.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 bg-white rounded-xl shadow-sm p-6"
          >
            <h2 className="text-xl font-light mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    onClick={() => navigate(activity.link)}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors group"
                  >
                    <div className={`w-8 h-8 ${activity.iconColor} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.description}</p>
                    </div>
                    <span className="text-xs text-gray-400">{getRelativeTime(activity.time)}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BuyerDashboard;
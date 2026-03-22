import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Truck, CheckCircle, XCircle, Clock,
  ChevronRight, Search, Filter, Download, Share2,
  AlertCircle, ShoppingBag, Star, RefreshCw
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { orderService } from '../../services/orderService';
import { useToast } from '../../context/ToastContext';

const MyOrders = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });
  const [refreshing, setRefreshing] = useState(false);

  // Format price helper
  const formatPrice = (price) => {
    const num = Number(price) || 0;
    return `$${num.toFixed(2)}`;
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadOrders();
  }, [isAuthenticated, navigate, filter, pagination.page]);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Loading orders...');
      const response = await orderService.getBuyerOrders({ 
        status: filter !== 'all' ? filter : undefined,
        page: pagination.page,
        limit: 10
      });
      
      console.log('✅ Orders loaded:', response);
      
      // Xử lý response
      if (response && response.orders) {
        setOrders(response.orders);
        setPagination(response.pagination || { page: 1, total: response.orders.length, pages: 1 });
      } else if (Array.isArray(response)) {
        setOrders(response);
        setPagination({ page: 1, total: response.length, pages: 1 });
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('❌ Error loading orders:', err);
      setError(err.message || 'Failed to load orders');
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
    showToast('Orders refreshed', 'success');
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      await orderService.cancelOrder(orderId);
      showToast('Order cancelled successfully', 'success');
      loadOrders(); // Refresh list
    } catch (err) {
      console.error('Error cancelling order:', err);
      showToast(err.message || 'Failed to cancel order', 'error');
    }
  };

  const handleReorder = (items) => {
    // TODO: Add all items to cart
    showToast('Items added to cart', 'success');
    navigate('/cart');
  };

  const handleWriteReview = (productId) => {
    navigate(`/product/${productId}`, { state: { writeReview: true } });
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getEstimatedDelivery = (status, createdDate) => {
    if (status === 'delivered') return 'Delivered';
    if (status === 'cancelled') return 'Cancelled';
    
    const date = new Date(createdDate);
    const deliveryDate = new Date(date.setDate(date.getDate() + 5));
    return `Estimated by ${deliveryDate.toLocaleDateString()}`;
  };

  const filteredOrders = orders.filter(order => {
    if (search) {
      return order.id.toLowerCase().includes(search.toLowerCase()) ||
             order.items?.some(item => item.product_name.toLowerCase().includes(search.toLowerCase()));
    }
    return true;
  });

  const filterOptions = [
    { value: 'all', label: 'All Orders', icon: Package },
    { value: 'pending', label: 'Pending', icon: Clock },
    { value: 'processing', label: 'Processing', icon: RefreshCw },
    { value: 'shipped', label: 'Shipped', icon: Truck },
    { value: 'delivered', label: 'Delivered', icon: CheckCircle },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle }
  ];

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-light text-gray-900">My Orders</h1>
            <p className="text-gray-500 mt-1">
              {pagination.total} {pagination.total === 1 ? 'order' : 'orders'} found
            </p>
          </div>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              Continue Shopping
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by order ID or product name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {filterOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setFilter(option.value)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap transition-colors ${
                      filter === option.value
                        ? 'bg-black text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center mb-6">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-red-800 mb-2">Failed to Load Orders</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadOrders}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-light text-gray-900 mb-2">No orders found</h2>
            <p className="text-gray-500 mb-6">
              {search ? 'Try a different search term' : 'Start shopping to see your orders here'}
            </p>
            {!search && (
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
              >
                <ShoppingBag className="h-5 w-5" />
                Start Shopping
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-100">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        {getStatusIcon(order.status)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900">Order #{order.id}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Placed on {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-2xl font-light text-gray-900">
                          {formatPrice(order.total_amount)}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="mt-4 flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">
                      {getEstimatedDelivery(order.status, order.created_at)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {order.items?.slice(0, 2).map((item) => {
                      // Parse images safely
                      let itemImage = 'https://via.placeholder.com/80';
                      if (item.images) {
                        try {
                          if (typeof item.images === 'string') {
                            if (item.images.startsWith('[')) {
                              const parsed = JSON.parse(item.images);
                              if (parsed.length > 0) itemImage = parsed[0];
                            } else {
                              itemImage = item.images;
                            }
                          } else if (Array.isArray(item.images) && item.images.length > 0) {
                            itemImage = item.images[0];
                          }
                        } catch (e) {
                          console.log('Image parse error:', e);
                        }
                      }

                      return (
                        <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                            <img 
                              src={itemImage.startsWith('http') ? itemImage : `http://localhost:5000${itemImage}`}
                              alt={item.product_name}
                              className="w-full h-full object-cover"
                              onError={(e) => e.target.src = 'https://via.placeholder.com/80'}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{item.product_name}</p>
                            <div className="flex items-center justify-between mt-1">
                              <p className="text-sm text-gray-500">
                                Qty: {item.quantity} × {formatPrice(item.price)}
                              </p>
                              <p className="font-medium text-gray-900">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {order.items?.length > 2 && (
                    <p className="text-sm text-gray-500 mt-3 flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      +{order.items.length - 2} more {order.items.length - 2 === 1 ? 'item' : 'items'}
                    </p>
                  )}
                </div>

                {/* Order Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="text-sm text-gray-600 hover:text-black flex items-center gap-1"
                    >
                      <Package className="h-4 w-4" />
                      View Details
                    </button>
                    
                    {order.status === 'pending' && (
                      <>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                        >
                          <XCircle className="h-4 w-4" />
                          Cancel Order
                        </button>
                      </>
                    )}
                    
                    {order.status === 'delivered' && (
                      <>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => handleReorder(order.items)}
                          className="text-sm text-gray-600 hover:text-black flex items-center gap-1"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Buy Again
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => handleWriteReview(order.items[0]?.product_id)}
                          className="text-sm text-gray-600 hover:text-black flex items-center gap-1"
                        >
                          <Star className="h-4 w-4" />
                          Write Review
                        </button>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="Download Invoice">
                      <Download className="h-4 w-4 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="Share Order">
                      <Share2 className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Truck, CheckCircle, XCircle, Clock,
  ChevronRight, Search, Filter, Download, Share2,
  AlertCircle, DollarSign, TrendingUp, Users,
  RefreshCw, Printer, Edit, Eye, ShoppingBag
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { orderService } from '../../services/orderService';
import { useToast } from '../../context/ToastContext';

const SellerOrders = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  const [refreshing, setRefreshing] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);

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
    if (user?.role !== 'seller' && user?.role !== 'admin') {
      showToast('You need seller privileges to access this page', 'error');
      navigate('/');
      return;
    }
    loadOrders();
  }, [isAuthenticated, user, navigate]);

  const loadOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Loading seller orders...');
      const response = await orderService.getSellerOrders();
      
      console.log('✅ Seller orders loaded:', response);
      
      if (Array.isArray(response)) {
        setOrders(response);
        calculateStats(response);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('❌ Error loading seller orders:', err);
      setError(err.message || 'Failed to load orders');
      showToast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersData) => {
    const total = ordersData.length;
    const revenue = ordersData.reduce((sum, order) => sum + (Number(order.price) * order.quantity), 0);
    const pending = ordersData.filter(o => o.status === 'pending').length;
    const completed = ordersData.filter(o => o.status === 'delivered').length;

    setStats({
      totalOrders: total,
      totalRevenue: revenue,
      pendingOrders: pending,
      completedOrders: completed
    });
  };

  const handleUpdateStatus = async (itemId, newStatus) => {
    setUpdatingStatus(itemId);
    try {
      await orderService.updateOrderStatus(itemId, newStatus);
      showToast(`Order status updated to ${newStatus}`, 'success');
      loadOrders(); // Refresh list
    } catch (err) {
      console.error('Error updating status:', err);
      showToast(err.message || 'Failed to update status', 'error');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
    showToast('Orders refreshed', 'success');
  };

  const handleViewOrder = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-blue-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
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

  const statusOptions = [
    { value: 'pending', label: 'Pending', icon: Clock },
    { value: 'processing', label: 'Processing', icon: RefreshCw },
    { value: 'shipped', label: 'Shipped', icon: Truck },
    { value: 'delivered', label: 'Delivered', icon: CheckCircle },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  // Filter orders
  const filteredOrders = orders.filter(order => {
    // Filter by status
    if (filter !== 'all' && order.status !== filter) return false;
    
    // Search
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        order.order_id?.toString().includes(searchLower) ||
        order.product_name?.toLowerCase().includes(searchLower) ||
        order.buyer_name?.toLowerCase().includes(searchLower)
      );
    }
    
    // Date range filter
    if (dateRange !== 'all') {
      const orderDate = new Date(order.created_at);
      const now = new Date();
      
      if (dateRange === 'today') {
        if (orderDate.toDateString() !== now.toDateString()) return false;
      } else if (dateRange === 'week') {
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        if (orderDate < weekAgo) return false;
      } else if (dateRange === 'month') {
        if (orderDate.getMonth() !== now.getMonth() || orderDate.getFullYear() !== now.getFullYear()) return false;
      } else if (dateRange === 'year') {
        if (orderDate.getFullYear() !== now.getFullYear()) return false;
      }
    }
    
    return true;
  });

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your seller orders...</p>
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
            <h1 className="text-3xl font-light text-gray-900">Seller Dashboard</h1>
            <p className="text-gray-500 mt-1">
              Manage your orders and track sales
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
              onClick={() => navigate('/seller/products')}
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              Manage Products
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                <p className="text-2xl font-light text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                <p className="text-2xl font-light text-gray-900">{formatPrice(stats.totalRevenue)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Pending Orders</p>
                <p className="text-2xl font-light text-gray-900">{stats.pendingOrders}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Completed Orders</p>
                <p className="text-2xl font-light text-gray-900">{stats.completedOrders}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by order ID, product or buyer..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  filter === 'all'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {statusOptions.map((option) => {
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

            {/* Date Range */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 bg-white"
            >
              {dateRangeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
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
              {search ? 'Try a different search term' : 'You haven\'t received any orders yet'}
            </p>
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
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        {getStatusIcon(order.status)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900">Order #{order.order_id}</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    {/* Status Update */}
                    <div className="flex items-center gap-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                        disabled={updatingStatus === order.id}
                        className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 bg-white text-sm"
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                      {updatingStatus === order.id && (
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      )}
                    </div>
                  </div>

                  {/* Buyer Info */}
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-lg font-medium">
                          {order.buyer_name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{order.buyer_name}</p>
                        <p className="text-sm text-gray-500">{order.buyer_email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                      {order.images && (
                        <img 
                          src={JSON.parse(order.images)?.[0] || 'https://via.placeholder.com/64'}
                          alt={order.product_name}
                          className="w-full h-full object-cover"
                          onError={(e) => e.target.src = 'https://via.placeholder.com/64'}
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{order.product_name}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-gray-500">Quantity: {order.quantity}</p>
                        <p className="text-sm text-gray-500">Unit Price: {formatPrice(order.price)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-light text-gray-900">
                        {formatPrice(order.price * order.quantity)}
                      </p>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">Shipping Address</p>
                    <p className="text-sm text-gray-600">{order.shipping_address}</p>
                    <p className="text-sm text-gray-600 mt-1">Payment: {order.payment_method}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleViewOrder(order.order_id)}
                        className="text-sm text-gray-600 hover:text-black flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={() => window.print()}
                        className="text-sm text-gray-600 hover:text-black flex items-center gap-1"
                      >
                        <Printer className="h-4 w-4" />
                        Print Invoice
                      </button>
                    </div>

                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="Download Invoice">
                        <Download className="h-4 w-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors" title="Contact Buyer">
                        <Users className="h-4 w-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerOrders;
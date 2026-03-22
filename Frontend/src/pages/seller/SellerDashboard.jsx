import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, DollarSign, TrendingUp, Users,
  Clock, CheckCircle, XCircle, AlertCircle,
  Plus, Eye, Edit, Trash2, BarChart3
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    avgRating: 4.5
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSellerData();
  }, []);

  const loadSellerData = async () => {
    try {
      const [products, orders] = await Promise.all([
        productService.getSellerProducts(user.id),
        orderService.getSellerOrders()
      ]);

      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + (order.price * order.quantity), 0);
      
      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        avgRating: 4.5
      });

      setRecentOrders(orders.slice(0, 5));
      setTopProducts(products.slice(0, 3));
    } catch (error) {
      console.error('Error loading seller data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { icon: Package, label: 'Total Products', value: stats.totalProducts, color: 'bg-blue-500' },
    { icon: DollarSign, label: 'Total Revenue', value: `$${stats.totalRevenue.toFixed(2)}`, color: 'bg-green-500' },
    { icon: TrendingUp, label: 'Total Orders', value: stats.totalOrders, color: 'bg-purple-500' },
    { icon: Clock, label: 'Pending Orders', value: stats.pendingOrders, color: 'bg-yellow-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-light">Seller Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back, {user?.full_name}</p>
          </div>
          <button
            onClick={() => navigate('/sell')}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Product
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-light mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-light mb-4">Recent Orders</h2>
              {recentOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No orders yet</p>
              ) : (
                recentOrders.map(order => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <p className="font-medium">Order #{order.order_id}</p>
                      <p className="text-sm text-gray-500">{order.product_name} x {order.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(order.price * order.quantity).toFixed(2)}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <button
                onClick={() => navigate('/seller/orders')}
                className="mt-4 text-sm text-black hover:underline"
              >
                View all orders →
              </button>
            </div>
          </div>

          {/* Top Products */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-light mb-4">Top Products</h2>
              {topProducts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No products yet</p>
              ) : (
                topProducts.map(product => (
                  <div key={product.id} className="flex items-center gap-3 py-3 border-b last:border-0">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                      {product.images && (
                        <img 
                          src={JSON.parse(product.images)[0]} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">${product.price}</p>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
              <button
                onClick={() => navigate('/seller/products')}
                className="mt-4 text-sm text-black hover:underline"
              >
                Manage all products →
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/seller/products')}
            className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <Package className="h-8 w-8 text-gray-400 mb-3" />
            <h3 className="font-medium mb-1">Manage Products</h3>
            <p className="text-sm text-gray-500">Add, edit or remove your products</p>
          </button>
          
          <button
            onClick={() => navigate('/seller/orders')}
            className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <Clock className="h-8 w-8 text-gray-400 mb-3" />
            <h3 className="font-medium mb-1">View Orders</h3>
            <p className="text-sm text-gray-500">Process and track customer orders</p>
          </button>
          
          <button
            onClick={() => navigate('/seller/analytics')}
            className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <BarChart3 className="h-8 w-8 text-gray-400 mb-3" />
            <h3 className="font-medium mb-1">Analytics</h3>
            <p className="text-sm text-gray-500">View sales reports and statistics</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
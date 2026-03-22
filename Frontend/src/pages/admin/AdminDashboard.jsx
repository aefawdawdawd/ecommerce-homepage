import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, Package, DollarSign, ShoppingBag,
  TrendingUp, AlertCircle, CheckCircle, XCircle,
  Settings, BarChart3, Shield, Globe
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 1250,
    totalSellers: 45,
    totalProducts: 3280,
    totalOrders: 892,
    totalRevenue: 156780,
    pendingOrders: 23
  });

  const recentActivities = [
    { id: 1, user: 'john@example.com', action: 'Registered as seller', time: '5 minutes ago' },
    { id: 2, user: 'jane@example.com', action: 'Placed order #ORD-1234', time: '15 minutes ago' },
    { id: 3, user: 'bob@example.com', action: 'Added new product', time: '1 hour ago' },
    { id: 4, user: 'alice@example.com', action: 'Reported issue with order', time: '2 hours ago' }
  ];

  const statCards = [
    { icon: Users, label: 'Total Users', value: stats.totalUsers, color: 'bg-blue-500' },
    { icon: Package, label: 'Total Products', value: stats.totalProducts, color: 'bg-green-500' },
    { icon: ShoppingBag, label: 'Total Orders', value: stats.totalOrders, color: 'bg-purple-500' },
    { icon: DollarSign, label: 'Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, color: 'bg-yellow-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your marketplace</p>
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
          {/* User Management */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-light mb-4">Quick Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Total Sellers</p>
                  <p className="text-2xl font-light">{stats.totalSellers}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Pending Orders</p>
                  <p className="text-2xl font-light">{stats.pendingOrders}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Avg. Order Value</p>
                  <p className="text-2xl font-light">${(stats.totalRevenue / stats.totalOrders).toFixed(2)}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Conversion Rate</p>
                  <p className="text-2xl font-light">3.2%</p>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h2 className="text-xl font-light mb-4">Recent Activities</h2>
              {recentActivities.map(activity => (
                <div key={activity.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div>
                    <p className="font-medium">{activity.user}</p>
                    <p className="text-sm text-gray-500">{activity.action}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-light mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/admin/users')}
                  className="w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left flex items-center gap-3"
                >
                  <Users className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Manage Users</p>
                    <p className="text-xs text-gray-500">View, edit or suspend users</p>
                  </div>
                </button>
                
                <button
                  onClick={() => navigate('/admin/products')}
                  className="w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left flex items-center gap-3"
                >
                  <Package className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Manage Products</p>
                    <p className="text-xs text-gray-500">Approve, edit or remove products</p>
                  </div>
                </button>
                
                <button
                  onClick={() => navigate('/admin/orders')}
                  className="w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left flex items-center gap-3"
                >
                  <ShoppingBag className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Manage Orders</p>
                    <p className="text-xs text-gray-500">View and process all orders</p>
                  </div>
                </button>
                
                <button
                  onClick={() => navigate('/admin/categories')}
                  className="w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left flex items-center gap-3"
                >
                  <Globe className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">Categories</p>
                    <p className="text-xs text-gray-500">Manage product categories</p>
                  </div>
                </button>
                
                <button
                  onClick={() => navigate('/admin/settings')}
                  className="w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left flex items-center gap-3"
                >
                  <Settings className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">System Settings</p>
                    <p className="text-xs text-gray-500">Configure marketplace settings</p>
                  </div>
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              <h2 className="text-xl font-light mb-4">System Status</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Server Status</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Connected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Backup</span>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
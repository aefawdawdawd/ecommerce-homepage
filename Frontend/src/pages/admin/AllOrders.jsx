import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, Search, Filter, Download,
  ChevronLeft, Eye, Truck, CheckCircle,
  XCircle, Clock, DollarSign
} from 'lucide-react';

const AllOrders = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const orders = [
    {
      id: 'ORD-2024-001',
      buyer: 'John Buyer',
      seller: 'Jane Seller',
      total: 299.99,
      status: 'delivered',
      date: '2024-03-15',
      items: 3
    },
    {
      id: 'ORD-2024-002',
      buyer: 'Sarah Smith',
      seller: 'Mike Merchant',
      total: 1299.99,
      status: 'shipped',
      date: '2024-03-14',
      items: 2
    },
    {
      id: 'ORD-2024-003',
      buyer: 'David Lee',
      seller: 'Tech Store',
      total: 89.99,
      status: 'pending',
      date: '2024-03-13',
      items: 1
    },
    {
      id: 'ORD-2024-004',
      buyer: 'Emma Wilson',
      seller: 'Fashion Hub',
      total: 245.50,
      status: 'processing',
      date: '2024-03-12',
      items: 4
    }
  ];

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    revenue: orders.reduce((sum, o) => sum + o.total, 0)
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'shipped': return <Truck className="h-4 w-4 text-blue-500" />;
      case 'processing': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-orange-500" />;
      default: return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-light text-gray-900">All Orders</h1>
            <p className="text-gray-500 mt-1">Monitor all orders across the marketplace</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Total Orders', value: stats.total, color: 'bg-blue-500' },
            { label: 'Pending', value: stats.pending, color: 'bg-orange-500' },
            { label: 'Processing', value: stats.processing, color: 'bg-yellow-500' },
            { label: 'Shipped', value: stats.shipped, color: 'bg-indigo-500' },
            { label: 'Delivered', value: stats.delivered, color: 'bg-green-500' },
            { label: 'Revenue', value: `$${stats.revenue}`, color: 'bg-purple-500' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm p-4"
            >
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className="text-xl font-light">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by order ID, buyer, or seller..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
              <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </button>
              <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer</th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="text-right py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-medium">{order.id}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm">{order.buyer.charAt(0)}</span>
                        </div>
                        <span>{order.buyer}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">{order.seller}</td>
                    <td className="py-4 px-6">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-medium">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">Showing 1-4 of 4 orders</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-3 py-1 bg-black text-white rounded-lg text-sm">1</button>
              <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm" disabled>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllOrders;
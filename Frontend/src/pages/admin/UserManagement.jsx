import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Search, Filter, Edit, Trash2,
  Shield, UserCog, Ban, CheckCircle,
  Mail, Phone, Calendar, ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const users = [
    {
      id: 1,
      name: 'John Buyer',
      email: 'john@example.com',
      role: 'user',
      status: 'active',
      joined: '2024-01-15',
      orders: 12,
      spent: 1245.50
    },
    {
      id: 2,
      name: 'Jane Seller',
      email: 'jane@example.com',
      role: 'seller',
      status: 'active',
      joined: '2023-11-20',
      products: 15,
      revenue: 5678.90
    },
    {
      id: 3,
      name: 'Bob Smith',
      email: 'bob@example.com',
      role: 'user',
      status: 'suspended',
      joined: '2024-02-01',
      orders: 3,
      spent: 299.97
    },
    {
      id: 4,
      name: 'Alice Admin',
      email: 'alice@example.com',
      role: 'admin',
      status: 'active',
      joined: '2023-09-10',
      lastActive: '2024-03-18'
    }
  ];

  const stats = {
    total: users.length,
    buyers: users.filter(u => u.role === 'user').length,
    sellers: users.filter(u => u.role === 'seller').length,
    admins: users.filter(u => u.role === 'admin').length,
    active: users.filter(u => u.status === 'active').length
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-800',
      seller: 'bg-blue-100 text-blue-800',
      user: 'bg-green-100 text-green-800'
    };
    return styles[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
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
            <h1 className="text-3xl font-light text-gray-900">User Management</h1>
            <p className="text-gray-500 mt-1">Manage all users in the system</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Users', value: stats.total, icon: Users, color: 'bg-blue-500' },
            { label: 'Buyers', value: stats.buyers, icon: Users, color: 'bg-green-500' },
            { label: 'Sellers', value: stats.sellers, icon: UserCog, color: 'bg-orange-500' },
            { label: 'Admins', value: stats.admins, icon: Shield, color: 'bg-purple-500' },
            { label: 'Active', value: stats.active, icon: CheckCircle, color: 'bg-teal-500' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500">{stat.label}</p>
                <div className={`${stat.color} p-1.5 rounded-lg text-white`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </div>
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
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black bg-white"
              >
                <option value="all">All Roles</option>
                <option value="user">Buyers</option>
                <option value="seller">Sellers</option>
                <option value="admin">Admins</option>
              </select>
              <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Filter className="h-4 w-4" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                  <th className="text-right py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-lg font-medium">{user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {new Date(user.joined).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {user.role === 'seller' ? (
                        <span className="text-sm">{user.products} products</span>
                      ) : user.role === 'user' ? (
                        <span className="text-sm">{user.orders} orders</span>
                      ) : (
                        <span className="text-sm">Active today</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg" title="Edit">
                          <Edit className="h-4 w-4 text-gray-500" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg" title="Suspend">
                          <Ban className="h-4 w-4 text-gray-500" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-red-500" title="Delete">
                          <Trash2 className="h-4 w-4" />
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
            <p className="text-sm text-gray-500">Showing 1-4 of 4 users</p>
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

export default UserManagement;
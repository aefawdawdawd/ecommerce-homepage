import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart3, TrendingUp, Users, Package,
  DollarSign, Download, Calendar, ChevronLeft,
  PieChart, Activity, Award
} from 'lucide-react';

const Reports = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('month');

  const salesData = {
    day: [1250, 1450, 1320, 1580, 1420, 1680, 1520],
    week: [8520, 9450, 10230, 11850],
    month: [45200, 48900, 52300, 56700, 61200, 65800]
  };

  const topProducts = [
    { name: 'MacBook Pro', sales: 145, revenue: 217500 },
    { name: 'iPhone 15', sales: 232, revenue: 278400 },
    { name: 'AirPods Max', sales: 189, revenue: 103950 },
    { name: 'iPad Pro', sales: 98, revenue: 127400 },
    { name: 'Apple Watch', sales: 156, revenue: 124800 }
  ];

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
            <h1 className="text-3xl font-light text-gray-900">Analytics & Reports</h1>
            <p className="text-gray-500 mt-1">Track your marketplace performance</p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex justify-end mb-6">
          <div className="inline-flex bg-white rounded-lg border border-gray-200 p-1">
            {['day', 'week', 'month'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                  period === p
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:text-black hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: DollarSign, label: 'Total Revenue', value: '$125,430', change: '+12.5%', color: 'bg-green-500' },
            { icon: Users, label: 'New Users', value: '1,245', change: '+8.2%', color: 'bg-blue-500' },
            { icon: Package, label: 'Products Sold', value: '3,892', change: '+15.3%', color: 'bg-purple-500' },
            { icon: TrendingUp, label: 'Conversion Rate', value: '3.8%', change: '+0.5%', color: 'bg-orange-500' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`${stat.color} p-2 rounded-lg text-white`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <span className="text-xs text-green-600">{stat.change}</span>
              </div>
              <p className="text-2xl font-light mb-1">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sales Chart */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-light">Sales Overview</h2>
                <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-black">
                  <Download className="h-4 w-4" />
                  Export
                </button>
              </div>

              {/* Bar Chart */}
              <div className="h-64 flex items-end gap-2">
                {salesData[period].map((value, index) => {
                  const max = Math.max(...salesData[period]);
                  const height = (value / max) * 100;
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full bg-gray-100 rounded-t-lg relative h-48">
                        <div
                          style={{ height: `${height}%` }}
                          className="absolute bottom-0 left-0 right-0 bg-black rounded-t-lg transition-all"
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {period === 'day' ? `D${index + 1}` : 
                         period === 'week' ? `W${index + 1}` : 
                         `M${index + 1}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Top Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6 mt-6"
            >
              <h2 className="text-xl font-light mb-4">Top Products</h2>
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.sales} units sold</p>
                      </div>
                    </div>
                    <p className="font-medium">${product.revenue.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* User Growth */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-light mb-4">User Growth</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">New Buyers</span>
                  <span className="font-medium">+845</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">New Sellers</span>
                  <span className="font-medium">+124</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '45%' }} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Returning Users</span>
                  <span className="font-medium">+2,456</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
            </motion.div>

            {/* Category Performance */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-light mb-4">Category Performance</h2>
              <div className="space-y-3">
                {['Electronics', 'Laptops', 'Phones', 'Audio', 'Accessories'].map((cat, i) => (
                  <div key={cat} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{cat}</span>
                    <span className="text-sm font-medium">{Math.floor(Math.random() * 30 + 10)}%</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <h2 className="text-xl font-light mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button className="w-full p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Generate Monthly Report</p>
                    <p className="text-xs text-gray-500">PDF format</p>
                  </div>
                </button>
                <button className="w-full p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-3">
                  <Award className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Top Performers</p>
                    <p className="text-xs text-gray-500">View best sellers</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
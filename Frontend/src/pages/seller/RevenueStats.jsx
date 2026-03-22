import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, TrendingUp, TrendingDown,
  Calendar, Download, ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const RevenueStats = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [period, setPeriod] = useState('month');
  const [stats, setStats] = useState({
    revenue: 12580,
    orders: 145,
    averageOrder: 86.76,
    growth: 12.5
  });

  const revenueData = {
    day: [125, 150, 200, 180, 220, 250, 300],
    week: [1250, 1450, 1320, 1580, 1420, 1680, 1520],
    month: [5250, 5800, 6200, 7100, 6800, 7500, 8250, 8900, 9500, 10200, 11500, 12580]
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/seller/dashboard')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-light text-gray-900">Revenue Statistics</h1>
            <p className="text-gray-500 mt-1">Track your earnings and growth</p>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-2xl font-light text-gray-900">{formatCurrency(stats.revenue)}</p>
            <p className="text-xs text-green-600 mt-2">↑ {stats.growth}% vs last {period}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Total Orders</p>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-2xl font-light text-gray-900">{stats.orders}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Average Order</p>
              <TrendingDown className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-2xl font-light text-gray-900">{formatCurrency(stats.averageOrder)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Conversion Rate</p>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-2xl font-light text-gray-900">3.2%</p>
          </motion.div>
        </div>

        {/* Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-light">Revenue Overview</h2>
            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-black">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>

          {/* Simple bar chart */}
          <div className="h-64 flex items-end gap-2">
            {revenueData[period].map((value, index) => {
              const max = Math.max(...revenueData[period]);
              const height = (value / max) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-gray-100 rounded-t-lg relative group">
                    <div
                      style={{ height: `${height}%` }}
                      className="absolute bottom-0 left-0 right-0 bg-black rounded-t-lg transition-all group-hover:bg-gray-800"
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    {period === 'day' ? `Day ${index + 1}` : 
                     period === 'week' ? `W${index + 1}` : 
                     `Month ${index + 1}`}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-xl font-light mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Order #2024-{i}234</p>
                  <p className="text-sm text-gray-500">Product Name {i} × 2</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(Math.random() * 200 + 50).toFixed(2)}</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RevenueStats;
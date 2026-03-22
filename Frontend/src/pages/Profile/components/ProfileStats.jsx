import React from 'react';
import { motion } from 'framer-motion';
import { Package, DollarSign, Heart, Gift, Award } from 'lucide-react';

const ProfileStats = ({ stats }) => {
  const statCards = [
    { 
      icon: Package, 
      label: 'Total Orders', 
      value: stats.totalOrders, 
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500'
    },
    { 
      icon: DollarSign, 
      label: 'Total Spent', 
      value: `$${stats.totalSpent.toFixed(2)}`, 
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500'
    },
    { 
      icon: Gift, 
      label: 'Avg. Order', 
      value: `$${stats.avgOrderValue.toFixed(2)}`, 
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500'
    },
    { 
      icon: Heart, 
      label: 'Wishlist', 
      value: stats.wishlistCount, 
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-500'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
    >
      {statCards.map((stat, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-light mt-1">{stat.value}</p>
            </div>
            <div className={`${stat.bgColor} p-3 rounded-lg`}>
              <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
            </div>
          </div>
          <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
              className={`h-full ${stat.color}`}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProfileStats;
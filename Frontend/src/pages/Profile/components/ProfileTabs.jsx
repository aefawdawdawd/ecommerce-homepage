import React from 'react';
import { motion } from 'framer-motion';
import { User, Package, Heart, Settings } from 'lucide-react';

const ProfileTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm p-1 flex gap-1 mb-6 overflow-x-auto"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
              isActive
                ? 'bg-black text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium">{tab.label}</span>
            {isActive && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-1.5 h-1.5 bg-white rounded-full ml-1"
              />
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
};

export default ProfileTabs;
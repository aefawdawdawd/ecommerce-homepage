import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X, ShoppingCart, Heart } from 'lucide-react';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
    cart: <ShoppingCart className="h-5 w-5 text-black" />,
    wishlist: <Heart className="h-5 w-5 text-red-500" />
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    cart: 'bg-gray-50 border-gray-200',
    wishlist: 'bg-red-50 border-red-200'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: -50, x: '-50%' }}
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-3 rounded-lg shadow-lg border ${bgColors[type]} flex items-center gap-3 min-w-75 max-w-md`}
    >
      {icons[type]}
      <p className="flex-1 text-sm text-gray-800">{message}</p>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/50 rounded-lg transition-colors"
      >
        <X className="h-4 w-4 text-gray-500" />
      </button>
    </motion.div>
  );
};

export default Toast;
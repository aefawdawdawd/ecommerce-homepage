import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, Truck, CheckCircle, XCircle, Clock,
  ChevronRight, ShoppingBag
} from 'lucide-react';

const OrdersTab = ({ orders }) => {
  const navigate = useNavigate();

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'shipped': return <Truck className="h-4 w-4 text-blue-500" />;
      case 'processing': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No orders yet</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          <ShoppingBag className="h-4 w-4 inline mr-2" />
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order, index) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => navigate(`/orders/${order.id}`)}
          className="border border-gray-100 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Package className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="font-medium">Order #{order.id}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="capitalize">{order.status}</span>
              </span>
              <p className="font-medium">${Number(order.total_amount).toFixed(2)}</p>
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="mt-4 border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-600">{order.items?.length} items</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default OrdersTab;
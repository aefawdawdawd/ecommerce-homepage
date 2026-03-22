import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle, Package, Truck, Calendar, 
  ChevronRight, ShoppingBag, Home 
} from 'lucide-react';
import { orderService } from '../../services/orderService';

const CheckoutSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-8 text-center mb-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle className="h-10 w-10 text-green-600" />
          </motion.div>
          
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-500 mb-6">
            Thank you for your purchase. Your order has been confirmed.
          </p>
          
          {orderId && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
              <Package className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Order #{orderId}</span>
            </div>
          )}
        </motion.div>

        {/* Order Details */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6 mb-6"
          >
            <h2 className="text-lg font-medium mb-4">Order Details</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Order Date:</span>
                <span className="font-medium">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment Method:</span>
                <span className="font-medium capitalize">{order.payment_method}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Amount:</span>
                <span className="font-medium text-lg">${order.total_amount?.toFixed(2)}</span>
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t border-gray-100 pt-4">
              <h3 className="font-medium mb-3">Items</h3>
              <div className="space-y-2">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product_name} x {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Shipping Info */}
        {order?.shipping_address && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 mb-6"
          >
            <h2 className="text-lg font-medium mb-4">Shipping Address</h2>
            <p className="text-gray-600">{order.shipping_address}</p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <button
            onClick={() => navigate('/orders')}
            className="flex-1 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <Package className="h-4 w-4" />
            View Orders
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-3 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" />
            Continue Shopping
          </button>
        </motion.div>

        {/* Order Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-sm text-gray-400"
        >
          <p>You will receive an email confirmation shortly.</p>
        </motion.div>
      </div>
    </div>
  );
};

    export default CheckoutSuccess;
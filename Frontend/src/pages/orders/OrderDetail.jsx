import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, Truck, CheckCircle, XCircle, Clock,
  MapPin, CreditCard, Calendar, User, ChevronLeft,
  Download, Share2, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { orderService } from '../../services/orderService';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadOrder();
  }, [id, isAuthenticated, navigate]);

  const loadOrder = async () => {
    setLoading(true);
    try {
      const data = await orderService.getOrderById(id);
      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-light mb-2">Error Loading Order</h2>
          <p className="text-gray-500 mb-4">{error || 'Order not found'}</p>
          <button
            onClick={() => navigate('/orders')}
            className="px-6 py-2 bg-black text-white rounded-lg"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back button */}
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Orders
        </button>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-light text-gray-900">Order #{order.id}</h1>
              <p className="text-gray-500 mt-1">
                Placed on {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="capitalize">{order.status}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                      <img 
                        src={item.images?.[0] || 'https://via.placeholder.com/80'} 
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          <p className="text-sm text-gray-500">Seller: {item.seller_name}</p>
                        </div>
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">Order Timeline</h2>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Order Placed</p>
                    <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                </div>
                {order.status !== 'pending' && (
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Order Processed</p>
                      <p className="text-sm text-gray-500">Your order is being prepared</p>
                    </div>
                  </div>
                )}
                {order.status === 'shipped' && (
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Truck className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">Shipped</p>
                      <p className="text-sm text-gray-500">Your order is on the way</p>
                    </div>
                  </div>
                )}
                {order.status === 'delivered' && (
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Delivered</p>
                      <p className="text-sm text-gray-500">Your order has been delivered</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Shipping Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-gray-400" />
                Shipping Address
              </h2>
              <div className="space-y-2 text-sm">
                <p className="font-medium">{order.shipping_name || 'Customer'}</p>
                <p className="text-gray-600">{order.shipping_address}</p>
                <p className="text-gray-600">{order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p>
                <p className="text-gray-600">{order.shipping_country || 'Vietnam'}</p>
                {order.shipping_phone && (
                  <p className="text-gray-600 mt-2">Phone: {order.shipping_phone}</p>
                )}
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-gray-400" />
                Payment Information
              </h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Method:</span>
                  <span className="font-medium capitalize">{order.payment_method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>${order.total_amount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-100 pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span>Total:</span>
                    <span className="text-lg">${order.total_amount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">Actions</h2>
              <div className="space-y-3">
                {order.status === 'pending' && (
                  <button className="w-full py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                    Cancel Order
                  </button>
                )}
                {order.status === 'delivered' && (
                  <>
                    <button className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                      Buy Again
                    </button>
                    <button className="w-full py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      Write a Review
                    </button>
                  </>
                )}
                <button className="w-full py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Download className="h-4 w-4" />
                  Download Invoice
                </button>
                <button className="w-full py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Order
                </button>
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-gray-100 rounded-xl p-6">
              <h2 className="font-medium mb-2">Need Help?</h2>
              <p className="text-sm text-gray-600 mb-4">
                If you have any questions about your order, please contact our support team.
              </p>
              <button className="text-sm text-black hover:underline">
                Contact Support →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
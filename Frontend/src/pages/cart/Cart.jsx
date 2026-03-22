import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, ShoppingBag, ChevronRight, Minus, Plus,
  AlertCircle, CheckCircle, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cartService } from '../../services/cartService';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0, itemCount: 0 });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadCart();
  }, [isAuthenticated, navigate]);


  // Hàm xử lý images an toàn
const getProductImage = (item) => {
  if (!item) return 'https://via.placeholder.com/100';
  
  let imageUrl = 'https://via.placeholder.com/100';
  
  // Xử lý images từ product
  if (item.images) {
    try {
      if (typeof item.images === 'string') {
        // Nếu là JSON array
        if (item.images.trim().startsWith('[')) {
          const parsed = JSON.parse(item.images);
          if (Array.isArray(parsed) && parsed.length > 0) {
            imageUrl = parsed[0];
          }
        } else {
          // Nếu là string đơn
          imageUrl = item.images;
        }
      } else if (Array.isArray(item.images) && item.images.length > 0) {
        imageUrl = item.images[0];
      }
    } catch (e) {
      console.log('Image parse error:', e);
      // Nếu lỗi, coi như string đơn
      if (typeof item.images === 'string') {
        imageUrl = item.images;
      }
    }
  }
  
  // Thêm base URL nếu cần
  if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
    imageUrl = `http://localhost:5000${imageUrl}`;
  }
  
  return imageUrl;
};

// Trong phần render item
{cart.items?.map((item) => {
  const productImage = getProductImage(item);
  
  return (
    <motion.div
      key={item.id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="bg-white rounded-xl shadow-sm p-4 flex gap-4"
    >
      {/* Product Image */}
      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
        <img 
          src={productImage}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/100';
          }}
        />
      </div>
      
      {/* ... phần còn lại ... */}
    </motion.div>
  );
})}
  const loadCart = async () => {
    setLoading(true);
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdating(itemId);
    try {
      await cartService.updateCartItem(itemId, { quantity: newQuantity });
      await loadCart();
    } catch (error) {
      setNotification({
        show: true,
        type: 'error',
        message: 'Failed to update quantity'
      });
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (itemId) => {
    setUpdating(itemId);
    try {
      await cartService.removeFromCart(itemId);
      await loadCart();
      setNotification({
        show: true,
        type: 'success',
        message: 'Item removed from cart'
      });
    } catch (error) {
      setNotification({
        show: true,
        type: 'error',
        message: 'Failed to remove item'
      });
    } finally {
      setUpdating(null);
    }
  };

  const clearCart = async () => {
    if (!window.confirm('Are you sure you want to clear your cart?')) return;
    
    try {
      await cartService.clearCart();
      await loadCart();
      setNotification({
        show: true,
        type: 'success',
        message: 'Cart cleared'
      });
    } catch (error) {
      setNotification({
        show: true,
        type: 'error',
        message: 'Failed to clear cart'
      });
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
      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}
          >
            {notification.type === 'success' ? 
              <CheckCircle className="h-5 w-5" /> : 
              <AlertCircle className="h-5 w-5" />
            }
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-light text-gray-900">Shopping Cart</h1>
          <span className="text-sm text-gray-500 ml-2">
            ({cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'})
          </span>
        </div>

        {cart.items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-light mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added anything yet</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="bg-white rounded-xl shadow-sm p-4 flex gap-4"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <img 
                      src={item.images?.[0] || 'https://via.placeholder.com/100'} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">Sold by: {item.seller_name}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={updating === item.id}
                        className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={updating === item.id || item.quantity <= 1}
                          className="p-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center">
                          {updating === item.id ? (
                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
                          ) : (
                            item.quantity
                          )}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={updating === item.id}
                          className="p-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-light text-lg">${item.total?.toFixed(2)}</p>
                        <p className="text-xs text-gray-400">${item.price} each</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Clear Cart */}
              {cart.items.length > 0 && (
                <div className="flex justify-end">
                  <button
                    onClick={clearCart}
                    className="text-sm text-gray-500 hover:text-red-500 transition-colors"
                  >
                    Clear Cart
                  </button>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-medium mb-4">Order Summary</h2>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${cart.total?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 mt-3">
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span className="text-lg">${cart.total?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full mt-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ChevronRight className="h-4 w-4" />
                </button>

                <button
                  onClick={() => navigate('/')}
                  className="w-full mt-3 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
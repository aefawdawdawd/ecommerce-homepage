import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, ShoppingBag, Trash2, ChevronLeft,
  AlertCircle, Star, Plus
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../context/ToastContext';
import { wishlistService } from '../../services/wishlistService';
import { cartService } from '../../services/cartService';

// Default image fallback
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&auto=format';

const Wishlist = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

useEffect(() => {
  if (!user) {
    navigate('/login');
    return;
  }
  loadWishlist();
  
  // Lắng nghe sự kiện cập nhật wishlist
  const handleWishlistUpdate = (event) => {
    console.log('🔄 Wishlist updated event:', event.detail);
    loadWishlist(); // Reload wishlist khi có thay đổi
  };

  window.addEventListener('wishlist-updated', handleWishlistUpdate);
  return () => {
    window.removeEventListener('wishlist-updated', handleWishlistUpdate);
  };
}, [user, navigate]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadWishlist();
  }, [user, navigate]);

  const loadWishlist = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Loading wishlist for user:', user.id);
      const data = await wishlistService.getWishlist(user.id);
      console.log('✅ Wishlist loaded:', data);
      setWishlist(data || []);
    } catch (error) {
      console.error('❌ Error loading wishlist:', error);
      setError(error.message || 'Failed to load wishlist');
      showToast('Failed to load wishlist', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    setUpdatingId(productId);
    try {
      await wishlistService.removeFromWishlist(user.id, productId);
      setWishlist(wishlist.filter(item => item.product_id !== productId));
      showToast('Removed from wishlist', 'success');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      showToast(error.message || 'Failed to remove', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAddToCart = async (item) => {
    setUpdatingId(item.product_id);
    try {
      await cartService.addToCart({ productId: item.product_id, quantity: 1 });
      showToast(`Added ${item.name} to cart`, 'cart');
      
      // Optionally remove from wishlist after adding to cart
      // await handleRemoveFromWishlist(item.product_id);
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast(error.message || 'Failed to add to cart', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  // Hàm xử lý images an toàn
  const getProductImage = (item) => {
    if (!item) return DEFAULT_IMAGE;
    
    let imageUrl = DEFAULT_IMAGE;
    
    if (item.images) {
      try {
        if (typeof item.images === 'string') {
          // Kiểm tra nếu là JSON array
          if (item.images.trim().startsWith('[')) {
            const parsed = JSON.parse(item.images);
            if (Array.isArray(parsed) && parsed.length > 0) {
              imageUrl = parsed[0];
            }
          } else {
            // Là string đơn (đường dẫn trực tiếp)
            imageUrl = item.images;
          }
        } else if (Array.isArray(item.images) && item.images.length > 0) {
          imageUrl = item.images[0];
        }
      } catch (e) {
        console.log('Image parse error:', e);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-light text-gray-900 mb-2">Failed to load wishlist</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={loadWishlist}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-light text-gray-900">My Wishlist</h1>
            <p className="text-gray-500 mt-1">{wishlist.length} items saved</p>
          </div>
        </div>

        {/* Wishlist Grid */}
        {wishlist.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-light text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Save items you love to your wishlist</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {wishlist.map((item, index) => {
                const itemImage = getProductImage(item);
                const isUpdating = updatingId === item.product_id;
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                  >
                    <div 
                      onClick={() => navigate(`/product/${item.product_id}`)}
                      className="relative aspect-square bg-gray-100 cursor-pointer overflow-hidden"
                    >
                      <img
                        src={itemImage}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = DEFAULT_IMAGE;
                        }}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromWishlist(item.product_id);
                        }}
                        disabled={isUpdating}
                        className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {isUpdating ? (
                          <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Heart className="h-5 w-5 text-red-500 fill-current" />
                        )}
                      </button>
                    </div>
                    
                    <div className="p-4">
                      <h3 
                        onClick={() => navigate(`/product/${item.product_id}`)}
                        className="font-medium text-gray-900 mb-1 line-clamp-2 cursor-pointer hover:text-black"
                      >
                        {item.name}
                      </h3>
                      
                      {/* Rating (mock - sẽ lấy từ API sau) */}
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">(128)</span>
                      </div>

                      {/* Price */}
                      <p className="text-xl font-light text-gray-900 mb-3">
                        ${Number(item.price).toFixed(2)}
                      </p>

                      {/* Stock Status */}
                      {item.stock > 0 ? (
                        <p className="text-sm text-green-600 mb-3">
                          {item.stock} in stock
                        </p>
                      ) : (
                        <p className="text-sm text-red-600 mb-3">Out of Stock</p>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={item.stock <= 0 || isUpdating}
                          className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                            item.stock > 0
                              ? 'bg-black text-white hover:bg-gray-800'
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {isUpdating ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="h-4 w-4" />
                              Add to Cart
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleRemoveFromWishlist(item.product_id)}
                          disabled={isUpdating}
                          className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, Heart, Star, Truck, Shield, 
  ChevronLeft, ChevronRight, Plus, Minus,
  MessageCircle, Share2, Flag, AlertCircle,
  Home, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { productService } from '../../services/productService';
import { cartService } from '../../services/cartService';
import { wishlistService } from '../../services/wishlistService';
import { reviewService } from '../../services/reviewService';
import { useToast } from '../../context/ToastContext';
import Rating from '../../components/Rating';
import ReviewForm from '../../components/ReviewForm';

// Default image fallback
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isInCart, setIsInCart] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [avgRating, setAvgRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  console.log('🔍 ProductDetail rendered with ID:', id);

  // Hàm xử lý images an toàn
  const getProductImages = () => {
    if (!product) return [];
    
    let images = [];
    
    if (product.images) {
      try {
        if (typeof product.images === 'string') {
          if (product.images.trim().startsWith('[')) {
            const parsed = JSON.parse(product.images);
            if (Array.isArray(parsed)) {
              images = parsed.filter(url => url && !url.includes('blob:'));
            }
          } else {
            images = [product.images];
          }
        } else if (Array.isArray(product.images)) {
          images = product.images.filter(url => url && !url.includes('blob:'));
        }
      } catch (e) {
        console.log('Error parsing images:', e);
        if (typeof product.images === 'string' && !product.images.includes('blob:')) {
          images = [product.images];
        }
      }
    }
    
    return images;
  };

  useEffect(() => {
    if (id) {
      console.log('🔄 Loading product with ID:', id);
      loadProduct();
      loadReviews();
    } else {
      console.error('❌ No product ID provided');
      setError('Không tìm thấy ID sản phẩm');
    }
  }, [id]);

  useEffect(() => {
    if (isAuthenticated && user && product?.id) {
      checkWishlistStatus();
    }
  }, [isAuthenticated, user, product?.id]);

  const loadProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('📡 Calling productService.getProductById with ID:', id);
      const data = await productService.getProductById(id);
      console.log('✅ Product data received:', data);
      
      if (!data) {
        setError('Không tìm thấy sản phẩm');
      } else {
        setProduct(data);
        
        if (data.avg_rating) setAvgRating(data.avg_rating);
        if (data.review_count) setReviewCount(data.review_count);
        
        if (isAuthenticated) {
          try {
            const cart = await cartService.getCart();
            const inCart = cart.items?.some(item => item.product_id === parseInt(id));
            setIsInCart(inCart);
          } catch (cartError) {
            console.error('Error checking cart:', cartError);
          }
        }
      }
    } catch (error) {
      console.error('❌ Error loading product:', error);
      console.error('❌ Error details:', error.response?.data);
      setError(error.response?.data?.error || 'Không thể tải sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    setReviewsLoading(true);
    try {
      console.log('📡 Loading reviews for product:', id);
      const data = await reviewService.getProductReviews(id);
      console.log('✅ Reviews loaded:', data);
      setReviews(data || []);
      
      if (data && data.length > 0) {
        const total = data.reduce((sum, r) => sum + r.rating, 0);
        setAvgRating(total / data.length);
        setReviewCount(data.length);
      }
    } catch (error) {
      console.error('❌ Error loading reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const checkWishlistStatus = async () => {
    try {
      const inWishlist = await wishlistService.checkWishlist(user.id, id);
      setIsInWishlist(inWishlist);
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      showToast('Vui lòng đăng nhập để thêm vào giỏ hàng', 'info');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    try {
      await cartService.addToCart({ productId: id, quantity });
      setIsInCart(true);
      showToast('Đã thêm vào giỏ hàng!', 'cart');
      window.dispatchEvent(new Event('cart-updated'));
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast(error.message || 'Không thể thêm vào giỏ hàng', 'error');
    }
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      showToast('Vui lòng đăng nhập để tiếp tục', 'info');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    await handleAddToCart();
    navigate('/cart');
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      showToast('Vui lòng đăng nhập để thêm vào yêu thích', 'info');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(user.id, id);
        setIsInWishlist(false);
        showToast('Đã xóa khỏi danh sách yêu thích', 'success');
      } else {
        await wishlistService.addToWishlist(id);
        setIsInWishlist(true);
        showToast('Đã thêm vào danh sách yêu thích', 'wishlist');
      }
      window.dispatchEvent(new CustomEvent('wishlist-updated'));
    } catch (error) {
      console.error('Error updating wishlist:', error);
      showToast(error.message || 'Không thể cập nhật yêu thích', 'error');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleImageError = (index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Đã sao chép liên kết!', 'success');
  };

  const productImages = getProductImages();
  const mainImage = productImages.length > 0 && !imageErrors[0]
    ? (productImages[0].startsWith('http') ? productImages[0] : `http://localhost:5000${productImages[0]}`)
    : DEFAULT_IMAGE;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-light mb-2">Không tìm thấy sản phẩm</h2>
          <p className="text-gray-500 mb-6">{error || 'Sản phẩm bạn đang tìm không tồn tại'}</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 mx-auto"
          >
            <Home className="h-5 w-5" />
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 text-gray-600 hover:text-black"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Quay lại</span>
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 text-gray-600 hover:text-black"
            >
              <Home className="h-5 w-5" />
              <span className="hidden sm:inline">Trang chủ</span>
            </button>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button onClick={() => navigate('/')} className="hover:text-black">Trang chủ</button>
            <span>/</span>
            <button onClick={() => navigate('/products')} className="hover:text-black">Sản phẩm</button>
            <span>/</span>
            <span className="text-black truncate max-w-50">{product.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left - Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative group">
              <img 
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={() => handleImageError(0)}
              />
            </div>
            
            {productImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImage === index ? 'border-black' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img 
                      src={img.startsWith('http') ? img : `http://localhost:5000${img}`}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(index)}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right - Info */}
          <div className="space-y-6">
            {/* Seller Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-medium">
                  {product.seller_name?.charAt(0).toUpperCase() || 'S'}
                </div>
                <div>
                  <p className="font-medium">Người bán: {product.seller_name || 'Unknown Seller'}</p>
                  <p className="text-xs text-gray-500">Tham gia {new Date(product.created_at).getFullYear()}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleShare}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Chia sẻ"
                >
                  <Share2 className="h-5 w-5 text-gray-400" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Báo cáo">
                  <Flag className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-light text-gray-900">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <Rating value={avgRating} size="lg" />
              <span className="text-sm text-gray-500">
                {reviewCount} {reviewCount === 1 ? 'đánh giá' : 'đánh giá'}
              </span>
              {reviewsLoading && (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              )}
            </div>

            {/* Price */}
            <div className="border-t border-b border-gray-200 py-4">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-light text-black">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price * 23000)}
                </span>
                {product.original_price && (
                  <span className="text-lg text-gray-400 line-through">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.original_price * 23000)}
                  </span>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                product.stock > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              }`} />
              <span className="text-sm">
                {product.stock > 0 
                  ? `Còn ${product.stock} sản phẩm` 
                  : 'Hết hàng'}
              </span>
            </div>

            {/* Quantity */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Số lượng:</span>
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-xs text-gray-400">
                  {product.stock - quantity} sản phẩm còn lại
                </span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isInCart}
                className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  isInCart
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-black text-white hover:bg-gray-800'
                } disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed`}
              >
                <ShoppingCart className="h-5 w-5" />
                {isInCart ? 'Đã thêm vào giỏ' : 'Thêm vào giỏ'}
              </button>
              
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 py-3 border border-black text-black rounded-lg hover:bg-gray-50 transition-all disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Mua ngay
              </button>
              
              <button
                onClick={handleWishlist}
                disabled={wishlistLoading}
                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 relative group"
                title={isInWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
              >
                {wishlistLoading ? (
                  <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Heart className={`h-5 w-5 transition-colors ${
                    isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400 group-hover:text-red-500'
                  }`} />
                )}
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Truck className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <p className="text-xs font-medium">Miễn phí vận chuyển</p>
                <p className="text-[10px] text-gray-500">Cho đơn từ 500K</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <Shield className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <p className="text-xs font-medium">Bảo hành 2 năm</p>
                <p className="text-[10px] text-gray-500">Chính hãng</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <MessageCircle className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <p className="text-xs font-medium">Hỗ trợ 24/7</p>
                <p className="text-[10px] text-gray-500">Tư vấn miễn phí</p>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-medium mb-3">Mô tả sản phẩm</h3>
              <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed">
                {product.description ? (
                  product.description.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-2">{paragraph}</p>
                  ))
                ) : (
                  <p className="text-gray-400 italic">Chưa có mô tả cho sản phẩm này.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 border-t border-gray-200 pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-light">Đánh giá sản phẩm</h2>
              <div className="flex items-center gap-2 mt-1">
                <Rating value={avgRating} size="md" />
                <span className="text-sm text-gray-500">
                  {reviewCount} {reviewCount === 1 ? 'đánh giá' : 'đánh giá'}
                </span>
              </div>
            </div>
            
            {isAuthenticated && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 transition-colors flex items-center gap-2 self-start"
              >
                <MessageCircle className="h-4 w-4" />
                Viết đánh giá
              </button>
            )}
          </div>

          {showReviewForm && (
            <div className="mb-8">
              <ReviewForm
                productId={id}
                onSuccess={() => {
                  setShowReviewForm(false);
                  loadReviews();
                  loadProduct();
                }}
                onCancel={() => setShowReviewForm(false)}
              />
            </div>
          )}

          {reviewsLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-b border-gray-100 pb-6 last:border-0"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-linear-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white font-medium">
                        {review.username?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-medium">{review.username || 'Người dùng'}</p>
                        <p className="text-xs text-gray-500">
                          {review.created_at ? new Date(review.created_at).toLocaleDateString('vi-VN') : ''}
                        </p>
                      </div>
                    </div>
                    <Rating value={review.rating} size="sm" />
                  </div>
                  <p className="text-gray-600 ml-13 leading-relaxed">{review.comment}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Chưa có đánh giá nào</p>
              {isAuthenticated && (
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="mt-4 text-sm text-black hover:underline"
                >
                  Hãy là người đầu tiên đánh giá
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
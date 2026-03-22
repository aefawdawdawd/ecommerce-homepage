import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Eye, ShoppingBag, Star, User } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom'; // Thêm Link
import { cartService } from '../services/cartService';
import { wishlistService } from '../services/wishlistService';
import { reviewService } from '../services/reviewService';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';

// Default image fallback
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&auto=format';

const ProductCard = ({ product, index, layout = 'grid' }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  
  const [isHovered, setIsHovered] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Dữ liệu review thật
  const [avgRating, setAvgRating] = useState(product?.avg_rating || 0);
  const [reviewCount, setReviewCount] = useState(product?.review_count || 0);
  const [loadingReviews, setLoadingReviews] = useState(false);

  if (!product) return null;

  // Lấy review thật từ API
  useEffect(() => {
    if (product?.avg_rating && product?.review_count) {
      setAvgRating(product.avg_rating);
      setReviewCount(product.review_count);
    } else {
      fetchProductReviews();
    }
  }, [product?.id]);

  const fetchProductReviews = async () => {
    if (!product?.id) return;
    setLoadingReviews(true);
    try {
      const reviews = await reviewService.getProductReviews(product.id);
      if (reviews && reviews.length > 0) {
        const total = reviews.reduce((sum, r) => sum + r.rating, 0);
        setAvgRating(total / reviews.length);
        setReviewCount(reviews.length);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Kiểm tra wishlist
  useEffect(() => {
    if (isAuthenticated && user && product?.id) {
      checkWishlistStatus();
    }
  }, [isAuthenticated, user, product?.id]);

  const checkWishlistStatus = async () => {
    try {
      const inWishlist = await wishlistService.checkWishlist(user.id, product.id);
      setIsInWishlist(inWishlist);
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  // Hàm xử lý images
  const getProductImage = () => {
    if (!product) return DEFAULT_IMAGE;
    
    let imageUrl = DEFAULT_IMAGE;
    
    if (product.images) {
      try {
        if (typeof product.images === 'string') {
          if (product.images.trim().startsWith('[')) {
            const parsed = JSON.parse(product.images);
            if (Array.isArray(parsed) && parsed.length > 0) {
              imageUrl = parsed[0];
            }
          } else {
            imageUrl = product.images;
          }
        } else if (Array.isArray(product.images) && product.images.length > 0) {
          imageUrl = product.images[0];
        }
      } catch (e) {
        console.log('Image parse error:', e);
        if (typeof product.images === 'string') {
          imageUrl = product.images;
        }
      }
    }
    
    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
      imageUrl = `http://localhost:5000${imageUrl}`;
    }
    
    return imageUrl;
  };

  const imageUrl = !imageError ? getProductImage() : DEFAULT_IMAGE;

  const {
    id = `product-${index}-${Date.now()}`,
    name = 'Unnamed Product',
    price = 0,
    original_price = null,
    category = 'Uncategorized',
    isNew = false,
    isSale = false,
    discount = 0,
    seller_id,
    seller_name
  } = product;

  // Format price
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price);

  const formattedOriginalPrice = original_price 
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      }).format(original_price)
    : null;

  // Handle card click
  const handleCardClick = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) return;
    navigate(`/product/${id}`);
  };

  // Handle quick add to cart
  const handleQuickAdd = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      showToast('Please login to add items to cart', 'info');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    if (seller_id === user?.id) {
      showToast('You cannot buy your own product', 'error');
      return;
    }

    setIsAddingToCart(true);
    try {
      await cartService.addToCart({ productId: id, quantity: 1 });
      showToast(`✓ "${name}" added to cart!`, 'cart');
      window.dispatchEvent(new Event('cart-updated'));
    } catch (error) {
      console.error('Error:', error);
      showToast(error.message || 'Failed to add to cart', 'error');
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Handle wishlist toggle
  const handleWishlist = async (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      showToast('Please login to add to wishlist', 'info');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(user.id, id);
        setIsInWishlist(false);
        showToast('Removed from wishlist', 'success');
      } else {
        await wishlistService.addToWishlist(id);
        setIsInWishlist(true);
        showToast('Added to wishlist', 'wishlist');
      }
      window.dispatchEvent(new CustomEvent('wishlist-updated'));
    } catch (error) {
      console.error('Error updating wishlist:', error);
      showToast(error.message || 'Failed to update wishlist', 'error');
    } finally {
      setWishlistLoading(false);
    }
  };

  // Handle quick view
  const handleQuickView = (e) => {
    e.stopPropagation();
    setShowQuickView(true);
  };

  // Star rating render
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(avgRating);
    const hasHalfStar = avgRating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      let starType = 'empty';
      if (i < fullStars) {
        starType = 'full';
      } else if (i === fullStars && hasHalfStar) {
        starType = 'half';
      }
      
      stars.push(
        <Star
          key={`star-${id}-${i}`}
          className={`h-3 w-3 ${
            starType === 'full' ? 'fill-yellow-400 text-yellow-400' :
            starType === 'half' ? 'fill-yellow-400/50 text-yellow-400/50' :
            'text-gray-300'
          }`}
        />
      );
    }
    return stars;
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    hover: {
      y: -8,
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const iconVariants = {
    hover: {
      scale: 1.1,
      backgroundColor: "rgba(0,0,0,0.05)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.9,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
      backgroundColor: "#1a1a1a",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    }
  };

  const badgeVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    }
  };

  const quickViewVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25
      }
    },
    exit: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        whileTap="tap"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleCardClick}
        className={`group cursor-pointer ${
          layout === 'grid' ? 'w-full' : 'flex gap-6 items-center'
        }`}
      >
        {/* Image Container */}
        <div className={`relative overflow-hidden bg-gray-100 ${
          layout === 'grid' ? 'aspect-square mb-4' : 'w-48 aspect-square shrink-0'
        } rounded-lg`}>
          <motion.img
            src={imageUrl}
            alt={name}
            variants={imageVariants}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            onError={() => setImageError(true)}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <AnimatePresence>
              {isNew && (
                <motion.span
                  key={`badge-new-${id}`}
                  variants={badgeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="px-2 py-1 bg-black text-white text-[10px] tracking-wider rounded"
                >
                  NEW
                </motion.span>
              )}
              {isSale && discount > 0 && (
                <motion.span
                  key={`badge-sale-${id}`}
                  variants={badgeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  className="px-2 py-1 bg-red-500 text-white text-[10px] tracking-wider rounded"
                >
                  -{discount}%
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <motion.button
              key={`heart-${id}`}
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleWishlist}
              disabled={wishlistLoading}
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-gray-200 shadow-md hover:shadow-lg transition-shadow disabled:opacity-50"
            >
              {wishlistLoading ? (
                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
              )}
            </motion.button>

            <motion.button
              key={`eye-${id}`}
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleQuickView}
              className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-gray-200 shadow-md hover:shadow-lg transition-shadow"
            >
              <Eye className="h-4 w-4 text-gray-600" />
            </motion.button>
          </div>

          {/* Quick Add Button */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                key={`quick-add-${id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-3 left-3 right-3"
              >
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleQuickAdd}
                  disabled={isAddingToCart}
                  className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 shadow-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isAddingToCart ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      Quick Add
                    </>
                  )}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Product Info */}
        <div className={`${layout === 'grid' ? 'space-y-2' : 'flex-1 space-y-2'}`}>
          <p className="text-xs text-gray-500 uppercase tracking-wider">{category}</p>
          <h3 className="font-medium text-gray-900 line-clamp-2">{name}</h3>
          
          {/* Seller Info - THÊM LINK ĐẾN SELLER PROFILE */}
          {seller_name && (
            <Link
              to={`/seller/${seller_id}`}
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-black transition-colors group"
            >
              <User className="h-3 w-3" />
              <span className="hover:underline">by {seller_name}</span>
            </Link>
          )}
          
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {loadingReviews ? (
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              ) : (
                renderStars()
              )}
            </div>
            <span className="text-xs text-gray-500">({reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-900">{formattedPrice}</span>
            {formattedOriginalPrice && (
              <span className="text-sm text-gray-400 line-through">{formattedOriginalPrice}</span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {showQuickView && (
          <motion.div
            key={`modal-${id}`}
            variants={quickViewVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowQuickView(false)}
          >
            <motion.div
              className="bg-white max-w-3xl w-full p-8 rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img 
                    src={imageUrl} 
                    alt={name} 
                    className="w-full h-full object-cover"
                    onError={(e) => e.target.src = DEFAULT_IMAGE}
                  />
                </div>
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 uppercase tracking-wider">{category}</p>
                  <h2 className="text-2xl font-light text-gray-900">{name}</h2>
                  
                  {/* Seller in Modal */}
                  {seller_name && (
                    <Link
                      to={`/seller/${seller_id}`}
                      onClick={() => setShowQuickView(false)}
                      className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black"
                    >
                      <User className="h-4 w-4" />
                      <span className="hover:underline">Sold by: {seller_name}</span>
                    </Link>
                  )}
                  
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-light text-gray-900">{formattedPrice}</span>
                    {formattedOriginalPrice && (
                      <span className="text-lg text-gray-400 line-through">{formattedOriginalPrice}</span>
                    )}
                  </div>

                  {/* Rating trong modal */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {renderStars()}
                    </div>
                    <span className="text-sm text-gray-500">
                      {avgRating.toFixed(1)} out of 5 ({reviewCount} reviews)
                    </span>
                  </div>

                  <p className="text-gray-600 leading-relaxed">
                    {product?.description || 'No description available.'}
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={handleQuickAdd}
                      disabled={isAddingToCart}
                      className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                    >
                      {isAddingToCart ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="h-5 w-5" />
                          Add to Cart
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={handleWishlist}
                      disabled={wishlistLoading}
                      className="px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                      {wishlistLoading ? (
                        <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setShowQuickView(false);
                      navigate(`/product/${id}`);
                    }}
                    className="w-full py-3 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    View Full Details
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProductCard;
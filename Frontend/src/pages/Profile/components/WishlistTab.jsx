import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, XCircle } from 'lucide-react';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&auto=format';

const WishlistTab = ({ wishlist, onRemove }) => {
  const navigate = useNavigate();

  const getProductImage = (item) => {
    if (!item) return DEFAULT_IMAGE;
    
    let imageUrl = DEFAULT_IMAGE;
    
    if (item.images) {
      try {
        if (typeof item.images === 'string') {
          if (item.images.trim().startsWith('[')) {
            const parsed = JSON.parse(item.images);
            if (Array.isArray(parsed) && parsed.length > 0) {
              imageUrl = parsed[0];
            }
          } else {
            imageUrl = item.images;
          }
        } else if (Array.isArray(item.images) && item.images.length > 0) {
          imageUrl = item.images[0];
        }
      } catch (e) {
        console.log('Image parse error:', e);
      }
    }
    
    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
      imageUrl = `http://localhost:5000${imageUrl}`;
    }
    
    return imageUrl;
  };

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Your wishlist is empty</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {wishlist.map((item, index) => {
        const itemImage = getProductImage(item);
        
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => navigate(`/product/${item.product_id}`)}
          >
            <div className="aspect-square bg-gray-100 relative overflow-hidden">
              <img
                src={itemImage}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={(e) => e.target.src = DEFAULT_IMAGE}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(item.product_id);
                }}
                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
              >
                <XCircle className="h-5 w-5 text-red-500" />
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-medium mb-1 line-clamp-2">{item.name}</h3>
              <p className="text-lg font-light">${Number(item.price).toFixed(2)}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Add to cart functionality
                }}
                className="mt-3 w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default WishlistTab;
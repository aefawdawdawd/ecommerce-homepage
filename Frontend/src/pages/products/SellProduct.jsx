import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, X, Plus, ChevronDown, 
  AlertCircle, CheckCircle, Upload
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { productService } from '../../services/productService';

const SellProduct = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    condition: 'new',
    stock: '',
    shipping: 'free'
  });

  const categories = [
    'Electronics', 'Laptops', 'Phones', 'Audio', 
    'Tablets', 'Accessories', 'Wearables', 'Cameras',
    'Books', 'Clothing', 'Sports', 'Home & Garden'
  ];

  const conditions = [
    { value: 'new', label: 'New - Never used' },
    { value: 'like_new', label: 'Like New - Minimal wear' },
    { value: 'good', label: 'Good - Some wear' },
    { value: 'fair', label: 'Fair - Visible wear' }
  ];

  // Kiểm tra đăng nhập
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Cleanup preview URLs khi component unmount
  useEffect(() => {
    return () => {
      images.forEach(img => {
        if (img.preview) {
          URL.revokeObjectURL(img.preview);
        }
      });
    };
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Kiểm tra số lượng ảnh
    if (images.length + files.length > 5) {
      setNotification({
        show: true,
        type: 'error',
        message: 'Maximum 5 images allowed'
      });
      setTimeout(() => setNotification({ show: false }), 3000);
      return;
    }

    // Kiểm tra kích thước file (max 5MB mỗi ảnh)
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        setNotification({
          show: true,
          type: 'error',
          message: `File ${file.name} is too large. Max 5MB`
        });
        return false;
      }
      return true;
    });

    // Tạo preview và lưu file thật
    const newImages = validFiles.map(file => ({
      file, // Giữ nguyên file để upload sau
      preview: URL.createObjectURL(file), // Preview tạm thời
      name: file.name
    }));
    
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    // Revoke preview URL để tránh memory leak
    if (images[index].preview) {
      URL.revokeObjectURL(images[index].preview);
    }
    setImages(images.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setNotification({
        show: true,
        type: 'error',
        message: 'Product name is required'
      });
      return false;
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      setNotification({
        show: true,
        type: 'error',
        message: 'Please enter a valid price'
      });
      return false;
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      setNotification({
        show: true,
        type: 'error',
        message: 'Please enter a valid stock quantity'
      });
      return false;
    }

    if (images.length === 0) {
      setNotification({
        show: true,
        type: 'error',
        message: 'Please upload at least one product image'
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Tạo FormData để gửi file
      const formDataToSend = new FormData();
      
      // Thêm các trường text
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim() || '');
      formDataToSend.append('price', parseFloat(formData.price).toString());
      formDataToSend.append('category', formData.category);
      formDataToSend.append('stock', parseInt(formData.stock).toString());
      formDataToSend.append('product_condition', formData.condition);
      
      // Thêm files - lấy file thật từ state images
      images.forEach((img) => {
        if (img.file) {
          // Nếu là file thật (từ input file)
          formDataToSend.append('images', img.file);
        }
      });

      // Log để debug
      console.log('Submitting product with images:', images.map(img => img.name));
      console.log('FormData entries:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1]);
      }

      const result = await productService.createProduct(formDataToSend);
      
      if (result.success) {
        setNotification({
          show: true,
          type: 'success',
          message: 'Product listed successfully! Redirecting...'
        });
        
        // Cleanup preview URLs
        images.forEach(img => {
          if (img.preview) {
            URL.revokeObjectURL(img.preview);
          }
        });
        
        setTimeout(() => {
          navigate(`/product/${result.productId}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      setNotification({
        show: true,
        type: 'error',
        message: error.response?.data?.error || error.message || 'Failed to list product'
      });
    } finally {
      setLoading(false);
    }
  };

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

      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-light text-gray-900">Sell Your Item</h1>
            <p className="text-gray-500 mt-2">
              List your item for sale on G2 Tech Marketplace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                    <img 
                      src={img.preview} 
                      alt={`Product ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <div className="absolute bottom-1 left-1 right-1 bg-black/50 text-white text-[10px] px-1 py-0.5 rounded truncate opacity-0 group-hover:opacity-100 transition-opacity">
                      {img.name}
                    </div>
                  </div>
                ))}
                
                {images.length < 5 && (
                  <label className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors group">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Upload className="h-6 w-6 text-gray-400 group-hover:text-gray-600 mb-1" />
                    <span className="text-xs text-gray-500 group-hover:text-gray-700">Upload</span>
                  </label>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Upload up to 5 images (JPEG, PNG, GIF, WEBP). Max 5MB each. First image will be the cover.
              </p>
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                placeholder="e.g., MacBook Pro 16-inch 2023"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="5"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                placeholder="Describe your item in detail including condition, features, reason for selling, etc."
              />
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                  placeholder="299.99"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                  placeholder="10"
                  required
                />
              </div>
            </div>

            {/* Category and Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                >
                  {conditions.map(cond => (
                    <option key={cond.value} value={cond.value}>{cond.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Shipping */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shipping Options
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="shipping"
                    value="free"
                    checked={formData.shipping === 'free'}
                    onChange={(e) => setFormData({ ...formData, shipping: e.target.value })}
                    className="text-black"
                  />
                  <span>Free shipping (I'll cover the cost)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="shipping"
                    value="calculated"
                    checked={formData.shipping === 'calculated'}
                    onChange={(e) => setFormData({ ...formData, shipping: e.target.value })}
                    className="text-black"
                  />
                  <span>Calculated shipping (Buyer pays)</span>
                </label>
              </div>
            </div>

            {/* Terms */}
            <div className="pt-4 border-t border-gray-100">
              <label className="flex items-start gap-2">
                <input type="checkbox" required className="mt-1 text-black" />
                <span className="text-sm text-gray-600">
                  I confirm that this item complies with G2 Tech's listing policies and 
                  that all information provided is accurate.
                </span>
              </label>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Listing...</span>
                  </>
                ) : (
                  'List Item for Sale'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellProduct;
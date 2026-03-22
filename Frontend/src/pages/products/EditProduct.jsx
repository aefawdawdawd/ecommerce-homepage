import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Camera, X, Plus, ChevronLeft,
  AlertCircle, CheckCircle 
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { productService } from '../../services/productService';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    condition: 'new',
    stock: '',
    status: 'active'
  });

  const categories = [
    'Electronics', 'Laptops', 'Phones', 'Audio', 
    'Tablets', 'Accessories', 'Wearables', 'Cameras',
    'Books', 'Clothing', 'Sports', 'Home & Garden'
  ];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const product = await productService.getProductById(id);
      
      // Kiểm tra quyền sở hữu
      if (product.seller_id !== user.id && user.role !== 'admin') {
        navigate('/');
        return;
      }

      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        category: product.category,
        condition: product.condition || 'new',
        stock: product.stock,
        status: product.status
      });

      // Load images
      if (product.images) {
        setImages(JSON.parse(product.images).map(url => ({ preview: url, isExisting: true })));
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      setNotification({
        show: true,
        type: 'error',
        message: 'Maximum 5 images allowed'
      });
      return;
    }

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      isExisting: false
    }));
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    if (!images[index].isExisting) {
      URL.revokeObjectURL(images[index].preview);
    }
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const imageUrls = images
        .filter(img => img.isExisting)
        .map(img => img.preview);
      
      // Trong thực tế, upload ảnh mới lên server ở đây

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: JSON.stringify(imageUrls)
      };

      const result = await productService.updateProduct(id, productData);
      
      if (result.success) {
        setNotification({
          show: true,
          type: 'success',
          message: 'Product updated successfully!'
        });
        
        setTimeout(() => {
          navigate(`/product/${id}`);
        }, 1500);
      }
    } catch (error) {
      setNotification({
        show: true,
        type: 'error',
        message: error.message
      });
    } finally {
      setSaving(false);
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
      {notification.show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
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

      <div className="max-w-3xl mx-auto px-4">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <h1 className="text-3xl font-light text-gray-900 mb-8">Edit Product</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images
              </label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img src={img.preview} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                
                {images.length < 5 && (
                  <label className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Plus className="h-6 w-6 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">Add Image</span>
                  </label>
                )}
              </div>
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
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
              />
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
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
                  <option value="new">New</option>
                  <option value="like_new">Like New</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                </select>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
              >
                <option value="active">Active (Visible to buyers)</option>
                <option value="inactive">Inactive (Hidden)</option>
                <option value="sold">Sold Out</option>
              </select>
            </div>

            {/* Buttons */}
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
                disabled={saving}
                className="flex-1 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
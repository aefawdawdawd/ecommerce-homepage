import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit2, Trash2, Search, X, Save, 
  AlertCircle, CheckCircle, Image as ImageIcon 
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../hooks/useAuth';

const ProductManagement = () => {
  const { user } = useAuth();
  const { 
    products, 
    loading, 
    error, 
    fetchProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    searchProducts 
  } = useProducts();

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    image_url: '',
    stock: ''
  });

  // Categories
  const categories = [
    'Electronics', 'Laptops', 'Phones', 'Audio', 
    'Tablets', 'Accessories', 'Wearables', 'Cameras'
  ];

  // Load products khi component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle search
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm) {
        searchProducts(searchTerm);
      } else {
        fetchProducts();
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 3000);
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || 'Electronics',
        image_url: product.image_url || '',
        stock: product.stock || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Electronics',
        image_url: '',
        stock: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate
    if (!formData.name || !formData.price || !formData.stock) {
      showNotification('error', 'Please fill in all required fields');
      return;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock)
    };

    let result;
    if (editingProduct) {
      result = await updateProduct(editingProduct.id, productData);
    } else {
      result = await createProduct(productData);
    }

    if (result.success) {
      showNotification('success', editingProduct ? 'Product updated!' : 'Product created!');
      handleCloseModal();
    } else {
      showNotification('error', result.error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const result = await deleteProduct(id);
      if (result.success) {
        showNotification('success', 'Product deleted!');
      } else {
        showNotification('error', result.error);
      }
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  // Kiểm tra quyền admin (VULNERABILITY: Dễ dàng bypass)
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-light mb-2">Access Denied</h2>
          <p className="text-black/60">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-16">
      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-8 right-8 z-50 px-6 py-3 flex items-center gap-3 ${
              notification.type === 'success' ? 'bg-black text-white' : 'bg-red-500 text-white'
            }`}
          >
            {notification.type === 'success' ? 
              <CheckCircle className="h-4 w-4" /> : 
              <AlertCircle className="h-4 w-4" />
            }
            <span className="text-sm font-light">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-light text-black">Product Management</h1>
            <p className="text-sm text-black/40 mt-1">
              Total Products: {products.length}
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-light"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/20" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-black/10 focus:border-black outline-none text-sm"
            />
          </div>
        </div>

        {/* Products Table */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white border border-black/5 overflow-hidden"
        >
          <table className="w-full">
            <thead className="bg-black/5 border-b border-black/5">
              <tr>
                <th className="text-left py-4 px-4 text-xs font-light text-black/40">Image</th>
                <th className="text-left py-4 px-4 text-xs font-light text-black/40">Name</th>
                <th className="text-left py-4 px-4 text-xs font-light text-black/40">Category</th>
                <th className="text-left py-4 px-4 text-xs font-light text-black/40">Price</th>
                <th className="text-left py-4 px-4 text-xs font-light text-black/40">Stock</th>
                <th className="text-right py-4 px-4 text-xs font-light text-black/40">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-8">
                    <div className="inline-block w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-black/40">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    variants={itemVariants}
                    className="border-b border-black/5 hover:bg-black/02 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 bg-black/5 overflow-hidden">
                        {product.image_url ? (
                          <img 
                            src={product.image_url} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-4 w-4 text-black/20" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-light">{product.name}</p>
                      <p className="text-xs text-black/40 truncate max-w-xs">
                        {product.description}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-sm">{product.category}</td>
                    <td className="py-3 px-4">
                      <span className="font-light">${product.price}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-sm ${product.stock > 0 ? 'text-black' : 'text-red-500'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenModal(product)}
                        className="p-2 text-black/40 hover:text-black transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-black/40 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>

        {/* Product Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={handleCloseModal}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white max-w-2xl w-full p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-light">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="p-2 text-black/40 hover:text-black"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs text-black/40 mb-1">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-black/10 focus:border-black outline-none text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-black/40 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="3"
                      className="w-full px-4 py-2 border border-black/10 focus:border-black outline-none text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-black/40 mb-1">Price *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-2 border border-black/10 focus:border-black outline-none text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-black/40 mb-1">Stock *</label>
                      <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className="w-full px-4 py-2 border border-black/10 focus:border-black outline-none text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-black/40 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-black/10 focus:border-black outline-none text-sm bg-white"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-black/40 mb-1">Image URL</label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="w-full px-4 py-2 border border-black/10 focus:border-black outline-none text-sm"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-6 py-2 border border-black/10 text-black/60 hover:text-black transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-black text-white text-sm font-light flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {editingProduct ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductManagement;
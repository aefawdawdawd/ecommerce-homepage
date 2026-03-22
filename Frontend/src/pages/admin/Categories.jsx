import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Grid, Plus, Edit2, Trash2, ChevronLeft,
  Save, X, AlertCircle, CheckCircle
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const Categories = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Electronics', slug: 'electronics', count: 45, status: 'active' },
    { id: 2, name: 'Laptops', slug: 'laptops', count: 23, status: 'active' },
    { id: 3, name: 'Phones', slug: 'phones', count: 18, status: 'active' },
    { id: 4, name: 'Audio', slug: 'audio', count: 32, status: 'active' },
    { id: 5, name: 'Wearables', slug: 'wearables', count: 15, status: 'inactive' },
    { id: 6, name: 'Accessories', slug: 'accessories', count: 28, status: 'active' },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    status: 'active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    if (editingCategory) {
      setCategories(categories.map(c => 
        c.id === editingCategory.id ? { ...formData, id: c.id, count: c.count } : c
      ));
      showToast('Category updated successfully', 'success');
    } else {
      const newCategory = {
        ...formData,
        id: categories.length + 1,
        count: 0
      };
      setCategories([...categories, newCategory]);
      showToast('Category added successfully', 'success');
    }

    setShowAddModal(false);
    setEditingCategory(null);
    setFormData({ name: '', slug: '', status: 'active' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(c => c.id !== id));
      showToast('Category deleted', 'success');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      status: category.status
    });
    setShowAddModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-light text-gray-900">Categories</h1>
              <p className="text-gray-500 mt-1">Manage product categories</p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingCategory(null);
              setFormData({ name: '', slug: '', status: 'active' });
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Grid className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-500">Slug: {category.slug}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  category.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {category.status}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">{category.count} products</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Edit2 className="h-4 w-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
              onClick={() => setShowAddModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-light">
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                  </h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                      placeholder="e.g., Electronics"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug *
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                      placeholder="electronics"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                    >
                      {editingCategory ? 'Update' : 'Create'}
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

export default Categories;
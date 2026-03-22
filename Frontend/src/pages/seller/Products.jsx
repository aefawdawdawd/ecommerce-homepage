import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, Plus, Edit2, Trash2, Eye,
  Search, Filter, ChevronLeft, DollarSign,
  TrendingUp, AlertCircle, CheckCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { productService } from '../../services/productService';
import { useToast } from '../../context/ToastContext';

const Products = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    sold: 0,
    revenue: 0
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getSellerProducts(user.id);
      setProducts(data);
      
      // Calculate stats
      const total = data.length;
      const active = data.filter(p => p.status === 'active').length;
      const sold = data.filter(p => p.status === 'sold').length;
      const revenue = data.reduce((sum, p) => sum + (Number(p.price) * (p.sold_count || 0)), 0);
      
      setStats({ total, active, sold, revenue });
    } catch (error) {
      console.error('Error loading products:', error);
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await productService.deleteProduct(id);
      showToast('Product deleted successfully', 'success');
      loadProducts();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      sold: 'bg-blue-100 text-blue-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/seller/dashboard')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-light text-gray-900">My Products</h1>
              <p className="text-gray-500 mt-1">Manage your inventory</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/sell')}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-2xl font-light mt-1">{stats.total}</p>
              </div>
              <Package className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-light mt-1">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Sold</p>
                <p className="text-2xl font-light mt-1">{stats.sold}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <p className="text-2xl font-light mt-1">${stats.revenue.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Products Table */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-light text-gray-900 mb-2">No products found</h2>
            <p className="text-gray-500 mb-6">
              {search ? 'Try a different search' : 'Start adding products to your store'}
            </p>
            {!search && (
              <button
                onClick={() => navigate('/sell')}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 inline-flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Add Your First Product
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase">Stock</th>
                    <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-right py-4 px-6 text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                            {product.images && (
                              <img 
                                src={JSON.parse(product.images)[0] || 'https://via.placeholder.com/48'} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{product.category}</td>
                      <td className="py-4 px-6 font-medium">${Number(product.price).toFixed(2)}</td>
                      <td className="py-4 px-6">{product.stock}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(product.status)}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/product/${product.id}`)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            title="View"
                          >
                            <Eye className="h-4 w-4 text-gray-500" />
                          </button>
                          <button
                            onClick={() => navigate(`/edit-product/${product.id}`)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4 text-gray-500" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
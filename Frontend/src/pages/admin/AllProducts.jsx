import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Package, Search, Filter, ChevronLeft,
  Edit2, Trash2, Eye, AlertCircle,
  CheckCircle, XCircle, ChevronDown
} from 'lucide-react';
import { productService } from '../../services/productService';
import { useToast } from '../../context/ToastContext';

const AllProducts = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 1
  });

  useEffect(() => {
    loadProducts();
  }, [filter, sortBy, pagination.page]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getProducts({
        status: filter !== 'all' ? filter : undefined,
        sort: sortBy,
        page: pagination.page,
        limit: 15
      });
      
      setProducts(response.products || []);
      setPagination(response.pagination || { page: 1, total: 0, pages: 1 });
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
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.seller_name?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      sold: 'bg-blue-100 text-blue-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const stats = {
    total: pagination.total,
    active: products.filter(p => p.status === 'active').length,
    inactive: products.filter(p => p.status === 'inactive').length,
    sold: products.filter(p => p.status === 'sold').length
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-light text-gray-900">All Products</h1>
            <p className="text-gray-500 mt-1">Manage all products in the marketplace</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500 mb-1">Total Products</p>
            <p className="text-2xl font-light">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500 mb-1">Active</p>
            <p className="text-2xl font-light text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500 mb-1">Inactive</p>
            <p className="text-2xl font-light text-gray-600">{stats.inactive}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm text-gray-500 mb-1">Sold</p>
            <p className="text-2xl font-light text-blue-600">{stats.sold}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product name or seller..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="sold">Sold</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 bg-white"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-light text-gray-900 mb-2">No products found</h2>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase">Seller</th>
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
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-xs text-gray-500">ID: {product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-xs">{product.seller_name?.charAt(0)}</span>
                          </div>
                          <span className="text-sm">{product.seller_name || 'Unknown'}</span>
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
                            onClick={() => navigate(`/admin/products/edit/${product.id}`)}
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

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing page {pagination.page} of {pagination.pages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-1 border border-gray-200 rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
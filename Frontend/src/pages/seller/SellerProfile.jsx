import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Package, Star, MapPin, Calendar,
  Mail, Phone, Award, Shield, ChevronLeft,
  ShoppingBag, Truck, CheckCircle, XCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/userService';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import Rating from '../../components/Rating';
import ProductCard from '../../components/ProductCard';

const SellerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    avgRating: 0,
    reviewCount: 0,
    memberSince: '',
    responseRate: 98,
    responseTime: '< 2 hours'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadSellerData();
    }
  }, [id]);

  const loadSellerData = async () => {
    setLoading(true);
    try {
      // Lấy thông tin seller
      const sellerData = await userService.getUserById(id);
      setSeller(sellerData);

      // Lấy sản phẩm của seller
      const productsData = await productService.getSellerProducts(id);
      setProducts(productsData);

      // Tính toán thống kê
      const totalSales = productsData.reduce((sum, p) => sum + (p.sold_count || 0), 0);
      const avgRating = productsData.reduce((sum, p) => sum + (p.rating || 0), 0) / (productsData.length || 1);
      
      setStats({
        totalProducts: productsData.length,
        totalSales,
        avgRating: avgRating || 0,
        reviewCount: productsData.reduce((sum, p) => sum + (p.review_count || 0), 0),
        memberSince: sellerData.created_at ? new Date(sellerData.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long'
        }) : '2024',
        responseRate: 98,
        responseTime: '< 2 hours'
      });

    } catch (error) {
      console.error('Error loading seller data:', error);
      setError(error.message || 'Failed to load seller profile');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading seller profile...</p>
        </div>
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-light mb-2">Seller Not Found</h2>
          <p className="text-gray-500 mb-6">{error || 'The seller you\'re looking for doesn\'t exist'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        {/* Seller Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-8 mb-6"
        >
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="w-24 h-24 bg-linear-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white text-4xl font-light">
              {seller.full_name?.charAt(0) || seller.username?.charAt(0) || 'S'}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-light text-gray-900">
                    {seller.full_name || seller.username}
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {seller.role === 'seller' ? 'Professional Seller' : 'Verified Seller'}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Verified
                    </span>
                  </div>
                </div>

                {/* Contact buttons */}
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Contact Seller
                  </button>
                </div>
              </div>

              {/* Seller stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {stats.memberSince}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Products</p>
                  <p className="font-medium flex items-center gap-1">
                    <Package className="h-4 w-4 text-gray-400" />
                    {stats.totalProducts}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Sales</p>
                  <p className="font-medium flex items-center gap-1">
                    <ShoppingBag className="h-4 w-4 text-gray-400" />
                    {stats.totalSales}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Response Rate</p>
                  <p className="font-medium flex items-center gap-1">
                    <Truck className="h-4 w-4 text-gray-400" />
                    {stats.responseRate}%
                  </p>
                </div>
              </div>

              {/* Bio */}
              {seller.bio && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 italic">"{seller.bio}"</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Average Rating</p>
                <div className="flex items-center gap-2 mt-1">
                  <Rating value={stats.avgRating} size="md" />
                  <span className="text-sm font-medium">{stats.avgRating.toFixed(1)}</span>
                </div>
              </div>
              <Star className="h-8 w-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Reviews</p>
                <p className="text-2xl font-light mt-1">{stats.reviewCount}</p>
              </div>
              <Award className="h-8 w-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Response Time</p>
                <p className="text-2xl font-light mt-1">{stats.responseTime}</p>
              </div>
              <Truck className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Verification</p>
                <p className="text-lg font-light mt-1 flex items-center gap-1">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Verified
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-400" />
            </div>
          </div>
        </div>

        {/* Seller's Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-xl font-light mb-6">Products by {seller.full_name || seller.username}</h2>
          
          {products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">This seller hasn't listed any products yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Seller Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-xl font-light mb-4">Seller Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{seller.email}</p>
              </div>
            </div>
            
            {seller.phone && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{seller.phone}</p>
                </div>
              </div>
            )}
            
            {seller.address && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg md:col-span-2">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium">{seller.address}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SellerProfile;
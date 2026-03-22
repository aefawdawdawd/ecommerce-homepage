import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react'; // Thêm import
import { useAuth } from '../../hooks/useAuth';
import { useProfileData } from './hooks/useProfileData';
import ProfileHeader from './components/ProfileHeader';
import ProfileStats from './components/ProfileStats';
import ProfileTabs from './components/ProfileTabs';
import OverviewTab from './components/OverviewTab';
import OrdersTab from './components/OrdersTab';
import WishlistTab from './components/WishlistTab';
import SettingsTab from './components/SettingsTab';
import DeleteConfirm from './components/DeleteConfirm';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    profileData,
    orders,
    wishlist,
    loading,
    stats,
    updateProfile,
    changePassword,
    deleteAccount,
    removeFromWishlist,
    refreshData
  } = useProfileData();

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    birth_date: '',
    gender: 'male'
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        full_name: profileData.full_name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        address: profileData.address || '',
        bio: profileData.bio || '',
        birth_date: profileData.birth_date || '',
        gender: profileData.gender || 'male'
      });
    }
  }, [profileData]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateProfile(formData);
    if (result?.success) {
      setIsEditing(false);
    }
  };

  const handleDeleteAccount = async () => {
    const result = await deleteAccount();
    if (result?.success) {
      setShowDeleteConfirm(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  if (loading && !profileData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            {/* Back button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:text-black hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back</span>
            </motion.button>

            {/* Home button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition-all shadow-md"
            >
              <Home className="h-4 w-4" />
              <span className="text-sm font-medium">Home</span>
            </motion.button>
          </div>

          {/* Breadcrumb */}
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
            <button onClick={() => navigate('/')} className="hover:text-black">Home</button>
            <span>/</span>
            <button onClick={() => navigate('/profile')} className="hover:text-black">Profile</button>
            {activeTab !== 'overview' && (
              <>
                <span>/</span>
                <span className="text-black capitalize">{activeTab}</span>
              </>
            )}
          </div>
        </motion.div>

        {/* Quick Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-white rounded-xl shadow-sm border border-gray-100"
        >
          <span className="text-sm text-gray-500 font-medium">Quick actions:</span>
          
          <button
            onClick={() => navigate('/')}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center gap-1"
          >
            <Home className="h-3 w-3" />
            Browse Products
          </button>
          
          <button
            onClick={() => navigate('/orders')}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center gap-1"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            My Orders
          </button>
          
          <button
            onClick={() => navigate('/wishlist')}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center gap-1"
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Wishlist
          </button>
          
          {user?.role === 'seller' && (
            <button
              onClick={() => navigate('/seller/dashboard')}
              className="px-3 py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm flex items-center gap-1"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Seller Dashboard
            </button>
          )}
        </motion.div>

        <ProfileHeader
          user={user}
          profileData={profileData}
          isEditing={isEditing}
          onEdit={() => setIsEditing(!isEditing)}
          onLogout={handleLogout}
          onUpdate={refreshData}
        />

        <ProfileStats stats={stats} />

        <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          {activeTab === 'overview' && (
            <OverviewTab
              profileData={profileData}
              formData={formData}
              setFormData={setFormData}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              onSubmit={handleSubmit}
              onChangePassword={changePassword}
              onShowDeleteConfirm={() => setShowDeleteConfirm(true)}
              loading={loading}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersTab orders={orders} />
          )}

          {activeTab === 'wishlist' && (
            <WishlistTab 
              wishlist={wishlist} 
              onRemove={removeFromWishlist}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab />
          )}
        </motion.div>

        {/* Floating Home Button for Mobile */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => navigate('/')}
          className="fixed bottom-6 right-6 md:hidden bg-black text-white p-4 rounded-full shadow-lg z-40 flex items-center justify-center"
        >
          <Home className="h-6 w-6" />
        </motion.button>
      </div>

      <DeleteConfirm
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteAccount}
        loading={loading}
      />
    </div>
  );
};

export default Profile;
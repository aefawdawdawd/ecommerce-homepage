import { useState, useEffect } from 'react';
import { userService } from '../../../services/userService';
import { orderService } from '../../../services/orderService';
import { wishlistService } from '../../../services/wishlistService';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '../../../context/ToastContext';

export const useProfileData = () => {
  const { user, updateProfile: authUpdateProfile } = useAuth();
  const { showToast } = useToast();
  
  const [profileData, setProfileData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    avgOrderValue: 0,
    wishlistCount: 0,
    memberSince: ''
  });

  // Load all profile data
  const loadProfileData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Load user profile
      const profile = await userService.getCurrentUser();
      setProfileData(profile);

      // Load orders
      const ordersResponse = await orderService.getBuyerOrders();
      const ordersData = ordersResponse.orders || [];
      setOrders(ordersData);

      // Load wishlist
      const wishlistData = await wishlistService.getWishlist(user.id);
      setWishlist(wishlistData);

      // Calculate stats
      const totalSpent = ordersData.reduce((sum, order) => sum + Number(order.total_amount), 0);
      setStats({
        totalOrders: ordersData.length,
        totalSpent,
        avgOrderValue: ordersData.length > 0 ? totalSpent / ordersData.length : 0,
        wishlistCount: wishlistData.length,
        memberSince: profile?.created_at 
          ? new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
          : '2024'
      });

    } catch (err) {
      console.error('Error loading profile data:', err);
      setError(err.message);
      showToast('Failed to load profile data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (formData) => {
    setLoading(true);
    try {
      const result = await userService.updateProfile(user.id, formData);
      if (result.success) {
        await loadProfileData();
        showToast('Profile updated successfully', 'success');
        return { success: true };
      }
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    setLoading(true);
    try {
      const result = await userService.changePassword(user.id, passwordData);
      if (result.success) {
        showToast('Password changed successfully', 'success');
        return { success: true };
      }
    } catch (err) {
      showToast(err.message || 'Failed to change password', 'error');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Delete account
  const deleteAccount = async () => {
    setLoading(true);
    try {
      const result = await userService.deleteAccount(user.id);
      if (result.success) {
        showToast('Account deleted successfully', 'success');
        return { success: true };
      }
    } catch (err) {
      showToast(err.message || 'Failed to delete account', 'error');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      await wishlistService.removeFromWishlist(user.id, productId);
      setWishlist(wishlist.filter(item => item.product_id !== productId));
      showToast('Removed from wishlist', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to remove from wishlist', 'error');
    }
  };

  // Refresh data
  const refreshData = () => {
    loadProfileData();
  };

  useEffect(() => {
    if (user?.id) {
      loadProfileData();
    }
  }, [user?.id]);

  return {
    profileData,
    orders,
    wishlist,
    loading,
    error,
    stats,
    updateProfile,
    changePassword,
    deleteAccount,
    removeFromWishlist,
    refreshData
  };
};
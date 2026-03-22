import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, Calendar, Camera, Edit2, LogOut, 
  MapPin, Award, CheckCircle, Shield 
} from 'lucide-react';
import { userService } from '../../../services/userService';
import { useToast } from '../../../context/ToastContext';

const ProfileHeader = ({ user, profileData, isEditing, onEdit, onLogout, onUpdate }) => {
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const { showToast } = useToast();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [avatarHover, setAvatarHover] = useState(false);
  const [coverHover, setCoverHover] = useState(false);
  
  // Format member since
  const memberSince = profileData?.created_at 
    ? new Date(profileData.created_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      })
    : '2024';

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (profileData?.full_name) {
      return profileData.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    if (profileData?.username) {
      return profileData.username.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  // Handle avatar upload
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size must be less than 5MB', 'error');
      return;
    }

    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const result = await userService.uploadAvatar(user.id, formData);
      if (result.success) {
        showToast('Avatar updated successfully', 'success');
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      showToast(error.message || 'Failed to update avatar', 'error');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Handle cover upload
  const handleCoverClick = () => {
    coverInputRef.current?.click();
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error');
      return;
    }

    // Validate file size (max 10MB for cover)
    if (file.size > 10 * 1024 * 1024) {
      showToast('Image size must be less than 10MB', 'error');
      return;
    }

    setUploadingCover(true);
    const formData = new FormData();
    formData.append('cover', file);

    try {
      const result = await userService.uploadCover(user.id, formData);
      if (result.success) {
        showToast('Cover image updated successfully', 'success');
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      showToast(error.message || 'Failed to update cover', 'error');
    } finally {
      setUploadingCover(false);
    }
  };

  // Animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const coverVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
  };

  return (
    <motion.div
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6 border border-gray-100"
    >
      {/* Cover Photo */}
      <div 
        className="relative h-48 md:h-64 bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 overflow-hidden group"
        onMouseEnter={() => setCoverHover(true)}
        onMouseLeave={() => setCoverHover(false)}
      >
        {/* Cover image if exists */}
        {profileData?.cover_image && (
          <img 
            src={profileData.cover_image.startsWith('http') 
              ? profileData.cover_image 
              : `http://localhost:5000${profileData.cover_image}`
            }
            alt="Cover"
            className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
          />
        )}
        
        {/* Decorative pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} 
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Change cover button */}
        <motion.button
          variants={coverVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={handleCoverClick}
          className={`absolute bottom-4 right-4 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl 
                     hover:bg-white/30 transition-all flex items-center gap-2 border border-white/30
                     ${coverHover ? 'opacity-100' : 'opacity-0 md:opacity-0'} group-hover:opacity-100`}
          disabled={uploadingCover}
        >
          <input
            type="file"
            ref={coverInputRef}
            onChange={handleCoverChange}
            accept="image/*"
            className="hidden"
          />
          {uploadingCover ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Uploading...</span>
            </>
          ) : (
            <>
              <Camera className="h-4 w-4" />
              <span className="text-sm">Change Cover</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Profile Info Section */}
      <div className="relative px-4 sm:px-6 pb-6">
        {/* Avatar - positioned to overlap cover */}
        <div className="flex flex-col sm:flex-row sm:items-end -mt-12 sm:-mt-16 gap-4">
          <div 
            className="relative"
            onMouseEnter={() => setAvatarHover(true)}
            onMouseLeave={() => setAvatarHover(false)}
          >
            {/* Avatar container */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white overflow-hidden bg-linear-to-br from-gray-100 to-gray-200 shadow-xl group">
              {profileData?.avatar ? (
                <img 
                  src={profileData.avatar.startsWith('http') 
                    ? profileData.avatar 
                    : `http://localhost:5000${profileData.avatar}`
                  }
                  alt={profileData.full_name || user?.username}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-700 to-gray-900 text-white text-2xl font-light">
                  {getUserInitials()}
                </div>
              )}
              
              {/* Avatar hover overlay */}
              <motion.div 
                className="absolute inset-0 bg-black/50 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: avatarHover ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Camera className="h-6 w-6 text-white" />
              </motion.div>
            </div>

            {/* Change avatar button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAvatarClick}
              disabled={uploadingAvatar}
              className="absolute -bottom-1 -right-1 bg-black text-white p-2 rounded-xl 
                       hover:bg-gray-800 transition-colors shadow-lg disabled:bg-gray-400"
            >
              {uploadingAvatar ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </motion.button>
          </div>

          {/* User info */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-light text-gray-900">
                  {profileData?.full_name || profileData?.username || user?.username}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  {profileData?.role === 'seller' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs">
                      <Award className="h-3 w-3" />
                      Verified Seller
                    </span>
                  )}
                  {profileData?.role === 'admin' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs">
                      <Shield className="h-3 w-3" />
                      Administrator
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs">
                    <CheckCircle className="h-3 w-3" />
                    Verified Account
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onEdit}
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-sm font-medium ${
                    isEditing
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-black text-white hover:bg-gray-800 shadow-md'
                  }`}
                >
                  <Edit2 className="h-4 w-4" />
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onLogout}
                  className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all flex items-center gap-2 text-sm font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </motion.button>
              </div>
            </div>

            {/* Contact and stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
              <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-xl">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm truncate">{profileData?.email || user?.email}</span>
              </div>
              
              {profileData?.phone && (
                <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-xl">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{profileData.phone}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-xl">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Joined {memberSince}</span>
              </div>
              
              {profileData?.address && (
                <div className="flex items-center gap-2 text-gray-600 bg-gray-50 p-3 rounded-xl">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm truncate">{profileData.address}</span>
                </div>
              )}
            </div>

            {/* Bio section */}
            {profileData?.bio && (
              <div className="mt-3 p-4 bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-600 italic">"{profileData.bio}"</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
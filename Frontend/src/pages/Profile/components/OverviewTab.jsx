import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, Calendar, 
  Shield, Key, Lock, AlertCircle, Edit2, Save, X,
  ChevronRight, Eye, EyeOff
} from 'lucide-react';
import ChangePassword from './ChangePassword';

const OverviewTab = ({ 
  profileData,
  formData, 
  setFormData, 
  isEditing, 
  setIsEditing,
  onSubmit,
  onChangePassword,
  onShowDeleteConfirm,
  loading 
}) => {
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  const handlePasswordChange = async (passwordData) => {
    const result = await onChangePassword(passwordData);
    if (result.success) {
      setShowPasswordChange(false);
    }
    return result;
  };

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                placeholder="+1 234 567 8900"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
              <input
                type="date"
                value={formData.birth_date}
                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows="2"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                placeholder="Your address"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                placeholder="Tell us about yourself"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-gray-400 mt-1" />
            <div>
              <p className="text-xs text-gray-400 uppercase">Full Name</p>
              <p className="text-lg mt-1">{formData.full_name || 'Not provided'}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-gray-400 mt-1" />
            <div>
              <p className="text-xs text-gray-400 uppercase">Email</p>
              <p className="text-lg mt-1">{formData.email}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-gray-400 mt-1" />
            <div>
              <p className="text-xs text-gray-400 uppercase">Phone</p>
              <p className="text-lg mt-1">{formData.phone || 'Not provided'}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-gray-400 mt-1" />
            <div>
              <p className="text-xs text-gray-400 uppercase">Birth Date</p>
              <p className="text-lg mt-1">
                {formData.birth_date ? new Date(formData.birth_date).toLocaleDateString() : 'Not provided'}
              </p>
            </div>
          </div>
        </div>
        <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-gray-400 mt-1" />
            <div>
              <p className="text-xs text-gray-400 uppercase">Address</p>
              <p className="text-lg mt-1">{formData.address || 'Not provided'}</p>
            </div>
          </div>
        </div>
        <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <Edit2 className="h-5 w-5 text-gray-400 mt-1" />
            <div>
              <p className="text-xs text-gray-400 uppercase">Bio</p>
              <p className="text-lg mt-1">{formData.bio || 'No bio yet'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="border-t border-gray-100 pt-6">
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security
        </h3>
        <div className="space-y-3">
          <button
            onClick={() => setShowPasswordChange(true)}
            className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Key className="h-5 w-5 text-gray-400" />
              <div className="text-left">
                <p className="font-medium">Change Password</p>
                <p className="text-sm text-gray-500">Update your password regularly</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">Add extra security</p>
              </div>
            </div>
            <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm">
              Enable
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border-t border-red-100 pt-6">
        <h3 className="text-lg font-medium text-red-600 mb-4 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Danger Zone
        </h3>
        <div className="bg-red-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-800">Delete Account</p>
              <p className="text-sm text-red-600">Once deleted, all your data will be permanently removed</p>
            </div>
            <button
              onClick={onShowDeleteConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <ChangePassword
        isOpen={showPasswordChange}
        onClose={() => setShowPasswordChange(false)}
        onSubmit={handlePasswordChange}
        errors={passwordErrors}
        setErrors={setPasswordErrors}
        loading={loading}
      />
    </motion.div>
  );
};

export default OverviewTab;
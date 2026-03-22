import api from './api';

export const userService = {
  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Get user by ID
  getUserById: async (userId) => {
    const response = await api.get(`/users/profile/${userId}`);
    return response.data;
  },

  // Update profile
  updateProfile: async (userId, data) => {
    const response = await api.put(`/users/update/${userId}`, data);
    return response.data;
  },

  // Change password
  changePassword: async (userId, passwordData) => {
    const response = await api.post('/users/change-password', {
      userId,
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });
    return response.data;
  },

  // Upload avatar
  uploadAvatar: async (userId, formData) => {
    const response = await api.post(`/users/avatar/${userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Upload cover image
  uploadCover: async (userId, formData) => {
    const response = await api.post(`/users/cover/${userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Delete account
  deleteAccount: async (userId) => {
    const response = await api.delete(`/users/delete/${userId}`);
    return response.data;
  }
};
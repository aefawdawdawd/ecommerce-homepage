import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Plus, Edit2, Trash2, Check,
  ChevronLeft, AlertCircle, CheckCircle
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { addressService } from '../../services/addressService';

const AddressBook = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [formData, setFormData] = useState({
    recipient_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Vietnam',
    is_default: false
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadAddresses();
  }, [isAuthenticated, navigate]);

  const loadAddresses = async () => {
    setLoading(true);
    try {
      const data = await addressService.getAddresses();
      setAddresses(data);
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await addressService.updateAddress(editingAddress.id, formData);
        setNotification({
          show: true,
          type: 'success',
          message: 'Address updated successfully'
        });
      } else {
        await addressService.addAddress(formData);
        setNotification({
          show: true,
          type: 'success',
          message: 'Address added successfully'
        });
      }
      setShowForm(false);
      setEditingAddress(null);
      setFormData({
        recipient_name: '',
        phone: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'Vietnam',
        is_default: false
      });
      await loadAddresses();
    } catch (error) {
      setNotification({
        show: true,
        type: 'error',
        message: error.message
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    
    try {
      await addressService.deleteAddress(id);
      await loadAddresses();
      setNotification({
        show: true,
        type: 'success',
        message: 'Address deleted successfully'
      });
    } catch (error) {
      setNotification({
        show: true,
        type: 'error',
        message: error.message
      });
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await addressService.setDefaultAddress(id);
      await loadAddresses();
      setNotification({
        show: true,
        type: 'success',
        message: 'Default address updated'
      });
    } catch (error) {
      setNotification({
        show: true,
        type: 'error',
        message: error.message
      });
    }
  };

  const editAddress = (address) => {
    setEditingAddress(address);
    setFormData({
      recipient_name: address.recipient_name,
      phone: address.phone,
      address_line1: address.address_line1,
      address_line2: address.address_line2 || '',
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      is_default: address.is_default
    });
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
              notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
            } text-white`}
          >
            {notification.type === 'success' ? 
              <CheckCircle className="h-5 w-5" /> : 
              <AlertCircle className="h-5 w-5" />
            }
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-light text-gray-900">Address Book</h1>
        </div>

        {/* Address List */}
        <div className="space-y-4">
          {addresses.map((address) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{address.recipient_name}</p>
                      {address.is_default && (
                        <span className="text-xs bg-black text-white px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{address.phone}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {address.address_line1}
                      {address.address_line2 && `, ${address.address_line2}`}
                      <br />
                      {address.city}, {address.state} {address.postal_code}
                      <br />
                      {address.country}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!address.is_default && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-green-600"
                      title="Set as default"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => editAddress(address)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add Address Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mt-6 w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add New Address
          </button>
        )}

        {/* Address Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 bg-white rounded-xl shadow-sm p-6 overflow-hidden"
            >
              <h2 className="text-lg font-medium mb-4">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Recipient Name *</label>
                    <input
                      type="text"
                      value={formData.recipient_name}
                      onChange={(e) => setFormData({ ...formData, recipient_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Address Line 1 *</label>
                  <input
                    type="text"
                    value={formData.address_line1}
                    onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    value={formData.address_line2}
                    onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">State *</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">ZIP Code *</label>
                    <input
                      type="text"
                      value={formData.postal_code}
                      onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Country</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                  >
                    <option value="Vietnam">Vietnam</option>
                    <option value="USA">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Japan">Japan</option>
                    <option value="Korea">South Korea</option>
                  </select>
                </div>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_default}
                    onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                    className="text-black"
                  />
                  <span className="text-sm text-gray-600">Set as default address</span>
                </label>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingAddress(null);
                      setFormData({
                        recipient_name: '',
                        phone: '',
                        address_line1: '',
                        address_line2: '',
                        city: '',
                        state: '',
                        postal_code: '',
                        country: 'Vietnam',
                        is_default: false
                      });
                    }}
                    className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                  >
                    {editingAddress ? 'Update Address' : 'Save Address'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AddressBook;
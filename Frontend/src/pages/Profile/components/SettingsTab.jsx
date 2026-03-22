import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, Bell, Download, Share2, AlertCircle,
  Moon, Sun, CreditCard, MapPin, User, Mail,
  Phone, Lock, Eye, EyeOff, Save, X,
  CheckCircle, Plus, Trash2
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { userService } from '../../../services/userService';
import { addressService } from '../../../services/addressService';
import { useToast } from '../../../context/ToastContext';

const SettingsTab = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  // State cho preferences
  const [preferences, setPreferences] = useState({
    language: 'en',
    currency: 'USD',
    theme: 'light',
    timezone: 'America/New_York',
    notifications: {
      email: true,
      order: true,
      promotion: false,
      sms: false
    }
  });

  // State cho addresses
  const [addresses, setAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  
  // State cho new address form
  const [newAddress, setNewAddress] = useState({
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

  // State cho payment methods (mock - sẽ thay bằng API sau)
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: 'visa', last4: '4242', expiry: '12/25', default: true },
    { id: 2, type: 'mastercard', last4: '8888', expiry: '06/24', default: false }
  ]);

  // Load preferences từ localStorage khi mount
  useEffect(() => {
    const savedPrefs = localStorage.getItem('userPreferences');
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
    }
    loadAddresses();
  }, []);

  // Load addresses từ API
  const loadAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const data = await addressService.getAddresses();
      setAddresses(data || []);
    } catch (error) {
      console.error('Error loading addresses:', error);
      showToast('Failed to load addresses', 'error');
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Save preferences
  const savePreferences = async (newPrefs) => {
    setPreferences(newPrefs);
    localStorage.setItem('userPreferences', JSON.stringify(newPrefs));
    
    // Apply theme
    if (newPrefs.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Save to backend (nếu có API)
    try {
      await userService.updateProfile(user.id, { preferences: newPrefs });
      showToast('Preferences saved successfully', 'success');
    } catch (error) {
      console.error('Error saving preferences:', error);
      showToast('Failed to save preferences to server', 'error');
    }
  };

  // Handle notification change
  const handleNotificationChange = (key) => {
    const newPrefs = {
      ...preferences,
      notifications: {
        ...preferences.notifications,
        [key]: !preferences.notifications[key]
      }
    };
    savePreferences(newPrefs);
  };

  // Handle theme change
  const handleThemeChange = (theme) => {
    savePreferences({ ...preferences, theme });
  };

  // Handle language change
  const handleLanguageChange = (e) => {
    savePreferences({ ...preferences, language: e.target.value });
  };

  // Handle currency change
  const handleCurrencyChange = (e) => {
    savePreferences({ ...preferences, currency: e.target.value });
  };

  // Handle timezone change
  const handleTimezoneChange = (e) => {
    savePreferences({ ...preferences, timezone: e.target.value });
  };

  // Address functions
  const handleAddAddress = async () => {
    // Validate
    if (!newAddress.recipient_name || !newAddress.phone || !newAddress.address_line1) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      if (editingAddress) {
        await addressService.updateAddress(editingAddress.id, newAddress);
        showToast('Address updated successfully', 'success');
      } else {
        await addressService.addAddress(newAddress);
        showToast('Address added successfully', 'success');
      }
      
      setShowAddAddress(false);
      setEditingAddress(null);
      setNewAddress({
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
      showToast(error.message || 'Failed to save address', 'error');
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setNewAddress({
      recipient_name: address.recipient_name,
      phone: address.phone,
      address_line1: address.address_line1,
      address_line2: address.address_line2 || '',
      city: address.city || '',
      state: address.state || '',
      postal_code: address.postal_code || '',
      country: address.country || 'Vietnam',
      is_default: address.is_default || false
    });
    setShowAddAddress(true);
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    
    try {
      await addressService.deleteAddress(id);
      showToast('Address deleted successfully', 'success');
      await loadAddresses();
    } catch (error) {
      showToast(error.message || 'Failed to delete address', 'error');
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      await addressService.setDefaultAddress(id);
      showToast('Default address updated', 'success');
      await loadAddresses();
    } catch (error) {
      showToast(error.message || 'Failed to set default address', 'error');
    }
  };

  // Payment methods functions (mock)
  const handleSetDefaultPayment = (id) => {
    setPaymentMethods(methods =>
      methods.map(method => ({
        ...method,
        default: method.id === id
      }))
    );
    showToast('Default payment method updated', 'success');
  };

  const handleRemovePayment = (id) => {
    if (paymentMethods.find(m => m.id === id)?.default) {
      showToast('Cannot remove default payment method', 'error');
      return;
    }
    setPaymentMethods(methods => methods.filter(m => m.id !== id));
    showToast('Payment method removed', 'success');
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Preferences Section */}
      <motion.div variants={itemVariants} className="bg-gray-50 p-6 rounded-xl">
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-gray-500" />
          Preferences
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={preferences.language}
              onChange={handleLanguageChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 bg-white"
            >
              <option value="en">English</option>
              <option value="vi">Tiếng Việt</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="zh">中文</option>
              <option value="ja">日本語</option>
            </select>
          </div>

          {/* Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              value={preferences.currency}
              onChange={handleCurrencyChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 bg-white"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="VND">VND (₫)</option>
              <option value="SGD">SGD (S$)</option>
            </select>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Zone
            </label>
            <select
              value={preferences.timezone}
              onChange={handleTimezoneChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 bg-white"
            >
              <option value="America/New_York">EST (UTC-5)</option>
              <option value="America/Chicago">CST (UTC-6)</option>
              <option value="America/Denver">MST (UTC-7)</option>
              <option value="America/Los_Angeles">PST (UTC-8)</option>
              <option value="Europe/London">GMT (UTC+0)</option>
              <option value="Europe/Paris">CET (UTC+1)</option>
              <option value="Asia/Tokyo">JST (UTC+9)</option>
              <option value="Asia/Ho_Chi_Minh">ICT (UTC+7)</option>
              <option value="Australia/Sydney">AEDT (UTC+11)</option>
            </select>
          </div>

          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => handleThemeChange('light')}
                className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  preferences.theme === 'light'
                    ? 'bg-black text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Sun className="h-4 w-4" />
                Light
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  preferences.theme === 'dark'
                    ? 'bg-black text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Moon className="h-4 w-4" />
                Dark
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notifications Section */}
      <motion.div variants={itemVariants} className="bg-gray-50 p-6 rounded-xl">
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-gray-500" />
          Notifications
        </h3>
        
        <div className="space-y-3">
          <label className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-sm transition-shadow cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive updates and offers via email</p>
            </div>
            <button
              onClick={() => handleNotificationChange('email')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                preferences.notifications.email ? 'bg-black' : 'bg-gray-200'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  preferences.notifications.email ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </label>

          <label className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-sm transition-shadow cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Order Updates</p>
              <p className="text-sm text-gray-500">Get notified about your order status</p>
            </div>
            <button
              onClick={() => handleNotificationChange('order')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                preferences.notifications.order ? 'bg-black' : 'bg-gray-200'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  preferences.notifications.order ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </label>

          <label className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-sm transition-shadow cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">Promotional Emails</p>
              <p className="text-sm text-gray-500">Receive special offers and promotions</p>
            </div>
            <button
              onClick={() => handleNotificationChange('promotion')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                preferences.notifications.promotion ? 'bg-black' : 'bg-gray-200'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  preferences.notifications.promotion ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </label>

          <label className="flex items-center justify-between p-4 bg-white rounded-lg hover:shadow-sm transition-shadow cursor-pointer">
            <div>
              <p className="font-medium text-gray-900">SMS Notifications</p>
              <p className="text-sm text-gray-500">Get text messages for urgent updates</p>
            </div>
            <button
              onClick={() => handleNotificationChange('sms')}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                preferences.notifications.sms ? 'bg-black' : 'bg-gray-200'
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  preferences.notifications.sms ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </label>
        </div>
      </motion.div>

      {/* Payment Methods Section */}
      <motion.div variants={itemVariants} className="bg-gray-50 p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-gray-500" />
            Payment Methods
          </h3>
          <button
            onClick={() => showToast('Add payment method - Coming soon', 'info')}
            className="px-3 py-1 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add New
          </button>
        </div>

        <div className="space-y-3">
          {paymentMethods.map(method => (
            <div key={method.id} className="flex items-center justify-between p-4 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-8 rounded ${
                  method.type === 'visa' ? 'bg-blue-600' : 'bg-red-600'
                }`} />
                <div>
                  <p className="font-medium text-gray-900">
                    {method.type === 'visa' ? 'Visa' : 'Mastercard'} ending in {method.last4}
                  </p>
                  <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                </div>
                {method.default && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    Default
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {!method.default && (
                  <>
                    <button
                      onClick={() => handleSetDefaultPayment(method.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="Set as default"
                    >
                      <CheckCircle className="h-4 w-4 text-gray-400 hover:text-green-500" />
                    </button>
                    <button
                      onClick={() => handleRemovePayment(method.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="Remove"
                    >
                      <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Shipping Addresses Section */}
      <motion.div variants={itemVariants} className="bg-gray-50 p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gray-500" />
            Shipping Addresses
          </h3>
          <button
            onClick={() => {
              setEditingAddress(null);
              setNewAddress({
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
              setShowAddAddress(true);
            }}
            className="px-3 py-1 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add New
          </button>
        </div>

        {loadingAddresses ? (
          <div className="flex justify-center py-8">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          </div>
        ) : addresses.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-lg">
            <MapPin className="h-8 w-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No addresses saved</p>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map(address => (
              <div key={address.id} className="p-4 bg-white rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900">{address.recipient_name}</p>
                      {address.is_default && (
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{address.phone}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {address.address_line1}
                      {address.address_line2 && `, ${address.address_line2}`}
                      <br />
                      {address.city && `${address.city}, `}{address.state && `${address.state} `}{address.postal_code}
                      <br />
                      {address.country}
                    </p>
                  </div>
                  <div className="flex items-start gap-2 ml-4">
                    {!address.is_default && (
                      <button
                        onClick={() => handleSetDefaultAddress(address.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        title="Set as default"
                      >
                        <CheckCircle className="h-4 w-4 text-gray-400 hover:text-green-500" />
                      </button>
                    )}
                    <button
                      onClick={() => handleEditAddress(address)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="Edit"
                    >
                      <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit Address Modal */}
        {showAddAddress && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => setShowAddAddress(false)}>
            <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">
                  {editingAddress ? 'Edit Address' : 'Add New Address'}
                </h3>
                <button
                  onClick={() => setShowAddAddress(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient Name *
                  </label>
                  <input
                    type="text"
                    value={newAddress.recipient_name}
                    onChange={(e) => setNewAddress({ ...newAddress, recipient_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    value={newAddress.address_line1}
                    onChange={(e) => setNewAddress({ ...newAddress, address_line1: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                    placeholder="123 Main St"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={newAddress.address_line2}
                    onChange={(e) => setNewAddress({ ...newAddress, address_line2: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                    placeholder="Apt 4B"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                      placeholder="NY"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                    <input
                      type="text"
                      value={newAddress.postal_code}
                      onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                      placeholder="10001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <select
                      value={newAddress.country}
                      onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 bg-white"
                    >
                      <option value="Vietnam">Vietnam</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Japan">Japan</option>
                      <option value="South Korea">South Korea</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Thailand">Thailand</option>
                      <option value="Malaysia">Malaysia</option>
                      <option value="Indonesia">Indonesia</option>
                      <option value="Philippines">Philippines</option>
                      <option value="Cambodia">Cambodia</option>
                      <option value="Laos">Laos</option>
                    </select>
                  </div>
                </div>

                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={newAddress.is_default}
                    onChange={(e) => setNewAddress({ ...newAddress, is_default: e.target.checked })}
                    className="text-black"
                  />
                  <span className="text-sm text-gray-700">Set as default address</span>
                </label>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowAddAddress(false)}
                    className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddAddress}
                    className="flex-1 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                  >
                    {editingAddress ? 'Update Address' : 'Save Address'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Data & Privacy Section */}
      <motion.div variants={itemVariants} className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium mb-4">Data & Privacy</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-all hover:shadow-md group">
            <Download className="h-6 w-6 text-gray-400 group-hover:text-black mb-2" />
            <p className="font-medium text-gray-900">Download Data</p>
            <p className="text-xs text-gray-500 mt-1">Get a copy of your personal data</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-all hover:shadow-md group">
            <Share2 className="h-6 w-6 text-gray-400 group-hover:text-black mb-2" />
            <p className="font-medium text-gray-900">Privacy Settings</p>
            <p className="text-xs text-gray-500 mt-1">Manage your privacy preferences</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-all hover:shadow-md group">
            <AlertCircle className="h-6 w-6 text-gray-400 group-hover:text-red-500 mb-2" />
            <p className="font-medium text-gray-900">Delete Account</p>
            <p className="text-xs text-gray-500 mt-1">Permanently delete your account</p>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SettingsTab;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, Save, ChevronLeft,
  Globe, DollarSign, Mail, Shield, Bell,
  Lock, Palette, Users, Truck
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const Settings = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    siteName: 'G2 Tech Store',
    siteUrl: 'https://g2tech.com',
    supportEmail: 'support@g2tech.com',
    currency: 'USD',
    timezone: 'America/New_York',
    enableReviews: true,
    enableWishlist: true,
    enableGuestCheckout: false,
    minOrderAmount: 0,
    maxOrderAmount: 10000,
    shippingFee: 0,
    taxRate: 10,
    commissionRate: 5,
    maintenanceMode: false
  });

  const handleSave = () => {
    showToast('Settings saved successfully', 'success');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'payment', label: 'Payment', icon: DollarSign },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

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
            <h1 className="text-3xl font-light text-gray-900">System Settings</h1>
            <p className="text-gray-500 mt-1">Configure your marketplace</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-black text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-light mb-6">General Settings</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Name
                      </label>
                      <input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site URL
                      </label>
                      <input
                        type="url"
                        value={settings.siteUrl}
                        onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Support Email
                      </label>
                      <input
                        type="email"
                        value={settings.supportEmail}
                        onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                      >
                        <option value="America/New_York">EST (UTC-5)</option>
                        <option value="America/Chicago">CST (UTC-6)</option>
                        <option value="America/Denver">MST (UTC-7)</option>
                        <option value="America/Los_Angeles">PST (UTC-8)</option>
                        <option value="Asia/Ho_Chi_Minh">GMT+7</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Enable Reviews</span>
                      <input
                        type="checkbox"
                        checked={settings.enableReviews}
                        onChange={(e) => setSettings({ ...settings, enableReviews: e.target.checked })}
                        className="toggle"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Enable Wishlist</span>
                      <input
                        type="checkbox"
                        checked={settings.enableWishlist}
                        onChange={(e) => setSettings({ ...settings, enableWishlist: e.target.checked })}
                        className="toggle"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Guest Checkout</span>
                      <input
                        type="checkbox"
                        checked={settings.enableGuestCheckout}
                        onChange={(e) => setSettings({ ...settings, enableGuestCheckout: e.target.checked })}
                        className="toggle"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Maintenance Mode</span>
                      <input
                        type="checkbox"
                        checked={settings.maintenanceMode}
                        onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                        className="toggle"
                      />
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'payment' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-light mb-6">Payment Settings</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select
                        value={settings.currency}
                        onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="VND">VND (₫)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax Rate (%)
                      </label>
                      <input
                        type="number"
                        value={settings.taxRate}
                        onChange={(e) => setSettings({ ...settings, taxRate: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Commission Rate (%)
                      </label>
                      <input
                        type="number"
                        value={settings.commissionRate}
                        onChange={(e) => setSettings({ ...settings, commissionRate: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Min Order Amount
                      </label>
                      <input
                        type="number"
                        value={settings.minOrderAmount}
                        onChange={(e) => setSettings({ ...settings, minOrderAmount: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Order Amount
                      </label>
                      <input
                        type="number"
                        value={settings.maxOrderAmount}
                        onChange={(e) => setSettings({ ...settings, maxOrderAmount: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-light mb-6">Shipping Settings</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Shipping Fee
                      </label>
                      <input
                        type="number"
                        value={settings.shippingFee}
                        onChange={(e) => setSettings({ ...settings, shippingFee: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-6 pt-6 border-t border-gray-100">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
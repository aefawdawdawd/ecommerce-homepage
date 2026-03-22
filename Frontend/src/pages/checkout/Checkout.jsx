import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CreditCard, Truck, MapPin, ChevronRight,
  AlertCircle, CheckCircle, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cartService } from '../../services/cartService';
import { orderService } from '../../services/orderService';
import { addressService } from '../../services/addressService';

const Checkout = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [note, setNote] = useState('');
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadData();
  }, [isAuthenticated, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cartData, addressData] = await Promise.all([
        cartService.getCart(),
        addressService.getAddresses()
      ]);
      
      setCart(cartData);
      setAddresses(addressData);
      
      // Chọn địa chỉ mặc định
      const defaultAddr = addressData.find(addr => addr.is_default);
      setSelectedAddress(defaultAddr || addressData[0]);
      
    } catch (error) {
      console.error('Error loading checkout data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setNotification({
        show: true,
        type: 'error',
        message: 'Please select a shipping address'
      });
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        shippingAddress: `${selectedAddress.address_line1}, ${selectedAddress.city}, ${selectedAddress.state} ${selectedAddress.postal_code}`,
        paymentMethod,
        note
      };

      const result = await orderService.createOrder(orderData);
      
      if (result.success) {
        navigate(`/checkout/success?orderId=${result.orderId}`);
      }
    } catch (error) {
      setNotification({
        show: true,
        type: 'error',
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && cart.items?.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-3xl font-light text-gray-900">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                s <= step ? 'bg-black text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`w-16 h-1 ${
                  s < step ? 'bg-black' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Shipping Address */}
            <motion.div
              initial={false}
              animate={{ height: step === 1 ? 'auto' : 60 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div
                onClick={() => setStep(1)}
                className="p-4 cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                    step === 1 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
                  }`}>1</div>
                  <span className="font-medium">Shipping Address</span>
                </div>
                {step > 1 && selectedAddress && (
                  <span className="text-sm text-gray-500">
                    {selectedAddress.address_line1}
                  </span>
                )}
              </div>

              {step === 1 && (
                <div className="p-4 pt-0 space-y-4">
                  {addresses.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-gray-500 mb-4">No addresses saved</p>
                      <button
                        onClick={() => navigate('/addresses')}
                        className="px-4 py-2 bg-black text-white rounded-lg text-sm"
                      >
                        Add New Address
                      </button>
                    </div>
                  ) : (
                    <>
                      {addresses.map((addr) => (
                        <label
                          key={addr.id}
                          className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedAddress?.id === addr.id
                              ? 'border-black bg-gray-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="address"
                              checked={selectedAddress?.id === addr.id}
                              onChange={() => setSelectedAddress(addr)}
                              className="mt-1 text-black"
                            />
                            <div>
                              <p className="font-medium">{addr.recipient_name}</p>
                              <p className="text-sm text-gray-600">{addr.phone}</p>
                              <p className="text-sm text-gray-600 mt-1">
                                {addr.address_line1}
                                {addr.address_line2 && `, ${addr.address_line2}`}
                                <br />
                                {addr.city}, {addr.state} {addr.postal_code}
                                <br />
                                {addr.country}
                              </p>
                              {addr.is_default && (
                                <span className="inline-block mt-2 text-xs bg-gray-200 px-2 py-1 rounded">
                                  Default
                                </span>
                              )}
                            </div>
                          </div>
                        </label>
                      ))}

                      <button
                        onClick={() => navigate('/addresses')}
                        className="text-sm text-black hover:underline flex items-center gap-1"
                      >
                        <MapPin className="h-4 w-4" />
                        Add New Address
                      </button>

                      <div className="flex justify-end">
                        <button
                          onClick={() => setStep(2)}
                          disabled={!selectedAddress}
                          className="px-6 py-2 bg-black text-white rounded-lg text-sm disabled:bg-gray-300"
                        >
                          Continue
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </motion.div>

            {/* Step 2: Payment Method */}
            <motion.div
              initial={false}
              animate={{ height: step === 2 ? 'auto' : 60 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div
                onClick={() => step > 1 && setStep(2)}
                className="p-4 cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                    step === 2 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
                  }`}>2</div>
                  <span className="font-medium">Payment Method</span>
                </div>
                {step > 2 && (
                  <span className="text-sm text-gray-500 capitalize">{paymentMethod}</span>
                )}
              </div>

              {step === 2 && (
                <div className="p-4 pt-0 space-y-4">
                  <label className={`block p-4 border rounded-lg cursor-pointer ${
                    paymentMethod === 'card' ? 'border-black bg-gray-50' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-black"
                      />
                      <CreditCard className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium">Credit / Debit Card</p>
                        <p className="text-sm text-gray-500">Pay with Visa, Mastercard, or American Express</p>
                      </div>
                    </div>
                  </label>

                  <label className={`block p-4 border rounded-lg cursor-pointer ${
                    paymentMethod === 'paypal' ? 'border-black bg-gray-50' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-black"
                      />
                      <span className="text-lg font-medium text-blue-600">PayPal</span>
                      <div>
                        <p className="text-sm text-gray-500">Fast and secure payment with PayPal</p>
                      </div>
                    </div>
                  </label>

                  <label className={`block p-4 border rounded-lg cursor-pointer ${
                    paymentMethod === 'bank' ? 'border-black bg-gray-50' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="bank"
                        checked={paymentMethod === 'bank'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-black"
                      />
                      <span className="text-lg font-medium">Bank Transfer</span>
                      <div>
                        <p className="text-sm text-gray-500">Direct bank transfer</p>
                      </div>
                    </div>
                  </label>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setStep(1)}
                      className="px-6 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="px-6 py-2 bg-black text-white rounded-lg"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Step 3: Review & Place Order */}
            <motion.div
              initial={false}
              animate={{ height: step === 3 ? 'auto' : 60 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                    step === 3 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
                  }`}>3</div>
                  <span className="font-medium">Review & Place Order</span>
                </div>
              </div>

              {step === 3 && (
                <div className="p-4 pt-0 space-y-6">
                  {/* Order Items */}
                  <div>
                    <h3 className="font-medium mb-3">Order Items</h3>
                    <div className="space-y-2">
                      {cart.items?.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 text-sm">
                          <span className="text-gray-500">{item.quantity}x</span>
                          <span className="flex-1">{item.name}</span>
                          <span>${item.total?.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div>
                    <h3 className="font-medium mb-3">Shipping To</h3>
                    <p className="text-sm text-gray-600">
                      {selectedAddress?.recipient_name}<br />
                      {selectedAddress?.address_line1}<br />
                      {selectedAddress?.city}, {selectedAddress?.state} {selectedAddress?.postal_code}<br />
                      {selectedAddress?.country}
                    </p>
                  </div>

                  {/* Payment Info */}
                  <div>
                    <h3 className="font-medium mb-3">Payment Method</h3>
                    <p className="text-sm text-gray-600 capitalize">{paymentMethod}</p>
                  </div>

                  {/* Order Note */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Order Note (Optional)
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                      placeholder="Any special instructions for the seller?"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="px-8 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-300 flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <span>Place Order</span>
                          <ChevronRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-medium mb-4">Order Summary</h2>
              
              <div className="space-y-3 text-sm">
                {cart.items?.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-gray-600">
                      {item.name} x {item.quantity}
                    </span>
                    <span>${item.total?.toFixed(2)}</span>
                  </div>
                ))}
                
                <div className="border-t border-gray-100 pt-3 mt-3">
                  <div className="flex justify-between font-medium">
                    <span>Subtotal</span>
                    <span>${cart.total?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg mt-3">
                    <span>Total</span>
                    <span>${cart.total?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
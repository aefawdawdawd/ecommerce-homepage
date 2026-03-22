import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Gửi form liên hệ (sẽ kết nối với backend sau)
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-light text-gray-900 mb-4">Liên hệ với chúng tôi</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy gửi cho chúng tôi thông tin của bạn.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-light mb-6">Thông tin liên hệ</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Điện thoại</p>
                    <p className="text-gray-600">1900 1234</p>
                    <p className="text-sm text-gray-500">Thứ 2 - Thứ 6, 8:00 - 17:30</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-gray-600">support@g2tech.com</p>
                    <p className="text-sm text-gray-500">Chúng tôi sẽ phản hồi trong 24h</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Địa chỉ</p>
                    <p className="text-gray-600">123 Nguyễn Huệ, Quận 1</p>
                    <p className="text-gray-600">Thành phố Hồ Chí Minh</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">Giờ làm việc</p>
                    <p className="text-gray-600">Thứ 2 - Thứ 6: 8:00 - 17:30</p>
                    <p className="text-gray-600">Thứ 7: 8:00 - 12:00</p>
                    <p className="text-gray-500 text-sm">Chủ nhật: Nghỉ</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-light mb-4">Kết nối với chúng tôi</h2>
              <div className="flex gap-3">
                {['Facebook', 'Twitter', 'Instagram', 'Youtube'].map((social) => (
                  <button
                    key={social}
                    className="w-10 h-10 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                  >
                    <span className="text-sm font-medium">{social[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-2xl font-light mb-6">Gửi tin nhắn cho chúng tôi</h2>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
                >
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <p className="text-green-700">Tin nhắn của bạn đã được gửi thành công!</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                      placeholder="Nguyễn Văn A"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                      placeholder="nguyenvana@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                    placeholder="Vấn đề bạn cần hỗ trợ"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows="6"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                    placeholder="Nhập nội dung tin nhắn của bạn..."
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Gửi tin nhắn
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
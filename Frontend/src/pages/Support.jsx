import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HelpCircle, Phone, Mail, MessageCircle, 
  BookOpen, Truck, CreditCard, Shield,
  ChevronRight, HeadphonesIcon
} from 'lucide-react';

const Support = () => {
  const supportCategories = [
    {
      icon: BookOpen,
      title: 'Hướng dẫn mua hàng',
      description: 'Cách đặt hàng, thanh toán và theo dõi đơn hàng',
      link: '/faq#ordering'
    },
    {
      icon: Truck,
      title: 'Vận chuyển & giao nhận',
      description: 'Thông tin về phí ship, thời gian giao hàng',
      link: '/faq#shipping'
    },
    {
      icon: CreditCard,
      title: 'Thanh toán',
      description: 'Các phương thức thanh toán và hóa đơn',
      link: '/faq#payment'
    },
    {
      icon: Shield,
      title: 'Bảo hành & đổi trả',
      description: 'Chính sách bảo hành và đổi trả sản phẩm',
      link: '/faq#warranty'
    }
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: 'Hotline',
      value: '1900 1234',
      description: 'Thứ 2 - Thứ 6, 8:00 - 17:30'
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'support@g2tech.com',
      description: 'Phản hồi trong 24h'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      value: 'Chat trực tuyến',
      description: 'Thứ 2 - Thứ 6, 8:00 - 17:30'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center">
              <HeadphonesIcon className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Trung tâm trợ giúp
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Tìm câu trả lời nhanh chóng hoặc liên hệ với chúng tôi.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <Link to="/faq">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm câu hỏi..."
                className="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-gray-400 shadow-sm"
                readOnly
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800">
                Tìm kiếm
              </button>
            </div>
          </Link>
        </motion.div>

        {/* Support Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {supportCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Link to={category.link}>
                  <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all h-full">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-gray-700" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">{category.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{category.description}</p>
                    <div className="flex items-center text-sm text-black font-medium">
                      <span>Xem chi tiết</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Contact Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-8"
        >
          <h2 className="text-2xl font-light text-center mb-8">
            Liên hệ với chúng tôi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div key={index} className="text-center p-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Icon className="h-6 w-6 text-gray-700" />
                  </div>
                  <p className="font-medium text-gray-900">{method.title}</p>
                  <p className="text-lg text-black mt-1">{method.value}</p>
                  <p className="text-sm text-gray-500 mt-2">{method.description}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* FAQ CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-black"
          >
            <HelpCircle className="h-5 w-5" />
            <span>Xem tất cả câu hỏi thường gặp</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Support;
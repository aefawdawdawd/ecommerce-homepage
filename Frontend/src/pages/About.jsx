import React from 'react';
import { motion } from 'framer-motion';
import { Award, Users, Truck, Shield, Star, Heart } from 'lucide-react';

const About = () => {
  const stats = [
    { value: '50K+', label: 'Khách hàng', icon: Users },
    { value: '10K+', label: 'Sản phẩm', icon: Star },
    { value: '100+', label: 'Đối tác', icon: Award },
    { value: '24/7', label: 'Hỗ trợ', icon: Heart }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Uy tín hàng đầu',
      description: 'Cam kết mang đến sản phẩm chính hãng, chất lượng cao'
    },
    {
      icon: Truck,
      title: 'Giao hàng nhanh',
      description: 'Miễn phí vận chuyển toàn quốc cho đơn hàng từ 500K'
    },
    {
      icon: Users,
      title: 'Khách hàng là trung tâm',
      description: 'Đặt trải nghiệm khách hàng lên hàng đầu'
    },
    {
      icon: Award,
      title: 'Bảo hành dài hạn',
      description: 'Bảo hành lên đến 24 tháng cho tất cả sản phẩm'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-linear-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-light mb-6"
          >
            Về <span className="font-medium">G2 Tech</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Chúng tôi mang đến những sản phẩm công nghệ chất lượng cao với dịch vụ tốt nhất
          </motion.p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
                <Icon className="h-8 w-8 mx-auto mb-3 text-black" />
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-light mb-6">Câu chuyện của chúng tôi</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                G2 Tech được thành lập vào năm 2024 với sứ mệnh mang đến những sản phẩm công nghệ 
                chất lượng cao đến tay người tiêu dùng Việt Nam với giá cả hợp lý nhất.
              </p>
              <p>
                Chúng tôi tự hào là đối tác chiến lược của nhiều thương hiệu công nghệ hàng đầu 
                thế giới như Apple, Samsung, Dell, HP, Lenovo và nhiều thương hiệu khác.
              </p>
              <p>
                Với đội ngũ nhân viên giàu kinh nghiệm, nhiệt huyết, chúng tôi cam kết mang đến 
                cho khách hàng những trải nghiệm mua sắm tuyệt vời nhất.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="aspect-square bg-gray-200 rounded-xl overflow-hidden"
          >
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format" 
              alt="G2 Tech Team"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-light text-center mb-12">Giá trị cốt lõi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="p-6 text-center"
                >
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-500">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
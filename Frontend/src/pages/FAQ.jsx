import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState([]);

  const faqData = [
    {
      category: 'Đơn hàng',
      questions: [
        {
          q: 'Làm thế nào để theo dõi đơn hàng của tôi?',
          a: 'Bạn có thể theo dõi đơn hàng bằng cách đăng nhập vào tài khoản và vào mục "Đơn hàng của tôi". Tại đó bạn sẽ thấy trạng thái cập nhật mới nhất của đơn hàng.'
        },
        {
          q: 'Tôi có thể hủy đơn hàng không?',
          a: 'Có, bạn có thể hủy đơn hàng nếu đơn hàng chưa được xử lý. Vào mục "Đơn hàng của tôi" và chọn "Hủy đơn hàng" nếu trạng thái còn "Chờ xử lý".'
        },
        {
          q: 'Thời gian giao hàng mất bao lâu?',
          a: 'Thời gian giao hàng thông thường từ 2-5 ngày làm việc tùy khu vực. Thành phố lớn từ 1-2 ngày, các tỉnh thành khác từ 3-5 ngày.'
        }
      ]
    },
    {
      category: 'Thanh toán',
      questions: [
        {
          q: 'Có những phương thức thanh toán nào?',
          a: 'Chúng tôi chấp nhận thanh toán qua thẻ tín dụng (Visa, Mastercard), chuyển khoản ngân hàng, ví điện tử (Momo, ZaloPay) và thanh toán khi nhận hàng (COD).'
        },
        {
          q: 'Tôi có thể thanh toán bằng tiền mặt không?',
          a: 'Có, bạn có thể chọn phương thức thanh toán khi nhận hàng (COD) và thanh toán bằng tiền mặt cho nhân viên giao hàng.'
        }
      ]
    },
    {
      category: 'Sản phẩm',
      questions: [
        {
          q: 'Sản phẩm có được bảo hành không?',
          a: 'Tất cả sản phẩm đều được bảo hành chính hãng từ 12-24 tháng tùy sản phẩm. Thông tin bảo hành chi tiết được hiển thị trên trang sản phẩm.'
        },
        {
          q: 'Làm thế nào để đổi/trả sản phẩm?',
          a: 'Bạn có thể đổi/trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng nếu sản phẩm bị lỗi hoặc không đúng mô tả. Vui lòng liên hệ hỗ trợ để được hướng dẫn.'
        }
      ]
    },
    {
      category: 'Tài khoản',
      questions: [
        {
          q: 'Làm thế nào để đăng ký tài khoản?',
          a: 'Bạn có thể đăng ký tài khoản bằng cách click vào nút "Đăng ký" ở góc phải màn hình và điền thông tin theo hướng dẫn.'
        },
        {
          q: 'Quên mật khẩu thì làm sao?',
          a: 'Click vào "Quên mật khẩu" ở trang đăng nhập và làm theo hướng dẫn. Chúng tôi sẽ gửi link đặt lại mật khẩu qua email của bạn.'
        }
      ]
    }
  ];

  const toggleItem = (categoryIndex, questionIndex) => {
    const id = `${categoryIndex}-${questionIndex}`;
    setOpenItems(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const filteredFaq = faqData.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-light text-gray-900 mb-4">
            Câu hỏi thường gặp
          </h1>
          <p className="text-lg text-gray-600">
            Tìm câu trả lời cho các thắc mắc thường gặp
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm câu hỏi..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
            />
          </div>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="space-y-8">
          {filteredFaq.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + categoryIndex * 0.1 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-medium text-gray-900">
                  {category.category}
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {category.questions.map((item, questionIndex) => {
                  const isOpen = openItems.includes(`${categoryIndex}-${questionIndex}`);
                  return (
                    <div key={questionIndex} className="px-6">
                      <button
                        onClick={() => toggleItem(categoryIndex, questionIndex)}
                        className="w-full py-4 flex items-center justify-between text-left"
                      >
                        <span className="text-gray-900 font-medium pr-8">
                          {item.q}
                        </span>
                        <ChevronDown
                          className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <p className="pb-4 text-gray-600">
                              {item.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 mb-4">
            Không tìm thấy câu trả lời bạn cần?
          </p>
          <button
            onClick={() => window.location.href = '/contact'}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Liên hệ hỗ trợ
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
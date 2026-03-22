import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, ThumbsUp, ThumbsDown, MessageCircle,
  ChevronLeft, Search, Filter, Clock
} from 'lucide-react';

const Reviews = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const reviews = [
    {
      id: 1,
      product: 'Premium Wireless Headphones',
      customer: 'John D.',
      rating: 5,
      comment: 'Excellent sound quality and comfortable to wear for hours. Highly recommended!',
      date: '2024-03-15',
      helpful: 12,
      replied: true
    },
    {
      id: 2,
      product: 'Smart Watch Series 5',
      customer: 'Sarah M.',
      rating: 4,
      comment: 'Great features but battery life could be better. Otherwise satisfied.',
      date: '2024-03-14',
      helpful: 8,
      replied: false
    },
    {
      id: 3,
      product: 'Designer Backpack',
      customer: 'Mike R.',
      rating: 5,
      comment: 'Perfect for daily commute. Very durable and stylish.',
      date: '2024-03-12',
      helpful: 15,
      replied: true
    }
  ];

  const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  const ratingCounts = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/seller/dashboard')}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-light text-gray-900">Product Reviews</h1>
            <p className="text-gray-500 mt-1">Manage customer feedback</p>
          </div>
        </div>

        {/* Rating Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6 col-span-1"
          >
            <p className="text-sm text-gray-500 mb-2">Average Rating</p>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-light">{averageRating.toFixed(1)}</span>
              <span className="text-gray-400">/5</span>
            </div>
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">Based on {reviews.length} reviews</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 col-span-2"
          >
            <h3 className="font-medium mb-4">Rating Breakdown</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm w-8">{rating} star</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black rounded-full"
                      style={{ width: `${(ratingCounts[rating] / reviews.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-12">{ratingCounts[rating]}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reviews..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-black"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'all' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('positive')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'positive' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Positive
              </button>
              <button
                onClick={() => setFilter('negative')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === 'negative' ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Critical
              </button>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{review.product}</h3>
                    <span className="text-xs text-gray-400">by {review.customer}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {new Date(review.date).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-3">"{review.comment}"</p>

                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-black">
                      <ThumbsUp className="h-4 w-4" />
                      Helpful ({review.helpful})
                    </button>
                    {review.replied ? (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        Replied
                      </span>
                    ) : (
                      <button className="text-xs text-gray-500 hover:text-black flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        Reply
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
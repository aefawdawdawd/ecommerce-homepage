import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import ProductGrid from '../components/ProductGrid';
import Newsletter from '../components/Newsletter';
import Editorial from '../components/Editorial'; // Import component mới
import Footer from '../components/Footer';

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white"
    >
      <Navbar />
      <Hero />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="border-t border-black/5"></div>
      </div>
      
      <Categories />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="border-t border-black/5"></div>
      </div>
      
      <ProductGrid />
      
      <Newsletter />
      
      {/* Editorial Section - Đã tách thành component riêng */}
      <Editorial />
      
      <Footer />
    </motion.div>
  );
};

export default Home;
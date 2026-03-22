import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

// Re-export ProductGrid với layout mặc định là 'list'
const ProductList = ({ products }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-6"
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          layout="list"
        />
      ))}
    </motion.div>
  );
};

export default ProductList;
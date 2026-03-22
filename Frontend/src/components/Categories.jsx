import React, { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { 
  Laptop, 
  BookOpen, 
  Headphones, 
  Watch, 
  Camera, 
  Smartphone,
  Tablet,
  Speaker,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

const Categories = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

// Danh mục sản phẩm (tiếng Việt)
const categories = [
  { id: 'electronics', name: 'Điện tử', icon: '💻', count: 245 },
  { id: 'laptops', name: 'Laptop', icon: '🖥️', count: 89 },
  { id: 'phones', name: 'Điện thoại', icon: '📱', count: 156 },
  { id: 'audio', name: 'Âm thanh', icon: '🎧', count: 78 },
  { id: 'wearables', name: 'Đồng hồ', icon: '⌚', count: 45 },
  { id: 'accessories', name: 'Phụ kiện', icon: '🎮', count: 234 },
  { id: 'cameras', name: 'Máy ảnh', icon: '📷', count: 67 },
  { id: 'gaming', name: 'Chơi game', icon: '🎮', count: 92 },
  { id: 'smart-home', name: 'Nhà thông minh', icon: '🏠', count: 34 },
  { id: 'fitness', name: 'Sức khỏe', icon: '💪', count: 56 },
];

  // Kiểm tra scroll position
  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + 
        (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const categoryVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }
    }),
    hover: {
      y: -4,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    },
    tap: {
      scale: 0.98,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    }
  };

  const iconVariants = {
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const countVariants = {
    hover: {
      scale: 1.1,
      backgroundColor: "rgba(0,0,0,0.05)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const underlineVariants = {
    hidden: { width: 0 },
    visible: {
      width: "100%",
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const scrollButtonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    },
    hover: {
      scale: 1.1,
      backgroundColor: "rgba(0,0,0,0.03)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.9
    }
  };

  return (
    <motion.section
      ref={sectionRef}
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="py-20 bg-white relative overflow-hidden"
    >
      {/* Subtle geometric pattern background */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} 
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-12 border-b border-black/5 pb-6">
          <motion.div variants={titleVariants}>
            <motion.span 
              className="text-xs text-black/40 tracking-[0.3em] uppercase block mb-3"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              Curated Selection
            </motion.span>
            <motion.h2 
              className="text-3xl font-light text-black tracking-[-0.02em]"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15, duration: 0.6 }}
            >
              Explore Categories
            </motion.h2>
            <motion.p 
              className="text-sm text-black/40 mt-2 tracking-wide font-light"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Discover technology by your interest
            </motion.p>
          </motion.div>

          {/* Scroll Controls - Desktop only */}
          <motion.div 
            className="hidden md:flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <AnimatePresence mode="wait">
              {canScrollLeft && (
                <motion.button
                  key="scroll-left"
                  variants={scrollButtonVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => scroll('left')}
                  className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-black/40 hover:text-black transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </motion.button>
              )}
            </AnimatePresence>
            
            <AnimatePresence mode="wait">
              {canScrollRight && (
                <motion.button
                  key="scroll-right"
                  variants={scrollButtonVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={() => scroll('right')}
                  className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-black/40 hover:text-black transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Desktop Grid - 4 columns */}
        <div className="hidden md:grid grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              custom={index}
              variants={categoryVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              onClick={() => setSelectedCategory(selectedCategory === index ? null : index)}
              className="group cursor-pointer relative"
            >
              <div className={`relative p-6 bg-white border ${selectedCategory === index ? 'border-black' : 'border-black/5'} rounded-sm transition-all duration-300 hover:border-black/30 hover:shadow-lg`}>
                {/* Icon với animation */}
                <motion.div 
                  variants={iconVariants}
                  className="mb-4 text-black/60 group-hover:text-black transition-colors duration-300"
                >
                  <category.icon className="h-8 w-8" />
                </motion.div>

                {/* Category Info */}
                <h3 className="font-light text-lg text-black mb-1">{category.name}</h3>
                
                {/* Count với animation */}
                <motion.div 
                  variants={countVariants}
                  className="inline-block px-2 py-0.5 bg-black/5 text-black/60 text-xs rounded-sm"
                >
                  {category.count} items
                </motion.div>

                {/* Underline animation khi hover */}
                <motion.div 
                  className="absolute bottom-0 left-0 h-px bg-black"
                  initial={{ width: 0 }}
                  animate={{ width: hoveredIndex === index ? '100%' : 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* Selected indicator */}
                <AnimatePresence>
                  {selectedCategory === index && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-3 right-3 w-2 h-2 bg-black rounded-full"
                    />
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Horizontal Scroll với glassmorphism */}
        <div className="md:hidden relative">
          <motion.div
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide pb-6 -mx-6 px-6"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <div className="flex space-x-4 min-w-max">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  variants={categoryVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  whileHover="hover"
                  whileTap="tap"
                  className="shrink-0 w-36"
                >
                  <div className="bg-white/80 backdrop-blur-sm border border-black/5 rounded-sm p-4 hover:border-black/30 transition-all duration-300">
                    <div className="mb-3 text-black/60">
                      <category.icon className="h-6 w-6 mx-auto" />
                    </div>
                    <h3 className="text-sm font-light text-black text-center mb-1">
                      {category.name}
                    </h3>
                    <p className="text-[10px] text-black/40 text-center">
                      {category.count} items
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Gradient indicators for scroll */}
          <div className="absolute left-0 top-0 bottom-6 w-8 bg-linear-to-r from-white to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-6 w-8 bg-linear-to-l from-white to-transparent pointer-events-none" />
        </div>

        {/* View All Link */}
        <motion.div 
          className="flex justify-center mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.button
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
            className="group flex items-center gap-2 text-sm text-black/60 hover:text-black transition-colors"
          >
            <span className="border-b border-black/20 group-hover:border-black pb-0.5">
              View All Categories
            </span>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Categories;
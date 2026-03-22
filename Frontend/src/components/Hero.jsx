import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  
  // Parallax effects based on scroll
  const imageY = useTransform(scrollY, [0, 500], [0, 100]);
  const textY = useTransform(scrollY, [0, 500], [0, 50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  // Mouse move effect for subtle parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const floatingCardVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 1,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    hover: {
      y: -5,
      boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.02,
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

  const arrowVariants = {
    hover: {
      x: 5,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    }
  };

  const statVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 1.2 + i * 0.1,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative bg-white overflow-hidden min-h-screen flex items-center"
      style={{ opacity }}
    >
      {/* Subtle geometric pattern background */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} 
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-white via-white to-black/5 pointer-events-none" />

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left content */}
          <motion.div
            variants={itemVariants}
            style={{ y: textY }}
            className="text-center lg:text-left"
          >
            {/* Pre-heading */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex items-center justify-center lg:justify-start gap-3 mb-6"
            >
              <span className="w-10 h-px bg-black/20" />
              <span className="text-xs text-black/40 tracking-[0.3em] uppercase">
                Since 2024
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1 
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-[-0.03em] text-black leading-[1.1] mb-6"
            >
              Where 
              <motion.span 
                className="block font-medium mt-2 relative"
                animate={{
                  textShadow: mousePosition.x ? `2px 2px 20px rgba(0,0,0,0.1)` : 'none'
                }}
                transition={{ duration: 0.1 }}
              >
                Innovation
                <motion.span 
                  className="absolute -bottom-2 left-0 w-full h-px bg-black/20"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                />
              </motion.span>
              <span className="block font-light">Meets Elegance</span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              variants={itemVariants}
              className="text-lg text-black/60 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light"
            >
              Curated technology for the discerning. Timeless design, uncompromising quality, 
              and precision engineering for the modern connoisseur.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="group relative px-10 py-4 bg-black text-white text-sm font-light tracking-wide overflow-hidden"
              >
                <motion.span 
                  className="absolute inset-0 bg-white"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{ mixBlendMode: 'difference' }}
                />
                <span className="relative z-10 flex items-center justify-center gap-3">
                  Explore Collection
                  <motion.div variants={arrowVariants} className="inline-block">
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </span>
              </motion.button>

              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                className="group px-10 py-4 border border-black/10 text-black text-sm font-light tracking-wide hover:border-black/30 transition-colors flex items-center justify-center gap-3"
              >
                <span>Watch Film</span>
                <motion.span 
                  className="w-5 h-px bg-black/40 group-hover:w-8 transition-all duration-300"
                />
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              className="flex items-center justify-center lg:justify-start gap-8 mt-12"
              variants={itemVariants}
            >
              {[
                { value: '50+', label: 'Products' },
                { value: '10k', label: 'Customers' },
                { value: '24/7', label: 'Support' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  custom={i}
                  variants={statVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-center"
                >
                  <div className="text-xl font-light text-black">{stat.value}</div>
                  <div className="text-xs text-black/40 tracking-wider mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Image - với hiệu ứng parallax */}
          <motion.div
            variants={imageVariants}
            style={{ 
              y: imageY,
              x: mousePosition.x,
              rotate: mousePosition.x * 0.02
            }}
            className="relative"
          >
            <div className="aspect-4/5 bg-black/5 overflow-hidden rounded-sm relative group">
              {/* Main image */}
              <motion.img 
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format" 
                alt="MacBook Pro"
                className="w-full h-full object-cover grayscale group-hover:scale-105 transition-transform duration-700"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.7 }}
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Decorative elements */}
              <motion.div 
                className="absolute top-6 right-6 w-16 h-16 border border-white/30"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 90, 0],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <motion.div 
                className="absolute bottom-6 left-6 w-24 h-24 border border-white/20"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, -45, 0],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </div>

            {/* Floating card - New arrival */}
            <motion.div
              variants={floatingCardVariants}
              whileHover="hover"
              className="absolute -bottom-6 -left-6 bg-white p-5 shadow-lg border border-black/5 max-w-50"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-black/5 shrink-0" />
                <div>
                  <p className="text-[10px] text-black/40 tracking-wider mb-1">NEW ARRIVAL</p>
                  <p className="font-medium text-black text-sm">MacBook Pro 16"</p>
                  <p className="text-xs text-black/60 mt-1">M3 Max · 2024</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-light text-black">$2,499</span>
                    <span className="text-[10px] text-black/40 line-through">$2,999</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating card - Best seller */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.6 }}
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              className="absolute -top-6 -right-6 bg-white p-4 shadow-lg border border-black/5"
            >
              <div className="text-center">
                <p className="text-[10px] text-black/40 tracking-wider mb-1">BEST SELLER</p>
                <p className="text-sm font-light text-black">AirPods Max</p>
                <p className="text-xs text-black/60 mt-1">549 reviews</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-black/30 text-xs">★</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block"
      >
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-black/30 tracking-[0.3em]">SCROLL</span>
          <div className="w-px h-12 bg-black/10" />
        </motion.div>
      </motion.div>

      {/* Corner decorations - tân cổ điển */}
      <div className="absolute top-12 left-12 w-20 h-20 border-l border-t border-black/5 pointer-events-none" />
      <div className="absolute top-12 right-12 w-20 h-20 border-r border-t border-black/5 pointer-events-none" />
      <div className="absolute bottom-12 left-12 w-20 h-20 border-l border-b border-black/5 pointer-events-none" />
      <div className="absolute bottom-12 right-12 w-20 h-20 border-r border-b border-black/5 pointer-events-none" />
    </motion.section>
  );
};

export default Hero;
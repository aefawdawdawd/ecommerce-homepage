import React from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, BookOpen, Award, Heart, Zap } from 'lucide-react';

const Editorial = () => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const textVariants = {
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

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95, x: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const statVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.8 + i * 0.1,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };

  const stats = [
    { icon: Award, value: '50+', label: 'Design Awards' },
    { icon: Heart, value: '10k', label: 'Happy Customers' },
    { icon: Zap, value: '5yr', label: 'Warranty' }
  ];

  return (
    <motion.section
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="relative py-24 bg-white overflow-hidden"
    >
      {/* Subtle background pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} 
      />

      {/* Decorative lines */}
      <div className="absolute top-0 left-0 w-32 h-px bg-black/5" />
      <div className="absolute top-0 right-0 w-32 h-px bg-black/5" />
      <div className="absolute bottom-0 left-0 w-32 h-px bg-black/5" />
      <div className="absolute bottom-0 right-0 w-32 h-px bg-black/5" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left side - Text content */}
          <motion.div variants={textVariants} className="space-y-6">
            {/* Section label */}
            <div className="flex items-center gap-3">
              <span className="w-12 h-px bg-black/20" />
              <span className="text-xs text-black/40 tracking-[0.3em] uppercase">
                EDITORIAL
              </span>
            </div>

            {/* Main heading */}
            <h2 className="text-4xl md:text-5xl font-light text-black leading-tight">
              The intersection of 
              <span className="block font-medium mt-2">technology and craft</span>
            </h2>

            {/* Description */}
            <p className="text-lg text-black/60 leading-relaxed font-light max-w-lg">
              Each product is conceived with a singular vision: to create tools 
              that are as beautiful as they are functional. From the precision of 
              our engineering to the purity of our design, every detail matters.
            </p>

            {/* Stats */}
            <div className="flex items-center gap-8 pt-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  custom={index}
                  variants={statVariants}
                  className="text-center"
                >
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className="h-5 w-5 text-black/40" />
                  </div>
                  <div className="text-xl font-light text-black">{stat.value}</div>
                  <div className="text-xs text-black/40 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.button
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              className="group mt-8 inline-flex items-center gap-3 text-sm text-black border-b border-black/20 hover:border-black pb-1 transition-all"
            >
              <BookOpen className="h-4 w-4 text-black/40 group-hover:text-black transition-colors" />
              <span>Read the Journal</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          {/* Right side - Image with overlay */}
          <motion.div variants={imageVariants} className="relative">
            <div className="aspect-square bg-black/5 overflow-hidden rounded-sm relative group">
              {/* Main image */}
              <img
                src="https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=800&auto=format"
                alt="Craftsmanship"
                className="w-full h-full object-cover grayscale group-hover:scale-105 transition-transform duration-700"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Decorative frame */}
              <div className="absolute -top-4 -right-4 w-24 h-24 border border-black/10" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 border border-black/10" />
            </div>

            {/* Floating quote card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="absolute -bottom-6 -left-6 bg-white p-4 shadow-lg border border-black/5 max-w-50"
            >
              <p className="text-xs text-black/40 italic">
                "Every detail tells a story of precision and passion"
              </p>
              <p className="text-xs text-black/60 mt-2">— G2 Design Team</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom decorative element */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
          className="w-32 h-px bg-black/10 mx-auto mt-16"
        />
      </div>
    </motion.section>
  );
};

export default Editorial;
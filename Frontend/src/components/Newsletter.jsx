import React, { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const sectionRef = React.useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setIsError(true);
      setTimeout(() => setIsError(false), 3000);
      return;
    }

    // Simulate API call
    setIsSubmitted(true);
    setEmail('');
    
    // Reset success message after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  // Animation variants
  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
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

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.3,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    focus: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.4,
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    hover: {
      scale: 1.02,
      backgroundColor: "#1a1a1a",
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

  const underlineVariants = {
    hidden: { width: 0 },
    visible: {
      width: "100%",
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.5
      }
    }
  };

  const decorationVariants = {
    hidden: { scale: 0, rotate: -45 },
    visible: (i) => ({
      scale: 1,
      rotate: 0,
      transition: {
        delay: 0.6 + i * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    })
  };

  const messageVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 30
      }
    },
    exit: {
      opacity: 0,
      y: 10,
      scale: 0.95,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.section
      ref={sectionRef}
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="relative py-24 bg-white overflow-hidden border-t border-black/5"
    >
      {/* Subtle geometric pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} 
      />

      {/* Decorative lines - tân cổ điển */}
      <motion.div 
        custom={0}
        variants={decorationVariants}
        className="absolute top-0 left-0 w-32 h-px bg-black/5"
      />
      <motion.div 
        custom={1}
        variants={decorationVariants}
        className="absolute top-0 right-0 w-32 h-px bg-black/5"
      />
      <motion.div 
        custom={2}
        variants={decorationVariants}
        className="absolute bottom-0 left-0 w-32 h-px bg-black/5"
      />
      <motion.div 
        custom={3}
        variants={decorationVariants}
        className="absolute bottom-0 right-0 w-32 h-px bg-black/5"
      />

      <div className="relative max-w-3xl mx-auto px-6 lg:px-8 text-center">
        {/* Section header */}
        <motion.div variants={itemVariants}>
          <motion.span 
            className="text-xs text-black/40 tracking-[0.3em] uppercase block mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            Stay Connected
          </motion.span>
          
          <motion.h2 
            className="text-4xl md:text-5xl font-light text-black tracking-[-0.02em] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.6 }}
          >
            Subscribe to our
            <span className="block font-medium mt-2">Newsletter</span>
          </motion.h2>

          <motion.div 
            className="w-16 h-px bg-black/20 mx-auto my-6"
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          />

          <motion.p 
            className="text-black/60 leading-relaxed font-light max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Receive curated updates on new collections, exclusive offers, 
            and behind-the-scenes stories.
          </motion.p>
        </motion.div>

        {/* Form */}
        <motion.form 
          onSubmit={handleSubmit}
          className="mt-12 max-w-md mx-auto relative"
          variants={itemVariants}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Input container */}
            <motion.div 
              className="flex-1 relative"
              variants={inputVariants}
              whileHover="focus"
              animate={isFocused ? "focus" : "visible"}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Enter your email"
                className={`w-full px-0 py-3 bg-transparent border-0 border-b text-black placeholder-black/30 text-sm font-light transition-colors focus:outline-none ${
                  isError ? 'border-red-500/50' : 'border-black/10 focus:border-black'
                }`}
                disabled={isSubmitted}
              />
              
              {/* Animated underline */}
              <motion.div 
                className={`absolute bottom-0 left-0 h-px ${
                  isError ? 'bg-red-500' : 'bg-black'
                }`}
                variants={underlineVariants}
                initial="hidden"
                animate={isFocused || isError ? "visible" : "hidden"}
              />

              {/* Character count - minimalist */}
              <motion.div 
                className="absolute -bottom-5 right-0 text-[10px] text-black/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: email.length > 0 ? 1 : 0 }}
              >
                {email.length}/50
              </motion.div>
            </motion.div>

            {/* Submit button */}
            <motion.button
              type="submit"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              disabled={isSubmitted}
              className={`px-8 py-3 bg-black text-white text-sm font-light tracking-wide flex items-center justify-center gap-3 transition-colors ${
                isSubmitted ? 'bg-black/50 cursor-not-allowed' : ''
              }`}
            >
              <span>{isSubmitted ? 'Subscribed' : 'Subscribe'}</span>
              <motion.div
                animate={isSubmitted ? { rotate: 360 } : {}}
                transition={{ duration: 0.5 }}
              >
                {isSubmitted ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </motion.div>
            </motion.button>
          </div>

          {/* Privacy note */}
          <motion.p 
            className="text-[10px] text-black/30 mt-6 font-light"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            By subscribing, you agree to our{' '}
            <a href="/privacy" className="border-b border-black/20 hover:border-black transition-colors">
              Privacy Policy
            </a>
            {' '}and{' '}
            <a href="/terms" className="border-b border-black/20 hover:border-black transition-colors">
              Terms of Service
            </a>.
          </motion.p>
        </motion.form>

        {/* Success message */}
        <motion.div
          variants={messageVariants}
          initial="hidden"
          animate={isSubmitted ? "visible" : "hidden"}
          exit="exit"
          className="absolute left-1/2 -translate-x-1/2 -bottom-16 flex items-center gap-2 text-black/60 text-sm font-light"
        >
          <CheckCircle className="h-4 w-4 text-black" />
          <span>Thank you for subscribing!</span>
        </motion.div>

        {/* Error message */}
        <motion.div
          variants={messageVariants}
          initial="hidden"
          animate={isError ? "visible" : "hidden"}
          exit="exit"
          className="absolute left-1/2 -translate-x-1/2 -bottom-16 flex items-center gap-2 text-red-500/60 text-sm font-light"
        >
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span>Please enter a valid email address</span>
        </motion.div>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-12 left-12 w-16 h-16 border-l border-t border-black/5 pointer-events-none" />
      <div className="absolute top-12 right-12 w-16 h-16 border-r border-t border-black/5 pointer-events-none" />
      <div className="absolute bottom-12 left-12 w-16 h-16 border-l border-b border-black/5 pointer-events-none" />
      <div className="absolute bottom-12 right-12 w-16 h-16 border-r border-b border-black/5 pointer-events-none" />

      {/* Minimalist decorative dots */}
      <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-black/5 rounded-full" />
      <div className="absolute top-3/4 right-1/4 w-1.5 h-1.5 bg-black/5 rounded-full" />
      <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-black/5 rounded-full" />
      <div className="absolute top-2/3 left-1/3 w-2 h-2 bg-black/5 rounded-full" />
    </motion.section>
  );
};

export default Newsletter;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, Lock, ArrowRight, Eye, EyeOff,
  AlertCircle, CheckCircle, X, LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, loading: authLoading, error: authError, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTime, setLockTime] = useState(0);

  // Demo credentials
  const demoCredentials = {
    email: 'demo@g2tech.com',
    password: 'demo123'
  };

  // Redirect nếu đã đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Lock account after 5 failed attempts
  useEffect(() => {
    if (loginAttempts >= 5) {
      setIsLocked(true);
      setLockTime(60); // 60 seconds lock
      
      const timer = setInterval(() => {
        setLockTime((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsLocked(false);
            setLoginAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [loginAttempts]);

  // Validation functions
  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email address';
    if (email.length > 100) return 'Email must be less than 100 characters';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (password.length > 50) return 'Password must be less than 50 characters';
    return '';
  };

  const validateForm = () => {
    const newErrors = {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password)
    };

    // Remove empty errors
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    
    // Validate field on blur
    if (field === 'email') {
      setErrors({ ...errors, email: validateEmail(formData.email) });
    }
    if (field === 'password') {
      setErrors({ ...errors, password: validatePassword(formData.password) });
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLocked) {
      showToast(`Account locked. Please try again in ${lockTime} seconds`, 'error');
      return;
    }

    // Validate all fields
    if (!validateForm()) {
      // Mark all fields as touched to show errors
      setTouched({
        email: true,
        password: true
      });
      showToast('Please fix the errors before submitting', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        showToast('Login successful! Redirecting...', 'success');
        setLoginAttempts(0); // Reset failed attempts on success
        
        // Store remember me preference
        if (formData.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        
        // Redirect after delay
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        // Increment failed attempts
        setLoginAttempts(prev => prev + 1);
        
        // Show specific error message
        if (result.error?.toLowerCase().includes('password')) {
          setErrors({ ...errors, password: result.error });
        } else if (result.error?.toLowerCase().includes('email') || result.error?.toLowerCase().includes('user')) {
          setErrors({ ...errors, email: result.error });
        } else {
          showToast(result.error || 'Login failed', 'error');
        }
        
        setIsLoading(false);
      }
    } catch (error) {
      showToast('An unexpected error occurred', 'error');
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setFormData({
      ...formData,
      email: demoCredentials.email,
      password: demoCredentials.password
    });
    showToast('Demo credentials filled', 'info');
  };

  const clearForm = () => {
    setFormData({
      email: '',
      password: '',
      rememberMe: false
    });
    setErrors({});
    setTouched({});
  };

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.4
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen bg-white relative overflow-hidden"
    >
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} 
      />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-px bg-black/5" />
      <div className="absolute top-0 right-0 w-32 h-px bg-black/5" />
      <div className="absolute bottom-0 left-0 w-32 h-px bg-black/5" />
      <div className="absolute bottom-0 right-0 w-32 h-px bg-black/5" />

      <div className="absolute top-12 left-12 w-24 h-24 border-l border-t border-black/5" />
      <div className="absolute top-12 right-12 w-24 h-24 border-r border-t border-black/5" />
      <div className="absolute bottom-12 left-12 w-24 h-24 border-l border-b border-black/5" />
      <div className="absolute bottom-12 right-12 w-24 h-24 border-r border-b border-black/5" />

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 w-full">
          {/* Left side - Form */}
          <motion.div
            variants={itemVariants}
            className="max-w-md mx-auto lg:mx-0 w-full"
          >
            {/* Logo */}
            <motion.div variants={itemVariants} className="mb-12">
              <Link to="/" className="inline-block">
                <span className="text-2xl font-light tracking-[-0.02em] text-black">
                  G2<span className="text-black/60">Tech</span>
                </span>
              </Link>
            </motion.div>

            {/* Header with lock warning */}
            <motion.div variants={itemVariants} className="mb-8">
              <h1 className="text-4xl font-light text-black tracking-[-0.02em] mb-3">
                Welcome Back
              </h1>
              <p className="text-sm text-black/40 font-light">
                Please enter your credentials to access your account
              </p>
              
              {isLocked && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
                >
                  <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Account Temporarily Locked</p>
                    <p className="text-xs text-red-600">Too many failed attempts. Try again in {lockTime} seconds</p>
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Form */}
            <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-xs text-black/40 tracking-wider mb-2">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <Mail className="absolute left-0 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/20" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className={`w-full pl-6 pr-4 py-2 bg-transparent border-0 border-b text-black placeholder-black/20 text-sm font-light focus:outline-none transition-colors ${
                      touched.email && errors.email
                        ? 'border-red-500'
                        : formData.email && !errors.email
                        ? 'border-green-500'
                        : 'border-black/10 focus:border-black'
                    }`}
                    placeholder="your@email.com"
                    disabled={isLocked}
                  />
                  {formData.email && !errors.email && touched.email && (
                    <CheckCircle className="absolute right-0 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                  )}
                </div>
                {touched.email && errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1 flex items-center gap-1"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </motion.p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-xs text-black/40 tracking-wider mb-2">
                  PASSWORD
                </label>
                <div className="relative">
                  <Lock className="absolute left-0 top-1/2 transform -translate-y-1/2 h-4 w-4 text-black/20" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    className={`w-full pl-6 pr-10 py-2 bg-transparent border-0 border-b text-black placeholder-black/20 text-sm font-light focus:outline-none transition-colors ${
                      touched.password && errors.password
                        ? 'border-red-500'
                        : formData.password && !errors.password
                        ? 'border-green-500'
                        : 'border-black/10 focus:border-black'
                    }`}
                    placeholder="••••••••"
                    disabled={isLocked}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-black/20 hover:text-black transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  {formData.password && !errors.password && touched.password && (
                    <CheckCircle className="absolute right-6 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                  )}
                </div>
                {touched.password && errors.password && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-xs mt-1 flex items-center gap-1"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {errors.password}
                  </motion.p>
                )}
              </div>

              {/* Password strength indicator */}
              {formData.password && !errors.password && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2"
                >
                  <div className="flex items-center gap-2">
                    <div className={`h-1 w-1/4 rounded-full ${
                      formData.password.length >= 6 ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                    <div className={`h-1 w-1/4 rounded-full ${
                      /[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                    <div className={`h-1 w-1/4 rounded-full ${
                      /[0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                    <div className={`h-1 w-1/4 rounded-full ${
                      /[^A-Za-z0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  </div>
                  <p className="text-xs text-black/40 mt-1">
                    Password strength: {
                      [formData.password.length >= 6, /[A-Z]/.test(formData.password), /[0-9]/.test(formData.password), /[^A-Za-z0-9]/.test(formData.password)].filter(Boolean).length
                    }/4
                  </p>
                </motion.div>
              )}

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                    className="rounded-none border-black/20 text-black focus:ring-0"
                    disabled={isLocked}
                  />
                  <span className="text-xs text-black/40 font-light hover:text-black transition-colors">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-black/40 hover:text-black border-b border-black/20 hover:border-black pb-0.5 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login attempts warning */}
              {loginAttempts > 0 && loginAttempts < 5 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded-lg"
                >
                  ⚠️ {5 - loginAttempts} login attempts remaining before temporary lock
                </motion.p>
              )}

              {/* Submit button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading || isLocked}
                className="w-full bg-black text-white py-3 text-sm font-light tracking-wide flex items-center justify-center gap-3 disabled:bg-black/50 mt-8 relative overflow-hidden group"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : isLocked ? (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Locked ({lockTime}s)</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <LogIn className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </motion.form>

            {/* Quick actions */}
            <motion.div variants={itemVariants} className="mt-6 flex items-center justify-between">
              <button
                onClick={fillDemoCredentials}
                className="text-xs text-black/40 hover:text-black border-b border-black/20 hover:border-black pb-0.5 transition-colors"
              >
                Use demo credentials
              </button>
              <button
                onClick={clearForm}
                className="text-xs text-black/40 hover:text-black border-b border-black/20 hover:border-black pb-0.5 transition-colors"
              >
                Clear form
              </button>
            </motion.div>

            {/* Sign up link */}
            <motion.div variants={itemVariants} className="mt-8 pt-8 border-t border-black/5">
              <p className="text-sm text-black/40 font-light text-center">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-black border-b border-black/20 hover:border-black pb-0.5 transition-colors font-medium"
                >
                  Create account
                </Link>
              </p>
            </motion.div>

            {/* Demo credentials hint */}
            <motion.div variants={itemVariants} className="mt-4 text-center">
              <p className="text-[10px] text-black/20">
                Demo: demo@g2tech.com / demo123
              </p>
            </motion.div>
          </motion.div>

          {/* Right side - Image/Quote */}
          <motion.div
            variants={itemVariants}
            className="hidden lg:flex flex-col items-center justify-center"
          >
            <div className="relative">
              <div className="aspect-3/4 max-w-md bg-black/5 overflow-hidden rounded-lg">
                <img
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format"
                  alt="Workspace"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
              
              {/* Quote overlay */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-6 -left-6 bg-white p-6 shadow-lg max-w-xs"
              >
                <p className="text-sm text-black/60 font-light italic leading-relaxed">
                  "Technology is best when it brings people together. Welcome back to your workspace."
                </p>
                <p className="text-xs text-black/40 mt-3 tracking-wider">
                  — G2 TECH
                </p>
              </motion.div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 border border-black/5" />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-black/5" />
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
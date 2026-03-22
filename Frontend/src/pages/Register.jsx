import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Lock, Phone, ArrowRight, Eye, EyeOff,
  AlertCircle, CheckCircle, X, ChevronRight, Calendar,
  MapPin, Globe, Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const navigate = useNavigate();
  const { register, loading: authLoading, error: authError, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [receiveUpdates, setReceiveUpdates] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    gender: '',
    country: 'Vietnam'
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Redirect nếu đã đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Validation functions
  const validateFullName = (name) => {
    if (!name) return 'Full name is required';
    if (name.length < 2) return 'Name must be at least 2 characters';
    if (name.length > 50) return 'Name must be less than 50 characters';
    if (!/^[a-zA-Z\s]*$/.test(name)) return 'Name can only contain letters and spaces';
    return '';
  };

  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email address';
    if (email.length > 100) return 'Email must be less than 100 characters';
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone) return 'Phone number is required';
    if (!/^[0-9+\-\s()]{10,15}$/.test(phone)) return 'Please enter a valid phone number';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (password.length > 50) return 'Password must be less than 50 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
    if (!/[^A-Za-z0-9]/.test(password)) return 'Password must contain at least one special character';
    return '';
  };

  const validateConfirmPassword = (confirmPassword) => {
    if (!confirmPassword) return 'Please confirm your password';
    if (confirmPassword !== formData.password) return 'Passwords do not match';
    return '';
  };

  const validateBirthDate = (date) => {
    if (!date) return ''; // Optional
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 13) return 'You must be at least 13 years old';
    if (age > 120) return 'Please enter a valid birth date';
    return '';
  };

  // Password strength checker
  const getPasswordStrength = (password) => {
    let score = 0;
    if (!password) return { score: 0, text: 'Very Weak', color: 'bg-red-500' };
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    const strengthMap = {
      0: { text: 'Very Weak', color: 'bg-red-500' },
      1: { text: 'Weak', color: 'bg-orange-500' },
      2: { text: 'Fair', color: 'bg-yellow-500' },
      3: { text: 'Good', color: 'bg-blue-500' },
      4: { text: 'Strong', color: 'bg-green-500' },
      5: { text: 'Very Strong', color: 'bg-green-600' }
    };
    
    return {
      score: Math.min(score, 5),
      text: strengthMap[Math.min(score, 5)].text,
      color: strengthMap[Math.min(score, 5)].color
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const validateStep1 = () => {
    const newErrors = {
      fullName: validateFullName(formData.fullName),
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone)
    };

    // Remove empty errors
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword),
      birthDate: validateBirthDate(formData.birthDate)
    };

    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });

    if (!agreeTerms) {
      showToast('You must agree to the Terms of Service', 'error');
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    
    // Validate field on blur
    switch(field) {
      case 'fullName':
        setErrors({ ...errors, fullName: validateFullName(formData.fullName) });
        break;
      case 'email':
        setErrors({ ...errors, email: validateEmail(formData.email) });
        break;
      case 'phone':
        setErrors({ ...errors, phone: validatePhone(formData.phone) });
        break;
      case 'password':
        setErrors({ ...errors, password: validatePassword(formData.password) });
        break;
      case 'confirmPassword':
        setErrors({ ...errors, confirmPassword: validateConfirmPassword(formData.confirmPassword) });
        break;
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleNextStep = () => {
    // Mark all step1 fields as touched
    setTouched({
      ...touched,
      fullName: true,
      email: true,
      phone: true
    });

    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep2()) return;

    setIsLoading(true);

    try {
      const result = await register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        birthDate: formData.birthDate,
        gender: formData.gender,
        country: formData.country,
        receiveUpdates
      });
      
      if (result.success) {
        showToast('Account created successfully! Redirecting...', 'success');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        // Handle specific errors
        if (result.error?.toLowerCase().includes('email')) {
          setErrors({ ...errors, email: result.error });
          setCurrentStep(1);
        } else {
          showToast(result.error || 'Registration failed', 'error');
        }
        setIsLoading(false);
      }
    } catch (error) {
      showToast('An unexpected error occurred', 'error');
      setIsLoading(false);
    }
  };

  const countries = [
    'Vietnam', 'United States', 'United Kingdom', 'Japan', 
    'South Korea', 'Singapore', 'Thailand', 'Malaysia',
    'Indonesia', 'Philippines', 'Cambodia', 'Laos'
  ];

  // Animation variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-white py-12"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-4">
            <span className="text-2xl font-light tracking-[-0.02em] text-black">
              G2<span className="text-black/60">Tech</span>
            </span>
          </Link>
          <h1 className="text-3xl font-light text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-2">Join thousands of buyers and sellers</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            currentStep >= 1 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
          }`}>
            1
          </div>
          <div className={`w-20 h-1 mx-2 ${
            currentStep >= 2 ? 'bg-black' : 'bg-gray-200'
          }`} />
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            currentStep >= 2 ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
          }`}>
            2
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h2 className="text-xl font-light mb-6">Personal Information</h2>
                
                <div className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleChange('fullName', e.target.value)}
                        onBlur={() => handleBlur('fullName')}
                        className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none transition-colors ${
                          touched.fullName && errors.fullName
                            ? 'border-red-300 focus:border-red-500'
                            : touched.fullName && !errors.fullName
                            ? 'border-green-300 focus:border-green-500'
                            : 'border-gray-200 focus:border-gray-400'
                        }`}
                        placeholder="John Doe"
                      />
                      {touched.fullName && !errors.fullName && formData.fullName && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                      )}
                    </div>
                    {touched.fullName && errors.fullName && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        onBlur={() => handleBlur('email')}
                        className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none transition-colors ${
                          touched.email && errors.email
                            ? 'border-red-300 focus:border-red-500'
                            : touched.email && !errors.email
                            ? 'border-green-300 focus:border-green-500'
                            : 'border-gray-200 focus:border-gray-400'
                        }`}
                        placeholder="you@example.com"
                      />
                      {touched.email && !errors.email && formData.email && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                      )}
                    </div>
                    {touched.email && errors.email && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        onBlur={() => handleBlur('phone')}
                        className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none transition-colors ${
                          touched.phone && errors.phone
                            ? 'border-red-300 focus:border-red-500'
                            : touched.phone && !errors.phone
                            ? 'border-green-300 focus:border-green-500'
                            : 'border-gray-200 focus:border-gray-400'
                        }`}
                        placeholder="+1 234 567 8900"
                      />
                      {touched.phone && !errors.phone && formData.phone && (
                        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                      )}
                    </div>
                    {touched.phone && errors.phone && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={handleNextStep}
                    className="w-full mt-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                  >
                    Continue
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h2 className="text-xl font-light mb-6">Security & Preferences</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Password */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        onBlur={() => handleBlur('password')}
                        className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none transition-colors ${
                          touched.password && errors.password
                            ? 'border-red-300 focus:border-red-500'
                            : touched.password && !errors.password
                            ? 'border-green-300 focus:border-green-500'
                            : 'border-gray-200 focus:border-gray-400'
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    
                    {/* Password strength indicator */}
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-gray-500">Password strength:</span>
                          <span className={`text-xs font-medium ${passwordStrength.color.replace('bg-', 'text-')}`}>
                            {passwordStrength.text}
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${passwordStrength.color} transition-all duration-300`}
                            style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                          />
                        </div>
                        <ul className="mt-2 space-y-1">
                          <li className={`text-xs flex items-center gap-1 ${
                            formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'
                          }`}>
                            <CheckCircle className="h-3 w-3" />
                            At least 8 characters
                          </li>
                          <li className={`text-xs flex items-center gap-1 ${
                            /[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'
                          }`}>
                            <CheckCircle className="h-3 w-3" />
                            One uppercase letter
                          </li>
                          <li className={`text-xs flex items-center gap-1 ${
                            /[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'
                          }`}>
                            <CheckCircle className="h-3 w-3" />
                            One number
                          </li>
                          <li className={`text-xs flex items-center gap-1 ${
                            /[^A-Za-z0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'
                          }`}>
                            <CheckCircle className="h-3 w-3" />
                            One special character
                          </li>
                        </ul>
                      </div>
                    )}
                    
                    {touched.password && errors.password && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        onBlur={() => handleBlur('confirmPassword')}
                        className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none transition-colors ${
                          touched.confirmPassword && errors.confirmPassword
                            ? 'border-red-300 focus:border-red-500'
                            : touched.confirmPassword && !errors.confirmPassword
                            ? 'border-green-300 focus:border-green-500'
                            : 'border-gray-200 focus:border-gray-400'
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      {touched.confirmPassword && !errors.confirmPassword && formData.confirmPassword && (
                        <CheckCircle className="absolute right-10 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                      )}
                    </div>
                    {touched.confirmPassword && errors.confirmPassword && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Birth Date (Optional) */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Birth Date <span className="text-gray-400">(Optional)</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => handleChange('birthDate', e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400"
                      />
                    </div>
                  </div>

                  {/* Gender (Optional) */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Gender <span className="text-gray-400">(Optional)</span>
                    </label>
                    <div className="flex gap-4">
                      {['male', 'female', 'other'].map((g) => (
                        <label key={g} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="gender"
                            value={g}
                            checked={formData.gender === g}
                            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                            className="text-black"
                          />
                          <span className="text-sm capitalize">{g}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Country</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 appearance-none bg-white"
                      >
                        {countries.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Terms and Updates */}
                  <div className="space-y-3 pt-2">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-1 text-black"
                      />
                      <span className="text-sm text-gray-600">
                        I agree to the{' '}
                        <Link to="/terms" className="text-black hover:underline">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-black hover:underline">
                          Privacy Policy
                        </Link>
                      </span>
                    </label>

                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={receiveUpdates}
                        onChange={(e) => setReceiveUpdates(e.target.checked)}
                        className="mt-1 text-black"
                      />
                      <span className="text-sm text-gray-600">
                        I want to receive updates and offers via email
                      </span>
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="flex-1 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading || !agreeTerms}
                      className="flex-1 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sign in link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-black hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Register;
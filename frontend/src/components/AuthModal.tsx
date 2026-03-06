import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Phone, MapPin, Globe, Leaf, Sprout, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from '../utils/translations';
import { useLanguage } from '../context/LanguageContext';

type AuthUser = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  country?: string;
  language?: string;
  joinDate?: string;
  farmingExperience?: number;
  landSize?: number;
};

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuth: (user: AuthUser) => void;

}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuth }) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    country: '',
    language: currentLanguage
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update form language when currentLanguage prop changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      language: currentLanguage
    }));
  }, [currentLanguage]);

  const countries = [
    'India', 'USA', 'Canada', 'Australia', 'UK', 'Germany', 'France', 'Brazil', 'Other'
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'gu', name: 'ગુજરાતી' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'mr', name: 'मराठी' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = isLogin ? 'https://agrismart-7zyv.onrender.com/api/users/login' : 'https://agrismart-7zyv.onrender.com/api/users/register';
      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            country: formData.country,
            language: formData.language,
            password: formData.password
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      // Debug: Log response details
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const responseText = await response.text();
      console.log('Response text:', responseText);
      
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse JSON:', e);
        throw new Error(`Server returned non-JSON response: ${responseText.substring(0, 100)}...`);
      }

      if (!response.ok) {
        throw new Error(result.message || 'Authentication failed');
      }

      // Store token in localStorage
      if (result.token) {
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('user', JSON.stringify(result.data));
      }

      const user: AuthUser = {
        id: result.data._id || result.data.id,
        email: result.data.email,
        name: result.data.name,
        phone: result.data.phone,
        country: result.data.country,
        language: result.data.language || currentLanguage,
        joinDate: result.data.joinDate
      };

      onAuth(user);
      onClose();
    } catch (err) {
      console.error('Auth error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Background */}
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        
        {/* Modal */}
        <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-2xl ring-1 ring-black/5">
          {/* Decorative Header */}
          <div className="relative h-28 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600">
            {/* Pattern Overlay */}
            <div className="absolute inset-0 bg-black/10">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <Leaf className="absolute left-6 top-6 h-6 w-6 animate-pulse text-white/30" />
              <Sprout className="absolute right-8 top-8 h-5 w-5 animate-pulse text-white/30" style={{ animationDelay: '0.5s' }} />
              <Leaf className="absolute left-10 bottom-6 h-8 w-8 animate-pulse text-white/30" style={{ animationDelay: '1s' }} />
            </div>
            
            {/* Close Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose();
              }}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition-all duration-200 hover:scale-110"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
            
            {/* Title */}
            <div className="absolute bottom-6 left-6 right-6">
              <h2 className="text-3xl font-bold text-white tracking-tight">
                {isLogin ? 'Welcome Back' : 'Join AgriSmart'}
              </h2>
              <p className="text-white/90 text-sm mt-2 font-medium">
                {isLogin ? 'Continue your farming journey' : 'Start your sustainable farming journey'}
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8 pb-8">
            {/* Toggle */}
            <div className="mb-8 flex rounded-xl bg-gray-50 dark:bg-gray-800 p-1 ring-1 ring-gray-200 dark:ring-gray-700">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 rounded-lg py-3 px-4 text-sm font-semibold transition-all duration-200 ${
                  isLogin 
                    ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-600/20' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 rounded-lg py-3 px-4 text-sm font-semibold transition-all duration-200 ${
                  !isLogin 
                    ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-emerald-600/20' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 p-4 text-sm text-red-700 dark:text-red-300 font-medium">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name (Register Only) */}
              {!isLogin && (
                <div className="group">
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required={!isLogin}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 py-4 pl-12 pr-4 text-gray-900 dark:text-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-500 transition-all duration-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-2"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="group">
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 py-4 pl-12 pr-4 text-gray-900 dark:text-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-500 transition-all duration-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-2"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="group">
                <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 py-4 pl-12 pr-14 text-gray-900 dark:text-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-500 transition-all duration-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-2"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Phone (Register Only) */}
              {!isLogin && (
                <div className="group">
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 py-4 pl-12 pr-4 text-gray-900 dark:text-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-500 transition-all duration-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-2"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              )}

              {/* Country (Register Only) */}
              {!isLogin && (
                <div className="group">
                  <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-200">
                    Country
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full appearance-none rounded-xl border border-gray-200 dark:border-gray-700 py-4 pl-12 pr-10 text-gray-900 dark:text-white dark:bg-gray-800 transition-all duration-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-2"
                    >
                      <option value="">Select your country</option>
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 py-4 px-6 text-white font-semibold transition-all duration-200 hover:from-emerald-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-[1.02]"
              >
                {loading ? (
                  <div className="flex items-center space-x-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </button>
            </form>

            {/* Footer Text */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isLogin ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      onClick={() => setIsLogin(false)}
                      className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors duration-200"
                    >
                      Sign Up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      onClick={() => setIsLogin(true)}
                      className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors duration-200"
                    >
                      Sign In
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

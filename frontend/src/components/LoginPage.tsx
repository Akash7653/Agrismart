import React, { useState } from 'react';
import { Mail, Lock, User, Phone, MapPin, Globe, Leaf, Sprout, ArrowRight, Eye, EyeOff, Sun, Cloud, Droplets } from 'lucide-react';
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
};

interface LoginPageProps {
  onAuth: (user: AuthUser) => void;
  onBack?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onAuth, onBack }) => {
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
    language: 'en'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const user: AuthUser = {
        id: Date.now().toString(),
        email: formData.email,
        name: formData.name || formData.email.split('@')[0],
        phone: formData.phone,
        country: formData.country,
        language: formData.language,
        joinDate: new Date().toISOString()
      };

      onAuth(user);
    } catch (err) {
      setError('Authentication failed. Please try again.');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 animate-float opacity-10">
          <Sun className="h-16 w-16 text-yellow-500" />
        </div>
        <div className="absolute top-40 right-20 animate-float opacity-10" style={{ animationDelay: '1s' }}>
          <Cloud className="h-20 w-20 text-blue-400" />
        </div>
        <div className="absolute bottom-20 left-1/4 animate-float opacity-10" style={{ animationDelay: '2s' }}>
          <Droplets className="h-12 w-12 text-blue-500" />
        </div>
        <Leaf className="absolute top-1/3 right-1/4 h-8 w-8 animate-pulse text-green-600 opacity-20" />
        <Sprout className="absolute bottom-1/3 left-1/3 h-10 w-10 animate-pulse text-green-600 opacity-20" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Back Button */}
      {onBack && (
        <div className="relative z-10 p-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
          >
            <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
            Back to Home
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Welcome Message */}
            <div className="flex flex-col justify-center space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 px-4 py-2 text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                <Leaf className="mr-2 h-4 w-4" />
                Sustainable Farming Platform
              </div>
              
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white sm:text-6xl lg:text-7xl tracking-tight">
                {isLogin ? 'Welcome Back to' : 'Join the'}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">AgriSmart</span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                {isLogin 
                  ? 'Continue your journey towards sustainable and profitable farming with AI-powered insights and expert guidance.'
                  : 'Start your journey towards sustainable and profitable farming with AI-powered insights and expert guidance.'
                }
              </p>

              {/* Features */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4 text-gray-700 dark:text-gray-300">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30 shadow-sm">
                    <Leaf className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold dark:text-white">AI Crop Recommendations</h3>
                    <p className="text-gray-600 dark:text-gray-400">Get personalized crop suggestions based on your soil and climate conditions</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 text-gray-700 dark:text-gray-300">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30 shadow-sm">
                    <Droplets className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold dark:text-white">Disease Detection</h3>
                    <p className="text-gray-600 dark:text-gray-400">Early detection and treatment advice for plant diseases</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 text-gray-700 dark:text-gray-300">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30 shadow-sm">
                    <Sun className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold dark:text-white">Expert Consultations</h3>
                    <p className="text-gray-600 dark:text-gray-400">Connect with agricultural experts for personalized advice</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Auth Form */}
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md">
                <div className="overflow-hidden rounded-3xl bg-white dark:bg-gray-900 shadow-2xl ring-1 ring-black/5">
                  {/* Form Header */}
                  <div className="relative h-32 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600">
                    <div className="absolute inset-0 bg-black/10">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                    <div className="relative flex h-full items-center justify-center">
                      <div className="text-center">
                        <h2 className="text-3xl font-bold text-white tracking-tight">
                          {isLogin ? 'Sign In' : 'Create Account'}
                        </h2>
                        <p className="text-emerald-100 text-lg mt-2 font-medium">
                          {isLogin ? 'Access your dashboard' : 'Start your farming journey'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Form Content */}
                  <div className="p-8">
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
                      <div className="mb-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 p-4 text-sm text-red-700 dark:text-red-300 font-semibold">
                        {error}
                      </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Name (Register Only) */}
                      {!isLogin && (
                        <div>
                          <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">
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
                              className="w-full rounded-xl border border-gray-200 py-4 pl-12 pr-4 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-2"
                              placeholder="Enter your full name"
                            />
                          </div>
                        </div>
                      )}

                      {/* Email */}
                      <div>
                        <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">
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
                      <div>
                        <label className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-200">
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
                        <div>
                          <label className="mb-2 block text-sm font-bold text-gray-700">
                            Phone Number
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full rounded-xl border border-gray-200 py-4 pl-12 pr-4 text-gray-900 placeholder-gray-500 transition-all duration-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-2"
                              placeholder="Enter your phone number"
                            />
                          </div>
                        </div>
                      )}

                      {/* Country (Register Only) */}
                      {!isLogin && (
                        <div>
                          <label className="mb-2 block text-sm font-bold text-gray-700">
                            Country
                          </label>
                          <div className="relative">
                            <Globe className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            <select
                              name="country"
                              value={formData.country}
                              onChange={handleInputChange}
                              className="w-full appearance-none rounded-xl border border-gray-200 py-4 pl-12 pr-10 text-gray-900 transition-all duration-200 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-2"
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
                        className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 py-4 px-6 text-white font-bold text-lg transition-all duration-200 hover:from-emerald-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-[1.02]"
                      >
                        {loading ? (
                          <div className="flex items-center space-x-3">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
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
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {isLogin ? (
                          <>
                            Don't have an account?{' '}
                            <button
                              onClick={() => setIsLogin(false)}
                              className="font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors duration-200"
                            >
                              Sign Up
                            </button>
                          </>
                        ) : (
                          <>
                            Already have an account?{' '}
                            <button
                              onClick={() => setIsLogin(true)}
                              className="font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors duration-200"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

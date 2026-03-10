import React from 'react';
import { Brain, Zap, TrendingUp, Shield, Users, BarChart3, ArrowRight, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

interface LearnHowAIProps {
  onBack?: () => void;
  onGetStarted?: () => void;
}

const LearnHowAI: React.FC<LearnHowAIProps> = ({ onBack, onGetStarted }) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Our advanced machine learning algorithms analyze your soil composition, weather patterns, and crop health to provide precise recommendations.',
      benefits: ['Soil Analysis', 'Weather Integration', 'Crop Health Monitoring']
    },
    {
      icon: Zap,
      title: 'Real-Time Predictions',
      description: 'Get instant predictions about optimal planting times, irrigation schedules, and potential disease outbreaks before they happen.',
      benefits: ['Instant Results', 'Proactive Alerts', 'Yield Optimization']
    },
    {
      icon: TrendingUp,
      title: 'Continuous Learning',
      description: 'Our system learns from millions of farming data points daily, improving recommendations based on real-world outcomes.',
      benefits: ['Machine Learning', 'Data Driven', 'Constant Improvement']
    },
    {
      icon: Shield,
      title: 'Reliable & Secure',
      description: 'Built with enterprise-grade security and 99.9% uptime to ensure your farming data is always protected.',
      benefits: ['99.9% Uptime', 'Data Encryption', 'Secure Storage']
    }
  ];

  const stats = [
    { label: 'Data Points Analyzed', value: '2.5M+', icon: BarChart3 },
    { label: 'Successful Predictions', value: '98.7%', icon: TrendingUp },
    { label: 'Active Farmers', value: '50K+', icon: Users },
    { label: 'Accuracy Rate', value: '99.2%', icon: Shield }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Back Button */}
      {onBack && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
          <button
            onClick={onBack}
            className={`group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:-translate-x-1 ${
              isDark
                ? 'text-blue-400 hover:bg-gray-900/50'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-semibold">{t('buttons.backToHome', 'Back to Home')}</span>
          </button>
        </div>
      )}
      
      {/* Hero Section */}
      <div className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900' : 'bg-gradient-to-br from-emerald-100 via-blue-100 to-purple-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {t('learnAI.title', 'How ')} <span className={isDark ? 'text-blue-400' : 'text-emerald-600'}>AgriSmart AI</span> {t('learnAI.titleEnd', 'Works')}
            </h1>
            <p className={`text-xl text-center max-w-3xl mx-auto mb-12 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {t('learnAI.subtitle', 'Discover the cutting-edge technology that powers smarter, more sustainable farming for millions of farmers worldwide.')}
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`p-8 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  isDark
                    ? 'bg-gray-800 border-gray-700 hover:border-blue-500'
                    : 'bg-white border-gray-200 hover:border-emerald-500'
                }`}
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
                  isDark ? 'bg-blue-900/30' : 'bg-emerald-100'
                }`}>
                  <Icon className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-emerald-600'}`} />
                </div>
                <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
                <div className="space-y-2">
                  {feature.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isDark ? 'bg-blue-400' : 'bg-emerald-500'}`} />
                      <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className={`py-16 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('learnAI.trustedTitle', 'Trusted by Farmers Worldwide')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className={`text-center p-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                    isDark
                      ? 'bg-gray-800 border-gray-700'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-4 ${isDark ? 'text-blue-400' : 'text-emerald-600'}`} />
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className={`py-20 ${isDark ? 'bg-gradient-to-r from-blue-900 to-indigo-900' : 'bg-gradient-to-r from-emerald-600 to-green-600'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-white'}`}>
            Ready to Transform Your Farm?
          </h2>
          <p className={`text-xl mb-8 ${isDark ? 'text-blue-100' : 'text-emerald-100'}`}>
            Join thousands of farmers who are already using AgriSmart AI to increase yields, reduce costs, and practice sustainable agriculture.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onBack}
              className="px-8 py-4 bg-white text-emerald-600 rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
              Back to Home
            </button>
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnHowAI;

import React from 'react';
import { Users, Leaf, Heart, Globe, Award, TrendingUp, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const JoinTheMovement: React.FC = () => {
  const { isDark } = useTheme();

  const stats = [
    { label: 'Farmers Joined', value: '50,000+', icon: Users },
    { label: 'Acres Transformed', value: '2.5M+', icon: Leaf },
    { label: 'Countries', value: '40+', icon: Globe },
    { label: 'Success Rate', value: '95%', icon: Award }
  ];

  const benefits = [
    {
      title: 'Sustainable Farming',
      description: 'Join the revolution in organic farming that heals the soil and produces healthier food.',
      icon: Leaf
    },
    {
      title: 'Higher Yields',
      description: 'Our farmers report an average 45% increase in crop yields after switching to organic methods.',
      icon: TrendingUp
    },
    {
      title: 'Premium Prices',
      description: 'Get access to premium markets that pay 2-3x more for organic produce.',
      icon: Award
    },
    {
      title: 'Community Support',
      description: 'Connect with thousands of farmers worldwide sharing knowledge and resources.',
      icon: Users
    }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Hero Section */}
      <div className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-green-900 via-emerald-900 to-green-950' : 'bg-gradient-to-br from-green-100 via-emerald-50 to-green-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Join the <span className={isDark ? 'text-emerald-400' : 'text-emerald-600'}>Organic Movement</span>
            </h1>
            <p className={`text-xl text-center max-w-3xl mx-auto mb-12 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Be part of a global community transforming agriculture through sustainable, organic farming practices powered by AI technology.
            </p>
          </div>
        </div>
      </div>

      {/* Impact Stats */}
      <div className={`py-16 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Our Global Impact
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
                  <Icon className={`w-8 h-8 mx-auto mb-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
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

      {/* Benefits Section */}
      <div className={`py-16 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Why Join AgriSmart Movement?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className={`p-8 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    isDark
                      ? 'bg-gray-900 border-gray-700 hover:border-emerald-500'
                      : 'bg-white border-gray-200 hover:border-emerald-500'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${
                    isDark ? 'bg-emerald-900/30' : 'bg-emerald-100'
                  }`}>
                    <Icon className={`w-8 h-8 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  </div>
                  <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {benefit.title}
                  </h3>
                  <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className={`py-16 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl sm:text-4xl font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Hear From Our Farmers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Rajesh Patel',
                location: 'Gujarat, India',
                quote: 'AgriSmart helped me transition from chemical to organic farming. My yield increased 45% and my soil is regenerating.',
                crop: 'Cotton & Mustard'
              },
              {
                name: 'Maria Santos',
                location: 'Baja, Mexico',
                quote: 'The disease detection AI saved my entire corn crop from blight. Two weeks of early warning made all the difference.',
                crop: 'Corn & Beans'
              },
              {
                name: 'James Kipchoge',
                location: 'Nairobi, Kenya',
                quote: 'Consulting with experts changed everything. Now I grow drought-resistant crops profitably.',
                crop: 'Maize & Sorghum'
              }
            ].map((farmer, index) => (
              <div
                key={index}
                className={`p-6 rounded-xl border transition-all duration-300 hover:shadow-lg ${
                  isDark
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-emerald-900/30' : 'bg-emerald-100'
                  }`}>
                    <Users className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  </div>
                  <div>
                    <h4 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {farmer.name}
                    </h4>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {farmer.location} • {farmer.crop}
                    </p>
                  </div>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  "{farmer.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className={`py-20 ${isDark ? 'bg-gradient-to-r from-emerald-900 to-green-900' : 'bg-gradient-to-r from-emerald-600 to-green-600'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-3xl sm:text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-white'}`}>
            Ready to Make a Difference?
          </h2>
          <p className={`text-xl mb-8 ${isDark ? 'text-emerald-100' : 'text-emerald-100'}`}>
            Join thousands of farmers who are transforming agriculture and healing the planet through organic farming.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.history.back()}
              className="px-8 py-4 bg-white text-emerald-600 rounded-lg font-bold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
            >
              <ArrowRight className="w-5 h-5 rotate-180" />
              Back to Home
            </button>
            <button
              onClick={() => window.location.href = '/auth'}
              className="px-8 py-4 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105"
            >
              Join Movement Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinTheMovement;

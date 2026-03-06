import React from 'react';
import { Zap, TrendingUp, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const RevenueModel: React.FC = () => {
  const { currentLanguage = 'en' } = useLanguage();

  const revenueStreams = [
    {
      title: 'Premium Consultation',
      percentage: 35,
      description: 'Global AgriScientist consultations',
      icon: '💬',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Marketplace Commission',
      percentage: 30,
      description: 'Organic seeds, tools, IoT sensors',
      icon: '🛒',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'AI Premium Features',
      percentage: 20,
      description: 'Advanced prediction models',
      icon: '⚡',
      color: 'from-amber-500 to-orange-500',
    },
    {
      title: 'Farm Aggregation',
      percentage: 15,
      description: 'Connect farms to bulk buyers',
      icon: '📊',
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const values = [
    {
      label: 'Farmer Earnings',
      percentage: 75,
      color: 'from-emerald-400 to-green-500',
    },
    {
      label: 'AgriSmart Cut',
      percentage: 15,
      color: 'from-blue-400 to-cyan-500',
    },
    {
      label: 'Platform Costs',
      percentage: 10,
      color: 'from-gray-400 to-gray-500',
    },
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 mb-6 bg-red-100 rounded-full">
            <Heart className="w-4 h-4 mr-2 text-red-600" />
            <span className="text-red-700 text-sm font-semibold">We're Transparent by Design</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Our Revenue Model <span className="text-emerald-700">Works For Farmers</span>
          </h2>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We don't exploit farmers. We partner with them. 
            <br />
            Here's exactly how we make money—and why it aligns with your success.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {/* Left: Revenue Streams */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-8">How We Earn Revenue</h3>

            <div className="space-y-6">
              {revenueStreams.map((stream, index) => (
                <div key={index} className="relative">
                  {/* Progress Bar Background */}
                  <div className="mb-3">
                    <div className="flex justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 text-lg">{stream.title}</p>
                        <p className="text-sm text-gray-600">{stream.description}</p>
                      </div>
                      <span className="text-2xl">{stream.icon}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${stream.color} transition-all duration-500`}
                        style={{ width: `${stream.percentage}%` } as React.CSSProperties}
                      ></div>
                    </div>

                    <p className="text-right text-emerald-700 font-bold text-sm mt-2">{stream.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-emerald-50 rounded-xl border-2 border-emerald-200">
              <p className="text-emerald-900 font-semibold mb-2">💚 Why This Works</p>
              <p className="text-emerald-700 text-sm">
                Each revenue stream directly benefits farmers through features, tools, consultants, and market access.
              </p>
            </div>
          </div>

          {/* Right: Where Money Goes */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-8">Where Revenue Goes</h3>

            {/* Profit Split */}
            <div className="mb-12">
              <p className="font-semibold text-gray-700 mb-12 text-lg">Every $100 from our platform:</p>

              <div className="space-y-4">
                {values.map((value, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <p className="font-semibold text-gray-900">{value.label}</p>
                      <p className="font-bold text-lg text-gray-900">${value.percentage}</p>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${value.color}`}
                        style={{ width: `${value.percentage}%` } as React.CSSProperties}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust Points */}
            <div className="space-y-4">
              <div className="flex gap-4 p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                <Zap className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-blue-900">No Hidden Fees</p>
                  <p className="text-sm text-blue-700">No exploitation. Transparent pricing always.</p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-green-50 rounded-xl border-2 border-green-200">
                <TrendingUp className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-green-900">Our Growth = Your Growth</p>
                  <p className="text-sm text-green-700">As farmers earn more, we invest more in features.</p>
                </div>
              </div>

              <div className="flex gap-4 p-6 bg-purple-50 rounded-xl border-2 border-purple-200">
                <Heart className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-purple-900">We're Sustainable</p>
                  <p className="text-sm text-purple-700">Reinvesting profits into tech, consultants, and farmers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why This Model Benefits You */}
        <div className="bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl p-12 border-2 border-emerald-300">
          <h3 className="text-2xl font-bold text-emerald-900 mb-6">Why This Model Benefits You</h3>

          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <p className="text-4xl font-bold text-emerald-700 mb-2">✓</p>
              <p className="font-bold text-emerald-900 mb-2">Aligned Incentives</p>
              <p className="text-emerald-700">We win only when farmers win. Your success is our success.</p>
            </div>

            <div>
              <p className="text-4xl font-bold text-emerald-700 mb-2">✓</p>
              <p className="font-bold text-emerald-900 mb-2">No Farm Monopoly</p>
              <p className="text-emerald-700">We're a partner, not a middleman. Farmers keep 75%+ of earnings.</p>
            </div>

            <div>
              <p className="text-4xl font-bold text-emerald-700 mb-2">✓</p>
              <p className="font-bold text-emerald-900 mb-2">Continuous Investment</p>
              <p className="text-emerald-700">Revenue funds better AI, more experts, and new features for you.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RevenueModel;

import React from 'react';
import { TrendingUp, Globe, Users } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export const WhyNaturalFarming: React.FC = () => {
  const { isDark } = useTheme();
  const { currentLanguage = 'en' } = useLanguage();

  const globalStats = [
    {
      country: '🇮🇳 India',
      stat: '30M+ Farmers',
      detail: 'Leading organic farming adoption. 6 million certified organic farms.',
      growth: '25% yearly growth',
    },
    {
      country: '🇴🇷 Costa Rica',
      stat: '25% Organic',
      detail: 'Agriculture is 25% certified organic. Carbon neutral by 2050 goal.',
      growth: '3x increase in 10 years',
    },
    {
      country: '🇰🇪 Kenya',
      stat: '500K+ Farmers',
      detail: 'Agroforestry movement spreading. Drought-resistant crops thriving.',
      growth: '40% yield increase',
    },
    {
      country: '🇦🇲 Armenia',
      stat: '100% Candidate',
      detail: 'First EU country pursuing 100% organic goal by 2050.',
      growth: 'Policy-driven transition',
    },
  ];

  const demands = [
    {
      stat: '$300B+',
      label: 'Global organic market value',
      growth: 'Growing 30% CAGR',
    },
    {
      stat: '62%',
      label: 'Consumers prefer organic',
      growth: 'Even at premium prices',
    },
    {
      stat: '45%',
      label: 'Farmers want to transition',
      growth: 'But lack AI & tech support',
    },
  ];

  return (
    <section className="relative py-40 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in-down">
            Why Now? <span className="text-emerald-700">The Perfect Moment</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Consumers demand organic. Farmers want to transition. Technology makes it possible. 
            <br />
            The planet can't wait any longer.
          </p>
        </div>

        {/* Market Demand Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-24">
          {demands.map((demand, index) => (
            <div
              key={index}
              className="relative group p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border-2 border-emerald-200 hover:border-emerald-500 transition-smooth animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute -top-12 left-8">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white text-3xl font-bold group-hover:shadow-lg transition-smooth transform group-hover:scale-110">
                  {demand.stat}
                </div>
              </div>

              <div className="mt-16">
                <p className="text-xl font-bold text-gray-900 mb-2">{demand.label}</p>
                <p className="text-emerald-700 font-semibold text-sm">↗ {demand.growth}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Global Movement */}
        <div className="mb-20">
          <h3 className="text-4xl font-bold text-gray-900 text-center mb-12">
            Global Movement Growing Stronger
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {globalStats.map((item, index) => (
              <div
                key={index}
                className="group relative rounded-xl bg-gradient-to-br from-white to-gray-50 p-6 border-2 border-gray-100 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

                {/* Content */}
                <div className="space-y-3">
                  <p className="text-3xl font-bold">{item.country}</p>
                  <div>
                    <p className="text-2xl font-bold text-emerald-700">{item.stat}</p>
                    <p className="text-sm text-emerald-600 font-semibold mt-1">{item.growth}</p>
                  </div>
                  <p className="text-gray-600 text-sm">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Three Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 my-24">
          <div className="relative">
            <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl p-8 border-2 border-orange-200">
              <TrendingUp className="w-12 h-12 text-orange-600 mb-4" />
              <h4 className="text-2xl font-bold text-gray-900 mb-3">Demand Crisis</h4>
              <p className="text-gray-700">
                Consumers are willing to pay premium prices for organic. Supply can't meet demand.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl p-8 border-2 border-emerald-200">
              <Globe className="w-12 h-12 text-emerald-600 mb-4" />
              <h4 className="text-2xl font-bold text-gray-900 mb-3">Policy Shift</h4>
              <p className="text-gray-700">
                Governments incentivizing organic farming. EU subsidies, India's promotion of natural farming.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-2xl p-8 border-2 border-green-200">
              <Users className="w-12 h-12 text-green-600 mb-4" />
              <h4 className="text-2xl font-bold text-gray-900 mb-3">Farmer Readiness</h4>
              <p className="text-gray-700">
                Farmers know organic is better. They just need AI tools, consultants, and market access.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center p-12 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border-2 border-emerald-200">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            This is the moment. AgriSmart closes the gap.
          </h3>
          <p className="text-xl text-gray-700 mb-8">
            We connect farmer readiness with consumer demand using AI power.
          </p>
          <button className="px-8 py-4 bg-emerald-600 text-white rounded-lg font-bold text-lg hover:bg-emerald-700 transition-all duration-300">
            Join the Movement
          </button>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default WhyNaturalFarming;

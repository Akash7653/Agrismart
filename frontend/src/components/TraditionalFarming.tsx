import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export const TraditionalFarming: React.FC = () => {
  const { isDark } = useTheme();
  const { currentLanguage = 'en' } = useLanguage();

  const methods = [
    {
      region: 'Ancient India',
      title: 'Cow-Dung Farming',
      description: 'Vedic techniques using cow manure for soil enrichment, nitrogen fixation, and natural pest control.',
      benefits: ['Soil regeneration', 'Natural nitrogen', 'Biodiversity boost', 'Water retention'],
      emoji: '🐄',
      color: 'from-amber-400 to-amber-600',
    },
    {
      region: 'Indigenous Americas',
      title: 'The Three Sisters',
      description: 'Companion planting: corn, beans, and squash together. Maximizes yield while regenerating soil.',
      benefits: ['Pest control', 'Nutrient cycling', 'Increased yield', 'Drought resilient'],
      emoji: '🌽',
      color: 'from-green-400 to-emerald-600',
    },
    {
      region: 'African Tradition',
      title: 'Agroforestry',
      description: 'Integrating trees with crops. Prevents erosion, fixes carbon, and provides diverse harvest.',
      benefits: ['Carbon sequester', 'Erosion control', 'Biodiversity', 'Extra income'],
      emoji: '🌳',
      color: 'from-green-600 to-emerald-700',
    },
  ];

  const comparison = [
    { aspect: 'Soil Quality', traditional: 'Improves year by year', chemical: 'Degrades rapidly' },
    { aspect: 'Water Usage', traditional: 'Efficient retention', chemical: 'Heavy consumption' },
    { aspect: 'Worker Health', traditional: 'Safe for farmers', chemical: 'Toxic exposure' },
    { aspect: 'Food Quality', traditional: 'Rich in nutrients', chemical: 'Depleted nutrients' },
    { aspect: 'Cost', traditional: 'Low long-term', chemical: 'High seed & input costs' },
    { aspect: 'Climate Impact', traditional: 'Carbon negative', chemical: 'Carbon heavy' },
  ];

  return (
    <section className={`relative py-24 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      isDark
        ? 'bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900'
        : 'bg-gradient-to-b from-green-50 to-amber-50'
    }`}>
      {/* Background */}
      <div className="absolute inset-0 opacity-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className={`text-5xl md:text-6xl font-bold mb-6 animate-fade-in-down ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Ancient Wisdom for <span className={isDark ? 'text-emerald-400' : 'text-emerald-700'}>Modern Times</span>
          </h2>
          <p className={`text-xl max-w-2xl mx-auto animate-fade-in-up ${isDark ? 'text-gray-300' : 'text-gray-600'}`} style={{ animationDelay: '0.1s' }}>
            Organic farming isn't new. It's timeless. Proven across cultures for millennia.
          </p>
        </div>

        {/* Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {methods.map((method, index) => (
            <div
              key={index}
              className={`group relative rounded-2xl overflow-hidden border-2 transition-smooth shadow-md hover:shadow-xl animate-fade-in-up ${
                isDark
                  ? 'bg-gray-800 border-gray-700 hover:border-emerald-500'
                  : 'bg-white border-gray-100 hover:border-emerald-200'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient Header */}
              <div className={`h-32 bg-gradient-to-br ${method.color} relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-20 bg-pattern"></div>
                <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-6xl">{method.emoji}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <p className={`text-sm font-semibold mb-2 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>📍 {method.region}</p>
                <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{method.title}</h3>
                <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{method.description}</p>

                {/* Benefits */}
                <div className="space-y-2">
                  {method.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className={`rounded-2xl border-2 overflow-hidden shadow-xl ${
          isDark
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-100'
        }`}>
          <div className="bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-600 p-12">
            <h3 className="text-3xl font-bold text-white mb-3">Traditional vs Chemical Farming</h3>
            <p className="text-green-100 text-lg">Comprehensive impact comparison that tells the real story</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b-2 border-emerald-200 ${
                  isDark
                    ? 'bg-gray-700'
                    : 'bg-gradient-to-r from-gray-50 to-white'
                }`}>
                  <th className={`px-8 py-6 text-left font-bold text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>Impact Factor</th>
                  <th className="px-8 py-6 text-left font-bold text-white bg-gradient-to-r from-emerald-600 to-green-600">
                    <span className="flex items-center gap-2">
                      <span>🌱</span>
                      <span>Traditional Farming</span>
                    </span>
                  </th>
                  <th className="px-8 py-6 text-left font-bold text-white bg-gradient-to-r from-orange-500 to-red-600">
                    <span className="flex items-center gap-2">
                      <span>⚠️</span>
                      <span>Chemical Farming</span>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {comparison.map((item, index) => (
                  <tr 
                    key={index} 
                    className={`transition-all duration-300 group ${
                      isDark
                        ? 'hover:bg-gray-700'
                        : 'hover:bg-emerald-50'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <td className={`px-8 py-6 font-semibold ${
                      isDark
                        ? 'bg-gray-700 text-white group-hover:bg-gray-600'
                        : 'bg-gray-50 text-gray-900 group-hover:bg-emerald-100'
                    } transition-colors`}>
                      {item.aspect}
                    </td>
                    <td className={`px-8 py-6 ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className={`w-6 h-6 flex-shrink-0 mt-0.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                        <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>{item.traditional}</span>
                      </div>
                    </td>
                    <td className={`px-8 py-6 ${isDark ? 'text-orange-300' : 'text-orange-700'}`}>
                      <div className="flex items-start gap-3">
                        <XCircle className={`w-6 h-6 flex-shrink-0 mt-0.5 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
                        <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>{item.chemical}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className={`px-8 py-6 border-t flex flex-col sm:flex-row gap-6 justify-center ${
            isDark
              ? 'bg-gray-800 border-gray-700'
              : 'bg-gradient-to-r from-gray-50 to-white border-gray-200'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Sustainable & Beneficial</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Good for soil and farmers</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Harmful & Unsustainable</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Destroys soil and health</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-20 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <p className={`text-xl mb-8 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            These methods work. We combine them with AI for maximum impact.
          </p>
          <button className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg font-bold text-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-lg active:scale-95">
            Learn How AI Amplifies Organic Farming
          </button>
        </div>
      </div>

      <style>{`
        .bg-pattern {
          background-image: 
            radial-gradient(circle at 20% 80%, rgba(255,255,255,0.5) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.5) 0%, transparent 50%);
        }
      `}</style>
    </section>
  );
};

export default TraditionalFarming;

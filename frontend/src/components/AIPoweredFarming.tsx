import React from 'react';
import { Zap, Microscope, Monitor, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface AIPoweredFarmingProps {
  onFeatureClick?: (feature: string) => void;
}

export const AIPoweredFarming: React.FC<AIPoweredFarmingProps> = ({ 
  onFeatureClick,
}) => {
  const { isDark } = useTheme();
  const { currentLanguage = 'en' } = useLanguage();

  const features = [
    {
      title: 'Crop Prediction Engine',
      description: 'AI analyzes soil data, weather patterns, and historical yields to recommend the perfect crops for your land.',
      benefits: ['97% accuracy', 'Real-time updates', 'Multi-crop recommendation'],
      icon: Zap,
      color: 'from-amber-400 to-orange-600',
      features: ['Soil analysis', 'Weather forecast', 'Market demand', 'Yield prediction'],
    },
    {
      title: 'Disease Detection AI',
      description: 'Smartphone camera + ML model identifies plant diseases instantly. Stop problems before they spread.',
      benefits: ['Real-time detection', '94% accuracy', 'Treatment guide'],
      icon: Microscope,
      color: 'from-green-400 to-emerald-600',
      features: ['Image recognition', 'Treatment suggestions', 'Organic solutions', 'Prevention tips'],
    },
    {
      title: 'Smart Farm Monitor',
      description: 'IoT sensors track soil moisture, nutrient levels, and crop health 24/7 with AI-powered alerts.',
      benefits: ['Real-time alerts', 'Water optimization', 'Yield increase 40%'],
      icon: Monitor,
      color: 'from-blue-400 to-cyan-600',
      features: ['Soil sensors', 'Weather data', 'Health alerts', 'Resource optimization'],
    },
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 via-emerald-900 to-gray-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 mb-6 bg-emerald-500/20 rounded-full border border-emerald-500/50 animate-fade-in-down">
            <Zap className="w-4 h-4 mr-2 text-emerald-400" />
            <span className="text-emerald-300 text-sm font-semibold">Powered by AI</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Technology That <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-cyan-400 bg-clip-text text-transparent">Amplifies Nature</span>
          </h2>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            AI isn't meant to replace farming. It amplifies ancient wisdom. 
            <br />
            Three tools. Infinite possibilities.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Card Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl opacity-50 group-hover:opacity-100 transition-smooth"></div>

                {/* Card Border Animation */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-smooth`}></div>

                {/* Content */}
                <div className="relative p-8 space-y-6 rounded-2xl border border-gray-700 group-hover:border-transparent transition-smooth">
                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-lg bg-gradient-to-br ${feature.color} text-white`}>
                    <Icon className="w-8 h-8" />
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                        <span className="text-gray-300 text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* Feature List */}
                  <div className="pt-6 border-t border-gray-700">
                    <p className="text-xs font-semibold text-gray-500 mb-3 uppercase">Key Features</p>
                    <div className="grid grid-cols-2 gap-2">
                      {feature.features.map((feat, i) => (
                        <div key={i} className="text-xs text-gray-400 bg-gray-800/50 px-3 py-2 rounded-lg">
                          #{feat}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => onFeatureClick?.(feature.title)}
                    className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-smooth flex items-center justify-center gap-2 group/btn"
                  >
                    Try <span className="capitalize">{feature.title.split(' ')[0]}</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-emerald-950 to-green-950 rounded-2xl p-12 border border-emerald-800/50">
          <h3 className="text-3xl font-bold text-white mb-12 text-center">How It Works Together</h3>

          <div className="grid md:grid-cols-4 gap-6 items-center">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-2xl font-bold text-white">
                1
              </div>
              <p className="font-semibold text-white mb-2">Assess Your Farm</p>
              <p className="text-sm text-gray-300">Smart sensors + AI analyze soil, weather, crops</p>
            </div>

            <div className="hidden md:flex justify-center">
              <ArrowRight className="w-6 h-6 text-emerald-400" />
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-2xl font-bold text-white">
                2
              </div>
              <p className="font-semibold text-white mb-2">Get Smart Recommendations</p>
              <p className="text-sm text-gray-300">AI suggests crops, treatments, and timing</p>
            </div>

            <div className="hidden md:flex justify-center">
              <ArrowRight className="w-6 h-6 text-emerald-400" />
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-2xl font-bold text-white">
                3
              </div>
              <p className="font-semibold text-white mb-2">Harvest Success</p>
              <p className="text-sm text-gray-300">40% higher yields + healthy soil + premium prices</p>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-20 grid md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-emerald-400 font-bold text-lg mb-2">Deep Learning</p>
            <p className="text-gray-400 text-sm">Computer vision for plant health</p>
          </div>
          <div>
            <p className="text-emerald-400 font-bold text-lg mb-2">IoT Network</p>
            <p className="text-gray-400 text-sm">5000+ sensor integrations</p>
          </div>
          <div>
            <p className="text-emerald-400 font-bold text-lg mb-2">Real-Time Data</p>
            <p className="text-gray-400 text-sm">24/7 farm monitoring</p>
          </div>
          <div>
            <p className="text-emerald-400 font-bold text-lg mb-2">Predictive Models</p>
            <p className="text-gray-400 text-sm">30-day forecasting</p>
          </div>
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
      `}</style>
    </section>
  );
};

export default AIPoweredFarming;

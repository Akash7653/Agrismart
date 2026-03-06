import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, Droplet, Skull, TrendingUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export const ProblemSection: React.FC = () => {
  const { isDark } = useTheme();
  const { currentLanguage = 'en' } = useLanguage();
  const { t } = useTranslation();

  const problems = [
    {
      icon: Droplet,
      stat: '35%',
      title: t('soilDegradation', 'Soil Degradation'),
      description: t('soilDegradationDesc', 'Chemical farming depletes soil in 20-30 years. Our soil is dying faster than we can regenerate it.'),
      color: 'from-red-500 to-orange-500',
    },
    {
      icon: AlertTriangle,
      stat: '3.2B',
      title: t('chemicalTons', 'Tons of Chemicals'),
      description: t('chemicalTonsDesc', 'Annual pesticide use worldwide. Poisoning groundwater and harming farm workers every day.'),
      color: 'from-yellow-500 to-red-500',
    },
    {
      icon: Skull,
      stat: '1M+',
      title: t('deathsAnnually', 'Deaths Annually'),
      description: t('deathsAnnuallyDesc', 'Pesticide exposure causes 1 million+ preventable deaths every year globally.'),
      color: 'from-red-600 to-pink-600',
    },
    {
      icon: TrendingUp,
      stat: '60%',
      title: t('nutritionLoss', 'Nutrition Loss'),
      description: t('nutritionLossDesc', 'Chemical crops have 60% fewer minerals than organic produce. Our food is empty.'),
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <section className={`relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-300 ${
      isDark
        ? 'bg-gradient-to-b from-gray-950 to-gray-900'
        : 'bg-gradient-to-b from-gray-900 to-gray-800'
    }`}>
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in-down">
            The <span className="text-red-500">Problem</span> We
            <br />
            Cannot Ignore
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Chemical farming promised progress. It's delivered poison. Here's what we're losing:
          </p>
        </div>

        {/* Problem Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <div
                key={index}
                className="group relative animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Card */}
                <div className="relative h-full bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl p-8 border border-gray-700 hover:border-red-500/50 transition-smooth overflow-hidden">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${problem.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                  {/* Content */}
                  <div className="relative z-10 space-y-4">
                    {/* Icon */}
                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${problem.color} bg-opacity-20`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Stat */}
                    <div>
                      <p className={`text-4xl font-bold bg-gradient-to-r ${problem.color} bg-clip-text text-transparent`}>
                        {problem.stat}
                      </p>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white">{problem.title}</h3>

                    {/* Description */}
                    <p className="text-gray-400 text-sm leading-relaxed">{problem.description}</p>
                  </div>

                  {/* Bottom Border Animation */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Impact Statement */}
        <div className="mt-20 text-center p-12 rounded-2xl bg-gradient-to-r from-red-900/20 to-orange-900/20 border border-red-500/30 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <p className="text-2xl text-white font-semibold mb-4">
            We're losing the fight against soil degradation, toxins, and corporate greed.
          </p>
          <p className="text-gray-300 text-lg">
            But there's hope. Traditional farming methods work. AI amplifies them. And farmers are ready to change.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;

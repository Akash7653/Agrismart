import React, { useState, useEffect } from 'react';
import { Leaf, Sprout, ArrowRight, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface LandingHeroProps {
  onGetStarted?: () => void;
  onPredictClick?: () => void;
  onLearnHowAI?: () => void;
  onJoinMovement?: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ 
  onGetStarted, 
  onPredictClick,
  onLearnHowAI,
  onJoinMovement 
}) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { currentLanguage = 'en' } = useLanguage();
  const [floatingLeaves, setFloatingLeaves] = useState<Array<{ id: number; left: number }>>([]);

  useEffect(() => {
    setFloatingLeaves(
      Array.from({ length: 5 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
      }))
    );
  }, []);

  return (
    <div className={`relative min-h-screen overflow-hidden transition-colors duration-300 ${
      isDark
        ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950'
        : 'bg-gradient-to-br from-green-50 via-emerald-50 to-amber-50'
    }`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingLeaves.map((leaf) => (
          <div
            key={leaf.id}
            className="absolute animate-float opacity-5"
            style={{
              left: `${leaf.left}%`,
              top: '-20px',
              animationDelay: `${leaf.id * 0.5}s`,
            }}
          >
            <Leaf className="w-24 h-24 text-green-600" />
          </div>
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className={`absolute top-20 right-10 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob ${
        isDark ? 'bg-blue-600' : 'bg-green-300'
      }`}></div>
      <div className={`absolute -bottom-8 left-20 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 ${
        isDark ? 'bg-indigo-600' : 'bg-amber-300'
      }`}></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="min-h-screen flex flex-col justify-center items-center text-center pt-16 sm:pt-20 pb-16 sm:pb-20">
          {/* Badge */}
          <div className={`inline-flex items-center px-3 sm:px-4 py-2 mb-6 sm:mb-8 rounded-full backdrop-blur-sm border animate-fade-in-down text-xs sm:text-sm font-semibold shadow-lg ${
            isDark 
              ? 'bg-blue-900/40 border-blue-700 text-blue-300' 
              : 'bg-emerald-100/80 border-emerald-200 text-emerald-700'
          }`}>
            <Sprout className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
            {t('organic_revolution')}
          </div>

          {/* Main Headline */}
          <div className="max-w-4xl space-y-4 sm:space-y-6 mb-8 sm:mb-12 px-2 sm:px-0">
            <h1 className={`leading-tight animate-fade-in-up text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ animationDelay: '0.1s' }}>
              <span className="block">AgriSmart AI</span>
              <span className={`bg-clip-text text-transparent bg-gradient-to-r ${
                isDark 
                  ? 'from-blue-400 via-cyan-400 to-emerald-400' 
                  : 'from-emerald-600 via-green-500 to-amber-600'
              }`}>
                {t('farming_that_heals', 'Farming That Heals the Earth')}
              </span>
            </h1>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-12 sm:mb-16 justify-center w-full sm:w-auto px-2 sm:px-0 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {/* Start Your Journey Button */}
            <button
              onClick={onGetStarted}
              className="group relative flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg font-bold text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 overflow-hidden bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 whitespace-nowrap"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                Start Your Journey
              </span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 opacity-0 group-hover:opacity-100 transition-opacity relative z-10" />
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>

            {/* Learn How AI Works Button */}
            <button
              onClick={onLearnHowAI}
              className={`group relative flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-lg border-2 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 overflow-hidden whitespace-nowrap ${
                isDark
                  ? 'bg-gray-800/50 text-blue-300 border-blue-600 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/20'
                  : 'bg-white text-emerald-700 border-emerald-200 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/20'
              }`}
            >
              <span className="relative z-10">Learn How AI Works</span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Join Movement Button */}
            <button
              onClick={onJoinMovement}
              className="group relative flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg font-bold text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 whitespace-nowrap"
            >
              <span className="relative z-10 flex items-center gap-2">
                Join Movement
              </span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 opacity-0 group-hover:opacity-100 transition-opacity relative z-10" />
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 md:gap-8 max-w-full sm:max-w-2xl mx-auto px-2 sm:px-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className={`text-center p-3 sm:p-6 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
              isDark
                ? 'bg-gray-800/50 backdrop-blur border border-gray-700 hover:bg-gray-800/80'
                : 'bg-white/40 backdrop-blur hover:bg-white/60'
            }`}>
              <p className={`text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r ${
                isDark ? 'from-blue-400 to-cyan-400' : 'from-emerald-600 to-green-600'
              } bg-clip-text text-transparent`}>2.5M+</p>
              <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Acres Healed</p>
            </div>
            <div className={`text-center p-3 sm:p-6 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
              isDark
                ? 'bg-gray-800/50 backdrop-blur border border-gray-700 hover:bg-gray-800/80'
                : 'bg-white/40 backdrop-blur hover:bg-white/60'
            }`}>
              <p className={`text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r ${
                isDark ? 'from-blue-400 to-cyan-400' : 'from-emerald-600 to-green-600'
              } bg-clip-text text-transparent`}>50K+</p>
              <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Farmers Trust Us</p>
            </div>
            <div className={`text-center p-3 sm:p-6 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
              isDark
                ? 'bg-gray-800/50 backdrop-blur border border-gray-700 hover:bg-gray-800/80'
                : 'bg-white/40 backdrop-blur hover:bg-white/60'
            }`}>
              <p className={`text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r ${
                isDark ? 'from-blue-400 to-cyan-400' : 'from-emerald-600 to-green-600'
              } bg-clip-text text-transparent`}>40+</p>
              <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Countries</p>
            </div>
            <div className={`text-center p-3 sm:p-6 rounded-xl transition-all duration-300 hover:shadow-lg transform hover:scale-105 ${
              isDark
                ? 'bg-gray-800/50 backdrop-blur border border-gray-700 hover:bg-gray-800/80'
                : 'bg-white/40 backdrop-blur hover:bg-white/60'
            }`}>
              <p className={`text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r ${
                isDark ? 'from-blue-400 to-cyan-400' : 'from-emerald-600 to-green-600'
              } bg-clip-text text-transparent`}>95%</p>
              <p className={`text-xs sm:text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Yield Increase</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Scroll To Explore</span>
          <svg className={`w-6 h-6 ${isDark ? 'text-cyan-400' : 'text-emerald-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(100vh) rotate(180deg); }
        }
        
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-float {
          animation: float 15s infinite ease-in;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default LandingHero;

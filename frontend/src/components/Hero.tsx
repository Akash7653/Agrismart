import React, { useEffect, useState } from 'react';
import { useTranslation } from '../utils/translations';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Sprout, Tractor, Leaf, BarChart3, Shield } from 'lucide-react';

interface HeroProps {
  onGetStarted?: () => void;
  currentUser?: { name?: string } | null;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted, currentUser }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  const { isDark } = useTheme();

  const heroSlides = [
    {
      title: t('heroSlide1Title'),
      subtitle: t('heroSlide1Subtitle'),
      description: t('heroSlide1Description'),
      icon: Leaf,
      bg: 'bg-gradient-to-r from-green-500 to-emerald-600'
    },
    {
      title: t('heroSlide2Title'),
      subtitle: t('heroSlide2Subtitle'),
      description: t('heroSlide2Description'),
      icon: Shield,
      bg: 'bg-gradient-to-r from-blue-500 to-cyan-600'
    },
    {
      title: t('heroSlide3Title'),
      subtitle: t('heroSlide3Subtitle'),
      description: t('heroSlide3Description'),
      icon: Tractor,
      bg: 'bg-gradient-to-r from-purple-500 to-pink-600'
    },
    {
      title: t('heroSlide4Title'),
      subtitle: t('heroSlide4Subtitle'),
      description: t('heroSlide4Description'),
      icon: BarChart3,
      bg: 'bg-gradient-to-r from-orange-500 to-red-600'
    }
  ];

  // Enable carousel auto-rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const features = [
    { name: t('feature1Name'), count: '95%', subtitle: t('feature1Subtitle') },
    { name: t('feature2Name'), count: '1000+', subtitle: t('feature2Subtitle') },
    { name: t('feature3Name'), count: '500+', subtitle: t('feature3Subtitle') },
    { name: t('feature4Name'), count: '98%', subtitle: t('feature4Subtitle') }
  ];

  return (
    <div className={`relative min-h-screen overflow-hidden transition-colors duration-300 ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
      <div className={`absolute inset-0 bg-gradient-to-r ${isDark ? 'from-blue-900 via-indigo-900 to-purple-900' : 'from-green-400 via-blue-500 to-purple-600'} opacity-10`}></div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-16 sm:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center min-h-[70vh] sm:min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8 py-8 sm:py-0">
            <div className="space-y-3 sm:space-y-4">
              <div className={`inline-flex items-center px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium ${isDark ? 'bg-blue-900/50 text-blue-200' : 'bg-green-100 text-green-800'}`}>
                <Sprout className="w-3 sm:w-4 h-3 sm:h-4 mr-2" />
                {t('heroSubtitle')}
              </div>
              <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <span className={isDark ? 'text-cyan-400' : 'text-emerald-600'}>{t('heroTitle').split(' ').slice(0, 2).join(' ')}</span>
                <span className={`block ${isDark ? 'text-blue-400' : 'text-green-600'}`}>{t('heroTitle').split(' ').slice(2).join(' ') || ''}</span>
              </h1>
              <p className={`text-base sm:text-lg md:text-xl max-w-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {t('heroSubtitle')}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
              <button
                onClick={() => {
                  if (!currentUser && onGetStarted) {
                    onGetStarted();
                  }
                }}
                className={`bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 active:scale-95 font-semibold text-base sm:text-lg shadow-lg animate-slideUp backdrop-blur-sm min-h-[48px] sm:min-h-auto flex items-center justify-center ${
                  currentUser ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'
                }`}
                disabled={!!currentUser}
              >
                {currentUser ? '👋 Welcome Back' : 'Get Started'}
              </button>
              <button
                onClick={() => setIsVideoOpen(true)}
                className="border-2 border-green-600 text-green-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-green-600 hover:text-white transition-all duration-300 font-semibold text-base sm:text-lg transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg min-h-[48px] sm:min-h-auto flex items-center justify-center"
              >
                View Tutorial
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 pt-6 sm:pt-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center space-y-1 sm:space-y-2">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">
                    {feature.count}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">{feature.subtitle}</div>
                  <div className="text-xs text-gray-500 truncate">{feature.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Carousel (sliding cards) */}
          <div className="relative h-64 sm:h-80 lg:h-96 xl:h-[500px]">
            <div className="absolute inset-0 rounded-2xl overflow-hidden">
              {heroSlides.map((slide, index) => {
                const IconComponent = slide.icon;
                return (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-1000 transform ${
                      index === currentSlide
                        ? 'translate-x-0 opacity-100'
                        : index < currentSlide
                          ? '-translate-x-full opacity-0'
                          : 'translate-x-full opacity-0'
                    }`}
                  >
                    <div className={`${slide.bg} h-full rounded-2xl p-6 sm:p-8 text-white shadow-2xl`}>
                      <div className="flex flex-col h-full justify-between">
                        <div>
                          <div className="bg-white bg-opacity-20 rounded-full p-3 sm:p-4 w-fit mb-4 sm:mb-6">
                            <IconComponent className="w-6 sm:w-8 h-6 sm:h-8" />
                          </div>
                          <h3 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{slide.title}</h3>
                          <h4 className="text-base sm:text-xl font-medium opacity-90 mb-2 sm:mb-4">{slide.subtitle}</h4>
                          <p className="text-sm sm:text-lg opacity-80 leading-relaxed">{slide.description}</p>
                        </div>
                        <div className="flex justify-center space-x-2 mt-4 sm:mt-6">
                          {heroSlides.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => setCurrentSlide(i)}
                              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all hover:scale-110 active:scale-95 ${
                                i === currentSlide ? 'bg-white' : 'bg-white bg-opacity-40'
                              }`}
                              aria-label={`Go to slide ${i + 1}`}
                              title={`Go to slide ${i + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Demo Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-3 sm:p-4 border-b">
              <h3 className="text-base sm:text-lg font-semibold truncate">Platform Demo</h3>
              <button
                onClick={() => setIsVideoOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none ml-2 flex-shrink-0"
                aria-label="Close demo"
                title="Close demo"
              >
                ×
              </button>
            </div>
            <div className="aspect-video bg-black overflow-hidden flex-grow">
              <video
                className="w-full h-full"
                src="/assets/demo.mp4"
                controls
                playsInline
                preload="metadata"
                onError={(e) => {
                  const container = (e.currentTarget.parentElement as HTMLElement);
                  if (container) {
                    container.innerHTML = `
                      <iframe class="w-full h-full" src="https://www.kapwing.com/videos/68d2eac0229105ceca0ab058" title="${t('appName')} Demo" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                    `;
                  }
                }}
              >
                Sorry, your browser doesn't support embedded videos.
              </video>
            </div>
            <div className="p-4 text-sm text-gray-600">
              Tip: place your demo file at <code>/public/assets/demo.mp4</code>. If missing, the embedded demo link will be shown instead.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
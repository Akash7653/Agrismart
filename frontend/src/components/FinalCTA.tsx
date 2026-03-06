import React from 'react';
import { ArrowRight, Heart, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';

interface FinalCTAProps {
  onGetStarted?: () => void;
  onContactExpert?: () => void;
  onLearnHowAI?: () => void;
  onJoinMovement?: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ 
  onGetStarted,
  onContactExpert,
  onLearnHowAI,
  onJoinMovement,
}) => {
  const { t } = useTranslation();
  const { currentLanguage = 'en' } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-green-800 to-amber-900"></div>

        {/* Animated Blobs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent)',
          backgroundSize: '50px 50px'
        } as React.CSSProperties}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 mb-8 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
            <Heart className="w-4 h-4 mr-2 text-red-400" />
            <span className="text-white text-sm font-semibold">{t('organic_revolution')}</span>
          </div>

          {/* Headline */}
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight animate-fade-in-down">
            Join the
            <br />
            <span className="bg-gradient-to-r from-emerald-200 via-green-200 to-amber-200 bg-clip-text text-transparent">
              Organic Revolution
            </span>
          </h2>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-green-100 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Stop fighting nature. Start working with it. 
            <br />
            Let AI amplify your farming wisdom and heal the planet.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 items-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-2 text-white hover:text-emerald-300 transition-smooth">
              <Zap className="w-5 h-5 text-amber-400" />
              <span>50,000+ Farmers</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-white/30"></div>
            <div className="flex items-center gap-2 text-white">
              <Heart className="w-5 h-5 text-red-400" />
              <span>2.5M+ Acres Healed</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-white/30"></div>
            <div className="flex items-center gap-2 text-white">
              <ArrowRight className="w-5 h-5 text-green-400" />
              <span>95% Yield Increase</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {/* Start Journey Button */}
            <button
              onClick={onGetStarted}
              className="group relative flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 overflow-hidden bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700"
            >
              <span className="relative z-10 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                {t('start_journey')}
              </span>
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity relative z-10" />
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>

            {/* Learn How AI Button */}
            <button
              onClick={onLearnHowAI}
              className="group relative flex items-center justify-center gap-2 px-8 py-4 font-bold text-lg text-white rounded-xl border-2 border-white/50 hover:border-white/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 overflow-hidden bg-white/10"
            >
              <span className="relative z-10">{t('learn_how_ai')}</span>
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            {/* Join Movement Button */}
            <button
              onClick={onJoinMovement}
              className="group relative flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold text-white rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700"
            >
              <span className="relative z-10">{t('join_movement')}</span>
              <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity relative z-10" />
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          </div>

          {/* Features Highlight */}
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-20">
            <div className="p-6 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300">
              <p className="text-3xl mb-2">🤖</p>
              <p className="font-semibold text-white mb-2">AI-Powered</p>
              <p className="text-green-100 text-sm">Crop prediction & disease detection</p>
            </div>

            <div className="p-6 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300">
              <p className="text-3xl mb-2">🌍</p>
              <p className="font-semibold text-white mb-2">Global Network</p>
              <p className="text-green-100 text-sm">Consult experts from 40+ countries</p>
            </div>

            <div className="p-6 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300">
              <p className="text-3xl mb-2">💚</p>
              <p className="font-semibold text-white mb-2">100% Transparent</p>
              <p className="text-green-100 text-sm">You keep 75%+ of earnings</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center mb-12">
            <p className="text-white/70 text-sm mb-4">✓ Free for first 50 acres</p>
            <p className="text-white/70 text-sm mb-4">✓ No credit card required</p>
            <p className="text-white/70 text-sm">✓ Support in 15+ languages</p>
          </div>

          {/* FAQ Link */}
          <div>
            <p className="text-white/60 text-sm mb-4">Questions? We are here to help.</p>
            <a href="#" className="text-green-300 hover:text-green-200 font-semibold transition-colors">
              View FAQ & Get Support →
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-green-900 to-transparent"></div>

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

export default FinalCTA;

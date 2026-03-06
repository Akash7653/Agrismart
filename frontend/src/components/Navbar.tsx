import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, User, LogOut, Globe, ArrowRight, Zap, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';
import ThemeSwitcher from './ThemeSwitcher';
import NotificationCenter from './NotificationCenter';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useThemeColors } from '../hooks/useThemeColors';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'മലയാളം' },
  { code: 'mr', name: 'मराठी' },
  { code: 'gu', name: 'ગુજરાતી' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ' }
];

interface NavbarProps {
  currentUser: { name?: string } | null;
  onAuthClick: () => void;
  onSignOut?: () => void;
  onNavigate?: (section: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  currentUser, 
  onAuthClick, 
  onSignOut,
  onNavigate
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();
  const colors = useThemeColors();
  const { currentLanguage, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  const handleLanguageChange = (lang: string) => {
    changeLanguage(lang);
    setIsLanguageOpen(false);
  };

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false);
      }
    };
    
    if (isLanguageOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isLanguageOpen]);

  const navItems = [
    { name: t('dashboard'), href: '#dashboard', section: 'dashboard' },
    { name: t('cropPrediction'), href: '#prediction', section: 'prediction' },
    { name: t('diseaseDetection'), href: '#disease', section: 'disease' },
    { name: t('consultations'), href: '#consultations', section: 'consultations' },
    { name: t('marketplace'), href: '#marketplace', section: 'marketplace' },
    { name: t('analytics'), href: '#analytics', section: 'analytics' }
  ];

  return (
    <nav className={`${colors.bg.primary} shadow-xl border-b ${colors.border.primary} sticky top-0 z-50 transition-all duration-300 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3 sm:gap-8">
            <a href="#dashboard" className="flex-shrink-0 flex items-center hover:opacity-80 transition-opacity">
              <Logo size="medium" showText={true} />
            </a>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
            {/* Enhanced Language Selector */}
            <div className="hidden sm:block relative" ref={languageRef}>
              <button 
                className={`flex items-center gap-2 px-4.5 sm:px-5 py-2.5 text-base border-2 rounded-lg font-bold transition-all duration-300 ${colors.border.primary} ${colors.bg.secondary} ${colors.text.primary} hover:border-green-500 dark:hover:border-green-400 hover:shadow-lg hover:-translate-y-0.5 z-40`}
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              >
                <Globe className="w-5 h-5" />
                <span className="hidden lg:inline text-base font-semibold">{languages.find(l => l.code === currentLanguage)?.name || 'Language'}</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} />
              </button>
              {isLanguageOpen && (
                <div className={`absolute left-0 top-full mt-2 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} border-2 border-green-500 rounded-lg shadow-2xl z-50 w-40 py-0.5 overflow-hidden`}>
                  {languages.map((lang, index) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`w-full px-2.5 py-1.5 text-xs font-medium text-left hover:bg-green-50 dark:hover:bg-green-900/30 transition-all ${
                        currentLanguage === lang.code ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' : ''
                      } ${index < languages.length - 1 ? (isDark ? 'border-b border-gray-700' : 'border-b border-gray-200') : ''}`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {currentUser && <NotificationCenter isDark={isDark} />}
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block" />
            <ThemeSwitcher />
            {/* Right side items */}
            <div className="hidden md:flex items-center space-x-3">
              {/* User Authentication */}
              {currentUser ? (
                <div className={`flex items-center space-x-3 border-l ${colors.border.primary} pl-3`}>
                  <div className="flex items-center space-x-2">
                    <User className={`w-5 h-5 ${colors.text.secondary}`} />
                    <span className={`text-sm ${colors.text.primary} font-medium`}>{currentUser.name}</span>
                  </div>
                  <button onClick={onSignOut} className="px-3 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-105 shadow-md">{t('signOut')}</button>
                </div>
              ) : (
                <div className="flex items-center gap-3 pl-3">
                  <button onClick={onAuthClick} className="group relative flex items-center gap-2 px-5 sm:px-6 py-2.5 text-sm sm:text-base font-bold text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 overflow-hidden bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700">
                    <span className="relative z-10 flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      {t('signIn')}
                    </span>
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`${colors.text.primary} hover:text-green-600 dark:hover:text-green-400 focus:outline-none p-2 rounded-lg hover:bg-green-50 dark:hover:bg-gray-800 transition-all duration-200 transform hover:scale-110`}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className={`md:hidden fixed left-0 right-0 top-16 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 overflow-y-auto max-h-[calc(100vh-4rem)]`}>
          <div className="px-3 py-3 space-y-1">
            {navItems.map((item, index) => (
              <div key={item.name}>
                <button
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate(item.section);
                    }
                    setIsMenuOpen(false);
                  }}
                  className="text-black dark:text-gray-100 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-gray-800 block px-4 py-3 rounded-lg text-base font-bold transition-all duration-200 w-full text-left"
                >
                  {item.name}
                </button>
                {index < navItems.length - 1 && (
                  <div className="border-b border-gray-200 dark:border-gray-700 mx-2 my-1" />
                )}
              </div>
            ))}
            
            {/* Mobile Language Selector */}
            <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800">
              <div className="relative" ref={languageRef}>
                <button 
                  className={`flex items-center justify-between w-full px-4 py-3 text-base border-2 rounded-lg font-bold transition-all duration-300 ${colors.border.primary} ${colors.bg.secondary} ${colors.text.primary} hover:border-green-500 dark:hover:border-green-400 hover:shadow-lg`}
                  onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    <span className="font-semibold">{languages.find(l => l.code === currentLanguage)?.name || 'Language'}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} />
                </button>
                {isLanguageOpen && (
                  <div className={`absolute left-0 top-full mt-2 ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} border-2 border-green-500 rounded-lg shadow-2xl z-50 w-full py-0.5 overflow-hidden`}>
                    {languages.map((lang, index) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full px-2.5 py-1.5 text-xs font-medium text-left hover:bg-green-50 dark:hover:bg-green-900/30 transition-all ${
                          currentLanguage === lang.code ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' : ''
                        } ${index < languages.length - 1 ? (isDark ? 'border-b border-gray-700' : 'border-b border-gray-200') : ''}`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Mobile Auth */}
            <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800">
              {currentUser ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                    <User className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-base font-bold text-gray-900 dark:text-green-100">{currentUser.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      onSignOut?.();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 text-white bg-red-500 hover:bg-red-600 text-base font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>{t('signOut')}</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onAuthClick();
                    setIsMenuOpen(false);
                  }}
                  className="w-full group relative flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 text-white px-4 py-3 rounded-xl transition-all duration-300 font-bold text-base transform hover:scale-105 shadow-lg hover:shadow-xl active:scale-95 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    {t('signIn')}
                  </span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
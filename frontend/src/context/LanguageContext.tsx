import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import i18n from '../i18n';
import { useTranslation } from 'react-i18next';

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (language: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [, i18nReady] = useState(false);

  // Initialize i18n and load language
  useEffect(() => {
    const initializeLanguage = async () => {
      const savedLanguage = localStorage.getItem('i18nextLng') || i18n.language || 'en';
      await i18n.changeLanguage(savedLanguage);
      setCurrentLanguage(savedLanguage);
      document.documentElement.lang = savedLanguage;
      const rtlLanguages = ['ar', 'ur', 'fa'];
      document.documentElement.dir = rtlLanguages.includes(savedLanguage) ? 'rtl' : 'ltr';
      i18nReady(true);
    };
    initializeLanguage();
  }, []);

  // Listen to i18n language changes and update context
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      setCurrentLanguage(lng);
      localStorage.setItem('i18nextLng', lng);
      document.documentElement.lang = lng;
      const rtlLanguages = ['ar', 'ur', 'fa'];
      document.documentElement.dir = rtlLanguages.includes(lng) ? 'rtl' : 'ltr';
      // Force a re-render by updating parent
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lng } }));
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  const changeLanguage = useCallback((language: string) => {
    // Save to localStorage
    localStorage.setItem('i18nextLng', language);
    // Update DOM attributes immediately for responsiveness
    document.documentElement.lang = language;
    const rtlLanguages = ['ar', 'ur', 'fa'];
    document.documentElement.dir = rtlLanguages.includes(language) ? 'rtl' : 'ltr';
    // Update state immediately
    setCurrentLanguage(language);
    // Update i18n which will trigger 'languageChanged' event
    i18n.changeLanguage(language)
      .then(() => {
        console.log(`Language changed to: ${language}`);
      })
      .catch(err => console.error('Language change error:', err));
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

// Custom hook that combines LanguageContext + useTranslation for better reactivity
export const useLanguageAndTranslation = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const { t, i18n } = useTranslation();
  const [, setRenderKey] = useState(0);

  // Listen for language changes and force re-renders
  useEffect(() => {
    const handleLanguageChange = () => {
      setRenderKey(prev => prev + 1);
    };
    window.addEventListener('languageChanged', handleLanguageChange);
    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  return { currentLanguage, changeLanguage, t, i18n };
};

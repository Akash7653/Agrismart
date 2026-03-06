import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

const supportedLanguages = ['en', 'hi', 'ta', 'te', 'kn', 'ml', 'mr', 'gu', 'bn', 'pa'];
const rtlLanguages = ['ar', 'ur', 'fa']; // Expand as needed

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'en', // Set default language to English
    fallbackLng: 'en',
    supportedLngs: supportedLanguages,
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false,
      transEmptyNodeValue: '', // Handle empty translation nodes
    },
    interpolation: {
      escapeValue: false,
    },
    defaultNS: 'translation',
    ns: ['translation'],
  });

// RTL support: update dir attribute on language change
i18n.on('languageChanged', (lng: string) => {
  document.documentElement.dir = rtlLanguages.includes(lng) ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
  localStorage.setItem('i18nextLng', lng);
  // Dispatch custom event for external listeners
  window.dispatchEvent(new CustomEvent('i18nLanguageChanged', { detail: { lng } }));
});

// Ensure components re-render when language changes by forcing a mutation observer
const observerConfig = {
  attributes: true,
  attributeFilter: ['lang', 'dir'],
  subtree: false
};

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === 'lang' || mutation.attributeName === 'dir') {
      window.dispatchEvent(new Event('domLanguageChange'));
    }
  });
});

observer.observe(document.documentElement, observerConfig);

export default i18n;

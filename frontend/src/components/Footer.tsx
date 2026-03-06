import React from 'react';
import { Sprout, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Heart } from 'lucide-react';
import { useTranslation } from '../utils/translations';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

type FooterProps = {
  currentLanguage?: string;
};

const Footer: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  const { isDark } = useTheme();

  const quickLinks = [
    { name: t('cropPrediction'), href: '#prediction' },
    { name: t('diseaseDetection'), href: '#disease' },
    { name: t('consultations'), href: '#consultations' },
    { name: t('marketplace'), href: '#marketplace' },
    { name: t('analytics'), href: '#analytics' }
  ];
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  const supportLinks = [
    { name: 'Help Center', href: '#' },
    { name: 'Contact Support', href: '#' },
    { name: 'User Guide', href: '#' },
    { name: 'FAQ', href: '#' },
    { name: 'Community', href: '#' }
  ];

  const resources = [
    { name: 'Farming Blog', href: '#' },
    { name: 'Weather Updates', href: '#' },
    { name: 'Market Reports', href: '#' },
    { name: 'Success Stories', href: '#' },
    { name: 'Research Papers', href: '#' }
  ];

  const legal = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
    { name: 'Disclaimer', href: '#' }
  ];

  return (
    <footer className={`transition-colors duration-300 ${isDark ? 'bg-gray-950 text-white' : 'bg-gray-900 text-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
              <div className="bg-green-500 p-2 rounded-lg">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">{/* app name */}{/* will be translated by parent components via Navbar t('appName') */}{' '}</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Empowering farmers with AI-driven solutions for crop prediction, disease detection, 
              and market insights. Join thousands of farmers who have transformed their farming 
              practices with our platform.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-green-500" />
                <span className="text-gray-300">New Delhi, India</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-500" />
                <span className="text-gray-300">+91 1800-AGRI-SMART</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-green-500" />
                <span className="text-gray-300">support@agrismart.com</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" title="Facebook" aria-label="Facebook" className="bg-gray-800 p-2 rounded-lg hover:bg-green-500 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" title="Twitter" aria-label="Twitter" className="bg-gray-800 p-2 rounded-lg hover:bg-blue-500 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" title="Instagram" aria-label="Instagram" className="bg-gray-800 p-2 rounded-lg hover:bg-pink-500 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" title="YouTube" aria-label="YouTube" className="bg-gray-800 p-2 rounded-lg hover:bg-red-500 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">{t('quickTopics') || 'Quick Links'}</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-green-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-green-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-3">
              {resources.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-green-400 transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="mb-6 lg:mb-0">
              <h3 className="text-xl font-bold mb-2">{t('footerStayUpdatedTitle') || 'Stay Updated'}</h3>
              <p className="text-gray-300">
                {t('footerStayUpdatedSubtitle') || 'Get the latest farming insights, weather updates, and market analysis delivered to your inbox.'}
              </p>
            </div>
            <div className="flex w-full lg:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footerStayUpdatedSubtitle') ? t('footerStayUpdatedSubtitle') : 'Enter your email'}
                aria-label={t('footerStayUpdatedTitle') || 'Newsletter email'}
                className="flex-1 lg:w-64 px-4 py-3 rounded-l-lg bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <button
                aria-label={t('subscribe') || 'Subscribe'}
                onClick={() => {
                  if (!email) return;
                  // fake subscribe: in a real app you'd call an API
                  setSubscribed(true);
                }}
                className="bg-green-500 text-white px-6 py-3 rounded-r-lg hover:bg-green-600 transition-colors font-semibold"
              >
                {t('subscribe')}
              </button>
            </div>
            {subscribed && (
              <div className="mt-4 text-sm text-green-300">
                {t('subscriptionSuccess')}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col lg:flex-row items-center justify-between">
              <div className="text-gray-400 text-sm mb-4 lg:mb-0">
              <p className="flex items-center">
                Made with <Heart className="w-4 h-4 text-red-500 mx-1" /> for farmers worldwide
              </p>
              <p className="mt-1">
                © 2025 AgriSmart. All rights reserved. | Supporting sustainable agriculture since 2020
              </p>
            </div>
            <div className="flex items-center space-x-6">
              {legal.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  title={link.name}
                  aria-label={link.name}
                  className="text-gray-400 hover:text-green-400 text-sm transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
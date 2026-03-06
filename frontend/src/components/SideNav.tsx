import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Sprout, Shield, Stethoscope, ShoppingBag, BarChart3, BookOpen, History, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';

type SideNavProps = {
  onNavigate?: (section: string) => void;
};

const sections = [
  { id: 'dashboard', icon: LayoutDashboard, labelKey: 'dashboard' },
  { id: 'prediction', icon: Sprout, labelKey: 'cropPrediction' },
  { id: 'disease', icon: Shield, labelKey: 'diseaseDetection' },
  { id: 'consultations', icon: Stethoscope, labelKey: 'consultations' },
  { id: 'marketplace', icon: ShoppingBag, labelKey: 'marketplace' },
  { id: 'farmResources', icon: BookOpen, labelKey: 'farmResources' },
  { id: 'history', icon: History, labelKey: 'history' },
  { id: 'analytics', icon: BarChart3, labelKey: 'analytics' },
];

const SideNav: React.FC<SideNavProps> = ({ onNavigate }) => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const [active, setActive] = useState<string>('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [translationKey, setTranslationKey] = useState(0);

  // Force re-render when language changes
  useEffect(() => {
    setTranslationKey(prev => prev + 1);
  }, [currentLanguage]);

  const handleNavigate = (targetId: string) => {
    setActive(targetId);
    
    // Call the onNavigate callback if provided
    if (onNavigate) {
      onNavigate(targetId);
      return;
    }
    
    // Fallback to default behavior
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.hash = `#${targetId}`;
    }
  };

  return (
    <aside
      className={`hidden lg:flex lg:flex-col bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/40 border-r border-blue-200 shadow-sm sticky top-16 h-[calc(100vh-4rem)] z-40 transition-all duration-300 ease-out ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      aria-label="Dashboard navigation"
    >
      {/* Collapser Button */}
      <div className="px-4 pt-6 pb-4 border-b border-blue-200 flex justify-end">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-blue-100 transition-all duration-200 hover:shadow-md"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-blue-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-blue-600" />
          )}
        </button>
      </div>
      
      <nav key={translationKey} className="flex-1 overflow-y-auto px-3 py-6 space-y-2">
        {sections.map(({ id, icon: Icon, labelKey }, index) => {
          const label = t(labelKey);
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => handleNavigate(id)}
              className={`w-full flex items-center px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-blue-100/60 hover:text-blue-700 dark:text-gray-300 dark:hover:bg-gray-800/80'
              } ${isCollapsed ? 'justify-center' : ''} transform`}
              title={isCollapsed ? label : ''}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              {!isCollapsed && (
                <span className="ml-3 truncate font-poppins group-hover:font-bold transition-all">{label}</span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default SideNav;


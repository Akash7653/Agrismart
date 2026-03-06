import React from 'react';
import { Sprout } from 'lucide-react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', showText = true }) => {
  const sizeMap = {
    small: { icon: 'w-6 h-6', text: 'text-lg' },
    medium: { icon: 'w-8 h-8', text: 'text-xl' },
    large: { icon: 'w-12 h-12', text: 'text-3xl' }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        {/* Outer glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full opacity-20 blur-lg animate-pulse"></div>
        
        {/* Icon container */}
        <div className={`${sizeMap[size].icon} relative bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg`}>
          <Sprout className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`${sizeMap[size].text} font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent`}>
            AgriSmart
          </span>
          <span className="text-xs font-semibold text-emerald-600 tracking-wider -mt-1">AI</span>
        </div>
      )}
    </div>
  );
};

export default Logo;

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleTheme();
  };

  return (
    <button
      onClick={handleClick}
      className={`group relative p-2.5 rounded-xl transition-all duration-300 transform hover:scale-110 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500/50 overflow-hidden ${
        isDark 
          ? 'bg-gray-800 hover:bg-gray-700' 
          : 'bg-white hover:bg-gray-100'
      }`}
      aria-label="Toggle dark mode"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      type="button"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-400 relative z-10 group-hover:rotate-90 transition-transform duration-500" />
      ) : (
        <Moon className="w-5 h-5 text-indigo-600 relative z-10 group-hover:-rotate-90 transition-transform duration-500" />
      )}
    </button>
  );
};

export default ThemeSwitcher;

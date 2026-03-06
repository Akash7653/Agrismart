import { useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

/**
 * Theme-aware color palettes for components
 * Returns colors that automatically adapt to dark/light mode
 */
export const useThemeColors = () => {
  const { isDark } = useTheme();

  return useMemo(() => ({
    // Background colors
    bg: {
      primary: isDark ? 'bg-gray-900' : 'bg-white',
      secondary: isDark ? 'bg-gray-800' : 'bg-gray-50',
      tertiary: isDark ? 'bg-gray-700' : 'bg-gray-100',
      card: isDark ? 'bg-gray-800' : 'bg-white',
      input: isDark ? 'bg-gray-700' : 'bg-white',
      hover: isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
    },

    // Text colors
    text: {
      primary: isDark ? 'text-white' : 'text-gray-900',
      secondary: isDark ? 'text-gray-300' : 'text-gray-600',
      tertiary: isDark ? 'text-gray-400' : 'text-gray-500',
      inverted: isDark ? 'text-gray-900' : 'text-white',
      muted: isDark ? 'text-gray-500' : 'text-gray-400',
    },

    // Border colors
    border: {
      primary: isDark ? 'border-gray-700' : 'border-gray-200',
      secondary: isDark ? 'border-gray-600' : 'border-gray-300',
      light: isDark ? 'border-gray-800' : 'border-gray-100',
    },

    // Status colors (same in both themes)
    status: {
      success: 'bg-green-500 text-white',
      error: 'bg-red-500 text-white',
      warning: 'bg-yellow-500 text-white',
      info: 'bg-blue-500 text-white',
    },

    // Chart/Analytics colors
    charts: {
      primary: isDark ? '#10b981' : '#059669',
      secondary: isDark ? '#3b82f6' : '#2563eb',
      tertiary: isDark ? '#f59e0b' : '#d97706',
      accent: isDark ? '#8b5cf6' : '#7c3aed',
      neutral: isDark ? '#6b7280' : '#9ca3af',
    },

    // Shadow
    shadow: isDark ? 'shadow-lg' : 'shadow-md',

    // Divider
    divider: isDark ? 'divide-gray-700' : 'divide-gray-200',
  }), [isDark]);
};

/**
 * Get gradient classes based on theme
 */
export const useGradient = (type: 'primary' | 'success' | 'warning' | 'danger' = 'primary') => {
  const { isDark } = useTheme();

  const gradients = {
    primary: isDark
      ? 'bg-gradient-to-r from-blue-900 to-blue-700'
      : 'bg-gradient-to-r from-blue-500 to-blue-600',
    success: isDark
      ? 'bg-gradient-to-r from-green-900 to-green-700'
      : 'bg-gradient-to-r from-green-500 to-green-600',
    warning: isDark
      ? 'bg-gradient-to-r from-yellow-900 to-yellow-700'
      : 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    danger: isDark
      ? 'bg-gradient-to-r from-red-900 to-red-700'
      : 'bg-gradient-to-r from-red-500 to-red-600',
  };

  return gradients[type];
};

/**
 * Get card styles based on theme
 */
export const useCardStyles = () => {
  const { isDark } = useTheme();
  const colors = useThemeColors();

  return useMemo(() => ({
    container: `${colors.bg.card} ${colors.border.primary} border rounded-lg ${colors.shadow} transition-all duration-300`,
    header: `${colors.bg.secondary} p-4 border-b ${colors.border.primary}`,
    body: 'p-4',
    footer: `${colors.bg.secondary} p-4 border-t ${colors.border.primary}`,
  }), [isDark, colors]);
};

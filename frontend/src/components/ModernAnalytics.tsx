import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Users, DollarSign, Package, Target, ArrowUp, ArrowDown, Eye,
  Zap, Award, AlertCircle, Activity, BarChart3, Download, TrendingUp
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useThemeColors } from '../hooks/useThemeColors';

interface MetricCard {
  id: string;
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
  icon: React.ElementType;
  color: string;
}

const ModernAnalytics: React.FC = () => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const periods = [
    { id: 'day', name: t('today', 'Today') },
    { id: 'week', name: t('thisWeek', 'This Week') },
    { id: 'month', name: t('thisMonth', 'This Month') },
    { id: 'year', name: t('thisYear', 'This Year') }
  ];

  const metrics: MetricCard[] = [
    {
      id: 'revenue',
      title: t('totalRevenue', 'Total Revenue'),
      value: '₹2,45,678',
      change: 12.5,
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      id: 'users',
      title: t('activeUsers', 'Active Users'),
      value: '8,234',
      change: 8.2,
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      id: 'orders',
      title: 'Orders',
      value: '1,456',
      change: -3.4,
      trend: 'down',
      icon: Package,
      color: 'purple'
    },
    {
      id: 'conversion',
      title: 'Conversion Rate',
      value: '3.2%',
      change: 15.7,
      trend: 'up',
      icon: Target,
      color: 'orange'
    }
  ];

  const cropData = [
    { name: 'Wheat', value: 35, revenue: '₹85,000', growth: 12 },
    { name: 'Rice', value: 28, revenue: '₹68,000', growth: 8 },
    { name: 'Corn', value: 20, revenue: '₹48,000', growth: -5 },
    { name: 'Cotton', value: 10, revenue: '₹24,000', growth: 15 },
    { name: 'Sugarcane', value: 7, revenue: '₹16,800', growth: 3 }
  ];

  const marketTrends = [
    { crop: 'Wheat', price: '₹2,850/quintal', change: 2.5, trend: 'up' },
    { crop: 'Rice', value: '₹3,200/quintal', change: -1.2, trend: 'down' },
    { crop: 'Corn', value: '₹1,950/quintal', change: 5.8, trend: 'up' },
    { crop: 'Cotton', value: '₹6,800/quintal', change: 0.0, trend: 'neutral' },
    { crop: 'Sugarcane', value: '₹3,100/quintal', change: 3.2, trend: 'up' }
  ];

  const recentActivities = [
    { id: 1, type: 'order', message: 'New order for wheat seeds', time: '2 mins ago', icon: Package },
    { id: 2, type: 'user', message: 'New user registration', time: '15 mins ago', icon: Users },
    { id: 3, type: 'revenue', message: 'Payment received: ₹4,500', time: '1 hour ago', icon: DollarSign },
    { id: 4, type: 'alert', message: 'Low stock alert for fertilizer', time: '2 hours ago', icon: AlertCircle }
  ];

  const renderMetricCard = (metric: MetricCard) => {
    const Icon = metric.icon;
    return (
      <div key={metric.id} className={`rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6 ${
        isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
            isDark
              ? `bg-${metric.color}-900/30`
              : `bg-${metric.color}-100`
          }`}>
            <Icon className={`w-7 h-7 text-${metric.color}-600`} />
          </div>
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold transition-all ${
            metric.trend === 'up' 
              ? isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700' 
              : isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'
          }`}>
            {metric.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            <span>{Math.abs(metric.change)}%</span>
          </div>
        </div>
        <h3 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{metric.value}</h3>
        <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{metric.title}</p>
      </div>
    );
  };

  const renderCropChart = () => (
    <div className={`rounded-2xl shadow-lg p-6 ${
      isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Crop Performance</h3>
        <select className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
          isDark
            ? 'bg-gray-700 border-gray-600 text-white'
            : 'bg-white border-gray-300 text-gray-900'
        }`}>
          <option>By Revenue</option>
          <option>By Volume</option>
          <option>By Growth</option>
        </select>
      </div>
      
      <div className="space-y-4">
        {cropData.map((crop) => (
          <div key={crop.name} className="flex items-center gap-4">
            <div className={`w-20 text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{crop.name}</div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{crop.value}%</span>
                <span className={`text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>{crop.revenue}</span>
              </div>
              <div className={`w-full h-3 rounded-full overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    crop.growth > 0 ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gradient-to-r from-red-400 to-red-500'
                  }`}
                  style={{ width: `${crop.value}%` }}
                />
              </div>
            </div>
            <div className={`flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-lg ${
              crop.growth > 0 
                ? isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
                : isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'
            }`}>
              {crop.growth > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              <span>{Math.abs(crop.growth)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMarketTrends = () => (
    <div className={`rounded-2xl shadow-lg p-6 ${
      isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Market Trends</h3>
        <button className={`text-sm font-bold flex items-center gap-1 px-3 py-1 rounded-lg transition-all duration-200 transform hover:scale-105 ${
          isDark
            ? 'text-blue-400 hover:bg-blue-900/30'
            : 'text-blue-600 hover:bg-blue-100'
        }`}>
          <Eye className="w-4 h-4" />
          <span>Details</span>
        </button>
      </div>
      
      <div className="space-y-3">
        {marketTrends.map((trend) => (
          <div key={trend.crop} className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:shadow-md ${
            isDark
              ? 'bg-gray-700 hover:bg-gray-600'
              : 'bg-gray-50 hover:bg-gray-100'
          }`}>
            <div>
              <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{trend.crop}</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{trend.value}</p>
            </div>
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
              trend.trend === 'up' 
                ? isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'
                : trend.trend === 'down'
                ? isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'
                : isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
            }`}>
              {trend.trend === 'up' && <ArrowUp className="w-3 h-3" />}
              {trend.trend === 'down' && <ArrowDown className="w-3 h-3" />}
              <span>{Math.abs(trend.change)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRecentActivities = () => (
    <div className={`rounded-2xl shadow-lg p-6 ${
      isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Recent Activities</h3>
        <button className={`text-sm font-bold transition-all duration-200 transform hover:scale-105 ${
          isDark
            ? 'text-blue-400 hover:text-blue-300'
            : 'text-blue-600 hover:text-blue-700'
        }`}>View All</button>
      </div>
      
      <div className="space-y-3">
        {recentActivities.map((activity) => {
          const Icon = activity.icon;
          const colorMap = {
            order: { bg: isDark ? 'bg-blue-900/30' : 'bg-blue-100', text: 'text-blue-600' },
            user: { bg: isDark ? 'bg-green-900/30' : 'bg-green-100', text: 'text-green-600' },
            revenue: { bg: isDark ? 'bg-purple-900/30' : 'bg-purple-100', text: 'text-purple-600' },
            alert: { bg: isDark ? 'bg-red-900/30' : 'bg-red-100', text: 'text-red-600' }
          };
          const colors = colorMap[activity.type as keyof typeof colorMap] || colorMap.order;
          
          return (
            <div key={activity.id} className={`flex items-start gap-3 p-4 rounded-xl transition-all duration-200 hover:shadow-md ${
              isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
            }`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colors.bg}`}>
                <Icon className={`w-5 h-5 ${colors.text}`} />
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{activity.message}</p>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderRevenueChart = () => (
    <div className={`rounded-2xl shadow-lg p-6 ${
      isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Revenue Overview</h3>
        <button className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 ${
          isDark
            ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
        }`}>
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
      
      {/* Mock Chart */}
      <div className={`h-64 rounded-xl flex items-center justify-center mb-6 ${
        isDark
          ? 'bg-gradient-to-br from-gray-700 to-gray-600'
          : 'bg-gradient-to-br from-blue-50 to-indigo-50'
      }`}>
        <div className="text-center">
          <BarChart3 className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Revenue chart visualization</p>
          <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Interactive chart would go here</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl text-center transition-all duration-200 hover:-translate-y-1 ${
          isDark
            ? 'bg-gray-700 border border-gray-600'
            : 'bg-gray-50 border border-gray-200'
        }`}>
          <p className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>₹2.4L</p>
          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>This Month</p>
        </div>
        <div className={`p-4 rounded-xl text-center transition-all duration-200 hover:-translate-y-1 ${
          isDark
            ? 'bg-gray-700 border border-gray-600'
            : 'bg-gray-50 border border-gray-200'
        }`}>
          <p className={`text-3xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>₹18.5L</p>
          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>YTD</p>
        </div>
        <div className={`p-4 rounded-xl text-center transition-all duration-200 hover:-translate-y-1 ${
          isDark
            ? 'bg-green-900/30 border border-green-700'
            : 'bg-green-50 border border-green-200'
        }`}>
          <p className={`text-3xl font-bold mb-1 ${isDark ? 'text-green-400' : 'text-green-600'}`}>+23%</p>
          <p className={`text-sm font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>Growth</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark
        ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950'
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Header */}
      <div className={`backdrop-blur-sm border-b transition-colors ${
        isDark
          ? 'bg-gray-800/80 border-gray-700'
          : 'bg-white/80 border-blue-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Analytics Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`rounded-lg p-1 flex items-center gap-2 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                {periods.map(period => (
                  <button
                    key={period.id}
                    onClick={() => setSelectedPeriod(period.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 transform ${
                      selectedPeriod === period.id
                        ? isDark
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-white text-blue-600 shadow-md'
                        : isDark
                        ? 'text-gray-400 hover:text-gray-300'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {period.name}
                  </button>
                ))}
              </div>
              
              <button className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all duration-200 transform hover:scale-105 shadow-md ${
                isDark
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}>
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map(metric => renderMetricCard(metric))}
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            {renderRevenueChart()}
          </div>
          <div>
            {renderMarketTrends()}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {renderCropChart()}
          {renderRecentActivities()}
        </div>

        {/* Quick Stats */}
        <div className={`mt-8 rounded-2xl shadow-lg p-6 ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
        }`}>
          <h3 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Insights</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className={`p-6 rounded-xl text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
              isDark
                ? 'bg-green-900/30 border border-green-700'
                : 'bg-green-50 border border-green-200'
            }`}>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                isDark ? 'bg-green-900/50' : 'bg-green-100'
              }`}>
                <TrendingUp className={`w-7 h-7 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              </div>
              <p className={`text-3xl font-bold mb-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>89%</p>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Customer Satisfaction</p>
            </div>
            
            <div className={`p-6 rounded-xl text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
              isDark
                ? 'bg-blue-900/30 border border-blue-700'
                : 'bg-blue-50 border border-blue-200'
            }`}>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                isDark ? 'bg-blue-900/50' : 'bg-blue-100'
              }`}>
                <Zap className={`w-7 h-7 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <p className={`text-3xl font-bold mb-2 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>2.3s</p>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Avg Response Time</p>
            </div>
            
            <div className={`p-6 rounded-xl text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
              isDark
                ? 'bg-purple-900/30 border border-purple-700'
                : 'bg-purple-50 border border-purple-200'
            }`}>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                isDark ? 'bg-purple-900/50' : 'bg-purple-100'
              }`}>
                <Award className={`w-7 h-7 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              </div>
              <p className={`text-3xl font-bold mb-2 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>156</p>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Expert Consultants</p>
            </div>
            
            <div className={`p-6 rounded-xl text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
              isDark
                ? 'bg-orange-900/30 border border-orange-700'
                : 'bg-orange-50 border border-orange-200'
            }`}>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                isDark ? 'bg-orange-900/50' : 'bg-orange-100'
              }`}>
                <Activity className={`w-7 h-7 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
              </div>
              <p className={`text-3xl font-bold mb-2 ${isDark ? 'text-orange-400' : 'text-orange-600'}`}>24/7</p>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Support Available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernAnalytics;

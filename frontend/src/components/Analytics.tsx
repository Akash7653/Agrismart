import React, { useState } from 'react';
import { useTranslation } from '../utils/translations';
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Leaf, Users, Globe, Calendar } from 'lucide-react';

interface AnalyticsProps {
  currentLanguage: string;
}

const Analytics: React.FC<AnalyticsProps> = ({ currentLanguage }) => {
  const { t } = useTranslation(currentLanguage);
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');

  const marketData = {
    prices: [
      { crop: 'Rice', currentPrice: 2850, change: +5.2, trend: 'up', demand: 'High' },
      { crop: 'Wheat', currentPrice: 2100, change: -2.1, trend: 'down', demand: 'Medium' },
      { crop: 'Cotton', currentPrice: 5200, change: +8.7, trend: 'up', demand: 'High' },
      { crop: 'Maize', currentPrice: 1800, change: +3.4, trend: 'up', demand: 'Medium' },
      { crop: 'Sugarcane', currentPrice: 280, change: -1.5, trend: 'down', demand: 'Low' }
    ],
    regions: [
      { state: 'Punjab', production: 95, efficiency: 92, trend: 'stable' },
      { state: 'Uttar Pradesh', production: 88, efficiency: 85, trend: 'up' },
      { state: 'Haryana', production: 90, efficiency: 89, trend: 'up' },
      { state: 'Rajasthan', production: 75, efficiency: 78, trend: 'down' },
      { state: 'Gujarat', production: 82, efficiency: 86, trend: 'up' }
    ]
  };

  const weatherData = {
    temperature: { current: 28, forecast: 'Increasing', impact: 'Positive' },
    rainfall: { current: 45, forecast: 'Good', impact: 'Positive' },
    humidity: { current: 68, forecast: 'Stable', impact: 'Neutral' },
    windSpeed: { current: 12, forecast: 'Moderate', impact: 'Positive' }
  };

  const cropRecommendations = [
    {
      crop: 'Basmati Rice',
      region: 'Punjab, Haryana',
      season: 'Kharif',
      profitability: 'High',
      riskLevel: 'Low',
      marketDemand: 'Export Quality'
    },
    {
      crop: 'Organic Wheat',
      region: 'Madhya Pradesh',
      season: 'Rabi',
      profitability: 'Medium',
      riskLevel: 'Low',
      marketDemand: 'Growing'
    },
    {
      crop: 'Cotton (BT)',
      region: 'Gujarat, Maharashtra',
      season: 'Kharif',
      profitability: 'High',
      riskLevel: 'Medium',
      marketDemand: 'Stable'
    }
  ];

  const timeframes = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <span className="w-4 h-4 text-gray-500">→</span>;
    }
  };

  const getTrendColor = (change: number) => {
    return change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600';
  };

  const getProfitabilityColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'High': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div id="analytics" className="py-20 bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('analyticsTitle')}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('analyticsSubtitle')}</p>
        </div>

        {/* Time Filter */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <Calendar className="w-6 h-6 mr-2" />
              {t('analyticsDashboard')}
            </h3>
            <div className="flex items-center space-x-2">
              {timeframes.map((timeframe) => (
                <button
                  key={timeframe.value}
                  onClick={() => setSelectedTimeframe(timeframe.value)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedTimeframe === timeframe.value
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-indigo-100'
                  }`}
                >
                  {timeframe.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Market Prices */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <DollarSign className="w-6 h-6 mr-2" />
                {t('currentMarketPrices')}
              </h3>
              
              <div className="space-y-4">
                {marketData.prices.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Leaf className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{item.crop}</div>
                        <div className="text-sm text-gray-600">Demand: {item.demand}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">₹{item.currentPrice.toLocaleString()}</div>
                      <div className={`flex items-center text-sm ${getTrendColor(item.change)}`}>
                        {getTrendIcon(item.trend)}
                        <span className="ml-1">{item.change > 0 ? '+' : ''}{item.change}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Regional Performance */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <Globe className="w-6 h-6 mr-2" />
                {t('regionalPerformance')}
              </h3>
              
              <div className="space-y-4">
                {marketData.regions.map((region, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold text-gray-900">{region.state}</div>
                      <div className="flex items-center">
                        {getTrendIcon(region.trend)}
                        <span className="ml-1 text-sm text-gray-600">
                          {region.trend === 'up' ? t('improving') : region.trend === 'down' ? t('declining') : t('stable')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">{t('productionIndex')}</div>
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${region.production}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm font-medium">{region.production}%</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">{t('efficiency')}</div>
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${region.efficiency}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm font-medium">{region.efficiency}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weather Impact */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">{t('weatherImpact')}</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('temperature')}</span>
                  <div className="text-right">
                    <div className="font-semibold">{weatherData.temperature.current}°C</div>
                    <div className="text-xs text-green-600">{weatherData.temperature.impact}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('rainfall')}</span>
                  <div className="text-right">
                    <div className="font-semibold">{weatherData.rainfall.current}mm</div>
                    <div className="text-xs text-green-600">{weatherData.rainfall.impact}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('humidity')}</span>
                  <div className="text-right">
                    <div className="font-semibold">{weatherData.humidity.current}%</div>
                    <div className="text-xs text-gray-600">{weatherData.humidity.impact}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('windSpeed')}</span>
                  <div className="text-right">
                    <div className="font-semibold">{weatherData.windSpeed.current} km/h</div>
                    <div className="text-xs text-green-600">{weatherData.windSpeed.impact}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                {t('topRecommendations')}
              </h3>
              
              <div className="space-y-4">
                {cropRecommendations.map((rec, index) => (
                  <div key={index} className="p-4 bg-indigo-50 rounded-lg">
                    <div className="font-semibold text-gray-900 mb-2">{rec.crop}</div>
                    <div className="text-sm text-gray-600 mb-3">{rec.region} • {rec.season}</div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProfitabilityColor(rec.profitability)}`}>
                        {rec.profitability} {t('profit')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(rec.riskLevel)}`}>
                        {rec.riskLevel} {t('risk')}
                      </span>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-600">
                      Market: {rec.marketDemand}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4">{t('platformStatistics')}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    <span>{t('activeFarmers')}</span>
                  </div>
                  <span className="font-bold">12,547</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Leaf className="w-5 h-5 mr-2" />
                    <span>{t('cropPredictions')}</span>
                  </div>
                  <span className="font-bold">3,892</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    <span>{t('successRate')}</span>
                  </div>
                  <span className="font-bold">94.8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
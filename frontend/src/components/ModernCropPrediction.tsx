import React, { useState, useEffect } from 'react';
import { useTranslation } from '../utils/translations';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useThemeColors } from '../hooks/useThemeColors';
import { 
  MapPin, Thermometer, DollarSign, Users, Leaf, Droplets,
  Wind, Sun, Cloud, Calendar, TrendingUp, AlertCircle,
  CheckCircle, Info, Sparkles, ArrowRight, Loader2,
  BarChart3, Target, Award, Globe, Zap
} from 'lucide-react';

interface CropFormData {
  location: string;
  soilType: string;
  soilPH: number;
  climate: string;
  waterAvailability: string;
  rainfall: number;
  temperature: number;
  workers: number;
  budget: number;
  farmSize: number;
}

interface CropPredictionResult {
  crop: string;
  suitability: number;
  expectedYield: string;
  profit: string;
  season: string;
  duration: string;
  waterNeed: string;
  laborNeed: string;
  marketDemand: string;
  riskFactor: string;
  description: string;
  benefits: string[];
  challenges: string[];
}

const ModernCropPrediction: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  const { isDark } = useTheme();
  const colors = useThemeColors();
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<CropPredictionResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CropFormData>({
    location: '',
    soilType: '',
    soilPH: 7,
    climate: '',
    waterAvailability: '',
    rainfall: 0,
    temperature: 0,
    workers: 0,
    budget: 0,
    farmSize: 0,
  });
  const [animatedResults, setAnimatedResults] = useState(false);

  const soilTypes = [
    { id: 'loamy', name: 'Loamy', icon: '🌱', description: 'Ideal for most crops' },
    { id: 'sandy', name: 'Sandy', icon: '🏖️', description: 'Good drainage' },
    { id: 'clay', name: 'Clay', icon: '🟫', description: 'High fertility' },
    { id: 'silty', name: 'Silty', icon: '🌾', description: 'Rich in nutrients' }
  ];

  const climateTypes = [
    { id: 'tropical', name: 'Tropical', icon: '🌴', temp: '25-35°C' },
    { id: 'dry', name: 'Dry', icon: '🏜️', temp: '20-30°C' },
    { id: 'temperate', name: 'Temperate', icon: '🌳', temp: '10-25°C' },
    { id: 'continental', name: 'Continental', icon: '❄️', temp: '5-20°C' }
  ];

  useEffect(() => {
    if (prediction) {
      setTimeout(() => setAnimatedResults(true), 100);
    }
  }, [prediction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnimatedResults(false);

    try {
      // Simulate API call with enhanced mock data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResults: CropPredictionResult[] = [
        {
          crop: 'Wheat',
          suitability: 92,
          expectedYield: '3.2 tons/hectare',
          profit: '$1,200/hectare',
          season: 'Rabi',
          duration: '120 days',
          waterNeed: 'Moderate',
          laborNeed: 'Medium',
          marketDemand: 'High',
          riskFactor: 'Low',
          description: 'Excellent choice for your soil and climate conditions',
          benefits: ['High yield potential', 'Good market price', 'Low maintenance'],
          challenges: ['Requires moderate irrigation', 'Seasonal planting']
        },
        {
          crop: 'Rice',
          suitability: 85,
          expectedYield: '4.5 tons/hectare',
          profit: '$1,500/hectare',
          season: 'Kharif',
          duration: '140 days',
          waterNeed: 'High',
          laborNeed: 'High',
          marketDemand: 'Very High',
          riskFactor: 'Medium',
          description: 'Great option with high water availability',
          benefits: ['High market demand', 'Good profit margins', 'Multiple varieties'],
          challenges: ['High water requirement', 'Labor intensive']
        },
        {
          crop: 'Corn',
          suitability: 78,
          expectedYield: '5.8 tons/hectare',
          profit: '$1,800/hectare',
          season: 'Kharif',
          duration: '110 days',
          waterNeed: 'Moderate',
          laborNeed: 'Medium',
          marketDemand: 'High',
          riskFactor: 'Low',
          description: 'Versatile crop with good returns',
          benefits: ['Fast growing', 'Multiple uses', 'Good storage'],
          challenges: ['Requires good soil fertility', 'Pest management needed']
        }
      ];
      
      setPrediction(mockResults);
    } catch (err) {
      console.error('Crop prediction error', err);
      setError('Unable to get crop recommendations right now. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CropFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const getSuitabilityColor = (suitability: number) => {
    if (suitability >= 90) return 'text-green-600 bg-green-100';
    if (suitability >= 75) return 'text-blue-600 bg-blue-100';
    if (suitability >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const renderProgressBar = (value: number, color: string) => (
    <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
      <div 
        className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
        style={{ width: animatedResults ? `${value}%` : '0%' }}
      />
    </div>
  );

  const renderStep1 = () => (
    <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-900/30 dark:via-cyan-900/30 dark:to-teal-900/30 p-8 rounded-2xl space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-black dark:text-white mb-2">Farm Location</h3>
        <p className="text-black dark:text-gray-400 font-bold">Tell us about your farm location</p>
      </div>

      <div className="space-y-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-5 rounded-xl border border-blue-200 dark:border-blue-700">
          <label className="flex items-center text-sm font-bold text-blue-950 dark:text-blue-200 mb-3">
            <MapPin className="w-4 h-4 mr-2 text-blue-800 dark:text-blue-400" />
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="w-full px-4 py-3 border-2 border-blue-500 dark:border-blue-500 rounded-xl bg-white dark:bg-gray-800 text-blue-950 dark:text-white placeholder-blue-900 dark:placeholder-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-bold shadow-md"
            placeholder="Enter your farm location"
            required
          />
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-5 rounded-xl border border-purple-200 dark:border-purple-700">
          <label className="flex items-center text-sm font-semibold text-purple-900 dark:text-purple-200 mb-3">
            <Globe className="w-4 h-4 mr-2 text-purple-700 dark:text-purple-400" />
            Farm Size
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              value={formData.farmSize || ''}
              onChange={(e) => handleInputChange('farmSize', e.target.value ? parseFloat(e.target.value) : 0)}
              className="w-full px-4 py-3 pr-16 border-2 border-purple-400 dark:border-purple-500 rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white placeholder-purple-700 dark:placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-bold shadow-md"
              placeholder="0.0"
              min="0.1"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-900 dark:text-purple-300 font-bold">
              hectares
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 p-5 rounded-xl border border-pink-200 dark:border-pink-700">
          <label className="flex items-center text-sm font-semibold text-pink-900 dark:text-pink-200 mb-3">
            <Users className="w-4 h-4 mr-2 text-pink-700 dark:text-pink-400" />
            Available Workers
          </label>
          <input
            type="number"
            value={formData.workers || ''}
            onChange={(e) => handleInputChange('workers', e.target.value ? parseInt(e.target.value) : 0)}
            className="w-full px-4 py-3 border-2 border-pink-400 dark:border-pink-500 rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white placeholder-pink-700 dark:placeholder-pink-300 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all font-bold shadow-md"
            placeholder="Number of workers"
            min="1"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="bg-gradient-to-br from-teal-50 via-blue-50 to-cyan-50 dark:from-teal-900/30 dark:via-blue-900/30 dark:to-cyan-900/30 p-8 rounded-2xl space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Leaf className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-black dark:text-white mb-2">Soil & Climate</h3>
        <p className="text-black dark:text-gray-400 font-bold">Describe your growing conditions</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="flex items-center text-sm font-semibold text-black dark:text-gray-200 mb-3">
            <Leaf className="w-4 h-4 mr-2 text-blue-600" />
            Soil Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {soilTypes.map(soil => (
              <button
                key={soil.id}
                type="button"
                onClick={() => handleInputChange('soilType', soil.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.soilType === soil.id
                    ? 'border-blue-500 bg-white dark:bg-gray-800'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="text-2xl mb-1">{soil.icon}</div>
                <div className="font-bold text-black dark:text-white">{soil.name}</div>
                <div className="text-xs text-black dark:text-gray-400 font-bold">{soil.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center text-sm font-semibold text-black dark:text-gray-200 mb-3">
            <Cloud className="w-4 h-4 mr-2 text-blue-600" />
            Climate Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {climateTypes.map(climate => (
              <button
                key={climate.id}
                type="button"
                onClick={() => handleInputChange('climate', climate.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.climate === climate.id
                    ? 'border-cyan-500 bg-white dark:bg-gray-800'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="text-2xl mb-1">{climate.icon}</div>
                <div className="font-bold text-black dark:text-white">{climate.name}</div>
                <div className="text-xs text-black dark:text-gray-400 font-bold">{climate.temp}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="flex items-center text-sm font-semibold text-black dark:text-gray-200 mb-3">
            <Thermometer className="w-4 h-4 mr-2 text-blue-600" />
            Soil pH Level: <span className="ml-2 text-blue-600 dark:text-blue-400 font-bold">{formData.soilPH.toFixed(1)}</span>
          </label>
          <input
            type="range"
            min="4"
            max="10"
            step="0.1"
            value={formData.soilPH}
            onChange={(e) => handleInputChange('soilPH', parseFloat(e.target.value))}
            className="w-full h-3 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-black dark:text-gray-400 font-bold mt-2">
            <span>Acidic (4.0)</span>
            <span>Neutral (7.0)</span>
            <span>Alkaline (10.0)</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-rose-900/30 p-8 rounded-2xl space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <DollarSign className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-black dark:text-white mb-2">Resources & Budget</h3>
        <p className="text-black dark:text-gray-400 font-bold">Final details for accurate predictions</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="flex items-center text-sm font-semibold text-black dark:text-gray-200 mb-3">
            <Droplets className="w-4 h-4 mr-2 text-purple-600" />
            Annual Rainfall (mm)
          </label>
          <input
            type="number"
            value={formData.rainfall || ''}
            onChange={(e) => handleInputChange('rainfall', e.target.value ? parseInt(e.target.value) : 0)}
            className="w-full px-4 py-3 border-2 border-purple-300 dark:border-purple-600 rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white placeholder-purple-500 dark:placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-bold"
            placeholder="Annual rainfall in millimeters"
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-semibold text-black dark:text-gray-200 mb-3">
            <Thermometer className="w-4 h-4 mr-2 text-purple-600" />
            Average Temperature (°C)
          </label>
          <input
            type="number"
            value={formData.temperature || ''}
            onChange={(e) => handleInputChange('temperature', e.target.value ? parseInt(e.target.value) : 0)}
            className="w-full px-4 py-3 border-2 border-purple-300 dark:border-purple-600 rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white placeholder-purple-500 dark:placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-bold"
            placeholder="Average temperature"
          />
        </div>

        <div>
          <label className="flex items-center text-sm font-semibold text-black dark:text-gray-200 mb-3">
            <DollarSign className="w-4 h-4 mr-2 text-green-600" />
            Budget (₹)
          </label>
          <input
            type="number"
            value={formData.budget || ''}
            onChange={(e) => handleInputChange('budget', e.target.value ? parseInt(e.target.value) : 0)}
            className="w-full px-4 py-3 border-2 border-purple-300 dark:border-purple-600 rounded-xl bg-white dark:bg-gray-800 text-black dark:text-white placeholder-purple-500 dark:placeholder-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-bold"
            placeholder="Your farming budget"
          />
        </div>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-teal-900/30 p-8 rounded-2xl space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-black dark:text-white mb-2">Recommended Crops</h3>
        <p className="text-black dark:text-gray-400 max-w-2xl mx-auto font-bold">AI-powered recommendations based on your farm data</p>
      </div>

      <div className="space-y-4">
        {prediction?.map((crop, index) => (
          <div 
            key={index} 
            className={`bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-emerald-100 dark:border-emerald-900/30 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 transform hover:border-emerald-300 dark:hover:border-emerald-700 group ${
              animatedResults ? 'animate-slideUp' : 'opacity-0'
            }`}
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
          >
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Leaf className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-black dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{crop.crop}</h4>
                    <p className="text-black dark:text-gray-400 text-sm mt-1 font-bold">{crop.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      {renderProgressBar(crop.suitability, 'bg-gradient-to-r from-green-400 to-emerald-500')}
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getSuitabilityColor(crop.suitability)} shadow-sm`}>
                        {crop.suitability}% Match
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{crop.profit}</div>
                  <div className="text-sm text-black dark:text-gray-400 font-bold">Expected Profit</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-3 text-center hover:shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer">
                  <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                  <div className="font-bold text-blue-600 dark:text-blue-400 text-sm">{crop.expectedYield}</div>
                  <div className="text-xs text-blue-700 dark:text-blue-300">Expected Yield</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-3 text-center hover:shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer">
                  <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                  <div className="font-bold text-purple-600 dark:text-purple-400 text-sm">{crop.duration}</div>
                  <div className="text-xs text-purple-700 dark:text-purple-300">Duration</div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-3 text-center hover:shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer">
                  <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400 mx-auto mb-1" />
                  <div className="font-bold text-orange-600 dark:text-orange-400 text-sm">{crop.marketDemand}</div>
                  <div className="text-xs text-orange-700 dark:text-orange-300">Market Demand</div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-3 text-center hover:shadow-md transition-all duration-300 transform hover:scale-105 cursor-pointer">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mx-auto mb-1" />
                  <div className={`font-bold text-sm ${getRiskColor(crop.riskFactor)}`}>{crop.riskFactor}</div>
                  <div className="text-xs text-red-700 dark:text-red-300">Risk Level</div>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <h5 className="font-bold text-black dark:text-white mb-2 flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mr-2" />
                      Benefits
                    </h5>
                    <ul className="space-y-1">
                      {crop.benefits.map((benefit, idx) => (
                        <li key={idx} className="text-sm text-black dark:text-gray-300 font-bold flex items-center">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                    <h5 className="font-bold text-black dark:text-white mb-2 flex items-center">
                      <Info className="w-4 h-4 text-orange-600 dark:text-orange-400 mr-2" />
                      Considerations
                    </h5>
                    <ul className="space-y-1">
                      {crop.challenges.map((challenge, idx) => (
                        <li key={idx} className="text-sm text-black dark:text-gray-300 font-bold flex items-center">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-800 dark:text-green-300 shadow-sm">
                    <Calendar className="w-3 h-3 mr-1" />
                    {crop.season} Season
                  </span>
                  <button className="bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 text-white px-6 py-2 rounded-xl hover:from-green-600 hover:to-emerald-600 dark:hover:from-green-700 dark:hover:to-emerald-700 transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 font-semibold">
                    <Zap className="w-4 h-4" />
                    <span>Select This Crop</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${colors.bg.primary} text-black dark:text-white`}>
      {/* Header */}
      <div className={`${colors.bg.primary} border-b ${colors.border.primary}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-pink-400">AI Crop Prediction</h1>
            </div>
            <p className="text-black dark:text-gray-400 max-w-2xl mx-auto">
              Get personalized crop recommendations powered by advanced AI algorithms and real-time agricultural data
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      {!prediction && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  currentStep >= step
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-gray-300'
                }`}>
                  {currentStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                <div className={`flex-1 h-1 mx-4 ${
                  currentStep > step ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gray-300 dark:bg-gray-700'
                }`} />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-black dark:text-gray-400 font-bold">
            <span>Location</span>
            <span>Soil & Climate</span>
            <span>Resources</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="max-w-2xl mx-auto">
            <div className={`${colors.bg.card} rounded-2xl shadow-lg p-8 border ${colors.border.primary}`}>
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-black dark:text-white mb-2">Analyzing Your Farm Data</h3>
                <p className="text-black dark:text-gray-400 mb-6">Our AI is processing your information to generate personalized recommendations</p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-black dark:text-gray-300 font-bold">Analyzing soil composition</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-black dark:text-gray-300 font-bold">Evaluating climate conditions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    <span className="text-black dark:text-gray-300 font-bold">Calculating crop suitability...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : prediction ? (
          renderResults()
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className={`${colors.bg.card} rounded-2xl shadow-lg p-8 border ${colors.border.primary}`}>
              <form onSubmit={handleSubmit} className="space-y-8">
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}

                <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                      currentStep === 1
                        ? 'bg-gray-100 text-gray-600 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                        : 'bg-gradient-to-r from-orange-400 to-amber-400 text-black hover:from-orange-500 hover:to-amber-500 dark:from-orange-600 dark:to-amber-600 dark:text-white dark:hover:from-orange-700 dark:hover:to-amber-700 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
                    }`}
                  >
                    Previous
                  </button>

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all flex items-center space-x-2 font-bold"
                    >
                      Next Step
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all flex items-center space-x-2 font-bold"
                    >
                      <Sparkles className="w-4 h-4" />
                      Get Recommendations
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto mt-6">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span className="text-red-700 dark:text-red-300 font-bold">{error}</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 50%;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slideUp { animation: slideUp 0.6s ease-out forwards; }
        .animate-fadeInScale { animation: fadeInScale 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ModernCropPrediction;

import React, { useState } from 'react';
import { useTranslation } from '../utils/translations';
import { ML_SERVICE_URL } from '../config/api';
import { MapPin, Thermometer, DollarSign, Users, Leaf } from 'lucide-react';

interface CropPredictionProps {
  currentLanguage: string;
}

interface CropFormData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  pH: number;
  rainfall: number;
}

interface CropPredictionResult {
  recommended_crop: string;
  confidence: number;
  all_predictions: { [key: string]: number };
  timestamp: string;
}

interface PredictionDisplay {
  crop: string;
  suitability: number;
  confidence: number;
  expectedYield: string;
  profit: string;
  season: string;
  duration: string;
  waterNeed: string;
  laborNeed: string;
  marketDemand: string;
  riskFactor: string;
}

const CropPrediction: React.FC<CropPredictionProps> = ({ currentLanguage }) => {
  const { t } = useTranslation(currentLanguage);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionDisplay[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CropFormData>({
    nitrogen: 50,
    phosphorus: 50,
    potassium: 50,
    temperature: 25,
    humidity: 60,
    pH: 7,
    rainfall: 200,
  });

  // Input ranges for validation
  const inputRanges = {
    nitrogen: { min: 0, max: 200, label: 'Nitrogen (mg/kg)' },
    phosphorus: { min: 0, max: 150, label: 'Phosphorus (mg/kg)' },
    potassium: { min: 0, max: 200, label: 'Potassium (mg/kg)' },
    temperature: { min: -20, max: 50, label: 'Temperature (°C)' },
    humidity: { min: 0, max: 100, label: 'Humidity (%)' },
    pH: { min: 0, max: 14, label: 'pH Level' },
    rainfall: { min: 0, max: 3000, label: 'Rainfall (mm)' }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate input ranges
      const errors: string[] = [];
      Object.entries(inputRanges).forEach(([key, range]) => {
        const value = formData[key as keyof CropFormData];
        if (value < range.min || value > range.max) {
          errors.push(`${range.label} must be between ${range.min} and ${range.max}`);
        }
      });

      if (errors.length > 0) {
        setError(errors.join('\n'));
        setLoading(false);
        return;
      }

      const requestBody = {
        N: formData.nitrogen,
        P: formData.phosphorus,
        K: formData.potassium,
        temperature: formData.temperature,
        humidity: formData.humidity,
        pH: formData.pH,
        rainfall: formData.rainfall
      };
      
      console.log('🌾 [CropPrediction] 📦 Request Body:', requestBody);
      const mlEndpoint = `${ML_SERVICE_URL}/predict-crop`;
      console.log('🌾 [CropPrediction] 📡 API Endpoint:', mlEndpoint);
      console.log('🌾 [CropPrediction] ⏳ Sending request...');

      const res = await fetch(mlEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      console.log('🌾 [CropPrediction] ✅ API Response received');
      console.log('🌾 [CropPrediction] 📋 Response Status:', res.status, res.statusText);
      console.log('🌾 [CropPrediction] 📋 Response Headers:', {
        contentType: res.headers.get('content-type'),
        contentLength: res.headers.get('content-length')
      });
      
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error('🌾 [CropPrediction] ❌ API Error Response:', data);
        throw new Error(data?.detail || 'Prediction failed');
      }

      const data: CropPredictionResult = await res.json();
      console.log('🌾 [CropPrediction] 📦 Full API Response Data:', data);
      console.log('🌾 [CropPrediction] 📋 All Predictions (raw):', data.all_predictions);
      
      // Convert response to array format for display
      const sortedPredictions = Object.entries(data.all_predictions || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([crop, confidence]) => ({
          crop: crop.charAt(0).toUpperCase() + crop.slice(1),
          suitability: Math.round(confidence * 100),
          confidence: confidence,
          expectedYield: 'Based on inputs',
          profit: 'Estimated',
          season: 'Recommended',
          duration: 'Check climate',
          waterNeed: formData.humidity > 70 ? 'Low' : 'Medium',
          laborNeed: 'Standard',
          marketDemand: 'High',
          riskFactor: confidence > 0.8 ? 'Low' : 'Medium'
        }));

      console.log('🌾 [CropPrediction] 🔄 Processed Predictions (Top 5):', sortedPredictions);
      console.table(sortedPredictions.map(p => ({
        crop: p.crop,
        suitability: p.suitability + '%',
        confidence: (p.confidence * 100).toFixed(2) + '%'
      })));
      
      setPrediction(sortedPredictions);
      console.log('🌾 [CropPrediction] ✅ Prediction successful! Data set to state.');
    } catch (err) {
      console.error('🌾 [CropPrediction] ❌ Error:', err);
      if (err instanceof Error) {
        console.error('🌾 [CropPrediction] Error Message:', err.message);
        console.error('🌾 [CropPrediction] Error Stack:', err.stack);
      }
      setError('Unable to get crop recommendations. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getProgressBarStyle = (percentage: number): React.CSSProperties => ({
    '--progress-width': `${Math.min(100, percentage)}%`,
  } as React.CSSProperties);

  // ...existing code...

  const handleInputChange = (field: keyof CropFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div id="prediction" className="py-20 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('cropPredictionTitle')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('cropPredictionSubtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Nitrogen Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nitrogen (N) - mg/kg
                    <span className="text-xs text-gray-500 ml-1">Min: 0, Max: 200</span>
                  </label>
                  <input
                    type="number"
                    value={formData.nitrogen}
                    onChange={(e) => handleInputChange('nitrogen', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                    max="200"
                    step="1"
                    title="Nitrogen level in mg/kg (0-200)"
                    aria-label="Nitrogen level in mg/kg"
                    required
                  />
                </div>

                {/* Phosphorus Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phosphorus (P) - mg/kg
                    <span className="text-xs text-gray-500 ml-1">Min: 0, Max: 150</span>
                  </label>
                  <input
                    type="number"
                    value={formData.phosphorus}
                    onChange={(e) => handleInputChange('phosphorus', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                    max="150"
                    step="1"
                    title="Phosphorus level in mg/kg (0-150)"
                    aria-label="Phosphorus level in mg/kg"
                    required
                  />
                </div>

                {/* Potassium Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Potassium (K) - mg/kg
                    <span className="text-xs text-gray-500 ml-1">Min: 0, Max: 200</span>
                  </label>
                  <input
                    type="number"
                    value={formData.potassium}
                    onChange={(e) => handleInputChange('potassium', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                    max="200"
                    step="1"
                    title="Potassium level in mg/kg (0-200)"
                    aria-label="Potassium level in mg/kg"
                    required
                  />
                </div>

                {/* Temperature Input */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Thermometer className="w-4 h-4 mr-2" />
                    Temperature (°C)
                    <span className="text-xs text-gray-500 ml-1">Min: -20, Max: 50</span>
                  </label>
                  <input
                    type="number"
                    value={formData.temperature}
                    onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="-20"
                    max="50"
                    step="0.1"
                    title="Temperature in degrees Celsius (-20 to 50)"
                    aria-label="Temperature in degrees Celsius"
                    required
                  />
                </div>

                {/* Humidity Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Humidity (%)
                    <span className="text-xs text-gray-500 ml-1">Min: 0, Max: 100</span>
                  </label>
                  <input
                    type="number"
                    value={formData.humidity}
                    onChange={(e) => handleInputChange('humidity', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                    max="100"
                    step="1"
                    title="Relative humidity percentage (0-100)"
                    aria-label="Humidity percentage"
                    required
                  />
                </div>

                {/* pH Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Soil pH Level
                    <span className="text-xs text-gray-500 ml-1">Min: 0, Max: 14</span>
                  </label>
                  <input
                    type="number"
                    value={formData.pH}
                    onChange={(e) => handleInputChange('pH', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                    max="14"
                    step="0.1"
                    title="Soil pH level (0-14)"
                    aria-label="Soil pH level"
                    required
                  />
                </div>

                {/* Rainfall Input */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Rainfall (mm)
                    <span className="text-xs text-gray-500 ml-1">Min: 0, Max: 3000</span>
                  </label>
                  <input
                    type="number"
                    value={formData.rainfall}
                    onChange={(e) => handleInputChange('rainfall', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                    max="3000"
                    step="10"
                    title="Annual rainfall in millimeters (0-3000)"
                    aria-label="Annual rainfall in millimeters"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700 whitespace-pre-line">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-500 text-white py-4 rounded-lg hover:bg-green-600 transition-colors font-semibold text-lg disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                    {t('analyzing')}
                  </div>
                ) : (
                  t('getCropRecommendations')
                )}
              </button>
            </form>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {loading && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center">
                  <div className="animate-pulse space-y-4">
                    <div className="w-16 h-16 bg-green-200 rounded-full mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  </div>
                  <p className="text-lg text-gray-600 mt-4">
                    {t('analyzingDataLong')}
                  </p>
                </div>
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-4">
                {error}
              </div>
            )}
            {prediction && !error && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {t('recommendedCrops')}
                </h3>
                {prediction.map((crop: PredictionDisplay, index: number) => (
                  <div key={index} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Leaf className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-900">{crop.crop}</h4>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-xs overflow-hidden">
                              {/* Dynamic width for progress bar - CSS custom property in style is necessary */}
                              <div 
                                className="progress-bar-fill"
                                style={getProgressBarStyle(crop.suitability)}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-green-600 whitespace-nowrap">
                              {crop.suitability}% Match
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4 flex-shrink-0">
                        <div className="text-2xl font-bold text-green-600">{Math.round(crop.confidence * 100)}%</div>
                        <div className="text-sm text-gray-500">{t('confidence')}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="font-semibold text-blue-600">{crop.season}</div>
                        <div className="text-xs text-blue-500">{t('seasonLabel')}</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="font-semibold text-purple-600">{crop.waterNeed}</div>
                        <div className="text-xs text-purple-500">{t('waterNeedLabel')}</div>
                      </div>
                      <div className="text-center p-3 bg-orange-50 rounded-lg">
                        <div className="font-semibold text-orange-600">{crop.marketDemand}</div>
                        <div className="text-xs text-orange-500">{t('marketDemandLabel')}</div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="font-semibold text-red-600">{crop.riskFactor}</div>
                        <div className="text-xs text-red-500">{t('riskLevelLabel')}</div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {crop.laborNeed} Labor Requirement
                      </span>
                      <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors">
                        {t('selectThisCrop')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropPrediction;
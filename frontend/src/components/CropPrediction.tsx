import React, { useState } from 'react';
import { useTranslation } from '../utils/translations';

interface CropPredictionProps {
  currentLanguage: string;
}
import { MapPin, Thermometer, DollarSign, Users, Leaf } from 'lucide-react';

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
}

const CropPrediction: React.FC<CropPredictionProps> = ({ currentLanguage }) => {
  const { t } = useTranslation(currentLanguage);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<CropPredictionResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
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

  // Dummy keys for select options
  const soilTypeKeys = ['Loamy', 'Sandy', 'Clay', 'Silty'];
  const climateTypeKeys = ['Tropical', 'Dry', 'Temperate', 'Continental', 'Polar'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:8000/crop/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.detail || 'Prediction failed');
      }

      const data: CropPredictionResult[] = await res.json();
      setPrediction(data);
    } catch (err) {
      console.error('Crop prediction error', err);
      setError('Unable to get crop recommendations right now. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
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
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    {t('location')}
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder={t('location')}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('soilType')}
                  </label>
                  <select
                    value={formData.soilType}
                    onChange={(e) => handleInputChange('soilType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    aria-label="Soil type"
                    title="Soil type"
                    required
                  >
                    <option value="">{t('soilType')}</option>
                    {soilTypeKeys.map(key => (
                      <option key={key} value={key}>{t(key)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('soilPHLabel')} ({formData.soilPH})
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="10"
                    step="0.1"
                    value={formData.soilPH}
                    onChange={(e) => handleInputChange('soilPH', parseFloat(e.target.value))}
                    className="w-full"
                    aria-label="Soil pH"
                    title="Soil pH"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>{t('acidicLabel')}</span>
                    <span>{t('neutralLabel')}</span>
                    <span>{t('alkalineLabel')}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('climate')}
                  </label>
                  <select
                    value={formData.climate}
                    onChange={(e) => handleInputChange('climate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    aria-label="Climate type"
                    title="Climate type"
                    required
                  >
                    <option value="">{t('climate')}</option>
                    {climateTypeKeys.map(key => (
                      <option key={key} value={key}>{t(key)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('annualRainfall')}
                  </label>
                  <input
                    type="number"
                    value={formData.rainfall}
                    onChange={(e) => handleInputChange('rainfall', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder={t('annualRainfall')}
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Thermometer className="w-4 h-4 mr-2" />
                    {t('avgTemperature')}
                  </label>
                  <input
                    type="number"
                    value={formData.temperature}
                    onChange={(e) => handleInputChange('temperature', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder={t('avgTemperature')}
                    aria-label={t('avgTemperature')}
                    title={t('avgTemperature')}
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Users className="w-4 h-4 mr-2" />
                    {t('availableWorkers')}
                  </label>
                  <input
                    type="number"
                    value={formData.workers}
                    onChange={(e) => handleInputChange('workers', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="1"
                    aria-label="Available workers"
                    title="Available workers"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 mr-2" />
                    {t('budgetCurrency')}
                  </label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder={t('budgetCurrency')}
                    aria-label={t('budgetCurrency')}
                    title={t('budgetCurrency')}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('farmSizeHectares')}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.farmSize}
                    onChange={(e) => handleInputChange('farmSize', parseFloat(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0.1"
                    aria-label={t('farmSizeHectares')}
                    title={t('farmSizeHectares')}
                    required
                  />
                </div>
              </div>

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
                {prediction.map((crop: CropPredictionResult, index: number) => (
                  <div key={index} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <Leaf className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">{crop.crop}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className={`bg-green-500 h-2 rounded-full transition-all duration-1000 w-[${crop.suitability}%]`}></div>
                            </div>
                            <span className="text-sm font-medium text-green-600">
                              {crop.suitability}% Match
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{crop.profit}</div>
                        <div className="text-sm text-gray-500">{t('expectedProfit')}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="font-semibold text-blue-600">{crop.expectedYield}</div>
                        <div className="text-xs text-blue-500">{t('expectedYield')}</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="font-semibold text-purple-600">{crop.duration}</div>
                        <div className="text-xs text-purple-500">{t('durationLabel')}</div>
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
                        {crop.season} {t('seasonLabel')}
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
# Frontend Integration Guide - ML API Services

## Overview

This guide helps frontend developers integrate the AgriSmart ML API services into React/TypeScript components.

---

## Table of Contents

1. [Setup & Configuration](#setup--configuration)
2. [API Client Setup](#api-client-setup)
3. [Crop Prediction Integration](#crop-prediction-integration)
4. [Disease Detection Integration](#disease-detection-integration)
5. [Weather Intelligence Integration](#weather-intelligence-integration)
6. [Market Price Integration](#market-price-integration)
7. [Error Handling](#error-handling)
8. [Loading States](#loading-states)
9. [Caching Strategy](#caching-strategy)

---

## Setup & Configuration

### Environment Variables

Update `frontend/.env.local`:

```env
# ML Service
VITE_ML_API_URL=http://localhost:8000
VITE_ML_API_TOKEN=your_api_token_here
VITE_API_TIMEOUT=30000

# Feature Flags
VITE_ENABLE_ML_FEATURES=true
VITE_CACHE_PREDICTIONS=true
VITE_CACHE_TTL=3600000
```

### Install Dependencies

```bash
cd frontend
npm install axios react-query zustand
```

---

## API Client Setup

### Create `src/services/mlApiClient.ts`

```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';

interface MLApiConfig {
  baseURL: string;
  token: string;
  timeout: number;
}

export class MLApiClient {
  private client: AxiosInstance;

  constructor(config: MLApiConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.token}`
      }
    });

    // Add response interceptor
    this.client.interceptors.response.use(
      response => response,
      error => this.handleError(error)
    );
  }

  private handleError(error: AxiosError) {
    if (error.response?.status === 401) {
      // Token expired - refresh token logic
      console.error('Authentication failed');
    }
    if (error.response?.status === 429) {
      // Rate limited
      console.warn('Rate limit exceeded');
    }
    return Promise.reject(error);
  }

  async predictCrop(inputs: CropPredictionInput): Promise<CropPredictionResponse> {
    const response = await this.client.post('/ml/predict-crop', inputs);
    return response.data;
  }

  async detectDisease(file: File): Promise<DiseaseDetectionResponse> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await this.client.post('/ml/detect-disease', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async getWeatherAdvice(params: WeatherParams): Promise<WeatherResponse> {
    const response = await this.client.get('/weather/advice', { params });
    return response.data;
  }

  async predictPrice(crop: string, price: number): Promise<PriceResponse> {
    const response = await this.client.get('/market/predict-price', {
      params: { crop, current_price: price }
    });
    return response.data;
  }

  async checkHealth(): Promise<HealthResponse> {
    const response = await this.client.get('/health');
    return response.data;
  }
}

// Types
export interface CropPredictionInput {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
}

export interface CropPredictionResponse {
  recommended_crops: string[];
  confidence_scores: number[];
  yield_estimation_kg_per_hectare: number;
  profit_estimation_per_hectare: number;
  timestamp: string;
}

export interface DiseaseDetectionResponse {
  crop_type: string;
  disease_name: string;
  confidence: number;
  severity_level: string;
  symptoms: string[];
  causes: string[];
  treatment_recommendations: string[];
  organic_solutions: string[];
  timestamp: string;
}

export interface WeatherParams {
  latitude: number;
  longitude: number;
  temperature?: number;
  rainfall_forecast?: number;
  humidity?: number;
}

export interface WeatherResponse {
  location: string;
  temperature: number;
  rainfall_forecast: number;
  humidity: number;
  farming_advice: string;
  recommendation_level: 'optimal' | 'caution' | 'warning';
  timestamp: string;
}

export interface PriceResponse {
  crop: string;
  current_price: number;
  predicted_price_next_week: number;
  price_trend: 'up' | 'down' | 'stable';
  recommendation: string;
  timestamp: string;
}

export interface HealthResponse {
  status: string;
  service: string;
  crop_predictor_ready: boolean;
  disease_detector_ready: boolean;
  timestamp: string;
}
```

### Create `src/hooks/useMLApi.ts`

```typescript
import { useMutation, useQuery } from 'react-query';
import { MLApiClient, CropPredictionInput } from '../services/mlApiClient';
import { useCallback } from 'react';

const mlClient = new MLApiClient({
  baseURL: import.meta.env.VITE_ML_API_URL,
  token: import.meta.env.VITE_ML_API_TOKEN,
  timeout: import.meta.env.VITE_API_TIMEOUT || 30000
});

export const useCropPrediction = () => {
  return useMutation(
    (inputs: CropPredictionInput) => mlClient.predictCrop(inputs),
    {
      onError: (error) => {
        console.error('Crop prediction failed:', error);
      }
    }
  );
};

export const useDiseaseDetection = () => {
  return useMutation(
    (file: File) => mlClient.detectDisease(file),
    {
      onError: (error) => {
        console.error('Disease detection failed:', error);
      }
    }
  );
};

export const useWeatherAdvice = (latitude?: number, longitude?: number) => {
  return useQuery(
    ['weatherAdvice', latitude, longitude],
    () => mlClient.getWeatherAdvice({ latitude: latitude!, longitude: longitude! }),
    {
      enabled: latitude !== undefined && longitude !== undefined,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000 // 10 minutes
    }
  );
};

export const usePricePrediction = (crop: string, price: number) => {
  return useQuery(
    ['pricePrediction', crop, price],
    () => mlClient.predictPrice(crop, price),
    {
      enabled: !!crop && price > 0,
      staleTime: 30 * 60 * 1000 // 30 minutes
    }
  );
};

export const useMLHealth = () => {
  return useQuery(
    ['mlHealth'],
    () => mlClient.checkHealth(),
    {
      staleTime: 60 * 1000, // 1 minute
      refetchInterval: 5 * 60 * 1000 // Refetch every 5 minutes
    }
  );
};
```

---

## Crop Prediction Integration

### Component: `src/components/CropPredictionForm.tsx`

```typescript
import React, { useState } from 'react';
import { useCropPrediction } from '../hooks/useMLApi';
import { CropPredictionInput } from '../services/mlApiClient';

export const CropPredictionForm: React.FC = () => {
  const [inputs, setInputs] = useState<CropPredictionInput>({
    nitrogen: 90,
    phosphorus: 40,
    potassium: 40,
    temperature: 20,
    humidity: 80,
    ph: 6.5,
    rainfall: 200
  });

  const { mutate, isLoading, data, error } = useCropPrediction();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(inputs);
  };

  return (
    <div className="crop-prediction-form">
      <h2>Crop Recommendation</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="nitrogen"
            label="Nitrogen (mg/kg)"
            value={inputs.nitrogen}
            onChange={handleChange}
            min="0"
            max="200"
          />
          <input
            type="number"
            name="phosphorus"
            label="Phosphorus (mg/kg)"
            value={inputs.phosphorus}
            onChange={handleChange}
            min="0"
            max="150"
          />
          <input
            type="number"
            name="potassium"
            label="Potassium (mg/kg)"
            value={inputs.potassium}
            onChange={handleChange}
            min="0"
            max="200"
          />
          <input
            type="number"
            name="temperature"
            label="Temperature (°C)"
            value={inputs.temperature}
            onChange={handleChange}
            min="-20"
            max="50"
          />
          <input
            type="number"
            name="humidity"
            label="Humidity (%)"
            value={inputs.humidity}
            onChange={handleChange}
            min="0"
            max="100"
          />
          <input
            type="number"
            name="ph"
            label="Soil pH"
            value={inputs.ph}
            onChange={handleChange}
            min="0"
            max="14"
            step="0.1"
          />
          <input
            type="number"
            name="rainfall"
            label="Rainfall (mm)"
            value={inputs.rainfall}
            onChange={handleChange}
            min="0"
            max="3000"
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Predicting...' : 'Get Crop Recommendations'}
        </button>
      </form>

      {error && (
        <div className="error-alert">
          {error instanceof Error ? error.message : 'Prediction failed'}
        </div>
      )}

      {data && (
        <div className="results mt-6">
          <h3>Recommended Crops</h3>
          {data.recommended_crops.map((crop, idx) => (
            <div key={crop} className="crop-card">
              <h4>{crop.toUpperCase()}</h4>
              <p>Confidence: {(data.confidence_scores[idx] * 100).toFixed(2)}%</p>
              <p>Yield: {data.yield_estimation_kg_per_hectare.toFixed(2)} kg/ha</p>
              <p>Profit: ₹{data.profit_estimation_per_hectare.toFixed(2)}/ha</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## Disease Detection Integration

### Component: `src/components/DiseaseDetector.tsx`

```typescript
import React, { useRef, useState } from 'react';
import { useDiseaseDetection } from '../hooks/useMLApi';

export const DiseaseDetector: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { mutate, isLoading, data, error } = useDiseaseDetection();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to ML service
      mutate(file);
    }
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="disease-detector">
      <h2>Disease Detection</h2>

      <div className="upload-area" onClick={handleUpload}>
        {preview ? (
          <img src={preview} alt="Preview" className="preview-image" />
        ) : (
          <div className="upload-placeholder">
            <p>Click to upload plant leaf image</p>
            <small>JPG, PNG, GIF - Max 10MB</small>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {isLoading && <p>Analyzing image...</p>}

      {error && (
        <div className="error-alert">
          {error instanceof Error ? error.message : 'Detection failed'}
        </div>
      )}

      {data && (
        <div className="disease-results mt-6">
          <h3>Detection Results</h3>
          
          <div className="result-item">
            <span className="label">Crop:</span>
            <span className="value">{data.crop_type.toUpperCase()}</span>
          </div>

          <div className="result-item">
            <span className="label">Disease:</span>
            <span className="value">{data.disease_name.replace(/_/g, ' ').toUpperCase()}</span>
          </div>

          <div className="result-item">
            <span className="label">Confidence:</span>
            <span className="value">{(data.confidence * 100).toFixed(2)}%</span>
          </div>

          <div className={`severity severity-${data.severity_level.toLowerCase()}`}>
            {data.severity_level}
          </div>

          <div className="section">
            <h4>Symptoms</h4>
            <ul>
              {data.symptoms.map((symptom, idx) => (
                <li key={idx}>{symptom}</li>
              ))}
            </ul>
          </div>

          <div className="section">
            <h4>Treatments</h4>
            <ul>
              {data.treatment_recommendations.map((treatment, idx) => (
                <li key={idx}>{treatment}</li>
              ))}
            </ul>
          </div>

          <div className="section">
            <h4>Organic Solutions</h4>
            <ul>
              {data.organic_solutions.map((solution, idx) => (
                <li key={idx}>{solution}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## Weather Intelligence Integration

### Component: `src/components/WeatherAdvice.tsx`

```typescript
import React, { useEffect, useState } from 'react';
import { useWeatherAdvice } from '../hooks/useMLApi';

export const WeatherAdvice: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number; long: number } | null>(null);

  // Get user's location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLocation({
            lat: position.coords.latitude,
            long: position.coords.longitude
          });
        },
        error => console.error('Error getting location:', error)
      );
    }
  }, []);

  const { data, isLoading, error } = useWeatherAdvice(location?.lat, location?.long);

  const getRecommendationColor = (level: string) => {
    switch (level) {
      case 'optimal':
        return 'bg-green-100 border-green-400';
      case 'caution':
        return 'bg-yellow-100 border-yellow-400';
      case 'warning':
        return 'bg-red-100 border-red-400';
      default:
        return 'bg-gray-100 border-gray-400';
    }
  };

  return (
    <div className="weather-advice">
      <h2>Weather Intelligence</h2>

      {isLoading && <p>Fetching weather data...</p>}

      {error && (
        <div className="error-alert">
          {error instanceof Error ? error.message : 'Failed to fetch weather'}
        </div>
      )}

      {data && (
        <div className={`weather-card p-4 border-2 rounded ${getRecommendationColor(data.recommendation_level)}`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3>Current Location</h3>
              <p className="text-sm text-gray-600">{data.location}</p>
            </div>
            <div className="alert-badge">
              {data.recommendation_level.toUpperCase()}
            </div>
          </div>

          <div className="weather-metrics grid grid-cols-3 gap-4 my-4">
            <div className="metric">
              <span className="label">Temperature</span>
              <span className="value">{data.temperature}°C</span>
            </div>
            <div className="metric">
              <span className="label">Humidity</span>
              <span className="value">{data.humidity}%</span>
            </div>
            <div className="metric">
              <span className="label">Rainfall Expected</span>
              <span className="value">{data.rainfall_forecast}mm</span>
            </div>
          </div>

          <div className="advice-section">
            <h4>Farming Advice</h4>
            <p className="text-base leading-relaxed">
              {data.farming_advice}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## Market Price Integration

### Component: `src/components/MarketPricePredictor.tsx`

```typescript
import React, { useState } from 'react';
import { usePricePrediction } from '../hooks/useMLApi';

const CROPS = ['wheat', 'rice', 'tomato', 'potato', 'maize', 'sugarcane', 'cotton', 'groundnut'];

export const MarketPricePredictor: React.FC = () => {
  const [selectedCrop, setSelectedCrop] = useState(CROPS[0]);
  const [currentPrice, setCurrentPrice] = useState(2400);

  const { data, isLoading, error } = usePricePrediction(selectedCrop, currentPrice);

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '📈';
      case 'down':
        return '📉';
      default:
        return '➡️';
    }
  };

  return (
    <div className="price-predictor">
      <h2>Market Price Prediction</h2>

      <div className="controls space-y-4">
        <div>
          <label>Select Crop</label>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="input-select"
          >
            {CROPS.map(crop => (
              <option key={crop} value={crop}>{crop.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Current Market Price (₹/kg)</label>
          <input
            type="number"
            value={currentPrice}
            onChange={(e) => setCurrentPrice(parseFloat(e.target.value))}
            className="input-number"
            min="0"
            step="10"
          />
        </div>
      </div>

      {isLoading && <p>Analyzing market trends...</p>}

      {error && (
        <div className="error-alert">
          {error instanceof Error ? error.message : 'Prediction failed'}
        </div>
      )}

      {data && (
        <div className="price-results mt-6">
          <div className="price-card">
            <div className="flex items-center justify-between">
              <div>
                <h3>{data.crop.toUpperCase()}</h3>
                <p className="text-sm text-gray-600">
                  Prediction for next 7 days
                </p>
              </div>
              <span className={`trend-badge ${getTrendColor(data.price_trend)}`}>
                {getTrendIcon(data.price_trend)}
                {data.price_trend.toUpperCase()}
              </span>
            </div>

            <div className="price-comparison mt-4 grid grid-cols-2 gap-4">
              <div className="price-item">
                <span className="label">Current Price</span>
                <span className="price">₹{data.current_price.toFixed(2)}</span>
              </div>
              <div className="price-item">
                <span className="label">Predicted Price</span>
                <span className="price">₹{data.predicted_price_next_week.toFixed(2)}</span>
              </div>
            </div>

            <div className="price-change mt-4">
              {(() => {
                const change = data.predicted_price_next_week - data.current_price;
                const changePercent = (change / data.current_price) * 100;
                return (
                  <p className={`${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {change > 0 ? '+' : ''}{change.toFixed(2)} ({changePercent > 0 ? '+' : ''}{changePercent.toFixed(2)}%)
                  </p>
                );
              })()}
            </div>

            <div className="recommendation mt-4 p-3 bg-blue-50 rounded">
              <h4 className="font-semibold mb-2">Recommendation</h4>
              <p>{data.recommendation}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
```

---

## Error Handling

### Create `src/hooks/useErrorHandler.ts`

```typescript
import { useCallback } from 'react';
import { AxiosError } from 'axios';

interface ErrorMessage {
  title: string;
  message: string;
  code?: string;
}

export const useErrorHandler = () => {
  const getErrorMessage = useCallback((error: unknown): ErrorMessage => {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401) {
        return {
          title: 'Authentication Failed',
          message: 'Please log in again',
          code: 'AUTH_ERROR'
        };
      }

      if (error.response?.status === 429) {
        return {
          title: 'Too Many Requests',
          message: 'Please wait a moment and try again',
          code: 'RATE_LIMIT'
        };
      }

      if (error.response?.status === 500) {
        return {
          title: 'Server Error',
          message: 'The service is temporarily unavailable',
          code: 'SERVER_ERROR'
        };
      }

      const detail = error.response?.data?.detail;
      return {
        title: 'Request Failed',
        message: typeof detail === 'string' ? detail : 'An error occurred',
        code: error.code
      };
    }

    if (error instanceof Error) {
      return {
        title: 'Error',
        message: error.message
      };
    }

    return {
      title: 'Unknown Error',
      message: 'An unexpected error occurred'
    };
  }, []);

  return { getErrorMessage };
};
```

---

## Loading States

### Create `src/components/LoadingSkeletons.tsx`

```typescript
import React from 'react';

export const CropPredictionSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    <div className="h-12 bg-gray-200 rounded"></div>
    <div className="grid grid-cols-3 gap-4">
      {Array(3).fill(0).map((_, i) => (
        <div key={i} className="bg-gray-200 h-32 rounded"></div>
      ))}
    </div>
  </div>
);

export const DiseaseDetectorSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    <div className="bg-gray-200 h-64 rounded"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
  </div>
);

export const WeatherAdviceSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    <div className="grid grid-cols-3 gap-4">
      {Array(3).fill(0).map((_, i) => (
        <div key={i} className="bg-gray-200 h-24 rounded"></div>
      ))}
    </div>
  </div>
);
```

---

## Caching Strategy

### Create `src/utils/cacheManager.ts`

```typescript
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class CacheManager {
  private cache = new Map<string, CacheEntry<any>>();

  set<T>(key: string, data: T, ttlMs: number = 3600000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  clear(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      return;
    }

    const regex = new RegExp(pattern);
    Array.from(this.cache.keys()).forEach(key => {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    });
  }

  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const cacheManager = new CacheManager();
```

---

## Complete Integration Example

### `src/pages/Dashboard.tsx`

```typescript
import React from 'react';
import { CropPredictionForm } from '../components/CropPredictionForm';
import { DiseaseDetector } from '../components/DiseaseDetector';
import { WeatherAdvice } from '../components/WeatherAdvice';
import { MarketPricePredictor } from '../components/MarketPricePredictor';
import { useMLHealth } from '../hooks/useMLApi';

export const Dashboard: React.FC = () => {
  const { data: healthStatus, isLoading: healthLoading } = useMLHealth();

  return (
    <div className="dashboard container mx-auto px-4 py-8">
      <h1 className="mb-8">AgriSmart ML Features</h1>

      {/* Service Health */}
      <div className="health-status mb-8">
        {!healthLoading && healthStatus && (
          <div className={`alert alert-${healthStatus.status}`}>
            <p>🔌 ML Service: <strong>{healthStatus.status.toUpperCase()}</strong></p>
            <p>✓ Crop Predictor: {healthStatus.crop_predictor_ready ? '✓' : '✗'}</p>
            <p>✓ Disease Detector: {healthStatus.disease_detector_ready ? '✓' : '✗'}</p>
          </div>
        )}
      </div>

      {/* ML Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="feature-section">
          <CropPredictionForm />
        </section>

        <section className="feature-section">
          <DiseaseDetector />
        </section>

        <section className="feature-section">
          <WeatherAdvice />
        </section>

        <section className="feature-section">
          <MarketPricePredictor />
        </section>
      </div>
    </div>
  );
};
```

---

## Testing

### `src/__tests__/mlApi.test.ts`

```typescript
import { MLApiClient } from '../services/mlApiClient';

describe('ML API Client', () => {
  let client: MLApiClient;

  beforeEach(() => {
    client = new MLApiClient({
      baseURL: 'http://localhost:8000',
      token: 'test-token',
      timeout: 30000
    });
  });

  it('should predict crops', async () => {
    const result = await client.predictCrop({
      nitrogen: 90,
      phosphorus: 40,
      potassium: 40,
      temperature: 20,
      humidity: 80,
      ph: 6.5,
      rainfall: 200
    });

    expect(result.recommended_crops).toBeDefined();
    expect(result.recommended_crops.length).toBeGreaterThan(0);
    expect(result.confidence_scores).toBeDefined();
  });

  it('should detect diseases from image', async () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const result = await client.detectDisease(file);

    expect(result.crop_type).toBeDefined();
    expect(result.disease_name).toBeDefined();
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('should get weather advice', async () => {
    const result = await client.getWeatherAdvice({
      latitude: 28.7041,
      longitude: 77.1025
    });

    expect(result.farming_advice).toBeDefined();
    expect(['optimal', 'caution', 'warning']).toContain(result.recommendation_level);
  });

  it('should predict market prices', async () => {
    const result = await client.predictPrice('wheat', 2400);

    expect(result.predicted_price_next_week).toBeDefined();
    expect(['up', 'down', 'stable']).toContain(result.price_trend);
  });
});
```

---

## Support & Resources

- 📚 Full API Docs: See `ML_API_DOCUMENTATION.md`
- 📦 API Types: Import from `src/services/mlApiClient.ts`
- 🪝 Hooks: Use from `src/hooks/useMLApi.ts`
- ✋ Components: Ready-to-use in `src/components/`

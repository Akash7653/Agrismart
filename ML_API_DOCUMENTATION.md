# AgriSmart ML Service - API Documentation

## Overview

The ML Service provides real-time machine learning inference for agricultural predictions, disease detection, weather intelligence, and market price forecasting.

**Base URL**: `http://localhost:8000` (development)  
**Production**: `https://ml.yourdomain.com`

---

## Table of Contents

1. [Authentication](#authentication)
2. [Crop Prediction API](#crop-prediction-api)
3. [Disease Detection API](#disease-detection-api)
4. [Weather Intelligence API](#weather-intelligence-api)
5. [Market Price Prediction API](#market-price-prediction-api)
6. [Health & Status](#health--status)
7. [Error Handling](#error-handling)
8. [Rate Limiting](#rate-limiting)

---

## Authentication

All requests should include authentication headers:

```bash
Authorization: Bearer YOUR_API_TOKEN
Content-Type: application/json
```

### Example Request

```bash
curl -X POST http://localhost:8000/ml/predict-crop \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nitrogen": 90,
    "phosphorus": 40,
    "potassium": 40,
    "temperature": 20,
    "humidity": 80,
    "ph": 6.5,
    "rainfall": 200
  }'
```

---

## Crop Prediction API

### POST /ml/predict-crop

Predict suitable crops for given soil and weather conditions using RandomForest + GradientBoosting ensemble model.

**Request Body:**

```json
{
  "nitrogen": 90,           // Soil nitrogen level (mg/kg), 0-200
  "phosphorus": 40,         // Soil phosphorus level (mg/kg), 0-150
  "potassium": 40,          // Soil potassium level (mg/kg), 0-200
  "temperature": 20,        // Average temperature (°C), -20 to 50
  "humidity": 80,           // Relative humidity (%), 0-100
  "ph": 6.5,                // Soil pH level, 0-14
  "rainfall": 200           // Average rainfall (mm), 0-3000
}
```

**Response (200 OK):**

```json
{
  "recommended_crops": ["rice", "maize", "wheat"],
  "confidence_scores": [0.8934, 0.7521, 0.6234],
  "yield_estimation_kg_per_hectare": 4520.50,
  "profit_estimation_per_hectare": 103012.50,
  "timestamp": "2024-03-08T12:34:56.789Z"
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| recommended_crops | array | Top 3 recommended crops |
| confidence_scores | array | Confidence score for each crop (0-1) |
| yield_estimation_kg_per_hectare | float | Expected yield per hectare in kg |
| profit_estimation_per_hectare | float | Expected profit per hectare in INR |
| timestamp | string | ISO 8601 timestamp |

### Example Usage (Python)

```python
import requests

url = "http://localhost:8000/ml/predict-crop"
headers = {
    "Authorization": "Bearer YOUR_TOKEN",
    "Content-Type": "application/json"
}

data = {
    "nitrogen": 90,
    "phosphorus": 40,
    "potassium": 40,
    "temperature": 20,
    "humidity": 80,
    "ph": 6.5,
    "rainfall": 200
}

response = requests.post(url, json=data, headers=headers)
result = response.json()

print(f"Best Crop: {result['recommended_crops'][0]}")
print(f"Confidence: {result['confidence_scores'][0]:.2%}")
print(f"Expected Yield: {result['yield_estimation_kg_per_hectare']:.2f} kg/ha")
print(f"Expected Profit: ₹{result['profit_estimation_per_hectare']:.2f}/ha")
```

### Example Usage (JavaScript)

```javascript
const predictCrop = async (inputs) => {
  const response = await fetch('http://localhost:8000/ml/predict-crop', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(inputs)
  });
  
  return response.json();
};

// Usage
const inputs = {
  nitrogen: 90,
  phosphorus: 40,
  potassium: 40,
  temperature: 20,
  humidity: 80,
  ph: 6.5,
  rainfall: 200
};

const result = await predictCrop(inputs);
console.log(`Best Crop: ${result.recommended_crops[0]}`);
console.log(`Yield: ${result.yield_estimation_kg_per_hectare} kg/ha`);
console.log(`Profit: ₹${result.profit_estimation_per_hectare}/ha`);
```

---

## Disease Detection API

### POST /ml/detect-disease

Detect plant diseases from uploaded images using CNN model trained on PlantVillage dataset.

**Request:**

```
Method: POST
URL: http://localhost:8000/ml/detect-disease
Content-Type: multipart/form-data

Parameters:
- file: Image file (JPG, PNG, GIF) - Max 10MB
```

**Response (200 OK):**

```json
{
  "crop_type": "tomato",
  "disease_name": "early_blight",
  "confidence": 0.9234,
  "severity_level": "High",
  "symptoms": [
    "Concentric rings on lower leaves",
    "Brown lesions",
    "Yellowing of leaves"
  ],
  "causes": [
    "Alternaria fungus",
    "Wet foliage",
    "Poor air circulation"
  ],
  "treatment_recommendations": [
    "Apply fungicide spray",
    "Prune lower leaves",
    "Improve ventilation"
  ],
  "organic_solutions": [
    "Copper fungicide",
    "Sulfur dust",
    "Chlorothalonil"
  ],
  "timestamp": "2024-03-08T12:34:56.789Z"
}
```

### Example Usage (Python)

```python
import requests

url = "http://localhost:8000/ml/detect-disease"
headers = {"Authorization": "Bearer YOUR_TOKEN"}

with open('tomato_leaf.jpg', 'rb') as img_file:
    files = {'file': img_file}
    response = requests.post(url, files=files, headers=headers)

result = response.json()

print(f"Crop: {result['crop_type']}")
print(f"Disease: {result['disease_name']}")
print(f"Confidence: {result['confidence']:.2%}")
print(f"Severity: {result['severity_level']}")
print(f"Treatment: {result['treatment_recommendations'][0]}")
```

### Example Usage (JavaScript)

```javascript
const detectDisease = async (imageFile) => {
  const formData = new FormData();
  formData.append('file', imageFile);
  
  const response = await fetch('http://localhost:8000/ml/detect-disease', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_TOKEN'
    },
    body: formData
  });
  
  return response.json();
};

// Usage with file input
const fileInput = document.getElementById('image-upload');
const file = fileInput.files[0];

const result = await detectDisease(file);
console.log(`Disease: ${result.disease_name}`);
console.log(`Confidence: ${(result.confidence * 100).toFixed(2)}%`);
console.log(`Treatment: ${result.treatment_recommendations[0]}`);
```

**Supported Crops:**

- Tomato
- Potato
- Rice
- Wheat

**Common Diseases:**

```
Tomato:
  - leaf_spot
  - early_blight
  - late_blight
  - powdery_mildew
  - rust
  - healthy

Potato:
  - early_blight
  - late_blight
  - healthy

Rice:
  - leaf_spot
  - rust
  - healthy

Wheat:
  - powdery_mildew
  - rust
  - healthy
```

---

## Weather Intelligence API

### GET /weather/advice

Get farming recommendations based on current weather conditions.

**Query Parameters:**

```
latitude (required): float - Location latitude (-90 to 90)
longitude (required): float - Location longitude (-180 to 180)
temperature (optional): float - Current temperature in °C
rainfall_forecast (optional): float - Expected rainfall in mm
humidity (optional): float - Relative humidity in %
```

**Request:**

```bash
GET http://localhost:8000/weather/advice?latitude=28.7041&longitude=77.1025&temperature=35&rainfall_forecast=50&humidity=65
```

**Response (200 OK):**

```json
{
  "location": "(28.7041, 77.1025)",
  "temperature": 35.0,
  "rainfall_forecast": 50.0,
  "humidity": 65.0,
  "farming_advice": "High temperature: Increase irrigation frequency. Low rainfall: Plan irrigation schedule.",
  "recommendation_level": "caution",
  "timestamp": "2024-03-08T12:34:56.789Z"
}
```

**Recommendation Levels:**

- `optimal`: Weather is favorable for farming
- `caution`:  Weather requires attention and management
- `warning`: Weather poses significant risks

### Example Usage (Python)

```python
import requests

url = "http://localhost:8000/weather/advice"
params = {
    "latitude": 28.7041,
    "longitude": 77.1025,
    "temperature": 35,
    "rainfall_forecast": 50,
    "humidity": 65
}
headers = {"Authorization": "Bearer YOUR_TOKEN"}

response = requests.get(url, params=params, headers=headers)
result = response.json()

print(f"Location: {result['location']}")
print(f"Advice: {result['farming_advice']}")
print(f"Alert Level: {result['recommendation_level'].upper()}")
```

---

## Market Price Prediction API

### GET /market/predict-price

Predict crop market prices for the next 7 days using LSTM time-series model.

**Query Parameters:**

```
crop (required): string - Crop name (wheat, rice, tomato, etc.)
current_price (required): float - Current market price in INR per kg
```

**Request:**

```bash
GET http://localhost:8000/market/predict-price?crop=wheat&current_price=2400
```

**Response (200 OK):**

```json
{
  "crop": "wheat",
  "current_price": 2400.0,
  "predicted_price_next_week": 2280.0,
  "price_trend": "down",
  "recommendation": "Consider selling - Price may decrease",
  "timestamp": "2024-03-08T12:34:56.789Z"
}
```

**Price Trends:**

- `up`: Price expected to increase (5%+)
- `down`: Price expected to decrease (5%+)
- `stable`: Price expected to remain stable

### Example Usage (Python)

```python
import requests

url = "http://localhost:8000/market/predict-price"
params = {
    "crop": "wheat",
    "current_price": 2400
}
headers = {"Authorization": "Bearer YOUR_TOKEN"}

response = requests.get(url, params=params, headers=headers)
result = response.json()

print(f"Crop: {result['crop'].upper()}")
print(f"Current Price: ₹{result['current_price']:.2f}/kg")
print(f"Predicted Price: ₹{result['predicted_price_next_week']:.2f}/kg")
print(f"Trend: {result['price_trend'].upper()}")
print(f"Recommendation: {result['recommendation']}")
```

**Supported Crops for Price Prediction:**

- wheat
- rice
- tomato
- potato
- maize
- sugarcane
- cotton
- groundnut

---

## Health & Status

### GET /health

Check ML service health and model availability.

**Response (200 OK):**

```json
{
  "status": "healthy",
  "service": "AgriSmart ML Service",
  "crop_predictor_ready": true,
  "disease_detector_ready": true,
  "timestamp": "2024-03-08T12:34:56.789Z"
}
```

### GET /

Get API information and available endpoints.

**Response (200 OK):**

```json
{
  "service": "AgriSmart ML Service",
  "version": "1.0.0",
  "endpoints": {
    "crop_prediction": "/ml/predict-crop",
    "disease_detection": "/ml/detect-disease",
    "weather_advice": "/weather/advice",
    "price_prediction": "/market/predict-price",
    "health_check": "/health",
    "docs": "/docs",
    "redoc": "/redoc"
  },
  "timestamp": "2024-03-08T12:34:56.789Z"
}
```

---

## Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "detail": "Invalid input. pH must be between 0 and 14"
}
```

**401 Unauthorized:**
```json
{
  "detail": "Invalid or missing API token"
}
```

**403 Forbidden:**
```json
{
  "detail": "Insufficient permissions"
}
```

**429 Too Many Requests:**
```json
{
  "detail": "Rate limit exceeded. Please try again later."
}
```

**500 Internal Server Error:**
```json
{
  "detail": "Prediction failed: Model inference error"
}
```

**503 Service Unavailable:**
```json
{
  "detail": "Crop prediction model not initialized"
}
```

### Error Codes

| Code | Meaning |
|------|---------|
| 400 | Bad Request - Invalid input parameters |
| 401 | Unauthorized - Invalid authentication |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Endpoint doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |
| 503 | Service Unavailable - Model not loaded |

---

## Rate Limiting

The ML Service implements rate limiting to ensure fair usage:

- **General endpoints**: 10 requests/second per IP
- **API endpoints**: 30 requests/second per IP
- **Authenticated requests**: 100 requests/second per token

**Rate Limit Headers:**

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1646048400
```

---

## API Documentation

Interactive API documentation available at:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## Examples & Code Samples

### Complete Farming Workflow

```python
import requests

BASE_URL = "http://localhost:8000"
HEADERS = {"Authorization": "Bearer YOUR_TOKEN"}

# 1. Get crop recommendations
crops_response = requests.post(
    f"{BASE_URL}/ml/predict-crop",
    json={
        "nitrogen": 90,
        "phosphorus": 40,
        "potassium": 40,
        "temperature": 20,
        "humidity": 80,
        "ph": 6.5,
        "rainfall": 200
    },
    headers=HEADERS
)
best_crop = crops_response.json()["recommended_crops"][0]
print(f"✓ Recommended crop: {best_crop}")

# 2. Get weather advice
weather_response = requests.get(
    f"{BASE_URL}/weather/advice",
    params={
        "latitude": 28.7041,
        "longitude": 77.1025,
        "temperature": 35,
        "humidity": 65
    },
    headers=HEADERS
)
print(f"✓ Weather advice: {weather_response.json()['farming_advice']}")

# 3. Check market prices
price_response = requests.get(
    f"{BASE_URL}/market/predict-price",
    params={"crop": best_crop, "current_price": 2400},
    headers=HEADERS
)
print(f"✓ Price prediction: {price_response.json()['recommendation']}")

# 4. Upload and detect diseases (if crop looks sick)
with open('leaf_sample.jpg', 'rb') as f:
    disease_response = requests.post(
        f"{BASE_URL}/ml/detect-disease",
        files={"file": f},
        headers={"Authorization": HEADERS["Authorization"]}
    )
    disease_data = disease_response.json()
    print(f"✓ Disease detected: {disease_data['disease_name']}")
    print(f"✓ Treatment: {disease_data['treatment_recommendations'][0]}")
```

---

## Support

For API issues:
- 📧 Email: api-support@agrismart.com
- 🐛 Issues: https://github.com/Akash7653/Agrismart/issues
- 📖 Docs: https://docs.agrismart.com

# Developer Quick Reference Guide - AgriSmart ML

## 🚀 Quick Start

### Environment Setup
```bash
# Backend ML Service
cd backend/ml
pip install -r requirements.txt
python main.py

# Frontend
cd frontend
npm install
npm run dev

# Full stack with Docker
docker-compose -f docker-compose.yml up
```

### Environment Variables
```env
VITE_ML_API_URL=http://localhost:8000
VITE_ML_API_TOKEN=your_token_here
VITE_API_TIMEOUT=30000
```

---

## 📡 API Endpoints Cheat Sheet

### Crop Prediction
```http
POST /ml/predict-crop HTTP/1.1
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN

{
  "nitrogen": 90,
  "phosphorus": 40,
  "potassium": 40,
  "temperature": 20,
  "humidity": 80,
  "ph": 6.5,
  "rainfall": 200
}
```

**Response:**
```json
{
  "recommended_crops": ["rice", "maize", "wheat"],
  "confidence_scores": [0.89, 0.75, 0.62],
  "yield_estimation_kg_per_hectare": 4520.50,
  "profit_estimation_per_hectare": 103012.50
}
```

### Disease Detection
```http
POST /ml/detect-disease HTTP/1.1
Authorization: Bearer YOUR_TOKEN
Content-Type: multipart/form-data

file=<image_file>
```

**Response:**
```json
{
  "crop_type": "tomato",
  "disease_name": "early_blight",
  "confidence": 0.9234,
  "severity_level": "High",
  "treatment_recommendations": ["Apply fungicide", "Prune leaves"]
}
```

### Weather Advice
```http
GET /weather/advice?latitude=28.7&longitude=77.1&temperature=35&humidity=65
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "farming_advice": "High temperature: Increase irrigation.",
  "recommendation_level": "caution"
}
```

### Market Price Prediction
```http
GET /market/predict-price?crop=wheat&current_price=2400
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "crop": "wheat",
  "prediction": 2280.0,
  "trend": "down",
  "recommendation": "Consider selling"
}
```

---

## 🎯 React Hooks Usage

### Crop Prediction
```typescript
const { mutate, isLoading, data } = useCropPrediction();

mutate({
  nitrogen: 90,
  phosphorus: 40,
  potassium: 40,
  temperature: 20,
  humidity: 80,
  ph: 6.5,
  rainfall: 200
});
```

### Disease Detection
```typescript
const { mutate, isLoading, data } = useDiseaseDetection();

mutate(fileInput);
```

### Weather Advice
```typescript
const { data, isLoading } = useWeatherAdvice(latitude, longitude);
```

### Price Prediction
```typescript
const { data } = usePricePrediction('wheat', 2400);
```

---

## 🔧 Common Tasks

### Add New Crop Type
**File:** `backend/ml/crop_prediction_model.py`

```python
# Update CROP_TYPES
CROP_TYPES = ['rice', 'wheat', 'maize', 'tomato', 'new_crop']

# Update yield_estimation_kg_per_hectare method
if crop == "new_crop":
    return 3000 + (rainfall * 2)  # Example calculation
```

### Add New Disease
**File:** `backend/ml/disease_detection_model.py`

```python
DISEASE_DATA = {
    "tomato": {
        "new_disease": {
            "symptoms": ["symptom1", "symptom2"],
            "causes": ["cause1"],
            "treatment": ["treatment1"],
            "organic_solutions": ["organic1"],
            "severity_level": "Medium"
        }
    }
}
```

### Add New Weather Condition
**File:** `backend/ml/main.py`

```python
@app.get("/weather/advice")
async def get_weather_advice(
    latitude: float,
    longitude: float,
    new_param: float = None
):
    advice = generate_advice(...)  # Your logic
    return {
        "farming_advice": advice,
        "recommendation_level": "optimal"
    }
```

---

## 📦 Project Structure

```
backend/
├── ml/
│   ├── main.py                    # FastAPI service
│   ├── crop_prediction_model.py    # RandomForest + GradientBoosting
│   ├── disease_detection_model.py  # CNN with MobileNetV2
│   ├── market_price_model.py       # LSTM time-series
│   ├── voice_assistant.py          # Multi-language voice
│   ├── models/                     # Trained models
│   └── requirements.txt
├── api/
│   ├── appointments.js
│   ├── consultations.js
│   ├── community.js                # New community module
│   └── ...
└── database/

frontend/
├── src/
│   ├── components/
│   │   ├── CropPredictionForm.tsx
│   │   ├── DiseaseDetector.tsx
│   │   ├── WeatherAdvice.tsx
│   │   └── MarketPricePredictor.tsx
│   ├── hooks/
│   │   └── useMLApi.ts             # ML hooks
│   └── services/
│       └── mlApiClient.ts          # API client
└── public/
```

---

## 🐛 Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `Model not initialized` | Models not trained | Run `python -c "from main import app"` |
| `401 Unauthorized` | Invalid token | Check `VITE_ML_API_TOKEN` |
| `429 Too Many Requests` | Rate limited | Add delay between requests |
| `422 Unprocessable Entity` | Invalid input type | Check parameter types match schema |
| `503 Service Unavailable` | Service down | Check `docker ps` or restart |
| `CORS Error` | Frontend origin not allowed | Check CORS config in `main.py` |

---

## 📊 API Input Ranges

| Parameter | Type | Min | Max | Example |
|-----------|------|-----|-----|---------|
| nitrogen | float | 0 | 200 | 90 |
| phosphorus | float | 0 | 150 | 40 |
| potassium | float | 0 | 200 | 40 |
| temperature | float | -20 | 50 | 20 |
| humidity | float | 0 | 100 | 80 |
| ph | float | 0 | 14 | 6.5 |
| rainfall | float | 0 | 3000 | 200 |

---

## 🔗 HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid token |
| 422 | Validation Error - Schema mismatch |
| 429 | Rate Limited |
| 500 | Server Error |
| 503 | Service Unavailable |

---

## 💾 Database Queries

### Get User with Crop History
```javascript
db.users.findOne({ _id: userId }).select('crop_history');
```

### Get Community Posts
```javascript
db.posts.find({ visibility: 'public' })
  .sort({ created_at: -1 })
  .limit(10);
```

### Get Disease Records
```javascript
db.disease_detections.find({ user_id: userId })
  .sort({ detected_at: -1 });
```

---

## 🧪 Testing Commands

```bash
# Unit tests
pytest backend/ml/test_models.py -v

# API tests
pytest backend/ml/test_api.py -v

# All tests
pytest backend/ml/ -v --cov=.

# Performance test
pytest backend/ml/test_performance.py -v -m performance

# Load test
locust -f backend/ml/locustfile.py --host=http://localhost:8000
```

---

## 📈 Performance Tips

1. **Cache predictions** - Use Redis for frequently requested predictions
2. **Batch requests** - Send multiple predictions in one request
3. **Compress images** - Compress disease detection images before upload
4. **Use async** - Use async/await for non-blocking operations
5. **Connection pooling** - Reuse database connections

---

## 🔒 Security Checklist

- [ ] Use strong API tokens (32+ characters)
- [ ] Enable HTTPS in production
- [ ] Validate all inputs server-side
- [ ] Use environment variables for secrets
- [ ] Rate limit to prevent abuse
- [ ] Log all API calls
- [ ] Sanitize user uploads
- [ ] Use CORS only for trusted origins

---

## 📚 Important Files

| File | Purpose |
|------|---------|
| `ML_API_DOCUMENTATION.md` | Complete API reference |
| `FRONTEND_ML_INTEGRATION.md` | React integration guide |
| `DEPLOYMENT_GUIDE.md` | Production deployment |
| `TESTING_VALIDATION_GUIDE.md` | Testing procedures |
| `README.md` | Project overview |

---

## 🚨 Debug Mode

Enable verbose logging:

```python
# In main.py
import logging
logging.basicConfig(level=logging.DEBUG)
```

Enable React debug tools:
```javascript
localStorage.setItem('debug', '*');
```

---

## 📞 API Client Examples

### Python
```python
import requests

headers = {"Authorization": "Bearer YOUR_TOKEN"}
response = requests.post(
    "http://localhost:8000/ml/predict-crop",
    json={"nitrogen": 90, "phosphorus": 40, ...},
    headers=headers
)
print(response.json())
```

### JavaScript
```javascript
const response = await fetch('http://localhost:8000/ml/predict-crop', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(inputData)
});
const result = await response.json();
```

### cURL
```bash
curl -X POST http://localhost:8000/ml/predict-crop \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nitrogen": 90, "phosphorus": 40, ...}'
```

---

## 🔄 Workflow Example

```typescript
// 1. Get crop recommendations
const crops = await useCropPrediction(inputs);
const bestCrop = crops.recommended_crops[0];

// 2. Get weather advice
const weather = await useWeatherAdvice(lat, long);

// 3. Check if disease present
const diseaseResult = await useDiseaseDetection(imageFile);

// 4. Get price prediction
const price = await usePricePrediction(bestCrop, marketPrice);

// 5. Provide recommendations
console.log(`Plant ${bestCrop} - Price trending ${price.trend}`);
```

---

## 🎓 Learning Resources

- **FastAPI Docs:** https://fastapi.tiangolo.com/
- **React Docs:** https://react.dev/
- **scikit-learn:** https://scikit-learn.org/
- **TensorFlow:** https://tensorflow.org/
- **Docker:** https://docker.com/

---

## 🔗 Related Guides

- [ML API Documentation](ML_API_DOCUMENTATION.md)
- [Frontend Integration](FRONTEND_ML_INTEGRATION.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Testing Guide](TESTING_VALIDATION_GUIDE.md)

---

**Last Updated:** 2024-03-08  
**Version:** 1.0.0  
**Maintainer:** AgriSmart Dev Team

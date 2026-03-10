# FastAPI ML Service - Quick Start Guide

## 🚀 Starting the Service

```bash
cd backend/ml
python main.py
# Service will start on http://localhost:8001
```

Or with explicit port:
```bash
python -c "import uvicorn; uvicorn.run('main:app', host='0.0.0.0', port=8001)"
```

## 📡 API Endpoints

### 1. Health Check
```bash
curl http://localhost:8001/
```

Response:
```json
{
  "service": "AgriSmart ML Service",
  "version": "2.0.0",
  "endpoints": { ... }
}
```

### 2. Crop Prediction
```bash
curl -X POST http://localhost:8001/predict-crop \
  -H "Content-Type: application/json" \
  -d '{
    "N": 90,
    "P": 40,
    "K": 40,
    "temperature": 20,
    "humidity": 80,
    "pH": 6.5,
    "rainfall": 200
  }'
```

**Response:**
```json
{
  "recommended_crop": "rice",
  "confidence": 0.834,
  "all_predictions": {
    "rice": 0.834,
    "jute": 0.134,
    ...
  },
  "timestamp": "2026-03-09T10:01:43.939301"
}
```

### 3. Disease Detection (Image Upload)
```bash
curl -X POST http://localhost:8001/detect-disease \
  -F "file=@path/to/leaf_image.jpg"
```

### 4. Weather Advice
```bash
curl "http://localhost:8001/weather/advice?temperature=25&humidity=70&rainfall=100"
```

### 5. Interactive API Documentation
- **Swagger UI:** http://localhost:8001/docs
- **ReDoc:** http://localhost:8001/redoc

## 🧪 Testing with Python

```python
import requests
import json

# Test crop prediction
data = {
    "N": 90,
    "P": 40,
    "K": 40,
    "temperature": 20,
    "humidity": 80,
    "pH": 6.5,
    "rainfall": 200
}

response = requests.post('http://localhost:8001/predict-crop', json=data)
print(json.dumps(response.json(), indent=2))
```

## 📊 Model Performance

| Model | Accuracy | Classes | Features |
|-------|----------|---------|----------|
| Crop Prediction | 99.32% | 22 crops | 7 soil/weather |
| Disease Detection | 100% | 18 diseases | Image features |

## 🔑 Supported Crops

apple, banana, blackgram, chickpea, coconut, coffee, cotton, grapes, jute, kidneybeans, lentil, maize, mango, mothbeans, mungbean, muskmelon, orange, papaya, pigeonpeas, pomegranate, rice, watermelon

## 🦠 Supported Diseases

apple_scab, apple_black_rot, apple_cedar_apple_rust, apple_healthy, blueberry_healthy, cherry_powdery_mildew, cherry_healthy, corn_cercospora_leaf_spot, corn_common_rust, corn_northern_leaf_blight, corn_healthy, grape_black_rot, grape_esca, grape_leaf_blight, grape_healthy, orange_haunglongbing, peach_bacterial_spot, peach_healthy

## 📝 Input Parameter Ranges

**Crop Prediction:**
- N (Nitrogen): 0-200 mg/kg
- P (Phosphorus): 0-150 mg/kg
- K (Potassium): 0-200 mg/kg
- Temperature: -20 to 50 °C
- Humidity: 0-100%
- pH: 0-14
- Rainfall: 0-3000 mm

## ⚠️ Error Codes

- **200:** Success
- **400:** Invalid input parameters
- **422:** Validation error (missing/wrong type fields)
- **503:** Models not loaded (server not ready)
- **500:** Prediction error (internal server error)

## 🔧 Training New Models

### Retrain Crop Model
```bash
python train_crop_model.py
```
- Loads crop_recommendation.csv
- Trains RandomForest on 2,200 samples
- Saves models to `models/` directory

### Retrain Disease Model
```bash
python train_disease_quick.py
```
- Generates synthetic training data
- Trains RandomForest classifier
- Saves models to `models/` directory

## 📦 Files Structure

```
backend/ml/
├── main.py                    # FastAPI service
├── models/
│   ├── crop_model.pkl
│   ├── crop_scaler.pkl
│   ├── crop_label_encoder.pkl
│   ├── disease_classifier_rf.pkl
│   └── disease_classes.pkl
├── train_crop_model.py        # Crop training
├── train_disease_quick.py     # Disease training
└── datasets/                  # Optional training data
```

## 🎯 Example Use Cases

### 1. Recommend crop for farmer's field
```python
payload = {
    "N": 45, "P": 40, "K": 30,
    "temperature": 25, "humidity": 75,
    "pH": 6.8, "rainfall": 250
}
crop = requests.post('http://localhost:8001/predict-crop', json=payload).json()
print(f"Recommended: {crop['recommended_crop']} ({crop['confidence']*100:.1f}%)")
```

### 2. Diagnose plant disease
```python
with open('leaf_image.jpg', 'rb') as f:
    files = {'file': f}
    result = requests.post('http://localhost:8001/detect-disease', files=files).json()
    print(f"Disease: {result['disease']}")
```

### 3. Get farming advice
```python
advice = requests.get('http://localhost:8001/weather/advice?temperature=28&humidity=65').json()
print(advice['advice'])
```

## 🐛 Troubleshooting

**Models not found:**
- Make sure you're running from `backend/ml/` directory
- Or retrain models: `python train_crop_model.py && python train_disease_quick.py`

**Port already in use:**
- Change port: `python -c "import uvicorn; uvicorn.run('main:app', port=8002)"`

**Validation errors (422):**
- Check parameter names match the schema (N, P, K, not nitrogen, phosphorus, potassium)
- Ensure values are within the specified ranges

**No response:**
- Verify service is running: `curl http://localhost:8001/`
- Check logs in terminal for errors

---

Happy Farming! 🌾

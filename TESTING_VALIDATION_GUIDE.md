# Testing & Validation Guide - AgriSmart ML Service

## Overview

This guide provides comprehensive testing procedures for validating all ML service endpoints and functionality.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Unit Testing](#unit-testing)
3. [Integration Testing](#integration-testing)
4. [API Endpoint Testing](#api-endpoint-testing)
5. [Performance Testing](#performance-testing)
6. [Load Testing](#load-testing)
7. [Data Validation Testing](#data-validation-testing)

---

## Prerequisites

### Install Testing Tools

```bash
# Backend testing
pip install pytest pytest-asyncio pytest-cov httpx

# Frontend testing
npm install --save-dev @testing-library/react @testing-library/jest-dom jest vitest

# API testing
npm install --save-dev supertest
# or use Postman/Insomnia

# Load testing
pip install locust
```

---

## Unit Testing

### Backend Model Tests

Create `backend/ml/test_models.py`:

```python
import pytest
import numpy as np
from crop_prediction_model import CropPredictionModel
from disease_detection_model import DiseaseDetectionModel
from market_price_model import MarketPricePredictionModel

class TestCropPredictionModel:
    @pytest.fixture
    def model(self):
        model = CropPredictionModel()
        X, y = model.create_synthetic_dataset(n_samples=100)
        model.fit(X, y)
        return model

    def test_model_initialization(self):
        model = CropPredictionModel()
        assert model.model is not None
        assert model.scaler is not None

    def test_model_training(self, model):
        assert hasattr(model, 'model')
        assert hasattr(model, 'label_encoder')

    def test_prediction_output_shape(self, model):
        X_test = np.array([[90, 40, 40, 20, 80, 6.5, 200]])
        crops, scores = model.predict_crops(X_test[0])
        
        assert len(crops) == 3
        assert len(scores) == 3
        assert all(0 <= score <= 1 for score in scores)

    def test_yield_estimation(self, model):
        yield_kg = model._estimate_yield("wheat", 
                                         nitrogen=90, 
                                         phosphorus=40, 
                                         potassium=40,
                                         rainfall=200)
        assert yield_kg > 0

    def test_profit_estimation(self, model):
        profit = model._estimate_profit("wheat", yield_kg=4000)
        assert profit > 0

    def test_model_save_load(self, tmp_path, model):
        model_path = tmp_path / "test_model.pkl"
        model.save(str(model_path))
        
        new_model = CropPredictionModel()
        new_model.load(str(model_path))
        
        assert new_model.model is not None


class TestDiseaseDetectionModel:
    @pytest.fixture
    def model(self):
        return DiseaseDetectionModel()

    def test_disease_data_integrity(self, model):
        crops = list(model.DISEASE_DATA.keys())
        assert len(crops) > 0
        
        for crop in crops:
            for disease_key, disease_data in model.DISEASE_DATA[crop].items():
                assert 'symptoms' in disease_data
                assert 'treatment' in disease_data
                assert 'severity_level' in disease_data

    def test_model_initialization(self, model):
        assert model.model is not None

    def test_disease_prediction_format(self, model):
        # Create a dummy image array
        image_array = np.random.rand(224, 224, 3)
        
        result = model.predict_disease(image_array, confidence_threshold=0.5)
        
        assert 'disease_name' in result
        assert 'severity_level' in result
        assert 'treatment' in result


class TestMarketPriceModel:
    @pytest.fixture
    def model(self):
        return MarketPricePredictionModel()

    def test_historical_data_generation(self, model):
        data = model.generate_historical_price_data(crop='wheat', days=365)
        
        assert len(data) == 365
        assert all(price > 0 for price in data)

    def test_price_prediction(self, model):
        data = model.generate_historical_price_data(crop='wheat', days=100)
        price = model.predict(data, crop='wheat')
        
        assert price > 0

    def test_trend_classification(self, model):
        current_price = 2400
        future_price = 2600
        
        trend = model.get_price_trend(current_price, future_price)
        assert trend in ['up', 'down', 'stable']
```

---

## Integration Testing

### FastAPI Endpoint Tests

Create `backend/ml/test_api.py`:

```python
import pytest
from fastapi.testclient import TestClient
from main import app
import io

client = TestClient(app)

class TestCropPredictionEndpoint:
    def test_health_check(self):
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"

    def test_predict_crop_valid_input(self):
        payload = {
            "nitrogen": 90,
            "phosphorus": 40,
            "potassium": 40,
            "temperature": 20,
            "humidity": 80,
            "ph": 6.5,
            "rainfall": 200
        }
        
        response = client.post("/ml/predict-crop", json=payload)
        assert response.status_code == 200
        
        data = response.json()
        assert "recommended_crops" in data
        assert "confidence_scores" in data
        assert "yield_estimation_kg_per_hectare" in data
        assert "profit_estimation_per_hectare" in data
        assert len(data["recommended_crops"]) == 3

    def test_predict_crop_missing_field(self):
        payload = {
            "nitrogen": 90,
            "phosphorus": 40,
            # Missing other fields
        }
        
        response = client.post("/ml/predict-crop", json=payload)
        assert response.status_code == 422

    def test_predict_crop_invalid_range(self):
        payload = {
            "nitrogen": 300,  # Max is 200
            "phosphorus": 40,
            "potassium": 40,
            "temperature": 20,
            "humidity": 80,
            "ph": 6.5,
            "rainfall": 200
        }
        
        response = client.post("/ml/predict-crop", json=payload)
        assert response.status_code == 422


class TestDiseaseDetectionEndpoint:
    def test_detect_disease_with_image(self):
        # Create a test image
        image_data = io.BytesIO(b"fake image data")
        image_data.name = "test.jpg"
        
        files = {"file": ("test.jpg", image_data, "image/jpeg")}
        response = client.post("/ml/detect-disease", files=files)
        
        assert response.status_code in [200, 422]  # 422 if model can't process fake data
        
        if response.status_code == 200:
            data = response.json()
            assert "disease_name" in data
            assert "confidence" in data
            assert "treatment_recommendations" in data

    def test_detect_disease_invalid_file(self):
        files = {"file": ("test.txt", b"not an image", "text/plain")}
        response = client.post("/ml/detect-disease", files=files)
        
        assert response.status_code in [400, 422]


class TestWeatherEndpoint:
    def test_weather_advice_valid_params(self):
        params = {
            "latitude": 28.7041,
            "longitude": 77.1025,
            "temperature": 35,
            "humidity": 65
        }
        
        response = client.get("/weather/advice", params=params)
        assert response.status_code == 200
        
        data = response.json()
        assert "farming_advice" in data
        assert "recommendation_level" in data
        assert data["recommendation_level"] in ["optimal", "caution", "warning"]

    def test_weather_advice_missing_params(self):
        response = client.get("/weather/advice")
        assert response.status_code == 422


class TestPriceEndpoint:
    def test_predict_price_valid(self):
        params = {
            "crop": "wheat",
            "current_price": 2400
        }
        
        response = client.get("/market/predict-price", params=params)
        assert response.status_code == 200
        
        data = response.json()
        assert "predicted_price_next_week" in data
        assert "price_trend" in data
        assert data["price_trend"] in ["up", "down", "stable"]

    def test_predict_price_invalid_crop(self):
        params = {
            "crop": "invalid_crop_name",
            "current_price": 2400
        }
        
        response = client.get("/market/predict-price", params=params)
        # Should either handle gracefully or return error
        assert response.status_code in [200, 400, 404]
```

---

## API Endpoint Testing

### Postman Collection

Create `backend/ml/postman_collection.json`:

```json
{
  "info": {
    "name": "AgriSmart ML API",
    "version": "1.0.0"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/health"
      }
    },
    {
      "name": "Predict Crop",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/ml/predict-crop",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          },
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": """
{
  "nitrogen": 90,
  "phosphorus": 40,
  "potassium": 40,
  "temperature": 20,
  "humidity": 80,
  "ph": 6.5,
  "rainfall": 200
}"""
        }
      }
    },
    {
      "name": "Detect Disease",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/ml/detect-disease",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "body": {
          "mode": "formdata",
          "formdata": [
            {
              "key": "file",
              "type": "file",
              "src": "path/to/image.jpg"
            }
          ]
        }
      }
    },
    {
      "name": "Weather Advice",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/weather/advice",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "query": [
            {
              "key": "latitude",
              "value": "28.7041"
            },
            {
              "key": "longitude",
              "value": "77.1025"
            },
            {
              "key": "temperature",
              "value": "35"
            },
            {
              "key": "humidity",
              "value": "65"
            }
          ]
        }
      }
    },
    {
      "name": "Predict Price",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/market/predict-price",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ],
        "url": {
          "query": [
            {
              "key": "crop",
              "value": "wheat"
            },
            {
              "key": "current_price",
              "value": "2400"
            }
          ]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8000"
    },
    {
      "key": "token",
      "value": "your_api_token_here"
    }
  ]
}
```

### cURL Test Commands

```bash
# Health Check
curl -X GET http://localhost:8000/health \
  -H "Authorization: Bearer YOUR_TOKEN"

# Predict Crop
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

# Detect Disease
curl -X POST http://localhost:8000/ml/detect-disease \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@path/to/image.jpg"

# Weather Advice
curl -X GET http://localhost:8000/weather/advice \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -G --data-urlencode "latitude=28.7041" \
     --data-urlencode "longitude=77.1025" \
     --data-urlencode "temperature=35" \
     --data-urlencode "humidity=65"

# Market Price
curl -X GET http://localhost:8000/market/predict-price \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -G --data-urlencode "crop=wheat" \
     --data-urlencode "current_price=2400"
```

---

## Performance Testing

### Response Time Tests

Create `backend/ml/test_performance.py`:

```python
import time
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

class TestAPIPerformance:
    @pytest.mark.performance
    def test_crop_prediction_response_time(self):
        payload = {
            "nitrogen": 90,
            "phosphorus": 40,
            "potassium": 40,
            "temperature": 20,
            "humidity": 80,
            "ph": 6.5,
            "rainfall": 200
        }
        
        start_time = time.time()
        response = client.post("/ml/predict-crop", json=payload)
        elapsed_time = time.time() - start_time
        
        assert response.status_code == 200
        assert elapsed_time < 1.0  # Should respond in less than 1 second
        print(f"Crop prediction took {elapsed_time:.3f}s")

    @pytest.mark.performance
    def test_weather_advice_response_time(self):
        params = {
            "latitude": 28.7041,
            "longitude": 77.1025,
            "temperature": 35,
            "humidity": 65
        }
        
        start_time = time.time()
        response = client.get("/weather/advice", params=params)
        elapsed_time = time.time() - start_time
        
        assert response.status_code == 200
        assert elapsed_time < 0.5
        print(f"Weather advice took {elapsed_time:.3f}s")

    @pytest.mark.performance
    def test_price_prediction_response_time(self):
        params = {
            "crop": "wheat",
            "current_price": 2400
        }
        
        start_time = time.time()
        response = client.get("/market/predict-price", params=params)
        elapsed_time = time.time() - start_time
        
        assert response.status_code == 200
        assert elapsed_time < 0.5
        print(f"Price prediction took {elapsed_time:.3f}s")

    @pytest.mark.performance
    def test_concurrent_requests(self):
        """Test handling multiple concurrent requests"""
        import concurrent.futures
        
        payload = {
            "nitrogen": 90,
            "phosphorus": 40,
            "potassium": 40,
            "temperature": 20,
            "humidity": 80,
            "ph": 6.5,
            "rainfall": 200
        }
        
        def make_request():
            start = time.time()
            response = client.post("/ml/predict-crop", json=payload)
            return time.time() - start, response.status_code
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            futures = [executor.submit(make_request) for _ in range(100)]
            results = [f.result() for f in concurrent.futures.as_completed(futures)]
        
        times = [r[0] for r in results]
        statuses = [r[1] for r in results]
        
        assert all(status == 200 for status in statuses)
        print(f"100 concurrent requests:")
        print(f"  Min: {min(times):.3f}s")
        print(f"  Max: {max(times):.3f}s")
        print(f"  Avg: {sum(times)/len(times):.3f}s")
```

---

## Load Testing

### Locust Load Test

Create `backend/ml/locustfile.py`:

```python
from locust import HttpUser, task, between
import random

class AgriSmartUser(HttpUser):
    wait_time = between(1, 3)
    
    def on_start(self):
        self.token = "YOUR_API_TOKEN"
        self.headers = {
            "Authorization": f"Bearer {self.token}"
        }

    @task(3)
    def predict_crop(self):
        payload = {
            "nitrogen": random.randint(0, 200),
            "phosphorus": random.randint(0, 150),
            "potassium": random.randint(0, 200),
            "temperature": random.randint(-20, 50),
            "humidity": random.randint(0, 100),
            "ph": random.uniform(0, 14),
            "rainfall": random.randint(0, 3000)
        }
        self.client.post(
            "/ml/predict-crop",
            json=payload,
            headers=self.headers,
            name="/ml/predict-crop"
        )

    @task(2)
    def get_weather_advice(self):
        params = {
            "latitude": random.uniform(-90, 90),
            "longitude": random.uniform(-180, 180),
            "temperature": random.randint(-20, 50),
            "humidity": random.randint(0, 100)
        }
        self.client.get(
            "/weather/advice",
            params=params,
            headers=self.headers,
            name="/weather/advice"
        )

    @task(2)
    def predict_price(self):
        crops = ["wheat", "rice", "tomato", "potato", "maize"]
        params = {
            "crop": random.choice(crops),
            "current_price": random.randint(1000, 5000)
        }
        self.client.get(
            "/market/predict-price",
            params=params,
            headers=self.headers,
            name="/market/predict-price"
        )

    @task(1)
    def health_check(self):
        self.client.get("/health", headers=self.headers)
```

Run Load Test:

```bash
# Start Locust UI
locust -f backend/ml/locustfile.py --host=http://localhost:8000

# Or run headless
locust -f backend/ml/locustfile.py \
  --host=http://localhost:8000 \
  --users 100 \
  --spawn-rate 10 \
  --run-time 5m \
  --headless

# CSV export
locust -f backend/ml/locustfile.py \
  --host=http://localhost:8000 \
  --csv=results \
  --headless
```

---

## Data Validation Testing

### Input Validation Tests

```python
# Test valid ranges
valid_inputs = [
    {"nitrogen": 0, "phosphorus": 0, "potassium": 0, "temperature": -20, "humidity": 0, "ph": 0, "rainfall": 0},
    {"nitrogen": 200, "phosphorus": 150, "potassium": 200, "temperature": 50, "humidity": 100, "ph": 14, "rainfall": 3000},
    {"nitrogen": 90, "phosphorus": 40, "potassium": 40, "temperature": 20, "humidity": 80, "ph": 6.5, "rainfall": 200},
]

invalid_inputs = [
    {"nitrogen": -1, "phosphorus": 40, "potassium": 40, "temperature": 20, "humidity": 80, "ph": 6.5, "rainfall": 200},
    {"nitrogen": 300, "phosphorus": 40, "potassium": 40, "temperature": 20, "humidity": 80, "ph": 6.5, "rainfall": 200},
    {"nitrogen": 90, "phosphorus": 40, "potassium": 40, "temperature": 20, "humidity": 150, "ph": 6.5, "rainfall": 200},
]

@pytest.mark.parametrize("inputs", valid_inputs)
def test_valid_inputs(inputs):
    response = client.post("/ml/predict-crop", json=inputs)
    assert response.status_code == 200

@pytest.mark.parametrize("inputs", invalid_inputs)
def test_invalid_inputs(inputs):
    response = client.post("/ml/predict-crop", json=inputs)
    assert response.status_code == 422
```

---

## Running All Tests

### Combined Test Command

```bash
# Run all tests with coverage
pytest backend/ml/test_*.py --cov=backend/ml --cov-report=html

# Run specific test categories
pytest backend/ml/test_models.py -v
pytest backend/ml/test_api.py -v
pytest backend/ml/test_performance.py -v -m performance

# Test with detailed output
pytest backend/ml/ -v --tb=short

# Run only fast tests
pytest backend/ml/ -v -m "not performance and not load"
```

---

## CI/CD Integration

### GitHub Actions Workflow

Create `.github/workflows/test.yml`:

```yaml
name: ML Service Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:7.0
        options: >-
          --health-cmd mongosh
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 27017:27017

    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          cd backend/ml
          pip install -r requirements.txt
          pip install pytest pytest-asyncio pytest-cov
      
      - name: Run unit tests
        run: |
          cd backend/ml
          pytest test_models.py -v --cov=. --cov-report=xml
      
      - name: Run API tests
        run: |
          cd backend/ml
          python main.py &
          sleep 5
          pytest test_api.py -v
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage.xml
```

---

## Test Report Generation

### HTML Report

```bash
# Generate HTML report
pytest backend/ml/ --html=report.html --self-contained-html

# With coverage
pytest backend/ml/ --cov=backend/ml --cov-report=html --html=report.html --self-contained-html
```

---

## Troubleshooting Tests

| Issue | Solution |
|-------|----------|
| Model not found | Train model first: `python train_models.py` |
| Port already in use | Change port in config or kill process |
| Authentication errors | Verify API token in environment |
| Timeout errors | Increase timeout in config |
| Memory errors | Reduce batch size or dataset size |

---

## Support

For testing issues:
- 📧 Email: dev-support@agrismart.com
- 📖 Pytest Docs: https://docs.pytest.org
- 🐛 Issues: https://github.com/Akash7653/Agrismart/issues

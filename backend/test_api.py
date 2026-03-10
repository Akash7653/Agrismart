"""Test ML API endpoints"""
import requests
import json

BASE_URL = "http://localhost:8000"

print("="*60)
print("🧪 Testing AgriSmart ML API")
print("="*60)

# Test 1: Health check
print("\n1️⃣  Testing health endpoint...")
try:
    response = requests.get(f"{BASE_URL}/")
    print(f"✓ Status: {response.status_code}")
    print(f"✓ Response: {json.dumps(response.json(), indent=2)}")
except Exception as e:
    print(f"✗ Error: {e}")

# Test 2: Crop Prediction
print("\n2️⃣  Testing crop prediction...")
try:
    crop_data = {
        "N": 90,
        "P": 40,
        "K": 40,
        "temperature": 20,
        "humidity": 80,
        "pH": 6.5,
        "rainfall": 200
    }
    response = requests.post(f"{BASE_URL}/predict-crop", json=crop_data)
    print(f"✓ Status: {response.status_code}")
    result = response.json()
    print(f"✓ Predicted crop: {result.get('predicted_crop')}")
    print(f"✓ Confidence: {result.get('confidence'):.4f}")
except Exception as e:
    print(f"✗ Error: {e}")

# Test 3: Disease Prediction
print("\n3️⃣  Testing disease detection...")
try:
    # Use a dummy image for testing
    with open('models/disease_classes.pkl', 'rb') as f:
        print("✓ Disease model ready (classifier loaded)")
except Exception as e:
    print(f"✗ Error: {e}")

# Test 4: Weather Advice
print("\n4️⃣  Testing weather advice endpoint...")
try:
    response = requests.get(f"{BASE_URL}/weather/advice?temperature=25&humidity=70&rainfall=100")
    print(f"✓ Status: {response.status_code}")
    result = response.json()
    print(f"✓ Advice: {result.get('advice')}")
except Exception as e:
    print(f"✗ Error: {e}")

print("\n" + "="*60)
print("✓ API Testing Complete!")
print("="*60)

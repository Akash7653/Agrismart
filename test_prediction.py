import sys
sys.path.insert(0, 'backend')
import numpy as np
import joblib

print("🔬 TESTING CROP PREDICTION MODEL")
print("=" * 60)

# Load models
print("Loading models...")
crop_model = joblib.load('backend/ml/models/crop_model.pkl')
crop_scaler = joblib.load('backend/ml/models/crop_scaler.pkl')
crop_label_encoder = joblib.load('backend/ml/models/crop_label_encoder.pkl')
print("✅ Models loaded successfully\n")

# Test with sample data
print("Input Test Data:")
print("  Nitrogen: 50 mg/kg")
print("  Phosphorus: 30 mg/kg")
print("  Potassium: 40 mg/kg")
print("  Temperature: 25°C")
print("  Humidity: 60%")
print("  pH: 6.5")
print("  Rainfall: 1000 mm\n")

# Create input array
test_input = np.array([[50, 30, 40, 25, 60, 6.5, 1000]])
features_scaled = crop_scaler.transform(test_input)
prediction = crop_model.predict(features_scaled)[0]
probabilities = crop_model.predict_proba(features_scaled)[0]

crop_name = crop_label_encoder.inverse_transform([prediction])[0]
confidence = probabilities[prediction]

print(f"✅ PREDICTED CROP: {crop_name}")
print(f"✅ CONFIDENCE: {confidence*100:.2f}%\n")

print("Top 5 Crops Recommended:")
all_crops = crop_label_encoder.classes_
for i, (crop, prob) in enumerate(sorted(zip(all_crops, probabilities), key=lambda x: x[1], reverse=True)[:5], 1):
    print(f"   {i}. {crop:20s} - {prob*100:6.2f}%")

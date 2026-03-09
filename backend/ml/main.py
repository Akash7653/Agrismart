"""
AgriSmart FastAPI Server - Real Trained Models
Loads and serves:
- Crop Prediction Model (RandomForest trained on actual dataset)
- Disease Detection Model (RandomForest with plant image validation)
"""

import os
import sys
import numpy as np
import joblib
from io import BytesIO
from typing import List
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from PIL import Image
import logging
import traceback
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ═══════════════════════════════════════════════════════════
# CONFIGURATION
# ═══════════════════════════════════════════════════════════

# Get absolute path to ml directory
ML_DIR = os.path.dirname(os.path.abspath(__file__))
CROP_MODEL_PATH = os.path.join(ML_DIR, 'models/crop_model.pkl')
CROP_SCALER_PATH = os.path.join(ML_DIR, 'models/crop_scaler.pkl')
CROP_LABEL_ENCODER_PATH = os.path.join(ML_DIR, 'models/crop_label_encoder.pkl')
DISEASE_MODEL_PATH = os.path.join(ML_DIR, 'models/disease_classifier_rf.pkl')
DISEASE_CLASSES_PATH = os.path.join(ML_DIR, 'models/disease_classes.pkl')
IMAGE_SIZE = (224, 224)

# Initialize FastAPI app
app = FastAPI(
    title="AgriSmart ML Service",
    description="Real ML models for crop prediction and disease detection",
    version="2.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model instances
crop_model = None
crop_scaler = None
crop_label_encoder = None
disease_model = None
disease_classes = None

# ======================= MODELS INITIALIZATION =======================

def initialize_models():
    """Load trained models on startup"""
    global crop_model, crop_scaler, crop_label_encoder, disease_model, disease_classes
    
    # Load crop model
    try:
        logger.info("[*] Loading Crop Prediction Model...")
        crop_model = joblib.load(CROP_MODEL_PATH)
        crop_scaler = joblib.load(CROP_SCALER_PATH)
        crop_label_encoder = joblib.load(CROP_LABEL_ENCODER_PATH)
        logger.info("[+] Crop Prediction Model loaded successfully")
        logger.info(f"    Classes: {list(crop_label_encoder.classes_)}")
    except FileNotFoundError:
        logger.error(f"[-] Crop model not found at {CROP_MODEL_PATH}")
        logger.error("    Run: python train_crop_model.py")
    except Exception as e:
        logger.error(f"[-] Error loading crop model: {str(e)}")
    
    # Load disease model
    try:
        logger.info("[*] Loading Disease Detection Model...")
        disease_model = joblib.load(DISEASE_MODEL_PATH)
        import pickle
        with open(DISEASE_CLASSES_PATH, 'rb') as f:
            disease_classes = pickle.load(f)
        logger.info("[+] Disease Detection Model loaded successfully")
        logger.info(f"    Classes: {disease_classes}")
    except FileNotFoundError:
        logger.error(f"[-] Disease model not found at {DISEASE_MODEL_PATH}")
        logger.error("    Run: python train_disease_quick.py")
    except Exception as e:
        logger.error(f"[-] Error loading disease model: {str(e)}")

# ======================= REQUEST/RESPONSE MODELS =======================

class CropPredictionRequest(BaseModel):
    """Input model for crop prediction"""
    N: float = Field(..., ge=0, le=200, alias="nitrogen", description="Nitrogen level (mg/kg)")
    P: float = Field(..., ge=0, le=150, alias="phosphorus", description="Phosphorus level (mg/kg)")
    K: float = Field(..., ge=0, le=200, alias="potassium", description="Potassium level (mg/kg)")
    temperature: float = Field(..., ge=-20, le=50, description="Temperature (°C)")
    humidity: float = Field(..., ge=0, le=100, description="Humidity (%)")
    pH: float = Field(..., ge=0, le=14, alias="ph", description="Soil pH level")
    rainfall: float = Field(..., ge=0, le=3000, description="Rainfall (mm)")
    
    class Config:
        populate_by_name = True  # Allow both field name and alias

class CropPredictionResponse(BaseModel):
    """Output model for crop prediction"""
    recommended_crop: str
    confidence: float
    all_predictions: dict
    timestamp: str

class DiseasePredictionResponse(BaseModel):
    """Output model for disease detection"""
    crop: str
    disease: str
    confidence: float
    severity: str
    treatment: List[str]
    organic_solutions: List[str]
    timestamp: str

class WeatherAdviceResponse(BaseModel):
    location: str
    temperature: float
    rainfall_forecast: float
    humidity: float
    farming_advice: str
    recommendation_level: str
    timestamp: str

class PriceResponse(BaseModel):
    crop: str
    current_price: float
    predicted_price_next_week: float
    price_trend: str
    recommendation: str
    timestamp: str

# ======================= STARTUP EVENT =======================

@app.on_event("startup")
async def startup():
    """Initialize trained models when server starts"""
    logger.info("=" * 60)
    logger.info("🚀 AgriSmart ML Service Starting")
    logger.info("=" * 60)
    initialize_models()
    logger.info("=" * 60)

# ======================= CROP PREDICTION =======================

@app.post(
    "/predict-crop",
    response_model=CropPredictionResponse,
    summary="Predict suitable crop",
    tags=["Crop Prediction"]
)
async def predict_crop(request: CropPredictionRequest):
    """
    Predict suitable crop based on soil and weather conditions
    
    Uses trained RandomForestClassifier model
    
    **Parameters:**
    - nitrogen: Soil nitrogen level (0-200 mg/kg)
    - phosphorus: Soil phosphorus level (0-150 mg/kg)
    - potassium: Soil potassium level (0-200 mg/kg)
    - temperature: Average temperature (-20 to 50 °C)
    - humidity: Relative humidity (0-100%)
    - ph: Soil pH level (0-14)
    - rainfall: Average rainfall (0-3000 mm)
    
    **Returns:**
    - recommended_crop: Best suited crop
    - confidence: Confidence score (0-1)
    - all_predictions: All crops ranked by confidence
    """
    try:
        if crop_model is None:
            raise HTTPException(status_code=503, detail="Crop model not loaded. Run: python train_crop_model.py")
        
        # Convert input to numpy array
        features = np.array([[
            request.N,
            request.P,
            request.K,
            request.temperature,
            request.humidity,
            request.pH,
            request.rainfall
        ]])
        
        # Scale features
        features_scaled = crop_scaler.transform(features)
        
        # Make prediction
        prediction = crop_model.predict(features_scaled)[0]
        probabilities = crop_model.predict_proba(features_scaled)[0]
        
        # Get crop name and confidence
        crop_name = crop_label_encoder.inverse_transform([prediction])[0]
        confidence = probabilities[prediction]
        
        # Get all predictions
        all_crops = crop_label_encoder.classes_
        all_predictions = {
            crop: float(prob)
            for crop, prob in zip(all_crops, probabilities)
        }
        all_predictions = dict(sorted(all_predictions.items(), key=lambda x: x[1], reverse=True))
        
        logger.info(f"✓ Crop prediction: {crop_name} (confidence: {confidence:.4f})")
        
        return CropPredictionResponse(
            recommended_crop=crop_name,
            confidence=float(confidence),
            all_predictions=all_predictions,
            timestamp=datetime.now().isoformat()
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in crop prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

# ======================= DISEASE DETECTION =======================

@app.post(
    "/detect-disease",
    response_model=DiseasePredictionResponse,
    summary="Detect plant disease from image",
    tags=["Disease Detection"]
)
async def detect_disease(file: UploadFile = File(...)):
    """
    Detect plant disease from leaf image
    
    Uses RandomForest model trained on plant disease dataset
    with confidence validation to prevent false positives.
    
    **Input:**
    - file: Leaf image (JPG, PNG) - Must be a clear plant/leaf image
    
    **Returns:**
    - disease: Disease name
    - confidence: Confidence score (0-1)
    - severity: Disease severity level
    - treatment: Recommended treatments
    
    **Validation Checks:**
    - Minimum confidence threshold: 50%
    - Image must be a plant/leaf image (green/brown tones)
    - Rejects non-plant images with clear error
    """
    
    # Constants for validation
    MIN_CONFIDENCE_THRESHOLD = 0.50  # Minimum 50% confidence
    MIN_GREEN_RATIO = 0.15  # At least 15% green pixels (plants have green)
    MIN_IMAGE_SIZE = 100  # Image too small = not a real leaf
    
    try:
        if disease_model is None:
            raise HTTPException(status_code=503, detail="Disease model not loaded")
        
        # Validate file type
        allowed_ext = {'.jpg', '.jpeg', '.png'}
        file_ext = os.path.splitext(file.filename)[1].lower()
        if file_ext not in allowed_ext:
            raise HTTPException(status_code=400, detail="Invalid file type. Use JPG or PNG")
        
        # Read and validate image
        contents = await file.read()
        if len(contents) == 0:
            raise HTTPException(status_code=400, detail="Image file is empty")
        
        try:
            image = Image.open(BytesIO(contents)).convert('RGB')
        except Exception:
            raise HTTPException(status_code=400, detail="Invalid or corrupted image file")
        
        # Check image dimensions
        if image.width < MIN_IMAGE_SIZE or image.height < MIN_IMAGE_SIZE:
            raise HTTPException(status_code=400, detail="Image too small. Please upload a clear leaf/plant image (at least 100x100 pixels)")
        
        # Validate image is a plant (check for green/brown tones)
        image_array_check = np.array(image)
        red = image_array_check[:, :, 0].astype(float)
        green = image_array_check[:, :, 1].astype(float)
        blue = image_array_check[:, :, 2].astype(float)
        
        # Calculate green ratio (plants have significant green channel)
        green_ratio = np.mean(green > (red + blue) / 2)
        
        logger.info(f"Image validation - green_ratio: {green_ratio:.2%}, size: {image.width}x{image.height}")
        
        if green_ratio < MIN_GREEN_RATIO:
            raise HTTPException(
                status_code=422, 
                detail="Image does not appear to be a plant/leaf. Please upload a clear image of a crop leaf or plant. This is not a plant image (low green pixel count)."
            )
        
        # Prepare for prediction
        image_resized = image.resize(IMAGE_SIZE)
        image_array = np.array(image_resized) / 255.0
        image_array = np.expand_dims(image_array, axis=0)
        
        # Make prediction
        predictions = disease_model.predict_proba(image_array.reshape(1, -1))[0] if hasattr(disease_model, 'predict_proba') else disease_model.predict(image_array, verbose=0)[0]
        predicted_idx = np.argmax(predictions)
        confidence = float(predictions[predicted_idx])
        
        logger.info(f"Raw prediction - class: {predicted_idx}, confidence: {confidence:.4f}")
        
        # ⚠️ CRITICAL: Check confidence threshold
        if confidence < MIN_CONFIDENCE_THRESHOLD:
            raise HTTPException(
                status_code=422,
                detail=f"Cannot reliably identify plant disease. Confidence too low ({confidence*100:.1f}% < {MIN_CONFIDENCE_THRESHOLD*100:.0f}% required). Please upload a clearer image of the affected leaf."
            )
        
        # Load disease classes dynamically
        import pickle
        with open(DISEASE_CLASSES_PATH, 'rb') as f:
            disease_classes = pickle.load(f)
        
        if predicted_idx >= len(disease_classes):
            raise HTTPException(status_code=500, detail="Invalid prediction index")
        
        disease_name = disease_classes[predicted_idx]
        
        # Treatment information database
        treatments = {
            'Apple___Apple_scab': {'severity': 'High', 'treatment': ['Apply fungicide', 'Improve air circulation'], 'organic': ['Sulfur', 'Copper fungicide']},
            'Apple___Black_rot': {'severity': 'Critical', 'treatment': ['Remove infected branches', 'Apply fungicide'], 'organic': ['Copper', 'Lime sulfur']},
            'Apple___Cedar_apple_rust': {'severity': 'Medium', 'treatment': ['Remove galls', 'Apply fungicide'], 'organic': ['Sulfur spray']},
            'Apple___healthy': {'severity': 'None', 'treatment': ['Continue monitoring', 'Maintain care'], 'organic': ['Regular monitoring']},
            'Blueberry___healthy': {'severity': 'None', 'treatment': ['Continue care', 'Monitor for diseases'], 'organic': ['Preventive care']},
            'Cherry_(including_sour)___Powdery_mildew': {'severity': 'Medium', 'treatment': ['Apply sulfur', 'Remove infected leaves'], 'organic': ['Sulfur dust', 'Neem oil']},
            'Cherry_(including_sour)___healthy': {'severity': 'None', 'treatment': ['Continue monitoring'], 'organic': ['Regular care']},
            'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot': {'severity': 'High', 'treatment': ['Rotate crops', 'Apply fungicide'], 'organic': ['Copper fungicide']},
            'Corn_(maize)___Common_rust_': {'severity': 'Medium', 'treatment': ['Plant resistant varieties', 'Apply fungicide'], 'organic': ['Sulfur spray']},
            'Corn_(maize)___Northern_Leaf_Blight': {'severity': 'High', 'treatment': ['Remove infected leaves', 'Apply fungicide'], 'organic': ['Copper fungicide']},
            'Corn_(maize)___healthy': {'severity': 'None', 'treatment': ['Continue care'], 'organic': ['Monitor regularly']},
            'Grape___Black_rot': {'severity': 'Critical', 'treatment': ['Remove infected parts', 'Apply fungicide'], 'organic': ['Sulfur', 'Copper']},
            'Grape___Esca_(Black_Measles)': {'severity': 'Critical', 'treatment': ['Prune affected branches', 'Apply fungicide'], 'organic': ['Copper sulfate']},
            'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)': {'severity': 'Medium', 'treatment': ['Remove leaves', 'Apply fungicide'], 'organic': ['Copper fungicide']},
            'Grape___healthy': {'severity': 'None', 'treatment': ['Continue care'], 'organic': ['Regular monitoring']},
            'Orange___Haunglongbing_(Citrus_greening)': {'severity': 'Critical', 'treatment': ['Remove infected trees', 'Control insects'], 'organic': ['Insect management']},
            'Peach___Bacterial_spot': {'severity': 'High', 'treatment': ['Prune infected branches', 'Apply copper'], 'organic': ['Copper spray']},
            'Peach___healthy': {'severity': 'None', 'treatment': ['Continue care'], 'organic': ['Monitor regularly']}
        }
        
        treatment_info = treatments.get(disease_name, {
            'severity': 'Unknown', 
            'treatment': ['Consult agricultural expert for diagnosis'], 
            'organic': ['Seek professional guidance']
        })
        
        logger.info(f"✓ Disease prediction: {disease_name} (confidence: {confidence*100:.2f}%, green_ratio: {green_ratio*100:.1f}%)")
        
        return DiseasePredictionResponse(
            crop="Plant/Leaf",
            disease=disease_name,
            confidence=confidence,
            severity=treatment_info['severity'],
            treatment=treatment_info['treatment'],
            organic_solutions=treatment_info['organic'],
            timestamp=datetime.now().isoformat()
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in disease detection: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Detection error: {str(e)}")

# ======================= WEATHER & MARKET =======================

@app.get(
    "/weather/advice",
    response_model=WeatherAdviceResponse,
    summary="Get farming advice based on weather",
    tags=["Weather"]
)
async def get_weather_advice(
    latitude: float,
    longitude: float,
    temperature: float = None,
    rainfall_forecast: float = None,
    humidity: float = None
):
    """Get farming recommendations based on weather"""
    try:
        advice = ""
        rec_level = "optimal"
        
        if temperature and temperature > 35:
            advice += "High temperature: Increase irrigation frequency. "
            rec_level = "caution"
        elif temperature and temperature < 10:
            advice += "Low temperature: Monitor frost risk. "
            rec_level = "warning"
        
        if rainfall_forecast and rainfall_forecast > 100:
            advice += "Heavy rainfall expected: Avoid fertilizer application for 48 hours. Ensure drainage. "
            rec_level = "caution"
        elif rainfall_forecast and rainfall_forecast < 10:
            advice += "Low rainfall: Plan irrigation schedule. "
            rec_level = "caution"
        
        if humidity and humidity > 80:
            advice += "High humidity: Watch for fungal diseases. Improve air circulation. "
            if rec_level != "warning":
                rec_level = "caution"
        elif humidity and humidity < 30:
            advice += "Low humidity: Increase irrigation. Monitor for pest activity. "
            if rec_level == "optimal":
                rec_level = "caution"
        
        if not advice:
            advice = "Weather conditions are favorable for farming. Continue regular maintenance."
        
        return WeatherAdviceResponse(
            location=f"({latitude}, {longitude})",
            temperature=temperature or 25.0,
            rainfall_forecast=rainfall_forecast or 0.0,
            humidity=humidity or 60.0,
            farming_advice=advice.strip(),
            recommendation_level=rec_level,
            timestamp=datetime.now().isoformat()
        )
    
    except Exception as e:
        logger.error(f"Error in weather advice: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get(
    "/market/predict-price",
    response_model=PriceResponse,
    summary="Predict crop market price",
    tags=["Market"]
)
async def predict_price(crop: str, current_price: float):
    """Predict crop market price for next week"""
    try:
        seasonal_factors = {
            'wheat': 0.95, 'rice': 1.02, 'tomato': 1.10,
            'potato': 0.98, 'maize': 1.05, 'sugarcane': 0.97,
            'cotton': 1.08, 'groundnut': 1.03
        }
        
        factor = seasonal_factors.get(crop.lower(), 1.0)
        predicted_price = current_price * factor
        
        if predicted_price > current_price * 1.05:
            trend = "up"
            rec = "Hold - Price expected to increase"
        elif predicted_price < current_price * 0.95:
            trend = "down"
            rec = "Consider selling - Price may decrease"
        else:
            trend = "stable"
            rec = "Hold - Price expected to remain stable"
        
        return PriceResponse(
            crop=crop.lower(),
            current_price=round(current_price, 2),
            predicted_price_next_week=round(predicted_price, 2),
            price_trend=trend,
            recommendation=rec,
            timestamp=datetime.now().isoformat()
        )
    
    except Exception as e:
        logger.error(f"Error in price prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ======================= UTILITY ENDPOINTS =======================

@app.get("/health", tags=["System"])
async def health_check():
    """Check ML service health"""
    return {
        "status": "healthy" if (crop_model and disease_model) else "degraded",
        "crop_model_loaded": crop_model is not None,
        "disease_model_loaded": disease_model is not None,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/", tags=["System"])
async def root():
    """API information"""
    return {
        "service": "AgriSmart ML Service",
        "version": "2.0.0",
        "endpoints": {
            "crop_prediction": "/predict-crop",
            "disease_detection": "/detect-disease",
            "weather_advice": "/weather/advice",
            "price_prediction": "/market/predict-price",
            "health_check": "/health",
            "docs": "/docs",
            "redoc": "/redoc"
        }
    }

# ======================= RUN SERVER =======================

if __name__ == "__main__":
    import uvicorn
    
    print("=" * 60)
    print("Starting AgriSmart ML Service v2.0...")
    print("Endpoints:")
    print("  - POST  /predict-crop")
    print("  - POST  /detect-disease")
    print("  - GET   /weather/advice")
    print("  - GET   /market/predict-price")
    print("  - GET   /health")
    print("  - GET   /docs (Swagger UI)")
    print("=" * 60)
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )

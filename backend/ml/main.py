"""
FastAPI ML Service - Production Grade
Integrates:
- Crop Prediction Model (RandomForest + GradientBoosting)
- Disease Detection Model (CNN)
- Weather Integration
- Market Price Prediction
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import numpy as np
import os
import sys
import io
from datetime import datetime
import logging
import traceback
from PIL import Image

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import our models
try:
    from crop_prediction_model import CropPredictionModel
    from disease_detection_model import DiseaseDetectionModel
    logger.info("[+] Models imported successfully")
except Exception as e:
    logger.error(f"[-] Error importing models: {str(e)}")
    traceback.print_exc()

# Initialize FastAPI app
app = FastAPI(
    title="AgriSmart ML Service",
    description="Real-time ML inference for agriculture",
    version="1.0.0"
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
crop_predictor = None
disease_detector = None

# ======================= MODELS INITIALIZATION =======================

def initialize_models():
    """Initialize ML models on startup"""
    global crop_predictor, disease_detector
    
    try:
        logger.info("[*] Initializing Crop Prediction Model...")
        crop_predictor = CropPredictionModel()
        crop_predictor.load_model(model_dir='models')
        logger.info("[+] Crop Prediction Model loaded successfully")
    except FileNotFoundError:
        logger.warning("[-] Crop model not found. Training new model...")
        crop_predictor = CropPredictionModel()
        df = crop_predictor.create_synthetic_dataset(n_samples=5000)
        X_scaled, y_encoded = crop_predictor.prepare_data(df)
        crop_predictor.train(X_scaled, y_encoded)
        crop_predictor.save_model()
    except Exception as e:
        logger.error(f"[-] Error loading crop model: {str(e)}")
    
    try:
        logger.info("[*] Initializing Disease Detection Model...")
        disease_detector = DiseaseDetectionModel()
        disease_detector.load_model(model_dir='models')
        logger.info("[+] Disease Detection Model loaded successfully")
    except FileNotFoundError:
        logger.warning("[-] Disease model not found.")
    except Exception as e:
        logger.warning(f"[-] Disease model not available: {str(e)}")

# ======================= REQUEST/RESPONSE MODELS =======================

class CropPredictionRequest(BaseModel):
    nitrogen: float = Field(..., ge=0, description="Nitrogen in mg/kg")
    phosphorus: float = Field(..., ge=0, description="Phosphorus in mg/kg")
    potassium: float = Field(..., ge=0, description="Potassium in mg/kg")
    temperature: float = Field(..., description="Temperature in °C")
    humidity: float = Field(..., ge=0, le=100, description="Humidity in %")
    ph: float = Field(..., ge=0, le=14, description="Soil pH")
    rainfall: float = Field(..., ge=0, description="Rainfall in mm")

class CropPredictionResponse(BaseModel):
    recommended_crops: List[str]
    confidence_scores: List[float]
    yield_estimation_kg_per_hectare: float
    profit_estimation_per_hectare: float
    timestamp: str

class DiseasePredictionResponse(BaseModel):
    crop_type: str
    disease_name: str
    confidence: float
    severity_level: str
    symptoms: List[str]
    causes: List[str]
    treatment_recommendations: List[str]
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
    """Initialize models when server starts"""
    logger.info("[*] Starting AgriSmart ML Service...")
    initialize_models()
    logger.info("[+] ML Service ready for inference")

# ======================= CROP PREDICTION ENDPOINTS =======================

@app.post(
    "/ml/predict-crop",
    response_model=CropPredictionResponse,
    summary="Predict suitable crops",
    tags=["Crop Prediction"]
)
async def predict_crop(request: CropPredictionRequest):
    """
    Predict suitable crops based on soil and weather conditions
    
    Input parameters:
    - nitrogen: Soil nitrogen level (N) in mg/kg
    - phosphorus: Soil phosphorus level (P) in mg/kg
    - potassium: Soil potassium level (K) in mg/kg
    - temperature: Average temperature in Celsius
    - humidity: Relative humidity in %
    - ph: Soil pH level
    - rainfall: Average rainfall in mm
    
    Returns:
    - recommended_crops: List of top 3 crops
    - confidence_scores: Confidence scores for each crop
    - yield_estimation_kg_per_hectare: Expected yield
    - profit_estimation_per_hectare: Expected profit in INR
    """
    try:
        if crop_predictor is None:
            raise HTTPException(status_code=503, detail="Crop prediction model not initialized")
        
        # Prepare input
        input_features = [
            request.nitrogen,
            request.phosphorus,
            request.potassium,
            request.temperature,
            request.humidity,
            request.ph,
            request.rainfall
        ]
        
        # Validate input ranges
        if not (0 <= request.ph <= 14):
            raise HTTPException(status_code=400, detail="pH must be between 0 and 14")
        
        if not (request.rainfall >= 0):
            raise HTTPException(status_code=400, detail="Rainfall cannot be negative")
        
        # Get prediction
        prediction = crop_predictor.predict_crops(input_features)
        
        return CropPredictionResponse(
            recommended_crops=prediction['recommended_crops'],
            confidence_scores=prediction['confidence_scores'],
            yield_estimation_kg_per_hectare=prediction['yield_estimation_kg_per_hectare'],
            profit_estimation_per_hectare=prediction['profit_estimation_per_hectare'],
            timestamp=datetime.now().isoformat()
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[-] Error in crop prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

# ======================= DISEASE DETECTION ENDPOINTS =======================

@app.post(
    "/ml/detect-disease",
    response_model=DiseasePredictionResponse,
    summary="Detect plant disease from image",
    tags=["Disease Detection"]
)
async def detect_disease(file: UploadFile = File(...)):
    """
    Detect plant disease from uploaded image
    
    Supported crops:
    - tomato
    - potato
    - rice
    - wheat
    
    Returns:
    - crop_type: Identified crop type
    - disease_name: Detected disease
    - confidence: Confidence score (0-1)
    - severity_level: Low, Medium, High, or Critical
    - symptoms: List of symptoms
    - causes: Root causes of disease
    - treatment_recommendations: Chemical treatments
    - organic_solutions: Organic alternatives
    """
    try:
        if disease_detector is None:
            raise HTTPException(status_code=503, detail="Disease detection model not initialized")
        
        # Check file format
        if not file.filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
            raise HTTPException(status_code=400, detail="Only image files allowed (jpg, png, gif)")
        
        # Read and save uploaded file temporarily
        contents = await file.read()
        temp_path = f"/tmp/{file.filename}"
        
        os.makedirs("/tmp", exist_ok=True)
        with open(temp_path, "wb") as f:
            f.write(contents)
        
        # Get prediction
        try:
            prediction = disease_detector.predict_disease(image_path=temp_path)
        finally:
            # Clean up temp file
            if os.path.exists(temp_path):
                os.remove(temp_path)
        
        return DiseasePredictionResponse(
            crop_type=prediction['crop_type'],
            disease_name=prediction['disease_name'],
            confidence=prediction['confidence'],
            severity_level=prediction['severity_level'],
            symptoms=prediction['symptoms'],
            causes=prediction['causes'],
            treatment_recommendations=prediction['treatment_recommendations'],
            organic_solutions=prediction['organic_solutions'],
            timestamp=datetime.now().isoformat()
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"[-] Error in disease detection: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Disease detection failed: {str(e)}")

# ======================= WEATHER & ADVISORY ENDPOINTS =======================

@app.get(
    "/weather/advice",
    response_model=WeatherAdviceResponse,
    summary="Get farming advice based on weather",
    tags=["Weather Intelligence"]
)
async def get_weather_advice(
    latitude: float,
    longitude: float,
    temperature: float = None,
    rainfall_forecast: float = None,
    humidity: float = None
):
    """
    Get farming recommendations based on current weather conditions
    
    Parameters:
    - latitude: Location latitude
    - longitude: Location longitude
    - temperature: Current temperature (°C)
    - rainfall_forecast: Expected rainfall (mm)
    - humidity: Relative humidity (%)
    
    Returns:
    - farming_advice: Actionable farming recommendations
    - recommendation_level: "caution", "optimal", or "warning"
    """
    try:
        # Generate advice based on weather
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
            advice = "Weather conditions are favorable for farming. Continue regular maintenance and monitoring."
        
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
        logger.error(f"[-] Error getting weather advice: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Weather advisory failed: {str(e)}")

# ======================= MARKET PRICE PREDICTION =======================

@app.get(
    "/market/predict-price",
    response_model=PriceResponse,
    summary="Predict crop market price",
    tags=["Market Price Prediction"]
)
async def predict_price(crop: str = Field(..., description="Crop name"), current_price: float = Field(..., description="Current price in INR")):
    """
    Predict crop market price for next week
    
    Parameters:
    - crop: Name of the crop (e.g., "wheat", "rice", "tomato")
    - current_price: Current market price in INR per kg
    
    Returns:
    - predicted_price_next_week: Predicted price
    - price_trend: "up", "down", or "stable"
    - recommendation: Sell or hold recommendation
    """
    try:
        if not crop:
            raise HTTPException(status_code=400, detail="Crop name is required")
        
        # Simulate price prediction (would use LSTM/ARIMA in production)
        seasonal_factors = {
            'wheat': 0.95,
            'rice': 1.02,
            'tomato': 1.10,
            'potato': 0.98,
            'maize': 1.05
        }
        
        factor = seasonal_factors.get(crop.lower(), 1.0)
        predicted_price = current_price * factor
        
        # Determine trend
        if predicted_price > current_price * 1.05:
            trend = "up"
            recommendation = "Hold - Price expected to increase"
        elif predicted_price < current_price * 0.95:
            trend = "down"
            recommendation = "Consider selling - Price may decrease"
        else:
            trend = "stable"
            recommendation = "Hold - Price expected to remain stable"
        
        return PriceResponse(
            crop=crop.lower(),
            current_price=round(current_price, 2),
            predicted_price_next_week=round(predicted_price, 2),
            price_trend=trend,
            recommendation=recommendation,
            timestamp=datetime.now().isoformat()
        )
    
    except Exception as e:
        logger.error(f"[-] Error predicting price: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Price prediction failed: {str(e)}")

# ======================= UTILITY ENDPOINTS =======================

@app.get("/health", tags=["System"])
async def health_check():
    """Check if ML service is running"""
    return {
        "status": "healthy",
        "service": "AgriSmart ML Service",
        "crop_predictor_ready": crop_predictor is not None,
        "disease_detector_ready": disease_detector is not None,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/", tags=["System"])
async def root():
    """Root endpoint with service information"""
    return {
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
        "timestamp": datetime.now().isoformat()
    }


# ======================= RUN SERVER =======================

if __name__ == "__main__":
    import uvicorn
    
    # Run with: python main.py
    # Or: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
    
    print("=" * 60)
    print("Starting AgriSmart ML Service...")
    print("=" * 60)
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )



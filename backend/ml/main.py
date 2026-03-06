from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import List, Optional
import os
import io
from PIL import Image
import base64
from models import crop_model, disease_model


app = FastAPI(title="AgriSmart ML API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:4000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Root endpoint
@app.get("/", tags=["info"])
def root():
    """Root endpoint - API info."""
    from datetime import datetime
    return {
        "service": "AgriSmart ML API",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.now().isoformat(),
        "endpoints": {
            "root": "/",
            "health": "/health",
            "crop_prediction": "/predict-crop",
            "disease_detection": "/detect-disease",
            "docs": "/docs"
        }
    }


@app.get("/health", tags=["info"])
def health():
    """Health check endpoint."""
    from datetime import datetime
    return {
        "status": "OK",
        "service": "AgriSmart ML API",
        "timestamp": datetime.now().isoformat()
    }


class CropFeatures(BaseModel):
    location: str = ""
    soilType: str = Field(..., description="e.g., 'Loam', 'Clay', 'Sand', 'Silt'")
    soilPH: float = Field(..., ge=0, le=14, description="pH value between 0-14")
    climate: str = Field(..., description="e.g., 'Tropical', 'Subtropical', 'Temperate'")
    waterAvailability: str = Field("Medium", description="Low, Medium, High, Very High")
    rainfall: float = Field(..., description="Annual rainfall in mm")
    temperature: float = Field(..., description="Average temperature in Celsius")
    workers: int = Field(..., ge=1, description="Number of farm workers")
    budget: float = Field(..., ge=0, description="Budget in INR")
    farmSize: float = Field(..., ge=0.1, description="Farm size in hectares")


class CropRecommendation(BaseModel):
    crop: str
    suitability: int
    expectedYield: str
    profit: str
    season: str
    duration: str
    waterNeed: str
    laborNeed: str
    marketDemand: str
    riskFactor: str
    confidence: int


class DiseaseDetectionResult(BaseModel):
    disease: str
    confidence: int
    severity: str
    description: str
    causes: List[str]
    treatments: List[str]
    prevention: List[str]
    affectedArea: int


@app.get("/health", tags=["system"])
def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "message": "AgriSmart ML API is running",
        "version": "1.0.0",
        "models": {
            "crop_prediction": "RandomForest + GradientBoosting",
            "disease_detection": "Image Classification",
        }
    }


@app.post("/crop/predict", response_model=List[CropRecommendation], tags=["crop"])
def predict_crop(features: CropFeatures):
    """
    Predict suitable crops based on soil, climate, and farm conditions.
    Uses trained RandomForest and GradientBoosting models.
    
    Returns top 3 crop recommendations with suitability scores.
    """
    try:
        predictions = crop_model.predict(features.dict())
        
        if not predictions:
            raise HTTPException(status_code=400, detail="Could not generate predictions. Check input parameters.")
        
        return predictions
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


@app.post("/disease/predict", response_model=DiseaseDetectionResult, tags=["disease"])
async def predict_disease(
    file: UploadFile = File(...),
    cropType: Optional[str] = "default"
):
    """
    Predict crop disease from uploaded image.
    
    Supports JPG, PNG, and other common image formats.
    Uses trained disease detection model with comprehensive disease database.
    
    Query Parameters:
    - cropType: Type of crop ('tomato', 'potato', 'wheat', 'rice', or 'default')
    """
    try:
        # Validate file
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file uploaded")
        
        # Read image file
        contents = await file.read()
        
        # Validate image
        try:
            image = Image.open(io.BytesIO(contents))
            image.thumbnail((500, 500))  # Resize for processing
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Invalid image format: {str(e)}")
        
        # Get prediction from model
        result = disease_model.predict(file.filename, crop_type=cropType)
        
        return result
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Disease detection error: {str(e)}")


@app.get("/crops", tags=["data"])
def get_crops_list():
    """Get list of supported crops."""
    return {
        "crops": [
            "Wheat", "Rice", "Maize", "Cotton", "Sugarcane",
            "Tomato", "Potato", "Groundnut", "Soybean", "Pepper"
        ]
    }


@app.get("/soil-types", tags=["data"])
def get_soil_types():
    """Get list of soil types."""
    return {
        "soilTypes": ["Loam", "Clay", "Sand", "Silt", "Peat"]
    }


@app.get("/climates", tags=["data"])
def get_climates():
    """Get list of climate types."""
    return {
        "climates": ["Tropical", "Subtropical", "Temperate", "Arid", "Semi-Arid"]
    }


@app.get("/water-availability", tags=["data"])
def get_water_availability():
    """Get water availability options."""
    return {
        "waterAvailability": ["Low", "Medium", "High", "Very High"]
    }


@app.get("/diseases", tags=["data"])
def get_diseases():
    """Get list of supported crop types and their diseases."""
    return {
        "supportedCrops": ["tomato", "potato", "wheat", "rice"],
        "diseases": disease_model.crop_diseases
    }


# Run with:
#   uvicorn main:app --reload --port 8000

if __name__ == "__main__":
    import uvicorn
    from datetime import datetime
    
    print(f"[{datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')[:-3]}] Starting ML Server...")
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info",
        access_log=True
    )


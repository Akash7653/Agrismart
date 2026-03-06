import express from 'express';
import multer from 'multer';
import axios from 'axios';
import { CropPrediction, DiseaseDetection, User } from '../src/models/schemas.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Multer configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/predictions';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// ===================== CROP PREDICTION ENDPOINTS =====================

/**
 * POST /api/predictions/crop
 * Store crop prediction with image
 */
router.post('/crop', upload.single('image'), async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId; // From auth middleware or request
    
    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    const {
      location,
      farmSize,
      soilType,
      soilPH,
      climate,
      rainfall,
      temperature,
      waterAvailability,
      budget,
      workers
    } = req.body;

    // Validate required fields
    if (!soilType || !climate || !soilPH || !rainfall || !temperature) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Call ML API for predictions
    let predictions = [];
    try {
      const mlResponse = await axios.post('http://localhost:8000/crop/predict', {
        location,
        farmSize: parseFloat(farmSize),
        soilType,
        soilPH: parseFloat(soilPH),
        climate,
        rainfall: parseFloat(rainfall),
        temperature: parseFloat(temperature),
        waterAvailability,
        budget: parseFloat(budget),
        workers: parseInt(workers)
      });
      predictions = mlResponse.data;
    } catch (mlError) {
      console.error('ML API Error:', mlError.message);
      // Fallback predictions if ML service is down
      predictions = [
        {
          crop: 'Wheat',
          suitability: 75,
          expectedYield: '22 quintals/hectare',
          profit: '₹72,000',
          season: 'Rabi',
          duration: '150 days',
          waterNeed: 'Medium',
          laborNeed: 'Medium',
          marketDemand: 'High',
          riskFactor: 'Low',
          confidence: 75
        }
      ];
    }

    // Read image file if uploaded
    let imageBase64 = null;
    if (req.file) {
      const imageBuffer = fs.readFileSync(req.file.path);
      imageBase64 = imageBuffer.toString('base64');
    }

    // Create prediction record
    const prediction = new CropPrediction({
      userId,
      location,
      farmSize: parseFloat(farmSize),
      soilType,
      soilPH: parseFloat(soilPH),
      climate,
      rainfall: parseFloat(rainfall),
      temperature: parseFloat(temperature),
      waterAvailability,
      budget: parseFloat(budget),
      workers: parseInt(workers),
      predictions,
      imageUrl: req.file ? `/uploads/predictions/${req.file.filename}` : null,
      imageBase64,
      imageName: req.file?.originalname,
      imageUploadDate: new Date(),
      status: 'completed'
    });

    const savedPrediction = await prediction.save();

    res.status(201).json({
      message: 'Crop prediction saved successfully',
      predictionId: savedPrediction._id,
      predictions: savedPrediction.predictions,
      timestamp: savedPrediction.createdAt
    });

  } catch (error) {
    console.error('Error in crop prediction:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/predictions/crop/:userId
 * Get user's crop predictions
 */
router.get('/crop/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, skip = 0 } = req.query;

    const predictions = await CropPrediction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .select('-imageData'); // Don't send binary data in list

    const total = await CropPrediction.countDocuments({ userId });

    res.json({
      predictions,
      total,
      skip: parseInt(skip),
      limit: parseInt(limit)
    });

  } catch (error) {
    console.error('Error fetching crop predictions:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/predictions/crop/:userId/:predictionId
 * Get specific crop prediction with image
 */
router.get('/crop/:userId/:predictionId', async (req, res) => {
  try {
    const { userId, predictionId } = req.params;

    const prediction = await CropPrediction.findOne({
      _id: predictionId,
      userId
    });

    if (!prediction) {
      return res.status(404).json({ error: 'Prediction not found' });
    }

    res.json(prediction);

  } catch (error) {
    console.error('Error fetching prediction:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/predictions/crop/:userId/:predictionId
 * Delete crop prediction
 */
router.delete('/crop/:userId/:predictionId', async (req, res) => {
  try {
    const { userId, predictionId } = req.params;

    const prediction = await CropPrediction.findOneAndDelete({
      _id: predictionId,
      userId
    });

    if (!prediction) {
      return res.status(404).json({ error: 'Prediction not found' });
    }

    // Delete image file if exists
    if (prediction.imageUrl) {
      const imagePath = path.join(process.cwd(), prediction.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ message: 'Prediction deleted successfully' });

  } catch (error) {
    console.error('Error deleting prediction:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===================== DISEASE DETECTION ENDPOINTS =====================

/**
 * POST /api/predictions/disease
 * Store disease detection with image
 */
router.post('/disease', upload.single('image'), async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    const { cropType } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    // Call ML API for disease detection
    let diseaseResult = {};
    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(req.file.path));
      formData.append('cropType', cropType || 'default');

      const mlResponse = await axios.post('http://localhost:8000/disease/predict', formData, {
        headers: formData.getHeaders()
      });
      diseaseResult = mlResponse.data;
    } catch (mlError) {
      console.error('ML API Error:', mlError.message);
      // Fallback detection if ML service is down
      diseaseResult = {
        disease: 'Detection Pending',
        confidence: 0,
        severity: 'Unknown',
        description: 'ML service unavailable. Please try again.',
        causes: [],
        treatments: [],
        prevention: [],
        affectedArea: 0
      };
    }

    // Read image file
    const imageBuffer = fs.readFileSync(req.file.path);
    const imageBase64 = imageBuffer.toString('base64');

    // Create detection record
    const detection = new DiseaseDetection({
      userId,
      cropType,
      imageUrl: `/uploads/predictions/${req.file.filename}`,
      imageBase64,
      imageName: req.file.originalname,
      imageUploadDate: new Date(),
      disease: diseaseResult.disease,
      confidence: diseaseResult.confidence,
      severity: diseaseResult.severity,
      description: diseaseResult.description,
      causes: diseaseResult.causes,
      treatments: diseaseResult.treatments,
      prevention: diseaseResult.prevention,
      affectedArea: diseaseResult.affectedArea,
      status: 'completed'
    });

    const savedDetection = await detection.save();

    res.status(201).json({
      message: 'Disease detection saved successfully',
      detectionId: savedDetection._id,
      disease: savedDetection.disease,
      confidence: savedDetection.confidence,
      severity: savedDetection.severity,
      treatments: savedDetection.treatments,
      prevention: savedDetection.prevention,
      timestamp: savedDetection.createdAt
    });

  } catch (error) {
    console.error('Error in disease detection:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/predictions/disease/:userId
 * Get user's disease detections
 */
router.get('/disease/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, skip = 0 } = req.query;

    const detections = await DiseaseDetection.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .select('-imageData');

    const total = await DiseaseDetection.countDocuments({ userId });

    res.json({
      detections,
      total,
      skip: parseInt(skip),
      limit: parseInt(limit)
    });

  } catch (error) {
    console.error('Error fetching disease detections:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/predictions/disease/:userId/:detectionId
 * Get specific disease detection with image
 */
router.get('/disease/:userId/:detectionId', async (req, res) => {
  try {
    const { userId, detectionId } = req.params;

    const detection = await DiseaseDetection.findOne({
      _id: detectionId,
      userId
    });

    if (!detection) {
      return res.status(404).json({ error: 'Detection not found' });
    }

    res.json(detection);

  } catch (error) {
    console.error('Error fetching detection:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/predictions/disease/:userId/:detectionId
 * Delete disease detection
 */
router.delete('/disease/:userId/:detectionId', async (req, res) => {
  try {
    const { userId, detectionId } = req.params;

    const detection = await DiseaseDetection.findOneAndDelete({
      _id: detectionId,
      userId
    });

    if (!detection) {
      return res.status(404).json({ error: 'Detection not found' });
    }

    // Delete image file if exists
    if (detection.imageUrl) {
      const imagePath = path.join(process.cwd(), detection.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ message: 'Detection deleted successfully' });

  } catch (error) {
    console.error('Error deleting detection:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

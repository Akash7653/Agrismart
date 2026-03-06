import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();
const uri = process.env.MONGODB_URI || 'mongodb+srv://udayfranklin121_db_user:iTPtuaBi6M80NQEs@cluster0.wficn2x.mongodb.net/agrismart?retryWrites=true&w=majority';
const client = new MongoClient(uri);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/disease-detection');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// POST analyze disease
router.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    const { userId, crop } = req.body;
    
    if (!userId || !crop) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }
    
    await client.connect();
    const database = client.db('agrismart');
    
    // Simulate AI disease detection (in real app, this would call ML model)
    const diseases = [
      {
        name: 'Leaf Blight',
        confidence: 92,
        severity: 'High',
        description: 'A fungal disease affecting leaves, causing yellowing and browning of leaf margins.',
        causes: [
          'High humidity and warm temperatures',
          'Poor air circulation',
          'Overhead irrigation'
        ],
        treatments: [
          'Apply fungicide spray (copper-based)',
          'Remove infected leaves immediately',
          'Improve air circulation',
          'Reduce overhead watering'
        ],
        prevention: [
          'Ensure proper plant spacing',
          'Water at base of plants',
          'Monitor humidity levels',
          'Use resistant varieties'
        ]
      },
      {
        name: 'Powdery Mildew',
        confidence: 87,
        severity: 'Medium',
        description: 'A fungal disease that appears as white powdery spots on leaves and stems.',
        causes: [
          'High humidity',
          'Poor air circulation',
          'Moderate temperatures'
        ],
        treatments: [
          'Apply sulfur-based fungicide',
          'Remove affected parts',
          'Improve ventilation'
        ],
        prevention: [
          'Plant resistant varieties',
          'Ensure proper spacing',
          'Monitor humidity'
        ]
      },
      {
        name: 'Root Rot',
        confidence: 78,
        severity: 'High',
        description: 'A disease that affects the root system, causing decay and poor plant growth.',
        causes: [
          'Overwatering',
          'Poor drainage',
          'Soil-borne pathogens'
        ],
        treatments: [
          'Improve drainage',
          'Apply fungicide drench',
          'Reduce watering frequency'
        ],
        prevention: [
          'Well-draining soil',
          'Proper watering schedule',
          'Soil sterilization'
        ]
      }
    ];
    
    // Select random disease for demo
    const detectedDisease = diseases[Math.floor(Math.random() * diseases.length)];
    const affectedArea = Math.floor(Math.random() * 40 + 10); // 10-50%
    
    const detection = {
      userId,
      crop,
      disease: detectedDisease.name,
      confidence: detectedDisease.confidence,
      severity: detectedDisease.severity,
      description: detectedDisease.description,
      causes: detectedDisease.causes,
      treatments: detectedDisease.treatments,
      prevention: detectedDisease.prevention,
      affectedArea,
      imageUrl: `/uploads/disease-detection/${req.file.filename}`,
      detectedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await database.collection('diseaseDetections').insertOne(detection);
    
    // Add to user history
    await database.collection('userHistory').insertOne({
      userId,
      action: 'disease_detection',
      details: {
        detectionId: result.insertedId.toString(),
        crop,
        disease: detectedDisease.name,
        confidence: detectedDisease.confidence
      },
      timestamp: new Date(),
      createdAt: new Date()
    });
    
    res.json({
      success: true,
      message: 'Disease detection completed successfully',
      data: {
        id: result.insertedId.toString(),
        ...detection
      }
    });
    
    await client.close();
  } catch (error) {
    console.error('Error analyzing disease:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing disease'
    });
  }
});

// GET user disease detections
router.get('/user-detections/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    await client.connect();
    const database = client.db('agrismart');
    
    const detections = await database.collection('diseaseDetections')
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json({
      success: true,
      data: detections
    });
    
    await client.close();
  } catch (error) {
    console.error('Error fetching disease detections:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching disease detections'
    });
  }
});

// GET detection by ID
router.get('/detection/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await client.connect();
    const database = client.db('agrismart');
    
    const detection = await database.collection('diseaseDetections').findOne({ _id: new ObjectId(id) });
    
    if (!detection) {
      return res.status(404).json({
        success: false,
        message: 'Detection not found'
      });
    }
    
    res.json({
      success: true,
      data: detection
    });
    
    await client.close();
  } catch (error) {
    console.error('Error fetching detection:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching detection'
    });
  }
});

// GET common diseases
router.get('/common-diseases', async (req, res) => {
  try {
    const commonDiseases = [
      {
        id: 'leaf_blight',
        name: 'Leaf Blight',
        crops: ['Wheat', 'Rice', 'Corn'],
        severity: 'High',
        description: 'Fungal disease causing leaf damage',
        symptoms: 'Yellowing and browning of leaf margins',
        prevention: 'Proper spacing, good air circulation'
      },
      {
        id: 'powdery_mildew',
        name: 'Powdery Mildew',
        crops: ['Vegetables', 'Fruits'],
        severity: 'Medium',
        description: 'White powdery growth on leaves',
        symptoms: 'White spots on leaves and stems',
        prevention: 'Resistant varieties, proper ventilation'
      },
      {
        id: 'root_rot',
        name: 'Root Rot',
        crops: ['All crops'],
        severity: 'High',
        description: 'Root system decay',
        symptoms: 'Wilting, yellowing, stunted growth',
        prevention: 'Well-draining soil, proper watering'
      },
      {
        id: 'rust',
        name: 'Rust',
        crops: ['Wheat', 'Corn'],
        severity: 'Medium',
        description: 'Rust-colored pustules on leaves',
        symptoms: 'Orange-brown spots on leaves',
        prevention: 'Resistant varieties, fungicide application'
      }
    ];
    
    res.json({
      success: true,
      data: commonDiseases
    });
  } catch (error) {
    console.error('Error fetching common diseases:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching common diseases'
    });
  }
});

export default router;

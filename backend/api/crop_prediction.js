import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';

const router = express.Router();
const uri = process.env.MONGODB_URI || 'mongodb+srv://udayfranklin121_db_user:iTPtuaBi6M80NQEs@cluster0.wficn2x.mongodb.net/agrismart?retryWrites=true&w=majority';
const client = new MongoClient(uri);

// POST create crop prediction
router.post('/predict', async (req, res) => {
  try {
    const { userId, crop, soilType, location, season, rainfall, temperature } = req.body;
    
    if (!userId || !crop || !soilType || !location) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    await client.connect();
    const database = client.db('agrismart');
    
    // Simulate AI prediction (in real app, this would call ML model)
    const predictedYield = Math.floor(Math.random() * 3 + 2) + ' tons/hectare';
    const confidence = Math.floor(Math.random() * 15 + 85);
    
    const recommendations = [
      'Use organic fertilizers for better yield',
      'Irrigation schedule: Every 7 days',
      'Monitor for pest infestation',
      'Maintain proper soil pH levels',
      'Consider crop rotation for soil health'
    ];
    
    const prediction = {
      userId,
      crop,
      soilType,
      location,
      season: season || 'Current',
      rainfall: rainfall || 'Moderate',
      temperature: temperature || '25°C',
      predictedYield,
      confidence,
      recommendations: recommendations.slice(0, 3),
      predictedDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 3 months from now
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await database.collection('cropPredictions').insertOne(prediction);
    
    // Add to user history
    await database.collection('userHistory').insertOne({
      userId,
      action: 'crop_prediction',
      details: {
        predictionId: result.insertedId.toString(),
        crop,
        location,
        predictedYield,
        confidence
      },
      timestamp: new Date(),
      createdAt: new Date()
    });
    
    res.json({
      success: true,
      message: 'Crop prediction completed successfully',
      data: {
        id: result.insertedId.toString(),
        ...prediction
      }
    });
    
    await client.close();
  } catch (error) {
    console.error('Error creating crop prediction:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating crop prediction'
    });
  }
});

// GET user crop predictions
router.get('/user-predictions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    await client.connect();
    const database = client.db('agrismart');
    
    const predictions = await database.collection('cropPredictions')
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json({
      success: true,
      data: predictions
    });
    
    await client.close();
  } catch (error) {
    console.error('Error fetching crop predictions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching crop predictions'
    });
  }
});

// GET prediction by ID
router.get('/prediction/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await client.connect();
    const database = client.db('agrismart');
    
    const prediction = await database.collection('cropPredictions').findOne({ _id: new ObjectId(id) });
    
    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: 'Prediction not found'
      });
    }
    
    res.json({
      success: true,
      data: prediction
    });
    
    await client.close();
  } catch (error) {
    console.error('Error fetching prediction:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching prediction'
    });
  }
});

// GET all crops available
router.get('/crops', async (req, res) => {
  try {
    const crops = [
      { id: 'wheat', name: 'Wheat', season: 'Winter', waterRequirement: 'Moderate' },
      { id: 'rice', name: 'Rice', season: 'Monsoon', waterRequirement: 'High' },
      { id: 'corn', name: 'Corn', season: 'Summer', waterRequirement: 'Moderate' },
      { id: 'cotton', name: 'Cotton', season: 'Summer', waterRequirement: 'Low' },
      { id: 'sugarcane', name: 'Sugarcane', season: 'Year-round', waterRequirement: 'High' },
      { id: 'pulses', name: 'Pulses', season: 'Winter', waterRequirement: 'Low' },
      { id: 'vegetables', name: 'Vegetables', season: 'Year-round', waterRequirement: 'Moderate' },
      { id: 'fruits', name: 'Fruits', season: 'Year-round', waterRequirement: 'Moderate' }
    ];
    
    res.json({
      success: true,
      data: crops
    });
  } catch (error) {
    console.error('Error fetching crops:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching crops'
    });
  }
});

// GET soil types
router.get('/soil-types', async (req, res) => {
  try {
    const soilTypes = [
      { id: 'clay', name: 'Clay Soil', description: 'Heavy soil, good water retention' },
      { id: 'sandy', name: 'Sandy Soil', description: 'Light soil, good drainage' },
      { id: 'loamy', name: 'Loamy Soil', description: 'Balanced soil, ideal for most crops' },
      { id: 'silt', name: 'Silt Soil', description: 'Fertile soil, good water retention' },
      { id: 'peaty', name: 'Peaty Soil', description: 'Organic rich soil, acidic' },
      { id: 'chalky', name: 'Chalky Soil', description: 'Alkaline soil, good drainage' }
    ];
    
    res.json({
      success: true,
      data: soilTypes
    });
  } catch (error) {
    console.error('Error fetching soil types:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching soil types'
    });
  }
});

export default router;

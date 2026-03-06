import express from 'express';
import { getDatabase } from '../db-client.js';

const router = express.Router();

// GET all diseases
router.get('/all', async (req, res) => {
  try {
    const database = await getDatabase();
    const diseases = await database.collection('diseases').find({}).toArray();
    
    res.json({
      success: true,
      data: diseases
    });
  } catch (error) {
    console.error('Error fetching diseases:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching diseases'
    });
  }
});

// GET diseases for crop
router.get('/for-crop/:crop', async (req, res) => {
  try {
    const database = await getDatabase();
    const diseases = await database.collection('diseases')
      .find({ affectedCrops: req.params.crop })
      .toArray();
    
    res.json({
      success: true,
      data: diseases
    });
  } catch (error) {
    console.error('Error fetching diseases:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching diseases'
    });
  }
});

// GET disease by name
router.get('/:name', async (req, res) => {
  try {
    const database = await getDatabase();
    const disease = await database.collection('diseases').findOne({ name: req.params.name });
    
    if (!disease) {
      return res.status(404).json({
        success: false,
        message: 'Disease not found'
      });
    }
    
    res.json({
      success: true,
      data: disease
    });
  } catch (error) {
    console.error('Error fetching disease:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching disease'
    });
  }
});

export default router;

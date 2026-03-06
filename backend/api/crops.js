import express from 'express';
import { getDatabase } from '../db-client.js';

const router = express.Router();

// GET all crops
router.get('/all', async (req, res) => {
  try {
    const database = await getDatabase();
    const crops = await database.collection('crops').find({}).toArray();
    
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

// GET crop by name
router.get('/:name', async (req, res) => {
  try {
    const database = await getDatabase();
    const crop = await database.collection('crops').findOne({ name: req.params.name });
    
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop not found'
      });
    }
    
    res.json({
      success: true,
      data: crop
    });
  } catch (error) {
    console.error('Error fetching crop:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching crop'
    });
  }
});

export default router;

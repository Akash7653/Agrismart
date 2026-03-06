import express from 'express';
import { getDatabase } from '../db-client.js';

const router = express.Router();

// GET all products
router.get('/products', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
    const database = await getDatabase();
    
    let filter = { inStock: true };
    
    if (category) {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const products = await database
      .collection('products')
      .find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .toArray();
    
    const total = await database.collection('products').countDocuments(filter);
    
    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products'
    });
  }
});

// GET single product
router.get('/product/:id', async (req, res) => {
  try {
    const database = await getDatabase();
    const { ObjectId } = await import('mongodb');
    
    const product = await database
      .collection('products')
      .findOne({ _id: new ObjectId(req.params.id) });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product'
    });
  }
});

// GET product categories
router.get('/categories', async (req, res) => {
  try {
    const database = await getDatabase();
    
    const categories = await database
      .collection('products')
      .distinct('category');
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories'
    });
  }
});

// Search products
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    const database = await getDatabase();
    
    const results = await database
      .collection('products')
      .find({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { category: { $regex: q, $options: 'i' } }
        ]
      })
      .limit(10)
      .toArray();
    
    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching products'
    });
  }
});

export default router;

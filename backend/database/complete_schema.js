// Complete Database Schema for AgriSmart
// MongoDB Collections with Sample Data
// Run this script with: node database/complete_schema.js

import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

// MongoDB connection
const uri = 'mongodb+srv://udayfranklin121_db_user:iTPtuaBi6M80NQEs@cluster0.wficn2x.mongodb.net/agrismart?retryWrites=true&w=majority';
const client = new MongoClient(uri);

// Sample Data
const sampleData = {
  // Users Collection
  users: [
    {
      name: 'Ramesh Kumar',
      email: 'ramesh.kumar@agrismart.com',
      phone: '+919876543201',
      country: 'India',
      language: 'hi',
      joinDate: new Date('2023-01-15'),
      isVerified: true,
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Priya Patel',
      email: 'priya.patel@agrismart.com',
      phone: '+919876543202',
      country: 'India',
      language: 'gu',
      joinDate: new Date('2023-02-20'),
      isVerified: true,
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Amit Singh',
      email: 'amit.singh@agrismart.com',
      phone: '+919876543203',
      country: 'India',
      language: 'pa',
      joinDate: new Date('2023-03-10'),
      isVerified: true,
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  // Marketplace Products Collection
  products: [
    {
      id: '1',
      name: 'Organic Wheat Seeds - Heritage Variety',
      category: 'seeds',
      price: 450,
      originalPrice: 550,
      rating: 4.8,
      reviews: 127,
      image: '/images/products/organic-wheat-seeds.jpg',
      description: 'Premium heritage wheat seeds with 95% germination rate and disease resistance. Perfect for organic farming.',
      inStock: true,
      discount: 18,
      seller: 'AgriSeeds Pro',
      delivery: '2-3 days',
      features: ['95% Germination', 'Disease Resistant', 'High Yield', 'Certified Organic'],
      certification: 'INDIA ORGANIC',
      origin: 'Madhya Pradesh, India',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Vermicompost - Premium Grade',
      category: 'fertilizers',
      price: 12,
      rating: 4.7,
      reviews: 89,
      image: '/images/products/vermicompost.jpg',
      description: '100% organic vermicompost produced from cow dung and agricultural waste. Rich in essential nutrients.',
      inStock: true,
      seller: 'NutriGrow',
      delivery: '1-2 days',
      features: ['100% Organic', 'Balanced NPK', 'Water Soluble', 'All Crops'],
      certification: 'ORGANIC INDIA',
      origin: 'Punjab, India',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      name: 'Neem Oil Bio-Pesticide - 500ml',
      category: 'pesticides',
      price: 180,
      rating: 4.7,
      reviews: 156,
      image: '/images/products/neem-oil.jpg',
      description: '100% organic neem oil pesticide for safe and effective pest control. Harmless to beneficial insects.',
      inStock: true,
      discount: 10,
      seller: 'BioProtect',
      delivery: '2-3 days',
      features: ['100% Organic', 'Broad Spectrum', 'Eco-Friendly', 'Safe for Edibles'],
      certification: 'NPOP CERTIFIED',
      origin: 'Maharashtra, India',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '4',
      name: 'Drip Irrigation Kit - Complete Set',
      category: 'irrigation',
      price: 2800,
      originalPrice: 3500,
      rating: 4.9,
      reviews: 234,
      image: '/images/products/drip-irrigation.jpg',
      description: 'Complete drip irrigation system with pipes, emitters, and connectors. Water efficient solution for modern farming.',
      inStock: true,
      discount: 20,
      seller: 'IrrigationTech',
      delivery: '5-7 days',
      features: ['Water Efficient', 'Easy Installation', 'Durable Materials', '1 Year Warranty'],
      certification: 'ISO 9001',
      origin: 'Gujarat, India',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '5',
      name: 'Organic Tomato Seeds - Hybrid',
      category: 'seeds',
      price: 320,
      rating: 4.6,
      reviews: 98,
      image: '/images/products/tomato-seeds.jpg',
      description: 'High-yield hybrid tomato seeds resistant to common diseases. Perfect for greenhouse and open field cultivation.',
      inStock: true,
      seller: 'HybridSeeds Co',
      delivery: '2-3 days',
      features: ['Hybrid Variety', 'Disease Resistant', 'High Yield', 'Certified Organic'],
      certification: 'INDIA ORGANIC',
      origin: 'Karnataka, India',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '6',
      name: 'Bio-Fungicide - Organic Formula',
      category: 'pesticides',
      price: 250,
      rating: 4.5,
      reviews: 67,
      image: '/images/products/bio-fungicide.jpg',
      description: 'Organic bio-fungicide for effective control of fungal diseases in all crops. Safe for organic farming.',
      inStock: true,
      seller: 'BioProtect',
      delivery: '2-3 days',
      features: ['100% Organic', 'Broad Spectrum', 'No Residue', 'Safe for Environment'],
      certification: 'ORGANIC INDIA',
      origin: 'Tamil Nadu, India',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  // Crop Predictions Collection
  cropPredictions: [
    {
      userId: '1',
      crop: 'Wheat',
      soilType: 'Loamy',
      location: 'Punjab',
      season: 'Winter',
      rainfall: '400mm',
      temperature: '25°C',
      predictedYield: '3.5 tons/hectare',
      confidence: 92,
      recommendations: [
        'Use organic fertilizers for better yield',
        'Irrigation schedule: Every 7 days',
        'Monitor for pest infestation'
      ],
      predictedDate: new Date('2024-03-15'),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      userId: '2',
      crop: 'Rice',
      soilType: 'Clay',
      location: 'Tamil Nadu',
      season: 'Monsoon',
      rainfall: '800mm',
      temperature: '28°C',
      predictedYield: '4.2 tons/hectare',
      confidence: 88,
      recommendations: [
        'Maintain water level at 2-3 inches',
        'Use nitrogen-rich fertilizers',
        'Control weeds manually'
      ],
      predictedDate: new Date('2024-06-20'),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  // Disease Detection Results Collection
  diseaseDetections: [
    {
      userId: '1',
      crop: 'Tomato',
      disease: 'Leaf Blight',
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
      ],
      affectedArea: 35,
      imageUrl: '/uploads/disease-detection/tomato-leaf-blight.jpg',
      detectedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      userId: '2',
      crop: 'Wheat',
      disease: 'Powdery Mildew',
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
      ],
      affectedArea: 20,
      imageUrl: '/uploads/disease-detection/wheat-powdery-mildew.jpg',
      detectedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],

  // User History Collection
  userHistory: [
    {
      userId: '1',
      action: 'crop_prediction',
      details: {
        crop: 'Wheat',
        location: 'Punjab',
        predictedYield: '3.5 tons/hectare'
      },
      timestamp: new Date('2024-01-15T10:30:00Z'),
      createdAt: new Date()
    },
    {
      userId: '1',
      action: 'disease_detection',
      details: {
        crop: 'Tomato',
        disease: 'Leaf Blight',
        confidence: 92
      },
      timestamp: new Date('2024-01-16T14:20:00Z'),
      createdAt: new Date()
    },
    {
      userId: '1',
      action: 'marketplace_purchase',
      details: {
        product: 'Organic Wheat Seeds',
        price: 450,
        quantity: 2
      },
      timestamp: new Date('2024-01-17T09:15:00Z'),
      createdAt: new Date()
    },
    {
      userId: '2',
      action: 'consultation_booking',
      details: {
        expert: 'Dr. Ananya Reddy',
        type: 'Video Consultation',
        date: '2024-01-18T15:00:00Z'
      },
      timestamp: new Date('2024-01-17T11:45:00Z'),
      createdAt: new Date()
    }
  ],

  // Orders Collection
  orders: [
    {
      userId: '1',
      orderNumber: 'ORD-2024-001',
      items: [
        {
          productId: '1',
          name: 'Organic Wheat Seeds - Heritage Variety',
          price: 450,
          quantity: 2,
          subtotal: 900
        }
      ],
      totalAmount: 900,
      status: 'delivered',
      paymentStatus: 'paid',
      paymentId: 'rzp_test_1234567890',
      shippingAddress: {
        name: 'Ramesh Kumar',
        phone: '+919876543201',
        address: '123 Farm Road, Village Punjab',
        city: 'Ludhiana',
        state: 'Punjab',
        pincode: '141001'
      },
      orderDate: new Date('2024-01-17T09:15:00Z'),
      deliveryDate: new Date('2024-01-20T18:00:00Z'),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
};

async function initializeDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    const database = client.db('agrismart');
    
    console.log('Initializing complete database schema...');
    
    // Initialize each collection with sample data
    for (const [collectionName, data] of Object.entries(sampleData)) {
      console.log(`Initializing ${collectionName} collection...`);
      
      // Check if collection has data
      const existingCount = await database.collection(collectionName).countDocuments();
      
      if (existingCount === 0) {
        console.log(`Adding ${data.length} documents to ${collectionName}...`);
        await database.collection(collectionName).insertMany(data);
        console.log(`✅ ${collectionName} collection initialized with ${data.length} documents`);
      } else {
        console.log(`⚠️ ${collectionName} collection already has ${existingCount} documents`);
      }
    }
    
    console.log('✅ Database initialization complete!');
    console.log('📊 Collections initialized:');
    
    for (const collectionName of Object.keys(sampleData)) {
      const count = await database.collection(collectionName).countDocuments();
      console.log(`   - ${collectionName}: ${count} documents`);
    }
    
    await client.close();
    console.log('🔌 Database connection closed');
    
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    process.exit(1);
  }
}

// Run initialization
initializeDatabase();

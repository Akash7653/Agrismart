import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agrismart';

async function seedData() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('agrismart');
    
    // Seed Crops
    await db.collection('crops').deleteMany({});
    const crops = [
      {
        name: 'Wheat',
        description: 'Essential grain crop for flour and staple food',
        image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=300&fit=crop',
        season: 'Winter',
        soilType: 'Well-drained loamy soil',
        waterRequirement: '400-500 mm',
        growthPeriod: '120-140 days',
        yield: '40-50 quintals/hectare'
      },
      {
        name: 'Rice',
        description: 'Primary staple crop with high nutritional value',
        image: 'https://images.unsplash.com/photo-1586253409-caaa0ef0a0d0?w=400&h=300&fit=crop',
        season: 'Monsoon',
        soilType: 'Clay loam soil',
        waterRequirement: '1000-1500 mm',
        growthPeriod: '120-150 days',
        yield: '50-60 quintals/hectare'
      },
      {
        name: 'Maize',
        description: 'Versatile crop used for food, feed, and industrial purposes',
        image: 'https://images.unsplash.com/photo-1588694690545-6c1465f13134?w=400&h=300&fit=crop',
        season: 'Kharif & Rabi',
        soilType: 'Well-drained soil',
        waterRequirement: '500-600 mm',
        growthPeriod: '90-120 days',
        yield: '35-45 quintals/hectare'
      },
      {
        name: 'Cotton',
        description: 'Cash crop for textile and industrial use',
        image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd26431?w=400&h=300&fit=crop',
        season: 'Kharif',
        soilType: 'Black soil',
        waterRequirement: '600-800 mm',
        growthPeriod: '180-210 days',
        yield: '15-20 quintals/hectare'
      },
      {
        name: 'Sugarcane',
        description: 'Important crop for sugar and jaggery production',
        image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd26431?w=400&h=300&fit=crop',
        season: 'Year-round',
        soilType: 'Alluvial soil',
        waterRequirement: '1500-2250 mm',
        growthPeriod: '12-18 months',
        yield: '50-60 tonnes/hectare'
      }
    ];
    
    const cropsResult = await db.collection('crops').insertMany(crops);
    console.log(`✅ Inserted ${cropsResult.insertedIds.length} crops`);
    
    // Seed Diseases
    await db.collection('diseases').deleteMany({});
    const diseases = [
      {
        name: 'Bacterial Leaf Spot',
        affectedCrops: ['Tomato', 'Pepper', 'Cotton'],
        description: 'Bacterial disease causing dark water-soaked spots on leaves',
        symptoms: 'Dark, angular lesions with yellow halo on leaves and fruit',
        treatment: 'Use disease-resistant varieties, proper sanitation, copper fungicide spray',
        image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd26431?w=400&h=300&fit=crop',
        severity: 'High'
      },
      {
        name: 'Powdery Mildew',
        affectedCrops: ['Wheat', 'Barley', 'Grapes'],
        description: 'Fungal disease causing white powder-like coating',
        symptoms: 'White powdery coating on leaves, stems, and flowers',
        treatment: 'Sulfur dust, neem spray, improve air circulation',
        image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=300&fit=crop',
        severity: 'Medium'
      },
      {
        name: 'Early Blight',
        affectedCrops: ['Potato', 'Tomato'],
        description: 'Fungal disease affecting leaves and stems',
        symptoms: 'Brown concentric rings on older leaves, stem cankers',
        treatment: 'Copper fungicide, remove infected leaves, crop rotation',
        image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd26431?w=400&h=300&fit=crop',
        severity: 'High'
      },
      {
        name: 'Rice Blast',
        affectedCrops: ['Rice'],
        description: 'Serious fungal disease affecting rice crops',
        symptoms: 'Spindle-shaped lesions on leaves, gray-green discoloration',
        treatment: 'Disease-resistant varieties, proper nitrogen management, fungicide spray',
        image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd26431?w=400&h=300&fit=crop',
        severity: 'Very High'
      },
      {
        name: 'Leaf Rust',
        affectedCrops: ['Wheat', 'Barley'],
        description: 'Fungal disease causing rust-colored pustules',
        symptoms: 'Rust-colored powder on leaf undersides, orange pustules',
        treatment: 'Disease-resistant varieties, fungicide spray, remove weeds',
        image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd26431?w=400&h=300&fit=crop',
        severity: 'High'
      }
    ];
    
    const diseasesResult = await db.collection('diseases').insertMany(diseases);
    console.log(`✅ Inserted ${diseasesResult.insertedIds.length} diseases`);
    
    // Seed Products
    await db.collection('products').deleteMany({});
    const products = [
      {
        name: 'Organic Wheat Flour',
        category: 'Grains',
        description: 'Pure organic wheat flour without any additives',
        price: 80,
        image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd26431?w=400&h=300&fit=crop',
        rating: 4.7,
        reviews: 156,
        inStock: true,
        quantity: 50
      },
      {
        name: 'Chemical-Free Rice',
        category: 'Grains',
        description: 'Premium quality rice grown without chemical pesticides',
        price: 120,
        image: 'https://images.unsplash.com/photo-1586253409-caaa0ef0a0d0?w=400&h=300&fit=crop',
        rating: 4.8,
        reviews: 203,
        inStock: true,
        quantity: 75
      },
      {
        name: 'Organic Turmeric Powder',
        category: 'Spices',
        description: 'Pure turmeric powder with no additives',
        price: 220,
        image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd26431?w=400&h=300&fit=crop',
        rating: 4.6,
        reviews: 134,
        inStock: true,
        quantity: 30
      },
      {
        name: 'Farm Fresh Honey',
        category: 'Natural Products',
        description: 'Raw honey directly from our farm apiaries',
        price: 350,
        image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd26431?w=400&h=300&fit=crop',
        rating: 4.9,
        reviews: 267,
        inStock: true,
        quantity: 20
      },
      {
        name: 'Organic Cotton T-Shirt',
        category: 'Textiles',
        description: 'Premium organic cotton fabric t-shirt',
        price: 450,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
        rating: 4.5,
        reviews: 89,
        inStock: true,
        quantity: 45
      },
      {
        name: 'Neem Pests Control Solution',
        category: 'Organic Inputs',
        description: 'Natural neem-based pest control solution',
        price: 280,
        image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd26431?w=400&h=300&fit=crop',
        rating: 4.4,
        reviews: 112,
        inStock: true,
        quantity: 60
      },
      {
        name: 'Vermicompost',
        category: 'Organic Inputs',
        description: 'High-quality vermicompost for soil enrichment',
        price: 150,
        image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd26431?w=400&h=300&fit=crop',
        rating: 4.7,
        reviews: 178,
        inStock: true,
        quantity: 100
      },
      {
        name: 'Organic Jaggery',
        category: 'Natural Products',
        description: 'Pure organic jaggery made from sugarcane',
        price: 180,
        image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd26431?w=400&h=300&fit=crop',
        rating: 4.8,
        reviews: 195,
        inStock: true,
        quantity: 40
      }
    ];
    
    const productsResult = await db.collection('products').insertMany(products);
    console.log(`✅ Inserted ${productsResult.insertedIds.length} products`);
    
    console.log('\n✅ All data seeded successfully!');
    console.log('\nDatabase Summary:');
    console.log('- Experts: 10');
    console.log('- Crops: 5');
    console.log('- Diseases: 5');
    console.log('- Products: 8');
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    await client.close();
  }
}

seedData();

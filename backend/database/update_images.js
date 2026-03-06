// Update image paths in database
// Run this script with: node database/update_images.js

import { MongoClient } from 'mongodb';

// MongoDB connection
const uri = 'mongodb+srv://udayfranklin121_db_user:iTPtuaBi6M80NQEs@cluster0.wficn2x.mongodb.net/agrismart?retryWrites=true&w=majority';
const client = new MongoClient(uri);

async function updateImagePaths() {
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    const database = client.db('agrismart');
    
    console.log('Updating product image paths...');
    
    // Update products collection
    const products = await database.collection('products').find({}).toArray();
    
    for (const product of products) {
      const imagePath = `/images/products/${product.id}.svg`;
      
      await database.collection('products').updateOne(
        { _id: product._id },
        { 
          $set: { 
            image: imagePath,
            updatedAt: new Date()
          }
        }
      );
      
      console.log(`Updated product ${product.id}: ${imagePath}`);
    }
    
    console.log('Updating expert image paths...');
    
    // Update experts collection
    const experts = await database.collection('experts').find({}).toArray();
    
    for (const expert of experts) {
      const imagePath = `/images/experts/default.svg`;
      
      await database.collection('experts').updateOne(
        { _id: expert._id },
        { 
          $set: { 
            image: imagePath,
            updatedAt: new Date()
          }
        }
      );
      
      console.log(`Updated expert ${expert.name}: ${imagePath}`);
    }
    
    console.log('Updating disease detection image paths...');
    
    // Update disease detections collection
    const detections = await database.collection('diseaseDetections').find({}).toArray();
    
    for (const detection of detections) {
      let imagePath = '/images/diseases/default.svg';
      
      if (detection.crop === 'Tomato' && detection.disease === 'Leaf Blight') {
        imagePath = '/images/diseases/tomato-leaf-blight.svg';
      } else if (detection.crop === 'Wheat' && detection.disease === 'Powdery Mildew') {
        imagePath = '/images/diseases/wheat-powdery-mildew.svg';
      }
      
      await database.collection('diseaseDetections').updateOne(
        { _id: detection._id },
        { 
          $set: { 
            imageUrl: imagePath,
            updatedAt: new Date()
          }
        }
      );
      
      console.log(`Updated detection ${detection.crop}: ${imagePath}`);
    }
    
    console.log('✅ Image paths updated successfully!');
    await client.close();
    
  } catch (error) {
    console.error('❌ Error updating image paths:', error);
    process.exit(1);
  }
}

// Run update
updateImagePaths();

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agrismart';

async function seedExperts() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db('agrismart');
    
    // Clear existing experts
    await db.collection('experts').deleteMany({});
    
    const experts = [
      {
        name: 'Dr. Rajesh Kumar',
        specialty: 'Sustainable Agriculture & Climate Smart Farming',
        bio: 'Renowned expert in sustainable farming practices with 12+ years of experience helping farmers adopt climate-smart techniques.',
        rating: 4.8,
        reviewCount: 156,
        experienceYears: 12,
        consultationFee: 420,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh-kumar&backgroundColor=b6e3f5',
        languages: ['English', 'Hindi', 'Telugu'],
        isVerified: true,
        education: 'PhD in Agriculture & Climate Science',
        certifications: ['Certified Agricultural Expert', 'Climate Smart Farming Specialist'],
        isAvailable: true,
        availabilitySchedule: {
          morning: true,
          afternoon: true,
          evening: false
        }
      },
      {
        name: 'Ms. Priya Sharma',
        specialty: 'Horticulture & Organic Farming',
        bio: 'Expert in organic horticulture with focus on fruit cultivation and organic pest management techniques.',
        rating: 4.9,
        reviewCount: 234,
        experienceYears: 18,
        consultationFee: 480,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya-sharma&backgroundColor=ffccf2',
        languages: ['Hindi', 'English', 'Punjabi'],
        isVerified: true,
        education: 'MSc in Horticulture',
        certifications: ['Organic Farming Expert', 'Fruit Cultivation Specialist'],
        isAvailable: true,
        availabilitySchedule: {
          morning: true,
          afternoon: false,
          evening: true
        }
      },
      {
        name: 'Mr. Amit Singh',
        specialty: 'Women in Agriculture & Empowerment',
        bio: 'Specialist in promoting women farmers and sustainable livelihoods through innovative agricultural practices.',
        rating: 4.7,
        reviewCount: 189,
        experienceYears: 8,
        consultationFee: 350,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amit-singh&backgroundColor=c0aede',
        languages: ['Hindi', 'English', 'Bengali'],
        isVerified: true,
        education: 'MSc in Rural Development',
        certifications: ['Agricultural Development Expert', 'Women Empowerment Specialist'],
        isAvailable: true,
        availabilitySchedule: {
          morning: false,
          afternoon: true,
          evening: true
        }
      },
      {
        name: 'Dr. Vikram Patel',
        specialty: 'Agricultural Technology & Digital Farming',
        bio: 'Pioneer in adopting modern technologies for precision farming and digital agriculture solutions.',
        rating: 4.6,
        reviewCount: 167,
        experienceYears: 6,
        consultationFee: 380,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vikram-patel&backgroundColor=ffd5dc',
        languages: ['English', 'Gujarati', 'Hindi'],
        isVerified: true,
        education: 'BTech Agricultural Engineering',
        certifications: ['Precision Farming Expert', 'IoT in Agriculture Specialist'],
        isAvailable: true,
        availabilitySchedule: {
          morning: true,
          afternoon: true,
          evening: true
        }
      },
      {
        name: 'Ms. Deepa Nair',
        specialty: 'Soil Health & Crop Nutrition',
        bio: 'Expert in soil science and crop nutrition management for maximum yield and sustainable practices.',
        rating: 4.8,
        reviewCount: 198,
        experienceYears: 10,
        consultationFee: 450,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=deepa-nair&backgroundColor=d1f2eb',
        languages: ['Malayalam', 'English', 'Tamil'],
        isVerified: true,
        education: 'MSc Soil Science',
        certifications: ['Soil Health Expert', 'Nutrient Management Specialist'],
        isAvailable: true,
        availabilitySchedule: {
          morning: true,
          afternoon: true,
          evening: false
        }
      },
      {
        name: 'Mr. Harish Reddy',
        specialty: 'Pest Management & Crop Protection',
        bio: 'Specialist in integrated pest management and organic crop protection methods.',
        rating: 4.5,
        reviewCount: 142,
        experienceYears: 11,
        consultationFee: 400,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=harish-reddy&backgroundColor=fff4e6',
        languages: ['Telugu', 'Hindi', 'English'],
        isVerified: true,
        education: 'MSc in Agricultural Entomology',
        certifications: ['Pest Management Expert', 'Organic Farming Specialist'],
        isAvailable: true,
        availabilitySchedule: {
          morning: true,
          afternoon: true,
          evening: true
        }
      },
      {
        name: 'Dr. Neha Gupta',
        specialty: 'Water Management & Irrigation',
        bio: 'Expert in efficient water management and modern irrigation techniques for sustainable farming.',
        rating: 4.7,
        reviewCount: 175,
        experienceYears: 9,
        consultationFee: 420,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=neha-gupta&backgroundColor=e2f0cb',
        languages: ['Hindi', 'English', 'Marathi'],
        isVerified: true,
        education: 'MSc in Irrigation Engineering',
        certifications: ['Water Management Expert', 'Drip Irrigation Specialist'],
        isAvailable: true,
        availabilitySchedule: {
          morning: false,
          afternoon: true,
          evening: true
        }
      },
      {
        name: 'Mr. Suresh Kumar',
        specialty: 'Crop Breeding & Seed Selection',
        bio: 'Specialist in crop improvement, high-yield varieties selection, and seed quality management.',
        rating: 4.6,
        reviewCount: 156,
        experienceYears: 13,
        consultationFee: 440,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=suresh-kumar&backgroundColor=fce4ec',
        languages: ['Kannada', 'English', 'Hindi'],
        isVerified: true,
        education: 'MSc in Crop Breeding',
        certifications: ['Crop Improvement Expert', 'Seed Production Specialist'],
        isAvailable: true,
        availabilitySchedule: {
          morning: true,
          afternoon: true,
          evening: false
        }
      },
      {
        name: 'Ms. Anjali Desai',
        specialty: 'Market Linkage & Value Addition',
        bio: 'Expert in connecting farmers to markets and adding value to agricultural products.',
        rating: 4.8,
        reviewCount: 203,
        experienceYears: 7,
        consultationFee: 380,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anjali-desai&backgroundColor=f3e5f5',
        languages: ['Marathi', 'English', 'Hindi'],
        isVerified: true,
        education: 'MBA in Agricultural Marketing',
        certifications: ['Value Chain Expert', 'Market Access Specialist'],
        isAvailable: true,
        availabilitySchedule: {
          morning: false,
          afternoon: true,
          evening: true
        }
      },
      {
        name: 'Dr. Mohit Verma',
        specialty: 'Livestock Integration & Sustainable Farming',
        bio: 'Expert in integrating livestock with crop farming for improved farm productivity.',
        rating: 4.5,
        reviewCount: 134,
        experienceYears: 10,
        consultationFee: 410,
        image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mohit-verma&backgroundColor=ede7f6',
        languages: ['English', 'Hindi', 'Punjabi'],
        isVerified: true,
        education: 'MSc in Livestock Science',
        certifications: ['Integrated Farming Expert', 'Livestock Management Specialist'],
        isAvailable: true,
        availabilitySchedule: {
          morning: true,
          afternoon: false,
          evening: true
        }
      }
    ];
    
    const result = await db.collection('experts').insertMany(experts);
    console.log(`✅ Successfully inserted ${result.insertedIds.length} experts into database`);
    
    // Display inserted experts
    const insertedExperts = await db.collection('experts').find({}).toArray();
    console.log('\nInserted Experts:');
    insertedExperts.forEach((expert, index) => {
      console.log(`${index + 1}. ${expert.name} (${expert.specialty})`);
    });
    
  } catch (error) {
    console.error('❌ Error seeding experts:', error);
  } finally {
    await client.close();
  }
}

seedExperts();

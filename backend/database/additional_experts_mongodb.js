// Additional Real Agricultural Experts for AgriSmart - MongoDB Format
// Run this script with: node database/additional_experts_mongodb.js

import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

// MongoDB connection
const uri = 'mongodb+srv://udayfranklin121_db_user:iTPtuaBi6M80NQEs@cluster0.wficn2x.mongodb.net/agrismart?retryWrites=true&w=majority';
const client = new MongoClient(uri);

const additionalExperts = [
  {
    user: {
      name: 'Dr. Ananya Reddy',
      email: 'ananya.reddy@agrismart.com',
      phone: '+919876543218',
      country: 'India',
      language: 'te',
      joinDate: new Date('2023-09-15'),
      isVerified: true
    },
    expert: {
      specialty: 'Sustainable Agriculture & Climate Smart Farming',
      bio: 'Dr. Ananya Reddy is a leading expert in sustainable agriculture and climate-smart farming practices. With 12 years of experience, she has helped thousands of farmers adopt sustainable farming techniques that improve yields while protecting the environment. She specializes in climate-resilient crops and water-efficient farming methods.',
      experienceYears: 12,
      consultationFee: 420.00,
      rating: 4.8,
      reviewCount: 156,
      languages: ['Telugu', 'English', 'Hindi'],
      education: 'PhD in Sustainable Agriculture, ICRISAT',
      certifications: ['Climate Smart Farming Certified', 'Sustainable Agriculture Expert', 'Water Management Specialist'],
      availabilitySchedule: {
        monday: { '9:00-12:00': true, '14:00-17:00': true, '17:00-19:00': true },
        tuesday: { '9:00-12:00': true, '14:00-17:00': true },
        wednesday: { '9:00-12:00': true, '14:00-17:00': true },
        thursday: { '9:00-12:00': true, '14:00-17:00': true },
        friday: { '9:00-12:00': true, '14:00-17:00': true },
        saturday: { '10:00-13:00': true }
      },
      isVerified: true,
      isActive: true
    }
  },
  {
    user: {
      name: 'Dr. Vikram Malhotra',
      email: 'vikram.malhotra@agrismart.com',
      phone: '+919876543219',
      country: 'India',
      language: 'hi',
      joinDate: new Date('2023-10-20'),
      isVerified: true
    },
    expert: {
      specialty: 'Horticulture & Organic Farming',
      bio: 'Dr. Vikram Malhotra is an expert in horticulture and organic farming with over 18 years of experience. He has worked extensively with fruit and vegetable farmers across India, helping them transition to organic farming practices. His expertise includes organic certification, post-harvest technology, and market linkage development.',
      experienceYears: 18,
      consultationFee: 480.00,
      rating: 4.9,
      reviewCount: 234,
      languages: ['Hindi', 'English', 'Punjabi'],
      education: 'PhD in Horticulture, Punjab Agricultural University',
      certifications: ['Organic Farming Expert', 'Post-Harvest Technology Specialist', 'Market Linkage Consultant'],
      availabilitySchedule: {
        monday: { '8:00-11:00': true, '13:00-16:00': true, '16:00-18:00': true },
        tuesday: { '8:00-11:00': true, '13:00-16:00': true },
        wednesday: { '8:00-11:00': true, '13:00-16:00': true },
        thursday: { '8:00-11:00': true, '13:00-16:00': true },
        friday: { '8:00-11:00': true, '13:00-16:00': true },
        saturday: { '9:00-12:00': true }
      },
      isVerified: true,
      isActive: true
    }
  },
  {
    user: {
      name: 'Dr. Sunita Devi',
      email: 'sunita.devi@agrismart.com',
      phone: '+919876543220',
      country: 'India',
      language: 'hi',
      joinDate: new Date('2023-11-05'),
      isVerified: true
    },
    expert: {
      specialty: 'Women in Agriculture & Empowerment',
      bio: 'Dr. Sunita Devi is a passionate advocate for women in agriculture with 8 years of experience in empowering female farmers. She has developed several programs specifically designed for women farmers, including training programs, financial literacy workshops, and market access initiatives. She has worked with over 2000 women farmers across India.',
      experienceYears: 8,
      consultationFee: 350.00,
      rating: 4.7,
      reviewCount: 189,
      languages: ['Hindi', 'English', 'Bengali', 'Odia'],
      education: 'MSc in Agricultural Extension, Bihar Agricultural University',
      certifications: ['Women Empowerment Specialist', 'Agricultural Extension Expert', 'Rural Development Certified'],
      availabilitySchedule: {
        monday: { '10:00-13:00': true, '15:00-18:00': true },
        tuesday: { '10:00-13:00': true, '15:00-18:00': true },
        wednesday: { '10:00-13:00': true, '15:00-18:00': true },
        thursday: { '10:00-13:00': true, '15:00-18:00': true },
        friday: { '10:00-13:00': true, '15:00-18:00': true }
      },
      isVerified: true,
      isActive: true
    }
  },
  {
    user: {
      name: 'Dr. Rahul Sharma',
      email: 'rahul.sharma@agrismart.com',
      phone: '+919876543221',
      country: 'India',
      language: 'en',
      joinDate: new Date('2023-12-10'),
      isVerified: true
    },
    expert: {
      specialty: 'Agricultural Technology & Digital Farming',
      bio: 'Dr. Rahul Sharma is an expert in agricultural technology and digital farming solutions. With 6 years of experience, he has helped farmers adopt modern agricultural technologies including precision farming, IoT solutions, and digital platforms. He specializes in making technology accessible to small and marginal farmers.',
      experienceYears: 6,
      consultationFee: 380.00,
      rating: 4.6,
      reviewCount: 167,
      languages: ['Hindi', 'English', 'Marathi'],
      education: 'BTech in Agricultural Engineering, IIT Kharagpur',
      certifications: ['Digital Farming Expert', 'IoT Agriculture Specialist', 'Precision Farming Certified'],
      availabilitySchedule: {
        monday: { '9:00-12:00': true, '14:00-17:00': true, '17:00-19:00': true },
        tuesday: { '9:00-12:00': true, '14:00-17:00': true },
        wednesday: { '9:00-12:00': true, '14:00-17:00': true },
        thursday: { '9:00-12:00': true, '14:00-17:00': true },
        friday: { '9:00-12:00': true, '14:00-17:00': true },
        saturday: { '10:00-13:00': true }
      },
      isVerified: true,
      isActive: true
    }
  },
  {
    user: {
      name: 'Dr. Meera Krishnan',
      email: 'meera.krishnan@agrismart.com',
      phone: '+919876543222',
      country: 'India',
      language: 'ml',
      joinDate: new Date('2024-01-15'),
      isVerified: true
    },
    expert: {
      specialty: 'Traditional Farming Systems & Indigenous Knowledge',
      bio: 'Dr. Meera Krishnan is an expert in traditional farming systems and indigenous agricultural knowledge. With 7 years of experience, she has documented and revived many traditional farming practices that are both sustainable and profitable. She works closely with tribal communities to preserve and promote indigenous farming knowledge.',
      experienceYears: 7,
      consultationFee: 300.00,
      rating: 4.8,
      reviewCount: 145,
      languages: ['Malayalam', 'Tamil', 'English', 'Hindi'],
      education: 'MSc in Ethnobotany, Kerala Agricultural University',
      certifications: ['Traditional Farming Expert', 'Indigenous Knowledge Specialist', 'Ethnobotany Certified'],
      availabilitySchedule: {
        monday: { '8:00-11:00': true, '13:00-16:00': true },
        tuesday: { '8:00-11:00': true, '13:00-16:00': true },
        wednesday: { '8:00-11:00': true, '13:00-16:00': true },
        thursday: { '8:00-11:00': true, '13:00-16:00': true },
        friday: { '8:00-11:00': true, '13:00-16:00': true },
        saturday: { '9:00-12:00': true }
      },
      isVerified: true,
      isActive: true
    }
  },
  {
    user: {
      name: 'Dr. Karan Singh',
      email: 'karan.singh@agrismart.com',
      phone: '+919876543223',
      country: 'India',
      language: 'pa',
      joinDate: new Date('2024-02-20'),
      isVerified: true
    },
    expert: {
      specialty: 'Livestock Management & Animal Husbandry',
      bio: 'Dr. Karan Singh is an expert in livestock management and animal husbandry with 9 years of experience. He has worked with dairy farmers, poultry farmers, and goat farmers across India, helping them improve animal health, productivity, and profitability. He specializes in organic livestock management and sustainable animal farming practices.',
      experienceYears: 9,
      consultationFee: 400.00,
      rating: 4.7,
      reviewCount: 178,
      languages: ['Punjabi', 'Hindi', 'English'],
      education: 'MVSc in Animal Husbandry, Guru Angad Dev Veterinary University',
      certifications: ['Livestock Management Expert', 'Animal Husbandry Specialist', 'Organic Livestock Certified'],
      availabilitySchedule: {
        monday: { '9:00-12:00': true, '14:00-17:00': true },
        tuesday: { '9:00-12:00': true, '14:00-17:00': true },
        wednesday: { '9:00-12:00': true, '14:00-17:00': true },
        thursday: { '9:00-12:00': true, '14:00-17:00': true },
        friday: { '9:00-12:00': true, '14:00-17:00': true },
        saturday: { '10:00-13:00': true }
      },
      isVerified: true,
      isActive: true
    }
  },
  {
    user: {
      name: 'Dr. Pooja Nair',
      email: 'pooja.nair@agrismart.com',
      phone: '+919876543224',
      country: 'India',
      language: 'en',
      joinDate: new Date('2024-03-10'),
      isVerified: true
    },
    expert: {
      specialty: 'Agricultural Economics & Farm Management',
      bio: 'Dr. Pooja Nair is an agricultural economist with 11 years of experience in farm management and agricultural economics. She has helped hundreds of farmers improve their farm profitability through better planning, market linkages, and financial management. She specializes in small farm economics and sustainable business models.',
      experienceYears: 11,
      consultationFee: 450.00,
      rating: 4.9,
      reviewCount: 201,
      languages: ['English', 'Hindi', 'Malayalam', 'Tamil'],
      education: 'PhD in Agricultural Economics, Tamil Nadu Agricultural University',
      certifications: ['Farm Management Expert', 'Agricultural Economics Specialist', 'Business Planning Certified'],
      availabilitySchedule: {
        monday: { '9:00-12:00': true, '14:00-17:00': true, '17:00-19:00': true },
        tuesday: { '9:00-12:00': true, '14:00-17:00': true },
        wednesday: { '9:00-12:00': true, '14:00-17:00': true },
        thursday: { '9:00-12:00': true, '14:00-17:00': true },
        friday: { '9:00-12:00': true, '14:00-17:00': true },
        saturday: { '10:00-13:00': true }
      },
      isVerified: true,
      isActive: true
    }
  },
  {
    user: {
      name: 'Dr. Arvind Kumar',
      email: 'arvind.kumar@agrismart.com',
      phone: '+919876543225',
      country: 'India',
      language: 'hi',
      joinDate: new Date('2024-04-05'),
      isVerified: true
    },
    expert: {
      specialty: 'Seed Technology & Crop Improvement',
      bio: 'Dr. Arvind Kumar is an expert in seed technology and crop improvement with 13 years of experience. He has worked with several seed companies and research institutions to develop improved crop varieties. He specializes in seed production, quality control, and seed certification processes.',
      experienceYears: 13,
      consultationFee: 380.00,
      rating: 4.6,
      reviewCount: 189,
      languages: ['Hindi', 'English', 'Gujarati'],
      education: 'PhD in Seed Technology, Indian Agricultural Research Institute',
      certifications: ['Seed Technology Expert', 'Crop Improvement Specialist', 'Seed Certification Certified'],
      availabilitySchedule: {
        monday: { '8:00-11:00': true, '13:00-16:00': true, '16:00-18:00': true },
        tuesday: { '8:00-11:00': true, '13:00-16:00': true },
        wednesday: { '8:00-11:00': true, '13:00-16:00': true },
        thursday: { '8:00-11:00': true, '13:00-16:00': true },
        friday: { '8:00-11:00': true, '13:00-16:00': true },
        saturday: { '9:00-12:00': true }
      },
      isVerified: true,
      isActive: true
    }
  },
  {
    user: {
      name: 'Dr. Deepika Patel',
      email: 'deepika.patel@agrismart.com',
      phone: '+919876543226',
      country: 'India',
      language: 'gu',
      joinDate: new Date('2024-05-12'),
      isVerified: true
    },
    expert: {
      specialty: 'Agricultural Marketing & Supply Chain',
      bio: 'Dr. Deepika Patel is an expert in agricultural marketing and supply chain management with 10 years of experience. She has helped farmers improve their market access and get better prices for their produce through better marketing strategies and supply chain optimization. She specializes in organic marketing and direct-to-consumer models.',
      experienceYears: 10,
      consultationFee: 350.00,
      rating: 4.8,
      reviewCount: 167,
      languages: ['Gujarati', 'Hindi', 'English'],
      education: 'MBA in Agricultural Marketing, Gujarat University',
      certifications: ['Marketing Expert', 'Supply Chain Specialist', 'Organic Marketing Certified'],
      availabilitySchedule: {
        monday: { '10:00-13:00': true, '15:00-18:00': true },
        tuesday: { '10:00-13:00': true, '15:00-18:00': true },
        wednesday: { '10:00-13:00': true, '15:00-18:00': true },
        thursday: { '10:00-13:00': true, '15:00-18:00': true },
        friday: { '10:00-13:00': true, '15:00-18:00': true },
        saturday: { '11:00-14:00': true }
      },
      isVerified: true,
      isActive: true
    }
  },
  {
    user: {
      name: 'Dr. Sanjay Gupta',
      email: 'sanjay.gupta@agrismart.com',
      phone: '+919876543227',
      country: 'India',
      language: 'hi',
      joinDate: new Date('2024-06-18'),
      isVerified: true
    },
    expert: {
      specialty: 'Agricultural Policy & Rural Development',
      bio: 'Dr. Sanjay Gupta is an expert in agricultural policy and rural development with 16 years of experience. He has worked with government agencies, NGOs, and international organizations on agricultural policy formulation and implementation. He specializes in policy analysis and rural development planning.',
      experienceYears: 16,
      consultationFee: 500.00,
      rating: 4.7,
      reviewCount: 234,
      languages: ['Hindi', 'English', 'Urdu'],
      education: 'PhD in Agricultural Economics, Delhi University',
      certifications: ['Policy Expert', 'Rural Development Specialist', 'Agricultural Policy Analyst'],
      availabilitySchedule: {
        monday: { '9:00-12:00': true, '14:00-17:00': true, '17:00-19:00': true },
        tuesday: { '9:00-12:00': true, '14:00-17:00': true },
        wednesday: { '9:00-12:00': true, '14:00-17:00': true },
        thursday: { '9:00-12:00': true, '14:00-17:00': true },
        friday: { '9:00-12:00': true, '14:00-17:00': true },
        saturday: { '10:00-13:00': true }
      },
      isVerified: true,
      isActive: true
    }
  },
  {
    user: {
      name: 'Dr. Kavita Singh',
      email: 'kavita.singh@agrismart.com',
      phone: '+919876543228',
      country: 'India',
      language: 'en',
      joinDate: new Date('2024-07-22'),
      isVerified: true
    },
    expert: {
      specialty: 'Plant Pathology & Disease Management',
      bio: 'Dr. Kavita Singh is an expert in plant pathology and disease management with 14 years of experience. She has diagnosed and treated thousands of crop disease cases across India. She specializes in integrated disease management and biological control methods.',
      experienceYears: 14,
      consultationFee: 420.00,
      rating: 4.9,
      reviewCount: 267,
      languages: ['Hindi', 'English', 'Punjabi', 'Urdu'],
      education: 'PhD in Plant Pathology, Punjab Agricultural University',
      certifications: ['Plant Pathology Expert', 'Disease Management Specialist', 'Biological Control Certified'],
      availabilitySchedule: {
        monday: { '8:00-11:00': true, '13:00-16:00': true, '16:00-18:00': true },
        tuesday: { '8:00-11:00': true, '13:00-16:00': true, '16:00-18:00': true },
        wednesday: { '8:00-11:00': true, '13:00-16:00': true, '16:00-18:00': true },
        thursday: { '8:00-11:00': true, '13:00-16:00': true, '16:00-18:00': true },
        friday: { '8:00-11:00': true, '13:00-16:00': true },
        saturday: { '9:00-12:00': true }
      },
      isVerified: true,
      isActive: true
    }
  },
  {
    user: {
      name: 'Dr. Rohit Verma',
      email: 'rohit.verma@agrismart.com',
      phone: '+919876543229',
      country: 'India',
      language: 'hi',
      joinDate: new Date('2024-08-30'),
      isVerified: true
    },
    expert: {
      specialty: 'Agricultural Engineering & Farm Mechanization',
      bio: 'Dr. Rohit Verma is an expert in agricultural engineering and farm mechanization with 7 years of experience. He has helped farmers adopt appropriate farm machinery and mechanization techniques to improve efficiency and reduce labor costs. He specializes in small farm mechanization and appropriate technology.',
      experienceYears: 7,
      consultationFee: 320.00,
      rating: 4.5,
      reviewCount: 145,
      languages: ['Hindi', 'English', 'Marathi'],
      education: 'MTech in Agricultural Engineering, IIT Kharagpur',
      certifications: ['Agricultural Engineering Expert', 'Farm Mechanization Specialist', 'Appropriate Technology Certified'],
      availabilitySchedule: {
        monday: { '9:00-12:00': true, '14:00-17:00': true },
        tuesday: { '9:00-12:00': true, '14:00-17:00': true },
        wednesday: { '9:00-12:00': true, '14:00-17:00': true },
        thursday: { '9:00-12:00': true, '14:00-17:00': true },
        friday: { '9:00-12:00': true, '14:00-17:00': true },
        saturday: { '10:00-13:00': true }
      },
      isVerified: true,
      isActive: true
    }
  },
  {
    user: {
      name: 'Dr. Neha Sharma',
      email: 'neha.sharma@agrismart.com',
      phone: '+919876543230',
      country: 'India',
      language: 'en',
      joinDate: new Date('2024-09-15'),
      isVerified: true
    },
    expert: {
      specialty: 'Food Processing & Value Addition',
      bio: 'Dr. Neha Sharma is an expert in food processing and value addition with 5 years of experience. She has helped farmers establish small-scale food processing units and develop value-added products from their agricultural produce. She specializes in organic food processing and rural entrepreneurship.',
      experienceYears: 5,
      consultationFee: 280.00,
      rating: 4.8,
      reviewCount: 178,
      languages: ['Hindi', 'English', 'Bengali', 'Odia'],
      education: 'MSc in Food Technology, Central Food Technological Research Institute',
      certifications: ['Food Processing Expert', 'Value Addition Specialist', 'Rural Entrepreneurship Certified'],
      availabilitySchedule: {
        monday: { '10:00-13:00': true, '15:00-18:00': true },
        tuesday: { '10:00-13:00': true, '15:00-18:00': true },
        wednesday: { '10:00-13:00': true, '15:00-18:00': true },
        thursday: { '10:00-13:00': true, '15:00-18:00': true },
        friday: { '10:00-13:00': true, '15:00-18:00': true }
      },
      isVerified: true,
      isActive: true
    }
  },
  {
    user: {
      name: 'Dr. Amit Kumar',
      email: 'amit.kumar@agrismart.com',
      phone: '+919876543231',
      country: 'India',
      language: 'hi',
      joinDate: new Date('2024-10-20'),
      isVerified: true
    },
    expert: {
      specialty: 'Agroforestry & Sustainable Land Use',
      bio: 'Dr. Amit Kumar is an expert in agroforestry and sustainable land use systems with 8 years of experience. He has helped farmers integrate trees into their farming systems to improve biodiversity, soil health, and income. He specializes in designing agroforestry systems for different agro-climatic zones.',
      experienceYears: 8,
      consultationFee: 350.00,
      rating: 4.6,
      reviewCount: 156,
      languages: ['Hindi', 'English', 'Bhojpuri', 'Maithili'],
      education: 'MSc in Forestry, Forest Research Institute',
      certifications: ['Agroforestry Expert', 'Sustainable Land Use Specialist', 'Biodiversity Conservation Certified'],
      availabilitySchedule: {
        monday: { '9:00-12:00': true, '14:00-17:00': true },
        tuesday: { '9:00-12:00': true, '14:00-17:00': true },
        wednesday: { '9:00-12:00': true, '13:00-16:00': true },
        thursday: { '9:00-12:00': true, '13:00-16:00': true },
        friday: { '9:00-12:00': true, '14:00-17:00': true },
        saturday: { '10:00-13:00': true }
      },
      isVerified: true,
      isActive: true
    }
  }
];

async function addAdditionalExperts() {
  try {
    await client.connect();
    const database = client.db('agrismart');
    
    console.log('Adding additional experts to database...');
    
    for (const expertData of additionalExperts) {
      // Insert user
      const userResult = await database.collection('users').insertOne(expertData.user);
      const userId = userResult.insertedId;
      
      // Insert expert with user reference
      const expertRecord = {
        ...expertData.expert,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await database.collection('experts').insertOne(expertRecord);
      
      // Create doctor portal account
      const hashedPassword = await bcrypt.hash('password123', 10);
      await database.collection('doctor_portal').insertOne({
        expertId: userId,
        portalUsername: expertData.user.email.split('@')[0],
        portalPasswordHash: hashedPassword,
        isActive: true,
        createdAt: new Date(),
        lastLogin: null
      });
      
      console.log(`Added expert: ${expertData.user.name}`);
    }
    
    console.log('Successfully added all additional experts!');
    
    // Update statistics
    const totalExperts = await database.collection('experts').countDocuments();
    console.log(`Total experts in database: ${totalExperts}`);
    
  } catch (error) {
    console.error('Error adding experts:', error);
  } finally {
    await client.close();
  }
}

// Run the function
addAdditionalExperts().catch(console.error);

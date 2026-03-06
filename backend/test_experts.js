// Test script to check experts collection
import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://udayfranklin121_db_user:iTPtuaBi6M80NQEs@cluster0.wficn2x.mongodb.net/agrismart?retryWrites=true&w=majority';
const client = new MongoClient(uri);

async function testExperts() {
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    const database = client.db('agrismart');
    
    console.log('Checking experts collection...');
    const experts = await database.collection('experts').find({}).toArray();
    
    console.log(`Found ${experts.length} experts:`);
    experts.forEach((expert, index) => {
      console.log(`${index + 1}. ${expert.name} - ${expert.specialty}`);
    });
    
    // Test the API response format
    console.log('\nTesting API response format...');
    const formattedExperts = experts.map(expert => ({
      id: expert._id.toString(),
      name: expert.name,
      specialty: expert.specialty,
      bio: expert.bio,
      rating: expert.rating || 4.5,
      reviews: expert.reviewCount || 50,
      experience: `${expert.experienceYears} years`,
      price: `₹${expert.consultationFee}`,
      availability: expert.isAvailable ? 'Available' : 'Busy',
      image: expert.image || '/images/experts/default.svg',
      languages: expert.languages || ['English', 'Hindi'],
      verified: expert.isVerified || false,
      education: expert.education || 'MSc in Agriculture',
      certifications: expert.certifications || ['Certified Agricultural Expert'],
      today_available: {
        morning: expert.availabilitySchedule?.morning || false,
        afternoon: expert.availabilitySchedule?.afternoon || false,
        evening: expert.availabilitySchedule?.evening || false
      }
    }));
    
    console.log('Formatted expert sample:');
    if (formattedExperts.length > 0) {
      console.log(JSON.stringify(formattedExperts[0], null, 2));
    }
    
    await client.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

testExperts();

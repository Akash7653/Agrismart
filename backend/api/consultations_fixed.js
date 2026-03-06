import express from 'express';
import { ObjectId } from 'mongodb';
import { getDatabase } from '../db-client.js';

const router = express.Router();

// GET all experts
router.get('/experts', async (req, res) => {
  try {
    const database = await getDatabase();
    const experts = await database.collection('experts').find({}).toArray();
    
    // Format experts for frontend
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
      image: expert.image || '/images/experts/default.jpg',
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
    
    res.json({
      success: true,
      data: formattedExperts
    });
  } catch (error) {
    console.error('Error fetching experts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching experts'
    });
  }
});

// GET consultation types
router.get('/consultation-types', async (req, res) => {
  try {
    const consultationTypes = [
      {
        id: 'video',
        name: 'Video Consultation',
        description: 'Face-to-face video call with expert',
        duration: '30 minutes',
        icon: 'video',
        price: 500
      },
      {
        id: 'chat',
        name: 'Chat Consultation',
        description: 'Text-based consultation with expert',
        duration: '24 hours',
        icon: 'chat',
        price: 300
      },
      {
        id: 'phone',
        name: 'Phone Consultation',
        description: 'Voice call with expert',
        duration: '20 minutes',
        icon: 'phone',
        price: 400
      },
      {
        id: 'visit',
        name: 'Farm Visit',
        description: 'In-person farm visit by expert',
        duration: '2 hours',
        icon: 'map-pin',
        price: 2000
      },
      {
        id: 'certification',
        name: 'Certification',
        description: 'Organic/Quality certification assistance',
        duration: '1 week',
        icon: 'check-circle',
        price: 5000
      }
    ];
    
    res.json({
      success: true,
      data: consultationTypes
    });
  } catch (error) {
    console.error('Error fetching consultation types:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching consultation types'
    });
  }
});

// POST book consultation
router.post('/book', async (req, res) => {
  try {
    const { expert_id, user_id, consultation_type_id, scheduled_date, duration_minutes, fee, user_notes, user_phone, user_email } = req.body;
    
    if (!expert_id || !scheduled_date) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: expert_id and scheduled_date are required'
      });
    }
    
    const database = await getDatabase();
    
    // Create consultation booking
    const consultation = {
      expert_id,
      user_id: user_id || '1',
      consultation_type_id: consultation_type_id || 'general',
      scheduled_date: new Date(scheduled_date),
      duration_minutes: duration_minutes || 30,
      fee: fee || 0,
      user_notes: user_notes || '',
      user_phone: user_phone || '',
      user_email: user_email || '',
      status: 'scheduled',
      paymentStatus: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await database.collection('consultations').insertOne(consultation);
    
    // Add to user history
    await database.collection('userHistory').insertOne({
      userId: user_id || '1',
      action: 'consultation_booking',
      details: {
        consultationId: result.insertedId.toString(),
        expertId: expert_id,
        scheduledDate: scheduled_date
      },
      timestamp: new Date(),
      createdAt: new Date()
    });
    
    res.json({
      success: true,
      message: 'Consultation booked successfully',
      data: {
        consultationId: result.insertedId.toString()
      }
    });
  } catch (error) {
    console.error('Error booking consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Error booking consultation'
    });
  }
});

// GET user consultations
router.get('/user-consultations/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const database = await getDatabase();
    
    const consultations = await database.collection('consultations')
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json({
      success: true,
      data: consultations
    });
  } catch (error) {
    console.error('Error fetching user consultations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user consultations'
    });
  }
});

// GET expert by ID
router.get('/expert/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const database = await getDatabase();
    
    const expert = await database.collection('experts').findOne({ _id: new ObjectId(id) });
    
    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found'
      });
    }
    
    // Format expert data
    const formattedExpert = {
      id: expert._id.toString(),
      name: expert.name,
      specialty: expert.specialty,
      bio: expert.bio,
      rating: expert.rating || 4.5,
      reviews: expert.reviewCount || 50,
      experience: `${expert.experienceYears} years`,
      price: `₹${expert.consultationFee}`,
      availability: expert.isAvailable ? 'Available' : 'Busy',
      image: expert.image || '/images/experts/default.jpg',
      languages: expert.languages || ['English', 'Hindi'],
      verified: expert.isVerified || false,
      education: expert.education || 'MSc in Agriculture',
      certifications: expert.certifications || ['Certified Agricultural Expert'],
      availabilitySchedule: expert.availabilitySchedule || {
        monday: { morning: true, afternoon: true, evening: false },
        tuesday: { morning: true, afternoon: true, evening: false },
        wednesday: { morning: false, afternoon: true, evening: true },
        thursday: { morning: true, afternoon: true, evening: false },
        friday: { morning: true, afternoon: false, evening: true },
        saturday: { morning: false, afternoon: true, evening: true },
        sunday: { morning: false, afternoon: false, evening: false }
      }
    };
    
    res.json({
      success: true,
      data: formattedExpert
    });
  } catch (error) {
    console.error('Error fetching expert:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching expert'
    });
  }
});

// POST send message in consultation chat
router.post('/chat/send', async (req, res) => {
  try {
    const { userId, expertId, message, senderType } = req.body;
    
    if (!userId || !expertId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, expertId, message'
      });
    }
    
    const database = await getDatabase();
    
    // Get or create consultation session
    let consultation = await database.collection('consultations').findOne({
      userId,
      expertId,
      type: 'chat'
    });
    
    if (!consultation) {
      // Create new consultation if doesn't exist
      const result = await database.collection('consultations').insertOne({
        userId,
        expertId,
        type: 'chat',
        status: 'active',
        paymentStatus: 'completed',
        startedAt: new Date(),
        updatedAt: new Date(),
        messages: []
      });
      consultation = await database.collection('consultations').findOne({ _id: result.insertedId });
    }
    
    // Add message to chat messages collection
    const chatMessage = {
      consultationId: consultation._id.toString(),
      userId,
      expertId,
      senderType: senderType || 'user', // 'user' or 'expert'
      senderName: senderType === 'expert' ? 'Expert' : 'You',
      message: message,
      timestamp: new Date(),
      createdAt: new Date()
    };
    
    const messageResult = await database.collection('chatMessages').insertOne(chatMessage);
    
    // Update consultation last message
    await database.collection('consultations').updateOne(
      { _id: consultation._id },
      {
        $set: {
          updatedAt: new Date(),
          lastMessage: message,
          lastMessageTime: new Date()
        }
      }
    );
    
    res.json({
      success: true,
      message: 'Message sent successfully',
      data: {
        messageId: messageResult.insertedId.toString(),
        ...chatMessage
      }
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message'
    });
  }
});

// GET consultation chat messages
router.get('/chat/:userId/:expertId', async (req, res) => {
  try {
    const { userId, expertId } = req.params;
    
    if (!userId || !expertId) {
      return res.status(400).json({
        success: false,
        message: 'Missing userId or expertId'
      });
    }
    
    const database = await getDatabase();
    
    // Get consultation
    const consultation = await database.collection('consultations').findOne({
      userId,
      expertId,
      type: 'chat'
    });
    
    if (!consultation) {
      return res.json({
        success: true,
        data: {
          messages: [],
          consultationId: null
        }
      });
    }
    
    // Get all messages for this consultation
    const messages = await database.collection('chatMessages')
      .find({ consultationId: consultation._id.toString() })
      .sort({ timestamp: 1 })
      .toArray();
    
    res.json({
      success: true,
      data: {
        consultationId: consultation._id.toString(),
        messages: messages.map(msg => ({
          id: msg._id.toString(),
          senderType: msg.senderType,
          senderName: msg.senderName,
          message: msg.message,
          timestamp: msg.timestamp
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching chat messages'
    });
  }
});

export default router;

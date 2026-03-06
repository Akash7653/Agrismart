import express from 'express';
import { 
  User, 
  CropPrediction, 
  DiseaseDetection, 
  Appointment, 
  Order, 
  Payment,
  Notification 
} from '../src/models/schemas.js';

const router = express.Router();

/**
 * GET /api/user/history/:userId
 * Get comprehensive user history with all activities
 */
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Return mock data for now
    const mockHistory = {
      user: {
        id: userId,
        name: 'User',
        email: 'user@example.com',
        farmSize: 5,
        location: 'India'
      },
      stats: {
        totalPredictions: 3,
        completedAppointments: 1,
        totalOrders: 2,
        totalExpenses: 1500,
        unreadNotifications: 2
      },
      timeline: [
        {
          _id: '1',
          type: 'crop_prediction',
          title: 'Wheat Crop Prediction',
          description: 'Farm size: 5ha, Soil: Loamy',
          status: 'completed',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          predictions: [{ crop: 'Wheat', suitability: 92 }]
        },
        {
          _id: '2',
          type: 'disease_detection',
          title: 'Leaf Blight Detected',
          description: 'Severity: High, Confidence: 85%',
          status: 'completed',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          disease: 'Leaf Blight',
          confidence: 85
        },
        {
          _id: '3',
          type: 'appointment',
          title: 'Expert Consultation',
          description: 'With Dr. Sharma',
          status: 'completed',
          scheduledTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          amount: 500,
          fee: 500
        },
        {
          _id: '4',
          type: 'order',
          title: 'Fertilizer Order',
          description: '2 items - ₹1,200',
          status: 'delivered',
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          finalAmount: 1200,
          items: [{}, {}]
        }
      ]
    };

    res.json(mockHistory);

  } catch (error) {
    console.error('Error fetching user history:', error);
    res.status(500).json({ 
      error: 'Failed to fetch history',
      message: error.message
    });
  }
});

/**
 * GET /api/user/profile/:userId
 * Get user profile details
 */
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get user statistics
    const [
      predictionCount,
      appointmentCount,
      orderCount,
      totalSpent
    ] = await Promise.all([
      CropPrediction.countDocuments({ userId }),
      Appointment.countDocuments({ userId }),
      Order.countDocuments({ userId }),
      Payment.aggregate([
        { $match: { userId, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    res.json({
      user,
      stats: {
        predictions: predictionCount,
        appointments: appointmentCount,
        orders: orderCount,
        totalSpent: totalSpent[0]?.total || 0
      }
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/user/notifications/:userId
 * Get user notifications
 */
router.get('/notifications/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, skip = 0 } = req.query;

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('appointmentId', 'title scheduledTime');

    const unreadCount = await Notification.countDocuments({ userId, isRead: false });
    const total = await Notification.countDocuments({ userId });

    res.json({
      notifications,
      unreadCount,
      total
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /api/user/notifications/:notificationId/read
 * Mark notification as read
 */
router.patch('/notifications/:notificationId/read', async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      {
        isRead: true,
        readAt: new Date()
      },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(notification);

  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /api/user/notifications/read-all/:userId
 * Mark all notifications as read
 */
router.patch('/notifications/read-all/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await Notification.updateMany(
      { userId, isRead: false },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.json({
      message: 'All notifications marked as read',
      modifiedCount: result.modifiedCount
    });

  } catch (error) {
    console.error('Error updating notifications:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /api/user/profile/:userId
 * Update user profile
 */
router.patch('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    // Remove sensitive fields
    delete updateData._id;
    delete updateData.password;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

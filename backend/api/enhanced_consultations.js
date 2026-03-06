import express from 'express';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'agrismart',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// JWT Secret for doctor portal
const JWT_SECRET = process.env.JWT_SECRET || 'agrismart_doctor_portal_secret';

// Middleware to verify doctor token
const verifyDoctorToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.doctorId = decoded.expertId;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// GET all real experts with detailed information
router.get('/experts', async (req, res) => {
  try {
    const {
      specialty,
      min_fee,
      max_fee,
      search,
      sort_by = 'rating',
      sort_order = 'DESC',
      page = 1,
      limit = 20
    } = req.query;

    let whereClause = 'WHERE e.is_active = TRUE AND e.is_verified = TRUE';
    const params = [];

    // Build WHERE clause
    if (specialty) {
      whereClause += ' AND e.specialty LIKE ?';
      params.push(`%${specialty}%`);
    }

    if (min_fee) {
      whereClause += ' AND e.consultation_fee >= ?';
      params.push(min_fee);
    }

    if (max_fee) {
      whereClause += ' AND e.consultation_fee <= ?';
      params.push(max_fee);
    }

    if (search) {
      whereClause += ' AND (e.specialty LIKE ? OR u.name LIKE ? OR e.bio LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM experts e
      LEFT JOIN users u ON e.user_id = u.id
      ${whereClause}
    `;
    const [countResult] = await db.execute(countQuery, params);
    const total = countResult[0].total;

    // Get experts with pagination
    const offset = (page - 1) * limit;
    const expertsQuery = `
      SELECT 
        e.*,
        u.name,
        u.email,
        u.phone,
        u.country,
        u.join_date,
        u.profile_image
      FROM experts e
      LEFT JOIN users u ON e.user_id = u.id
      ${whereClause}
      ORDER BY e.${sort_by} ${sort_order}
      LIMIT ? OFFSET ?
    `;
    
    const [experts] = await db.execute(expertsQuery, [...params, parseInt(limit), offset]);

    // Parse JSON fields and add availability
    for (let expert of experts) {
      if (expert.languages) {
        expert.languages = JSON.parse(expert.languages);
      }
      if (expert.certifications) {
        expert.certifications = JSON.parse(expert.certifications);
      }
      if (expert.availability_schedule) {
        expert.availability_schedule = JSON.parse(expert.availability_schedule);
      }

      // Get today's availability
      const today = new Date().toLocaleLowerCase().slice(0, 3);
      expert.today_available = expert.availability_schedule?.[today] || {};
    }

    res.json({
      success: true,
      data: experts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching experts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching experts'
    });
  }
});

// GET expert details with real data
router.get('/experts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = `
      SELECT 
        e.*,
        u.name,
        u.email,
        u.phone,
        u.country,
        u.join_date,
        u.profile_image
      FROM experts e
      LEFT JOIN users u ON e.user_id = u.id
      WHERE e.id = ? AND e.is_active = TRUE
    `;
    
    const [experts] = await db.execute(query, [id]);
    
    if (experts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found'
      });
    }

    const expert = experts[0];
    
    // Parse JSON fields
    if (expert.languages) {
      expert.languages = JSON.parse(expert.languages);
    }
    if (expert.certifications) {
      expert.certifications = JSON.parse(expert.certifications);
    }
    if (expert.availability_schedule) {
      expert.availability_schedule = JSON.parse(expert.availability_schedule);
    }

    // Get expert reviews
    const [reviews] = await db.execute(`
      SELECT 
        er.*,
        u.name as user_name,
        u.is_verified as user_verified,
        c.scheduled_date
      FROM expert_reviews er
      LEFT JOIN users u ON er.user_id = u.id
      LEFT JOIN consultations c ON er.consultation_id = c.id
      WHERE er.expert_id = ?
      ORDER BY er.created_at DESC
      LIMIT 20
    `, [id]);
    
    expert.reviews = reviews;

    // Get upcoming consultations
    const [upcomingConsultations] = await db.execute(`
      SELECT 
        c.*,
        ct.name as consultation_type_name,
        u.name as user_name,
        u.phone as user_phone
      FROM consultations c
      LEFT JOIN consultation_types ct ON c.consultation_type_id = ct.id
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.expert_id = ? AND c.status IN ('pending', 'confirmed') 
        AND c.scheduled_date > NOW()
      ORDER BY c.scheduled_date ASC
      LIMIT 5
    `, [id]);

    expert.upcoming_consultations = upcomingConsultations;

    res.json({
      success: true,
      data: expert
    });

  } catch (error) {
    console.error('Error fetching expert:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching expert'
    });
  }
});

// GET consultation types with Indian context
router.get('/consultation-types', async (req, res) => {
  try {
    const [types] = await db.execute(`
      SELECT * FROM consultation_types 
      ORDER BY duration_minutes
    `);

    res.json({
      success: true,
      data: types
    });

  } catch (error) {
    console.error('Error fetching consultation types:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching consultation types'
    });
  }
});

// POST book consultation with real validation
router.post('/book', async (req, res) => {
  try {
    const {
      expert_id,
      user_id,
      consultation_type_id,
      scheduled_date,
      duration_minutes,
      fee,
      user_notes,
      user_phone,
      user_email
    } = req.body;

    if (!expert_id || !user_id || !consultation_type_id || !scheduled_date) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if expert exists and is available
    const [expertCheck] = await db.execute(
      'SELECT * FROM experts WHERE id = ? AND is_active = TRUE',
      [expert_id]
    );

    if (expertCheck.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found or unavailable'
      });
    }

    // Check if expert is available at the requested time
    const [existingConsultations] = await db.execute(`
      SELECT COUNT(*) as count 
      FROM consultations 
      WHERE expert_id = ? 
      AND scheduled_date = ? 
      AND status IN ('pending', 'confirmed')
    `, [expert_id, scheduled_date]);

    if (existingConsultations[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Expert not available at the requested time'
      });
    }

    // Create consultation
    const [result] = await db.execute(`
      INSERT INTO consultations (
        expert_id, user_id, consultation_type_id, scheduled_date,
        duration_minutes, fee, user_notes, user_phone, user_email, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `, [
      expert_id,
      user_id,
      consultation_type_id,
      scheduled_date,
      duration_minutes,
      fee,
      user_notes,
      user_phone,
      user_email
    ]);

    const consultationId = result.insertId;

    // Create notification for expert
    await db.execute(`
      INSERT INTO doctor_notifications (expert_id, type, title, message, consultation_id)
      VALUES (?, 'new_booking', 'New Consultation Booking', ?, ?)
    `, [
      expert_id,
      `New consultation booked for ${new Date(scheduled_date).toLocaleString()}`,
      consultationId
    ]);

    // Create earning record
    await db.execute(`
      INSERT INTO doctor_earnings (expert_id, consultation_id, amount, commission_rate, doctor_earnings, platform_fee)
      VALUES (?, ?, ?, 0.85, ?, ?)
    `, [
      expert_id,
      consultationId,
      fee,
      fee * 0.85,
      fee * 0.15
    ]);

    res.json({
      success: true,
      message: 'Consultation booked successfully',
      data: {
        consultation_id: consultationId,
        status: 'pending',
        scheduled_date: scheduled_date,
        fee: fee
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

// GET user consultations with real data
router.get('/user/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    
    const [consultations] = await db.execute(`
      SELECT 
        c.*,
        e.specialty,
        ct.name as consultation_type_name,
        ct.duration_minutes,
        u.name as expert_name,
        u.email as expert_email,
        u.phone as expert_phone,
        u.profile_image as expert_image
      FROM consultations c
      LEFT JOIN experts e ON c.expert_id = e.id
      LEFT JOIN consultation_types ct ON c.consultation_type_id = ct.id
      LEFT JOIN users u ON e.user_id = u.id
      WHERE c.user_id = ?
      ORDER BY c.created_at DESC
    `, [user_id]);

    res.json({
      success: true,
      data: consultations
    });

  } catch (error) {
    console.error('Error fetching consultations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching consultations'
    });
  }
});

// POST review expert with real validation
router.post('/review', async (req, res) => {
  try {
    const {
      expert_id,
      user_id,
      consultation_id,
      rating,
      review_text
    } = req.body;

    if (!expert_id || !user_id || !consultation_id || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if consultation belongs to user and is completed
    const [consultations] = await db.execute(`
      SELECT * FROM consultations 
      WHERE id = ? AND user_id = ? AND expert_id = ? AND status = 'completed'
    `, [consultation_id, user_id, expert_id]);

    if (consultations.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid consultation or consultation not completed'
      });
    }

    // Check if review already exists
    const [existingReviews] = await db.execute(`
      SELECT id FROM expert_reviews 
      WHERE expert_id = ? AND user_id = ? AND consultation_id = ?
    `, [expert_id, user_id, consultation_id]);

    if (existingReviews.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Review already submitted'
      });
    }

    // Create review
    await db.execute(`
      INSERT INTO expert_reviews (
        expert_id, user_id, consultation_id, rating, review_text
      ) VALUES (?, ?, ?, ?, ?)
    `, [expert_id, user_id, consultation_id, rating, review_text]);

    // Update expert rating
    const [ratingData] = await db.execute(`
      SELECT AVG(rating) as avg_rating, COUNT(*) as review_count
      FROM expert_reviews 
      WHERE expert_id = ?
    `, [expert_id]);

    await db.execute(`
      UPDATE experts 
      SET rating = ?, review_count = ? 
      WHERE id = ?
    `, [ratingData[0].avg_rating, ratingData[0].review_count, expert_id]);

    // Create notification for expert
    await db.execute(`
      INSERT INTO doctor_notifications (expert_id, type, title, message, consultation_id)
      VALUES (?, 'review', 'New Review Received', ?, ?)
    `, [
      expert_id,
      `You received a ${rating}-star review from a recent consultation`,
      consultation_id
    ]);

    res.json({
      success: true,
      message: 'Review submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting review'
    });
  }
});

// PUT update consultation status
router.put('/consultations/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, expert_notes, meeting_link } = req.body;

    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const updateFields = ['status = ?'];
    const params = [status];

    if (expert_notes) {
      updateFields.push('expert_notes = ?');
      params.push(expert_notes);
    }

    if (meeting_link) {
      updateFields.push('meeting_link = ?');
      params.push(meeting_link);
    }

    params.push(id);

    await db.execute(`
      UPDATE consultations 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, params);

    res.json({
      success: true,
      message: 'Consultation status updated'
    });

  } catch (error) {
    console.error('Error updating consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating consultation'
    });
  }
});

// Doctor Portal Authentication
router.post('/doctor/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password required'
      });
    }

    // Get doctor portal account
    const [doctorAccounts] = await db.execute(`
      SELECT dp.*, e.id as expert_id, u.name as expert_name
      FROM doctor_portal dp
      LEFT JOIN experts e ON dp.expert_id = e.id
      LEFT JOIN users u ON e.user_id = u.id
      WHERE dp.portal_username = ? AND dp.is_active = TRUE
    `, [username]);

    if (doctorAccounts.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const doctorAccount = doctorAccounts[0];

    // Verify password (in production, use proper password hashing)
    const isValidPassword = await bcrypt.compare(password, doctorAccount.portal_password_hash);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    await db.execute(
      'UPDATE doctor_portal SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [doctorAccount.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { expertId: doctorAccount.expert_id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        expert_id: doctorAccount.expert_id,
        expert_name: doctorAccount.expert_name
      }
    });

  } catch (error) {
    console.error('Error in doctor login:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// GET doctor dashboard data
router.get('/doctor/dashboard', verifyDoctorToken, async (req, res) => {
  try {
    const expertId = req.doctorId;

    // Get expert basic info
    const [expertInfo] = await db.execute(`
      SELECT e.*, u.name, u.email, u.phone
      FROM experts e
      LEFT JOIN users u ON e.user_id = u.id
      WHERE e.id = ?
    `, [expertId]);

    // Get today's consultations
    const [todayConsultations] = await db.execute(`
      SELECT c.*, u.name as user_name, u.phone as user_phone
      FROM consultations c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.expert_id = ? AND DATE(c.scheduled_date) = CURDATE()
      ORDER BY c.scheduled_date ASC
    `, [expertId]);

    // Get unread notifications
    const [notifications] = await db.execute(`
      SELECT * FROM doctor_notifications
      WHERE expert_id = ? AND is_read = FALSE
      ORDER BY created_at DESC
      LIMIT 10
    `, [expertId]);

    // Get earnings summary
    const [earnings] = await db.execute(`
      SELECT 
        SUM(amount) as total_earnings,
        SUM(doctor_earnings) as total_doctor_earnings,
        SUM(platform_fee) as total_platform_fee,
        COUNT(*) as total_consultations
      FROM doctor_earnings
      WHERE expert_id = ? AND status = 'paid'
    `, [expertId]);

    // Get recent consultations
    const [recentConsultations] = await db.execute(`
      SELECT c.*, u.name as user_name, ct.name as consultation_type_name
      FROM consultations c
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN consultation_types ct ON c.consultation_type_id = ct.id
      WHERE c.expert_id = ?
      ORDER BY c.created_at DESC
      LIMIT 5
    `, [expertId]);

    res.json({
      success: true,
      data: {
        expert_info: expertInfo[0],
        today_consultations: todayConsultations,
        notifications: notifications,
        earnings: earnings[0],
        recent_consultations: recentConsultations
      }
    });

  } catch (error) {
    console.error('Error fetching doctor dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
});

// GET doctor notifications
router.get('/doctor/notifications', verifyDoctorToken, async (req, res) => {
  try {
    const expertId = req.doctorId;
    const { limit = 20, unread_only = false } = req.query;

    let whereClause = 'WHERE expert_id = ?';
    const params = [expertId];

    if (unread_only === 'true') {
      whereClause += ' AND is_read = FALSE';
    }

    const [notifications] = await db.execute(`
      SELECT * FROM doctor_notifications
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ?
    `, [...params, parseInt(limit)]);

    res.json({
      success: true,
      data: notifications
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications'
    });
  }
});

// PUT mark notifications as read
router.put('/doctor/notifications/read', verifyDoctorToken, async (req, res) => {
  try {
    const expertId = req.doctorId;
    const { notification_ids } = req.body;

    if (!notification_ids || !Array.isArray(notification_ids)) {
      return res.status(400).json({
        success: false,
        message: 'Notification IDs required'
      });
    }

    await db.execute(`
      UPDATE doctor_notifications 
      SET is_read = TRUE 
      WHERE expert_id = ? AND id IN (${notification_ids.map(() => '?').join(',')})
    `, [expertId, ...notification_ids]);

    res.json({
      success: true,
      message: 'Notifications marked as read'
    });

  } catch (error) {
    console.error('Error marking notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating notifications'
    });
  }
});

// GET doctor earnings
router.get('/doctor/earnings', verifyDoctorToken, async (req, res) => {
  try {
    const expertId = req.doctorId;
    const { status, start_date, end_date } = req.query;

    let whereClause = 'WHERE expert_id = ?';
    const params = [expertId];

    if (status) {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    if (start_date) {
      whereClause += ' AND created_at >= ?';
      params.push(start_date);
    }

    if (end_date) {
      whereClause += ' AND created_at <= ?';
      params.push(end_date);
    }

    const [earnings] = await db.execute(`
      SELECT 
        de.*,
        c.scheduled_date,
        u.name as user_name,
        ct.name as consultation_type_name
      FROM doctor_earnings de
      LEFT JOIN consultations c ON de.consultation_id = c.id
      LEFT JOIN users u ON c.user_id = u.id
      LEFT JOIN consultation_types ct ON c.consultation_type_id = ct.id
      ${whereClause}
      ORDER BY de.created_at DESC
    `, params);

    res.json({
      success: true,
      data: earnings
    });

  } catch (error) {
    console.error('Error fetching earnings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching earnings'
    });
  }
});

export default router;

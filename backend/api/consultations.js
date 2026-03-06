import express from 'express';
import mysql from 'mysql2/promise';

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

// GET all experts with filters
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
      whereClause += ' AND (e.specialty LIKE ? OR u.name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
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
        u.join_date
      FROM experts e
      LEFT JOIN users u ON e.user_id = u.id
      ${whereClause}
      ORDER BY e.${sort_by} ${sort_order}
      LIMIT ? OFFSET ?
    `;
    
    const [experts] = await db.execute(expertsQuery, [...params, parseInt(limit), offset]);

    // Parse languages and certifications
    for (let expert of experts) {
      if (expert.languages) {
        expert.languages = JSON.parse(expert.languages);
      }
      if (expert.certifications) {
        expert.certifications = JSON.parse(expert.certifications);
      }
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

// GET expert details
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
        u.join_date
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

// GET consultation types
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

// POST book consultation
router.post('/book', async (req, res) => {
  try {
    const {
      expert_id,
      user_id,
      consultation_type_id,
      scheduled_date,
      duration_minutes,
      fee,
      user_notes
    } = req.body;

    if (!expert_id || !user_id || !consultation_type_id || !scheduled_date) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
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
        duration_minutes, fee, user_notes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `, [
      expert_id,
      user_id,
      consultation_type_id,
      scheduled_date,
      duration_minutes,
      fee,
      user_notes
    ]);

    const consultationId = result.insertId;

    res.json({
      success: true,
      message: 'Consultation booked successfully',
      data: {
        consultation_id: consultationId,
        status: 'pending'
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
        u.email as expert_email
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

// GET expert consultations
router.get('/expert/:expert_id', async (req, res) => {
  try {
    const { expert_id } = req.params;
    
    const [consultations] = await db.execute(`
      SELECT 
        c.*,
        ct.name as consultation_type_name,
        u.name as user_name
      FROM consultations c
      LEFT JOIN consultation_types ct ON c.consultation_type_id = ct.id
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.expert_id = ?
      ORDER BY c.created_at DESC
    `, [expert_id]);

    res.json({
      success: true,
      data: consultations
    });

  } catch (error) {
    console.error('Error fetching expert consultations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching consultations'
    });
  }
});

// POST review expert
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

export default router;

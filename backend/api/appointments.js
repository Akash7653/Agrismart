import express from 'express';
import { Appointment, Notification, User } from '../src/models/schemas.js';
import { io } from '../server.js'; // Socket.io instance

const router = express.Router();

// ===================== APPOINTMENT ENDPOINTS =====================

/**
 * POST /api/appointments/book
 * Book a consultation appointment with expert
 */
router.post('/book', async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    const {
      expertId,
      consultationType,
      title,
      description,
      scheduledTime,
      duration = 30,
      meetingLink
    } = req.body;

    // Validate required fields
    if (!expertId || !title || !scheduledTime) {
      return res.status(400).json({ error: 'Missing required fields: expertId, title, scheduledTime' });
    }

    // Validate scheduled time is in future
    const appointmentTime = new Date(scheduledTime);
    if (appointmentTime < new Date()) {
      return res.status(400).json({ error: 'Appointment time must be in the future' });
    }

    // Get expert details to fetch consultation fee
    const expert = await User.findById(expertId);
    if (!expert || !expert.isExpert) {
      return res.status(404).json({ error: 'Expert not found' });
    }

    // Create appointment
    const appointment = new Appointment({
      userId,
      expertId,
      consultationType,
      title,
      description,
      scheduledTime: appointmentTime,
      duration,
      meetingLink,
      consultationFee: expert.consultationFee,
      status: 'scheduled',
      paymentStatus: 'pending'
    });

    const savedAppointment = await appointment.save();

    // Create notification for expert
    const notification = new Notification({
      userId: expertId,
      appointmentId: savedAppointment._id,
      type: 'appointment_scheduled',
      title: `New Appointment - ${title}`,
      message: `${req.user?.name || 'A user'} has booked a ${consultationType} consultation`,
      isRead: false
    });
    await notification.save();

    // Emit real-time notification via Socket.io
    if (io) {
      io.to(`user_${expertId}`).emit('new_appointment', {
        appointmentId: savedAppointment._id,
        title: savedAppointment.title,
        scheduledTime: savedAppointment.scheduledTime,
        consultationType: savedAppointment.consultationType,
        fee: savedAppointment.consultationFee
      });
    }

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointmentId: savedAppointment._id,
      appointment: savedAppointment,
      consultationFee: expert.consultationFee
    });

  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/appointments/user/:userId
 * Get user's appointments
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, role = 'user', limit = 20, skip = 0 } = req.query;

    let query = role === 'expert' ? { expertId: userId } : { userId };

    if (status) {
      query.status = status;
    }

    const appointments = await Appointment.find(query)
      .populate('userId', 'name email phone profileImage')
      .populate('expertId', 'name email phone profileImage expertSpecialty')
      .sort({ scheduledTime: 1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Appointment.countDocuments(query);

    res.json({
      appointments,
      total,
      skip: parseInt(skip),
      limit: parseInt(limit)
    });

  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/appointments/:appointmentId
 * Get specific appointment details
 */
router.get('/:appointmentId', async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId)
      .populate('userId', 'name email phone profileImage')
      .populate('expertId', 'name email phone profileImage expertSpecialty');

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json(appointment);

  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /api/appointments/:appointmentId/status
 * Update appointment status
 */
router.patch('/:appointmentId/status', async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status, notes, feedback, rating } = req.body;

    const validStatuses = ['scheduled', 'confirmed', 'completed', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (notes) updateData.notes = notes;
    if (feedback) updateData.feedback = feedback;
    if (rating) updateData.rating = Math.min(5, Math.max(1, rating));

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      updateData,
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Emit real-time update
    if (io) {
      io.to(`user_${appointment.userId}`).emit('appointment_updated', {
        appointmentId,
        status: appointment.status,
        feedback: appointment.feedback,
        rating: appointment.rating
      });
    }

    res.json({
      message: 'Appointment updated successfully',
      appointment
    });

  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /api/appointments/:appointmentId/confirm
 * Confirm appointment (expert action)
 */
router.patch('/:appointmentId/confirm', async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { meetingLink } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        status: 'confirmed',
        meetingLink: meetingLink || appointment?.meetingLink
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Create notification for user
    const notification = new Notification({
      userId: appointment.userId,
      appointmentId,
      type: 'appointment_confirmed',
      title: 'Appointment Confirmed',
      message: `Your appointment "${appointment.title}" has been confirmed`,
      isRead: false
    });
    await notification.save();

    // Emit real-time notification
    if (io) {
      io.to(`user_${appointment.userId}`).emit('appointment_confirmed', {
        appointmentId,
        title: appointment.title,
        meetingLink: appointment.meetingLink,
        scheduledTime: appointment.scheduledTime
      });
    }

    res.json({
      message: 'Appointment confirmed successfully',
      appointment
    });

  } catch (error) {
    console.error('Error confirming appointment:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /api/appointments/:appointmentId/cancel
 * Cancel appointment
 */
router.patch('/:appointmentId/cancel', async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { reason } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        status: 'cancelled',
        notes: reason || 'No reason provided',
        paymentStatus: 'refunded'
      },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Create notifications
    const userNotif = new Notification({
      userId: appointment.userId,
      appointmentId,
      type: 'appointment_cancelled',
      title: 'Appointment Cancelled',
      message: `Your appointment has been cancelled. Refund will be processed.`,
      isRead: false
    });

    const expertNotif = new Notification({
      userId: appointment.expertId,
      appointmentId,
      type: 'appointment_cancelled',
      title: 'Appointment Cancelled',
      message: `An appointment has been cancelled by the user.`,
      isRead: false
    });

    await userNotif.save();
    await expertNotif.save();

    // Emit real-time notifications
    if (io) {
      io.to(`user_${appointment.userId}`).emit('appointment_cancelled', {
        appointmentId,
        title: appointment.title
      });
      io.to(`user_${appointment.expertId}`).emit('appointment_cancelled', {
        appointmentId,
        title: appointment.title
      });
    }

    res.json({
      message: 'Appointment cancelled successfully',
      appointment
    });

  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/appointments/:appointmentId/send-reminder
 * Send reminder notification before appointment
 */
router.post('/:appointmentId/send-reminder', async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    if (appointment.reminderSent) {
      return res.status(400).json({ message: 'Reminder already sent' });
    }

    // Create reminder notification
    const notification = new Notification({
      userId: appointment.userId,
      appointmentId,
      type: 'appointment_reminder',
      title: 'Appointment Reminder',
      message: `Reminder: Your appointment "${appointment.title}" is coming up soon!`,
      isRead: false
    });
    await notification.save();

    // Update reminder sent flag
    appointment.reminderSent = true;
    await appointment.save();

    // Emit real-time reminder
    if (io) {
      io.to(`user_${appointment.userId}`).emit('appointment_reminder', {
        appointmentId,
        title: appointment.title,
        scheduledTime: appointment.scheduledTime,
        meetingLink: appointment.meetingLink
      });
    }

    res.json({ message: 'Reminder sent successfully' });

  } catch (error) {
    console.error('Error sending reminder:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/appointments/:appointmentId
 * Delete appointment (admin only)
 */
router.delete('/:appointmentId', async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const appointment = await Appointment.findByIdAndDelete(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // Delete associated notifications
    await Notification.deleteMany({ appointmentId });

    res.json({ message: 'Appointment deleted successfully' });

  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

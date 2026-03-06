import express from 'express';
import { Order, Payment, Appointment, User, Notification } from '../src/models/schemas.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { io } from '../server.js';

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ===================== ORDER ENDPOINTS =====================

/**
 * POST /api/orders/create
 * Create a new order
 */
router.post('/create', async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    const { items, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    // Calculate totals
    let totalAmount = 0;
    items.forEach(item => {
      totalAmount += item.price * item.quantity;
    });

    const taxAmount = Math.round(totalAmount * 0.05); // 5% tax
    const finalAmount = totalAmount + taxAmount;

    // Create order
    const order = new Order({
      userId,
      items,
      totalAmount,
      taxAmount,
      finalAmount,
      shippingAddress,
      status: 'pending',
      paymentStatus: 'pending'
    });

    const savedOrder = await order.save();

    res.status(201).json({
      message: 'Order created successfully',
      orderId: savedOrder._id,
      totalAmount,
      taxAmount,
      finalAmount
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/orders/:userId
 * Get user's orders
 */
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, limit = 20, skip = 0 } = req.query;

    let query = { userId };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      total,
      skip: parseInt(skip),
      limit: parseInt(limit)
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/orders/detail/:orderId
 * Get specific order details
 */
router.get('/detail/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PATCH /api/orders/:orderId/update-status
 * Update order status
 */
router.patch('/:orderId/update-status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber, deliveryDate } = req.body;

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updateData = { status };
    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (deliveryDate) updateData.deliveryDate = deliveryDate;

    const order = await Order.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Create notification for user
    const messages = {
      confirmed: 'Your order has been confirmed',
      shipped: `Your order has been shipped. Tracking: ${trackingNumber}`,
      delivered: 'Your order has been delivered',
      cancelled: 'Your order has been cancelled'
    };

    const notification = new Notification({
      userId: order.userId,
      type: 'order_status',
      title: `Order ${status}`,
      message: messages[status] || `Order status: ${status}`,
      isRead: false
    });
    await notification.save();

    // Emit real-time update
    if (io) {
      io.to(`user_${order.userId}`).emit('order_updated', {
        orderId,
        status,
        trackingNumber,
        message: messages[status]
      });
    }

    res.json({
      message: 'Order updated successfully',
      order
    });

  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/orders/:orderId
 * Cancel order
 */
router.delete('/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        status: 'cancelled',
        notes: reason || 'Cancelled by user'
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // If payment was already made, initiate refund
    if (order.paymentStatus === 'completed') {
      // Refund logic to be handled by payment system
      order.paymentStatus = 'refunded';
      await order.save();
    }

    res.json({ message: 'Order cancelled successfully', order });

  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: error.message });
  }
});

// ===================== PAYMENT ENDPOINTS =====================

/**
 * POST /api/payments/create-razorpay-order
 * Create Razorpay payment order
 */
router.post('/create-razorpay-order', async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    const { amount, orderId, appointmentId, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Amount in paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId,
        orderId: orderId || appointmentId,
        description: description || 'Payment for AgriSmart services'
      }
    });

    // Create payment record
    const payment = new Payment({
      userId,
      orderId: orderId || undefined,
      appointmentId: appointmentId || undefined,
      amount,
      paymentMethod: 'razorpay',
      razorpayOrderId: razorpayOrder.id,
      status: 'pending',
      description
    });

    const savedPayment = await payment.save();

    res.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      paymentId: savedPayment._id,
      currency: razorpayOrder.currency
    });

  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/payments/verify-razorpay
 * Verify Razorpay payment
 */
router.post('/verify-razorpay', async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, paymentId } = req.body;

    // Verify signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    // Update payment record
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        status: 'completed',
        razorpayPaymentId: razorpay_payment_id,
        transactionId: razorpay_payment_id
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found' });
    }

    // Update related order or appointment
    if (payment.orderId) {
      await Order.findByIdAndUpdate(payment.orderId, {
        paymentStatus: 'completed',
        status: 'confirmed'
      });

      // Create notification
      const order = await Order.findById(payment.orderId);
      const notification = new Notification({
        userId: payment.userId,
        type: 'payment_received',
        title: 'Payment Successful',
        message: `Payment of ₹${payment.amount} received for your order`,
        isRead: false
      });
      await notification.save();

      // Emit real-time notification
      if (io) {
        io.to(`user_${payment.userId}`).emit('payment_completed', {
          orderId: payment.orderId,
          amount: payment.amount,
          message: 'Payment successful. Your order is confirmed.'
        });
      }
    }

    if (payment.appointmentId) {
      await Appointment.findByIdAndUpdate(payment.appointmentId, {
        paymentStatus: 'completed'
      });

      // Create notification
      const notification = new Notification({
        userId: payment.userId,
        appointmentId: payment.appointmentId,
        type: 'payment_received',
        title: 'Appointment Payment Confirmed',
        message: `Payment of ₹${payment.amount} confirmed for your consultation`,
        isRead: false
      });
      await notification.save();

      // Emit real-time notification
      if (io) {
        io.to(`user_${payment.userId}`).emit('appointment_payment_completed', {
          appointmentId: payment.appointmentId,
          amount: payment.amount,
          message: 'Payment confirmed. Your appointment is secure.'
        });
      }
    }

    res.json({
      message: 'Payment verified successfully',
      payment,
      status: 'completed'
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/payments/:userId
 * Get user's payments
 */
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, limit = 20, skip = 0 } = req.query;

    let query = { userId };
    if (status) {
      query.status = status;
    }

    const payments = await Payment.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .populate('orderId', 'items totalAmount status')
      .populate('appointmentId', 'title scheduledTime status');

    const total = await Payment.countDocuments(query);

    // Calculate totals
    const completedPayments = await Payment.aggregate([
      { $match: { userId: userId, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalSpent = completedPayments[0]?.total || 0;

    res.json({
      payments,
      total,
      totalSpent,
      skip: parseInt(skip),
      limit: parseInt(limit)
    });

  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/payments/detail/:paymentId
 * Get specific payment details
 */
router.get('/detail/:paymentId', async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId)
      .populate('orderId')
      .populate('appointmentId');

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(payment);

  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/payments/:paymentId/refund
 * Process refund for a payment
 */
router.post('/:paymentId/refund', async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { amount, reason } = req.body;

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({ error: 'Only completed payments can be refunded' });
    }

    // Process refund with Razorpay
    const refundAmount = amount || payment.amount;

    try {
      const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
        amount: Math.round(refundAmount * 100),
        notes: {
          reason: reason || 'User requested refund'
        }
      });

      // Update payment record
      payment.status = 'refunded';
      payment.refundAmount = refundAmount;
      payment.failureReason = reason || 'User requested refund';
      await payment.save();

      // Create notification
      const notification = new Notification({
        userId: payment.userId,
        type: 'payment_refunded',
        title: 'Refund Processed',
        message: `Refund of ₹${refundAmount} has been processed to your account`,
        isRead: false
      });
      await notification.save();

      // Emit real-time notification
      if (io) {
        io.to(`user_${payment.userId}`).emit('refund_processed', {
          paymentId,
          amount: refundAmount,
          refundId: refund.id,
          message: 'Refund has been processed successfully'
        });
      }

      res.json({
        message: 'Refund processed successfully',
        refundId: refund.id,
        refundAmount
      });

    } catch (razorpayError) {
      console.error('Razorpay refund error:', razorpayError);
      res.status(500).json({ error: 'Failed to process refund with payment gateway' });
    }

  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

import express from 'express';
import RazorpayService from '../services/razorpay.js';
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

// POST create payment order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, type, reference_id, user_id } = req.body;

    if (!amount || !type || !reference_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Generate receipt number based on type
    const receipt = RazorpayService.generateReceiptNumber(type.toUpperCase());

    // Add notes for tracking
    const notes = {
      type: type,
      reference_id: reference_id,
      user_id: user_id,
      created_at: new Date().toISOString()
    };

    // Create Razorpay order
    const orderResult = await RazorpayService.createOrder(amount, receipt, notes);

    if (!orderResult.success) {
      return res.status(500).json({
        success: false,
        message: orderResult.message
      });
    }

    // Store order details in database
    await db.execute(`
      INSERT INTO payment_orders (
        razorpay_order_id, amount, type, reference_id, 
        user_id, receipt, status, notes
      ) VALUES (?, ?, ?, ?, ?, ?, 'created', ?)
    `, [
      orderResult.data.id,
      amount,
      type,
      reference_id,
      user_id,
      receipt,
      JSON.stringify(notes)
    ]);

    res.json({
      success: true,
      data: {
        order_id: orderResult.data.id,
        amount: orderResult.data.amount,
        currency: orderResult.data.currency,
        receipt: orderResult.data.receipt,
        key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_SKFbgQlHO41CY6'
      }
    });

  } catch (error) {
    console.error('Error creating payment order:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating payment order'
    });
  }
});

// POST verify payment
router.post('/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      type,
      reference_id
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification details'
      });
    }

    // Verify payment signature
    const verificationResult = RazorpayService.verifyPayment(
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature
    );

    if (!verificationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Get payment details from Razorpay
    const paymentResult = await RazorpayService.getPayment(razorpay_payment_id);

    if (!paymentResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Failed to fetch payment details'
      });
    }

    const payment = paymentResult.data;

    // Update payment order in database
    await db.execute(`
      UPDATE payment_orders 
      SET razorpay_payment_id = ?, razorpay_signature = ?, 
      status = 'verified', payment_data = ?, verified_at = CURRENT_TIMESTAMP
      WHERE razorpay_order_id = ?
    `, [
      razorpay_payment_id,
      razorpay_signature,
      JSON.stringify(payment),
      razorpay_order_id
    ]);

    // Process based on payment type
    let updateResult;
    if (type === 'consultation') {
      updateResult = await processConsultationPayment(reference_id, payment);
    } else if (type === 'marketplace') {
      updateResult = await processMarketplacePayment(reference_id, payment);
    }

    if (!updateResult.success) {
      return res.status(500).json({
        success: false,
        message: updateResult.message
      });
    }

    res.json({
      success: true,
      message: 'Payment verified and processed successfully',
      data: {
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        status: payment.status,
        amount: payment.amount / 100
      }
    });

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment'
    });
  }
});

// Process consultation payment
async function processConsultationPayment(consultationId, payment) {
  try {
    // Update consultation payment status
    await db.execute(`
      UPDATE consultations 
      SET payment_status = 'paid', 
      razorpay_order_id = ?, 
      razorpay_payment_id = ?,
      status = 'confirmed',
      updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [payment.order_id, payment.id, consultationId]);

    return { success: true };
  } catch (error) {
    console.error('Error processing consultation payment:', error);
    return { success: false, message: 'Error processing consultation payment' };
  }
}

// Process marketplace payment
async function processMarketplacePayment(orderId, payment) {
  try {
    // Update order payment status
    await db.execute(`
      UPDATE orders 
      SET payment_status = 'paid', 
      razorpay_order_id = ?, 
      razorpay_payment_id = ?,
      status = 'confirmed',
      updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [payment.order_id, payment.id, orderId]);

    return { success: true };
  } catch (error) {
    console.error('Error processing marketplace payment:', error);
    return { success: false, message: 'Error processing marketplace payment' };
  }
}

// GET payment history for user
router.get('/history/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const offset = (page - 1) * limit;

    const [payments] = await db.execute(`
      SELECT 
        po.*,
        c.id as consultation_id,
        o.id as order_id,
        o.order_number
      FROM payment_orders po
      LEFT JOIN consultations c ON po.reference_id = c.id AND po.type = 'consultation'
      LEFT JOIN orders o ON po.reference_id = o.id AND po.type = 'marketplace'
      WHERE po.user_id = ?
      ORDER BY po.created_at DESC
      LIMIT ? OFFSET ?
    `, [user_id, parseInt(limit), offset]);

    res.json({
      success: true,
      data: payments
    });

  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment history'
    });
  }
});

// POST refund payment
router.post('/refund', async (req, res) => {
  try {
    const { payment_id, amount, reason } = req.body;

    if (!payment_id || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Create refund
    const refundResult = await RazorpayService.createRefund(payment_id, amount);

    if (!refundResult.success) {
      return res.status(500).json({
        success: false,
        message: refundResult.message
      });
    }

    // Update payment order with refund details
    await db.execute(`
      UPDATE payment_orders 
      SET refund_id = ?, refund_amount = ?, refund_reason = ?, 
      status = 'refunded', refunded_at = CURRENT_TIMESTAMP
      WHERE razorpay_payment_id = ?
    `, [
      refundResult.data.id,
      amount,
      reason || 'Customer requested refund',
      payment_id
    ]);

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        refund_id: refundResult.data.id,
        amount: refundResult.data.amount / 100,
        status: refundResult.data.status
      }
    });

  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing refund'
    });
  }
});

// GET payment details
router.get('/details/:payment_id', async (req, res) => {
  try {
    const { payment_id } = req.params;

    const [payments] = await db.execute(`
      SELECT * FROM payment_orders 
      WHERE razorpay_payment_id = ?
    `, [payment_id]);

    if (payments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      data: payments[0]
    });

  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment details'
    });
  }
});

export default router;

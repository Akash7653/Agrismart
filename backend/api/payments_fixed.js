import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import { getDatabase } from '../db-client.js';

// Load environment variables
dotenv.config();

const router = express.Router();

// Razorpay will be initialized when needed
let razorpay = null;

const initializeRazorpay = () => {
  if (!razorpay && process.env.RAZORPAY_KEY_ID) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  }
  return razorpay;
};

// POST create payment order
router.post('/create-order', async (req, res) => {
  try {
    console.log('Payment order request body:', req.body);
    console.log('Environment variables:', {
      RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID ? 'SET' : 'NOT_SET',
      RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET ? 'SET' : 'NOT_SET'
    });
    
    const { amount, type, reference_id, user_id } = req.body;

    if (!amount || !type || !reference_id || !user_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Verify Razorpay credentials are configured
    console.log('Checking Razorpay config:', {
      hasKeyId: !!process.env.RAZORPAY_KEY_ID,
      hasKeySecret: !!process.env.RAZORPAY_KEY_SECRET,
      keyId: process.env.RAZORPAY_KEY_ID ? process.env.RAZORPAY_KEY_ID.substring(0, 10) + '...' : 'NOT SET'
    });

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'Razorpay is not properly configured. Please contact support.'
      });
    }

    // Generate receipt number
    const receipt = `${type.toUpperCase()}_${Date.now()}`;

    // Create Razorpay order
    const razorpayInstance = initializeRazorpay();
    console.log('Razorpay instance:', razorpayInstance ? 'CREATED' : 'NULL');
    
    if (!razorpayInstance) {
      return res.status(500).json({
        success: false,
        message: 'Razorpay is not configured'
      });
    }
    
    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: receipt,
      notes: {
        type: type,
        reference_id: reference_id,
        user_id: user_id,
        created_at: new Date().toISOString()
      }
    };

    const order = await razorpayInstance.orders.create(options);

    // Store order in database
    const database = await getDatabase();
    
    const orderData = {
      razorpay_order_id: order.id,
      amount: amount,
      currency: 'INR',
      receipt: receipt,
      notes: options.notes,
      status: 'created',
      user_id: user_id,
      type: type,
      reference_id: reference_id,
      created_at: new Date(),
      updated_at: new Date()
    };

    await database.collection('payment_orders').insertOne(orderData);

    res.json({
      success: true,
      data: {
        key: process.env.RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        receipt: order.receipt
      }
    });
  } catch (error) {
    console.error('Error creating order:', error);
    
    // Return appropriate error message
    if (error.statusCode === 401) {
      return res.status(401).json({
        success: false,
        message: 'Razorpay authentication failed. Please check your API credentials.'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating payment order: ' + error.message
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
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    expectedSignature.update(razorpay_order_id + '|' + razorpay_payment_id);
    if (expectedSignature.digest('hex') !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    // Get payment details from Razorpay
    const razorpayInstance = initializeRazorpay();
    let payment;
    try {
      payment = await razorpayInstance.payments.fetch(razorpay_payment_id);
    } catch (paymentError) {
      console.warn('Could not fetch payment details from Razorpay:', paymentError.message);
      // Continue anyway - signature is verified
      payment = { 
        id: razorpay_payment_id, 
        order_id: razorpay_order_id,
        status: 'authorized'
      };
    }

    // Update payment order in database
    const database = await getDatabase();
    const updateResult = await database.collection('payment_orders').updateOne(
      { razorpay_order_id: razorpay_order_id },
      {
        $set: {
          razorpay_payment_id: razorpay_payment_id,
          razorpay_signature: razorpay_signature,
          status: 'verified',
          payment_status: 'completed',
          payment_data: payment,
          verified_at: new Date()
        }
      }
    );

    console.log('Payment verification completed:', {
      order_id: razorpay_order_id,
      payment_id: razorpay_payment_id,
      type: type,
      updateResult: updateResult.modifiedCount > 0 ? 'Updated' : 'Not updated'
    });

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
        status: 'verified',
        amount: (payment.amount || 0) / 100
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

// GET payment history for user
router.get('/user-payments/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const database = await getDatabase();
    const payments = await database
      .collection('payment_orders')
      .find({ user_id: user_id })
      .sort({ created_at: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .toArray();

    const total = await database
      .collection('payment_orders')
      .countDocuments({ user_id: user_id });

    res.json({
      success: true,
      data: payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment history'
    });
  }
});

export default router;

import Razorpay from 'razorpay';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Razorpay will be initialized when needed
let razorpay = null;

const initializeRazorpay = () => {
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_SKFbgQlHO41CY6',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'A0LC7lPxB2aRWSOxKIkyOOto'
    });
  }
  return razorpay;
};

class RazorpayService {
  // Create order for payment
  static async createOrder(amount, receipt, notes = {}) {
    try {
      const options = {
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        receipt: receipt,
        notes: notes,
        payment_capture: 1 // Auto capture payment
      };

      const razorpayInstance = initializeRazorpay();
      const order = await razorpayInstance.orders.create(options);
      return {
        success: true,
        data: order
      };
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      return {
        success: false,
        message: error.error?.description || 'Error creating payment order'
      };
    }
  }

  // Verify payment signature
  static verifyPayment(paymentId, orderId, signature) {
    try {
      const crypto = require('crypto');
      const secret = process.env.RAZORPAY_KEY_SECRET || 'A0LC7lPxB2aRWSOxKIkyOOto';
      
      const body = orderId + '|' + paymentId;
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(body.toString())
        .digest('hex');

      const isAuthentic = expectedSignature === signature;

      return {
        success: isAuthentic,
        message: isAuthentic ? 'Payment verified successfully' : 'Payment verification failed'
      };
    } catch (error) {
      console.error('Error verifying Razorpay payment:', error);
      return {
        success: false,
        message: 'Error verifying payment'
      };
    }
  }

  // Get payment details
  static async getPayment(paymentId) {
    try {
      const razorpayInstance = initializeRazorpay();
      const payment = await razorpayInstance.payments.fetch(paymentId);
      return {
        success: true,
        data: payment
      };
    } catch (error) {
      console.error('Error fetching Razorpay payment:', error);
      return {
        success: false,
        message: error.error?.description || 'Error fetching payment details'
      };
    }
  }

  // Create refund
  static async createRefund(paymentId, amount) {
    try {
      const options = {
        amount: amount * 100 // Convert to paise
      };

      const razorpayInstance = initializeRazorpay();
      const refund = await razorpayInstance.payments.refund(paymentId, options);
      return {
        success: true,
        data: refund
      };
    } catch (error) {
      console.error('Error creating Razorpay refund:', error);
      return {
        success: false,
        message: error.error?.description || 'Error creating refund'
      };
    }
  }

  // Generate receipt number
  static generateReceiptNumber(prefix = 'AGR') {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${prefix}${timestamp}${random}`;
  }

  // Calculate platform fee (2% of transaction amount)
  static calculatePlatformFee(amount) {
    return Math.round(amount * 0.02 * 100) / 100; // Round to 2 decimal places
  }

  // Calculate settlement amount (after platform fee)
  static calculateSettlementAmount(amount) {
    const platformFee = this.calculatePlatformFee(amount);
    return amount - platformFee;
  }
}

export default RazorpayService;

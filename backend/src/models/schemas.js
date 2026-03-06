import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String },
    country: { type: String },
    language: { type: String, default: 'en', enum: ['en', 'hi', 'bn', 'ta', 'te', 'gu', 'kn', 'ml', 'mr', 'pa'] },
    farmSize: { type: Number }, // in hectares
    soilType: { type: String },
    location: { type: String },
    farmingExperience: { type: String }, // 'beginner', 'intermediate', 'advanced'
    isExpert: { type: Boolean, default: false },
    expertSpecialty: { type: String },
    expertBio: { type: String },
    expertExperience: { type: Number }, // years
    consultationFee: { type: Number }, // per consultation
    expertVerified: { type: Boolean, default: false },
    profileImage: { type: String },
    joinDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Crop Prediction Schema (with image storage)
const cropPredictionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: String,
    farmSize: Number,
    soilType: String,
    soilPH: { type: Number, min: 0, max: 14 },
    climate: String,
    rainfall: Number,
    temperature: Number,
    waterAvailability: String,
    budget: Number,
    workers: Number,
    predictions: [
      {
        crop: String,
        suitability: { type: Number, min: 0, max: 100 },
        expectedYield: String,
        profit: String,
        season: String,
        duration: String,
        waterNeed: String,
        laborNeed: String,
        marketDemand: String,
        riskFactor: String,
        confidence: { type: Number, min: 0, max: 100 },
      },
    ],
    // Image storage - user-specific variation
    imageUrl: String,
    imageData: Buffer, // Store image binary data
    imageBase64: String, // Or base64 encoded
    imageName: String,
    imageUploadDate: Date,
    status: { type: String, default: 'completed', enum: ['pending', 'processing', 'completed', 'failed'] },
    notes: String,
  },
  { timestamps: true }
);

// Disease Detection Schema (with image storage)
const diseaseDetectionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cropType: String,
    imageUrl: String,
    imageData: Buffer, // Store image binary
    imageBase64: String, // Or base64
    imageName: String,
    imageUploadDate: Date,
    disease: String,
    confidence: { type: Number, min: 0, max: 100 },
    severity: { type: String, enum: ['Low', 'Medium', 'High'] },
    description: String,
    causes: [String],
    treatments: [String],
    prevention: [String],
    affectedArea: Number, // percentage
    status: { type: String, default: 'completed', enum: ['pending', 'processing', 'completed', 'failed'] },
  },
  { timestamps: true }
);

// Appointment Schema (real-time booking)
const appointmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    expertId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    consultationType: String, // 'crop-prediction', 'disease-detection', 'general'
    title: String,
    description: String,
    scheduledTime: { type: Date, required: true },
    duration: { type: Number, default: 30 }, // minutes
    status: { type: String, default: 'scheduled', enum: ['scheduled', 'confirmed', 'completed', 'cancelled'] },
    meetingLink: String, // for video consultation
    notes: String,
    feedback: String,
    rating: { type: Number, min: 1, max: 5 },
    notificationSent: { type: Boolean, default: false },
    reminderSent: { type: Boolean, default: false },
    consultationFee: { type: Number },
    paymentStatus: { type: String, default: 'pending', enum: ['pending', 'completed', 'failed', 'refunded'] },
  },
  { timestamps: true }
);

// Order/Cart Schema (real payments)
const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        productName: String,
        quantity: Number,
        price: Number,
        subtotal: Number,
        image: String,
      },
    ],
    totalAmount: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    taxAmount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    status: { type: String, default: 'pending', enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    shippingAddress: {
      name: String,
      phone: String,
      address: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
    },
    trackingNumber: String,
    deliveryDate: Date,
    notes: String,
  },
  { timestamps: true }
);

// Payment Schema (real transaction tracking)
const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    paymentMethod: { type: String, enum: ['razorpay', 'card', 'upi', 'bank_transfer'] },
    razorpayPaymentId: String,
    razorpayOrderId: String,
    status: { type: String, default: 'pending', enum: ['pending', 'completed', 'failed', 'refunded'] },
    transactionId: String,
    receiptId: String,
    description: String,
    refundAmount: { type: Number, default: 0 },
    failureReason: String,
    metadata: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

// Product Schema (for marketplace)
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    category: String,
    price: { type: Number, required: true },
    originalPrice: Number,
    discount: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    images: [String], // Array of image URLs
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isOrganic: { type: Boolean, default: true },
    certification: String,
    origin: String,
    shelfLife: String,
    usageInstructions: String,
    benefits: [String],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Notification Schema (for real-time appointments)
const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    type: { type: String, enum: ['appointment_scheduled', 'appointment_reminder', 'appointment_cancelled', 'payment_received', 'order_status'] },
    title: String,
    message: String,
    isRead: { type: Boolean, default: false },
    readAt: Date,
  },
  { timestamps: true }
);

// Create Models
const User = mongoose.model('User', userSchema);
const CropPrediction = mongoose.model('CropPrediction', cropPredictionSchema);
const DiseaseDetection = mongoose.model('DiseaseDetection', diseaseDetectionSchema);
const Appointment = mongoose.model('Appointment', appointmentSchema);
const Order = mongoose.model('Order', orderSchema);
const Payment = mongoose.model('Payment', paymentSchema);
const Product = mongoose.model('Product', productSchema);
const Notification = mongoose.model('Notification', notificationSchema);

export { User, CropPrediction, DiseaseDetection, Appointment, Order, Payment, Product, Notification };

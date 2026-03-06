import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';
import { getDbClient } from './db-client.js';
import { connectDatabase } from './mongoose-connection.js';

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import routes
import marketplaceRoutes from './api/marketplace.js';
import marketplaceMongoRoutes from './api/marketplace_mongo.js';
import consultationsRoutes from './api/consultations.js';
import enhancedConsultationsRoutes from './api/enhanced_consultations.js';
import consultationsFixedRoutes from './api/consultations_fixed.js';
// import paymentsRoutes from './api/payments.js';
import paymentsFixedRoutes from './api/payments_fixed.js';
import usersRoutes from './api/users.js';
import cropPredictionRoutes from './api/crop_prediction.js';
import diseaseDetectionRoutes from './api/disease_detection.js';
import userHistoryRoutes from './api/user_history.js';
import cropsRoutes from './api/crops.js';
import diseasesRoutes from './api/diseases.js';
import predictionsRoutes from './api/predictions.js';
import appointmentsRoutes from './api/appointments.js';
import paymentsAndOrdersRoutes from './api/payments_and_orders.js';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Create HTTP server for socket.io
const httpServer = http.createServer(app);

// Initialize Socket.io
export const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
    credentials: true,
    methods: ['GET', 'POST']
  },
  transports: ['websocket', 'polling']
});

// Socket.io event handlers for real-time notifications
io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // Join user-specific room
  socket.on('join_user_room', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`👤 User ${userId} joined their room`);
  });

  // Leave user room
  socket.on('leave_user_room', (userId) => {
    socket.leave(`user_${userId}`);
    console.log(`👤 User ${userId} left their room`);
  });

  // Notification events
  socket.on('notification_read', (data) => {
    io.to(`user_${data.userId}`).emit('notification_marked_read', data);
  });

  // Appointment events
  socket.on('appointment_booking_request', (data) => {
    io.to(`user_${data.expertId}`).emit('new_appointment_request', data);
  });

  // Chat/messaging for consultations (optional)
  socket.on('send_message', (data) => {
    io.to(`appointment_${data.appointmentId}`).emit('receive_message', data);
  });

  // Disconnect handler
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (uploads)
app.use('/uploads', express.static('uploads'));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads', 'products');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// MongoDB connection - Initialize both raw MongoDB client and Mongoose
Promise.all([
  getDbClient().then(() => {
    console.log('✅ MongoDB Raw Client connected successfully');
  }).catch(error => {
    console.error('❌ MongoDB Raw Client connection error:', error);
  }),
  connectDatabase().then(() => {
    console.log('✅ Mongoose ORM connected successfully');
  }).catch(error => {
    console.error('❌ Mongoose connection error:', error);
  })
]);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'AgriSmart Backend API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      api_base: '/api',
      docs: 'Try /api/health'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'AgriSmart Backend API'
  });
});

// API Routes
app.use('/api/marketplace', marketplaceMongoRoutes);
app.use('/api/consultations', consultationsFixedRoutes);
app.use('/api/consultations-enhanced', enhancedConsultationsRoutes);
app.use('/api/payments', paymentsFixedRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/crop-prediction', cropPredictionRoutes);
app.use('/api/disease-detection', diseaseDetectionRoutes);
app.use('/api/user-history', userHistoryRoutes);
app.use('/api/crops', cropsRoutes);
app.use('/api/diseases', diseasesRoutes);

// 🆕 NEW ROUTES FOR REAL DATA INTEGRATION
app.use('/api/predictions', predictionsRoutes);     // Crop & Disease predictions with images
app.use('/api/appointments', appointmentsRoutes);   // Real-time appointment booking
app.use('/api/orders', paymentsAndOrdersRoutes);    // Orders management
app.use('/api/payments', paymentsAndOrdersRoutes);  // Payment management & Razorpay integration
app.use('/api/user', userHistoryRoutes);            // User history, profile, notifications

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Error:', error);
  
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'File size too large. Maximum size is 5MB.'
    });
  }
  
  if (error.code === 'LIMIT_FILE_COUNT') {
    return res.status(413).json({
      success: false,
      message: 'Too many files uploaded.'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 AgriSmart Backend Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: http://localhost:5173`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🔌 WebSocket Server: ws://localhost:${PORT}`);
  console.log(`💳 Razorpay Test Mode: ${process.env.RAZORPAY_KEY_ID ? 'Configured' : 'Using Test Keys'}`);
  console.log(`🤖 ML Server: http://localhost:8000 (crop/disease prediction)`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  httpServer.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

export default app;

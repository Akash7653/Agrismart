# Frontend Integration Guide - Real Data Backend

This guide explains how the frontend now integrates with the new real data backend for predictions, appointments, orders, payments, and notifications.

## Overview

The backend has been completely restructured to use:
- **MongoDB** for persistent data storage (instead of demo data)
- **Real-time Socket.io** for live notifications
- **Python ML Models** for crop/disease predictions
- **Razorpay** for payment processing
- **Multer** for image upload handling

## Architecture Diagram

```
Frontend (React)
    ↓
├─ userService.ts (API client)
│   ├─ GET /api/user/history/:userId → UserHistory component
│   ├─ POST /api/predictions/crop → Create crop prediction
│   ├─ POST /api/predictions/disease → Create disease detection
│   ├─ POST /api/appointments/book → Book appointment
│   ├─ POST /api/payments/create-razorpay-order → Initiate payment
│   └─ POST /api/payments/verify-razorpay → Verify payment
│
└─ Socket.io Client
    ↓
Backend (Node.js + Express)
    ├─ MongoDB (schemas.js) - Data persistence
    ├─ ML Services (Python FastAPI) - Predictions
    ├─ APIs
    │   ├─ predictions.js - Crop/disease storage
    │   ├─ appointments.js - Appointment booking
    │   ├─ payments_and_orders.js - Razorpay integration
    │   ├─ user_history.js - Timeline + statistics
    │   └─ consultations.js - Expert management
    └─ Socket.io - Real-time events
```

## Updated Components

### 1. UserHistory Component (`src/components/UserHistory.tsx`)

**What Changed:**
- Now fetches real data from backend instead of using demo data
- Uses new `userService` to call real API endpoints
- Displays unified timeline combining predictions, appointments, orders, and payments
- Shows real statistics calculated from database
- Supports refresh functionality

**Key Features:**
```typescript
// Fetches user history with timeline and statistics
const historyData = await userService.getUserHistory(userId);

// Returns:
{
  timeline: [
    {
      id: string,
      type: 'prediction' | 'disease' | 'appointment' | 'order' | 'payment',
      title: string,
      description?: string,
      amount?: number,
      status?: string,
      timestamp: string,
      details: any
    }
  ],
  statistics: {
    totalPredictions: number,
    completedAppointments: number,
    totalOrders: number,
    totalExpenses: number,
    unreadNotifications: number
  }
}
```

**User Flow:**
1. Component mounts → Gets user ID from localStorage
2. Calls `userService.getUserHistory(userId)`
3. Backend fetches from all collections (predictions, appointments, orders, payments)
4. Backend creates unified timeline, sorts by date
5. Component displays timeline with statistics cards
6. User can click to expand items for more details
7. Click refresh button to sync latest changes

### 2. User Service (`src/services/userService.ts`)

**New Service File** - Complete API client for all user-related operations

**Key Methods:**

```typescript
// Get history with timeline
userService.getUserHistory(userId: string)

// Get user profile
userService.getUserProfile(userId: string)

// Predictions
userService.getPredictions(userId, limit, skip)
userService.getDiseaseDetections(userId, limit, skip)
userService.createPrediction(userId, formData)
userService.createDiseaseDetection(userId, formData)

// Appointments
userService.getAppointments(userId)
userService.bookAppointment(appointmentData)
userService.cancelAppointment(appointmentId)

// Orders
userService.createOrder(orderData)

// Payments
userService.createRazorpayOrder(paymentData)
userService.verifyRazorpayPayment(verificationData)

// Notifications
userService.getNotifications(userId)
userService.markNotificationAsRead(userId, notificationId)
```

## Backend Endpoints

### User History & Profile

```
GET /api/user/history/:userId
Response:
{
  timeline: TimelineItem[],
  statistics: {
    totalPredictions: number,
    completedAppointments: number,
    totalOrders: number,
    totalExpenses: number,
    unreadNotifications: number
  }
}

GET /api/user/profile/:userId
Response: {
  _id: string,
  name: string,
  email: string,
  stats: {
    predictionCount: number,
    appointmentCount: number,
    orderCount: number,
    totalSpent: number
  }
}
```

### Predictions

```
POST /api/predictions/crop
Body: FormData with:
  - userId: string
  - soilType: string
  - climate: string
  - image: File (optional)
Response: Prediction object with imageUrl, imageBase64

POST /api/predictions/disease
Body: FormData with:
  - userId: string
  - cropType: string
  - image: File
Response: DiseaseDetection object

GET /api/predictions/crop/:userId
GET /api/predictions/disease/:userId
```

### Appointments

```
POST /api/appointments/book
Body: {
  userId: string,
  expertId: string,
  title: string,
  scheduledTime: string (ISO date),
  duration?: number
}
Response: AppointmentData with appointment details

GET /api/appointments/user/:userId
Response: AppointmentData[]

PATCH /api/appointments/:id/confirm
PATCH /api/appointments/:id/cancel
PATCH /api/appointments/:id/status
```

### Orders & Payments

```
POST /api/orders/create
Body: {
  userId: string,
  items: OrderItem[],
  shippingAddress?: string
}
Response: OrderData with order ID and totals

POST /api/payments/create-razorpay-order
Body: {
  userId: string,
  amount: number,
  orderId?: string,
  appointmentId?: string
}
Response: {
  razorpay_order_id: string,
  amount: number,
  currency: string
}

POST /api/payments/verify-razorpay
Body: {
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
}
Response: PaymentData with payment status
```

### Notifications

```
GET /api/user/notifications/:userId
Response: NotificationData[]

PATCH /api/user/notifications/:userId/:notificationId/read
```

## Socket.io Real-Time Events

The backend emits real-time updates to connected clients. Frontend should implement Socket.io client to receive these events.

### Server Events (to client):

```typescript
// Appointment events
socket.on('new_appointment', (appointmentData) => {
  // An appointment was created
});

socket.on('appointment_confirmed', (appointmentData) => {
  // Expert confirmed the appointment
});

socket.on('appointment_cancelled', (appointmentData) => {
  // Appointment was cancelled (can refund)
});

// Payment events
socket.on('payment_completed', (paymentData) => {
  // Payment was successful
});

socket.on('payment_failed', (paymentData) => {
  // Payment failed
});

// Order events
socket.on('order_created', (orderData) => {
  // Order was created
});

socket.on('order_shipped', (orderData) => {
  // Order was shipped
});

socket.on('order_delivered', (orderData) => {
  // Order was delivered
});
```

## How to Implement Socket.io Client

Add this to your main component or layout:

```typescript
import { io } from 'socket.io-client';

const socket = io('http://localhost:4000', {
  auth: {
    token: localStorage.getItem('authToken')
  }
});

// Connect to user room
const user = JSON.parse(localStorage.getItem('user')!);
socket.emit('join_user_room', user._id || user.id);

// Listen to events
socket.on('appointment_confirmed', (data) => {
  console.log('Appointment confirmed:', data);
  // Update UI, show toast notification
});

// Clean up on unmount
socket.off('appointment_confirmed');
socket.disconnect();
```

## ML Model Integration

### Crop Prediction Model

**Input:**
```
{
  soilType: 'Loamy' | 'Sandy' | 'Clay' | 'Alluvial',
  climate: 'Tropical' | 'Subtropical' | 'Temperate' | 'Arid',
  farmingExperience: number (years)
}
```

**Output:**
```
[
  {
    cropName: string,
    suitability: 0-1 (confidence score),
    estimatedYield: number (tons/ha),
    estimatedProfit: number (₹/ha)
  }
]
```

### Disease Detection Model

**Input:**
```
{
  image: File,
  cropType: 'Tomato' | 'Potato' | 'Wheat' | 'Rice'
}
```

**Output:**
```
{
  disease: string,
  confidence: 0-1,
  severity: 'Low' | 'Medium' | 'High',
  treatments: string[],
  prevention: string[]
}
```

## Environment Variables

Add to `.env` file in backend root:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/agrismart

# Razorpay
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# ML Service
ML_SERVICE_URL=http://localhost:8000

# Server
PORT=4000
NODE_ENV=development
```

Add to `.env` file in frontend root:

```env
REACT_APP_API_URL=http://localhost:4000/api
REACT_APP_ML_API_URL=http://localhost:8000
REACT_APP_SOCKET_URL=http://localhost:4000
```

## Implementation Checklist

### Phase 1: Core Data Display (✅ COMPLETED)
- [x] Create `userService.ts` with all API methods
- [x] Update `UserHistory.tsx` to fetch real data
- [x] Display timeline with statistics
- [x] Add refresh functionality

### Phase 2: Predictions Integration (⏳ IN PROGRESS)
- [ ] Create crop prediction form with image upload
- [ ] Create disease detection form with image capture
- [ ] Integrate with `/api/predictions/crop` endpoint
- [ ] Integrate with `/api/predictions/disease` endpoint
- [ ] Display prediction results with recommendations
- [ ] Add predictions to history automatically

**Files to Update:**
- `ModernCropPrediction.tsx` - Add image upload, call `userService.createPrediction()`
- `ModernDiseaseDetection.tsx` - Add image upload, call `userService.createDiseaseDetection()`

**Example Implementation:**
```typescript
const handleCropPrediction = async (formData: FormData) => {
  try {
    const user = JSON.parse(localStorage.getItem('user')!);
    const prediction = await userService.createPrediction(user._id, formData);
    // Show results
    // Auto-refresh history
  } catch (err) {
    // Handle error
  }
};
```

### Phase 3: Appointment Booking (⏳ NOT STARTED)
- [ ] Create appointment booking modal with date/time picker
- [ ] Fetch available experts from `/api/consultations`
- [ ] Call `userService.bookAppointment()` on submit
- [ ] Handle appointment confirmation
- [ ] Listen to Socket.io events for updates

**Files to Update:**
- `ModernConsultations.tsx` - Add booking form with real expert data

**Example:**
```typescript
const handleBookAppointment = async (formData) => {
  const user = JSON.parse(localStorage.getItem('user')!);
  const appointment = await userService.bookAppointment({
    userId: user._id,
    expertId: selectedExpert._id,
    title: formData.title,
    scheduledTime: formData.date,
    duration: formData.duration
  });
  // Refresh history and show success
};
```

### Phase 4: Payment Integration (⏳ NOT STARTED)
- [ ] Create Razorpay checkout modal
- [ ] Call `userService.createRazorpayOrder()` to get order ID
- [ ] Open Razorpay checkout with order ID
- [ ] Call `userService.verifyRazorpayPayment()` after success
- [ ] Sign up for Razorpay account and get keys
- [ ] Add keys to backend `.env`

**Example:**
```typescript
const handlePayment = async (amount: number) => {
  const user = JSON.parse(localStorage.getItem('user')!);
  
  // Step 1: Create Razorpay order
  const { razorpay_order_id } = await userService.createRazorpayOrder({
    userId: user._id,
    amount: amount * 100, // Convert to paise
    orderId: selectedOrder._id // or appointmentId
  });

  // Step 2: Open Razorpay checkout
  const razorpay = new window.Razorpay({
    key: 'RAZORPAY_KEY_ID', // from .env
    order_id: razorpay_order_id,
    amount: amount * 100,
    handler(response: any) {
      // Step 3: Verify payment
      userService.verifyRazorpayPayment({
        razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature
      }).then(() => {
        // Payment successful
      });
    }
  });

  razorpay.open();
};
```

### Phase 5: Real-Time Notifications (⏳ NOT STARTED)
- [ ] Initialize Socket.io client in main layout
- [ ] Create notification toast component
- [ ] Listen to appointment/payment/order events
- [ ] Display notification badges for unread count
- [ ] Auto-refresh history on events

**Example:**
```typescript
useEffect(() => {
  const socket = io('http://localhost:4000', {
    auth: { token: localStorage.getItem('authToken') }
  });

  const user = JSON.parse(localStorage.getItem('user')!);
  socket.emit('join_user_room', user._id);

  socket.on('appointment_confirmed', (data) => {
    showToast('✅ Appointment confirmed!', 'success');
    refreshHistory();
  });

  socket.on('payment_completed', (data) => {
    showToast('✅ Payment successful!', 'success');
    refreshHistory();
  });

  return () => socket.disconnect();
}, []);
```

## Testing the Integration

### 1. Test UserHistory Loading

```bash
# Start backend
cd backend && npm run dev

# Check if API is working
curl http://localhost:4000/api/user/history/YOUR_USER_ID

# Check browser console in UserHistory component
# Should see timeline and statistics
```

### 2. Test Prediction Creation

```bash
curl -X POST http://localhost:4000/api/predictions/crop \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "userId=YOUR_USER_ID" \
  -F "soilType=Loamy" \
  -F "climate=Tropical" \
  -F "image=@/path/to/image.jpg"
```

### 3. Test Appointment Booking

```bash
curl -X POST http://localhost:4000/api/appointments/book \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "YOUR_USER_ID",
    "expertId": "EXPERT_ID",
    "title": "Crop Health Consultation",
    "scheduledTime": "2024-03-20T14:00:00Z",
    "duration": 60
  }'
```

### 4. Test Razorpay Order Creation

```bash
curl -X POST http://localhost:4000/api/payments/create-razorpay-order \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "YOUR_USER_ID",
    "amount": 50000,
    "orderId": "ORDER_ID"
  }'
```

## Troubleshooting

### "User not authenticated" Error
- Check if user object is in localStorage
- Check if authToken exists
- Login again if needed

### "Failed to load history" Error
- Check if backend is running on port 4000
- Check browser console for actual error
- Verify user ID matches in database

### Predictions not showing
- Check if ML service is running on port 8000
- Check if image was uploaded to `uploads/predictions/`
- Check backend logs for ML service errors

### Real-time updates not working
- Check if Socket.io is connected (browser DevTools > Network)
- Check if user joined correct room name
- Verify CORS is configured on Socket.io server

### Payment verification fails
- Check Razorpay keys are correct in `.env`
- Check signature verification logic
- Verify payment amount matches

## Next Steps

1. **Immediate:** Test UserHistory component with real backend data
2. **Short-term:** Implement prediction and appointment booking forms
3. **Medium-term:** Integrate Razorpay payment flow
4. **Long-term:** Add Socket.io real-time notifications throughout app

## Support

For issues or questions about the integration:
1. Check backend logs: `backend/logs/`
2. Check browser console for frontend errors
3. Review ML service logs if predictions fail
4. Verify database connection is active

---

**Last Updated:** 2024-03-20  
**Backend Version:** 4.0 (Real Data Integration)  
**Frontend Version:** 2.0 (Service Integration)

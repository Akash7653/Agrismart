import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://agrismart-7zyv.onrender.com/api';

// ============ TYPES ============

export interface Prediction {
  _id: string;
  userId: string;
  cropName: string;
  soilType: string;
  climate: string;
  predictedCrop: string;
  suitability: number;
  recommendations: string[];
  imageUrl?: string;
  imageBase64?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DiseaseDetection {
  _id: string;
  userId: string;
  cropType: string;
  detectedDisease: string;
  confidence: number;
  severity: string;
  treatments: string[];
  prevention: string[];
  imageUrl?: string;
  createdAt: string;
}

export interface AppointmentData {
  _id: string;
  userId: string;
  expertId: string;
  expertName?: string;
  title: string;
  description?: string;
  scheduledTime: string;
  duration?: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  meetingLink?: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderData {
  _id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  subtotal: number;
  tax: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentData {
  _id: string;
  userId: string;
  orderId?: string;
  appointmentId?: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationData {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: string;
}

export interface TimelineItem {
  id: string;
  type: 'prediction' | 'disease' | 'appointment' | 'order' | 'payment' | 'notification';
  title: string;
  description?: string;
  amount?: number;
  status?: string;
  timestamp: string;
  icon: string;
  color: string;
  details: any;
}

export interface UserHistory {
  timeline: TimelineItem[];
  statistics: {
    totalPredictions: number;
    completedAppointments: number;
    totalOrders: number;
    totalExpenses: number;
    unreadNotifications: number;
  };
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  farmingExperience?: number;
  landSize?: number;
  language?: string;
  createdAt: string;
  stats?: {
    predictionCount: number;
    appointmentCount: number;
    orderCount: number;
    totalSpent: number;
  };
}

// ============ SERVICE FUNCTIONS ============

export const userService = {
  /**
   * Get complete user history with timeline and statistics
   */
  async getUserHistory(userId: string): Promise<UserHistory> {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/history/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user history:', error);
      throw error;
    }
  },

  /**
   * Get user profile with statistics
   */
  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/profile/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  /**
   * Get user's crop predictions
   */
  async getPredictions(userId: string, limit = 20, skip = 0): Promise<Prediction[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/predictions/crop/${userId}?limit=${limit}&skip=${skip}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching predictions:', error);
      throw error;
    }
  },

  /**
   * Get user's disease detections
   */
  async getDiseaseDetections(userId: string, limit = 20, skip = 0): Promise<DiseaseDetection[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/predictions/disease/${userId}?limit=${limit}&skip=${skip}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching disease detections:', error);
      throw error;
    }
  },

  /**
   * Get user's appointments
   */
  async getAppointments(userId: string): Promise<AppointmentData[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/appointments/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', error);
      throw error;
    }
  },

  /**
   * Get user's notifications
   */
  async getNotifications(userId: string): Promise<NotificationData[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/user/notifications/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  /**
   * Mark notification as read
   */
  async markNotificationAsRead(userId: string, notificationId: string): Promise<void> {
    try {
      await axios.patch(
        `${API_BASE_URL}/user/notifications/${userId}/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  /**
   * Create a crop prediction
   */
  async createPrediction(userId: string, formData: FormData): Promise<Prediction> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/predictions/crop`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating prediction:', error);
      throw error;
    }
  },

  /**
   * Create a disease detection
   */
  async createDiseaseDetection(userId: string, formData: FormData): Promise<DiseaseDetection> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/predictions/disease`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating disease detection:', error);
      throw error;
    }
  },

  /**
   * Book an appointment
   */
  async bookAppointment(appointmentData: {
    userId: string;
    expertId: string;
    title: string;
    description?: string;
    scheduledTime: string;
    duration?: number;
  }): Promise<AppointmentData> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/appointments/book`,
        appointmentData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error booking appointment:', error);
      throw error;
    }
  },

  /**
   * Cancel an appointment
   */
  async cancelAppointment(appointmentId: string): Promise<AppointmentData> {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/appointments/${appointmentId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw error;
    }
  },

  /**
   * Create an order
   */
  async createOrder(orderData: {
    userId: string;
    items: OrderItem[];
    shippingAddress?: string;
  }): Promise<OrderData> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/orders/create`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  /**
   * Create a Razorpay payment order
   */
  async createRazorpayOrder(paymentData: {
    userId: string;
    orderId?: string;
    appointmentId?: string;
    amount: number;
  }): Promise<any> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/payments/create-razorpay-order`,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  },

  /**
   * Verify a Razorpay payment
   */
  async verifyRazorpayPayment(verificationData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<PaymentData> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/payments/verify-razorpay`,
        verificationData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error verifying Razorpay payment:', error);
      throw error;
    }
  }
};

export default userService;

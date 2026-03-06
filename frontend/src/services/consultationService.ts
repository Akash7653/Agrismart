import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Types
export interface Scientist {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  country: string;
  timezone: string;
  bio: string;
  education: Array<{ degree: string; institution: string; year: string }>;
  experienceYears: number;
  languages: string[];
  specialties: string[];
  profileImageUrl?: string;
  verificationStatus: 'pending' | 'approved' | 'rejected';
  rating: number;
  reviewCount: number;
  consultationFee: number;
  commissionRate: number;
  availableHours: Record<string, string[]>;
  totalConsultations: number;
  totalEarnings: number;
  responseTime: string;
  acceptanceRate: number;
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface Consultation {
  id: string;
  scientistId: string;
  farmerId: string;
  specialty: string;
  consultationType: 'video' | 'chat' | 'field_visit';
  scheduledTime: string;
  durationMinutes: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  meetingLink?: string;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  amount: number;
  platformFee: number;
  scientistEarnings: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  scientist?: Scientist;
}

export interface Review {
  id: string;
  consultationId: string;
  scientistId: string;
  farmerId: string;
  rating: number;
  reviewText: string;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  consultationId: string;
  paymentMethod: 'stripe' | 'paypal' | 'upi';
  transactionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export interface BookingRequest {
  scientistId: string;
  consultationType: 'video' | 'chat' | 'field_visit';
  scheduledTime: string;
  durationMinutes: number;
  notes?: string;
  paymentMethod: 'stripe' | 'paypal' | 'upi';
}

export interface TimeSlot {
  date: string;
  time: string;
  available: boolean;
}

// API Service
class ConsultationService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  constructor() {
    // Add auth token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  // Scientists
  async getScientists(params?: {
    specialty?: string;
    language?: string;
    country?: string;
    minRating?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
  }): Promise<{ scientists: Scientist[]; total: number; page: number; totalPages: number }> {
    const response = await this.api.get('/scientists', { params });
    return response.data;
  }

  async getScientistById(id: string): Promise<Scientist> {
    const response = await this.api.get(`/scientists/${id}`);
    return response.data;
  }

  async getScientistAvailability(scientistId: string, startDate: string, endDate: string): Promise<TimeSlot[]> {
    const response = await this.api.get(`/scientists/${scientistId}/availability`, {
      params: { startDate, endDate }
    });
    return response.data;
  }

  async applyToBecomeScientist(applicationData: {
    fullName: string;
    email: string;
    phone?: string;
    country: string;
    timezone: string;
    bio: string;
    education: Array<{ degree: string; institution: string; year: string }>;
    experienceYears: number;
    languages: string[];
    specialties: string[];
    consultationFee: number;
    availableHours: Record<string, string[]>;
    resume?: File;
    certificates?: File[];
  }): Promise<Scientist> {
    const formData = new FormData();
    
    // Add all fields to FormData
    Object.entries(applicationData).forEach(([key, value]) => {
      if (key === 'education' || key === 'languages' || key === 'specialties' || key === 'availableHours') {
        formData.append(key, JSON.stringify(value));
      } else if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const response = await this.api.post('/scientists/apply', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Consultations
  async getConsultations(params?: {
    status?: string;
    scientistId?: string;
    farmerId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<{ consultations: Consultation[]; total: number; page: number; totalPages: number }> {
    const response = await this.api.get('/consultations', { params });
    return response.data;
  }

  async getConsultationById(id: string): Promise<Consultation> {
    const response = await this.api.get(`/consultations/${id}`);
    return response.data;
  }

  async createConsultation(bookingData: BookingRequest): Promise<Consultation> {
    const response = await this.api.post('/consultations', bookingData);
    return response.data;
  }

  async updateConsultation(id: string, updates: Partial<Consultation>): Promise<Consultation> {
    const response = await this.api.patch(`/consultations/${id}`, updates);
    return response.data;
  }

  async cancelConsultation(id: string, reason?: string): Promise<Consultation> {
    const response = await this.api.post(`/consultations/${id}/cancel`, { reason });
    return response.data;
  }

  async completeConsultation(id: string, notes?: string): Promise<Consultation> {
    const response = await this.api.post(`/consultations/${id}/complete`, { notes });
    return response.data;
  }

  async generateMeetingLink(consultationId: string): Promise<{ meetingLink: string; meetingId: string }> {
    const response = await this.api.post(`/consultations/${consultationId}/meeting-link`);
    return response.data;
  }

  // Reviews
  async getReviews(params?: {
    scientistId?: string;
    farmerId?: string;
    rating?: number;
    page?: number;
    limit?: number;
  }): Promise<{ reviews: Review[]; total: number; page: number; totalPages: number }> {
    const response = await this.api.get('/reviews', { params });
    return response.data;
  }

  async createReview(reviewData: {
    consultationId: string;
    rating: number;
    reviewText?: string;
  }): Promise<Review> {
    const response = await this.api.post('/reviews', reviewData);
    return response.data;
  }

  async updateReview(id: string, updates: Partial<Review>): Promise<Review> {
    const response = await this.api.patch(`/reviews/${id}`, updates);
    return response.data;
  }

  async markReviewHelpful(reviewId: string): Promise<Review> {
    const response = await this.api.post(`/reviews/${reviewId}/helpful`);
    return response.data;
  }

  // Payments
  async processPayment(paymentData: {
    consultationId: string;
    paymentMethod: 'stripe' | 'paypal' | 'upi';
    amount: number;
    currency?: string;
  }): Promise<{ payment: Payment; clientSecret?: string; redirectUrl?: string }> {
    const response = await this.api.post('/payments/process', paymentData);
    return response.data;
  }

  async confirmPayment(paymentId: string, paymentIntentId?: string): Promise<Payment> {
    const response = await this.api.post(`/payments/${paymentId}/confirm`, { paymentIntentId });
    return response.data;
  }

  async refundPayment(paymentId: string, reason?: string): Promise<Payment> {
    const response = await this.api.post(`/payments/${paymentId}/refund`, { reason });
    return response.data;
  }

  // Analytics
  async getScientistAnalytics(scientistId: string, period?: 'week' | 'month' | 'year'): Promise<{
    totalConsultations: number;
    totalEarnings: number;
    averageRating: number;
    responseTime: string;
    acceptanceRate: number;
    popularSpecialties: Array<{ specialty: string; count: number }>;
    earningsChart: Array<{ date: string; earnings: number }>;
    consultationsChart: Array<{ date: string; count: number }>;
  }> {
    const response = await this.api.get(`/scientists/${scientistId}/analytics`, { params: { period } });
    return response.data;
  }

  async getPlatformAnalytics(period?: 'week' | 'month' | 'year'): Promise<{
    totalScientists: number;
    totalConsultations: number;
    totalRevenue: number;
    averageConsultationFee: number;
    topSpecialties: Array<{ specialty: string; count: number }>;
    topCountries: Array<{ country: string; count: number }>;
    revenueChart: Array<{ date: string; revenue: number }>;
    consultationsChart: Array<{ date: string; count: number }>;
  }> {
    const response = await this.api.get('/analytics/platform', { params: { period } });
    return response.data;
  }

  // Admin Functions
  async approveScientist(scientistId: string, commissionRate?: number): Promise<Scientist> {
    const response = await this.api.post(`/admin/scientists/${scientistId}/approve`, { commissionRate });
    return response.data;
  }

  async rejectScientist(scientistId: string, reason: string): Promise<Scientist> {
    const response = await this.api.post(`/admin/scientists/${scientistId}/reject`, { reason });
    return response.data;
  }

  async updateCommissionRate(scientistId: string, commissionRate: number): Promise<Scientist> {
    const response = await this.api.patch(`/admin/scientists/${scientistId}/commission`, { commissionRate });
    return response.data;
  }

  async getCommissionSettings(): Promise<{
    defaultRate: number;
    expertRate: number;
    premiumRate: number;
    volumeThreshold: number;
    bonusThreshold: number;
  }> {
    const response = await this.api.get('/admin/commission-settings');
    return response.data;
  }

  async updateCommissionSettings(settings: {
    defaultRate: number;
    expertRate: number;
    premiumRate: number;
    volumeThreshold: number;
    bonusThreshold: number;
  }): Promise<any> {
    const response = await this.api.put('/admin/commission-settings', settings);
    return response.data;
  }

  // Notifications
  async sendConsultationReminder(consultationId: string): Promise<void> {
    await this.api.post(`/consultations/${consultationId}/reminder`);
  }

  async sendFollowUpMessage(consultationId: string, message: string): Promise<void> {
    await this.api.post(`/consultations/${consultationId}/follow-up`, { message });
  }

  // WebSocket for real-time updates
  subscribeToConsultationUpdates(consultationId: string, callback: (data: any) => void): () => void {
    const ws = new WebSocket(`${API_BASE_URL.replace('http', 'ws')}/consultations/${consultationId}/subscribe`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };

    return () => {
      ws.close();
    };
  }
}

export const consultationService = new ConsultationService();
export default consultationService;

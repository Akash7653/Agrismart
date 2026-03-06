# Global AgriScientist Consultation System Architecture

## 🌍 Overview

The AgriScientist Consultation System is a comprehensive platform designed to connect farmers with agricultural experts worldwide. The system supports multi-language consultations, real-time video calls, secure payments, and scalable global onboarding of scientists.

## 🏗️ System Architecture

### Frontend Architecture

#### **Component Structure**
```
src/
├── components/
│   ├── consultations/
│   │   ├── ConsultationDashboard.tsx     # Main dashboard for browsing experts
│   │   ├── BookingSystem.tsx            # Multi-step booking flow
│   │   ├── ScientistProfile.tsx          # Detailed expert profiles
│   │   ├── ConsultationCard.tsx          # Individual consultation cards
│   │   ├── ReviewSystem.tsx              # Rating and review components
│   │   └── VideoCall.tsx                 # Video consultation interface
│   ├── admin/
│   │   ├── ScientistManagement.tsx       # Admin dashboard for scientist approval
│   │   ├── CommissionSettings.tsx        # Revenue management
│   │   └── AnalyticsDashboard.tsx        # Platform analytics
│   └── shared/
│       ├── TimezoneSelector.tsx          # Time zone handling
│       ├── LanguageSelector.tsx          # Multi-language support
│       └── PaymentProcessor.tsx          # Payment integration
├── services/
│   ├── consultationService.ts            # API service layer
│   ├── paymentService.ts                 # Payment processing
│   ├── videoService.ts                   # Video call integration
│   └── notificationService.ts            # Real-time notifications
├── hooks/
│   ├── useConsultations.ts               # Consultation state management
│   ├── useScientists.ts                 # Scientist data management
│   └── useRealTime.ts                   # WebSocket connections
├── utils/
│   ├── timezone.ts                       # Time zone utilities
│   ├── currency.ts                       # Currency conversion
│   └── validation.ts                     # Form validation
└── types/
    ├── consultation.ts                   # TypeScript definitions
    ├── scientist.ts                      # Scientist types
    └── payment.ts                        # Payment types
```

### Database Schema

#### **Core Tables**

```sql
-- Scientists Table
CREATE TABLE scientists (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  country VARCHAR(100),
  timezone VARCHAR(50),
  bio TEXT,
  education JSONB,
  experience_years INTEGER,
  languages JSONB,
  specialties JSONB,
  profile_image_url VARCHAR(500),
  verification_status ENUM('pending', 'approved', 'rejected'),
  rating DECIMAL(3,2) DEFAULT 0.00,
  review_count INTEGER DEFAULT 0,
  consultation_fee DECIMAL(10,2),
  commission_rate DECIMAL(4,2) DEFAULT 15.00,
  available_hours JSONB,
  total_consultations INTEGER DEFAULT 0,
  total_earnings DECIMAL(10,2) DEFAULT 0.00,
  response_time VARCHAR(20),
  acceptance_rate DECIMAL(5,2) DEFAULT 0.00,
  applied_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP,
  reviewed_by VARCHAR(255),
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Consultations Table
CREATE TABLE consultations (
  id UUID PRIMARY KEY,
  scientist_id UUID REFERENCES scientists(id),
  farmer_id UUID REFERENCES users(id),
  specialty VARCHAR(100),
  consultation_type ENUM('video', 'chat', 'field_visit'),
  scheduled_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER DEFAULT 30,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled'),
  meeting_link VARCHAR(500),
  meeting_id VARCHAR(255),
  payment_status ENUM('pending', 'paid', 'refunded'),
  amount DECIMAL(10,2),
  platform_fee DECIMAL(10,2),
  scientist_earnings DECIMAL(10,2),
  notes TEXT,
  cancellation_reason TEXT,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE reviews (
  id UUID PRIMARY KEY,
  consultation_id UUID REFERENCES consultations(id),
  scientist_id UUID REFERENCES scientists(id),
  farmer_id UUID REFERENCES users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  helpful_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Payments Table
CREATE TABLE payments (
  id UUID PRIMARY KEY,
  consultation_id UUID REFERENCES consultations(id),
  payment_method ENUM('stripe', 'paypal', 'upi'),
  transaction_id VARCHAR(255),
  amount DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  status ENUM('pending', 'completed', 'failed', 'refunded'),
  gateway_response JSONB,
  refund_amount DECIMAL(10,2),
  refund_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Commission Settings Table
CREATE TABLE commission_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  default_rate DECIMAL(4,2) DEFAULT 15.00,
  expert_rate DECIMAL(4,2) DEFAULT 10.00,
  premium_rate DECIMAL(4,2) DEFAULT 5.00,
  volume_threshold INTEGER DEFAULT 100,
  bonus_threshold INTEGER DEFAULT 50,
  volume_bonus DECIMAL(4,2) DEFAULT 2.00,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Key Features

### 1. **Expert Profiles & Verification**
- Comprehensive scientist profiles with education, experience, and specialties
- Admin approval workflow with verification status
- Multi-language support for global experts
- Performance metrics and analytics

### 2. **Booking System**
- Multi-step booking flow with date/time selection
- Time zone handling for global consultations
- Real-time availability checking
- Automated meeting link generation

### 3. **Payment Integration**
- Multiple payment methods (Stripe, PayPal, UPI)
- Commission calculation and distribution
- Refund management
- Multi-currency support

### 4. **Video Consultations**
- Real-time video calling integration
- Screen sharing capabilities
- Recording and transcription
- Mobile and desktop support

### 5. **Rating & Review System**
- 5-star rating system
- Detailed review text
- Helpful voting mechanism
- Verified review badges

### 6. **Admin Dashboard**
- Scientist approval workflow
- Commission management
- Revenue analytics
- Performance monitoring

## 🌍 Global Scalability Features

### **Multi-Language Support**
```typescript
const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'mr', name: 'मराठी' },
  { code: 'gu', name: 'ગુજરાતી' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'pt', name: 'Português' },
  { code: 'zh', name: '中文' },
  { code: 'ar', name: 'العربية' }
];
```

### **Time Zone Handling**
```typescript
// Automatic time zone detection and conversion
const convertToUserTimezone = (time: string, scientistTimezone: string, userTimezone: string) => {
  return moment.tz(time, scientistTimezone).tz(userTimezone).format();
};

// Available hours calculation across time zones
const getAvailableSlots = (scientist: Scientist, userTimezone: string) => {
  // Convert scientist's available hours to user's timezone
  // Handle daylight saving time
  // Show only overlapping available slots
};
```

### **Currency & Payment Localization**
```typescript
const currencyConfig = {
  USD: { symbol: '$', rate: 1.0 },
  EUR: { symbol: '€', rate: 0.85 },
  GBP: { symbol: '£', rate: 0.73 },
  INR: { symbol: '₹', rate: 82.5 },
  BRL: { symbol: 'R$', rate: 5.2 }
};
```

## 💰 Revenue & Commission Logic

### **Commission Structure**
```typescript
interface CommissionSettings {
  defaultRate: number;      // 15% for new scientists
  expertRate: number;       // 10% for experienced scientists
  premiumRate: number;      // 5% for top-rated scientists
  volumeThreshold: number;  // 100 consultations for volume bonus
  bonusThreshold: number;   // 50 consultations for bonus eligibility
  volumeBonus: number;      // 2% additional bonus for high volume
}

const calculateCommission = (scientist: Scientist, consultationAmount: number) => {
  let commissionRate = commissionSettings.defaultRate;
  
  // Apply expert rate for experienced scientists
  if (scientist.experienceYears >= 10) {
    commissionRate = commissionSettings.expertRate;
  }
  
  // Apply premium rate for top-rated scientists
  if (scientist.rating >= 4.8 && scientist.reviewCount >= 50) {
    commissionRate = commissionSettings.premiumRate;
  }
  
  // Apply volume bonus
  if (scientist.totalConsultations >= commissionSettings.volumeThreshold) {
    commissionRate -= commissionSettings.volumeBonus;
  }
  
  const platformFee = consultationAmount * (commissionRate / 100);
  const scientistEarnings = consultationAmount - platformFee;
  
  return { platformFee, scientistEarnings, commissionRate };
};
```

### **Payment Flow**
1. **Booking Initiation**: User selects consultation type and time
2. **Price Calculation**: Base fee + platform commission
3. **Payment Processing**: Secure payment via selected gateway
4. **Confirmation**: Booking confirmed and meeting link generated
5. **Payout**: Scientist earnings calculated and scheduled

## 📱 Frontend Component Details

### **ConsultationDashboard.tsx**
- **Purpose**: Main interface for browsing and filtering experts
- **Features**: Search, filters, expert cards, booking initiation
- **State Management**: Expert list, filters, loading states

### **BookingSystem.tsx**
- **Purpose**: Multi-step booking flow
- **Steps**: Type selection → Date/time → Payment → Confirmation
- **Features**: Real-time availability, payment processing, meeting link generation

### **ScientistProfile.tsx**
- **Purpose**: Detailed expert information and booking
- **Sections**: Overview, reviews, schedule, contact info
- **Features**: Performance metrics, education, specialties

### **ScientistManagement.tsx**
- **Purpose**: Admin dashboard for scientist management
- **Features**: Approval workflow, commission settings, analytics
- **Sections**: Pending applications, approved scientists, revenue tracking

## 🔧 Technical Implementation

### **State Management**
```typescript
// React Context for consultation state
const ConsultationContext = createContext({
  scientists: [],
  consultations: [],
  loading: false,
  error: null,
  // Actions
  loadScientists: () => {},
  bookConsultation: () => {},
  cancelConsultation: () => {}
});
```

### **Real-time Updates**
```typescript
// WebSocket integration for live updates
const useRealTimeConsultations = (consultationId: string) => {
  const [updates, setUpdates] = useState(null);
  
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/consultations/${consultationId}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setUpdates(data);
    };
    
    return () => ws.close();
  }, [consultationId]);
  
  return updates;
};
```

### **API Integration**
```typescript
// Service layer with error handling and caching
class ConsultationService {
  private cache = new Map();
  
  async getScientists(params?: any): Promise<Scientist[]> {
    const cacheKey = `scientists-${JSON.stringify(params)}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    try {
      const response = await api.get('/scientists', { params });
      this.cache.set(cacheKey, response.data);
      return response.data;
    } catch (error) {
      throw new Error('Failed to load scientists');
    }
  }
}
```

## 🚀 Deployment & Scaling

### **Frontend Optimization**
- **Code Splitting**: Lazy loading of consultation components
- **Image Optimization**: WebP format with fallbacks
- **Caching Strategy**: Service worker for offline support
- **Bundle Size**: Tree shaking and minification

### **Performance Monitoring**
```typescript
// Analytics and performance tracking
const trackConsultationMetrics = (event: string, data: any) => {
  // Track booking funnel
  // Monitor conversion rates
  // Measure load times
  // User engagement metrics
};
```

### **Error Handling**
```typescript
// Global error boundary for consultation features
const ConsultationErrorBoundary = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={<ConsultationErrorFallback />}
      onError={(error, errorInfo) => {
        // Log consultation errors
        // Track error rates
        // Provide user feedback
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
```

## 🔒 Security & Compliance

### **Data Protection**
- **GDPR Compliance**: User data handling and consent
- **Payment Security**: PCI DSS compliance
- **Data Encryption**: End-to-end encryption for sensitive data
- **Access Control**: Role-based permissions

### **Content Moderation**
```typescript
// Review moderation system
const moderateReview = (review: Review): boolean => {
  // Check for inappropriate content
  // Spam detection
  // Fake review identification
  return true;
};
```

## 📊 Analytics & Reporting

### **Key Metrics**
- **Conversion Rate**: Booking completion percentage
- **User Engagement**: Time spent on expert profiles
- **Revenue Tracking**: Platform earnings and payouts
- **Quality Metrics**: Review ratings and satisfaction

### **Dashboard Analytics**
```typescript
const consultationAnalytics = {
  totalConsultations: 1250,
  totalRevenue: 45670,
  averageRating: 4.7,
  topSpecialties: ['crop_diseases', 'soil_health', 'organic_farming'],
  growthRate: 23.5,
  userRetention: 78.9
};
```

## 🔄 Future Enhancements

### **Planned Features**
1. **AI Matching**: Intelligent expert-farmer matching
2. **Mobile App**: Native iOS and Android applications
3. **IoT Integration**: Smart farming device connectivity
4. **Blockchain**: Transparent supply chain tracking
5. **AR/VR**: Immersive consultation experiences

### **Scalability Considerations**
- **Microservices Architecture**: Separate services for consultations, payments, video
- **Database Sharding**: Geographic distribution for global scale
- **CDN Integration**: Global content delivery
- **Load Balancing**: Auto-scaling based on demand

This architecture provides a robust, scalable foundation for global agricultural expert consultations while maintaining high performance, security, and user experience standards.

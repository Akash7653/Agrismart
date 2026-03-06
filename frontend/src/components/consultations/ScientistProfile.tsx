import React, { useState } from 'react';
import { 
  Star, MapPin, Globe, Award, Calendar, Clock, Languages,
  BookOpen, Briefcase, Mail, Phone, Video, MessageCircle,
  TrendingUp, Users, DollarSign, CheckCircle, AlertCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Scientist {
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
  availableHours: Record<string, string[]>;
  totalConsultations: number;
  totalEarnings: number;
  responseTime: string;
  acceptanceRate: number;
}

interface Review {
  id: string;
  consultationId: string;
  rating: number;
  reviewText: string;
  farmerName: string;
  consultationDate: string;
  helpfulCount: number;
  createdAt: string;
}

const ScientistProfile: React.FC<{ scientist: Scientist; onBookConsultation: () => void }> = ({ 
  scientist, 
  onBookConsultation 
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'schedule'>('overview');

  const specialties = [
    { id: 'crop_diseases', name: 'Crop Diseases', icon: '🌾' },
    { id: 'soil_health', name: 'Soil Health', icon: '🌱' },
    { id: 'organic_farming', name: 'Organic Farming', icon: '🍃' },
    { id: 'irrigation', name: 'Irrigation Systems', icon: '💧' },
    { id: 'pest_management', name: 'Pest Management', icon: '🐛' },
    { id: 'market_analysis', name: 'Market Analysis', icon: '📊' }
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'mr', name: 'मराठी' },
    { code: 'gu', name: 'ગુજરાતી' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ' }
  ];

  const mockReviews: Review[] = [
    {
      id: '1',
      consultationId: 'c1',
      rating: 5,
      reviewText: 'Dr. Kumar provided excellent insights on my crop disease issues. His recommendations were practical and effective.',
      farmerName: 'Ramesh Patel',
      consultationDate: '2024-03-10',
      helpfulCount: 12,
      createdAt: '2024-03-11'
    },
    {
      id: '2',
      consultationId: 'c2',
      rating: 4,
      reviewText: 'Very knowledgeable and patient. Helped me understand soil health better. Would recommend!',
      farmerName: 'Sita Devi',
      consultationDate: '2024-03-08',
      helpfulCount: 8,
      createdAt: '2024-03-09'
    },
    {
      id: '3',
      consultationId: 'c3',
      rating: 5,
      reviewText: 'The video consultation was very helpful. Dr. Kumar took time to explain everything clearly.',
      farmerName: 'Mohammed Ali',
      consultationDate: '2024-03-05',
      helpfulCount: 15,
      createdAt: '2024-03-06'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-500 fill-current'
            : i < rating
            ? 'text-yellow-500'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Bio */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
        <p className="text-gray-700 leading-relaxed">{scientist.bio}</p>
      </div>

      {/* Education */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Education</h3>
        <div className="space-y-3">
          {scientist.education.map((edu, index) => (
            <div key={index} className="flex items-start space-x-3">
              <BookOpen className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">{edu.degree}</p>
                <p className="text-sm text-gray-600">{edu.institution} • {edu.year}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Specialties */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Areas of Expertise</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {scientist.specialties.map(specialty => {
            const spec = specialties.find(s => s.id === specialty);
            return (
              <div key={specialty} className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
                <span className="text-lg">{spec?.icon}</span>
                <span className="text-sm font-medium text-green-700">{spec?.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Languages */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Languages Spoken</h3>
        <div className="flex flex-wrap gap-2">
          {scientist.languages.map(lang => {
            const langInfo = languages.find(l => l.code === lang);
            return (
              <span key={lang} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {langInfo?.name}
              </span>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Performance Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-1">
              <Users className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">Consultations</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{scientist.totalConsultations}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">Acceptance Rate</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{scientist.acceptanceRate}%</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-1">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">Response Time</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{scientist.responseTime}</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-1">
              <DollarSign className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">Total Earnings</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">${scientist.totalEarnings}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Reviews ({scientist.reviewCount})</h3>
        <div className="flex items-center space-x-2">
          {renderStars(scientist.rating)}
          <span className="font-semibold">{scientist.rating}</span>
        </div>
      </div>

      <div className="space-y-4">
        {mockReviews.map(review => (
          <div key={review.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium text-gray-900">{review.farmerName}</p>
                <p className="text-sm text-gray-600">
                  {new Date(review.consultationDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                {renderStars(review.rating)}
              </div>
            </div>
            
            <p className="text-gray-700 mb-3">{review.reviewText}</p>
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </p>
              <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800">
                <span>Helpful ({review.helpfulCount})</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Available Hours</h3>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Globe className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Time Zone</p>
            <p className="text-sm text-blue-700">{scientist.timezone}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(scientist.availableHours).map(([day, hours]) => (
          <div key={day} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
            <span className="font-medium text-gray-900 capitalize">
              {day === 'monday' && 'Monday'}
              {day === 'tuesday' && 'Tuesday'}
              {day === 'wednesday' && 'Wednesday'}
              {day === 'thursday' && 'Thursday'}
              {day === 'friday' && 'Friday'}
              {day === 'saturday' && 'Saturday'}
              {day === 'sunday' && 'Sunday'}
            </span>
            <div className="flex items-center space-x-2">
              {hours.length > 0 ? (
                <>
                  <Clock className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-600">
                    {hours.join(', ')}
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Not Available</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex items-start space-x-6">
              {/* Profile Image */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
                {scientist.fullName.split(' ').map(n => n[0]).join('')}
              </div>
              
              {/* Basic Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{scientist.fullName}</h1>
                  {scientist.verificationStatus === 'approved' && (
                    <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-full">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">Verified</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-gray-600 mb-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{scientist.country}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="w-4 h-4" />
                    <span>{scientist.experienceYears} years experience</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Briefcase className="w-4 h-4" />
                    <span>{scientist.totalConsultations} consultations</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {renderStars(scientist.rating)}
                    </div>
                    <span className="font-semibold">{scientist.rating}</span>
                    <span className="text-gray-500">({scientist.reviewCount} reviews)</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-lg font-semibold text-green-600">${scientist.consultationFee}</span>
                    <span className="text-sm text-gray-500">/session</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={onBookConsultation}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>Book Video Consultation</span>
                  </button>
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>Book Chat Session</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>{scientist.email}</span>
            </div>
            {scientist.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>{scientist.phone}</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>{scientist.timezone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reviews'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Reviews
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'schedule'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'reviews' && renderReviews()}
        {activeTab === 'schedule' && renderSchedule()}
      </div>
    </div>
  );
};

export default ScientistProfile;

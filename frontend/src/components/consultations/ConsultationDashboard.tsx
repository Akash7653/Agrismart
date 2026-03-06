import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Users, Star, Video, MessageCircle, 
  Filter, Search, Globe, DollarSign, Award, TrendingUp,
  ChevronRight, MapPin, Languages, Phone, Mail
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
}

interface Consultation {
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
  scientist: Scientist;
}

const ConsultationDashboard: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'browse' | 'my-consultations' | 'calendar'>('browse');
  const [scientists, setScientists] = useState<Scientist[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [filteredScientists, setFilteredScientists] = useState<Scientist[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    loadScientists();
    loadConsultations();
  }, []);

  useEffect(() => {
    filterScientists();
  }, [scientists, searchTerm, selectedSpecialty, selectedLanguage, priceRange]);

  const loadScientists = async () => {
    try {
      // Mock data - replace with API call
      const mockScientists: Scientist[] = [
        {
          id: '1',
          fullName: 'Dr. Rajesh Kumar',
          email: 'rajesh.kumar@agrismart.com',
          phone: '+91 9876543210',
          country: 'India',
          timezone: 'Asia/Kolkata',
          bio: '15+ years of experience in sustainable agriculture and organic farming practices. Specialized in crop disease management and soil health optimization.',
          education: [
            { degree: 'Ph.D. in Agriculture', institution: 'IARI, New Delhi', year: '2008' },
            { degree: 'M.Sc. in Plant Pathology', institution: 'Punjab Agricultural University', year: '2004' }
          ],
          experienceYears: 15,
          languages: ['en', 'hi', 'pa'],
          specialties: ['crop_diseases', 'soil_health', 'organic_farming'],
          profileImageUrl: '/images/scientists/rajesh.jpg',
          verificationStatus: 'approved',
          rating: 4.8,
          reviewCount: 127,
          consultationFee: 45,
          availableHours: {
            monday: ['09:00-17:00'],
            tuesday: ['09:00-17:00'],
            wednesday: ['09:00-17:00'],
            thursday: ['09:00-17:00'],
            friday: ['09:00-17:00'],
            saturday: ['10:00-14:00'],
            sunday: []
          }
        },
        {
          id: '2',
          fullName: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@agrismart.com',
          phone: '+1 555-0123',
          country: 'USA',
          timezone: 'America/New_York',
          bio: 'Expert in precision agriculture and smart farming technologies. Focus on data-driven crop management and sustainable practices.',
          education: [
            { degree: 'Ph.D. in Agricultural Engineering', institution: 'Cornell University', year: '2012' },
            { degree: 'M.S. in Agronomy', institution: 'University of Illinois', year: '2009' }
          ],
          experienceYears: 12,
          languages: ['en'],
          specialties: ['irrigation', 'market_analysis', 'organic_farming'],
          profileImageUrl: '/images/scientists/sarah.jpg',
          verificationStatus: 'approved',
          rating: 4.9,
          reviewCount: 89,
          consultationFee: 75,
          availableHours: {
            monday: ['08:00-16:00'],
            tuesday: ['08:00-16:00'],
            wednesday: ['08:00-16:00'],
            thursday: ['08:00-16:00'],
            friday: ['08:00-16:00'],
            saturday: [],
            sunday: []
          }
        },
        {
          id: '3',
          fullName: 'Dr. Priya Sharma',
          email: 'priya.sharma@agrismart.com',
          phone: '+91 9876543211',
          country: 'India',
          timezone: 'Asia/Kolkata',
          bio: 'Specialist in traditional farming methods and integrated pest management. Expert in organic certification processes.',
          education: [
            { degree: 'Ph.D. in Entomology', institution: 'University of Delhi', year: '2010' },
            { degree: 'M.Sc. in Agriculture', institution: 'G.B. Pant University', year: '2006' }
          ],
          experienceYears: 10,
          languages: ['en', 'hi'],
          specialties: ['pest_management', 'organic_farming', 'crop_diseases'],
          profileImageUrl: '/images/scientists/priya.jpg',
          verificationStatus: 'approved',
          rating: 4.7,
          reviewCount: 156,
          consultationFee: 35,
          availableHours: {
            monday: ['10:00-18:00'],
            tuesday: ['10:00-18:00'],
            wednesday: ['10:00-18:00'],
            thursday: ['10:00-18:00'],
            friday: ['10:00-18:00'],
            saturday: ['09:00-13:00'],
            sunday: []
          }
        }
      ];
      setScientists(mockScientists);
    } catch (error) {
      console.error('Error loading scientists:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadConsultations = async () => {
    try {
      // Mock data - replace with API call
      const mockConsultations: Consultation[] = [
        {
          id: '1',
          scientistId: '1',
          farmerId: 'farmer1',
          specialty: 'crop_diseases',
          consultationType: 'video',
          scheduledTime: '2024-03-15T10:30:00Z',
          durationMinutes: 30,
          status: 'confirmed',
          meetingLink: 'https://meet.google.com/abc-def-ghi',
          paymentStatus: 'paid',
          amount: 45,
          scientist: scientists[0] || {} as Scientist
        }
      ];
      setConsultations(mockConsultations);
    } catch (error) {
      console.error('Error loading consultations:', error);
    }
  };

  const filterScientists = () => {
    let filtered = scientists;

    if (searchTerm) {
      filtered = filtered.filter(scientist =>
        scientist.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scientist.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scientist.specialties.some(spec => spec.includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedSpecialty !== 'all') {
      filtered = filtered.filter(scientist =>
        scientist.specialties.includes(selectedSpecialty)
      );
    }

    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(scientist =>
        scientist.languages.includes(selectedLanguage)
      );
    }

    filtered = filtered.filter(scientist =>
      scientist.consultationFee >= priceRange[0] && scientist.consultationFee <= priceRange[1]
    );

    setFilteredScientists(filtered);
  };

  const handleBooking = async (scientistId: string, consultationType: 'video' | 'chat' | 'field_visit') => {
    // Implement booking logic
    console.log('Booking consultation with scientist:', scientistId, 'Type:', consultationType);
  };

  const renderScientistCard = (scientist: Scientist) => (
    <div key={scientist.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6">
      <div className="flex items-start space-x-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white text-2xl font-bold">
          {scientist.fullName.split(' ').map(n => n[0]).join('')}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{scientist.fullName}</h3>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{scientist.rating}</span>
              <span className="text-sm text-gray-500">({scientist.reviewCount})</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{scientist.country}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Globe className="w-4 h-4" />
              <span>{scientist.timezone}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Award className="w-4 h-4" />
              <span>{scientist.experienceYears} years</span>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4 line-clamp-3">{scientist.bio}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {scientist.specialties.map(specialty => {
              const spec = specialties.find(s => s.id === specialty);
              return (
                <span key={specialty} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  {spec?.icon} {spec?.name}
                </span>
              );
            })}
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {scientist.languages.map(lang => {
              const langInfo = languages.find(l => l.code === lang);
              return (
                <span key={lang} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  {langInfo?.name}
                </span>
              );
            })}
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-lg font-semibold text-green-600">${scientist.consultationFee}</span>
              <span className="text-sm text-gray-500">/session</span>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => handleBooking(scientist.id, 'chat')}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat</span>
              </button>
              <button
                onClick={() => handleBooking(scientist.id, 'video')}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
              >
                <Video className="w-4 h-4" />
                <span>Video</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">AgriScientist Consultations</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                <Users className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  {scientists.length} Experts Available
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('browse')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'browse'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Browse Experts
            </button>
            <button
              onClick={() => setActiveTab('my-consultations')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'my-consultations'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              My Consultations
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'calendar'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'browse' && (
          <div>
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search experts..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">All Specialties</option>
                    {specialties.map(specialty => (
                      <option key={specialty.id} value={specialty.id}>
                        {specialty.icon} {specialty.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="all">All Languages</option>
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Min"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 200])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing {filteredScientists.length} of {scientists.length} experts
              </p>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                  <option>Sort by: Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Rating: High to Low</option>
                  <option>Experience: High to Low</option>
                </select>
              </div>
            </div>

            {/* Scientist Cards */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading experts...</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredScientists.map(renderScientistCard)}
              </div>
            )}
          </div>
        )}

        {activeTab === 'my-consultations' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">My Consultations</h2>
            {consultations.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No consultations scheduled yet</p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Browse Experts
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {consultations.map(consultation => (
                  <div key={consultation.id} className="bg-white rounded-xl shadow-sm p-6">
                    {/* Consultation card content */}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Consultation Calendar</h2>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <p className="text-gray-600">Calendar view coming soon...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationDashboard;

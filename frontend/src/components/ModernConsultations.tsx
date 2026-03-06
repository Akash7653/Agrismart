import React, { useState } from 'react';
import { 
  Users, Calendar, Video, MessageCircle, Phone, Star, Clock,
  Search, Filter, ChevronRight, User, MapPin, Award, DollarSign,
  CheckCircle, AlertCircle, BookOpen, TrendingUp, Heart
} from 'lucide-react';
import { useTranslation } from '../utils/translations';

interface ConsultationProps {
  currentLanguage: string;
}

interface Expert {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  experience: string;
  price: string;
  availability: string;
  image: string;
  languages: string[];
  verified: boolean;
}

const ModernConsultations: React.FC<ConsultationProps> = ({ currentLanguage }) => {
  const { t } = useTranslation(currentLanguage);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);

  const categories = [
    { id: 'all', name: 'All Experts', icon: Users, color: 'blue' },
    { id: 'crop', name: 'Crop Diseases', icon: Heart, color: 'red' },
    { id: 'soil', name: 'Soil Health', icon: Award, color: 'green' },
    { id: 'pest', name: 'Pest Management', icon: AlertCircle, color: 'yellow' },
    { id: 'organic', name: 'Organic Farming', icon: CheckCircle, color: 'emerald' },
    { id: 'market', name: 'Market Analysis', icon: TrendingUp, color: 'purple' }
  ];

  const experts: Expert[] = [
    {
      id: '1',
      name: 'Dr. Rajesh Kumar',
      specialty: 'Crop Diseases & Soil Health',
      rating: 4.9,
      reviews: 127,
      experience: '15 years',
      price: '$45',
      availability: 'Available Today',
      image: '/images/experts/rajesh.jpg',
      languages: ['English', 'Hindi', 'Punjabi'],
      verified: true
    },
    {
      id: '2',
      name: 'Dr. Sarah Johnson',
      specialty: 'Organic Farming & Sustainability',
      rating: 4.8,
      reviews: 89,
      experience: '12 years',
      price: '$55',
      availability: 'Available Tomorrow',
      image: '/images/experts/sarah.jpg',
      languages: ['English', 'Spanish'],
      verified: true
    },
    {
      id: '3',
      name: 'Dr. Priya Sharma',
      specialty: 'Pest Management & Crop Protection',
      rating: 4.7,
      reviews: 156,
      experience: '10 years',
      price: '$40',
      availability: 'Available Today',
      image: '/images/experts/priya.jpg',
      languages: ['English', 'Hindi', 'Tamil'],
      verified: true
    },
    {
      id: '4',
      name: 'Dr. Michael Chen',
      specialty: 'Market Analysis & Farm Economics',
      rating: 4.9,
      reviews: 203,
      experience: '20 years',
      price: '$65',
      availability: 'Available Today',
      image: '/images/experts/michael.jpg',
      languages: ['English', 'Mandarin'],
      verified: true
    }
  ];

  const consultationTypes = [
    { id: 'video', name: 'Video Call', icon: Video, duration: '30 min', description: 'Face-to-face consultation' },
    { id: 'chat', name: 'Chat Session', icon: MessageCircle, duration: '20 min', description: 'Text-based consultation' },
    { id: 'phone', name: 'Phone Call', icon: Phone, duration: '25 min', description: 'Voice consultation' }
  ];

  const filteredExperts = experts.filter(expert => {
    const matchesCategory = selectedCategory === 'all' || 
      expert.specialty.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch = expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expert.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  const renderExpertCard = (expert: Expert) => (
    <div key={expert.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {expert.name.split(' ').map(n => n[0]).join('')}
            </div>
            {expert.verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{expert.name}</h3>
                <p className="text-gray-600 text-sm">{expert.specialty}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">{expert.price}</div>
                <div className="text-xs text-gray-500">per session</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-center space-x-1">
                {renderStars(expert.rating)}
                <span className="text-sm font-medium text-gray-700 ml-1">{expert.rating}</span>
                <span className="text-sm text-gray-500">({expert.reviews})</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Award className="w-4 h-4" />
                <span>{expert.experience}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mb-3">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                expert.availability === 'Available Today' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                <Clock className="w-3 h-3 inline mr-1" />
                {expert.availability}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {expert.languages.map((lang, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  {lang}
                </span>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedExpert(expert)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1"
              >
                <Video className="w-4 h-4" />
                <span>Book Video</span>
              </button>
              <button
                onClick={() => setSelectedExpert(expert)}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Start Chat</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExpertDetail = () => {
    if (!selectedExpert) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedExpert(null)} />
          
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="relative h-48 bg-gradient-to-br from-blue-400 to-indigo-500">
              <button
                onClick={() => setSelectedExpert(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <span className="text-white text-xl">×</span>
              </button>
              
              <div className="absolute bottom-4 left-6 flex items-center space-x-4">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-blue-600">
                  {selectedExpert.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-white">
                  <h2 className="text-2xl font-bold">{selectedExpert.name}</h2>
                  <p className="text-blue-100">{selectedExpert.specialty}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    {renderStars(selectedExpert.rating)}
                    <span className="text-sm">{selectedExpert.rating}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-gray-900">Consultation Fee</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{selectedExpert.price}</p>
                  <p className="text-sm text-gray-600">per session</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">Experience</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{selectedExpert.experience}</p>
                  <p className="text-sm text-gray-600">in agriculture</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <span className="font-semibold text-gray-900">Reviews</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{selectedExpert.reviews}</p>
                  <p className="text-sm text-gray-600">happy farmers</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Consultation Types</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {consultationTypes.map(type => {
                    const Icon = type.icon;
                    return (
                      <div key={type.id} className="border rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer">
                        <div className="flex items-center space-x-3 mb-2">
                          <Icon className="w-5 h-5 text-blue-600" />
                          <span className="font-medium text-gray-900">{type.name}</span>
                        </div>
                        <p className="text-sm text-gray-600">{type.description}</p>
                        <p className="text-xs text-blue-600 mt-1">{type.duration}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedExpert.languages.map((lang, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-4">
                <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Book Consultation</span>
                </button>
                <button className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Start Chat Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Expert Consultations</h1>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connect with agricultural experts for personalized guidance and solutions
            </p>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full flex items-center space-x-2 transition-all ${
                    selectedCategory === category.id
                      ? `bg-${category.color}-600 text-white`
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search experts by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">{experts.length}</span>
            </div>
            <p className="text-gray-600">Expert Consultants</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl font-bold text-gray-900">4.8</span>
            </div>
            <p className="text-gray-600">Average Rating</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">500+</span>
            </div>
            <p className="text-gray-600">Daily Consultations</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <Heart className="w-8 h-8 text-red-600" />
              <span className="text-2xl font-bold text-gray-900">98%</span>
            </div>
            <p className="text-gray-600">Satisfaction Rate</p>
          </div>
        </div>

        {/* Experts Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredExperts.map(renderExpertCard)}
        </div>

        {filteredExperts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No experts found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Expert Detail Modal */}
      {renderExpertDetail()}
    </div>
  );
};

export default ModernConsultations;

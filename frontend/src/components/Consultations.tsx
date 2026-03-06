import React, { useState } from 'react';
import { useTranslation } from '../utils/translations';
import { Calendar, Star, MapPin, Phone, MessageCircle, Clock, Award, Users } from 'lucide-react';

interface Expert {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  reviews: number;
  location: string;
  languages: string[];
  hourlyRate: number;
  availability: string;
  image: string;
  bio: string;
  expertise: string[];
}

interface ConsultationsProps {
  currentLanguage: string;
}

const Consultations: React.FC<ConsultationsProps> = ({ currentLanguage }) => {
  const { t } = useTranslation(currentLanguage);
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [consultationType, setConsultationType] = useState('video');

  const experts: Expert[] = [
    {
      id: '1',
      name: 'Dr. Radha Kumari',
      specialization: 'Crop Disease Specialist',
      experience: 15,
      rating: 4.9,
      reviews: 256,
      location: 'Delhi, India',
      languages: ['Hindi', 'English', 'Punjabi'],
      hourlyRate: 800,
      availability: 'Available today',
      image: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Specialist in plant pathology with 15 years of experience in crop disease management and integrated pest management.',
      expertise: ['Plant Pathology', 'Disease Management', 'Pest Control', 'Organic Farming']
    },
    {
      id: '2',
      name: 'Dr. Pavan Sharma',
      specialization: 'Soil Health Expert',
      experience: 12,
      rating: 4.8,
      reviews: 189,
      location: 'Punjab, India',
      languages: ['Hindi', 'English'],
      hourlyRate: 750,
      availability: 'Available in 2 hours',
      image: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Soil scientist specializing in soil fertility management, nutrient optimization, and sustainable farming practices.',
      expertise: ['Soil Analysis', 'Fertility Management', 'Sustainable Farming', 'Nutrition Planning']
    },
    {
      id: '3',
      name: 'Dr. Amit Patel',
      specialization: 'Crop Production Specialist',
      experience: 18,
      rating: 4.9,
      reviews: 342,
      location: 'Gujarat, India',
      languages: ['Gujarati', 'Hindi', 'English'],
      hourlyRate: 900,
      availability: 'Available tomorrow',
      image: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Agricultural engineer with expertise in crop production, irrigation management, and precision farming technologies.',
      expertise: ['Crop Production', 'Irrigation', 'Precision Farming', 'Technology Integration']
    },
    {
      id: '4',
      name: 'Dr. Sunny Reddy',
      specialization: 'Organic Farming Consultant',
      experience: 10,
      rating: 4.7,
      reviews: 156,
      location: 'Telangana, India',
      languages: ['Telugu', 'Hindi', 'English'],
      hourlyRate: 650,
      availability: 'Available today',
      image: 'https://images.pexels.com/photos/5327874/pexels-photo-5327874.jpeg?auto=compress&cs=tinysrgb&w=300',
      bio: 'Certified organic farming specialist with focus on sustainable agriculture and natural pest management.',
      expertise: ['Organic Farming', 'Natural Pesticides', 'Composting', 'Certification Process']
    }
  ];

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const handleBookAppointment = () => {
    if (selectedExpert && appointmentDate && appointmentTime) {
      alert(`Appointment booked with ${selectedExpert.name} on ${appointmentDate} at ${appointmentTime}`);
      // Reset form
      setSelectedExpert(null);
      setAppointmentDate('');
      setAppointmentTime('');
    }
  };

  const getAvailabilityColor = (availability: string) => {
    if (availability.includes('today')) return 'text-green-600 bg-green-100';
    if (availability.includes('hours')) return 'text-yellow-600 bg-yellow-100';
    return 'text-blue-600 bg-blue-100';
  };

  return (
    <div id="consultations" className="py-20 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('consultationsTitle')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('diseaseDetectionSubtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Experts List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('availableExperts')}</h3>
              
              <div className="grid gap-6">
                {experts.map((expert) => (
                  <div
                    key={expert.id}
                    className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      selectedExpert?.id === expert.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                    onClick={() => setSelectedExpert(expert)}
                  >
                    <div className="flex items-start space-x-4">
                      <img
                        src={expert.image || '/assets/placeholder-expert.svg'}
                        alt={expert.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-xl font-bold text-gray-900">{expert.name}</h4>
                            <p className="text-purple-600 font-medium">{expert.specialization}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Award className="w-4 h-4 mr-1" />
                                {expert.experience} years
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {expert.location}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1 mb-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="font-semibold">{expert.rating}</span>
                              <span className="text-sm text-gray-500">({expert.reviews})</span>
                            </div>
                            <div className="text-lg font-bold text-gray-900">₹{expert.hourlyRate}/hr</div>
                          </div>
                        </div>

                        <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                          {expert.bio}
                        </p>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex flex-wrap gap-2">
                            {expert.expertise.slice(0, 3).map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(expert.availability)}`}>
                            {expert.availability}
                          </span>
                        </div>

                        <div className="flex items-center mt-3 text-sm text-gray-600">
                          <span className="mr-2">Languages:</span>
                          {expert.languages.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">{t('bookConsultation')}</h3>

              {selectedExpert ? (
                <div className="space-y-6">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedExpert.image}
                        alt={selectedExpert.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">{selectedExpert.name}</div>
                        <div className="text-sm text-purple-600">{selectedExpert.specialization}</div>
                        <div className="text-sm text-gray-600">₹{selectedExpert.hourlyRate}/hour</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('consultationType')}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setConsultationType('video')}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          consultationType === 'video'
                            ? 'border-purple-500 bg-purple-50 text-purple-600'
                            : 'border-gray-200 text-gray-600 hover:border-purple-300'
                        }`}
                      >
                        <MessageCircle className="w-5 h-5 mx-auto mb-1" />
                        <div className="text-sm">{t('videoCall')}</div>
                      </button>
                      <button
                        onClick={() => setConsultationType('phone')}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          consultationType === 'phone'
                            ? 'border-purple-500 bg-purple-50 text-purple-600'
                            : 'border-gray-200 text-gray-600 hover:border-purple-300'
                        }`}
                      >
                        <Phone className="w-5 h-5 mx-auto mb-1" />
                        <div className="text-sm">{t('phoneCall')}</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 mr-2" />
                      {t('selectDate')}
                    </label>
                    <input
                      type="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      min={new Date().toISOString().split('T')[0]}
                    aria-label="Appointment date"
                    title="Appointment date"
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                      <Clock className="w-4 h-4 mr-2" />
                      {t('selectTime')}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setAppointmentTime(time)}
                          className={`p-2 text-sm rounded-lg border-2 transition-all ${
                            appointmentTime === time
                              ? 'border-purple-500 bg-purple-50 text-purple-600'
                              : 'border-gray-200 text-gray-600 hover:border-purple-300'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t('consultationFee')}</span>
                      <span>₹{selectedExpert.hourlyRate}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{t('platformFee')}</span>
                      <span>₹50</span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>{t('total')}</span>
                        <span>₹{selectedExpert.hourlyRate + 50}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleBookAppointment}
                    disabled={!appointmentDate || !appointmentTime}
                    className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('bookNow')}
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">{t('selectExpertPrompt')}</p>
                </div>
              )}
            </div>

            {/* Quick Help */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl p-6">
              <h4 className="text-lg font-bold mb-2">{t('needImmediateHelp')}</h4>
              <p className="text-sm opacity-90 mb-4">
                {t('analyticsSubtitle')}
              </p>
              <div className="space-y-2">
                <button className="w-full bg-white bg-opacity-20 text-white py-2 rounded-lg hover:bg-opacity-30 transition-colors">
                  {t('chatWithAI')}
                </button>
                <button className="w-full bg-white bg-opacity-20 text-white py-2 rounded-lg hover:bg-opacity-30 transition-colors">
                  {t('emergencySupport')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consultations;
import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, Video, MessageCircle, Phone, Star, Clock,
  Search, User, Award, DollarSign,
  CheckCircle, AlertCircle, Heart,
  Settings, Send, Paperclip, Smile, X, Mic
} from 'lucide-react';
import { useTranslation } from '../utils/translations';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useThemeColors } from '../hooks/useThemeColors';

interface Expert {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  rating: number;
  reviews: number;
  experience: string;
  price: string;
  availability: string;
  image: string;
  languages: string[];
  verified: boolean;
  education: string;
  certifications: string[];
  today_available: any;
  upcoming_consultations?: any[];
}

interface ConsultationType {
  id: string;
  name: string;
  description: string;
  duration: string;
  icon: string;
}

const ModernConsultationsReal: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [consultationTypes, setConsultationTypes] = useState<ConsultationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [isChatActive, setIsChatActive] = useState(false);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [userNotes, setUserNotes] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [bookedExperts, setBookedExperts] = useState<Set<string>>(new Set());
  const [showBookingForm, setShowBookingForm] = useState(false);

  const categories = [
    { id: 'all', name: 'All Experts', icon: Users, color: 'blue' },
    { id: 'organic', name: 'Organic Farming', icon: Heart, color: 'green' },
    { id: 'soil', name: 'Soil Health', icon: Award, color: 'brown' },
    { id: 'pest', name: 'Pest Management', icon: AlertCircle, color: 'red' },
    { id: 'water', name: 'Water Management', icon: Clock, color: 'blue' },
    { id: 'certification', name: 'Certification', icon: CheckCircle, color: 'purple' }
  ];

  useEffect(() => {
    fetchExperts();
    fetchConsultationTypes();
  }, []);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/consultations/experts');
      const data = await response.json();
      
      if (data.success) {
        setExperts(data.data);
      }
    } catch (error) {
      console.error('Error fetching experts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConsultationTypes = async () => {
    try {
      const response = await fetch('/api/consultations/consultation-types');
      const data = await response.json();
      
      if (data.success) {
        setConsultationTypes(data.data);
      }
    } catch (error) {
      console.error('Error fetching consultation types:', error);
    }
  };

  const filteredExperts = experts.filter(expert => {
    const matchesCategory = selectedCategory === 'all' || 
      (expert.specialty && expert.specialty.toLowerCase().includes(selectedCategory.toLowerCase()));
    const matchesSearch = (expert.name && expert.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (expert.specialty && expert.specialty.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (expert.bio && expert.bio.toLowerCase().includes(searchTerm.toLowerCase()));
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

  const startVideoCall = (expert: Expert) => {
    setSelectedExpert(expert);
    setIsVideoCallActive(true);
    
    // In a real implementation, this would initialize WebRTC
    console.log('Starting video call with:', expert.name || 'Expert');
  };

  const startChat = (expert: Expert) => {
    setSelectedExpert(expert);
    setIsChatActive(true);
    setChatMessages([]);
    setMessageInput('');
    
    // Load existing messages
    loadChatMessages(expert.id);
    
    // Add initial greeting if no messages
    setTimeout(() => {
      setChatMessages(prev => {
        if (prev.length === 0) {
          return [{
            id: 'greeting-' + Date.now(),
            senderType: 'expert',
            senderName: expert.name,
            message: `Hello! I'm ${expert.name}. How can I help you with your farming needs?`,
            timestamp: new Date()
          }];
        }
        return prev;
      });
    }, 300);
  };

  const loadChatMessages = async (expertId: string) => {
    try {
      const userId = localStorage.getItem('userId') || '1';
      const response = await fetch(`/api/consultations/chat/${userId}/${expertId}`);
      const data = await response.json();
      
      if (data.success && data.data.messages) {
        setChatMessages(data.data.messages);
      }
    } catch (error) {
      console.error('Error loading chat messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedExpert || sendingMessage) return;
    
    setSendingMessage(true);
    
    try {
      const userId = localStorage.getItem('userId') || '1';
      
      // Add message to local state immediately for UX
      const newMessage = {
        id: 'msg-' + Date.now(),
        senderType: 'user',
        senderName: 'You',
        message: messageInput,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, newMessage]);
      setMessageInput('');
      
      // Send to backend
      const response = await fetch('/api/consultations/chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          expertId: selectedExpert.id,
          message: messageInput,
          senderType: 'user'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Message sent successfully - optionally update with server ID
        setChatMessages(prev => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          if (lastMsg.id === newMessage.id) {
            lastMsg.id = data.data.messageId;
          }
          return updated;
        });
        
        // Simulate expert response after 2 seconds
        setTimeout(() => {
          const replies = [
            'Thank you for sharing that. Let me help you with this.',
            'That\'s a great question. Based on my experience...',
            'I understand your concern. Here\'s what I recommend...',
            'Let me check the best solution for your situation.',
            'This is a common issue. Here are some effective solutions...'
          ];
          
          const randomReply = replies[Math.floor(Math.random() * replies.length)];
          
          setChatMessages(prev => [...prev, {
            id: 'msg-' + Date.now(),
            senderType: 'expert',
            senderName: selectedExpert.name,
            message: randomReply,
            timestamp: new Date()
          }]);
        }, 2000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const bookConsultation = async (expert: Expert, type: string) => {
    if (!bookingDate || !bookingTime) {
      alert('Please select date and time for consultation');
      return;
    }

    setIsBooking(true);
    
    try {
      const consultationType = consultationTypes.find(ct => ct.name === type);
      
      const response = await fetch('/api/consultations/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          expert_id: expert.id,
          user_id: '1', // Replace with actual user ID
          consultation_type_id: consultationType?.id,
          scheduled_date: `${bookingDate} ${bookingTime}:00`,
          duration_minutes: parseInt(consultationType?.duration || '30'),
          fee: parseFloat(expert.price.replace('₹', '')) || 0,
          user_notes: userNotes,
          user_phone: '+919876543210', // Replace with actual user phone
          user_email: 'user@agrismart.com' // Replace with actual user email
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Mark expert as booked
        setBookedExperts(prev => new Set(prev).add(expert.id));
        
        alert('Appointment booked successfully! You can now chat with the expert.');
        setSelectedExpert(null);
        setShowBookingForm(false);
        setUserNotes('');
        setBookingDate('');
        setBookingTime('');
      } else {
        alert('Failed to book consultation: ' + data.message);
      }
    } catch (error) {
      console.error('Error booking consultation:', error);
      alert('Failed to book consultation. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const renderExpertCard = (expert: Expert) => (
    <div key={expert.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 transform hover:scale-105 hover:-translate-y-2 group animate-fadeInScale">
      <div className="p-6 space-y-4">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
              {expert.name ? expert.name.split(' ').map(n => n[0]).join('') : 'Expert'}
            </div>
            {expert.verified && (
              <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{expert.name || 'Expert Name'}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{expert.specialty || 'Agriculture'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-center space-x-1">
                {renderStars(expert.rating || 0)}
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">{expert.rating || '0'}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">({expert.reviews || '0'})</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
                <Award className="w-4 h-4" />
                <span>{expert.experience || 'Experience'}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mb-3">
              <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-sm ${
                expert.availability === 'Available Today' 
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-700 dark:text-green-300' 
                  : 'bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/40 dark:to-orange-900/40 text-yellow-700 dark:text-yellow-300'
              }`}>
                <Clock className="w-3 h-3" />
                <span>{expert.availability || 'Available'}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {expert.languages && expert.languages.map((lang, index) => (
                <span key={index} className="px-3 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold shadow-sm">
                  {lang}
                </span>
              ))}
            </div>
            
            <div className="flex space-x-2">
              {!bookedExperts.has(expert.id) ? (
                <button
                  onClick={() => {
                    setSelectedExpert(expert);
                    setShowBookingForm(true);
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-600 dark:to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 flex items-center justify-center space-x-2 font-semibold hover:shadow-lg shadow-md transform hover:scale-105 active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment</span>
                </button>
              ) : (
                <button
                  onClick={() => startChat(expert)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 flex items-center justify-center space-x-2 font-semibold hover:shadow-lg shadow-md transform hover:scale-105 active:scale-95 animate-pulse"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat Now</span>
                </button>
              )}
              <button
                onClick={() => startVideoCall(expert)}
                disabled={!bookedExperts.has(expert.id)}
                className={`flex-1 px-4 py-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 font-semibold ${
                  bookedExperts.has(expert.id)
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                title={bookedExperts.has(expert.id) ? 'Start video call' : 'Book appointment first'}
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

  const renderVideoCall = () => {
    if (!selectedExpert) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black">
        <div className="flex h-full">
          {/* Main Video Area */}
          <div className="flex-1 bg-gray-900 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Video call with {selectedExpert.name}</p>
                <p className="text-sm opacity-75">Connecting...</p>
              </div>
            </div>
            
            {/* Self Video */}
            <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg border-2 border-gray-700">
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-8 h-8 text-gray-600" />
              </div>
            </div>
            
            {/* Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
              <button className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700">
                <Mic className="w-5 h-5" />
              </button>
              <button className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700">
                <Video className="w-5 h-5" />
              </button>
              <button className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700">
                <Phone className="w-5 h-5 transform rotate-135" />
              </button>
              <button className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Chat Sidebar */}
          <div className="w-80 bg-white flex flex-col">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Chat with {selectedExpert.name}</h3>
                <button
                  onClick={() => setIsVideoCallActive(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[70%]">
                    <p className="text-sm">Hello! I'm Dr. {selectedExpert.name}. How can I help you today?</p>
                    <span className="text-xs text-gray-500">10:00 AM</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <Smile className="w-4 h-4" />
                </button>
                <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderBookingForm = () => {
    if (!showBookingForm || !selectedExpert) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-slideUp">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-6 flex items-center justify-between rounded-t-2xl">
            <div>
              <h3 className="text-xl font-bold text-white">Book Appointment</h3>
              <p className="text-emerald-50 text-sm">with {selectedExpert.name}</p>
            </div>
            <button
              onClick={() => {
                setShowBookingForm(false);
                setSelectedExpert(null);
                setBookingDate('');
                setBookingTime('');
                setUserNotes('');
              }}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Form */}
          <div className="p-6 space-y-4">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Select Date
              </label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Time Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Select Time
              </label>
              <input
                type="time"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="Describe your farming issue or question..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                rows={4}
              />
            </div>

            {/* Consultation Type Info */}
            <div className="bg-emerald-50 p-3 rounded-lg">
              <p className="text-sm text-emerald-800">
                <span className="font-semibold">Chat Consultation:</span> Write your questions and get expert guidance
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl flex gap-3">
            <button
              onClick={() => {
                setShowBookingForm(false);
                setSelectedExpert(null);
                setBookingDate('');
                setBookingTime('');
                setUserNotes('');
              }}
              className="flex-1 px-4 py-2 text-gray-700 font-semibold border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => bookConsultation(selectedExpert, 'Chat Consultation')}
              disabled={isBooking || !bookingDate || !bookingTime}
              className={`flex-1 px-4 py-2 font-semibold rounded-lg transition-all text-white ${
                isBooking || !bookingDate || !bookingTime
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-lg'
              }`}
            >
              {isBooking ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderChat = () => {
    if (!selectedExpert) return null;

    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center justify-center h-full p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {selectedExpert.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedExpert.name}</h3>
                  <p className="text-sm text-gray-600">{selectedExpert.specialty}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsChatActive(false);
                  setSelectedExpert(null);
                  setChatMessages([]);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="space-y-4">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.senderType === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`rounded-lg p-3 max-w-[70%] ${
                      msg.senderType === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm">{msg.message}</p>
                      <span className={`text-xs ${msg.senderType === 'user' ? 'text-blue-100' : 'text-gray-500'} block mt-1`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                {sendingMessage && (
                  <div className="flex justify-end">
                    <div className="bg-gray-300 rounded-lg p-3 max-w-[70%]">
                      <p className="text-sm text-gray-600 italic">Sending...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  disabled={sendingMessage}
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                />
                <button 
                  onClick={sendMessage}
                  disabled={sendingMessage || !messageInput.trim()}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50">
                  <Paperclip className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700">
                  <Smile className="w-4 h-4" />
                </button>
                <button 
                  onClick={sendMessage}
                  disabled={sendingMessage || !messageInput.trim()}
                  className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
              
              <div className="absolute bottom-4 left-6 right-6">
                <h2 className="text-2xl font-bold text-white">{selectedExpert.name}</h2>
                <p className="text-blue-100">{selectedExpert.specialty}</p>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-gray-900">Consultation Fee</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">₹{selectedExpert.price}</p>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                <p className="text-gray-700">{selectedExpert.bio}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Consultation Types</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {consultationTypes.map(type => (
                    <div key={type.id} className="border rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3 mb-2">
                        <Video className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-gray-900">{type.name}</span>
                      </div>
                      <p className="text-sm text-gray-600">{type.description}</p>
                      <p className="text-xs text-blue-600 mt-1">{type.duration}</p>
                    </div>
                  ))}
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
                <button
                  onClick={() => bookConsultation(selectedExpert, 'Video Call')}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book Video Call</span>
                </button>
                <button
                  onClick={() => startChat(selectedExpert)}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Start Chat</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isVideoCallActive) {
    return renderVideoCall();
  }

  if (isChatActive) {
    return renderChat();
  }

  if (showBookingForm && selectedExpert) {
    return renderBookingForm();
  }

  if (selectedExpert) {
    return renderExpertDetail();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-white dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 border-b border-blue-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Expert Agricultural Consultations</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Connect with certified agricultural experts for personalized guidance and solutions
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories */}
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
                      ? 'bg-blue-600 text-white'
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
          {loading ? (
            <div className="col-span-2 text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Experts...</h3>
              <p className="text-gray-600">Finding the best agricultural experts for you</p>
            </div>
          ) : (
            filteredExperts.map(renderExpertCard)
          )}
        </div>

        {filteredExperts.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No experts found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernConsultationsReal;

const animationStyles = `
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  .animate-slideUp { animation: slideUp 0.6s ease-out forwards; }
  .animate-fadeInScale { animation: fadeInScale 0.5s ease-out forwards; }
`;

import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, Video, MessageCircle, MapPin, DollarSign,
  CreditCard, Check, AlertCircle, Globe, Users, Star
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Scientist {
  id: string;
  fullName: string;
  consultationFee: number;
  timezone: string;
  availableHours: Record<string, string[]>;
  languages: string[];
  specialties: string[];
}

interface BookingSlot {
  date: string;
  time: string;
  available: boolean;
}

const BookingSystem: React.FC<{
  scientist: Scientist;
  onClose: () => void;
  onBookingComplete: (booking: any) => void;
}> = ({ scientist, onClose, onBookingComplete }) => {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [consultationType, setConsultationType] = useState<'video' | 'chat' | 'field_visit'>('video');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<BookingSlot[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | 'upi'>('stripe');
  const [bookingNotes, setBookingNotes] = useState('');

  const consultationTypes = [
    {
      id: 'video',
      name: 'Video Call',
      description: 'Face-to-face video consultation',
      icon: Video,
      duration: 30,
      priceMultiplier: 1
    },
    {
      id: 'chat',
      name: 'Chat Session',
      description: 'Text-based consultation',
      icon: MessageCircle,
      duration: 20,
      priceMultiplier: 0.7
    },
    {
      id: 'field_visit',
      name: 'Field Visit',
      description: 'On-site farm visit (location dependent)',
      icon: MapPin,
      duration: 120,
      priceMultiplier: 3
    }
  ];

  const paymentMethods = [
    { id: 'stripe', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'paypal', name: 'PayPal', icon: DollarSign },
    { id: 'upi', name: 'UPI (India)', icon: DollarSign }
  ];

  useEffect(() => {
    generateAvailableSlots();
  }, []);

  const generateAvailableSlots = () => {
    const slots: BookingSlot[] = [];
    const today = new Date();
    
    // Generate slots for next 14 days
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Get day of week
      const dayOfWeek = date.toLocaleLowerCase('en-US', { weekday: 'long' });
      const availableHours = scientist.availableHours[dayOfWeek] || [];
      
      if (availableHours.length > 0) {
        availableHours.forEach(hourRange => {
          const [startTime, endTime] = hourRange.split('-');
          const startHour = parseInt(startTime.split(':')[0]);
          const endHour = parseInt(endTime.split(':')[0]);
          
          // Generate hourly slots
          for (let hour = startHour; hour < endHour; hour++) {
            const timeStr = `${hour.toString().padStart(2, '0')}:00`;
            slots.push({
              date: dateStr,
              time: timeStr,
              available: true
            });
          }
        });
      }
    }
    
    setAvailableSlots(slots);
  };

  const getAvailableDates = () => {
    const dates = [...new Set(availableSlots.map(slot => slot.date))];
    return dates.sort();
  };

  const getAvailableTimesForDate = (date: string) => {
    return availableSlots.filter(slot => slot.date === date && slot.available);
  };

  const calculatePrice = () => {
    const typeConfig = consultationTypes.find(t => t.id === consultationType);
    const basePrice = scientist.consultationFee;
    return basePrice * (typeConfig?.priceMultiplier || 1);
  };

  const calculatePlatformFee = () => {
    return calculatePrice() * 0.15; // 15% platform fee
  };

  const calculateTotal = () => {
    return calculatePrice() + calculatePlatformFee();
  };

  const handleBooking = async () => {
    setLoading(true);
    
    try {
      // Create booking object
      const booking = {
        scientistId: scientist.id,
        consultationType,
        scheduledTime: new Date(`${selectedDate}T${selectedTime}`).toISOString(),
        durationMinutes: consultationTypes.find(t => t.id === consultationType)?.duration || 30,
        amount: calculatePrice(),
        platformFee: calculatePlatformFee(),
        totalAmount: calculateTotal(),
        paymentMethod,
        notes: bookingNotes,
        status: 'pending_payment'
      };

      // Process payment
      const paymentResult = await processPayment(booking);
      
      if (paymentResult.success) {
        // Create consultation
        const consultation = await createConsultation({
          ...booking,
          paymentId: paymentResult.paymentId,
          paymentStatus: 'paid'
        });

        // Generate meeting link
        if (consultationType === 'video') {
          const meetingLink = await generateMeetingLink(consultation.id);
          consultation.meetingLink = meetingLink;
        }

        onBookingComplete(consultation);
        onClose();
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      // Handle error
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async (booking: any) => {
    // Mock payment processing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, paymentId: 'pay_' + Date.now() });
      }, 2000);
    });
  };

  const createConsultation = async (booking: any) => {
    // Mock consultation creation
    return {
      id: 'consult_' + Date.now(),
      ...booking,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
  };

  const generateMeetingLink = async (consultationId: string) => {
    // Mock meeting link generation
    return `https://meet.google.com/${consultationId}`;
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Select Consultation Type</h3>
      
      <div className="grid gap-4">
        {consultationTypes.map(type => {
          const Icon = type.icon;
          const isSelected = consultationType === type.id;
          const price = scientist.consultationFee * type.priceMultiplier;
          
          return (
            <div
              key={type.id}
              onClick={() => setConsultationType(type.id as any)}
              className={`border rounded-xl p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isSelected ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-green-600' : 'text-gray-600'}`} />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{type.name}</h4>
                  <p className="text-sm text-gray-600">{type.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-sm text-gray-500">{type.duration} minutes</span>
                    <span className="text-lg font-semibold text-green-600">${price}</span>
                  </div>
                </div>
                
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Select Date & Time</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
          <div className="grid grid-cols-2 gap-2">
            {getAvailableDates().map(date => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`px-3 py-2 rounded-lg border text-sm ${
                  selectedDate === date
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {new Date(date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  weekday: 'short'
                })}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
          <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
            {selectedDate && getAvailableTimesForDate(selectedDate).map(slot => (
              <button
                key={`${slot.date}-${slot.time}`}
                onClick={() => setSelectedTime(slot.time)}
                className={`px-3 py-2 rounded-lg border text-sm ${
                  selectedTime === slot.time
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Globe className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Time Zone Information</p>
            <p className="text-sm text-blue-700">
              All times shown in {scientist.timezone}. The consultation will be scheduled according to the expert's local time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
      
      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Consultation Fee</span>
          <span className="font-semibold">${calculatePrice()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Platform Fee (15%)</span>
          <span className="font-semibold">${calculatePlatformFee()}</span>
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-xl font-bold text-green-600">${calculateTotal()}</span>
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
        <div className="grid gap-3">
          {paymentMethods.map(method => {
            const Icon = method.icon;
            return (
              <div
                key={method.id}
                onClick={() => setPaymentMethod(method.id as any)}
                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                  paymentMethod === method.id
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 text-gray-600" />
                  <span className="font-medium">{method.name}</span>
                  {paymentMethod === method.id && (
                    <Check className="w-4 h-4 text-green-600 ml-auto" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes (Optional)
        </label>
        <textarea
          value={bookingNotes}
          onChange={(e) => setBookingNotes(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Any specific questions or topics you'd like to discuss..."
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Confirm Booking</h3>
      
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{scientist.fullName}</h4>
              <p className="text-sm text-gray-600">Expert Consultant</p>
            </div>
          </div>
          
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Type</span>
              <span className="font-medium">{consultationTypes.find(t => t.id === consultationType)?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date</span>
              <span className="font-medium">
                {selectedDate && new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time</span>
              <span className="font-medium">{selectedTime} ({scientist.timezone})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration</span>
              <span className="font-medium">{consultationTypes.find(t => t.id === consultationType)?.duration} minutes</span>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total Amount</span>
              <span className="text-xl font-bold text-green-600">${calculateTotal()}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-900">Important Information</p>
            <ul className="text-sm text-yellow-700 mt-1 space-y-1">
              <li>• Payment will be processed immediately</li>
              <li>• You'll receive a confirmation email with meeting details</li>
              <li>• Free cancellation up to 24 hours before the consultation</li>
              <li>• Refund available if consultation is cancelled by expert</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const canProceedToNext = () => {
    if (step === 1) return true;
    if (step === 2) return selectedDate && selectedTime;
    if (step === 3) return paymentMethod;
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Book Consultation</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ×
              </button>
            </div>
            
            {/* Progress Steps */}
            <div className="flex items-center justify-between mt-4">
              {[1, 2, 3, 4].map(stepNum => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step > stepNum ? <Check className="w-4 h-4" /> : stepNum}
                  </div>
                  {stepNum < 4 && (
                    <div className={`w-full h-1 mx-2 ${
                      step > stepNum ? 'bg-green-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Content */}
          <div className="px-6 py-6">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
          </div>
          
          {/* Footer */}
          <div className="border-t px-6 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  step === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Previous
              </button>
              
              {step < 4 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceedToNext()}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    canProceedToNext()
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleBooking}
                  disabled={loading}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    loading
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'Confirm & Pay'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSystem;

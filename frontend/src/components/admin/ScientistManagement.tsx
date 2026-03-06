import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Eye, CheckCircle, XCircle, AlertCircle,
  TrendingUp, DollarSign, Calendar, Star, Globe, Briefcase,
  Download, Upload, Mail, Phone, Award, Clock, BarChart3
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

interface CommissionSettings {
  defaultRate: number;
  expertRate: number;
  premiumRate: number;
  volumeThreshold: number;
  bonusThreshold: number;
}

const ScientistManagement: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [scientists, setScientists] = useState<Scientist[]>([]);
  const [selectedScientist, setSelectedScientist] = useState<Scientist | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [commissionSettings, setCommissionSettings] = useState<CommissionSettings>({
    defaultRate: 15,
    expertRate: 10,
    premiumRate: 5,
    volumeThreshold: 100,
    bonusThreshold: 50
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScientists();
  }, []);

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
          bio: '15+ years of experience in sustainable agriculture and organic farming practices.',
          education: [
            { degree: 'Ph.D. in Agriculture', institution: 'IARI, New Delhi', year: '2008' }
          ],
          experienceYears: 15,
          languages: ['en', 'hi', 'pa'],
          specialties: ['crop_diseases', 'soil_health', 'organic_farming'],
          verificationStatus: 'pending',
          rating: 0,
          reviewCount: 0,
          consultationFee: 45,
          commissionRate: 15,
          availableHours: {
            monday: ['09:00-17:00'],
            tuesday: ['09:00-17:00']
          },
          totalConsultations: 0,
          totalEarnings: 0,
          responseTime: '< 1 hour',
          acceptanceRate: 0,
          appliedAt: '2024-03-14T10:30:00Z'
        },
        {
          id: '2',
          fullName: 'Dr. Sarah Johnson',
          email: 'sarah.johnson@agrismart.com',
          phone: '+1 555-0123',
          country: 'USA',
          timezone: 'America/New_York',
          bio: 'Expert in precision agriculture and smart farming technologies.',
          education: [
            { degree: 'Ph.D. in Agricultural Engineering', institution: 'Cornell University', year: '2012' }
          ],
          experienceYears: 12,
          languages: ['en'],
          specialties: ['irrigation', 'market_analysis', 'organic_farming'],
          verificationStatus: 'approved',
          rating: 4.9,
          reviewCount: 89,
          consultationFee: 75,
          commissionRate: 10,
          availableHours: {
            monday: ['08:00-16:00'],
            tuesday: ['08:00-16:00']
          },
          totalConsultations: 156,
          totalEarnings: 11700,
          responseTime: '< 30 minutes',
          acceptanceRate: 92,
          appliedAt: '2024-03-10T14:20:00Z',
          reviewedAt: '2024-03-11T09:15:00Z',
          reviewedBy: 'admin@agrismart.com'
        }
      ];
      setScientists(mockScientists);
    } catch (error) {
      console.error('Error loading scientists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveScientist = async (scientistId: string) => {
    try {
      // API call to approve scientist
      setScientists(prev => prev.map(s => 
        s.id === scientistId 
          ? { ...s, verificationStatus: 'approved', reviewedAt: new Date().toISOString(), reviewedBy: 'admin@agrismart.com' }
          : s
      ));
      
      // Send approval email
      await sendApprovalEmail(scientistId);
    } catch (error) {
      console.error('Error approving scientist:', error);
    }
  };

  const handleRejectScientist = async (scientistId: string, reason: string) => {
    try {
      // API call to reject scientist
      setScientists(prev => prev.map(s => 
        s.id === scientistId 
          ? { ...s, verificationStatus: 'rejected', reviewedAt: new Date().toISOString(), reviewedBy: 'admin@agrismart.com', rejectionReason: reason }
          : s
      ));
      
      // Send rejection email
      await sendRejectionEmail(scientistId, reason);
    } catch (error) {
      console.error('Error rejecting scientist:', error);
    }
  };

  const sendApprovalEmail = async (scientistId: string) => {
    // Mock email sending
    console.log('Sending approval email for scientist:', scientistId);
  };

  const sendRejectionEmail = async (scientistId: string, reason: string) => {
    // Mock email sending
    console.log('Sending rejection email for scientist:', scientistId, 'Reason:', reason);
  };

  const updateCommissionSettings = async (settings: CommissionSettings) => {
    try {
      // API call to update commission settings
      setCommissionSettings(settings);
    } catch (error) {
      console.error('Error updating commission settings:', error);
    }
  };

  const getFilteredScientists = () => {
    let filtered = scientists;

    if (activeTab !== 'all') {
      filtered = filtered.filter(s => s.verificationStatus === activeTab);
    }

    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const getStatusCounts = () => ({
    pending: scientists.filter(s => s.verificationStatus === 'pending').length,
    approved: scientists.filter(s => s.verificationStatus === 'approved').length,
    rejected: scientists.filter(s => s.verificationStatus === 'rejected').length,
    all: scientists.length
  });

  const calculateTotalRevenue = () => {
    return scientists.reduce((total, scientist) => {
      const commission = scientist.totalEarnings * (scientist.commissionRate / 100);
      return total + commission;
    }, 0);
  };

  const renderScientistCard = (scientist: Scientist) => (
    <div key={scientist.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold">
            {scientist.fullName.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{scientist.fullName}</h3>
            <p className="text-sm text-gray-600">{scientist.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              <Globe className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">{scientist.country}</span>
            </div>
          </div>
        </div>
        
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          scientist.verificationStatus === 'approved' ? 'bg-green-100 text-green-700' :
          scientist.verificationStatus === 'rejected' ? 'bg-red-100 text-red-700' :
          'bg-yellow-100 text-yellow-700'
        }`}>
          {scientist.verificationStatus}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Experience</p>
          <p className="font-semibold text-gray-900">{scientist.experienceYears} years</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Consultations</p>
          <p className="font-semibold text-gray-900">{scientist.totalConsultations}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Earnings</p>
          <p className="font-semibold text-gray-900">${scientist.totalEarnings}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Commission</p>
          <p className="font-semibold text-gray-900">{scientist.commissionRate}%</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-green-600">${scientist.consultationFee}/session</span>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSelectedScientist(scientist);
              setShowDetailsModal(true);
            }}
            className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-1"
          >
            <Eye className="w-3 h-3" />
            <span>View</span>
          </button>
          
          {scientist.verificationStatus === 'pending' && (
            <>
              <button
                onClick={() => handleApproveScientist(scientist.id)}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-1"
              >
                <CheckCircle className="w-3 h-3" />
                <span>Approve</span>
              </button>
              <button
                onClick={() => {
                  const reason = prompt('Rejection reason:');
                  if (reason) handleRejectScientist(scientist.id, reason);
                }}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1"
              >
                <XCircle className="w-3 h-3" />
                <span>Reject</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderDetailsModal = () => {
    if (!selectedScientist) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDetailsModal(false)} />
          
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="border-b px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Scientist Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="px-6 py-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{selectedScientist.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedScientist.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedScientist.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Country</p>
                    <p className="font-medium">{selectedScientist.country}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Timezone</p>
                    <p className="font-medium">{selectedScientist.timezone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Applied Date</p>
                    <p className="font-medium">
                      {new Date(selectedScientist.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Bio</h3>
                <p className="text-gray-700">{selectedScientist.bio}</p>
              </div>

              {/* Education */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Education</h3>
                <div className="space-y-2">
                  {selectedScientist.education.map((edu, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <p className="font-medium">{edu.degree}</p>
                      <p className="text-sm text-gray-600">{edu.institution} • {edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-500">Total Consultations</p>
                    <p className="text-xl font-bold">{selectedScientist.totalConsultations}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-500">Total Earnings</p>
                    <p className="text-xl font-bold">${selectedScientist.totalEarnings}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-500">Rating</p>
                    <p className="text-xl font-bold">{selectedScientist.rating || 'N/A'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-500">Acceptance Rate</p>
                    <p className="text-xl font-bold">{selectedScientist.acceptanceRate}%</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              {selectedScientist.verificationStatus !== 'pending' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Status</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Reviewed By</p>
                        <p className="font-medium">{selectedScientist.reviewedBy}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Reviewed Date</p>
                        <p className="font-medium">
                          {selectedScientist.reviewedAt && new Date(selectedScientist.reviewedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {selectedScientist.rejectionReason && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-500 mb-1">Rejection Reason</p>
                        <p className="text-red-600">{selectedScientist.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Scientist Management</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCommissionModal(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <DollarSign className="w-4 h-4" />
                <span>Commission Settings</span>
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">{statusCounts.all}</span>
            </div>
            <p className="text-gray-600">Total Scientists</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
              <span className="text-2xl font-bold text-gray-900">{statusCounts.pending}</span>
            </div>
            <p className="text-gray-600">Pending Approval</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">{statusCounts.approved}</span>
            </div>
            <p className="text-gray-600">Approved</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">${calculateTotalRevenue()}</span>
            </div>
            <p className="text-gray-600">Total Revenue</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search scientists..."
                  className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b">
            <div className="flex space-x-8 px-6">
              {(['pending', 'approved', 'rejected', 'all'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab} ({statusCounts[tab]})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scientists List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading scientists...</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {getFilteredScientists().map(renderScientistCard)}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && renderDetailsModal()}
    </div>
  );
};

export default ScientistManagement;

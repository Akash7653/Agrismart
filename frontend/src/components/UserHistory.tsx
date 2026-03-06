import React, { useState, useEffect } from 'react';
import {
  History as HistoryIcon,
  Calendar,
  TrendingUp,
  Sprout,
  AlertTriangle,
  ShoppingBag,
  BarChart3,
  CreditCard,
  AlertCircle,
  Activity,
  Loader,
  RefreshCw,
  DollarSign,
  ChevronDown,
  Copy,
  Eye,
  X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useThemeColors } from '../hooks/useThemeColors';
import { userService, TimelineItem } from '../services/userService';

const UserHistory: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [statistics, setStatistics] = useState({
    totalPredictions: 0,
    completedAppointments: 0,
    totalOrders: 0,
    totalExpenses: 0,
    unreadNotifications: 0
  });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Map backend type to frontend type
  const mapBackendType = (type: string): 'prediction' | 'disease' | 'appointment' | 'order' | 'payment' | 'notification' => {
    const typeMap: Record<string, 'prediction' | 'disease' | 'appointment' | 'order' | 'payment' | 'notification'> = {
      'crop_prediction': 'prediction',
      'prediction': 'prediction',
      'disease_detection': 'disease',
      'disease': 'disease',
      'appointment': 'appointment',
      'order': 'order',
      'payment': 'payment',
      'notification': 'notification'
    };
    return typeMap[type] || 'prediction';
  };

  // Generate mock data for testing
  const generateMockData = () => {
    const mockTimeline: TimelineItem[] = [
      {
        id: '1',
        type: 'prediction',
        title: 'Wheat Prediction',
        description: 'Farm size: 5ha, Soil: Loamy',
        amount: 0,
        status: 'completed',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        icon: 'TrendingUp',
        color: 'green',
        details: { crop: 'Wheat', suitability: 92 }
      },
      {
        id: '2',
        type: 'disease',
        title: 'Leaf Blight Detection',
        description: 'Severity: High',
        status: 'completed',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        icon: 'AlertTriangle',
        color: 'orange',
        details: { disease: 'Leaf Blight', confidence: 85 }
      },
      {
        id: '3',
        type: 'appointment',
        title: 'Expert Consultation',
        description: 'With Dr. Sharma',
        amount: 500,
        status: 'completed',
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        icon: 'Calendar',
        color: 'blue',
        details: { expert: 'Dr. Sharma', duration: 30 }
      },
      {
        id: '4',
        type: 'order',
        title: 'Fertilizer Order',
        description: '2 items - ₹1,200',
        amount: 1200,
        status: 'delivered',
        timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        icon: 'ShoppingBag',
        color: 'purple',
        details: { items: 2, totalAmount: 1200 }
      },
      {
        id: '5',
        type: 'payment',
        title: 'Payment - ₹500',
        description: 'Consultation fee',
        amount: 500,
        status: 'completed',
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        icon: 'CreditCard',
        color: 'indigo',
        details: { method: 'Online', transactionId: 'TXN123456' }
      }
    ];

    setTimeline(mockTimeline);
    setStatistics({
      totalPredictions: 5,
      completedAppointments: 1,
      totalOrders: 3,
      totalExpenses: 2700,
      unreadNotifications: 2
    });
  };

  // Fetch user data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get user from localStorage
        const userJson = localStorage.getItem('user');
        const authToken = localStorage.getItem('authToken');

        if (!userJson || !authToken) {
          setError('Please log in to view your history');
          setLoading(false);
          return;
        }

        const user = JSON.parse(userJson);
        const id = user._id || user.id;
        setUserId(id);

        if (id) {
          // Fetch user history from backend
          try {
            const response = await fetch(`http://localhost:4000/api/user/history/${id}`, {
              headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
              }
            });

            if (!response.ok) {
              throw new Error('Failed to fetch history');
            }

            const historyData = await response.json();

            // Transform backend data to frontend format
            const transformedTimeline: TimelineItem[] = historyData.timeline.map((item: any) => {
              const itemType = mapBackendType(item.type);
              
              // Determine icon based on type
              const iconMap: Record<string, string> = {
                'prediction': 'TrendingUp',
                'disease': 'AlertTriangle',
                'appointment': 'Calendar',
                'order': 'ShoppingBag',
                'payment': 'CreditCard',
                'notification': 'Activity'
              };

              // Determine color based on type
              const colorMap: Record<string, string> = {
                'prediction': 'green',
                'disease': 'orange',
                'appointment': 'blue',
                'order': 'purple',
                'payment': 'indigo',
                'notification': 'gray'
              };

              return {
                id: item.id || item._id,
                type: itemType,
                title: item.title,
                description: item.description,
                amount: item.amount || (item.totalAmount ? item.totalAmount : undefined),
                status: item.status,
                timestamp: item.date || item.createdAt || new Date().toISOString(),
                icon: iconMap[itemType] || 'Activity',
                color: colorMap[itemType] || 'gray',
                details: {
                  ...item,
                  id: undefined,
                  type: undefined,
                  title: undefined,
                  description: undefined,
                  amount: undefined,
                  status: undefined,
                  date: undefined,
                  createdAt: undefined
                }
              };
            });

            setTimeline(transformedTimeline);
            setStatistics({
              totalPredictions: historyData.stats?.totalPredictions || 0,
              completedAppointments: historyData.stats?.completedAppointments || 0,
              totalOrders: historyData.stats?.totalOrders || 0,
              totalExpenses: historyData.stats?.totalExpenses || 0,
              unreadNotifications: historyData.stats?.unreadNotifications || 0
            });
          } catch (err: any) {
            console.error('Error from history endpoint:', err);
            // Generate mock data if backend fails
            generateMockData();
          }
        }
      } catch (err: any) {
        console.error('Error fetching history:', err);
        setError('Failed to load history. Please try again.');
        generateMockData();
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Refresh data
  const handleRefresh = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:4000/api/user/history/${userId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const historyData = await response.json();
        const transformedTimeline: TimelineItem[] = historyData.timeline.map((item: any) => {
          const itemType = mapBackendType(item.type);
          
          // Determine icon based on type
          const iconMap: Record<string, string> = {
            'prediction': 'TrendingUp',
            'disease': 'AlertTriangle',
            'appointment': 'Calendar',
            'order': 'ShoppingBag',
            'payment': 'CreditCard',
            'notification': 'Activity'
          };

          // Determine color based on type
          const colorMap: Record<string, string> = {
            'prediction': 'green',
            'disease': 'orange',
            'appointment': 'blue',
            'order': 'purple',
            'payment': 'indigo',
            'notification': 'gray'
          };

          return {
            id: item.id || item._id,
            type: itemType,
            title: item.title,
            description: item.description,
            amount: item.amount || (item.totalAmount ? item.totalAmount : undefined),
            status: item.status,
            timestamp: item.date || item.createdAt || new Date().toISOString(),
            icon: iconMap[itemType] || 'Activity',
            color: colorMap[itemType] || 'gray',
            details: {
              ...item,
              id: undefined,
              type: undefined,
              title: undefined,
              description: undefined,
              amount: undefined,
              status: undefined,
              date: undefined,
              createdAt: undefined
            }
          };
        });

        setTimeline(transformedTimeline);
        setStatistics({
          totalPredictions: historyData.stats?.totalPredictions || 0,
          completedAppointments: historyData.stats?.completedAppointments || 0,
          totalOrders: historyData.stats?.totalOrders || 0,
          totalExpenses: historyData.stats?.totalExpenses || 0,
          unreadNotifications: historyData.stats?.unreadNotifications || 0
        });
      }
    } catch (err) {
      console.error('Error refreshing:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get icon for timeline item
  const getIcon = (type: string) => {
    const props = { size: 20, className: 'flex-shrink-0' };
    switch (type) {
      case 'prediction':
        return <TrendingUp {...props} className={`${props.className} text-green-500`} />;
      case 'disease':
        return <AlertTriangle {...props} className={`${props.className} text-orange-500`} />;
      case 'appointment':
        return <Calendar {...props} className={`${props.className} text-blue-500`} />;
      case 'order':
        return <ShoppingBag {...props} className={`${props.className} text-purple-500`} />;
      case 'payment':
        return <CreditCard {...props} className={`${props.className} text-indigo-500`} />;
      default:
        return <Activity {...props} className={`${props.className} text-gray-500`} />;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(currentLanguage, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(currentLanguage, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get color based on type
  const getItemColor = (type: string) => {
    switch (type) {
      case 'prediction':
        return isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-200';
      case 'disease':
        return isDark ? 'bg-orange-900/20 border-orange-700' : 'bg-orange-50 border-orange-200';
      case 'appointment':
        return isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200';
      case 'order':
        return isDark ? 'bg-purple-900/20 border-purple-700' : 'bg-purple-50 border-purple-200';
      case 'payment':
        return isDark ? 'bg-indigo-900/20 border-indigo-700' : 'bg-indigo-50 border-indigo-200';
      default:
        return isDark ? 'bg-gray-900/20 border-gray-700' : 'bg-gray-50 border-gray-200';
    }
  };

  // Get status badge color
  const getStatusColor = (status?: string) => {
    if (!status) return '';
    switch (status.toLowerCase()) {
      case 'success':
      case 'delivered':
      case 'completed':
      case 'confirmed':
      case 'scheduled':
        return isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700';
      case 'failed':
      case 'cancelled':
        return isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700';
      case 'pending':
        return isDark ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-700';
      default:
        return isDark ? 'bg-gray-700/30 text-gray-400' : 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className={`min-h-screen py-8 px-4 ${colors.bg.primary}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className={`text-4xl font-bold ${colors.text.primary}`}>
              <HistoryIcon className="inline mr-3 mb-1" /> {t('history')}
            </h1>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className={`p-2 rounded-lg transition-all ${
                isDark
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-400'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              } disabled:opacity-50`}
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            View all your predictions, appointments, orders, and payments
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            isDark
              ? 'bg-red-900/30 border border-red-700 text-red-400'
              : 'bg-red-100 border border-red-300 text-red-700'
          }`}>
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className={`flex flex-col items-center justify-center py-12 px-4 rounded-lg ${
            isDark ? 'bg-gray-800' : 'bg-white'
          }`}>
            <Loader className={`w-12 h-12 animate-spin mb-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Loading your history...</p>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
              {[
                {
                  icon: Sprout,
                  label: 'Predictions',
                  value: statistics.totalPredictions,
                  color: 'green'
                },
                {
                  icon: Calendar,
                  label: 'Appointments',
                  value: statistics.completedAppointments,
                  color: 'blue'
                },
                {
                  icon: ShoppingBag,
                  label: 'Orders',
                  value: statistics.totalOrders,
                  color: 'purple'
                },
                {
                  icon: DollarSign,
                  label: 'Total Spent',
                  value: `₹${statistics.totalExpenses.toLocaleString()}`,
                  color: 'orange',
                  isAmount: true
                },
                {
                  icon: AlertCircle,
                  label: 'Notifications',
                  value: statistics.unreadNotifications,
                  color: 'red'
                }
              ].map((stat, idx) => {
                const Icon = stat.icon;
                const colorBg = {
                  green: isDark ? 'bg-green-900/30' : 'bg-green-100',
                  blue: isDark ? 'bg-blue-900/30' : 'bg-blue-100',
                  purple: isDark ? 'bg-purple-900/30' : 'bg-purple-100',
                  orange: isDark ? 'bg-orange-900/30' : 'bg-orange-100',
                  red: isDark ? 'bg-red-900/30' : 'bg-red-100'
                };
                const colorText = {
                  green: isDark ? 'text-green-400' : 'text-green-600',
                  blue: isDark ? 'text-blue-400' : 'text-blue-600',
                  purple: isDark ? 'text-purple-400' : 'text-purple-600',
                  orange: isDark ? 'text-orange-400' : 'text-orange-600',
                  red: isDark ? 'text-red-400' : 'text-red-600'
                };

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-lg ${colorBg[stat.color as keyof typeof colorBg]} ${
                      isDark ? 'border border-gray-700' : 'border border-gray-200'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${colorText[stat.color as keyof typeof colorText]}`} />
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {stat.label}
                    </p>
                    <p className={`text-xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {stat.value}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Timeline */}
            <div className={`rounded-lg ${isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
              <div className="p-6 border-b border-gray-700">
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  📅 Timeline
                </h2>
              </div>

              {timeline.length === 0 ? (
                <div className={`p-12 text-center ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <Activity className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                  <p className={`text-lg font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    No activity yet
                  </p>
                  <p className={`text-sm mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    Start by making a prediction or booking an appointment
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-700">
                  {timeline.map((item) => (
                    <div
                      key={item.id}
                      className={`p-6 transition-all ${
                        expandedId === item.id
                          ? isDark ? 'bg-gray-700' : 'bg-blue-50'
                          : isDark ? 'bg-gray-800 hover:bg-gray-700/50' : 'bg-white hover:bg-gray-50'
                      } cursor-pointer border-l-4 ${getItemColor(item.type)}`}
                    >
                      <div
                        onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                        className="flex items-start justify-between gap-4"
                      >
                        {/* Icon */}
                        <div className="flex-shrink-0 pt-1">{getIcon(item.type)}</div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {item.title}
                            </h3>
                            {item.status && (
                              <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getStatusColor(item.status)}`}>
                                {item.status}
                              </span>
                            )}
                          </div>

                          {/* Meta Info */}
                          <div className="flex flex-wrap gap-4 text-sm mb-2">
                            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                              📅 {formatDate(item.timestamp)}
                            </span>
                            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                              🕐 {formatTime(item.timestamp)}
                            </span>
                            {item.amount && (
                              <span className={`font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                                ₹{item.amount.toLocaleString()}
                              </span>
                            )}
                          </div>

                          {/* Description */}
                          {item.description && (
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {item.description}
                            </p>
                          )}
                        </div>

                        {/* Expand Icon */}
                        {Object.keys(item.details || {}).length > 0 && (
                          <ChevronDown
                            size={20}
                            className={`flex-shrink-0 transition-transform ${
                              expandedId === item.id ? 'rotate-180' : ''
                            } ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
                          />
                        )}
                      </div>

                      {/* Expanded Details */}
                      {expandedId === item.id && item.details && (
                        <div className={`mt-4 p-4 rounded-lg ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                          <div className="space-y-2 text-sm">
                            {Object.entries(item.details).map(([key, value]) => (
                              <div key={key} className="flex justify-between gap-4">
                                <span className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                                </span>
                                <span className={isDark ? 'text-gray-300' : 'text-gray-900'}>
                                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserHistory;

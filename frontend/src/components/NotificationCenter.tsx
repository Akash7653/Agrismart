import React, { useState, useEffect } from 'react';
import { Bell, X, Check, AlertCircle, Package, Calendar, TrendingUp, CreditCard } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface Notification {
  id: string;
  type: 'appointment' | 'payment' | 'delivery' | 'prediction' | 'order';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon?: React.ElementType;
  color?: string;
}

interface NotificationCenterProps {
  isDark?: boolean;
}

const NotificationCenter: React.FC<NotificationCenterProps> = () => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'appointment',
      title: 'Appointment Confirmed',
      message: 'Your consultation appointment with Dr. Sharma on March 15, 2024 at 2:00 PM has been confirmed.',
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false,
      icon: Calendar,
      color: 'blue'
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment Successful',
      message: 'Your payment of ₹1,500 for fertilizer has been processed successfully.',
      timestamp: new Date(Date.now() - 15 * 60000),
      read: false,
      icon: CreditCard,
      color: 'green'
    },
    {
      id: '3',
      type: 'delivery',
      title: 'Delivery In Transit',
      message: 'Your order (Organic Seeds) is out for delivery. Expected arrival: Tomorrow, 2-4 PM',
      timestamp: new Date(Date.now() - 30 * 60000),
      read: false,
      icon: Package,
      color: 'purple'
    },
    {
      id: '4',
      type: 'prediction',
      title: 'Crop Prediction Available',
      message: 'Your crop prediction results for rice are ready. View detailed recommendations in Dashboard.',
      timestamp: new Date(Date.now() - 60 * 60000),
      read: true,
      icon: TrendingUp,
      color: 'orange'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-all duration-200 transform hover:scale-110 ${
          isDark
            ? 'text-gray-400 hover:text-green-400 hover:bg-gray-800'
            : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
        }`}
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className={`absolute top-1 right-1 w-5 h-5 rounded-full text-xs font-bold text-white flex items-center justify-center ${
            unreadCount > 9 ? 'bg-red-500 text-xs px-1' : 'bg-red-500'
          }`}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className={`absolute right-0 top-14 w-96 rounded-2xl shadow-2xl z-50 overflow-hidden border transition-all duration-300 ${
          isDark
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b ${
            isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-white'
          }`}>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              🔔 Notifications
            </h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className={`text-xs font-bold px-3 py-1 rounded-lg transition-all ${
                    isDark
                      ? 'text-blue-400 hover:bg-blue-900/30'
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Mark All Read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className={`p-1 rounded-lg transition-colors ${
                  isDark
                    ? 'text-gray-400 hover:bg-gray-700'
                    : 'text-gray-400 hover:bg-gray-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className={`p-8 text-center ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <Bell className={`w-12 h-12 mx-auto mb-2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon = notification.icon || Bell;
                return (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`border-b p-4 cursor-pointer transition-all duration-200 hover:shadow-inner ${
                      notification.read
                        ? isDark
                          ? 'bg-gray-800 hover:bg-gray-750'
                          : 'bg-white hover:bg-gray-50'
                        : isDark
                        ? 'bg-blue-900/20 hover:bg-blue-900/30'
                        : 'bg-blue-50 hover:bg-blue-100'
                    } ${isDark ? 'border-gray-700' : 'border-gray-100'}`}
                  >
                    <div className="flex gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        notification.color === 'blue' ? isDark ? 'bg-blue-900/30' : 'bg-blue-100' :
                        notification.color === 'green' ? isDark ? 'bg-green-900/30' : 'bg-green-100' :
                        notification.color === 'purple' ? isDark ? 'bg-purple-900/30' : 'bg-purple-100' :
                        isDark ? 'bg-orange-900/30' : 'bg-orange-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          notification.color === 'blue' ? 'text-blue-600' :
                          notification.color === 'green' ? 'text-green-600' :
                          notification.color === 'purple' ? 'text-purple-600' :
                          'text-orange-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                        <p className={`text-xs mb-2 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {notification.message}
                        </p>
                        <p className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className={`p-1 rounded transition-colors flex-shrink-0 ${
                          isDark
                            ? 'text-gray-500 hover:bg-gray-700'
                            : 'text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className={`p-4 text-center border-t ${
            isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50'
          }`}>
            <button className={`text-sm font-bold ${
              isDark
                ? 'text-blue-400 hover:text-blue-300'
                : 'text-blue-600 hover:text-blue-700'
            }`}>
              View All Notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;

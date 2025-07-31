import { useEffect } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { notificationsAPI } from '../../services/api';
import { Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';

const NotificationsList: React.FC = () => {
  const { notifications, loading, error, markAsRead, refetch } = useNotifications();

  // Mark all notifications as read when component mounts
  useEffect(() => {
    const markAllAsRead = async () => {
      try {
        await notificationsAPI.markAllAsRead();
        // Force a complete refresh after a short delay
        setTimeout(() => {
          refetch();
          window.dispatchEvent(new CustomEvent('notificationsRead'));
        }, 100);
      } catch (error) {
        console.error('Error marking all notifications as read:', error);
      }
    };

    if (notifications.some(n => !n.read)) {
      markAllAsRead();
    }
  }, [notifications, refetch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Erreur: {error}</p>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Bell className="w-6 h-6 mr-2" />
          Notifications
        </h1>
        <p className="text-sm text-gray-600">
          {notifications.length} notification(s)
        </p>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification</h3>
            <p className="text-gray-600">Vous n'avez pas de nouvelles notifications.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                notification.read 
                  ? 'bg-white border-gray-200' 
                  : 'bg-blue-50 border-blue-200'
              }`}
              onClick={() => !notification.read && markAsRead(notification._id)}
            >
              <div className="flex items-start space-x-3">
                {getIcon(notification.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(notification.createdAt).toLocaleDateString()} à {new Date(notification.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsList;
import { useState, useEffect } from 'react';
import { notificationService } from '../services';
import * as Notifications from 'expo-notifications';

export const useNotifications = () => {
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);

  useEffect(() => {
    let notificationListener: Notifications.Subscription;
    let responseListener: Notifications.Subscription;

    const setupNotifications = async () => {
      const hasPermission = await notificationService.requestPermissions();
      
      if (hasPermission) {
        const token = await notificationService.getPushToken();
        setPushToken(token);
      }

      notificationListener = notificationService.addNotificationReceivedListener(
        (notification) => {
          setNotification(notification);
        }
      );

      responseListener = notificationService.addNotificationResponseListener(
        (response) => {
          console.log('Notification response:', response);
        }
      );
    };

    setupNotifications();

    return () => {
      notificationListener?.remove();
      responseListener?.remove();
    };
  }, []);

  return {
    pushToken,
    notification,
    scheduleNotification: notificationService.scheduleLocalNotification,
  };
};

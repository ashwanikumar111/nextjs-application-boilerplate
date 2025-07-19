import messaging from '@react-native-firebase/messaging';
import {Alert, Platform} from 'react-native';

class PushNotificationService {
  private static instance: PushNotificationService;

  public static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  public async initialize(): Promise<void> {
    await this.requestPermission();
    await this.getToken();
    this.setupForegroundNotifications();
    this.setupBackgroundNotifications();
  }

  private async requestPermission(): Promise<boolean> {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    } else {
      Alert.alert(
        'Permission Required',
        'Please enable notifications to receive call alerts',
      );
    }
    return enabled;
  }

  private async getToken(): Promise<string | null> {
    try {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);
      return token;
    } catch (error) {
      console.error('Failed to get FCM token:', error);
      return null;
    }
  }

  private setupForegroundNotifications(): void {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground message received:', remoteMessage);
      this.handleNotification(remoteMessage);
    });
    return unsubscribe;
  }

  private setupBackgroundNotifications(): void {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Background message received:', remoteMessage);
      this.handleBackgroundNotification(remoteMessage);
    });
  }

  private handleNotification(message: any): void {
    const {notification, data} = message;
    
    if (data?.type === 'voice_call' || data?.type === 'video_call') {
      // Handle call notification
      console.log('Call notification received:', data);
    } else {
      // Handle regular notification
      console.log('Regular notification:', notification);
    }
  }

  private handleBackgroundNotification(message: any): void {
    console.log('Handling background notification:', message);
  }

  public async subscribeToTopic(topic: string): Promise<void> {
    try {
      await messaging().subscribeToTopic(topic);
      console.log(`Subscribed to topic: ${topic}`);
    } catch (error) {
      console.error('Failed to subscribe to topic:', error);
    }
  }

  public async unsubscribeFromTopic(topic: string): Promise<void> {
    try {
      await messaging().unsubscribeFromTopic(topic);
      console.log(`Unsubscribed from topic: ${topic}`);
    } catch (error) {
      console.error('Failed to unsubscribe from topic:', error);
    }
  }
}

export default PushNotificationService.getInstance();

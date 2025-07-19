import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';

interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'voice_call' | 'video_call' | 'message';
  timestamp: Date;
  data?: any;
}

const HomeScreen = ({navigation}: any) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Simulate receiving notifications
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Incoming Voice Call',
        body: 'John Doe is calling you...',
        type: 'voice_call',
        timestamp: new Date(),
        data: {callerId: '123', callerName: 'John Doe'},
      },
      {
        id: '2',
        title: 'Incoming Video Call',
        body: 'Jane Smith is video calling you...',
        type: 'video_call',
        timestamp: new Date(),
        data: {callerId: '456', callerName: 'Jane Smith'},
      },
    ];
    setNotifications(mockNotifications);
  }, []);

  const handleNotificationPress = (notification: Notification) => {
    if (notification.type === 'voice_call' || notification.type === 'video_call') {
      navigation.navigate('Call', {
        type: notification.type,
        callerName: notification.data?.callerName || 'Unknown',
      });
    }
  };

  const renderNotification = ({item}: {item: Notification}) => (
    <TouchableOpacity
      style={styles.notificationItem}
      onPress={() => handleNotificationPress(item)}>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationBody}>{item.body}</Text>
        <Text style={styles.notificationTime}>
          {item.timestamp.toLocaleTimeString()}
        </Text>
      </View>
      <View style={[styles.notificationType, styles[item.type]]}>
        <Text style={styles.typeText}>{item.type.toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#075E54" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Push Notifications</Text>
        <Text style={styles.headerSubtitle}>WhatsApp-like Notifications</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Recent Notifications</Text>
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No notifications yet</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#075E54',
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  notificationItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  notificationBody: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
  },
  notificationType: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  voice_call: {
    backgroundColor: '#4CAF50',
  },
  video_call: {
    backgroundColor: '#2196F3',
  },
  message: {
    backgroundColor: '#FF9800',
  },
  typeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default HomeScreen;

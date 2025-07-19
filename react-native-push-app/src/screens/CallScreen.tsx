import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Vibration,
} from 'react-native';

interface CallScreenProps {
  route: any;
  navigation: any;
}

const CallScreen: React.FC<CallScreenProps> = ({route, navigation}) => {
  const {type, callerName} = route.params || {type: 'voice', callerName: 'Unknown'};
  const [callStatus, setCallStatus] = useState('Incoming...');
  const [isCallActive, setIsCallActive] = useState(false);

  useEffect(() => {
    // Vibrate when call screen opens
    Vibration.vibrate([1000, 2000, 1000], true);

    return () => {
      Vibration.cancel();
    };
  }, []);

  const handleAccept = () => {
    Vibration.cancel();
    setCallStatus('Connected');
    setIsCallActive(true);
    
    // Simulate call duration
    setTimeout(() => {
      setCallStatus('Call Ended');
      setIsCallActive(false);
      setTimeout(() => navigation.goBack(), 2000);
    }, 10000);
  };

  const handleReject = () => {
    Vibration.cancel();
    setCallStatus('Call Rejected');
    setTimeout(() => navigation.goBack(), 1500);
  };

  const handleEndCall = () => {
    setCallStatus('Call Ended');
    setIsCallActive(false);
    setTimeout(() => navigation.goBack(), 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#075E54" />
      
      <View style={styles.callContainer}>
        <View style={styles.callerInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{callerName.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.callerName}>{callerName}</Text>
          <Text style={styles.callType}>{type === 'voice_call' ? 'Voice Call' : 'Video Call'}</Text>
          <Text style={styles.callStatus}>{callStatus}</Text>
        </View>

        <View style={styles.callActions}>
          {!isCallActive ? (
            <>
              <TouchableOpacity style={[styles.actionButton, styles.rejectButton]} onPress={handleReject}>
                <Text style={styles.actionButtonText}>Decline</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.actionButton, styles.acceptButton]} onPress={handleAccept}>
                <Text style={styles.actionButtonText}>Accept</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={[styles.actionButton, styles.endButton]} onPress={handleEndCall}>
              <Text style={styles.actionButtonText}>End Call</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.callFeatures}>
          {isCallActive && (
            <>
              <TouchableOpacity style={styles.featureButton}>
                <Text style={styles.featureText}>Mute</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.featureButton}>
                <Text style={styles.featureText}>Speaker</Text>
              </TouchableOpacity>
              {type === 'video_call' && (
                <TouchableOpacity style={styles.featureButton}>
                  <Text style={styles.featureText}>Camera</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#075E54',
  },
  callContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 32,
  },
  callerInfo: {
    alignItems: 'center',
    marginTop: 60,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#075E54',
  },
  callerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  callType: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 16,
  },
  callStatus: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.7,
  },
  callActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 40,
  },
  actionButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  rejectButton: {
    backgroundColor: '#FF3B30',
  },
  acceptButton: {
    backgroundColor: '#34C759',
  },
  endButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  callFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  featureButton: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    marginHorizontal: 8,
  },
  featureText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default CallScreen;

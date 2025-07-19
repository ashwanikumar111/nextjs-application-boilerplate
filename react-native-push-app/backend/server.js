const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

// Initialize Firebase Admin
const serviceAccount = require('./firebase-service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(cors());
app.use(express.json());

// Store device tokens (in production, use a database)
const deviceTokens = new Set();

// Endpoint to register device token
app.post('/register-token', (req, res) => {
  const { token } = req.body;
  if (token) {
    deviceTokens.add(token);
    console.log('Device token registered:', token);
    res.json({ success: true, message: 'Token registered successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Token is required' });
  }
});

// Endpoint to send voice call notification
app.post('/send-voice-call', async (req, res) => {
  const { callerName, callerId } = req.body;
  
  const message = {
    notification: {
      title: `Incoming Voice Call`,
      body: `${callerName} is calling you...`,
    },
    data: {
      type: 'voice_call',
      callerId: callerId || '123',
      callerName: callerName || 'Unknown',
    },
    android: {
      priority: 'high',
      notification: {
        channelId: 'whatsapp_call_channel',
        sound: 'ringtone',
        vibrateTimingsMillis: [1000, 1000, 1000, 1000, 1000],
        priority: 'high',
        visibility: 'public',
      },
    },
  };

  try {
    const tokens = Array.from(deviceTokens);
    if (tokens.length === 0) {
      return res.status(400).json({ success: false, message: 'No device tokens registered' });
    }

    const response = await admin.messaging().sendMulticast({
      ...message,
      tokens: tokens,
    });

    console.log('Voice call notifications sent:', response.successCount);
    res.json({ 
      success: true, 
      message: `Sent to ${response.successCount} devices`,
      failed: response.failureCount 
    });
  } catch (error) {
    console.error('Error sending voice call:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Endpoint to send video call notification
app.post('/send-video-call', async (req, res) => {
  const { callerName, callerId } = req.body;
  
  const message = {
    notification: {
      title: `Incoming Video Call`,
      body: `${callerName} is video calling you...`,
    },
    data: {
      type: 'video_call',
      callerId: callerId || '456',
      callerName: callerName || 'Unknown',
    },
    android: {
      priority: 'high',
      notification: {
        channelId: 'whatsapp_call_channel',
        sound: 'ringtone',
        vibrateTimingsMillis: [1000, 1000, 1000, 1000, 1000],
        priority: 'high',
        visibility: 'public',
      },
    },
  };

  try {
    const tokens = Array.from(deviceTokens);
    if (tokens.length === 0) {
      return res.status(400).json({ success: false, message: 'No device tokens registered' });
    }

    const response = await admin.messaging().sendMulticast({
      ...message,
      tokens: tokens,
    });

    console.log('Video call notifications sent:', response.successCount);
    res.json({ 
      success: true, 
      message: `Sent to ${response.successCount} devices`,
      failed: response.failureCount 
    });
  } catch (error) {
    console.error('Error sending video call:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Endpoint to send message notification
app.post('/send-message', async (req, res) => {
  const { senderName, messageText } = req.body;
  
  const message = {
    notification: {
      title: senderName || 'New Message',
      body: messageText || 'You have a new message',
    },
    data: {
      type: 'message',
      senderName: senderName || 'Unknown',
    },
    android: {
      priority: 'normal',
      notification: {
        channelId: 'whatsapp_call_channel',
        sound: 'default',
      },
    },
  };

  try {
    const tokens = Array.from(deviceTokens);
    if (tokens.length === 0) {
      return res.status(400).json({ success: false, message: 'No device tokens registered' });
    }

    const response = await admin.messaging().sendMulticast({
      ...message,
      tokens: tokens,
    });

    console.log('Message notifications sent:', response.successCount);
    res.json({ 
      success: true, 
      message: `Sent to ${response.successCount} devices`,
      failed: response.failureCount 
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get registered tokens count
app.get('/tokens', (req, res) => {
  res.json({ 
    count: deviceTokens.size, 
    tokens: Array.from(deviceTokens) 
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Push notification backend running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('POST /register-token - Register device token');
  console.log('POST /send-voice-call - Send voice call notification');
  console.log('POST /send-video-call - Send video call notification');
  console.log('POST /send-message - Send message notification');
  console.log('GET /tokens - Get registered tokens');
  console.log('GET /health - Health check');
});

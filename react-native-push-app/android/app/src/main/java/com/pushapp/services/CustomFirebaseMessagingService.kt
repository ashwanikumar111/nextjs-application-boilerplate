package com.pushapp.services

import android.util.Log
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import com.pushapp.modules.NotificationHelper
import org.json.JSONObject

class CustomFirebaseMessagingService : FirebaseMessagingService() {
    
    companion object {
        private const val TAG = "FCMService"
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        super.onMessageReceived(remoteMessage)
        
        Log.d(TAG, "From: ${remoteMessage.from}")
        
        // Check if message contains a data payload
        if (remoteMessage.data.isNotEmpty()) {
            Log.d(TAG, "Message data payload: ${remoteMessage.data}")
            handleDataMessage(remoteMessage.data)
        }

        // Check if message contains a notification payload
        remoteMessage.notification?.let {
            Log.d(TAG, "Message Notification Body: ${it.body}")
            handleNotificationMessage(it.title, it.body)
        }
    }

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        Log.d(TAG, "Refreshed token: $token")
        
        // Send token to your server
        sendRegistrationToServer(token)
    }

    private fun handleDataMessage(data: Map<String, String>) {
        val notificationHelper = NotificationHelper(this)
        
        val type = data["type"] ?: "message"
        val title = data["title"] ?: "New Notification"
        val message = data["body"] ?: "You have a new notification"
        val callerId = data["callerId"] ?: ""
        
        when (type) {
            "voice_call", "video_call" -> {
                notificationHelper.showCallNotification(
                    title,
                    message,
                    callerId,
                    type
                )
            }
            "message" -> {
                notificationHelper.showMessageNotification(title, message)
            }
            else -> {
                notificationHelper.showMessageNotification(title, message)
            }
        }
    }

    private fun handleNotificationMessage(title: String?, body: String?) {
        val notificationHelper = NotificationHelper(this)
        notificationHelper.showMessageNotification(
            title ?: "New Notification",
            body ?: "You have a new notification"
        )
    }

    private fun sendRegistrationToServer(token: String) {
        // Implement your logic to send token to your server
        Log.d(TAG, "Sending token to server: $token")
    }
}

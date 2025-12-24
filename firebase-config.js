// Firebase configuration
// Replace these values with your Firebase project config
// Get them from: Firebase Console > Project Settings > General > Your apps

// Safe initialization - won't crash if script fails to load
try {
    var firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT_ID.appspot.com",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
    };
} catch (error) {
    console.warn('Firebase config could not be loaded:', error);
    var firebaseConfig = null;
}


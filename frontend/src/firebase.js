import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

let app, auth, analytics;

// Check if critical config is actually present
const isConfigValid = !!process.env.REACT_APP_FIREBASE_PROJECT_ID;

if (isConfigValid) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    if (typeof window !== 'undefined') {
      analytics = getAnalytics(app);
    }
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
}

// Fallback / Mock Auth to prevent total app failure if config is missing
if (!auth) {
  console.warn("⚠️ Firebase is NOT configured. Auth features will be disabled.");
  auth = {
    currentUser: null,
    onAuthStateChanged: (cb) => { cb(null); return () => {}; },
    signInWithEmailAndPassword: async () => { throw new Error("Authentication is currently unavailable (Missing Config)"); },
    createUserWithEmailAndPassword: async () => { throw new Error("Authentication is currently unavailable (Missing Config)"); },
    signOut: async () => {}
  };
}

export { app, auth };

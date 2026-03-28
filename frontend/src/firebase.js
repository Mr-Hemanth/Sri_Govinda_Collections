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

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.warn("Firebase config is missing or invalid. Auth will not work.", error);
  // Mock auth object for development if config is empty
  auth = {
    currentUser: null,
    onAuthStateChanged: (cb) => { cb(null); return () => {}; },
    signInWithEmailAndPassword: async () => { throw new Error("Firebase not configured"); },
    signOut: async () => {}
  }
}

export { app, auth };

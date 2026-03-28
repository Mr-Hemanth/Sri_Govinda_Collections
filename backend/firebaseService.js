require('dotenv').config();
const admin = require('firebase-admin');

// Mock initialization if Firebase keys are not fully provided, 
// to prevent the app from crashing during development before users set it up.
if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PRIVATE_KEY.includes('-----BEGIN PRIVATE KEY-----')) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Replace literal \n with actual newlines in private key
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
  });
} else {
  console.warn("⚠️ Firebase configuration missing! Initializing app with dummy credentials for local testing. In a real environment, please provide valid FIREBASE_PRIVATE_KEY in .env");
  // Only valid if using a local emulator, or will just fail later when db is accessed
  admin.initializeApp({ projectId: 'demo-project' });
}

const db = admin.firestore();

// Optional: Use Firestore emulator if needed
if (process.env.FIRESTORE_EMULATOR_HOST) {
    db.settings({
        host: process.env.FIRESTORE_EMULATOR_HOST,
        ssl: false
    });
}

module.exports = { admin, db };

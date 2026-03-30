const admin = require('firebase-admin');
require('dotenv').config();

if (!process.env.FIREBASE_PROJECT_ID) {
  console.error("Missing FIREBASE_PROJECT_ID");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  })
});

const db = admin.firestore();

async function deleteCollection(collectionPath, batchSize = 100) {
  const collectionRef = db.collection(collectionPath);
  const query = collectionRef.orderBy('__name__').limit(batchSize);

  return new Promise((resolve, reject) => {
    deleteQueryBatch(db, query, resolve).catch(reject);
  });
}

async function deleteQueryBatch(db, query, resolve) {
  const snapshot = await query.get();

  const batchSize = snapshot.size;
  if (batchSize === 0) {
    resolve();
    return;
  }

  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();

  process.nextTick(() => {
    deleteQueryBatch(db, query, resolve);
  });
}

async function clearAllExceptAdmin() {
  const collections = ['products', 'offers', 'orders', 'subscriptions'];
  
  console.log("--- Starting Data Cleanup ---");
  
  for (const collection of collections) {
    console.log(`Clearing collection: ${collection}...`);
    await deleteCollection(collection);
    console.log(`Cleared: ${collection}`);
  }

  console.log("Clearing users (excluding admin)...");
  const usersSnapshot = await db.collection('users').get();
  const adminEmail = 'admin@srigovinda.com';
  
  const batch = db.batch();
  let count = 0;
  usersSnapshot.docs.forEach(doc => {
    const userData = doc.data();
    if (userData.email !== adminEmail) {
      batch.delete(doc.ref);
      count++;
    }
  });
  
  if (count > 0) {
    await batch.commit();
  }
  
  console.log(`Cleared ${count} users. Admin account preserved.`);
  console.log("--- Cleanup Complete ---");
  process.exit(0);
}

clearAllExceptAdmin().catch(err => {
  console.error("Cleanup failed:", err);
  process.exit(1);
});

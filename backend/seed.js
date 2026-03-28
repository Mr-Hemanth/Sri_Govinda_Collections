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

const seedProducts = [
  { id: 'SG1001', name: 'Premium 1g Gold Necklace', category: '1 Gram Gold', price: 1500, description: 'Exquisite 1 Gram Gold necklace with traditional temple motifs.', images: ['https://images.unsplash.com/photo-1599643477873-beefa344dd1a?auto=format&fit=crop&q=80&w=400'] },
  { id: 'SG1002', name: 'German Silver Antique Uruli', category: 'German Silver', price: 1200, description: 'Handcrafted antique silver uruli for home decor.', images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400'] },
  { id: 'SG1003', name: 'Lord Venkateswara Idol', category: 'Gift Articles', price: 2500, description: 'Divine brass idol of Lord Venkateswara.', images: ['https://images.unsplash.com/photo-1603525203792-c67be3005a39?auto=format&fit=crop&q=80&w=400'] },
  { id: 'SG1004', name: 'Bridal Choker Set', category: 'Bridal Set', price: 3500, description: 'Royal bridal choker set for weddings.', images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=400'] }
];

async function seed() {
  for (const p of seedProducts) {
    const { id, ...data } = p;
    await db.collection('products').doc(id).set({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    console.log(`Seeded: ${p.name}`);
  }
  process.exit(0);
}

seed();

const express = require('express');
const router = express.Router();
const { db } = require('../firebaseService');

// Get all offers (Public)
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('offers').get();
        const offers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(offers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch offers' });
    }
});

// Validate Coupon (One-time use per user account)
router.post('/validate', async (req, res) => {
    const { code, userId } = req.body;
    
    if (!code) return res.status(400).json({ error: 'Coupon code is required' });

    try {
        // 1. Find the coupon
        const offerSnap = await db.collection('offers').where('code', '==', code.toUpperCase()).get();
        if (offerSnap.empty) return res.status(404).json({ error: 'Invalid coupon code' });

        const offer = offerSnap.docs[0].data();
        const offerId = offerSnap.docs[0].id;

        // 2. Check if expired
        if (offer.expiryDate && new Date(offer.expiryDate) < new Date()) {
            return res.status(400).json({ error: 'Coupon has expired' });
        }

        // 3. Check usage limit (if applicable)
        if (userId) {
            const userSnap = await db.collection('users').doc(userId).get();
            if (userSnap.exists) {
                const userData = userSnap.data();
                const usedCoupons = userData.usedCoupons || [];
                if (usedCoupons.includes(code.toUpperCase())) {
                    return res.status(400).json({ error: 'This coupon has already been used on your account' });
                }
            }
        }

        res.json({ 
            valid: true, 
            discountType: offer.discountType, // 'percent' or 'flat'
            discountValue: offer.discountValue,
            minAmount: offer.minAmount || 0,
            id: offerId
        });
    } catch (error) {
        console.error('Validation Error:', error);
        res.status(500).json({ error: 'Failed to validate coupon' });
    }
});

// Admin: Create/Update Offer
router.post('/', async (req, res) => {
    try {
        const { code, discountValue, discountType, expiryDate, minAmount, description } = req.body;
        const newOffer = {
            code: code.toUpperCase(),
            discountValue: Number(discountValue),
            discountType,
            expiryDate,
            minAmount: Number(minAmount || 0),
            description,
            createdAt: new Date().toISOString()
        };
        const docRef = await db.collection('offers').add(newOffer);
        res.status(201).json({ id: docRef.id, ...newOffer });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create offer' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const offerData = req.body;
        if (offerData.code) offerData.code = offerData.code.toUpperCase();
        await db.collection('offers').doc(req.params.id).set(offerData, { merge: true });
        res.json({ message: 'Offer updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update offer' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await db.collection('offers').doc(req.params.id).delete();
        res.json({ message: 'Offer deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete offer' });
    }
});

module.exports = router;

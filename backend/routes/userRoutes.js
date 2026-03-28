const express = require('express');
const router = express.Router();
const { db } = require('../firebaseService');

// Get user profile
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('users').doc(req.params.id).get();
        if (!doc.exists) {
            return res.json({ name: '', phone: '', email: '', addresses: [], usedCoupons: [] });
        }
        res.json(doc.data());
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Update user profile (Name, Phone, etc.)
router.put('/:id', async (req, res) => {
    try {
        const profileData = req.body;
        await db.collection('users').doc(req.params.id).set(profileData, { merge: true });
        res.json({ message: 'Profile updated successfully', ...profileData });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Add/Update Address
router.post('/:id/addresses', async (req, res) => {
    try {
        const { address } = req.body; // { id, label, street, city, state, zip }
        const userRef = db.collection('users').doc(req.params.id);
        const doc = await userRef.get();
        
        let addresses = [];
        if (doc.exists) {
            addresses = doc.data().addresses || [];
        }

        if (address.id) {
            // Update existing
            addresses = addresses.map(a => a.id === address.id ? address : a);
        } else {
            // Add new
            const newAddr = { ...address, id: Date.now().toString() };
            addresses.push(newAddr);
        }

        await userRef.set({ addresses }, { merge: true });
        res.json({ message: 'Address saved', addresses });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save address' });
    }
});

// Delete Address
router.delete('/:id/addresses/:addressId', async (req, res) => {
    try {
        const userRef = db.collection('users').doc(req.params.id);
        const doc = await userRef.get();
        
        if (doc.exists) {
            let addresses = doc.data().addresses || [];
            addresses = addresses.filter(a => a.id !== req.params.addressId);
            await userRef.set({ addresses }, { merge: true });
            res.json({ message: 'Address deleted', addresses });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete address' });
    }
});

// Mark Coupon as Used
router.post('/:id/coupons', async (req, res) => {
    try {
        const { code } = req.body;
        const userRef = db.collection('users').doc(req.params.id);
        const doc = await userRef.get();
        
        let usedCoupons = [];
        if (doc.exists) {
            usedCoupons = doc.data().usedCoupons || [];
        }
        
        if (!usedCoupons.includes(code.toUpperCase())) {
            usedCoupons.push(code.toUpperCase());
            await userRef.set({ usedCoupons }, { merge: true });
        }
        
        res.json({ message: 'Coupon marked as used', usedCoupons });
    } catch (error) {
        res.status(500).json({ error: 'Failed to track coupon' });
    }
});

module.exports = router;

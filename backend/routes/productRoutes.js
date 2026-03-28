const express = require('express');
const router = express.Router();
const { db } = require('../firebaseService');

// Collection Reference
const productsRef = db.collection('products');

// Get all products
router.get('/', async (req, res) => {
    try {
        const { category, search, sort } = req.query;
        let query = productsRef;

        if (category && category !== 'All') {
            query = query.where('category', '==', category);
        }

        const snapshot = await query.get();
        let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (search) {
            const lcSearch = String(search).toLowerCase();
            products = products.filter(p => p.name.toLowerCase().includes(lcSearch) || (p.description && p.description.toLowerCase().includes(lcSearch)));
        }

        if (sort === 'price-low') {
            products.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
        } else if (sort === 'price-high') {
            products.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
        } else if (sort === 'newest' || !sort) {
            products.sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return (dateB || 0) - (dateA || 0);
            });
        }

        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
    try {
        const doc = await productsRef.doc(req.params.id).get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// Create a new product (Admin)
router.post('/', async (req, res) => {
    try {
        const productData = req.body;
        productData.createdAt = new Date().toISOString();
        
        const docRef = await productsRef.add(productData);
        res.status(201).json({ id: docRef.id, ...productData });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// Add a review to a product
router.post('/:id/reviews', async (req, res) => {
    try {
        const { rating, comment, userName, userId } = req.body;
        const productRef = productsRef.doc(req.params.id);
        const doc = await productRef.get();
        if (!doc.exists) return res.status(404).json({ error: 'Product not found' });
        
        const existingData = doc.data();
        const reviews = existingData.reviews || [];
        reviews.push({
            rating: Number(rating),
            comment,
            userName,
            userId,
            createdAt: new Date().toISOString()
        });
        
        const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
        await productRef.update({ reviews, avgRating });
        res.json({ message: 'Review added', reviews, avgRating });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add review' });
    }
});

// Update a product (Admin)
router.put('/:id', async (req, res) => {
    try {
        const productData = req.body;
        await productsRef.doc(req.params.id).update(productData);
        res.json({ id: req.params.id, ...productData });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Delete a product (Admin)
router.delete('/:id', async (req, res) => {
    try {
        await productsRef.doc(req.params.id).delete();
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

module.exports = router;

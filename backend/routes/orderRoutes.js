const express = require('express');
const router = express.Router();
const { db } = require('../firebaseService');
const nodemailer = require('nodemailer');

const ordersRef = db.collection('orders');

// Email Transporter Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOrderEmail = async (recipientEmail, orderInfo, orderId) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log("✉️  Mocking Email Send: Provide EMAIL_USER and EMAIL_PASS in backend .env to send real emails.");
        return;
    }
    const htmlBody = `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px;">
            <h1 style="color: #D4AF37; text-align: center; font-family: 'Georgia', serif;">Sri Govinda Collections</h1>
            <h2>Order Received!</h2>
            <p>Hi ${orderInfo.customerName},</p>
            <p>Thank you for your order. Your official Order ID is: <strong>${orderId}</strong></p>
            
            <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Order Summary:</h3>
                <ul style="list-style: none; padding: 0;">
                    ${orderInfo.products.map(p => `
                        <li style="margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 10px; display: flex; justify-content: space-between;">
                           <span>${p.quantity}x ${p.name}</span>
                           <strong>₹${p.price * p.quantity}</strong>
                        </li>
                    `).join('')}
                </ul>
                <h2 style="text-align: right; color: #D4AF37; margin-bottom: 0;">Total: ₹${orderInfo.totalAmount}</h2>
            </div>
            
            <p>You can track your order status on our website at any time using your Order ID.</p>
            <p>Please complete your payment via WhatsApp if you haven't already.</p>
            <br/>
            <p>Best regards,<br/><strong>Sri Govinda Collections Team</strong></p>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: `"Sri Govinda Collections" <${process.env.EMAIL_USER}>`,
            to: recipientEmail,
            subject: `Order Confirmation - ${orderId}`,
            html: htmlBody
        });
        console.log("✅ Email sent to", recipientEmail);
    } catch (err) {
        console.error("❌ Email sending failed:", err);
    }
};

// Get all orders (Filters by userId if passed)
router.get('/', async (req, res) => {
    try {
        const { userId } = req.query;
        let query = ordersRef;
        if (userId) {
            query = query.where('userId', '==', userId);
        }
        
        const snapshot = await query.get();
        let orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Get single order by ID (Guest Tracking)
router.get('/:id', async (req, res) => {
    try {
        const doc = await ordersRef.doc(req.params.id).get();
        if (!doc.exists) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        console.error('Error fetching order by ID:', error);
        res.status(500).json({ error: 'Failed to fetch order details' });
    }
});

// Create a new order (Buyer)
router.post('/', async (req, res) => {
    try {
        const { userId, customerName, email, phone, address, products, totalAmount, couponCode } = req.body;
        
        // 1. One-time Coupon Check for Logged-in Users
        if (userId && couponCode) {
            const userRef = db.collection('users').doc(userId);
            const userDoc = await userRef.get();
            if (userDoc.exists) {
                const userData = userDoc.data();
                const usedCoupons = userData.usedCoupons || [];
                if (usedCoupons.includes(couponCode.toUpperCase())) {
                    return res.status(400).json({ error: 'This coupon has already been used on your account' });
                }
            }
        }

        const newOrder = {
            userId: userId || null,
            customerName,
            email: email || '',
            phone,
            address,
            products,
            totalAmount,
            couponCode: couponCode || null,
            status: 'Pending',
            createdAt: new Date().toISOString(),
        };

        const docRef = await ordersRef.add(newOrder);

        // 2. Mark Coupon as Used
        if (userId && couponCode) {
            const userRef = db.collection('users').doc(userId);
            const userDoc = await userRef.get();
            let usedCoupons = [];
            if (userDoc.exists) {
                usedCoupons = userDoc.data().usedCoupons || [];
            }
            if (!usedCoupons.includes(couponCode.toUpperCase())) {
                usedCoupons.push(couponCode.toUpperCase());
                await userRef.set({ usedCoupons }, { merge: true });
            }
        }
        
        // Trigger Email Send without blocking response
        if (newOrder.email) {
            sendOrderEmail(newOrder.email, newOrder, docRef.id);
        }

        res.status(201).json({ id: docRef.id, ...newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to place order' });
    }
});

// Update order status (Admin)
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        if (!['Pending', 'Paid', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        await ordersRef.doc(req.params.id).update({ status });
        res.json({ message: 'Order status updated successfully', id: req.params.id, status });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

// Update payment proof (Buyer)
router.put('/:id/payment', async (req, res) => {
    try {
        const { paymentProofUrl, transactionId, utr } = req.body;
        // Optionally set status to 'Paid' so the timeline moves forward
        await ordersRef.doc(req.params.id).update({ 
            paymentProofUrl: paymentProofUrl || '', 
            transactionId: transactionId || '',
            utr: utr || '',
            status: 'Paid' 
        });
        res.json({ message: 'Payment proof submitted successfully' });
    } catch (error) {
        console.error("Payment update error:", error);
        res.status(500).json({ error: 'Failed to submit payment proof' });
    }
});

module.exports = router;

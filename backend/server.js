require('dotenv').config();
const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const offerRoutes = require('./routes/offerRoutes');
const { db } = require('./firebaseService');

const app = express();

// CORS Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/offers', offerRoutes);

// Analytics Route for Admin Dashboard
app.get('/api/analytics', async (req, res) => {
    try {
        const ordersSnapshot = await db.collection('orders').orderBy('createdAt', 'desc').get();
        const productsSnapshot = await db.collection('products').get();
        
        let totalRevenue = 0;
        let totalOrders = ordersSnapshot.size;
        let pendingOrders = 0;
        let deliveredOrdersCount = 0;
        let recentOrders = [];
        let productCounts = {};
        let categorySales = {};
        let monthlyRevenue = {};

        ordersSnapshot.docs.forEach((doc, index) => {
            const data = doc.data();
            const orderId = doc.id;
            const date = new Date(data.createdAt);
            const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
            
            if (data.status === 'Pending') pendingOrders++;
            if (data.status === 'Delivered') deliveredOrdersCount++;
            
            // Calculate revenue and analytics ONLY for Delivered/Confirmed orders
            if (data.products && Array.isArray(data.products)) {
                data.products.forEach(p => {
                    const itemRevenue = (Number(p.price) * Number(p.quantity || 1));
                    
                    if (data.status === 'Delivered') {
                        totalRevenue += itemRevenue;
                        monthlyRevenue[monthYear] = (monthlyRevenue[monthYear] || 0) + itemRevenue;
                    }

                    // Total popularity (even if not delivered yet)
                    productCounts[p.name] = (productCounts[p.name] || 0) + Number(p.quantity || 1);
                    
                    // Category sales (if product has category)
                    const category = p.category || 'Uncategorized';
                    categorySales[category] = (categorySales[category] || 0) + itemRevenue;
                });
            }

            // Capture top 8 recent orders
            if (index < 8) {
                recentOrders.push({
                    id: orderId,
                    customerName: data.customerName,
                    totalAmount: data.totalAmount,
                    status: data.status,
                    createdAt: data.createdAt
                });
            }
        });

        // Format Top Products
        const topProducts = Object.entries(productCounts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        // Calculate Low Stock Alerts
        const lowStockProducts = productsSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(p => Number(p.stock || 0) < 5)
            .map(p => ({ id: p.id, name: p.name, stock: p.stock, image: p.images?.[0] }));

        res.json({
            totalOrders,
            totalRevenue,
            pendingOrders,
            deliveredOrdersCount,
            recentOrders,
            topProducts,
            lowStockProducts,
            categorySales,
            monthlyRevenue: Object.entries(monthlyRevenue).map(([name, value]) => ({ name, value }))
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

// Subscription Route
app.post('/api/subscribe', async (req, res) => {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Valid email is required' });
    }
    try {
        await db.collection('subscriptions').add({
            email,
            createdAt: new Date().toISOString()
        });
        res.json({ message: 'Subscribed successfully!' });
    } catch (error) {
        console.error('Subscription error:', error);
        res.status(500).json({ error: 'Failed to subscribe' });
    }
});

// Root Route
app.get('/', (req, res) => {
    res.send('Sri Govinda Collections API is running');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { 
  TrendingUp, 
  ShoppingCart, 
  Package, 
  AlertTriangle, 
  Users, 
  Tag,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';

import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingOrders: 0,
    lowStockCount: 0,
    totalCustomers: 0,
    revenueGrowth: 12.5,
    categorySales: {}
  });
  const [user, setUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      setAuthChecking(false);
      if (u && u.email === process.env.REACT_APP_ADMIN_EMAIL) {
        fetchStats();
      }
    });
    return () => unsub();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL?.trim();
      const [ordRes, prodRes] = await Promise.all([
        fetch(`${baseUrl}/orders`),
        fetch(`${baseUrl}/products`)
      ]);

      if (ordRes.ok && prodRes.ok) {
        const ordData = await ordRes.json();
        const prodData = await prodRes.json();
        
        setOrders(ordData);
        setProducts(prodData);

        // Advanced Analytics Logic
        const deliveredOrders = ordData.filter(o => o.status === 'Delivered');
        const revenue = deliveredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        
        const catSales = {};
        deliveredOrders.forEach(o => {
          o.products.forEach(p => {
             catSales[p.category] = (catSales[p.category] || 0) + (p.price * p.quantity);
          });
        });

        setStats({
          totalRevenue: revenue,
          pendingOrders: ordData.filter(o => o.status === 'Pending' || o.status === 'Paid').length,
          lowStockCount: prodData.filter(p => p.stock < 5).length,
          totalCustomers: new Set(ordData.map(o => o.userId).filter(id => id)).size,
          revenueGrowth: 12.5,
          categorySales: catSales
        });
      }
    } catch (e) {
      console.error("Dashboard fetch failed", e);
    }
    setLoading(false);
  };

  if (authChecking) return <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>Verifying security credentials...</div>;

  if (!user || user.email !== process.env.REACT_APP_ADMIN_EMAIL) {
    return <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}><h2>Access Denied</h2><p>Administrative clearance required.</p></div>;
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 0' }}>
      <header className="flex justify-between items-center" style={{ marginBottom: '4rem', flexWrap: 'wrap', gap: '2rem' }}>
        <div className="flex-col gap-2">
           <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--color-primary)' }}>Business Intelligence</h1>
           <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.2rem' }}>Real-time overview of the Sri Govinda ecosystem.</p>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" onClick={fetchStats} style={{ borderRadius: '50px' }}>
              <RefreshCw size={16} style={{ marginRight: '0.5rem' }} /> Refresh Data
           </Button>
           <Link to="/admin/products"><Button variant="primary" style={{ borderRadius: '50px' }}>Manage Catalog</Button></Link>
        </div>
      </header>
      
      {/* Quick Actions / Command Center */}
      <section style={{ marginBottom: '4rem' }}>
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
           <Link to="/admin/products" className="card glass flex items-center gap-4" style={{ padding: '1.5rem', transition: 'var(--transition-standard)' }}>
              <div style={{ padding: '1rem', background: 'var(--color-ivory)', borderRadius: '12px', color: 'var(--color-primary)' }}><Package size={24} /></div>
              <div><p style={{ fontWeight: '700' }}>Add Product</p><p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Expand your catalog</p></div>
           </Link>
           <Link to="/admin/orders" className="card glass flex items-center gap-4" style={{ padding: '1.5rem', transition: 'var(--transition-standard)' }}>
              <div style={{ padding: '1rem', background: 'var(--color-ivory)', borderRadius: '12px', color: 'var(--color-primary)' }}><ShoppingCart size={24} /></div>
              <div><p style={{ fontWeight: '700' }}>Review Orders</p><p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Pending verifications</p></div>
           </Link>
           <Link to="/admin/offers" className="card glass flex items-center gap-4" style={{ padding: '1.5rem', transition: 'var(--transition-standard)' }}>
              <div style={{ padding: '1rem', background: 'var(--color-ivory)', borderRadius: '12px', color: 'var(--color-primary)' }}><Tag size={24} /></div>
              <div><p style={{ fontWeight: '700' }}>Create Offer</p><p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Boost your sales</p></div>
           </Link>
        </div>
      </section>

      {/* Primary KPI Cards */}
      <div className="grid gap-10" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', marginBottom: '6rem' }}>
        
        {/* Revenue Card */}
        <div className="card" style={{ padding: '2.5rem', background: 'var(--color-black)', color: 'white', position: 'relative', overflow: 'hidden' }}>
          <TrendingUp style={{ position: 'absolute', top: '1rem', right: '1rem', opacity: 0.2 }} size={80} />
          <p style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.7, marginBottom: '1rem' }}>Total Revenue (Delivered)</p>
          <p style={{ fontSize: '3rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>₹{stats.totalRevenue.toLocaleString()}</p>
          <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <ArrowUpRight size={16} /> <span>{stats.revenueGrowth}% growth streak</span>
          </div>
        </div>

        {/* Orders Card */}
        <div className="card" style={{ padding: '2.5rem', border: '1px solid var(--color-gray-border)' }}>
          <div className="flex justify-between items-start" style={{ marginBottom: '2rem' }}>
             <div>
                <p style={{ fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '700', color: '#666', marginBottom: '0.5rem' }}>Active Fulfillment</p>
                <p style={{ fontSize: '2.5rem', fontWeight: '800' }}>{stats.pendingOrders}</p>
             </div>
             <div style={{ backgroundColor: '#fef3c7', padding: '0.75rem', borderRadius: '12px', color: '#d97706' }}><ShoppingCart size={24} /></div>
          </div>
          <div className="flex items-center gap-2" style={{ fontSize: '0.85rem', color: '#059669' }}>
             <TrendingUp size={16} /> <span>+{orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length} today</span>
          </div>
        </div>

        {/* Inventory Card */}
        <div className="card" style={{ padding: '2.5rem', border: '1px solid var(--color-gray-border)' }}>
           <div className="flex justify-between items-start" style={{ marginBottom: '2rem' }}>
              <div>
                 <p style={{ fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: '700', color: '#666', marginBottom: '0.5rem' }}>Stock Alerts</p>
                 <p style={{ fontSize: '2.5rem', fontWeight: '800', color: stats.lowStockCount > 0 ? 'var(--color-error)' : 'inherit' }}>{stats.lowStockCount}</p>
              </div>
              <div style={{ backgroundColor: '#fee2e2', padding: '0.75rem', borderRadius: '12px', color: '#dc2626' }}><AlertTriangle size={24} /></div>
           </div>
           <p style={{ fontSize: '0.85rem', color: '#666' }}>Items with stock level below 5 units.</p>
        </div>
      </div>

      <div className="grid gap-10" style={{ gridTemplateColumns: '2fr 1fr', gridAutoFlow: 'row dense' }}>
         <div className="card" style={{ padding: '2.5rem' }}>
            <h3 style={{ marginBottom: '2rem', fontFamily: 'var(--font-heading)' }}>Category Sales Distribution</h3>
            <div className="flex-col gap-6">
               {Object.entries(stats.categorySales).length > 0 ? Object.entries(stats.categorySales).map(([cat, val]) => (
                  <div key={cat}>
                     <div className="flex justify-between" style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                        <span style={{ fontWeight: '600' }}>{cat}</span>
                        <span>₹{val.toLocaleString()}</span>
                     </div>
                     <div style={{ height: '8px', background: 'var(--color-gray-light)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: 'var(--color-primary)', width: `${(val / stats.totalRevenue) * 100}%`, transition: 'width 1s ease-out' }}></div>
                     </div>
                  </div>
               )) : <p style={{ color: '#888', padding: '2rem 0', textAlign: 'center' }}>No sales data available yet.</p>}
            </div>
         </div>

         <div className="card" style={{ padding: '2.5rem', background: 'var(--color-ivory)', border: '1px solid var(--color-gold)' }}>
            <h3 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Recent Activity</h3>
            <div className="flex-col gap-4">
               {orders.slice(0, 5).map(o => (
                  <div key={o.id} className="flex justify-between items-center" style={{ paddingBottom: '0.75rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                     <div>
                        <p style={{ fontSize: '0.85rem', fontWeight: '700' }}>{o.customerName || 'Guest'}</p>
                        <p style={{ fontSize: '0.7rem', color: '#666' }}>{new Date(o.createdAt).toLocaleDateString()}</p>
                     </div>
                     <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'white', border: '1px solid #eee' }}>{o.status}</span>
                  </div>
               ))}
               <Link to="/admin/orders" style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: '700', marginTop: '1rem' }}>View All Activity →</Link>
            </div>
         </div>
      </div>
    </div>
  );
}

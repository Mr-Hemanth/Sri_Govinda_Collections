import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Button from '../components/ui/Button';
import { Package, ChevronRight, Clock } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      if (u) {
        fetchOrders(u.uid);
      } else {
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  const fetchOrders = async (userId) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders?userId=${userId}`);
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    'Pending': { bg: '#fef3c7', text: '#92400e' },
    'Paid': { bg: '#dcfce7', text: '#166534' },
    'Shipped': { bg: '#dbeafe', text: '#1e40af' },
    'Delivered': { bg: '#f0fdf4', text: '#166534' },
    'Cancelled': { bg: '#fee2e2', text: '#991b1b' },
    'Confirmed': { bg: '#e0f2fe', text: '#075985' }
  };

  if (loading) return <div className="container section-padding" style={{ textAlign: 'center' }}>Loading your masterpieces...</div>;

  if (!user) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1.5rem' }}>Please Login</h2>
        <p style={{ color: 'var(--color-gray-dark)', marginBottom: '2rem' }}>You need to be logged in to view your order history.</p>
        <Link to="/login"><Button variant="primary">Log In</Button></Link>
      </div>
    );
  }

  return (
    <div className="container section-padding animate-fade-in" style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>My Order History</h1>
        <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.1rem' }}>Track your royal collections and past acquisitions.</p>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '6rem', backgroundColor: 'var(--color-ivory)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-gray-border)' }}>
          <Package size={60} style={{ color: 'var(--color-gold)', marginBottom: '1.5rem', opacity: 0.6 }} />
          <h2 style={{ marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>No Orders Yet</h2>
          <p style={{ color: 'var(--color-gray-dark)', marginBottom: '2.5rem' }}>Your journey with Sri Govinda Collections starts today.</p>
          <Link to="/shop"><Button variant="primary" style={{ padding: '1rem 3rem' }}>Explore Catalogue</Button></Link>
        </div>
      ) : (
        <div className="flex-col" style={{ gap: '2rem' }}>
          {orders.map(order => (
            <div key={order.id} className="card" style={{ padding: '2rem', border: '1px solid var(--color-gray-border)' }}>
              <div className="flex justify-between items-start" style={{ flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--color-gray-light)', paddingBottom: '1.5rem' }}>
                <div>
                  <div className="flex items-center gap-3" style={{ marginBottom: '0.5rem' }}>
                    <span style={{ 
                      padding: '0.4rem 1rem', 
                      borderRadius: '50px', 
                      fontSize: '0.75rem', 
                      fontWeight: '800', 
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      backgroundColor: statusColors[order.status]?.bg || '#f3f4f6',
                      color: statusColors[order.status]?.text || '#374151'
                    }}>
                      {order.status}
                    </span>
                    <span style={{ color: 'var(--color-gray-text)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={14} /> {new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Order ID: <span style={{ color: 'var(--color-primary)' }}>#{order.id.slice(-8).toUpperCase()}</span></h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                   <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.9rem', marginBottom: '0.3rem' }}>Total Amount</p>
                   <p style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--color-primary)' }}>₹{order.totalAmount}</p>
                </div>
              </div>

              <div className="flex-col gap-4">
                {order.products.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      {item.image && <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />}
                      <div>
                        <p style={{ fontWeight: '700', fontSize: '0.95rem' }}>{item.name}</p>
                        <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-dark)' }}>Qty: {item.quantity} × ₹{item.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                <Link to={`/track?id=${order.id}`}>
                  <Button variant="outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>
                    Track Detail <ChevronRight size={16} />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

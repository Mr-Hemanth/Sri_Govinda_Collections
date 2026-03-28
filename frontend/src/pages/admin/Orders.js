import { useState, useEffect } from 'react';
import Button from '../../components/ui/Button';

import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchOrders();
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
    });
    return () => { if (unsub) unsub(); };
  }, []);

  useEffect(() => {
    if (filter === 'All') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(o => o.status === filter));
    }
  }, [orders, filter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL?.trim();
      if (!baseUrl) {
        console.warn("API Base URL not defined.");
        return;
      }
      const res = await fetch(`${baseUrl}/orders`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error("Fetch orders failed", e);
    }
    setLoading(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchOrders(); // Refresh
      } else {
        alert("Failed to update status");
      }
    } catch (e) {
      alert("Failed to update status");
    }
  };

  if (!user || user.email !== process.env.REACT_APP_ADMIN_EMAIL) {
    return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}><h2>Access Denied</h2><p>Admin privileges required.</p></div>;
  }

  const stats = {
    pending: orders.filter(o => o.status === 'Pending').length,
    today: orders.filter(o => new Date(o.createdAt).toLocaleDateString() === new Date().toLocaleDateString()).length,
    total: orders.length
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '8rem 0 3rem' }}>
      <div className="flex justify-between items-center" style={{ marginBottom: '3rem', flexWrap: 'wrap', gap: '2rem' }}>
        <div className="flex-col gap-2">
          <h1 className="text-accent" style={{ fontFamily: 'var(--font-heading)' }}>Order Fulfillment</h1>
          <p style={{ color: 'var(--color-gray-text)' }}>Manage and track all customer purchases.</p>
        </div>
        
        <div className="flex gap-6" style={{ background: 'var(--color-ivory)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--color-gray-border)' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase' }}>New Orders</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.pending}</p>
          </div>
          <div style={{ width: '1px', background: '#ccc' }}></div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: '#666', textTransform: 'uppercase' }}>Today</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.today}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4" style={{ marginBottom: '2rem' }}>
        <span style={{ fontWeight: '600' }}>Filter Status:</span>
        <div className="flex gap-2">
          {['All', 'Pending', 'Confirmed', 'Delivered', 'Cancelled'].map(s => (
            <button 
              key={s} 
              onClick={() => setFilter(s)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '50px',
                border: filter === s ? '1px solid var(--color-primary)' : '1px solid #ccc',
                backgroundColor: filter === s ? 'var(--color-primary)' : 'white',
                color: filter === s ? 'white' : '#666',
                cursor: 'pointer',
                fontSize: '0.85rem',
                transition: 'all 0.2s'
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <div style={{ overflowX: 'auto', borderRadius: '1rem', border: '1px solid var(--color-gray-border)', backgroundColor: 'white' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-black)', color: 'white' }}>
                <th style={{ padding: '1.25rem' }}>Order Info</th>
                <th style={{ padding: '1.25rem' }}>Customer Details</th>
                <th style={{ padding: '1.25rem' }}>Items</th>
                <th style={{ padding: '1.25rem' }}>Amount</th>
                <th style={{ padding: '1.25rem' }}>Status</th>
                <th style={{ padding: '1.25rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => (
                <tr key={o.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1.25rem' }}>
                    <p style={{ fontWeight: 'bold' }}>#{o.id.slice(-8).toUpperCase()}</p>
                    <p style={{ fontSize: '0.8rem', color: '#888' }}>{new Date(o.createdAt).toLocaleString()}</p>
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                    <p style={{ fontWeight: '600' }}>{o.customerName || 'N/A'}</p>
                    <p style={{ fontSize: '0.85rem', color: '#666' }}>{o.phone}</p>
                    <p style={{ fontSize: '0.8rem', color: '#888', maxWidth: '200px' }} title={o.address}>{o.address?.slice(0, 50)}...</p>
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                    {o.products?.map((p, i) => (
                      <div key={i} style={{ fontSize: '0.85rem' }}>• {p.quantity}x {p.name}</div>
                    ))}
                    {o.utr && (
                      <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: 'var(--color-ivory)', border: '1px dashed var(--color-primary)', borderRadius: '4px' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)' }}>UTR: {o.utr}</p>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '1.25rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>₹{o.totalAmount}</td>
                  <td style={{ padding: '1.25rem' }}>
                    <span style={{ 
                      padding: '0.3rem 0.75rem', 
                      borderRadius: '1rem', 
                      fontSize: '0.75rem', 
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      backgroundColor: o.status === 'Delivered' ? '#dcfce3' : o.status === 'Confirmed' ? '#e0f2fe' : o.status === 'Paid' ? '#fdf2f8' : o.status === 'Cancelled' ? '#fee2e2' : '#fef9c3',
                      color: o.status === 'Delivered' ? '#166534' : o.status === 'Confirmed' ? '#075985' : o.status === 'Paid' ? '#9d174d' : o.status === 'Cancelled' ? '#991b1b' : '#854d0e'
                    }}>
                      {o.status === 'Paid' ? 'Verification Req.' : o.status}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem' }}>
                    <div className="flex gap-2">
                      {o.status === 'Paid' ? (
                        <Button 
                          onClick={() => handleStatusChange(o.id, 'Confirmed')}
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', backgroundColor: 'var(--color-success)', color: 'white', border: 'none' }}
                        >
                          Approve
                        </Button>
                      ) : (
                        <select 
                          value={o.status} 
                          onChange={(e) => handleStatusChange(o.id, e.target.value)}
                          className="input-field"
                          style={{ padding: '0.4rem', fontSize: '0.85rem', width: 'auto', minWidth: '100px' }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="6" style={{ padding: '4rem', textAlign: 'center' }}>No orders matching this filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

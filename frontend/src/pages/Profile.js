import { useState, useEffect, useContext, useRef } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import OrderTimeline from '../components/ui/OrderTimeline';
import { CartContext } from '../context/CartContext';
import { ToastContext } from '../context/ToastContext';
import { LogOut, MapPin, Plus, Trash2, Edit2, User, ShoppingBag, Package, Settings, ChevronRight, ChevronDown, Camera } from 'lucide-react';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ name: '', phone: '', avatarUrl: '', addresses: [] });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'addresses', 'settings'
  const [saving, setSaving] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [expandedAddresses, setExpandedAddresses] = useState({});
  
  const fileInputRef = useRef(null);
  const { addToCart } = useContext(CartContext);
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      if (!u) {
        navigate('/login');
      } else {
        setUser(u);
        fetchProfile(u.uid);
        fetchOrders(u.uid);
      }
    });
    return () => { if (unsub) unsub(); };
  }, [navigate]);

  const fetchProfile = async (uid) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/${uid}`);
      if (res.ok) {
        const data = await res.json();
        setProfile({
          name: data.name || auth.currentUser?.displayName || '',
          phone: data.phone || '',
          avatarUrl: data.avatarUrl || '',
          addresses: data.addresses || []
        });
      }
    } catch (err) {
      console.error("Profile fetch error", err);
    }
  };

  const fetchOrders = async (userId) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/${user.uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        showToast("Profile updated successfully!");
      }
    } catch (err) {
      showToast("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, avatarUrl: reader.result }));
        // Auto-save avatar change
        setTimeout(() => handleUpdateProfile(), 100);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleOrder = (id) => {
    setExpandedOrders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAddress = (index) => {
    setExpandedAddresses(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleAddAddress = () => {
    setProfile(prev => ({
      ...prev,
      addresses: [...prev.addresses, { label: 'New Address', street: '', city: '', state: '', zip: '' }]
    }));
    setExpandedAddresses(prev => ({ ...prev, [profile.addresses.length]: true }));
  };

  const handleUpdateAddress = (index, field, value) => {
    const newAddresses = [...profile.addresses];
    newAddresses[index][field] = value;
    setProfile({ ...profile, addresses: newAddresses });
  };

  const handleRemoveAddress = (index) => {
    const newAddresses = profile.addresses.filter((_, i) => i !== index);
    setProfile({ ...profile, addresses: newAddresses });
  };

  const saveAddresses = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/${user.uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses: profile.addresses })
      });
      if (res.ok) showToast("Addresses saved successfully!");
    } catch (err) {
      showToast("Error saving addresses", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleBuyAgain = (product) => {
    const cartProduct = { ...product, images: [product.image] };
    addToCart(cartProduct);
    showToast(`${product.name} added to cart!`);
    navigate('/cart');
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  if (!user) return <div className="container" style={{ padding: '8rem 0', textAlign: 'center' }}>Loading your divine dashboard...</div>;

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '1400px', paddingTop: '4rem', paddingBottom: '6rem' }}>
      
      {/* Royal Dashboard Header */}
      <div className="flex-col gap-6" style={{ marginBottom: '3rem' }}>
        <div className="flex justify-between items-center" style={{ padding: '2.5rem', backgroundColor: 'var(--color-white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-gray-border)', boxShadow: 'var(--shadow-sm)' }}>
          <div className="flex items-center gap-8">
            <div style={{ position: 'relative', cursor: 'pointer' }} onClick={handleAvatarClick} className="avatar-container">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-gold)' }} />
              ) : (
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold', border: '2px solid var(--color-gold)' }}>
                  {profile.name ? profile.name[0].toUpperCase() : user.email[0].toUpperCase()}
                </div>
              )}
              <div className="avatar-overlay" style={{ position: 'absolute', bottom: '0', right: '0', backgroundColor: 'var(--color-gold)', color: 'white', padding: '0.4rem', borderRadius: '50%', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Camera size={14} />
              </div>
              <input type="file" ref={fileInputRef} onChange={handleAvatarChange} style={{ display: 'none' }} accept="image/*" />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', margin: 0, color: 'var(--color-primary)' }}>{profile.name || user.email.split('@')[0]}</h1>
              <p style={{ color: 'var(--color-gray-text)', fontSize: '0.95rem', fontWeight: '500', marginTop: '0.2rem' }}>{user.email}</p>
            </div>
          </div>
          
          <div className="flex gap-12" style={{ borderLeft: '1px solid var(--color-gray-border)', paddingLeft: '4rem' }}>
            <div className="text-center">
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-gold)', fontWeight: '800', marginBottom: '0.3rem' }}>Total Orders</p>
              <p style={{ fontSize: '1.6rem', fontWeight: '700', margin: 0 }}>{orders.length}</p>
            </div>
            <div className="text-center">
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--color-gold)', fontWeight: '800', marginBottom: '0.3rem' }}>Addresses</p>
              <p style={{ fontSize: '1.6rem', fontWeight: '700', margin: 0 }}>{profile.addresses.length}</p>
            </div>
            <button 
              onClick={handleLogout} 
              style={{ background: 'none', border: '1px solid var(--color-gray-border)', padding: '0.7rem 1.1rem', borderRadius: '50px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', color: 'var(--color-primary)', transition: 'all 0.3s ease', fontSize: '0.9rem' }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Horizontal Navigation */}
        <div className="flex gap-8" style={{ borderBottom: '1px solid var(--color-gray-border)', padding: '0 1rem' }}>
          {[
            { id: 'orders', label: 'Order History', icon: <Package size={18} /> },
            { id: 'addresses', label: 'Shipping Addresses', icon: <MapPin size={18} /> },
            { id: 'settings', label: 'Account Settings', icon: <User size={18} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '1rem 0', background: 'none', border: 'none', borderBottom: activeTab === tab.id ? '2px solid var(--color-gold)' : '2px solid transparent', cursor: 'pointer', color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-gray-text)', fontWeight: activeTab === tab.id ? '700' : '500', transition: 'all 0.3s ease', fontSize: '0.95rem'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="animate-fade-in">
        {activeTab === 'orders' && (
             <div className="animate-slide-up">
                <div className="flex justify-between items-end" style={{ marginBottom: '2.5rem' }}>
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', margin: '0 0 0.5rem' }}>Order History</h2>
                    <p style={{ color: 'var(--color-gray-text)', margin: 0 }}>Review and track your past divine collections.</p>
                  </div>
                </div>
                
                {loading ? (
                   <p>Fetching your treasures...</p>
                ) : orders.length > 0 ? (
                   <div className="flex-col gap-6">
                      {orders.map(order => (
                           <div key={order.id} className="card" style={{ padding: '0', border: '1px solid var(--color-gray-border)', overflow: 'hidden' }}>
                             <div 
                                onClick={() => toggleOrder(order.id)}
                                className="flex justify-between items-center" 
                                style={{ padding: '1.5rem 2rem', borderBottom: expandedOrders[order.id] ? '1px solid var(--color-gray-light)' : 'none', backgroundColor: 'var(--color-ivory)', cursor: 'pointer' }}
                              >
                                <div className="flex items-center gap-6">
                                   <div>
                                      <p style={{ fontSize: '0.75rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '800', margin: '0 0 0.2rem' }}>Order #{order.id.slice(-8).toUpperCase()}</p>
                                      <p style={{ fontWeight: '700', fontSize: '1.1rem', margin: 0 }}>{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                   </div>
                                   <div style={{ height: '30px', width: '1px', backgroundColor: 'var(--color-gray-border)' }}></div>
                                   <div>
                                      <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-text)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700', margin: '0 0 0.2rem' }}>Total</p>
                                      <p style={{ fontWeight: '700', fontSize: '1.1rem', margin: 0 }}>₹{order.totalAmount}</p>
                                   </div>
                                </div>
                                <div className="flex items-center gap-6">
                                   <span style={{ 
                                     padding: '0.4rem 1.2rem', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', borderRadius: '50px',
                                     backgroundColor: order.status === 'Delivered' ? '#f0fdf4' : '#fefce8',
                                     color: order.status === 'Delivered' ? '#166534' : '#854d0e',
                                     border: `1px solid ${order.status === 'Delivered' ? '#bbf7d0' : '#fef08a'}`
                                   }}>
                                     {order.status}
                                   </span>
                                   {expandedOrders[order.id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                </div>
                             </div>

                             {expandedOrders[order.id] && (
                               <div className="animate-slide-down" style={{ padding: '2rem' }}>
                                  <div style={{ marginBottom: '2.5rem' }}>
                                     <OrderTimeline status={order.status} />
                                  </div>

                                  {order.status === 'Pending' && (
                                     <div style={{ backgroundColor: 'var(--color-ivory)', padding: '2rem', borderRadius: '8px', border: '1px solid var(--color-gold)', marginBottom: '2.5rem' }}>
                                        <h4 style={{ marginBottom: '1rem', color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>Step 2: Confirm Your Payment</h4>
                                        <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: 'var(--color-gray-dark)', lineHeight: '1.5' }}>
                                           To begin processing, please share your payment confirmation details below.
                                        </p>
                                        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                           <div className="flex-col gap-2">
                                              <label style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)' }}>Transaction ID</label>
                                              <input 
                                                className="input-field" 
                                                placeholder="Enter Payment ID" 
                                                value={order.transactionId || ''}
                                                onChange={(e) => {
                                                   const newOrders = [...orders];
                                                   const idx = newOrders.findIndex(o => o.id === order.id);
                                                   newOrders[idx].transactionId = e.target.value;
                                                   setOrders(newOrders);
                                                }}
                                              />
                                           </div>
                                           <div className="flex-col gap-2">
                                              <label style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)' }}>UTR Number (12 Digits)</label>
                                              <input 
                                                className="input-field" 
                                                placeholder="12-digit UTR" 
                                                value={order.utr || ''}
                                                onChange={(e) => {
                                                   const newOrders = [...orders];
                                                   const idx = newOrders.findIndex(o => o.id === order.id);
                                                   newOrders[idx].utr = e.target.value;
                                                   setOrders(newOrders);
                                                }}
                                              />
                                           </div>
                                        </div>
                                        <Button 
                                          variant="primary" 
                                          style={{ width: '100%', marginTop: '1.5rem', padding: '1rem' }}
                                          onClick={async () => {
                                             try {
                                                const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/${order.id}/payment`, {
                                                   method: 'PUT',
                                                   headers: { 'Content-Type': 'application/json' },
                                                   body: JSON.stringify({ 
                                                      transactionId: order.transactionId,
                                                      utr: order.utr
                                                   })
                                                });
                                                if (res.ok) {
                                                   showToast("Payment proof submitted!");
                                                   fetchOrders(user.uid);
                                                }
                                             } catch (err) {
                                                showToast("Failed to submit proof", "error");
                                             }
                                          }}
                                        >
                                           Submit Confirmation
                                        </Button>
                                     </div>
                                  )}

                                  <div className="flex-col gap-4">
                                     <h4 style={{ fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-gray-dark)', letterSpacing: '1px' }}>Order Items</h4>
                                     {order.products?.map((p, idx) => (
                                        <div key={idx} className="flex justify-between items-center" style={{ padding: '1rem', backgroundColor: 'var(--color-white)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-gray-border)' }}>
                                           <div className="flex items-center gap-4">
                                              <div style={{ width: '60px', height: '60px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--color-gray-border)' }}>
                                                 <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                              </div>
                                              <div>
                                                 <p style={{ fontWeight: '700', fontSize: '1rem', margin: 0 }}>{p.name}</p>
                                                 <p style={{ fontSize: '0.85rem', color: 'var(--color-gray-text)', margin: '0.2rem 0', fontWeight: '500' }}>Qty: {p.quantity} • ₹{p.price}</p>
                                              </div>
                                           </div>
                                           <Button variant="outline" onClick={() => handleBuyAgain(p)} style={{ padding: '0.5rem 1.2rem', fontSize: '0.8rem', fontWeight: '700', borderRadius: '50px' }}>
                                              Reorder
                                           </Button>
                                        </div>
                                     ))}
                                  </div>
                               </div>
                             )}
                          </div>
                      ))}
                   </div>
                ) : (
                   <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
                      <ShoppingBag size={60} color="var(--color-gray-border)" style={{ marginBottom: '1.5rem' }} />
                      <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>No orders yet</h3>
                      <p style={{ color: 'var(--color-gray-text)', marginBottom: '2rem' }}>Begin your divine collection today.</p>
                      <Link to="/shop"><Button variant="primary" style={{ padding: '1rem 3rem' }}>Explore Catalogue</Button></Link>
                   </div>
                )}
             </div>
          )}

          {activeTab === 'addresses' && (
             <div>
                <div className="flex justify-between items-end" style={{ marginBottom: '2.5rem' }}>
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', margin: '0 0 0.5rem' }}>Shipping Addresses</h2>
                    <p style={{ color: 'var(--color-gray-text)', margin: 0 }}>Manage your delivery locations for faster checkout.</p>
                  </div>
                  <Button variant="outline" onClick={handleAddAddress} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Plus size={18} /> Add New Address
                  </Button>
                </div>
                
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
                   {profile.addresses.map((addr, idx) => (
                      <div key={idx} className="card" style={{ padding: '0', position: 'relative', border: '1px solid var(--color-gray-border)' }}>
                         <div 
                            onClick={() => toggleAddress(idx)}
                            className="flex justify-between items-center" 
                            style={{ padding: '1.2rem 1.5rem', backgroundColor: 'var(--color-ivory)', cursor: 'pointer', borderBottom: expandedAddresses[idx] ? '1px solid var(--color-gray-border)' : 'none' }}
                          >
                            <div className="flex items-center gap-3">
                              <MapPin size={18} color="var(--color-gold)" />
                              <span style={{ fontWeight: '700', fontSize: '1rem' }}>{addr.label || 'Unnamed Address'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <button onClick={(e) => { e.stopPropagation(); handleRemoveAddress(idx); }} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex' }}>
                                <Trash2 size={16} />
                              </button>
                              {expandedAddresses[idx] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                            </div>
                         </div>

                         {expandedAddresses[idx] && (
                           <div className="animate-slide-down" style={{ padding: '1.5rem' }}>
                             <div className="flex-col gap-4">
                                <div>
                                   <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: '0.4rem' }}>Label</label>
                                   <input className="input-field" value={addr.label} onChange={e => handleUpdateAddress(idx, 'label', e.target.value)} placeholder="e.g. Home, Office" />
                                </div>
                                <div>
                                   <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: '0.4rem' }}>Street Address</label>
                                   <input className="input-field" value={addr.street} onChange={e => handleUpdateAddress(idx, 'street', e.target.value)} />
                                </div>
                                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                   <div>
                                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: '0.4rem' }}>City</label>
                                      <input className="input-field" value={addr.city} onChange={e => handleUpdateAddress(idx, 'city', e.target.value)} />
                                   </div>
                                   <div>
                                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: '0.4rem' }}>PIN</label>
                                      <input className="input-field" value={addr.zip} onChange={e => handleUpdateAddress(idx, 'zip', e.target.value)} />
                                   </div>
                                </div>
                                <div>
                                   <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--color-primary)', marginBottom: '0.4rem' }}>State</label>
                                   <input className="input-field" value={addr.state} onChange={e => handleUpdateAddress(idx, 'state', e.target.value)} />
                                </div>
                             </div>
                           </div>
                         )}
                      </div>
                   ))}
                    {profile.addresses.length === 0 && (
                       <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '6rem 2rem', backgroundColor: 'var(--color-ivory)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--color-gray-border)' }}>
                          <MapPin size={32} color="var(--color-gold)" style={{ marginBottom: '1rem' }} />
                          <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>No addresses saved</h3>
                          <p style={{ color: 'var(--color-gray-text)', fontSize: '0.9rem' }}>Save delivery locations for a faster checkout journey.</p>
                       </div>
                    )}
                </div>
                
                {profile.addresses.length > 0 && (
                   <div style={{ marginTop: '2.5rem', textAlign: 'right' }}>
                      <Button variant="primary" onClick={saveAddresses} disabled={saving} style={{ padding: '0.8rem 2.5rem' }}>
                         {saving ? 'Saving...' : 'Save All Addresses'}
                      </Button>
                   </div>
                )}
             </div>
          )}

          {activeTab === 'settings' && (
             <div className="animate-slide-up">
                 <div style={{ maxWidth: '900px' }}>
                    <div style={{ marginBottom: '2.5rem' }}>
                       <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', margin: '0 0 0.5rem' }}>Account Settings</h2>
                       <p style={{ color: 'var(--color-gray-text)', margin: 0 }}>Update your personal details and divine preferences.</p>
                    </div>
                    
                    <div className="card" style={{ padding: '3rem', border: '1px solid var(--color-gray-border)' }}>
                       <form onSubmit={handleUpdateProfile} className="flex-col gap-8">
                          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                             <div className="flex-col gap-2">
                                <label style={{ fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '1px' }}>Full Name</label>
                                <input required className="input-field" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} style={{ padding: '1rem' }} />
                             </div>
                             <div className="flex-col gap-2">
                                <label style={{ fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '1px' }}>Contact Number</label>
                                <input required className="input-field" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} style={{ padding: '1rem' }} />
                             </div>
                             <div className="flex-col gap-2" style={{ gridColumn: 'span 2' }}>
                                <label style={{ fontWeight: '800', fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '1px' }}>Avatar Source</label>
                                <div className="flex items-center gap-4">
                                  <Button type="button" variant="outline" onClick={handleAvatarClick} style={{ flex: 1, padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <Camera size={18} /> Upload from Device
                                  </Button>
                                  <div style={{ color: 'var(--color-gray-text)', fontSize: '0.8rem' }}>Or use a URL below</div>
                                </div>
                                <input className="input-field" value={profile.avatarUrl?.startsWith('data:image') ? 'Linked from Device' : profile.avatarUrl} onChange={e => setProfile({...profile, avatarUrl: e.target.value})} style={{ padding: '1rem', marginTop: '0.5rem' }} placeholder="External image URL..." />
                             </div>
                          </div>
                          <div style={{ borderTop: '1px solid var(--color-gray-border)', paddingTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
                             <Button type="submit" variant="primary" disabled={saving} style={{ padding: '1rem 3rem', borderRadius: '50px' }}>
                                {saving ? 'Saving...' : 'Save Updates'}
                             </Button>
                          </div>
                       </form>
                    </div>
                 </div>
             </div>
          )}
      </div>
    </div>
  );
}

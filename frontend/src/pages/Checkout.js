import { useState, useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { CartContext } from '../context/CartContext';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productId = searchParams.get('product');

  const { cart, clearCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', address: '' });
  const [savedAddresses, setSavedAddresses] = useState([]);
  
  const [couponCode, setCouponCode] = useState('');
  const [discountInfo, setDiscountInfo] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: '', street: '', city: '', state: '', zip: '' });

  const directQty = Number(searchParams.get('qty')) || 1;
  const isCartCheckout = !productId;
  const items = isCartCheckout ? cart : (product ? [{ ...product, quantity: directQty }] : []);
  const totalAmount = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      if (u) {
        setFormData(prev => ({ ...prev, name: u.displayName || '', email: u.email || '' }));
        fetchSavedAddresses(u.uid);
      }
    });

    if (productId) {
      fetch(`${process.env.REACT_APP_API_BASE_URL}/products/${productId}`)
        .then(res => res.json())
        .then(data => setProduct(data))
        .catch(err => console.error(err));
    }

    return () => unsub();
  }, [productId]);

  const fetchSavedAddresses = async (uid) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/${uid}`);
      if (res.ok) {
        const data = await res.json();
        setSavedAddresses(data.addresses || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectSavedAddress = (addr) => {
    setFormData(prev => ({
      ...prev,
      address: `${addr.label}: ${addr.street}, ${addr.city}, ${addr.zip}`
    }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponError('');
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/offers/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, userId: user?.uid })
      });
      const data = await res.json();
      if (data.valid) {
        if (totalAmount < data.minAmount) {
          setCouponError(`Min order value must be ₹${data.minAmount}`);
          setDiscountInfo(null);
        } else {
          setDiscountInfo(data);
          setCouponError('');
        }
      } else {
        setCouponError(data.error || 'Invalid coupon code');
        setDiscountInfo(null);
      }
    } catch (err) {
      setCouponError('Failed to validate coupon');
    }
  };

  const calculateDiscount = () => {
    if (!discountInfo) return 0;
    if (discountInfo.discountType === 'percent') {
      return Math.floor((totalAmount * discountInfo.discountValue) / 100);
    }
    return discountInfo.discountValue;
  };

  const finalAmount = totalAmount - calculateDiscount();

  const handleSaveNewAddress = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please login to save addresses");
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/${user.uid}/addresses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: newAddress })
      });
      if (res.ok) {
        const data = await res.json();
        setSavedAddresses(data.addresses);
        setShowNewAddressForm(false);
        handleSelectSavedAddress(newAddress);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const discount = calculateDiscount();
      const newOrder = {
        userId: user ? user.uid : null,
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        products: items.map(i => ({ 
          id: i.id, 
          name: i.name, 
          price: i.price, 
          quantity: i.quantity,
          image: i.images?.[0] || i.image 
        })),
        totalAmount: finalAmount,
        originalAmount: totalAmount,
        discountAmount: discount,
        couponCode: discountInfo ? discountInfo.code : null,
        status: 'Pending',
        createdAt: new Date().toISOString()
      };
      
      let orderId = "";
      try {
          const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...newOrder, couponCode: discountInfo ? discountInfo.code : couponCode })
          });
          const data = await res.json();
          
          if (!res.ok) {
            setCouponError(data.error || "Order creation failed.");
            alert(data.error || "Order creation failed. Please check your coupon or details.");
            setLoading(false);
            return; // STOP HERE
          }
          
          orderId = data.id;
      } catch (err) {
          console.error("API error", err);
          alert("Server is currently waking up from a deep sleep (Cold Start). Please wait 10-15 seconds and try once more. Your selection is safe!");
          setLoading(false);
          return;
      }

      // Generate Detailed Message
      const adminWhatsApp = "919533866777";
      let orderText = isCartCheckout 
        ? cart.map((item, i) => `🔸 *${item.name}*\n   Qty: ${item.quantity} | Total: ₹${item.price * item.quantity}`).join('\n\n')
        : `🔸 *${product.name}*\n   Qty: ${directQty} | Total: ₹${product.price * directQty}`;
      
      const message = `✨ *Sri Govinda Collections - Order Request* ✨

----------------------------------------
*CUSTOMER DETAILS:*
👤 Name: ${formData.name}
📞 Phone: ${formData.phone}
📍 Address: ${formData.address}
----------------------------------------

*ITEMS ORDERED:*
${orderText}

----------------------------------------
*BILLING SUMMARY:*
Original Total: ₹${totalAmount}
${discount > 0 ? `Coupon (${discountInfo?.code || couponCode}): -₹${discount}\n` : ''}*Grand Total: ₹${finalAmount}*
----------------------------------------

*Payment Intent:* UPI / GPay
*Tracking & QR:* ${window.location.origin}/track?id=${orderId}

Please visit the tracking link above to scan the UPI QR code and submit your UTR number for instant confirmation. Thank you!`;

      if (isCartCheckout) clearCart();
      const waUrl = `https://wa.me/${adminWhatsApp}?text=${encodeURIComponent(message)}`;
      
      setSuccessMsg(waUrl);
      setOrderSuccess(true);

      // Mobile redirection is safer with location.assign
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.assign(waUrl);
      } else {
        window.open(waUrl, '_blank');
        if (orderId) {
          navigate(`/track?id=${orderId}`);
        } else {
          navigate('/shop');
        }
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="container section-padding text-center animate-fade-in" style={{ maxWidth: '600px', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Order Initialized!</h1>
          <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.2rem', lineHeight: '1.6' }}>
            We've successfully created your order in our registry.
          </p>
        </header>
        <div className="card glass" style={{ padding: '3rem', border: '1px solid var(--color-gold)' }}>
          <p style={{ marginBottom: '2rem', fontWeight: '500' }}>Redirecting to WhatsApp for final confirmation...</p>
          <a href={successMsg} className="btn-primary" style={{ display: 'inline-block', width: '100%', padding: '1.2rem', borderRadius: '50px', textDecoration: 'none', textAlign: 'center' }}>
             Open WhatsApp Manually
          </a>
          <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#888' }}>
            If WhatsApp doesn't open automatically, please click the button above to share your order details with us.
          </p>
        </div>
      </div>
    );
  }

  if (!product && cart.length === 0) return null;

  return (
    <div className="container section-padding animate-fade-in" style={{ maxWidth: '1200px' }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>Secure Checkout</h1>
        <p style={{ color: 'var(--color-gray-text)', fontSize: '1.1rem' }}>Your luxurious selection is just one step away from reaching you.</p>
      </header>
      
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
        
        {/* Order Details Column */}
        <div className="flex-col gap-6">
          <div className="card glass" style={{ padding: '2.5rem' }}>
             <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Order Summmary</h2>
              <div className="flex-col gap-4" style={{ marginBottom: '2rem' }}>
                 {items.map(item => (
                    <div key={item.id} className="flex gap-4 items-center" style={{ paddingBottom: '1.2rem', borderBottom: '1px solid var(--color-gray-border)' }}>
                      <img 
                        src={item.image || (item.images && item.images[0])} 
                        alt={item.name} 
                        style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #eee' }} 
                      />
                      <div style={{ flex: 1 }}>
                         <p style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '4px' }}>{item.name}</p>
                         <div className="flex items-center gap-2">
                           <p style={{ color: 'var(--color-primary)', fontWeight: '700', fontSize: '1rem' }}>₹{item.price}</p>
                           {item.originalPrice > item.price && (
                             <p style={{ color: '#999', fontSize: '0.85rem', textDecoration: 'line-through', opacity: 0.8 }}>₹{item.originalPrice}</p>
                           )}
                           <p style={{ color: '#888', fontSize: '0.85rem' }}>× {item.quantity}</p>
                         </div>
                      </div>
                      <p style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--color-primary)' }}>₹{item.price * item.quantity}</p>
                    </div>
                 ))}
              </div>

             {/* Coupon Section */}
             <div className="flex-col gap-3" style={{ marginBottom: '2rem' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: '700', textTransform: 'uppercase' }}>Apply Exclusive Coupon</label>
                <div className="flex gap-2">
                   <input 
                      disabled={discountInfo}
                      className="input-field" 
                      placeholder="Enter code" 
                      value={couponCode} 
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                   />
                   {discountInfo ? (
                     <Button variant="outline" onClick={() => { setDiscountInfo(null); setCouponCode(''); }}>Remove</Button>
                   ) : (
                     <Button onClick={handleApplyCoupon}>Apply</Button>
                   )}
                </div>
                {couponError && <p style={{ color: 'var(--color-error)', fontSize: '0.85rem' }}>{couponError}</p>}
                {discountInfo && <p style={{ color: 'var(--color-success)', fontSize: '0.85rem', fontWeight: 'bold' }}>✓ Coupon Applied: ₹{calculateDiscount()} saved!</p>}
             </div>

             <div className="flex-col gap-3" style={{ background: 'var(--color-gray-light)', padding: '2rem', borderRadius: '16px' }}>
                <div className="flex justify-between"><span>Subtotal (MRP):</span><span>₹{items.reduce((acc, item) => acc + ((item.originalPrice || item.price) * item.quantity), 0)}</span></div>
                
                {items.reduce((acc, item) => acc + (((item.originalPrice || item.price) - item.price) * item.quantity), 0) > 0 && (
                   <div className="flex justify-between" style={{ color: '#166534', fontWeight: '500' }}>
                      <span>Product Discount:</span><span>-₹{items.reduce((acc, item) => acc + (((item.originalPrice || item.price) - item.price) * item.quantity), 0)}</span>
                   </div>
                )}
                
                {discountInfo && (
                   <div className="flex justify-between" style={{ color: 'var(--color-success)', fontWeight: '500' }}>
                      <span>Coupon Discount:</span><span>-₹{calculateDiscount()}</span>
                   </div>
                )}

                <div className="flex justify-between" style={{ borderTop: '1px solid #ccc', paddingTop: '1rem', marginTop: '0.5rem' }}>
                   <span style={{ fontWeight: '700' }}>Total Savings:</span>
                   <span style={{ color: '#166534', fontWeight: '800' }}>-₹{items.reduce((acc, item) => acc + (((item.originalPrice || item.price) - item.price) * item.quantity), 0) + calculateDiscount()}</span>
                </div>

                <div className="flex justify-between" style={{ fontSize: '1.8rem', fontWeight: '800', marginTop: '0.5rem', color: 'var(--color-primary)' }}>
                   <span>Final Total:</span><span>₹{finalAmount}</span>
                </div>
             </div>
          </div>
        </div>

        {/* Shipping Column */}
        <div className="flex-col gap-6">
           <div className="card glass" style={{ padding: '2.5rem' }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Fulfillment Details</h2>
              
              <form onSubmit={handleSubmit} className="flex-col gap-5">
                <div className="flex-col gap-1">
                  <label style={{ fontWeight: '700', fontSize: '0.9rem' }}>Full Name</label>
                  <input required name="name" value={formData.name} onChange={handleChange} className="input-field" placeholder="Full name" />
                </div>
                
                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="flex-col gap-1">
                    <label style={{ fontWeight: '700', fontSize: '0.9rem' }}>WhatsApp</label>
                    <input required name="phone" value={formData.phone} onChange={handleChange} className="input-field" placeholder="Number" />
                  </div>
                  <div className="flex-col gap-1">
                    <label style={{ fontWeight: '700', fontSize: '0.9rem' }}>Email</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} className="input-field" placeholder="Mail" />
                  </div>
                </div>

                <div className="flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <label style={{ fontWeight: '700', fontSize: '0.9rem' }}>Shipping Address</label>
                    <Button type="button" variant="outline" style={{ padding: '0.3rem 0.8rem', fontSize: '0.75rem' }} onClick={() => setShowNewAddressForm(!showNewAddressForm)}>
                      {showNewAddressForm ? 'Cancel' : 'Add New'}
                    </Button>
                  </div>

                  {showNewAddressForm ? (
                    <div className="flex-col gap-3" style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eee' }}>
                       <input className="input-field" placeholder="Label (e.g. Home)" value={newAddress.label} onChange={e => setNewAddress({...newAddress, label: e.target.value})} />
                       <input className="input-field" placeholder="Street Address" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} />
                       <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                         <input className="input-field" placeholder="City" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                         <input className="input-field" placeholder="Pincode" value={newAddress.zip} onChange={e => setNewAddress({...newAddress, zip: e.target.value})} />
                       </div>
                       <Button type="button" onClick={handleSaveNewAddress} style={{ width: '100%' }}>Save & Select Address</Button>
                    </div>
                  ) : savedAddresses.length > 0 ? (
                    <div className="flex gap-2" style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
                      {savedAddresses.map((addr) => (
                        <div 
                          key={addr.id} 
                          onClick={() => handleSelectSavedAddress(addr)}
                          style={{ 
                            padding: '1rem', borderRadius: '12px', border: `2px solid ${formData.address.includes(addr.street) ? 'var(--color-primary)' : '#eee'}`, cursor: 'pointer', background: formData.address.includes(addr.street) ? 'var(--color-ivory)' : 'white', minWidth: '150px'
                          }}
                        >
                          <p style={{ fontWeight: '800', fontSize: '0.8rem', marginBottom: '4px' }}>{addr.label}</p>
                          <p style={{ fontSize: '0.75rem', color: '#666' }}>{addr.street.substring(0, 20)}...</p>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <textarea required name="address" value={formData.address} onChange={handleChange} className="input-field" rows="3" placeholder="Paste full address here" style={{ resize: 'none' }}></textarea>
                </div>

                <Button type="submit" disabled={loading} style={{ width: '100%', marginTop: '1.5rem', padding: '1.4rem', fontSize: '1.2rem', borderRadius: '50px' }}>
                  {loading ? 'Confirming...' : 'Confirm Order via WhatsApp'}
                </Button>
              </form>
           </div>
        </div>

      </div>
    </div>
  );
}

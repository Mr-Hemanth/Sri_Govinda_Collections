import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../components/ui/Button';
import OrderTimeline from '../components/ui/OrderTimeline';
import { QRCodeCanvas } from 'qrcode.react';
import { Search, Copy, CheckCircle } from 'lucide-react';

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get('id') || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (searchParams.get('id')) {
      performTracking(searchParams.get('id'));
    }
  }, [searchParams]);

  const performTracking = async (id) => {
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/${id.trim()}`);
      if (!res.ok) throw new Error('Order not found.');
      const data = await res.json();
      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = (e) => {
    e.preventDefault();
    if (orderId.trim()) performTracking(orderId);
  };

  return (
    <div className="container section-padding animate-fade-in" style={{ maxWidth: '1000px', minHeight: '60vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1rem', fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>Track Your Order</h1>
        <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.2rem', fontWeight: '400' }}>Enter your Tracking ID to view delivery status.</p>
      </div>

      {/* Tracking Input */}
      <form onSubmit={handleTrack} className="flex gap-4" style={{ marginBottom: '6rem', maxWidth: '700px', margin: '0 auto 6rem', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          value={orderId} 
          onChange={(e) => setOrderId(e.target.value)} 
          placeholder="Enter Order ID..." 
          className="input-field" 
          style={{ flex: '1 1 250px', padding: '0.8rem 1.5rem', borderRadius: '50px' }} 
        />
        <Button type="submit" variant="primary" disabled={loading} style={{ borderRadius: '50px', padding: '0.8rem 2rem', flex: '1 1 150px' }}>
          {loading ? 'Searching...' : <><Search size={16} style={{ marginRight: '0.6rem' }}/> Track Status</>}
        </Button>
      </form>

      {/* Error Message */}
      {error && (
         <div style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: 'var(--radius-md)' }}>
           {error}
         </div>
      )}

      {/* Order Display */}
      {order && (
        <div className="card" style={{ padding: '2rem' }}>
          <div className="flex justify-between items-center" style={{ borderBottom: '1px solid var(--color-gray-light)', paddingBottom: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
               <h2 style={{ fontSize: '1.45rem' }}>Order #{order.id.slice(-8).toUpperCase()}</h2>
               <p style={{ color: 'var(--color-gray-text)', marginTop: '0.25rem', fontSize: '0.9rem' }}>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <span style={{ 
              display: 'inline-block', padding: '0.5rem 1.2rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '0.5px', textTransform: 'uppercase',
              backgroundColor: order.status === 'Pending' ? '#fef3c7' : order.status === 'Confirmed' ? '#e0e7ff' : order.status === 'Delivered' ? '#d1fae5' : '#fef2f2',
              color: order.status === 'Pending' ? '#d97706' : order.status === 'Confirmed' ? '#4338ca' : order.status === 'Delivered' ? '#059669' : '#dc2626' 
            }}>
              {order.status || 'Pending'}
            </span>
          </div>

          <div style={{ overflowX: 'auto', marginBottom: '3rem', paddingBottom: '1rem' }}>
            <div style={{ minWidth: '500px' }}>
              <OrderTimeline status={order.status || 'Pending'} />
            </div>
          </div>

          {(order.status === 'Pending' || order.status === 'Paid') && (
             <div style={{ backgroundColor: 'white', padding: 'clamp(1rem, 5vw, 2.5rem)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-gold)', marginBottom: '3rem', boxShadow: 'var(--shadow-lg)' }}>
                <div className="flex-col items-center text-center" style={{ marginBottom: '2.5rem' }}>
                    <div style={{ 
                      padding: '0.75rem', background: 'white', border: '4px solid var(--color-primary)', borderRadius: '24px', marginBottom: '1.5rem', boxShadow: 'var(--shadow-sm)',
                      display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}>
                       <QRCodeCanvas 
                        value={`upi://pay?pa=9169166667@ybl&pn=SriGovinda&am=${order.totalAmount}&tn=Order_${order.id.slice(-8)}`} 
                        size={200}
                        level={"H"}
                        includeMargin={true}
                       />
                    </div>
                    
                    {/* Copiable UPI ID */}
                    <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                       <p style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: '#888' }}>Pay via UPI ID</p>
                       <div 
                         onClick={() => {
                           navigator.clipboard.writeText('9169166667@ybl');
                           setCopied(true);
                           setTimeout(() => setCopied(false), 2000);
                         }}
                         style={{ 
                           display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1.5rem', 
                           background: '#fff', border: '1px solid var(--color-gold)', borderRadius: '50px', 
                           cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 4px 12px rgba(212, 175, 55, 0.1)'
                         }}
                         className="hover-gold"
                       >
                         <span style={{ fontWeight: '700', fontSize: '1.1rem', color: 'var(--color-primary-dark)' }}>9169166667@ybl</span>
                         {copied ? <CheckCircle size={18} style={{ color: 'var(--color-success)' }} /> : <Copy size={18} style={{ color: 'var(--color-primary)' }} />}
                       </div>
                    </div>

                   <h4 style={{ color: 'var(--color-primary)', fontSize: 'clamp(1.4rem, 4vw, 1.8rem)', fontFamily: 'var(--font-heading)', marginBottom: '0.75rem' }}>Initiate Divine Payment</h4>
                   <p style={{ fontSize: 'clamp(0.95rem, 3vw, 1.1rem)', color: '#666', maxWidth: '600px' }}>
                      Scan this QR with any UPI app (GPay, PhonePe, Paytm) to pay <strong>₹{order.totalAmount}</strong> securely.
                   </p>
                </div>

                <div className="flex-col gap-6" style={{ background: 'var(--color-ivory)', padding: 'clamp(1rem, 4vw, 2rem)', borderRadius: '16px', border: '1px dashed var(--color-gold)' }}>
                   <h5 style={{ fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', color: 'var(--color-primary-dark)' }}>Confirm Your Transaction</h5>
                   
                   <div className="flex-col gap-2">
                      <label style={{ fontSize: '0.85rem', fontWeight: '700' }}>12-Digit UTR Number (Transaction ID)</label>
                      <input 
                        className="input-field" 
                        placeholder="e.g. 123456789012" 
                        value={order.utr || ''}
                        onChange={(e) => setOrder({...order, utr: e.target.value})}
                        style={{ borderRadius: '50px', backgroundColor: 'white' }}
                      />
                   </div>

                   <Button 
                     variant="primary" 
                     style={{ width: '100%', padding: 'clamp(0.8rem, 3vw, 1.2rem)', fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)', borderRadius: '50px' }}
                     disabled={order.status === 'Paid'}
                     onClick={async () => {
                        if (!order.utr || order.utr.length < 8) return alert("Please enter a valid UTR number.");
                        setLoading(true);
                        try {
                           const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/orders/${order.id}/payment`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ 
                                 utr: order.utr,
                                 status: 'Paid'
                              })
                           });
                           if (res.ok) {
                              alert("Payment submitted! Your order is now awaiting Admin approval.");
                              performTracking(order.id);
                           }
                        } catch (err) {
                           alert("Submission failed. Please try again.");
                        }
                        setLoading(false);
                     }}
                   >
                      {order.status === 'Paid' ? 'Payment Submitted (Awaiting Approval)' : 'Submit Verification ID'}
                   </Button>
                   
                   <p style={{ fontSize: '0.85rem', color: '#888', textAlign: 'center' }}>
                      Our admin will verify the UTR number and confirm your order within 2-4 hours.
                   </p>
                </div>
             </div>
          )}

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginTop: '2rem', borderTop: '2px solid var(--color-gray-light)', paddingTop: '1.5rem' }}>
             <div>
                <h3 style={{ marginBottom: '1.25rem' }}>Delivery Details</h3>
                <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{order.customerName}</p>
                <p style={{ color: 'var(--color-gray-text)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{order.address}</p>
                <p style={{ color: 'var(--color-gray-text)', marginTop: '1rem' }}>📞 {order.phone}</p>
             </div>
             
             <div style={{ backgroundColor: 'var(--color-gray-light)', padding: '2rem', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Order Summery</h3>
                <div style={{ borderBottom: '1px solid var(--color-gray-border)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                   {order.products?.map((p, idx) => (
                      <div key={idx} className="flex justify-between" style={{ marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                         <span>{p.quantity}x {p.name}</span>
                         <strong>₹{p.price * p.quantity}</strong>
                      </div>
                   ))}
                </div>
                <div className="flex justify-between text-gold-solid" style={{ fontWeight: 'bold', fontSize: '1.3rem' }}>
                   <span>Total</span>
                   <span>₹{order.totalAmount}</span>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

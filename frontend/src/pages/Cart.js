import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import Button from '../components/ui/Button';
import { Trash2 } from 'lucide-react';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart } = useContext(CartContext);
  
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (cart.length === 0) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center' }}>
        <h2 className="text-accent" style={{ fontFamily: 'var(--font-heading)' }}>Your Cart is Empty</h2>
        <p style={{ marginTop: '1rem', marginBottom: '2.5rem', color: 'var(--color-gray-dark)' }}>Looks like you haven't added anything yet.</p>
        <Link to="/shop"><Button>Continue Shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '1000px', padding: 'var(--section-padding-mobile) 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ 
          fontFamily: 'var(--font-heading)', 
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', 
          color: 'var(--color-primary)',
          marginBottom: '1rem' 
        }}>Your Shopping Bag</h1>
        <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.1rem', fontWeight: '400' }}>Review your selections before proceeding to checkout.</p>
      </div>

      <div className="flex-col" style={{ gap: '1.5rem' }}>
        {cart.map(item => (
          <div key={item.id} className="card flex gap-4 items-start" style={{ padding: 'clamp(0.75rem, 2vw, 1.25rem)', border: '1px solid var(--color-gray-border)' }}>
            <div style={{ width: 'clamp(70px, 15vw, 120px)', height: 'clamp(70px, 15vw, 120px)', flexShrink: 0, borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee' }}>
              <img src={item.images?.[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            
            <div className="flex-col" style={{ flex: 1, gap: '0.25rem', overflow: 'hidden' }}>
              <div className="flex justify-between items-start">
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <h3 style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', fontFamily: 'var(--font-heading)', color: 'var(--color-primary)', marginBottom: '0.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h3>
                  <p style={{ color: 'var(--color-gray-dark)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.category}</p>
                </div>
                <button onClick={() => removeFromCart(item.id)} style={{ background: '#fef2f2', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.6rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }} className="hover-gold" title="Remove item">
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="flex items-center gap-3" style={{ margin: '0.2rem 0' }}>
                <p style={{ fontWeight: '800', fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: 'var(--color-primary)' }}>₹{item.price}</p>
                {(item.originalPrice || item.price) > item.price && (
                  <p style={{ color: '#888', textDecoration: 'line-through', fontSize: '0.85rem', fontWeight: '500' }}>₹{item.originalPrice || item.price}</p>
                )}
              </div>

              <div className="flex justify-between items-center" style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                <div className="flex gap-2 items-center" style={{ backgroundColor: '#f9f9f9', border: '1px solid var(--color-gray-border)', borderRadius: '50px', padding: '0.25rem 0.75rem' }}>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.1rem 0.4rem', fontSize: '1rem', color: 'var(--color-primary)', fontWeight: 'bold' }} onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: '800', fontSize: '0.9rem' }}>{item.quantity}</span>
                  <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.1rem 0.4rem', fontSize: '1rem', color: 'var(--color-primary)', fontWeight: 'bold' }} onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <p style={{ fontWeight: '800', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}>Total: <span style={{ color: 'var(--color-primary)' }}>₹{item.price * item.quantity}</span></p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: '3rem', 
        backgroundColor: 'var(--color-ivory)', 
        padding: 'clamp(1.5rem, 5vw, 3rem)', 
        borderRadius: 'var(--radius-lg)', 
        border: '1px solid var(--color-gold)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div className="max-w-narrow">
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Order Subtotal</h2>
          <p style={{ color: 'var(--color-gray-dark)', fontSize: '1rem', lineHeight: '1.6' }}>Taxes and shipping are calculated at checkout. Proceed to WhatsApp for final confirmation and secure payment.</p>
        </div>
        <div style={{ textAlign: 'right', flex: '1 1 200px' }}>
          <p style={{ fontSize: '1rem', color: 'var(--color-gray-dark)', marginBottom: '0.25rem' }}>Subtotal: <span style={{ textDecoration: 'line-through' }}>₹{cart.reduce((acc, item) => acc + ((item.originalPrice || item.price) * item.quantity), 0)}</span></p>
          {cart.reduce((acc, item) => acc + (((item.originalPrice || item.price) - item.price) * item.quantity), 0) > 0 && (
             <p style={{ color: '#166534', fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.5rem' }}>✓ Total Savings: ₹{cart.reduce((acc, item) => acc + (((item.originalPrice || item.price) - item.price) * item.quantity), 0)}</p>
          )}
          <p style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: '900', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>₹{total}</p>
          <Link to="/checkout" style={{ width: '100%' }}>
            <Button variant="primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem', borderRadius: '50px', letterSpacing: '1px' }}>
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

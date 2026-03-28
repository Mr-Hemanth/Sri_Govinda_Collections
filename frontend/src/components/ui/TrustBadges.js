import { Truck, ShieldCheck, CreditCard } from 'lucide-react';

export default function TrustBadges() {
  return (
    <div className="bg-ivory" style={{ padding: '2.5rem 0' }}>
      <div className="container grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem', textAlign: 'center' }}>
        
        <div className="flex-col items-center gap-4">
          <Truck size={40} style={{ color: 'var(--color-black)' }} />
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Pan India Shipping</h4>
            <p style={{ fontSize: '0.9rem', color: '#333' }}>Fast & reliable delivery anywhere in India</p>
          </div>
        </div>

        <div className="flex-col items-center gap-4">
          <ShieldCheck size={40} style={{ color: 'var(--color-black)' }} />
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Premium Quality</h4>
            <p style={{ fontSize: '0.9rem', color: '#333' }}>Authentic items crafted with precision</p>
          </div>
        </div>

        <div className="flex-col items-center gap-4">
          <CreditCard size={40} style={{ color: 'var(--color-black)' }} />
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>Secure Payments</h4>
            <p style={{ fontSize: '0.9rem', color: '#333' }}>Multiple payment options including UPI</p>
          </div>
        </div>

      </div>
    </div>
  );
}

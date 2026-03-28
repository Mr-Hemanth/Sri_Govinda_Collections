export default function OrderTimeline({ status }) {
  // Map our backend statuses to a visual timeline
  const steps = ['Pending', 'Paid', 'Confirmed', 'Shipped', 'Delivered'];
  
  // Custom mapping if needed, e.g. if order is "Cancelled"
  let currentIndex = steps.indexOf(status);
  
  if (status === 'Cancelled') {
    return <div style={{ color: '#ef4444', fontWeight: 'bold', textAlign: 'center', padding: '1rem', border: '1px solid #ef4444', borderRadius: '8px' }}>Order Cancelled</div>;
  }
  
  if (currentIndex === -1) currentIndex = 0;

  return (
    <div className="flex justify-between items-center" style={{ position: 'relative', margin: '2.5rem 0', width: '100%' }}>
      {/* Background Line */}
      <div style={{ position: 'absolute', top: '35%', left: '10px', right: '10px', height: '3px', backgroundColor: 'var(--color-gray-border)', zIndex: 0, transform: 'translateY(-50%)' }}></div>
      
      {/* Active Line (Accents) */}
      <div style={{ position: 'absolute', top: '35%', left: '10px', width: `calc(${(currentIndex / (steps.length - 1)) * 100}% - 20px)`, height: '3px', backgroundColor: 'var(--color-primary)', zIndex: 1, transform: 'translateY(-50%)', transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
      
      {/* Step Dots */}
      {steps.map((step, index) => {
        const isActive = index <= currentIndex;
        return (
          <div key={step} className="flex-col items-center" style={{ zIndex: 2, background: 'transparent', width: '60px' }}>
            <div style={{ 
              width: '28px', height: '28px', borderRadius: '50%', 
              backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-gray-light)',
              border: isActive ? 'none' : '2px solid var(--color-gray-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: isActive ? 'white' : 'transparent', fontWeight: 'bold',
              transition: 'all 0.4s ease',
              boxShadow: isActive ? '0 0 10px rgba(0, 0, 0, 0.1)' : 'none'
            }}>
              ✓
            </div>
            <span style={{ 
              marginTop: '0.8rem', fontSize: '0.75rem', textAlign: 'center',
              color: isActive ? 'var(--color-black)' : 'var(--color-gray-text)', 
              fontWeight: isActive ? '600' : '400',
              textTransform: 'uppercase', letterSpacing: '0.5px'
            }}>
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}

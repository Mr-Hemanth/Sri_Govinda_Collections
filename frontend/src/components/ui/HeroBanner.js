import { Link } from 'react-router-dom';
import Button from './Button';

export default function HeroBanner() {
  return (
    <div className="hero-banner" style={{ 
      backgroundColor: '#000', 
      backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=1600)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: 'white', 
      position: 'relative', 
      overflow: 'hidden' 
    }}>
      {/* Subtle background effect */}
      <div className="container section-padding" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <h1 className="animate-fade-in text-shadow" style={{ fontStyle: 'italic', marginBottom: '1.5rem', fontWeight: '700', color: 'var(--color-gold-light)' }}>
          Sri Govinda Collections
        </h1>
        <p className="animate-fade-in text-shadow-sm" style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.3rem)', maxWidth: '750px', margin: '0 auto 2.5rem', color: 'rgba(255,255,255,1)', animationDelay: '0.2s', animationFillMode: 'both', fontWeight: '400', letterSpacing: '0.05em', lineHeight: '1.8' }}>
          Tradition You Can Wear, Style You Can Flaunt. Discover our premium collection of German Silver, 1 Gram Gold, and Exquisite Gift Articles.
        </p>
        <div className="flex justify-center" style={{ width: '100%' }}>
          <Link to="/shop" className="animate-fade-in" style={{ display: 'inline-block', animationDelay: '0.4s', animationFillMode: 'both' }}>
            <Button variant="primary" style={{ padding: '1rem 2.5rem' }}>Explore Collection</Button>
          </Link>
        </div>
      </div>
      <style>{`
        .hero-banner::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: radial-gradient(circle at center, rgba(255,255,255,0.05) 0%, transparent 60%);
          z-index: 1;
        }
      `}</style>
    </div>
  );
}

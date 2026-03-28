import { Link } from 'react-router-dom';
import Button from './Button';

export default function HeroBanner() {
  return (
    <div className="hero-banner" style={{ backgroundColor: '#000000', color: 'white', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle background effect */}
      <div className="container section-padding" style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <h1 className="animate-fade-in text-shadow" style={{ fontStyle: 'italic', marginBottom: '1.5rem', fontWeight: '700', color: 'var(--color-gold-light)' }}>
          Divine Elegance
        </h1>
        <p className="animate-fade-in text-shadow-sm" style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.3rem)', maxWidth: '750px', margin: '0 auto 2.5rem', color: 'rgba(255,255,255,1)', animationDelay: '0.2s', animationFillMode: 'both', fontWeight: '400', letterSpacing: '0.05em', lineHeight: '1.8' }}>
          Discover our premium collection of German Silver, 1 Gram Gold, and Exquisite Gift Articles inspired by Lord Venkateswara.
        </p>
        <Link to="/shop" className="animate-fade-in" style={{ display: 'inline-block', animationDelay: '0.4s', animationFillMode: 'both' }}>
          <Button variant="primary" style={{ padding: '1rem 2.5rem' }}>Explore Collection</Button>
        </Link>
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

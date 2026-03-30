import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../apiConfig';
import HeroBanner from '../components/ui/HeroBanner';
import TrustBadges from '../components/ui/TrustBadges';
import ProductCard from '../components/ui/ProductCard';
import Button from '../components/ui/Button';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/products`);
        if (res.ok) {
          const allProducts = await res.json();
          const featured = allProducts.filter(p => p.isFeatured).slice(0, 8);
          setFeaturedProducts(featured.length > 0 ? featured : allProducts.slice(0, 8));
        }
      } catch (e) {
        console.error("Home showcase fetch failed", e);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    { name: '1 Gram Gold', img: 'https://images.unsplash.com/photo-1601121141461-9d6647b0a002?auto=format&fit=crop&q=80&w=600', desc: 'Divine handcrafted pieces inspired by ancient architecture.' },
    { name: 'German Silver', img: 'https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?auto=format&fit=crop&q=80&w=600', desc: 'Antique finish home decor and traditional gifting articles.' },
    { name: 'Panchalohas', img: 'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&q=80&w=600', desc: 'Sacred five-metal alloy idols and jewelry for spiritual aura.' },
    { name: 'Gift Articles', img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600', desc: 'Exquisite idols and souvenirs wrapped in elegance.' }
  ];

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--color-ivory)' }}>
      {/* Hero Section */}
      <HeroBanner />
      
      {/* Trust Badges */}
      <TrustBadges />

      {/* Category Section */}
      <section className="section-padding">
        <div className="container">
          <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'var(--font-title)', color: 'var(--color-primary)', marginBottom: '1rem' }}>Exquisite Collections</h2>
            <div style={{ width: '80px', height: '3px', background: 'var(--color-primary)', margin: '0 auto 1.5rem' }}></div>
            <p style={{ color: 'var(--color-gray-text)', maxWidth: '600px', margin: '0 auto', fontSize: 'var(--font-base)' }}>
              Each piece is a testament to timeless craftsmanship and divine elegance.
            </p>
          </header>
      
          <div className="grid gap-12" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {categories.map(cat => (
              <Link key={cat.name} to={`/shop?category=${encodeURIComponent(cat.name)}`} className="card" style={{ height: '500px', position: 'relative', overflow: 'hidden', padding: 0 }}>
                 <div style={{ height: '100%', overflow: 'hidden' }}>
                   <img src={cat.img} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 1s var(--transition-slow)' }} className="hover-scale" />
                   <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '3rem 2rem', background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 100%)', color: 'white' }}>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-h2)', marginBottom: '1rem', color: 'var(--color-primary)' }}>{cat.name}</h3>
                      <p style={{ fontSize: 'var(--font-sm)', color: 'white', lineHeight: '1.5', opacity: 0.9 }}>{cat.desc}</p>
                   </div>
                 </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding bg-white" style={{ borderTop: '1px solid var(--color-gray-border)', borderBottom: '1px solid var(--color-gray-border)' }}>
        <div className="container">
          <div className="flex justify-between items-center mobile-center-header" style={{ marginBottom: '6rem', flexWrap: 'wrap', gap: '2rem' }}>
            <div>
              <h2 style={{ fontSize: 'var(--font-h1)', color: 'var(--color-primary)' }}>Featured Arrivals</h2>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: 'var(--font-base)', marginTop: '0.5rem' }}>Handpicked masterpieces for your selection.</p>
            </div>
            <Link to="/shop">
              <Button variant="outline" style={{ padding: '1rem 3rem', borderRadius: '50px', fontSize: 'var(--font-sm)' }}>View All Products</Button>
            </Link>
          </div>
          <div className="product-grid">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse" style={{ height: '400px', backgroundColor: '#eee', borderRadius: '12px' }}></div>
              ))
            ) : (
              featuredProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Brand Vision */}
      <section className="bg-black section-padding" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
           <div style={{ backgroundColor: 'rgba(0,0,0,0.8)', padding: 'clamp(3rem, 5vw, 6rem)', borderRadius: 'var(--radius-lg)', display: 'inline-block', border: '1px solid rgba(212, 175, 55, 0.2)', backdropFilter: 'blur(10px)' }}>
             <h2 style={{ fontSize: 'var(--font-display)', color: 'var(--color-primary)', marginBottom: '2rem' }}>The Sri Govinda Vision</h2>
             <p style={{ maxWidth: '750px', margin: '0 auto 4rem', color: 'var(--color-ivory)', fontSize: 'var(--font-lg)', lineHeight: '1.8', opacity: 0.9 }}>
                Established in October 2025, Sri Govinda Collections brings you "Tradition You Can Wear, Style You Can Flaunt." We believe that jewelry is a celebration of divinity and a testament to profound craftsmanship.
             </p>
             <Link to="/shop">
                <Button style={{ padding: '1.4rem 4rem', fontSize: 'var(--font-sm)', letterSpacing: '1px' }}>EXPLORE THE COLLECTIONS</Button>
             </Link>
           </div>
        </div>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.3, backgroundImage: 'url(https://images.unsplash.com/photo-1512418490979-92798cec1380?auto=format&fit=crop&q=80&w=1600)', backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 1 }}></div>
      </section>

      {/* Newsletter Section */}
      <section className="section-padding bg-ivory">
         <div className="container">
            <div className="card glass text-center" style={{ padding: 'clamp(3rem, 5vw, 6rem)', maxWidth: '900px', margin: '0 auto', border: '1px solid var(--color-primary)' }}>
               <h2 style={{ fontSize: 'var(--font-h2)', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Join the Divine Circle</h2>
               <p style={{ color: 'var(--color-gray-dark)', fontSize: 'var(--font-base)', maxWidth: '600px', margin: '0 auto 3.5rem' }}>
                  Subscribe to receive exclusive previews of our latest arrivals and bespoke offers.
               </p>
               
               {subscribed ? (
                 <div className="animate-fade-in" style={{ backgroundColor: 'var(--color-success)', color: 'white', padding: '2.5rem', borderRadius: 'var(--radius-md)', display: 'inline-block' }}>
                    <h3 style={{ fontSize: 'var(--font-h3)', marginBottom: '0.5rem' }}>Welcome to the Circle!</h3>
                    <p style={{ fontSize: 'var(--font-base)', opacity: 0.9 }}>Use code <strong>WELCOME10</strong> for 10% off your next acquire.</p>
                 </div>
               ) : (
                 <form 
                   onSubmit={async (e) => {
                      e.preventDefault();
                      if (!subscribeEmail) return;
                      setSubmitting(true);
                      try {
                        const res = await fetch(`${API_BASE_URL}/subscribe`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email: subscribeEmail })
                        });
                        if (res.ok) setSubscribed(true);
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setSubmitting(false);
                      }
                   }}
                   className="flex gap-4" style={{ flexWrap: 'wrap', justifyContent: 'center' }}
                 >
                    <input 
                      required
                      type="email" 
                      placeholder="Enter your email" 
                      value={subscribeEmail}
                      onChange={(e) => setSubscribeEmail(e.target.value)}
                      className="input-field" 
                      style={{ flex: '1 1 300px', padding: '1.2rem 2rem', borderRadius: '50px' }} 
                    />
                    <Button 
                      type="submit" 
                      disabled={submitting}
                      style={{ padding: '1.2rem 4rem', borderRadius: '50px' }}
                    >
                       {submitting ? 'JOINING...' : 'SUBSCRIBE'}
                    </Button>
                 </form>
               )}
            </div>
         </div>
      </section>

      <style>{`
        .hover-scale:hover { transform: scale(1.05); }
        .page-gap { display: flex; flex-direction: column; gap: 2rem; }
      `}</style>
    </div>
  );
}

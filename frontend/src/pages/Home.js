import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/ui/HeroBanner';
import TrustBadges from '../components/ui/TrustBadges';
import ProductCard from '../components/ui/ProductCard';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/products`);
        if (res.ok) {
          const allProducts = await res.json();
          // Filter products that are featured
          const featured = allProducts.filter(p => p.isFeatured).slice(0, 8);
          // If no products are specifically featured, show the 8 newest products as a fallback
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
    <div className="animate-fade-in page-gap" style={{ backgroundColor: 'var(--color-ivory)' }}>
      {/* Hero Section */}
      <HeroBanner />
      
      {/* Trust Badges */}
      <TrustBadges />

      {/* Category Section */}
      <section className="section-padding">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '8rem' }}>
             <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Shop by Category</h2>
             <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.25rem', fontWeight: '400', opacity: 0.9 }}>Find the perfect piece for every divine occasion.</p>
          </div>
      
          <div className="grid gap-12" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
            {categories.map(cat => (
              <Link key={cat.name} to={`/shop?category=${encodeURIComponent(cat.name)}`} className="card" style={{ height: '600px', position: 'relative', overflow: 'hidden', padding: 0 }}>
                 <div style={{ height: '100%', overflow: 'hidden' }}>
                   <img src={cat.img} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 1s cubic-bezier(0.16, 1, 0.3, 1)' }} className="hover-scale" />
                   <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '5rem 3rem', background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)', color: 'white' }}>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-gold)' }}>{cat.name}</h3>
                       <p style={{ fontSize: '1.15rem', color: 'white', lineHeight: '1.6', fontWeight: '400', opacity: 0.9, textWrap: 'balance' }}>{cat.desc}</p>
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
          <div className="flex justify-between items-end mobile-center-header" style={{ marginBottom: '8rem', flexWrap: 'wrap', gap: '2rem' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: 'var(--color-primary)' }}>Featured Arrivals</h2>
              <p style={{ color: 'var(--color-gray-dark)', fontSize: '1.3rem', marginTop: '0.75rem' }}>Handpicked masterpieces for your curated collection.</p>
            </div>
            <Link to="/shop">
              <Button variant="outline" style={{ padding: '1.4rem 4rem', borderRadius: '50px', fontSize: '1.1rem' }}>View All Products</Button>
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

      {/* Brand Vision / Heritage Section */}
      <section className="bg-black section-padding" style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
           <div className="max-w-standard" style={{ backgroundColor: 'rgba(0,0,0,0.85)', padding: 'clamp(4rem, 10vw, 10rem) clamp(2rem, 5vw, 6rem)', borderRadius: 'var(--radius-lg)', backdropFilter: 'blur(20px)', display: 'inline-block', border: '1px solid rgba(184, 134, 11, 0.3)' }}>
             <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(3rem, 7vw, 5rem)', color: 'var(--color-gold-light)', marginBottom: '3rem', textShadow: '2px 2px 10px rgba(0,0,0,0.5)' }}>The Divine Connection</h2>
             <p className="text-balance" style={{ maxWidth: '850px', margin: '0 auto 6rem', color: 'var(--color-ivory)', fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', lineHeight: '1.8', fontWeight: '300', letterSpacing: '0.02em', opacity: 0.95 }}>
                At Sri Govinda Collections, we believe that jewelry is more than just an ornament—it is a connection to our roots, a celebration of divinity, and a testament to profound craftsmanship. Every piece in our collection is hand-curated to bring the grandeur and spiritual aura of Tirupati to your doorstep.
             </p>
             <Link to="/about">
                <Button style={{ padding: '1.6rem 5rem', backgroundColor: 'var(--color-gold-light)', color: '#000', border: 'none', fontWeight: '800', fontSize: '1.1rem', letterSpacing: '2px', borderRadius: '50px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>DISCOVER OUR HERITAGE</Button>
             </Link>
           </div>
        </div>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.35, backgroundImage: 'url(https://images.unsplash.com/photo-1512418490979-92798cec1380?auto=format&fit=crop&q=80&w=1600)', backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 1 }}></div>
      </section>

      {/* Newsletter Section */}
      <section className="section-padding bg-ivory" style={{ borderTop: '1px solid var(--color-gray-border)' }}>
         <div className="container">
            <div className="card glass text-center" style={{ padding: 'clamp(3rem, 8vw, 6rem)', maxWidth: '900px', margin: '0 auto', border: '1px solid var(--color-gold)', borderRadius: 'var(--radius-xl)' }}>
               <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Join the Divine Circle</h2>
               <p style={{ color: 'var(--color-gray-text)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: '1.7' }}>
                  Subscribe to receive exclusive previews of our latest arrivals, divine stories, and bespoke offers straight to your inbox.
               </p>
               
               {subscribed ? (
                 <div className="animate-fade-in" style={{ backgroundColor: 'var(--color-success)', color: 'white', padding: '2rem', borderRadius: 'var(--radius-md)', display: 'inline-block' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Welcome to the Circle!</h3>
                    <p style={{ fontSize: '1rem', opacity: 0.9 }}>Use code <strong>WELCOME10</strong> for 10% off your next divine acquisition.</p>
                 </div>
               ) : (
                 <form 
                   onSubmit={async (e) => {
                      e.preventDefault();
                      if (!subscribeEmail) return;
                      setSubmitting(true);
                      try {
                        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/subscribe`, {
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
                      placeholder="Enter your email address" 
                      value={subscribeEmail}
                      onChange={(e) => setSubscribeEmail(e.target.value)}
                      className="input-field" 
                      style={{ flex: '1 1 350px', padding: '1.2rem 2rem', borderRadius: '50px', fontSize: '1.1rem' }} 
                    />
                    <Button 
                      type="submit" 
                      disabled={submitting}
                      style={{ padding: '1.2rem 4rem', borderRadius: '50px', fontSize: '1.1rem', backgroundColor: 'var(--color-primary)', color: '#fff', border: 'none' }}
                    >
                       {submitting ? 'JOINING...' : 'SUBSCRIBE'}
                    </Button>
                 </form>
               )}
            </div>
         </div>
      </section>

      <style>{`
        .hover-scale:hover {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}

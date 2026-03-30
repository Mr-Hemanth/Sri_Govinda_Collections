import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../apiConfig';
import HeroBanner from '../components/ui/HeroBanner';
import TrustBadges from '../components/ui/TrustBadges';
import ProductCard from '../components/ui/ProductCard';
import { Sparkles, Waves, Gem, Gift, ChevronLeft, ChevronRight } from 'lucide-react';
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
    { name: '1 Gram Gold', icon: <Sparkles size={40} />, desc: 'Antique finish traditional necklaces and temple jewelry.' },
    { name: 'German Silver', icon: <Waves size={40} />, desc: 'Premium silver urulis, deepams, and traditional home decor.' },
    { name: 'Panchalohas', icon: <Gem size={40} />, desc: 'Exquisite five-metal alloy idols with a sacred aura.' },
    { name: 'Gift Articles', icon: <Gift size={40} />, desc: 'Luxury boxed artifacts and souvenirs for every celebration.' }
  ];

  const scrollCarousel = (direction) => {
    const container = document.getElementById('category-carousel');
    const scrollAmount = 350;
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--color-ivory)' }}>
      {/* Hero Section */}
      <HeroBanner />
      
      {/* Trust Badges */}
      <TrustBadges />

      {/* Category Carousel Section */}
      <section className="section-padding" style={{ overflow: 'hidden' }}>
        <div className="container">
          <header style={{ textAlign: 'center', marginBottom: '4rem', position: 'relative' }}>
            <h2 style={{ fontSize: 'var(--font-title)', color: 'var(--color-primary)', marginBottom: '1rem' }}>Exquisite Collections</h2>
            <div style={{ width: '80px', height: '3px', background: 'var(--color-primary)', margin: '0 auto 1.5rem' }}></div>
            <p style={{ color: 'var(--color-gray-text)', maxWidth: '600px', margin: '0 auto', fontSize: 'var(--font-base)' }}>
              Each piece is a testament to timeless craftsmanship and divine elegance.
            </p>
            
            {/* Carousel Controls */}
            <div className="carousel-controls desktop-nav" style={{ position: 'absolute', right: 0, bottom: 0, display: 'flex', gap: '1rem' }}>
               <button onClick={() => scrollCarousel('left')} className="scroll-btn" style={{ background: 'var(--color-primary)', border: 'none', color: 'white', width: '45px', height: '45px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={24} /></button>
               <button onClick={() => scrollCarousel('right')} className="scroll-btn" style={{ background: 'var(--color-primary)', border: 'none', color: 'white', width: '45px', height: '45px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight size={24} /></button>
            </div>
          </header>
      
          <div id="category-carousel" className="flex gap-8 overflow-x-auto hide-scrollbar" style={{ paddingBottom: '2rem', scrollSnapType: 'x mandatory' }}>
            {categories.map(cat => (
              <Link key={cat.name} to={`/shop?category=${encodeURIComponent(cat.name)}`} className="category-card-premium" style={{ flex: '0 0 320px', scrollSnapAlign: 'start' }}>
                 <div className="inner-card flex-col items-center text-center p-12" style={{ 
                    height: '400px', 
                    background: 'linear-gradient(135deg, var(--color-white) 0%, var(--color-ivory) 100%)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    borderRadius: 'var(--radius-lg)',
                    justifyContent: 'center',
                    transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                 }}>
                    {/* Royal Accents */}
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', background: 'var(--color-gold)', opacity: 0.1, borderRadius: '50%' }}></div>
                    <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', width: '60px', height: '60px', background: 'var(--color-gold)', opacity: 0.1, borderRadius: '50%' }}></div>

                    <div style={{ color: 'var(--color-primary)', marginBottom: '2.5rem', background: 'var(--color-ivory)', padding: '1.5rem', borderRadius: '50%', border: '1px solid var(--color-gold)' }}>
                       {cat.icon}
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', color: 'var(--color-primary)', marginBottom: '1.5rem', letterSpacing: '1px' }}>{cat.name}</h3>
                    <p style={{ fontSize: '0.95rem', color: 'var(--color-gray-dark)', lineHeight: '1.6', maxWidth: '240px' }}>{cat.desc}</p>
                    
                    <div className="view-link" style={{ marginTop: '2.5rem', color: 'var(--color-primary)', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '2px', textTransform: 'uppercase', borderBottom: '2px solid transparent', transition: 'border 0.3s' }}>
                       Explore Now
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
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))
            ) : (
                <div className="flex-col items-center text-center" style={{ gridColumn: '1 / -1', padding: '4rem 0', gap: '2rem' }}>
                    <div style={{ 
                        width: '100%', 
                        maxWidth: '800px', 
                        height: '400px', 
                        backgroundImage: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(https://images.unsplash.com/photo-1512213063672-d4ff2ff841e2?auto=format&fit=crop&q=80&w=1200)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-lg)'
                    }}>
                        <div style={{ color: 'white', padding: '2rem' }}>
                            <h3 style={{ fontSize: '2rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Curating Masterpieces</h3>
                            <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Our artisans are crafting new arrivals. Stay tuned for the latest in 1 Gram Gold & German Silver.</p>
                        </div>
                    </div>
                </div>
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
         <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.25, backgroundImage: 'url(https://images.unsplash.com/photo-1512418490979-92798cec1380?auto=format&fit=crop&q=80&w=1600)', backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 1 }}></div>
      </section>

      {/* Newsletter Section */}
      <section className="section-padding bg-ivory" style={{ 
        position: 'relative', 
        backgroundImage: 'linear-gradient(rgba(253, 252, 248, 0.9), rgba(253, 252, 248, 0.9)), url(https://images.unsplash.com/photo-1512418490979-92798cec1380?auto=format&fit=crop&q=80&w=1600)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
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

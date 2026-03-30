import React from 'react';
import { Award, ShieldCheck, Truck, Sparkles, Sprout } from 'lucide-react';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="animate-fade-in page-gap" style={{ backgroundColor: 'var(--color-ivory)' }}>
      {/* Hero Section */}
      <section className="section-padding" style={{ 
        position: 'relative', minHeight: '80vh', display: 'flex', alignItems: 'center', 
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=1600)', 
        backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', textAlign: 'center'
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="max-w-standard" style={{ backgroundColor: 'rgba(0,0,0,0.8)', padding: 'clamp(4rem, 8vw, 8rem) clamp(2rem, 5vw, 5rem)', borderRadius: 'var(--radius-lg)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(3.5rem, 10vw, 6.5rem)', marginBottom: '2.5rem', color: 'var(--color-gold-light)', letterSpacing: '-0.04em' }}>Our Heritage</h1>
            <p className="text-balance" style={{ margin: '0 auto', fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', letterSpacing: '0.05em', lineHeight: '1.8', color: 'white', fontWeight: '300', maxWidth: '800px' }}>
              Established in October 2025, Sri Govinda Collections is a sanctuary for those who seek the divine intersection of tradition and luxury.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section-padding">
        <div className="container grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'clamp(4rem, 8vw, 8rem)', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
             <img src="https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&q=80&w=800" alt="Philosophy" style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }} />
             <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '200px', height: '200px', border: '8px solid var(--color-gold)', zIndex: -1, borderRadius: 'var(--radius-md)' }}></div>
          </div>
          <div className="flex-col gap-8">
            <span style={{ textTransform: 'uppercase', letterSpacing: '4px', color: 'var(--color-gold)', fontWeight: '800', fontSize: '0.85rem' }}>The Sri Govinda Philosophy</span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: '1.1' }}>Artistry Born of <br/><span style={{ fontStyle: 'italic', fontWeight: '400' }}>Devotion</span></h2>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.9', color: 'var(--color-gray-dark)' }}>
              In the heart of Amalapuram, we curate pieces that are not merely ornaments but embodiments of spiritual grace. Our collections capture the timeless luster of tradition while ensuring you have the style to flaunt on every occasion.
            </p>
            <p style={{ fontSize: '1.3rem', lineHeight: '1.8', fontWeight: '500', paddingLeft: '2rem', borderLeft: '4px solid var(--color-gold)', color: 'var(--color-primary)' }}>
              "Tradition You Can Wear, Style You Can Flaunt."
            </p>
            <div style={{ marginTop: '1rem' }}>
               <Link to="/shop"><Button variant="primary" style={{ padding: '1.4rem 4rem', fontSize: '1.1rem', borderRadius: '50px' }}>Explore Our Collections</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values Banner */}
      <section className="bg-black section-padding" style={{ color: 'white' }}>
        <div className="container">
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(3rem, 6vw, 6rem)', textAlign: 'center' }}>
            {[
              { icon: <Sparkles size={48} />, label: "Exquisite Quality", desc: "Triple-layer electroplating for lasting brilliance." },
              { icon: <ShieldCheck size={48} />, label: "Pure Trust", desc: "Serving families with devotion across India." },
              { icon: <Award size={48} />, label: "Handpicked Art", desc: "Curated from India's finest artisanal hubs." },
              { icon: <Truck size={48} />, label: "Secure Shipping", desc: "Fast delivery via DTDC with priority tracking." }
            ].map((item, idx) => (
              <div key={idx} className="flex-col items-center gap-6">
                <div style={{ color: 'var(--color-gold-light)' }}>{item.icon}</div>
                <h3 style={{ fontSize: '1.6rem', marginBottom: '0.5rem', letterSpacing: '2px', fontFamily: 'var(--font-heading)', color: 'white' }}>{item.label}</h3>
                <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem', fontWeight: '400', lineHeight: '1.6', maxWidth: '300px' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainable Vision */}
      <section className="section-padding">
          <div className="max-w-narrow text-center">
            <Sprout size={64} color="var(--color-gold)" style={{ marginBottom: '3rem' }} />
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '2.5rem' }}>A Vision for Tomorrow</h2>
            <p style={{ fontSize: '1.25rem', lineHeight: '1.9', color: 'var(--color-gray-dark)', marginBottom: '6rem' }}>
              Our commitment goes beyond aesthetics. We strive to preserve the dying arts of temple jewelry making and provide sustainable livelihoods to local artisans. When you choose Sri Govinda, you choose quality and tradition.
            </p>
            <div className="flex justify-center gap-12" style={{ flexWrap: 'wrap' }}>
               <div style={{ padding: '3rem 2rem', border: '1px solid var(--color-gray-border)', backgroundColor: 'var(--color-white)', flex: '1 1 200px', borderRadius: 'var(--radius-lg)' }}>
                  <h4 style={{ margin: 0, fontSize: '3rem', color: 'var(--color-primary)' }}>Quality</h4>
                  <p style={{ margin: '0.75rem 0 0', fontSize: '0.85rem', color: 'var(--color-gray-dark)', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: '800' }}>Guaranteed</p>
               </div>
               <div style={{ padding: '3rem 2rem', border: '1px solid var(--color-gray-border)', backgroundColor: 'var(--color-white)', flex: '1 1 200px', borderRadius: 'var(--radius-lg)' }}>
                  <h4 style={{ margin: 0, fontSize: '3rem', color: 'var(--color-primary)' }}>Est.</h4>
                  <p style={{ margin: '0.75rem 0 0', fontSize: '0.85rem', color: 'var(--color-gray-dark)', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: '800' }}>October 2025</p>
               </div>
               <div style={{ padding: '3rem 2rem', border: '1px solid var(--color-gray-border)', backgroundColor: 'var(--color-white)', flex: '1 1 200px', borderRadius: 'var(--radius-lg)' }}>
                  <h4 style={{ margin: 0, fontSize: '3rem', color: 'var(--color-primary)' }}>Pan-India</h4>
                  <p style={{ margin: '0.75rem 0 0', fontSize: '0.85rem', color: 'var(--color-gray-dark)', textTransform: 'uppercase', letterSpacing: '3px', fontWeight: '800' }}>Shipping</p>
               </div>
            </div>
          </div>
      </section>

      {/* Contact Prompt */}
      <section className="section-padding" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', marginBottom: '2.5rem', color: 'white', fontFamily: 'var(--font-heading)' }}>Connect With Us</h2>
          <p className="text-balance" style={{ maxWidth: '700px', margin: '0 auto 5rem', fontSize: '1.4rem', color: 'rgba(255,255,255,0.9)', fontWeight: '300', lineHeight: '1.6' }}>Whether you're looking for a bridal set or a divine gift for your loved ones, our team is here to guide you.</p>
          <Link to="/contact">
            <Button style={{ padding: '1.5rem 6.5rem', borderRadius: '50px', backgroundColor: 'white', color: 'black', border: 'none', fontWeight: '800', fontSize: '1.2rem', letterSpacing: '2px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>INQUIRE NOW</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { ShieldCheck, Truck, Sparkles, Heart } from 'lucide-react';

export default function Landing() {
  return (
    <div className="animate-fade-in" style={{ backgroundColor: 'var(--color-ivory)', overflowX: 'hidden' }}>
      
      {/* Hero Section */}
      <section style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        textAlign: 'center',
        padding: '0 2rem',
        position: 'relative',
      }}>
        <div style={{ 
          position: 'absolute', top: '15%', right: '-5%', width: '35vw', height: '35vw', 
          backgroundColor: 'rgba(184, 134, 11, 0.04)', borderRadius: '50%', filter: 'blur(80px)', zIndex: 0
        }}></div>
        <div style={{ 
          position: 'absolute', bottom: '10%', left: '-10%', width: '40vw', height: '40vw', 
          backgroundColor: 'rgba(212, 175, 55, 0.03)', borderRadius: '50%', filter: 'blur(100px)', zIndex: 0
        }}></div>

        <div className="max-w-narrow flex-col items-center" style={{ zIndex: 1, gap: '2.5rem' }}>
          <div className="animate-float mobile-hide-logo" style={{ marginBottom: '1rem' }}>
             <img src="/logo.png" alt="Logo" style={{ width: '140px', height: '140px', borderRadius: '50%', border: '4px solid var(--color-gold)', boxShadow: 'var(--shadow-lg)' }} />
          </div>

          <div>
            <h1 style={{ 
              fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 10vw, 5rem)', color: 'var(--color-primary)',
              lineHeight: '1.1', letterSpacing: '-0.02em', marginBottom: '1rem'
            }}>
              Sri Govinda<br />
              <span style={{ fontStyle: 'italic', fontWeight: '400', opacity: 0.85 }}>Collections</span>
            </h1>
            
            <p className="text-balance" style={{ 
              fontSize: 'clamp(1rem, 2.2vw, 1.25rem)', color: 'var(--color-gray-dark)', 
              fontWeight: '500', letterSpacing: '0.04em', lineHeight: '1.5', maxWidth: '700px', margin: '0 auto 2.5rem'
            }}>
              Where Divine Craftsmanship Meets Timeless Elegance. <br className="desktop-nav" /> 
              Curating the finest German Silver and 1 Gram Gold for the Discerning.
            </p>
          </div>
          
          <div className="flex gap-6 justify-center" style={{ width: '100%', flexWrap: 'wrap' }}>
            <Link to="/home" style={{ flex: '1 1 280px', maxWidth: '300px' }}>
              <Button variant="primary" style={{ width: '100%', padding: '1.6rem 0', fontSize: '1.1rem', borderRadius: '50px', letterSpacing: '2px', fontWeight: '800' }}>
                ENTER BOUTIQUE
              </Button>
            </Link>
            <Link to="/login" style={{ flex: '1 1 280px', maxWidth: '300px' }}>
              <Button variant="outline" style={{ width: '100%', padding: '1.6rem 0', fontSize: '1.1rem', borderRadius: '50px', letterSpacing: '2px', fontWeight: '800' }}>
                MEMBER PORTAL
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy / Features Section */}
      <section className="section-padding bg-white" style={{ position: 'relative', zIndex: 2 }}>
        <div className="container">
           <div style={{ textAlign: 'center', marginBottom: '10rem' }}>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', color: 'var(--color-primary)', marginBottom: '1.5rem' }}>Our Royal Pillars</h2>
              <div style={{ width: '60px', height: '3px', backgroundColor: 'var(--color-gold)', margin: '0 auto' }}></div>
           </div>

           <div className="grid gap-12" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              <div className="flex-col items-center text-center gap-4 p-8 card-hover-simple">
                 <div style={{ padding: '1.5rem', background: 'var(--color-ivory)', borderRadius: '50%', color: 'var(--color-primary)' }}><Sparkles size={32} /></div>
                 <h3 style={{ fontSize: '1.4rem' }}>Exquisite Detail</h3>
                 <p style={{ color: '#666' }}>Every piece is handpicked for its spiritual essence and intricate design precision.</p>
              </div>
              <div className="flex-col items-center text-center gap-4 p-8 card-hover-simple">
                 <div style={{ padding: '1.5rem', background: 'var(--color-ivory)', borderRadius: '50%', color: 'var(--color-primary)' }}><ShieldCheck size={32} /></div>
                 <h3 style={{ fontSize: '1.4rem' }}>Divine Quality</h3>
                 <p style={{ color: '#666' }}>Certified German Silver and premium 1-Gram Gold plating that lasts generations.</p>
              </div>
              <div className="flex-col items-center text-center gap-4 p-8 card-hover-simple">
                 <div style={{ padding: '1.5rem', background: 'var(--color-ivory)', borderRadius: '50%', color: 'var(--color-primary)' }}><Truck size={32} /></div>
                 <h3 style={{ fontSize: '1.4rem' }}>Swift Connection</h3>
                 <p style={{ color: '#666' }}>Secure packaging and express delivery from the heart of Andhra to your home.</p>
              </div>
              <div className="flex-col items-center text-center gap-4 p-8 card-hover-simple">
                 <div style={{ padding: '1.5rem', background: 'var(--color-ivory)', borderRadius: '50%', color: 'var(--color-primary)' }}><Heart size={32} /></div>
                 <h3 style={{ fontSize: '1.4rem' }}>Heartfelt Service</h3>
                 <p style={{ color: '#666' }}>Personalized WhatsApp support to help you choose the perfect divine artifact.</p>
              </div>
           </div>
        </div>
      </section>

      {/* Decorative Border Section */}
      <div style={{ 
         height: '300px', 
         backgroundImage: 'url(https://images.unsplash.com/photo-1512418490979-92798cec1380?auto=format&fit=crop&q=80&w=1600)',
         backgroundAttachment: 'fixed',
         backgroundPosition: 'center',
         backgroundSize: 'cover',
         position: 'relative'
      }}>
         <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', backdropFilter: 'grayscale(100%)' }}></div>
      </div>

      <style>{`
        .animate-float {
           animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
           0% { transform: translateY(0px); }
           50% { transform: translateY(-20px); }
           100% { transform: translateY(0px); }
        }
        .card-hover-simple {
           transition: all 0.3s ease;
           border-radius: var(--radius-lg);
        }
        .card-hover-simple:hover {
           transform: translateY(-10px);
           background: var(--color-ivory);
           box-shadow: var(--shadow-md);
        }
      `}</style>
    </div>
  );
}

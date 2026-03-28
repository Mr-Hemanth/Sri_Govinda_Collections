import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, ShieldCheck, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer bg-black text-white" style={{ paddingTop: '6rem', paddingBottom: '3rem', marginTop: '6rem', borderTop: '2px solid var(--color-primary)' }}>
      <div className="container">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '4rem', marginBottom: '5rem' }}>
          
          {/* Brand & Mission */}
          <div className="flex-col gap-6">
            <Link to="/" style={{ display: 'inline-block' }}>
               <img src="/logo.png" alt="Sri Govinda Collections" style={{ height: '90px', width: '90px', borderRadius: '50%', border: '2.5px solid var(--color-gold)', objectFit: 'cover' }} />
            </Link>
            <p style={{ fontSize: '1.05rem', color: '#ccc', lineHeight: '1.8', maxWidth: '350px' }}>
              Crafting Divine Legacies since 2014. Premium German Silver, 1 Gram Gold, and Panchalohas from the heart of Andhra Pradesh.
            </p>
            <div className="flex gap-4">
               <a href="#" className="social-icon-btn"><Instagram size={20} /></a>
               <a href="#" className="social-icon-btn"><Facebook size={20} /></a>
               <a href="#" className="social-icon-btn"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Boutique Navigation */}
          <div className="flex-col">
            <h3 style={{ marginBottom: '2rem', fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--color-primary)' }}>Boutique Overview</h3>
            <div className="flex-col gap-4" style={{ fontSize: '0.95rem' }}>
              <Link to="/home" className="footer-link">Sri Govinda Home</Link>
              <Link to="/shop" className="footer-link">Full Catalogue</Link>
              <Link to="/offers" className="footer-link">Divine Offers</Link>
              <Link to="/about" className="footer-link">Our Heritage Story</Link>
              <Link to="/contact" className="footer-link">Support & Inquiries</Link>
            </div>
          </div>

          {/* Contact & Location */}
          <div className="flex-col">
            <h3 style={{ marginBottom: '2rem', fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '3px', color: 'var(--color-primary)' }}>Direct Connection</h3>
            <div className="flex-col gap-5" style={{ fontSize: '0.95rem', color: '#ccc' }}>
              <div className="flex items-start gap-4">
                 <MapPin size={20} color="var(--color-primary)" />
                 <p>Amalapuram, East Godavari, <br/>Andhra Pradesh, 533201</p>
              </div>
              <div className="flex items-start gap-4">
                 <Phone size={20} color="var(--color-primary)" />
                 <p>+91 9533866777</p>
              </div>
              <div className="flex items-start gap-4">
                 <Mail size={20} color="var(--color-primary)" />
                 <p>boutique@srigovinda.com</p>
              </div>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="flex-col gap-6" style={{ background: 'rgba(255,255,255,0.03)', padding: '2.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
             <div className="flex items-center gap-3" style={{ color: 'var(--color-primary)' }}>
                <ShieldCheck size={32} />
                <span style={{ fontWeight: '800', letterSpacing: '1px' }}>CERTIFIED ROYALTY</span>
             </div>
             <p style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: '1.6' }}>Every artifact is curated under strict quality standards to ensure divine purity and lasting elegance.</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2.5rem', marginTop: '2.5rem', textAlign: 'center' }}>
          <p style={{ color: '#666', fontSize: '0.85rem', letterSpacing: '1px' }}>
            &copy; {new Date().getFullYear()} SRI GOVINDA COLLECTIONS • AMALAPURAM • HANDCRAFTED IN INDIA
          </p>
        </div>
      </div>

      <style>{`
        .footer-link {
           color: #ccc;
           transition: var(--transition-fast);
           opacity: 0.85;
        }
        .footer-link:hover {
           color: var(--color-primary);
           opacity: 1;
           padding-left: 5px;
        }
        .social-icon-btn {
           color: white;
           background: rgba(255,255,255,0.05);
           width: 40px;
           height: 40px;
           display: flex;
           align-items: center;
           justify-content: center;
           border-radius: 50%;
           transition: var(--transition-fast);
        }
        .social-icon-btn:hover {
           background: var(--color-primary);
           color: black;
           transform: translateY(-3px);
        }
      `}</style>
    </footer>
  );
}

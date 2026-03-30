import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, ShieldCheck, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer bg-black text-white" style={{ paddingTop: '3.5rem', paddingBottom: '2rem', marginTop: '4rem', borderTop: '2px solid var(--color-primary)' }}>
      <div className="container">
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          
          {/* Brand & Mission */}
          <div className="flex-col gap-4">
            <Link to="/" style={{ display: 'inline-block' }}>
               <img src="/logo.png" alt="Sri Govinda Collections" style={{ height: '70px', width: '70px', borderRadius: '50%', border: '2px solid var(--color-gold)', objectFit: 'cover' }} />
            </Link>
            <p style={{ fontSize: '0.95rem', color: '#ccc', lineHeight: '1.7', maxWidth: '350px' }}>
              Tradition You Can Wear, Style You Can Flaunt. Curating premium jewelry and divine artifacts since October 2025.
            </p>
            <div className="flex gap-4">
               <a href="https://www.instagram.com/srigovindacollections?igsh=MXE4dDhoMWIzMGN1dQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="social-icon-btn"><Instagram size={20} /></a>
               <a href="#" className="social-icon-btn"><Facebook size={20} /></a>
               <a href="#" className="social-icon-btn"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Boutique Navigation */}
          <div className="flex-col">
            <h3 style={{ marginBottom: '1.25rem', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-primary)' }}>Boutique Overview</h3>
            <div className="flex-col gap-3" style={{ fontSize: '0.9rem' }}>
              <Link to="/home" className="footer-link">Sri Govinda Home</Link>
              <Link to="/shop" className="footer-link">Full Catalogue</Link>
              <Link to="/offers" className="footer-link">Divine Offers</Link>
              <Link to="/about" className="footer-link">Our Heritage Story</Link>
              <Link to="/contact" className="footer-link">Support & Inquiries</Link>
            </div>
          </div>

          {/* Contact & Location */}
          <div className="flex-col">
            <h3 style={{ marginBottom: '1.25rem', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--color-primary)' }}>Direct Connection</h3>
            <div className="flex-col gap-4" style={{ fontSize: '0.9rem', color: '#ccc' }}>
              <div className="flex items-start gap-4">
                 <MapPin size={20} color="var(--color-primary)" />
                 <p>Amalapuram, East Godavari, <br/>near Subbaalamma temple, 533201</p>
              </div>
              <div className="flex items-start gap-4">
                 <Phone size={20} color="var(--color-primary)" />
                 <p>+91 9533866777</p>
              </div>
              <div className="flex items-start gap-4">
                 <Mail size={20} color="var(--color-primary)" />
                 <p>sri.jewellery9999@gmail.com</p>
              </div>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="flex-col gap-4" style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
             <div className="flex items-center gap-3" style={{ color: 'var(--color-primary)' }}>
                <ShieldCheck size={28} />
                <span style={{ fontWeight: '800', letterSpacing: '1px', fontSize: '0.85rem' }}>CERTIFIED ROYALTY</span>
             </div>
             <p style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: '1.6' }}>Every artifact is curated under strict quality standards to ensure divine purity and lasting elegance.</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: '#666', fontSize: '0.8rem', letterSpacing: '1px' }}>
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

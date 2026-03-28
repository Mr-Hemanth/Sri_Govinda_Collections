import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, User, Search, LogOut, Heart, X, ArrowLeft } from 'lucide-react';
import { auth } from '../../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useLocation } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const isAdmin = user?.email === process.env.REACT_APP_ADMIN_EMAIL;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => { 
      if (unsub) unsub(); 
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const badgeStyle = { 
    position: 'absolute', top: '-8px', right: '-8px', background: 'var(--color-primary)', 
    color: 'white', fontSize: '0.65rem', width: '16px', height: '16px', borderRadius: '50%', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
  };

  return (
    <>
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`} style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1000,
      transition: 'var(--transition-standard)',
      backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
      backdropFilter: isScrolled ? 'blur(16px)' : 'none',
      borderBottom: isScrolled ? '1px solid var(--color-gray-border)' : '1px solid transparent',
      padding: isScrolled ? '0.5rem 0' : '1rem 0'
    }}>
      <div className="container navbar-container">
        
        {/* Left: Logo & Mobile Back Arrow */}
        <div className="navbar-left">
          {location.pathname !== '/' && location.pathname !== '/home' && (
            <button 
              onClick={() => navigate(-1)} 
              className="mobile-back-btn" 
              style={{ background: 'none', border: 'none', color: 'var(--color-primary)', display: 'none', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', marginLeft: '-0.5rem', marginRight: '0.5rem', cursor: 'pointer' }}
            >
              <ArrowLeft size={24} />
            </button>
          )}
          <Link to="/" className="navbar-logo">
            <img src="/logo.png" alt="Sri Govinda Collections" style={{ height: isScrolled ? '40px' : '55px', width: isScrolled ? '40px' : '55px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-gold)', transition: 'var(--transition-standard)' }} />
          </Link>
        </div>
        
        {/* Center: Desktop Nav */}
        <nav className="desktop-nav">
          <Link to="/home" className="nav-link">Store</Link>
          <Link to="/shop" className="nav-link">Catalogue</Link>
          <Link to="/offers" className="nav-link">Offers</Link>
          {user && <Link to="/orders" className="nav-link">My Orders</Link>}
          {!isAdmin && <Link to="/about" className="nav-link">About</Link>}
          {!isAdmin && <Link to="/contact" className="nav-link">Contact</Link>}
        </nav>

        {/* Right: Icons & Member Actions */}
        <div className="navbar-right">
          <Link to="/shop" style={{ color: 'var(--color-primary)' }} className="icon-link desktop-nav" title="Search">
            <Search size={20} strokeWidth={1.5} />
          </Link>

          {user ? (
            <>
              <Link to="/wishlist" style={{ color: 'var(--color-primary)', position: 'relative' }} className="icon-link" title="Wishlist">
                <Heart size={20} strokeWidth={1.5} />
                {wishlist.length > 0 && <span style={{ ...badgeStyle }}>{wishlist.length}</span>}
              </Link>

              <Link to="/cart" style={{ color: 'var(--color-primary)', position: 'relative' }} className="icon-link" title="Shopping Cart">
                <ShoppingBag size={20} strokeWidth={1.5} />
                {cart.reduce((sum, i) => sum + i.quantity, 0) > 0 && <span style={{ ...badgeStyle }}>{cart.reduce((sum, i) => sum + i.quantity, 0)}</span>}
              </Link>
              
              <Link to={user.email === process.env.REACT_APP_ADMIN_EMAIL ? "/admin" : "/profile"} style={{ color: 'var(--color-primary)' }} className="icon-link" title="My Account">
                <User size={20} strokeWidth={1.5} />
              </Link>

              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer' }} className="icon-link desktop-nav" title="Logout">
                <LogOut size={20} strokeWidth={1.5} />
              </button>
            </>
          ) : (
            <>
              <div className="desktop-auth" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link to="/login" className="nav-link" style={{ fontSize: '0.85rem', fontWeight: '600', letterSpacing: '1px' }}>
                  LOGIN
                </Link>
                <Link to="/signup" className="btn-primary" style={{ padding: '0.6rem 1.8rem', fontSize: '0.8rem', borderRadius: '50px' }}>
                  SIGN UP
                </Link>
              </div>
              <Link to="/login" className="icon-link mobile-only" title="Login">
                <User size={20} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
              </Link>
            </>
          )}
          
          <button 
            onClick={() => setMobileMenuOpen(true)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--color-primary)', 
              cursor: 'pointer',
              marginLeft: 'auto' /* Force to extreme right */
            }} 
            className="mobile-menu-btn"
          >
             <Menu size={28} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </header>

    {/* Mobile Menu Drawer */}
    <div style={{
      position: 'fixed',
      top: 0,
      right: mobileMenuOpen ? 0 : '-100%',
      width: '100%',
      maxWidth: '350px',
      height: '100vh',
      background: 'var(--color-white)',
      zIndex: 2000,
      transition: 'right 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      padding: '3rem 2rem',
      boxShadow: '-10px 0 50px rgba(0,0,0,0.15)',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    }}>
      <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
        <img src="/logo.png" alt="Logo" style={{ height: '40px' }} />
        <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer' }}><X size={28} /></button>
      </div>
      
      <div className="flex-col gap-6">
        <Link to="/home" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Store Home</Link>
        <Link to="/shop" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Catalogue</Link>
        <Link to="/offers" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Offers</Link>
        {user && <Link to="/orders" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>}
        {!isAdmin && <Link to="/about" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Our Heritage</Link>}
        {!isAdmin && <Link to="/contact" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>Contact Us</Link>}
      </div>
      
      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--color-gray-border)', paddingTop: '2rem' }}>
        {user ? (
          <div className="flex-col gap-4">
             <Link to="/profile" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
                <User size={20} /> <span style={{ fontWeight: '600' }}>My Account</span>
             </Link>
             <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="flex items-center gap-3" style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                <LogOut size={20} /> <span style={{ fontWeight: '600' }}>Sign Out</span>
             </button>
          </div>
        ) : (
          <div className="flex-col gap-3">
            <Link to="/login" className="btn-outline" style={{ textAlign: 'center', width: '100%' }} onClick={() => setMobileMenuOpen(false)}>LOGIN</Link>
            <Link to="/signup" className="btn-primary" style={{ textAlign: 'center', width: '100%' }} onClick={() => setMobileMenuOpen(false)}>SIGN UP</Link>
          </div>
        )}
      </div>
    </div>

    {/* Mobile Overlay */}
    {mobileMenuOpen && (
      <div 
        onClick={() => setMobileMenuOpen(false)}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(8px)',
          zIndex: 1999,
          transition: 'all 0.5s ease'
        }}
      />
    )}

    <style>{`
      .nav-link {
        color: var(--color-primary);
        font-weight: 600;
        font-size: 0.8rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        position: relative;
        transition: var(--transition-fast);
      }
      .nav-link::after {
        content: '';
        position: absolute;
        width: 0;
        height: 1px;
        bottom: -4px;
        left: 0;
        background-color: var(--color-primary);
        transition: width 0.3s ease;
      }
      .nav-link:hover::after {
        width: 100%;
      }
      .icon-link:hover {
        transform: translateY(-3px);
      }
      .mobile-nav-link {
        color: var(--color-primary);
        font-size: 1.5rem;
        font-family: var(--font-heading);
        font-weight: 400;
        letter-spacing: 0.02em;
      }
      .navbar-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100%;
        padding: 0 1rem; /* Tighter padding for mobile */
      }
      .navbar-left {
        display: flex;
        align-items: center;
      }
      .navbar-right {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-left: auto; /* Push group to right */
      }
      .desktop-nav, .desktop-auth { display: none !important; }
      .mobile-only { display: block; }
      @media (max-width: 1023px) {
        .mobile-back-btn {
          display: flex !important;
        }
      }
      @media (min-width: 1024px) {
        .navbar-container {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            padding: 0 2rem;
        }
        .navbar-left { justify-content: flex-start; }
        .navbar-right { justify-content: flex-end; margin-left: 0; }
        .desktop-nav { display: flex !important; gap: 2.5rem; justify-content: center; }
        .desktop-auth { display: flex !important; }
        .mobile-menu-btn, .mobile-only { display: none !important; }
      }
    `}</style>
    </>
  );
}

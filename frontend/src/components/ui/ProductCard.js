import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import Button from './Button';
import { Heart, ShoppingBag } from 'lucide-react';
import { CartContext } from '../../context/CartContext';
import { WishlistContext } from '../../context/WishlistContext';
import { ToastContext } from '../../context/ToastContext';
import { auth } from '../../firebase';

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useContext(WishlistContext);
  const { showToast } = useContext(ToastContext);
  const navigate = useNavigate();

  const imageUrl = (product.images && product.images.length > 0) 
    ? product.images[0] 
    : 'https://via.placeholder.com/300x250?text=No+Image';

  const handleAddCart = (e) => {
    e.preventDefault();
    if (!auth.currentUser) return navigate('/login');
    addToCart(product);
    showToast(`${product.name} added to cart!`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!auth.currentUser) return navigate('/login');
    toggleWishlist(product);
    showToast(`Wishlist updated!`);
  };

  return (
    <div className="card flex-col premium-card-hover" style={{ position: 'relative', overflow: 'hidden' }}>
      <button 
        onClick={handleWishlist} 
        style={{ 
          position: 'absolute', top: '15px', right: '15px', zIndex: 10, background: 'rgba(255,255,255,0.9)', 
          backdropFilter: 'blur(4px)', border: 'none', borderRadius: '50%', padding: '0.6rem', cursor: 'pointer',
          boxShadow: 'var(--shadow-sm)', transition: 'var(--transition-fast)'
        }}
        className="wishlist-btn"
      >
        <Heart size={20} color="var(--color-primary)" fill={isInWishlist(product.id) ? 'var(--color-primary)' : 'none'} />
      </button>

      <Link to={`/product/${product.id}`} style={{ display: 'block', aspectRatio: '1/1', backgroundColor: '#fdfcf8', overflow: 'hidden' }}>
        <img 
          src={imageUrl} 
          alt={product.name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }} 
          className="card-img-zoom" 
        />
      </Link>
      
      <div className="flex-col" style={{ padding: '1rem 1.25rem', flex: 1, justifyContent: 'space-between' }}>
        <div style={{ padding: 'clamp(1rem, 2vw, 1.5rem)', paddingBottom: '0.5rem' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.4rem', fontFamily: 'var(--font-heading)', lineHeight: '1.2' }} className="mobile-text-sm">
            <Link to={`/product/${product.id}`} style={{ color: 'var(--color-black)' }}>
              {product.name}
            </Link>
          </h3>
        </div>
        
        <div className="flex items-center justify-between" style={{ marginTop: 'auto', gap: '0.5rem', flexWrap: 'wrap', padding: '0 1rem 1rem' }}>
          <div className="flex items-center gap-1">
            <span style={{ fontWeight: '400', fontSize: '1.2rem', color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span style={{ fontSize: '0.9rem', color: '#777', textDecoration: 'line-through', fontWeight: '500' }}>₹{product.originalPrice}</span>
            )}
          </div>
          <Button onClick={handleAddCart} variant="primary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', borderRadius: '50px', fontWeight: '700' }} className="mobile-btn-sm">
            ADD
          </Button>
        </div>
      </div>
      
      {/* Discount Badge */}
      {product.originalPrice > product.price && (
        <div style={{
          position: 'absolute', top: '15px', left: '15px', zIndex: 10, backgroundColor: 'var(--color-primary)',
          color: 'white', padding: '0.4rem 0.8rem', borderRadius: '50px', fontSize: '0.7rem', fontWeight: '800',
          boxShadow: 'var(--shadow-sm)', letterSpacing: '1px'
        }}>
          {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
        </div>
      )}
      
      <style>{`
        .premium-card-hover:hover .card-img-zoom {
           transform: scale(1.1);
        }
        @media (max-width: 480px) {
          .mobile-text-sm { font-size: 0.9rem !important; }
          .mobile-btn-sm { padding: 0.4rem 0.8rem !important; font-size: 0.7rem !important; }
        }
      `}</style>
    </div>
  );
}

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
      
      <div className="flex-col" style={{ padding: '1.25rem 1.5rem', flex: 1, justifyContent: 'space-between' }}>
        <div style={{ marginBottom: '1rem' }}>
          <p style={{ color: 'var(--color-primary)', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem', opacity: 0.8 }}>{product.category}</p>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)', lineHeight: '1.3' }}>
            <Link to={`/product/${product.id}`} style={{ color: 'var(--color-black)' }}>
              {product.name}
            </Link>
          </h3>
        </div>
        
        <div className="flex items-center justify-between" style={{ marginTop: 'auto', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="flex items-center gap-2">
            <span style={{ fontWeight: '400', fontSize: '1.4rem', color: 'var(--color-primary)', fontFamily: 'var(--font-heading)' }}>₹{product.price}</span>
            {product.originalPrice > product.price && (
              <span style={{ fontSize: '1.1rem', color: '#777', textDecoration: 'line-through', fontWeight: '500' }}>₹{product.originalPrice}</span>
            )}
          </div>
          <Button onClick={handleAddCart} variant="primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.8rem', borderRadius: '50px', fontWeight: '700' }}>
            ADD TO BAG
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
        .wishlist-btn:hover {
           background: white !important;
           transform: scale(1.1);
        }
      `}</style>
    </div>
  );
}
